"use client";

import { useEffect, useMemo, useState } from "react";
import type { Product } from "@/lib/catalog";
import { ProductCard } from "@/components/ProductCard";

type LiveProductGridProps = {
  products?: Product[];
  categoryId?: string;
  className?: string;
  limit?: number;
};

type ProductsResponse = {
  products?: Product[];
};

export function LiveProductGrid({ products = [], categoryId, className = "grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4", limit }: LiveProductGridProps) {
  const [liveProducts, setLiveProducts] = useState<Product[]>([]);

  useEffect(() => {
    const url = categoryId ? `/api/products?category=${encodeURIComponent(categoryId)}` : "/api/products";
    fetch(url)
      .then(async (response) => (response.ok ? ((await response.json()) as ProductsResponse) : { products: [] }))
      .then((data) => setLiveProducts(data.products ?? []))
      .catch(() => setLiveProducts([]));
  }, [categoryId]);

  const combinedProducts = useMemo(() => {
    const ids = new Set(products.map((product) => product.id));
    const combined = [...liveProducts.filter((product) => !ids.has(product.id)), ...products];
    return typeof limit === "number" ? combined.slice(0, limit) : combined;
  }, [liveProducts, products, limit]);

  return (
    <div className={className}>
      {combinedProducts.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
