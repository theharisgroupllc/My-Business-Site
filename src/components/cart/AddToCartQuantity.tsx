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
    "inline-flex h-8 min-w-[1.75rem] items-center justify-center rounded-md border border-slate-300 bg-white text-xs font-semibold text-slate-800 shadow-sm transition hover:border-brand-teal hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 sm:h-9 sm:min-w-[2.25rem] sm:text-sm";

  const outerBase =
    "flex w-full flex-col gap-2 rounded-md border border-slate-200 bg-slate-50 px-2 py-1.5 sm:flex-row sm:items-center sm:justify-between";
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
          className="flex h-9 w-full items-center justify-center rounded-md bg-brand-teal px-3 text-sm font-semibold text-white transition hover:bg-teal-700 sm:h-9"
          onClick={() => setItemQuantity(productId, 1)}
        >
          Add to Cart
        </button>
      ) : (
        <>
          {/* Left compact box: "Added" */}
          <div className="flex h-8 w-full items-center justify-center rounded-md bg-brand-teal px-3 text-sm font-semibold text-white transition-all sm:h-9 sm:w-auto sm:flex-shrink-0">
            Added
          </div>

          {/* Right box: quantity controls */}
          <div className="flex w-full min-w-0 items-center justify-center sm:flex-1">
            <div className="flex w-full items-center justify-between gap-2 rounded-md border border-slate-200 bg-white px-2 py-1">
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

              <span className="min-w-[1.75rem] text-center text-xs font-semibold tabular-nums text-brand-navy sm:min-w-[2rem] sm:text-sm">
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
