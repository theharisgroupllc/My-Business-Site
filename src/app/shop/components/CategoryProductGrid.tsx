"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Product, categories as allCategories, productFromAdminRow, products as allProducts } from "@/lib/catalog";
import { ProductCard } from "@/components/ProductCard";
import { CategoryFilters } from "./CategoryFilters";
import type { PricePreset } from "./priceFilterUtils";
import { appendPriceSearchParams, appendRatingSearchParams, productPassesPriceFilter } from "./priceFilterUtils";

type CategoryProductGridProps = {
  products?: Product[];
  categoryId?: string;
};

type ProductsResponse = {
  products?: Array<Record<string, unknown>>;
};

export function CategoryProductGrid({ products: _products, categoryId: _categoryId }: CategoryProductGridProps) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [pricePreset, setPricePreset] = useState<PricePreset>("all");
  const [priceMinInput, setPriceMinInput] = useState("");
  const [priceMaxInput, setPriceMaxInput] = useState("");
  const [selectedRating, setSelectedRating] = useState("0");
  const [liveProducts, setLiveProducts] = useState<Product[]>([]);

  const fetchLiveProducts = useCallback(() => {
    const params = new URLSearchParams();
    if (selectedCategory !== "all") params.set("category", selectedCategory);
    appendPriceSearchParams(params, pricePreset, priceMinInput, priceMaxInput);
    appendRatingSearchParams(params, selectedRating);
    const qs = params.toString();
    const url = qs ? `/api/products?${qs}` : "/api/products";
    fetch(url)
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
              rating: row.rating as number | string | undefined,
            }),
          ),
        );
      })
      .catch(() => setLiveProducts([]));
  }, [selectedCategory, pricePreset, priceMinInput, priceMaxInput, selectedRating]);

  useEffect(() => {
    fetchLiveProducts();
  }, [fetchLiveProducts]);

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

  const filteredProducts = useMemo(() => {
    return categoryScopedProducts.filter((item) => {
      const minRating = Number(selectedRating);
      const passesRating = !Number.isFinite(minRating) || minRating <= 0 ? true : item.rating >= minRating;
      const passesPrice = productPassesPriceFilter(item.price, pricePreset, priceMinInput, priceMaxInput);
      return passesRating && passesPrice;
    });
  }, [categoryScopedProducts, selectedRating, pricePreset, priceMinInput, priceMaxInput]);

  const handleApplyCustomPriceRange = () => {
    setPricePreset("custom");
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="mx-auto w-full max-w-2xl lg:max-w-3xl">
        <CategoryFilters
          selectedCategory={selectedCategory}
          categories={allCategories}
          selectedRating={selectedRating}
          pricePreset={pricePreset}
          priceMinInput={priceMinInput}
          priceMaxInput={priceMaxInput}
          onCategoryChange={setSelectedCategory}
          onPricePresetChange={setPricePreset}
          onPriceMinInputChange={setPriceMinInput}
          onPriceMaxInputChange={setPriceMaxInput}
          onApplyCustomPriceRange={handleApplyCustomPriceRange}
          onRatingChange={setSelectedRating}
        />
      </div>

      <div className="min-w-0 w-full">
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
