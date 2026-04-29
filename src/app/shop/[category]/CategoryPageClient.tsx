"use client";

import Image from "next/image";
import { useParams } from "next/navigation";
import { categories, getProductsByCategory } from "@/lib/catalog";
import { CategoryProductGrid } from "../components/CategoryProductGrid";

type Props = {
  /** Server fallback in case params is missing during export. */
  serverCategory?: string;
};

function normalizeCategoryId(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/^\/+|\/+$/g, "")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-");
}

export function CategoryPageClient({ serverCategory }: Props) {
  const params = useParams<{ category?: string | string[] }>();

  const raw =
    typeof params?.category === "string"
      ? params.category
      : Array.isArray(params?.category)
        ? params.category[0] ?? ""
        : serverCategory ?? "";

  const categoryId = normalizeCategoryId(raw);

  const category =
    categories.find((c) => normalizeCategoryId(c.id) === categoryId) ??
    (categoryId
      ? ({
          id: categoryId,
          name: categoryId
            .split("-")
            .map((s) => (s ? s[0].toUpperCase() + s.slice(1) : s))
            .join(" "),
          description: "Explore products in this category.",
          bannerSeed: categoryId,
        } as const)
      : null);

  const categoryProducts = category ? getProductsByCategory(category.id) : [];

  return (
    <div className="mx-auto max-w-7xl px-4 md:px-6">
      <section className="mt-8 overflow-hidden rounded-2xl border border-slate-200">
        <Image
          src={`https://picsum.photos/seed/${category?.bannerSeed ?? categoryId ?? "shop"}/1600/420`}
          alt={category?.name ?? "Shop category"}
          width={1600}
          height={420}
          className="h-52 w-full object-cover md:h-72"
        />
        <div className="bg-white p-6">
          <h1 className="text-2xl font-bold text-brand-navy md:text-3xl">{category?.name ?? "Shop"}</h1>
          <p className="mt-2 text-sm text-slate-600">{category?.description ?? ""}</p>
        </div>
      </section>

      <section className="mt-8">
        <CategoryProductGrid products={categoryProducts} categoryId={category?.id ?? categoryId} />
      </section>
    </div>
  );
}

