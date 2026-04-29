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
      <button
        type="button"
        disabled={!canAdd}
        className={`flex h-9 w-full items-center justify-center rounded-md px-3 text-sm font-semibold transition ${
          quantity > 0 ? "bg-emerald-600 text-white" : "bg-brand-teal text-white hover:bg-teal-700"
        } disabled:cursor-not-allowed disabled:opacity-90`}
        onClick={() => {
          if (quantity > 0 || !canAdd) return;
          setItemQuantity(productId, 1);
        }}
      >
        {quantity > 0 ? "Added" : "Add to Cart"}
      </button>
    </div>
  );
}
