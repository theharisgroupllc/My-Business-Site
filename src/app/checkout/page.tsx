"use client";

import Image from "next/image";
import { useCart } from "@/components/cart/CartContext";

const assetBasePath = process.env.NODE_ENV === "production" ? "/My-Business-Site" : "";

export default function CheckoutPage() {
  const { detailedItems, subtotal, clearCart } = useCart();
  const shipping = detailedItems.length > 0 ? 9.99 : 0;
  const tax = Number((subtotal * 0.07).toFixed(2));
  const total = Number((subtotal + shipping + tax).toFixed(2));

  return (
    <div className="mx-auto mt-10 max-w-7xl px-4 md:px-6">
      <h1 className="text-3xl font-bold text-brand-navy">Secure Checkout</h1>
      <p className="mt-2 text-sm text-slate-600">SSL encrypted checkout powered by trusted payment partners.</p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
        <form className="space-y-6 rounded-xl border border-slate-200 p-6">
          <section>
            <h2 className="text-lg font-semibold text-brand-navy">Shipping Details</h2>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <input className="rounded-md border border-slate-300 px-3 py-2 text-sm" placeholder="First name" />
              <input className="rounded-md border border-slate-300 px-3 py-2 text-sm" placeholder="Last name" />
              <input className="rounded-md border border-slate-300 px-3 py-2 text-sm sm:col-span-2" placeholder="Street address" />
              <input className="rounded-md border border-slate-300 px-3 py-2 text-sm" placeholder="City" />
              <input className="rounded-md border border-slate-300 px-3 py-2 text-sm" placeholder="State" />
              <input className="rounded-md border border-slate-300 px-3 py-2 text-sm" placeholder="ZIP code" />
              <input className="rounded-md border border-slate-300 px-3 py-2 text-sm" placeholder="Phone number" />
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

          <button
            type="button"
            className="rounded-md bg-brand-navy px-6 py-3 text-sm font-semibold text-white hover:bg-brand-slate"
            onClick={() => {
              if (detailedItems.length > 0) {
                clearCart();
                window.alert("Order placed successfully. Thank you for shopping with Everon Global Trades LLC.");
              }
            }}
          >
            Place Order
          </button>
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
            <Image src={`${assetBasePath}/assets/payment-visa.svg`} alt="Visa" width={72} height={24} />
            <Image src={`${assetBasePath}/assets/payment-mastercard.svg`} alt="MasterCard" width={72} height={24} />
            <Image src={`${assetBasePath}/assets/payment-paypal.svg`} alt="PayPal" width={72} height={24} />
          </div>
        </aside>
      </div>
    </div>
  );
}
