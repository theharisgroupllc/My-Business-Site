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
  const canAdd = quantity <= 0 || quantity < cap;

  const outerBase = "flex w-full rounded-md border border-slate-200 bg-slate-50 px-2 py-1.5";
  const outerClassName = [outerBase, className].filter(Boolean).join(" ");

  return (
    <div className={outerClassName}>
      {quantity > 0 ? (
        <div className="flex w-full items-center gap-2">
          <button
            type="button"
            className="flex h-9 flex-1 items-center justify-center rounded-md bg-brand-teal px-3 text-sm font-semibold text-white"
            onClick={() => {
              // Keep action intentionally inert in Added state.
            }}
          >
            Added
          </button>
          <button
            type="button"
            aria-label="Remove from cart"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-red-300 bg-white text-red-700 transition hover:border-red-500 hover:bg-red-50"
            onClick={() => setItemQuantity(productId, 0)}
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.2} aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 3h6m2 0H7m10 0l-1 14H8L7 3m5 6v8m4-8v8" />
            </svg>
          </button>
        </div>
      ) : (
        <button
          type="button"
          disabled={!canAdd}
          className="flex h-9 w-full items-center justify-center rounded-md bg-brand-teal px-3 text-sm font-semibold text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-90"
          onClick={() => {
            if (!canAdd) return;
            setItemQuantity(productId, 1);
          }}
        >
          Add to Cart
        </button>
      )}
    </div>
  );
}
