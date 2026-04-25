"use client";

import { useMemo, useState } from "react";
import { Product, categories as allCategories, products as allProducts } from "@/lib/catalog";
import { ProductCard } from "@/components/ProductCard";
import { CategoryFilters } from "./CategoryFilters";

type CategoryProductGridProps = {
  products: Product[];
  categoryId: string;
};

export function CategoryProductGrid({ products, categoryId }: CategoryProductGridProps) {
  const [selectedCategory, setSelectedCategory] = useState(categoryId);
  const [selectedPrice, setSelectedPrice] = useState("all");
  const [selectedRating, setSelectedRating] = useState("0");

  const categoryScopedProducts = selectedCategory === categoryId ? products : allProducts.filter((item) => item.categoryId === selectedCategory);

  const minPrice = Math.floor(Math.min(...categoryScopedProducts.map((item) => item.price)));
  const maxPrice = Math.ceil(Math.max(...categoryScopedProducts.map((item) => item.price)));
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
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
