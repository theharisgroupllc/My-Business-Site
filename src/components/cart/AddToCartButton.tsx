"use client";

import { useState } from "react";
import { useCart } from "./CartContext";

type AddToCartButtonProps = {
  productId: string;
  className?: string;
};

export function AddToCartButton({ productId, className }: AddToCartButtonProps) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  return (
    <button
      onClick={() => {
        addItem(productId);
        setAdded(true);
        setTimeout(() => setAdded(false), 1200);
      }}
      className={className ?? "w-full rounded-md bg-brand-navy px-3 py-2 text-sm font-medium text-white hover:bg-brand-slate"}
    >
      {added ? "Added" : "Add to Cart"}
    </button>
  );
}
