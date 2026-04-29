"use client";

import { useEffect, useState } from "react";
import type { Product } from "@/lib/catalog";
import { products } from "@/lib/catalog";
import { ProductCard } from "@/components/ProductCard";
import { LiveProductGrid } from "@/components/LiveProductGrid";

const fallbackTemplates = products.slice(0, 8);

export function HomeBestSellersSection() {
  const [templateProducts, setTemplateProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/home/best-sellers")
      .then(async (res) => {
        if (!res.ok) throw new Error("bad");
        return res.json() as Promise<{ products?: Product[] }>;
      })
      .then((data) => {
        if (!cancelled && data.products?.length) setTemplateProducts(data.products);
        else if (!cancelled) setTemplateProducts(fallbackTemplates);
      })
      .catch(() => {
        if (!cancelled) setTemplateProducts(fallbackTemplates);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading && templateProducts.length === 0) {
    return (
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="aspect-[4/3] animate-pulse rounded-xl bg-slate-200" />
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {templateProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      <LiveProductGrid className="mt-3 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4" limit={8} />
    </>
  );
}
