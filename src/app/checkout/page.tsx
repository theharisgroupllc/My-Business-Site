"use client";

import Image from "next/image";
import { useState } from "react";
import { useCart } from "@/components/cart/CartContext";

export default function CheckoutPage() {
  const { detailedItems, subtotal, clearCart } = useCart();
  const [status, setStatus] = useState("");
  const shipping = detailedItems.length > 0 ? 9.99 : 0;
  const tax = Number((subtotal * 0.07).toFixed(2));
  const total = Number((subtotal + shipping + tax).toFixed(2));

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
            setStatus("Creating secure order record...");
            try {
              const response = await fetch("/api/orders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  customer: {
                    firstName: formData.get("firstName"),
                    lastName: formData.get("lastName"),
                    address: formData.get("address"),
                    city: formData.get("city"),
                    state: formData.get("state"),
                    postalCode: formData.get("postalCode"),
                    phone: formData.get("phone"),
                  },
                  items: detailedItems.map((item) => ({
                    productId: item.product.id,
                    name: item.product.name,
                    quantity: item.quantity,
                    price: item.product.price,
                    lineTotal: item.lineTotal,
                  })),
                  subtotal,
                  shipping,
                  tax,
                  total,
                }),
              });
              if (!response.ok) {
                throw new Error("Order API unavailable");
              }
              clearCart();
              setStatus("Order record created. Live card payments will activate after Stripe or PayPal credentials are connected.");
            } catch {
              setStatus("Order backend is being prepared. No payment was charged.");
            }
          }}
        >
          <section>
            <h2 className="text-lg font-semibold text-brand-navy">Shipping Details</h2>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
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
            <div className="flex justify-between"><span>Subtotal</span><span>${subtotal}</span></div>
            <div className="flex justify-between"><span>Shipping</span><span>${shipping}</span></div>
            <div className="flex justify-between"><span>Tax</span><span>${tax}</span></div>
            <div className="flex justify-between text-base font-semibold text-brand-navy"><span>Total</span><span>${total}</span></div>
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
