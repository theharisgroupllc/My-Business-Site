"use client";

import { useEffect, useMemo, useState } from "react";
import type { Product } from "@/lib/catalog";
import { productFromAdminRow } from "@/lib/catalog";
import { ProductCard } from "@/components/ProductCard";

type LiveProductGridProps = {
  products?: Product[];
  categoryId?: string;
  className?: string;
  limit?: number;
};

type ProductsResponse = {
  products?: Array<Record<string, unknown>>;
};

export function LiveProductGrid({ products = [], categoryId, className = "grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4", limit }: LiveProductGridProps) {
  const [liveProducts, setLiveProducts] = useState<Product[]>([]);

  useEffect(() => {
    const url = categoryId ? `/api/products?category=${encodeURIComponent(categoryId)}` : "/api/products";
    fetch(url)
      .then(async (response) => (response.ok ? ((await response.json()) as ProductsResponse) : { products: [] }))
      .then((data) => {
        const rows = data.products ?? [];
        setLiveProducts(rows.map((row) => productFromAdminRow({
          id: String(row.id),
          slug: row.slug != null ? String(row.slug) : undefined,
          name: String(row.name ?? "Product"),
          category_id: String(row.category_id ?? row.categoryId ?? ""),
          price: row.price as number | string,
          inventory: row.inventory as number | string | undefined,
          description: row.description != null ? String(row.description) : undefined,
          image_url: row.image_url != null ? String(row.image_url) : undefined,
          gallery_json: row.gallery_json != null ? String(row.gallery_json) : undefined,
        })));
      })
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
