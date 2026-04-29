"use client";

import { useEffect, useMemo, useState } from "react";
import { Product, categories as allCategories, productFromAdminRow, products as allProducts } from "@/lib/catalog";
import { ProductCard } from "@/components/ProductCard";
import { CategoryFilters } from "./CategoryFilters";

type CategoryProductGridProps = {
  products?: Product[];
  categoryId?: string;
};

type ProductsResponse = {
  products?: Array<Record<string, unknown>>;
};

export function CategoryProductGrid({ products: _products, categoryId: _categoryId }: CategoryProductGridProps) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPrice, setSelectedPrice] = useState("all");
  const [selectedRating, setSelectedRating] = useState("0");
  const [liveProducts, setLiveProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch("/api/products")
      .then(async (response) => (response.ok ? ((await response.json()) as ProductsResponse) : { products: [] }))
      .then((data) => {
        const rows = data.products ?? [];
        setLiveProducts(
          rows.map((row) =>
            productFromAdminRow({
              id: String(row.id),
              slug: row.slug != null ? String(row.slug) : undefined,
              name: String(row.name ?? "Product"),
              category_id: String(row.category_id ?? row.categoryId ?? ""),
              price: row.price as number | string,
              inventory: row.inventory as number | string | undefined,
              description: row.description != null ? String(row.description) : undefined,
              image_url: row.image_url != null ? String(row.image_url) : undefined,
              gallery_json: row.gallery_json != null ? String(row.gallery_json) : undefined,
            }),
          ),
        );
      })
      .catch(() => setLiveProducts([]));
  }, []);

  const allCombinedProducts = useMemo(() => {
    const merged = [...liveProducts];
    const liveIds = new Set(liveProducts.map((lp) => lp.id));
    for (const sp of allProducts) {
      if (!liveIds.has(sp.id)) merged.push(sp);
    }
    return merged;
  }, [liveProducts]);

  const categoryScopedProducts = useMemo(
    () => (selectedCategory === "all" ? allCombinedProducts : allCombinedProducts.filter((item) => item.categoryId === selectedCategory)),
    [selectedCategory, allCombinedProducts],
  );

  const minPrice = categoryScopedProducts.length > 0 ? Math.floor(Math.min(...categoryScopedProducts.map((item) => item.price))) : 0;
  const maxPrice = categoryScopedProducts.length > 0 ? Math.ceil(Math.max(...categoryScopedProducts.map((item) => item.price))) : 0;
  const midPrice = (minPrice + maxPrice) / 2;

  const filteredProducts = useMemo(() => {
    return categoryScopedProducts.filter((item) => {
      const passesRating = item.rating >= Number(selectedRating);
      const passesPrice =
        selectedPrice === "all" ||
        (selectedPrice === "budget" && item.price <= midPrice) ||
        (selectedPrice === "premium" && item.price >= midPrice);
      return passesRating && passesPrice;
    });
  }, [categoryScopedProducts, selectedPrice, selectedRating, midPrice]);

  return (
    <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
      <CategoryFilters
        selectedCategory={selectedCategory}
        categories={allCategories}
        minPrice={minPrice}
        maxPrice={maxPrice}
        selectedPrice={selectedPrice}
        selectedRating={selectedRating}
        onCategoryChange={setSelectedCategory}
        onPriceChange={setSelectedPrice}
        onRatingChange={setSelectedRating}
      />

      <div>
        <p className="mb-4 text-sm text-slate-600">{filteredProducts.length} products found</p>
        <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-3">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
