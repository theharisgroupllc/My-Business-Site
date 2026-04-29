"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/components/cart/CartContext";

export default function CartPage() {
  const { detailedItems, subtotal, setItemQuantity, removeItem } = useCart();
  const shipping = detailedItems.length > 0 ? 9.99 : 0;
  const total = Number((subtotal + shipping).toFixed(2));

  return (
    <div className="mx-auto mt-10 max-w-7xl px-4 md:px-6">
      <h1 className="text-3xl font-bold text-brand-navy">Shopping Cart</h1>

      {detailedItems.length === 0 ? (
        <div className="mt-6 rounded-xl border border-slate-200 p-8 text-center">
          <p className="text-sm text-slate-600">Your cart is currently empty.</p>
          <Link href="/shop/" className="mt-4 inline-block rounded-md bg-brand-navy px-5 py-2 text-sm font-semibold text-white">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_350px]">
          <div className="space-y-4">
            {detailedItems.map((item) => (
              <article key={item.product.id} className="grid gap-4 rounded-xl border border-slate-200 p-4 sm:grid-cols-[100px_1fr_auto] sm:items-center">
                {item.product.imageUrl?.startsWith("data:") ? (
                  <img src={item.product.imageUrl} alt={item.product.name} className="h-24 w-24 rounded-lg object-cover" />
                ) : (
                  <Image
                    src={item.product.imageUrl ?? `https://picsum.photos/seed/${item.product.imageSeed}/220/220`}
                    alt={item.product.name}
                    width={100}
                    height={100}
                    className="h-24 w-24 rounded-lg object-cover"
                  />
                )}
                <div>
                  <h2 className="text-sm font-semibold text-brand-navy">{item.product.name}</h2>
                  <p className="mt-1 text-sm text-slate-600">${item.product.price} each</p>
                  <button className="mt-2 text-xs text-red-600 hover:underline" onClick={() => removeItem(item.product.id)}>
                    Remove
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  {item.quantity === 1 ? (
                    <button
                      type="button"
                      aria-label="Remove from cart"
                      className="rounded border border-red-300 px-2 py-1 text-sm text-red-700 hover:border-red-500 hover:bg-red-50"
                      onClick={() => setItemQuantity(item.product.id, 0)}
                    >
                      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.2} aria-hidden>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 3h6m2 0H7m10 0l-1 14H8L7 3m5 6v8m4-8v8" />
                      </svg>
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="rounded border border-slate-300 px-2 py-1 text-sm"
                      onClick={() => setItemQuantity(item.product.id, item.quantity - 1)}
                    >
                      −
                    </button>
                  )}
                  <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                  <button
                    type="button"
                    className="rounded border border-slate-300 px-2 py-1 text-sm disabled:opacity-40"
                    disabled={item.product.inventory != null && item.quantity >= item.product.inventory}
                    onClick={() => setItemQuantity(item.product.id, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>
              </article>
            ))}
          </div>

          <aside className="h-fit rounded-xl border border-slate-200 p-5">
            <h2 className="text-lg font-semibold text-brand-navy">Order Summary</h2>
            <div className="mt-4 space-y-2 text-sm text-slate-700">
              <div className="flex items-center justify-between">
                <span>Subtotal</span>
                <span>${subtotal}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Shipping</span>
                <span>${shipping}</span>
              </div>
              <div className="flex items-center justify-between border-t border-slate-200 pt-2 text-base font-semibold text-brand-navy">
                <span>Total</span>
                <span>${total}</span>
              </div>
            </div>
            <Link
              href="/checkout/"
              className="mt-5 block origin-center rounded-md bg-brand-teal px-4 py-3 text-center text-sm font-semibold text-white transition-transform duration-150 ease-out hover:scale-[1.06] hover:bg-teal-700"
            >
              Proceed to Checkout
            </Link>
          </aside>
        </div>
      )}
    </div>
  );
}
