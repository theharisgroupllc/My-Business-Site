import Link from "next/link";
import type { Metadata } from "next";
import { categories } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Shop | Everon Global Trades LLC",
  description: "Browse product categories from Everon Global Trades LLC.",
};

export default function ShopPage() {
  return (
    <div className="mx-auto mt-10 max-w-7xl px-4 md:px-6">
      <h1 className="text-3xl font-bold text-brand-navy">Shop Categories</h1>
      <p className="mt-3 text-sm text-slate-600">Select a category to explore professionally sourced products.</p>
      <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
        {categories.map((category) => (
          <Link key={category.id} href={`/shop/${category.id}/`} className="rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md">
            <h2 className="text-base font-semibold text-brand-navy">{category.name}</h2>
            <p className="mt-2 text-sm text-slate-600">{category.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
