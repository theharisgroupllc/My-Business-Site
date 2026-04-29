import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCategoryById, getProductsByCategory, categories } from "@/lib/catalog";
import { CategoryProductGrid } from "../components/CategoryProductGrid";

type CategoryPageProps = {
  params: { category: string | string[] };
};

export function generateStaticParams() {
  return categories.map((category) => ({ category: category.id }));
}

export function generateMetadata({ params }: CategoryPageProps): Metadata {
  const raw = Array.isArray(params?.category) ? params.category[0] ?? "" : params?.category ?? "";
  const normalize = (input: string) =>
    input
      .toLowerCase()
      .trim()
      .replace(/^\/+|\/+$/g, "")
      // Keep only characters we expect in our category IDs.
      .replace(/[^a-z0-9-]/g, "")
      // Collapse multiple dashes.
      .replace(/-+/g, "-");

  const categoryId = normalize(decodeURIComponent(raw));
  const category =
    categories.find((c) => normalize(c.id) === categoryId) ?? (categoryId ? getCategoryById(categoryId) : undefined);
  if (!category) {
    return { title: "Shop | Everon Global Trades LLC" };
  }
  return {
    title: `${category.name} | Everon Global Trades LLC`,
    description: category.description,
  };
}

export default function CategoryPage({ params }: CategoryPageProps) {
  // Normalize param because some navigations may include/exclude a trailing slash.
  const normalize = (input: string) =>
    input
      .toLowerCase()
      .trim()
      .replace(/^\/+|\/+$/g, "")
      // Keep only characters we expect in our category IDs.
      .replace(/[^a-z0-9-]/g, "")
      // Collapse multiple dashes.
      .replace(/-+/g, "-");

  const raw = Array.isArray(params?.category) ? params.category[0] ?? "" : params?.category ?? "";
  const categoryId = normalize(decodeURIComponent(raw));
  const category =
    categories.find((c) => normalize(c.id) === categoryId) ?? (categoryId ? getCategoryById(categoryId) : undefined);
  // If category lookup fails for any reason, still try to render products.
  // This prevents the generic "Page Not Found" screen on valid category URLs.

  const fallbackCategory = categoryId
    ? {
        id: categoryId,
        name: categoryId
          .split("-")
          .map((s) => (s ? s[0].toUpperCase() + s.slice(1) : s))
          .join(" "),
        description: "Explore products in this category.",
        bannerSeed: categoryId,
      }
    : null;

  const effectiveCategory = category ?? fallbackCategory;
  const categoryProducts = effectiveCategory ? getProductsByCategory(effectiveCategory.id) : [];

  return (
    <div className="mx-auto max-w-7xl px-4 md:px-6">
      <section className="mt-8 overflow-hidden rounded-2xl border border-slate-200">
        <Image
          src={`https://picsum.photos/seed/${effectiveCategory?.bannerSeed ?? categoryId ?? "shop"}/1600/420`}
          alt={effectiveCategory?.name ?? "Shop category"}
          width={1600}
          height={420}
          className="h-52 w-full object-cover md:h-72"
        />
        <div className="bg-white p-6">
          <h1 className="text-2xl font-bold text-brand-navy md:text-3xl">{effectiveCategory?.name ?? "Shop"}</h1>
          <p className="mt-2 text-sm text-slate-600">{effectiveCategory?.description ?? ""}</p>
        </div>
      </section>

      <section className="mt-8">
        <CategoryProductGrid products={categoryProducts} categoryId={effectiveCategory?.id ?? categoryId} />
      </section>
    </div>
  );
}
