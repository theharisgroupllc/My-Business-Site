"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { categories, products } from "@/lib/catalog";

const searchableProducts = products.map((product) => {
  const category = categories.find((item) => item.id === product.categoryId);
  return {
    ...product,
    categoryName: category?.name ?? "",
    searchText: `${product.name} ${product.description} ${category?.name ?? ""}`.toLowerCase(),
  };
});

export function HeaderSearch() {
  const [query, setQuery] = useState("");
  const trimmedQuery = query.trim().toLowerCase();

  const results = useMemo(() => {
    if (trimmedQuery.length < 2) {
      return [];
    }
    return searchableProducts.filter((product) => product.searchText.includes(trimmedQuery)).slice(0, 6);
  }, [trimmedQuery]);

  return (
    <div className="group relative col-span-2 min-w-0 sm:w-48 md:w-56">
      <label htmlFor="site-product-search" className="sr-only">
        Search products
      </label>
      <input
        id="site-product-search"
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search products..."
        className="w-full min-w-0 rounded-md border border-slate-300 bg-white py-2 pl-3 pr-10 text-sm outline-none ring-brand-teal transition focus:ring group-hover:scale-[1.02] group-hover:border-slate-200 group-hover:bg-slate-100 group-hover:text-brand-teal"
        autoComplete="off"
      />
      <svg
        viewBox="0 0 24 24"
        className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 fill-none stroke-slate-400 stroke-2 transition-colors group-hover:stroke-brand-teal"
        aria-hidden="true"
      >
        <path d="m21 21-4.3-4.3" strokeLinecap="round" />
        <circle cx="11" cy="11" r="7" />
      </svg>
      {trimmedQuery.length >= 2 && (
        <div className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-50 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
          {results.length > 0 ? (
            <div className="max-h-80 overflow-y-auto py-2">
              {results.map((product) => (
                <Link
                  key={product.id}
                  href={`/product/${product.slug}`}
                  className="block px-3 py-2 text-left hover:bg-slate-50"
                  onClick={() => setQuery("")}
                >
                  <span className="line-clamp-1 text-sm font-semibold text-brand-navy">{product.name}</span>
                  <span className="mt-0.5 flex items-center justify-between gap-2 text-xs text-slate-500">
                    <span className="line-clamp-1">{product.categoryName}</span>
                    <span className="font-semibold text-brand-teal">${product.price}</span>
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <p className="px-3 py-3 text-sm text-slate-500">No products found.</p>
          )}
        </div>
      )}
    </div>
  );
}
