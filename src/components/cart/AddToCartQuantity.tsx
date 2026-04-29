"use client";

import { useMemo } from "react";
import { useCart } from "./CartContext";

type AddToCartQuantityProps = {
  productId: string;
  className?: string;
  /** Max selectable when known (D1 inventory); omit for catalog-only products. */
  maxQuantity?: number;
};

export function AddToCartQuantity({ productId, className, maxQuantity }: AddToCartQuantityProps) {
  const { items, setItemQuantity } = useCart();
  const quantity = useMemo(() => items.find((i) => i.productId === productId)?.quantity ?? 0, [items, productId]);

  const cap = maxQuantity != null && Number.isFinite(maxQuantity) && maxQuantity > 0 ? Math.floor(maxQuantity) : 999;

  const baseBtn =
    "inline-flex h-9 min-w-[2.25rem] items-center justify-center rounded-md border border-slate-300 bg-white text-sm font-semibold text-slate-800 shadow-sm transition hover:border-brand-teal hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40";

  const outerBase =
    "flex w-full items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-2 py-1.5";
  const outerClassName = [outerBase, className].filter(Boolean).join(" ");

  const iconTrash = (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.2} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 3h6m2 0H7m10 0l-1 14H8L7 3m5 6v8m4-8v8" />
    </svg>
  );

  return (
    <div className={outerClassName}>
      {quantity <= 0 ? (
        <button
          type="button"
          className="flex h-9 w-full items-center justify-center rounded-md bg-brand-teal px-3 text-sm font-semibold text-white transition hover:bg-teal-700"
          onClick={() => setItemQuantity(productId, 1)}
        >
          Add to Cart
        </button>
      ) : (
        <>
          {/* Left compact box: "Added" */}
          <div className="flex h-9 flex-shrink-0 items-center justify-center rounded-md bg-brand-teal px-3 text-sm font-semibold text-white transition-all">
            Added
          </div>

          {/* Right box: quantity controls */}
          <div className="flex min-w-0 flex-1 items-center justify-center">
            <div className="flex w-full max-w-[12rem] items-center justify-between gap-2 rounded-md border border-slate-200 bg-white px-2 py-1">
              {quantity === 1 ? (
                <button
                  type="button"
                  aria-label="Remove from cart"
                  className={`${baseBtn} border-red-300 text-red-700 hover:border-red-500 hover:bg-red-50`}
                  onClick={() => setItemQuantity(productId, 0)}
                >
                  {iconTrash}
                </button>
              ) : (
                <button
                  type="button"
                  aria-label="Decrease quantity"
                  className={baseBtn}
                  disabled={quantity <= 0}
                  onClick={() => setItemQuantity(productId, quantity - 1)}
                >
                  −
                </button>
              )}

              <span className="min-w-[2rem] text-center text-sm font-semibold tabular-nums text-brand-navy">
                {quantity}
              </span>

              <button
                type="button"
                aria-label="Increase quantity"
                className={baseBtn}
                disabled={quantity >= cap}
                onClick={() => setItemQuantity(productId, quantity + 1)}
              >
                +
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
