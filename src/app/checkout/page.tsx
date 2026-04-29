"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useCart } from "@/components/cart/CartContext";

type PreviewResponse = {
  merchandiseSubtotal: number;
  discountCode: string | null;
  discountAmount: number;
  taxableSubtotal: number;
  shipping: number;
  tax: number;
  total: number;
};

export default function CheckoutPage() {
  const { detailedItems, subtotal, clearCart } = useCart();
  const [status, setStatus] = useState("");
  const [lastOrderId, setLastOrderId] = useState<string | null>(null);
  const [discountInput, setDiscountInput] = useState("");
  const [appliedDiscountCode, setAppliedDiscountCode] = useState("");
  const [preview, setPreview] = useState<PreviewResponse | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState("");

  const clientShipping = detailedItems.length > 0 ? 9.99 : 0;
  const clientTax = Number((subtotal * 0.07).toFixed(2));
  const clientTotal = Number((subtotal + clientShipping + clientTax).toFixed(2));

  const orderItemsPayload = useMemo(
    () =>
      detailedItems.map((item) => ({
        productId: item.product.id,
        name: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
        lineTotal: item.lineTotal,
      })),
    [detailedItems],
  );

  const fetchPreview = useCallback(
    async (code: string) => {
      if (detailedItems.length === 0) {
        setPreview(null);
        setPreviewError("");
        return;
      }
      setPreviewLoading(true);
      setPreviewError("");
      try {
        const response = await fetch("/api/checkout/preview", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items: orderItemsPayload,
            discountCode: code.trim() || undefined,
          }),
        });
        const data = (await response.json()) as PreviewResponse & { error?: string };
        if (!response.ok) {
          setPreview(null);
          setPreviewError(data.error ?? "Could not apply discount.");
          return;
        }
        setPreview({
          merchandiseSubtotal: data.merchandiseSubtotal,
          discountCode: data.discountCode,
          discountAmount: data.discountAmount,
          taxableSubtotal: data.taxableSubtotal,
          shipping: data.shipping,
          tax: data.tax,
          total: data.total,
        });
      } catch {
        setPreview(null);
        setPreviewError("Network error while calculating totals.");
      } finally {
        setPreviewLoading(false);
      }
    },
    [detailedItems.length, orderItemsPayload],
  );

  useEffect(() => {
    if (detailedItems.length === 0) {
      setPreview(null);
      setPreviewError("");
      return;
    }
    void fetchPreview(appliedDiscountCode);
  }, [detailedItems.length, appliedDiscountCode, fetchPreview]);

  const display = preview
    ? {
        sub: preview.merchandiseSubtotal,
        discount: preview.discountAmount,
        afterDiscount: preview.taxableSubtotal,
        ship: preview.shipping,
        tax: preview.tax,
        total: preview.total,
      }
    : {
        sub: subtotal,
        discount: 0,
        afterDiscount: subtotal,
        ship: clientShipping,
        tax: clientTax,
        total: clientTotal,
      };

  return (
    <div className="mx-auto mt-10 max-w-7xl px-4 md:px-6">
      <h1 className="text-3xl font-bold text-brand-navy">Secure Checkout</h1>
      <p className="mt-2 text-sm text-slate-600">SSL encrypted checkout powered by trusted payment partners.</p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
        <form
          className="space-y-6 rounded-xl border border-slate-200 p-6"
          onSubmit={async (event) => {
            event.preventDefault();
            if (detailedItems.length === 0) {
              setStatus("Your cart is empty.");
              return;
            }
            const formData = new FormData(event.currentTarget);
            const customerEmail = String(formData.get("email") ?? "").trim();
            if (!customerEmail) {
              setStatus("Please enter your email address.");
              return;
            }
            setLastOrderId(null);
            setStatus("Creating secure order record...");
            try {
              const response = await fetch("/api/orders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  customerEmail,
                  discountCode: appliedDiscountCode.trim() || undefined,
                  customer: {
                    email: customerEmail,
                    firstName: formData.get("firstName"),
                    lastName: formData.get("lastName"),
                    address: formData.get("address"),
                    city: formData.get("city"),
                    state: formData.get("state"),
                    postalCode: formData.get("postalCode"),
                    phone: formData.get("phone"),
                  },
                  items: orderItemsPayload,
                  subtotal,
                  shipping: clientShipping,
                  tax: clientTax,
                  total: clientTotal,
                }),
              });
              const payload = (await response.json()) as {
                id?: string;
                error?: string;
                total?: number;
                discountAmount?: number;
              };
              if (!response.ok) {
                setStatus(payload.error ?? "Unable to create order. Please try again.");
                return;
              }
              clearCart();
              setPreview(null);
              setAppliedDiscountCode("");
              setDiscountInput("");
              if (payload.id) setLastOrderId(payload.id);
              setStatus(
                "Order saved. Inventory was updated for stocked items. Save your order ID for tracking. Card payments will activate after Stripe or PayPal is connected.",
              );
            } catch {
              setStatus("Could not reach the order service. Check your connection and try again.");
            }
          }}
        >
          <section>
            <h2 className="text-lg font-semibold text-brand-navy">Shipping Details</h2>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <input
                name="email"
                type="email"
                className="rounded-md border border-slate-300 px-3 py-2 text-sm sm:col-span-2"
                placeholder="Email for order confirmation"
                required
                autoComplete="email"
              />
              <input name="firstName" className="rounded-md border border-slate-300 px-3 py-2 text-sm" placeholder="First name" required />
              <input name="lastName" className="rounded-md border border-slate-300 px-3 py-2 text-sm" placeholder="Last name" required />
              <input name="address" className="rounded-md border border-slate-300 px-3 py-2 text-sm sm:col-span-2" placeholder="Street address" required />
              <input name="city" className="rounded-md border border-slate-300 px-3 py-2 text-sm" placeholder="City" required />
              <input name="state" className="rounded-md border border-slate-300 px-3 py-2 text-sm" placeholder="State" required />
              <input name="postalCode" className="rounded-md border border-slate-300 px-3 py-2 text-sm" placeholder="ZIP code" required />
              <input name="phone" className="rounded-md border border-slate-300 px-3 py-2 text-sm" placeholder="Phone number" required />
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-brand-navy">Discount code</h2>
            <p className="mt-1 text-xs text-slate-500">Create codes in Admin → Discount Manager, then apply here. Totals update to match the server.</p>
            <div className="mt-3 flex flex-col gap-2 sm:flex-row">
              <input
                type="text"
                value={discountInput}
                onChange={(e) => setDiscountInput(e.target.value.toUpperCase())}
                placeholder="SAVE10"
                className="min-w-0 flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm uppercase"
                autoComplete="off"
              />
              <button
                type="button"
                disabled={previewLoading || detailedItems.length === 0}
                onClick={() => {
                  setAppliedDiscountCode(discountInput.trim());
                }}
                className="rounded-md border border-brand-navy px-4 py-2 text-sm font-semibold text-brand-navy hover:bg-slate-50 disabled:opacity-50"
              >
                {previewLoading ? "Applying…" : "Apply"}
              </button>
              <button
                type="button"
                disabled={previewLoading}
                onClick={() => {
                  setDiscountInput("");
                  setAppliedDiscountCode("");
                  setPreviewError("");
                  void fetchPreview("");
                }}
                className="rounded-md px-4 py-2 text-sm text-slate-600 hover:bg-slate-100"
              >
                Clear
              </button>
            </div>
            {previewError && <p className="text-sm text-red-600">{previewError}</p>}
            {appliedDiscountCode && preview && !previewError && (
              <p className="text-xs text-emerald-700">Code <strong>{appliedDiscountCode}</strong> applied.</p>
            )}
          </section>

          <section>
            <h2 className="text-lg font-semibold text-brand-navy">Payment Information</h2>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <input className="rounded-md border border-slate-300 px-3 py-2 text-sm sm:col-span-2" placeholder="Card number" />
              <input className="rounded-md border border-slate-300 px-3 py-2 text-sm" placeholder="MM/YY" />
              <input className="rounded-md border border-slate-300 px-3 py-2 text-sm" placeholder="CVC" />
              <input className="rounded-md border border-slate-300 px-3 py-2 text-sm sm:col-span-2" placeholder="Name on card" />
            </div>
          </section>

          <button type="submit" className="rounded-md bg-brand-navy px-6 py-3 text-sm font-semibold text-white hover:bg-brand-slate">
            Place Order
          </button>
          {status && <p className="text-sm text-slate-600">{status}</p>}
          {lastOrderId && (
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
              <p>
                <span className="font-semibold text-brand-navy">Order ID:</span>{" "}
                <code className="break-all text-xs">{lastOrderId}</code>
              </p>
              <p className="mt-2">
                <Link href="/track-order/" className="font-semibold text-brand-teal hover:underline">
                  Track this order
                </Link>
              </p>
            </div>
          )}
        </form>

        <aside className="h-fit rounded-xl border border-slate-200 p-5">
          <h2 className="text-lg font-semibold text-brand-navy">Order Review</h2>
          <div className="mt-4 space-y-3">
            {detailedItems.map((item) => (
              <div key={item.product.id} className="flex items-start justify-between gap-2 text-sm">
                <span className="text-slate-700">
                  {item.product.name} x {item.quantity}
                </span>
                <span className="font-medium text-brand-navy">${item.lineTotal}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 space-y-2 border-t border-slate-200 pt-4 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${display.sub.toFixed(2)}</span>
            </div>
            {display.discount > 0 && (
              <div className="flex justify-between text-emerald-700">
                <span>Discount{preview?.discountCode ? ` (${preview.discountCode})` : ""}</span>
                <span>-${display.discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-600">
              <span>After discount</span>
              <span>${display.afterDiscount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>${display.ship.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax</span>
              <span>${display.tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-base font-semibold text-brand-navy">
              <span>Total</span>
              <span>${display.total.toFixed(2)}</span>
            </div>
            {preview && <p className="pt-2 text-xs text-slate-500">Totals verified by checkout preview.</p>}
          </div>
          <div className="mt-5 flex items-center gap-2">
            <Image src="/assets/payment-visa.svg" alt="Visa" width={72} height={24} />
            <Image src="/assets/payment-mastercard.svg" alt="MasterCard" width={72} height={24} />
            <Image src="/assets/payment-paypal.svg" alt="PayPal" width={72} height={24} />
          </div>
        </aside>
      </div>
    </div>
  );
}
