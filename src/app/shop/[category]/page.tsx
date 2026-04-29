import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCategoryById, getProductsByCategory, categories } from "@/lib/catalog";
import { CategoryProductGrid } from "../components/CategoryProductGrid";

type CategoryPageProps = {
  params: { category: string };
};

export function generateStaticParams() {
  return categories.map((category) => ({ category: category.id }));
}

export function generateMetadata({ params }: CategoryPageProps): Metadata {
  const raw = typeof params?.category === "string" ? params.category : "";
  const categoryId = raw.replace(/\/+$/, "").trim();
  const category = getCategoryById(categoryId);
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
  const raw = typeof params?.category === "string" ? params.category : "";
  const categoryId = raw.replace(/\/+$/, "").trim();
  const category = getCategoryById(categoryId);
  if (!category) {
    notFound();
  }

  const categoryProducts = getProductsByCategory(category.id);

  return (
    <div className="mx-auto max-w-7xl px-4 md:px-6">
      <section className="mt-8 overflow-hidden rounded-2xl border border-slate-200">
        <Image
          src={`https://picsum.photos/seed/${category.bannerSeed}/1600/420`}
          alt={category.name}
          width={1600}
          height={420}
          className="h-52 w-full object-cover md:h-72"
        />
        <div className="bg-white p-6">
          <h1 className="text-2xl font-bold text-brand-navy md:text-3xl">{category.name}</h1>
          <p className="mt-2 text-sm text-slate-600">{category.description}</p>
        </div>
      </section>

      <section className="mt-8">
        <CategoryProductGrid products={categoryProducts} categoryId={category.id} />
      </section>
    </div>
  );
}
