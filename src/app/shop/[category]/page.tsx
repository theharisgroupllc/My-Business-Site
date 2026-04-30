import type { Metadata } from "next";
import { categories } from "@/lib/catalog";
import { CategoryPageClient } from "./CategoryPageClient";

type CategoryPageProps = {
  params: { category?: string | string[] };
};

export function generateStaticParams() {
  return categories.map((category) => ({ category: category.id }));
}

export function generateMetadata(): Metadata {
  // Keep it simple and avoid server-side category parsing issues during static export.
  return { title: "Shop | Everon Global Trades LLC" };
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const raw = Array.isArray(params?.category) ? params?.category?.[0] ?? "" : params?.category ?? "";
  return <CategoryPageClient serverCategory={raw} />;
}
