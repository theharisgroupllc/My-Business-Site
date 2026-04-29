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

  return (
    <div className={className ?? "flex w-full items-center justify-between gap-2 rounded-md border border-slate-200 bg-slate-50 px-2 py-1.5"}>
      <span className="text-xs font-medium text-slate-600">Qty</span>
      <div className="flex items-center gap-1">
        <button
          type="button"
          aria-label="Decrease quantity"
          className={baseBtn}
          disabled={quantity <= 0}
          onClick={() => setItemQuantity(productId, quantity - 1)}
        >
          −
        </button>
        <span className="min-w-[2rem] text-center text-sm font-semibold tabular-nums text-brand-navy">{quantity}</span>
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
  );
}
