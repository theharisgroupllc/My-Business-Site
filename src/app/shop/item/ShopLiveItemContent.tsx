"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { AddToCartQuantity } from "@/components/cart/AddToCartQuantity";
import { ProductCard } from "@/components/ProductCard";
import type { Product } from "@/lib/catalog";
import { getRelatedProducts, productFromAdminRow, products as staticProducts } from "@/lib/catalog";

type ProductsResponse = { products?: Array<Record<string, unknown>> };

export function ShopLiveItemContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id")?.trim() ?? "";
  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) {
      setProduct(null);
      setError("Missing product id. Open this page from a product card or add ?id= to the URL.");
      return;
    }
    let cancelled = false;
    setError("");
    fetch("/api/products")
      .then(async (response) => {
        if (!response.ok) throw new Error("Unable to load catalog.");
        return (await response.json()) as ProductsResponse;
      })
      .then((data) => {
        if (cancelled) return;
        const rows = data.products ?? [];
        const row = rows.find((r) => String(r.id) === id);
        if (!row || typeof row.name !== "string") {
          setProduct(null);
          setError("Product not found. It may have been removed or is not active.");
          return;
        }
        setProduct(
          productFromAdminRow({
            id: String(row.id),
            slug: row.slug != null ? String(row.slug) : undefined,
            name: String(row.name),
            category_id: String(row.category_id ?? row.categoryId ?? ""),
            price: row.price as number | string,
            inventory: row.inventory as number | string | undefined,
            description: row.description != null ? String(row.description) : undefined,
            image_url: row.image_url != null ? String(row.image_url) : undefined,
          }),
        );
      })
      .catch(() => {
        if (!cancelled) {
          setProduct(null);
          setError("Could not load this product. Check your connection and try again.");
        }
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  const related = useMemo(() => (product ? getRelatedProducts(product) : []), [product]);

  if (!id) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 md:px-6">
        <h1 className="text-2xl font-bold text-brand-navy">Live product</h1>
        <p className="mt-3 text-sm text-slate-600">{error}</p>
        <Link href="/shop/" className="mt-6 inline-block text-sm font-semibold text-brand-teal hover:underline">
          Back to shop
        </Link>
      </div>
    );
  }

  if (error && !product) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 md:px-6">
        <h1 className="text-2xl font-bold text-brand-navy">Live product</h1>
        <p className="mt-3 text-sm text-red-600">{error}</p>
        <Link href="/shop/" className="mt-6 inline-block text-sm font-semibold text-brand-teal hover:underline">
          Back to shop
        </Link>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 md:px-6">
        <p className="text-sm text-slate-600">Loading product…</p>
      </div>
    );
  }

  const imageSrc = product.imageUrl ?? `https://picsum.photos/seed/${product.imageSeed}/900/900`;

  return (
    <div className="mx-auto max-w-7xl px-4 md:px-6">
      <nav className="mt-6 text-sm text-slate-500">
        <Link href="/shop/" className="font-medium text-brand-teal hover:underline">
          Shop
        </Link>
        <span className="mx-2">/</span>
        <span className="text-slate-700">{product.name}</span>
      </nav>

      <section className="mt-6 grid gap-8 md:grid-cols-2">
        <div>
          <div className="aspect-[4/3] w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
            {product.imageUrl?.startsWith("data:") ? (
              <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" />
            ) : (
              <Image src={imageSrc} alt={product.name} width={900} height={675} className="h-full w-full object-cover" />
            )}
          </div>
          {product.imageUrls && product.imageUrls.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {product.imageUrls.map((url, i) => (
                <img key={i} src={url} alt="" className="h-16 w-16 rounded border border-slate-200 object-cover" />
              ))}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-brand-navy">{product.name}</h1>
          <p className="text-2xl font-bold text-brand-teal">${product.price}</p>
          <p className={`text-sm font-medium ${product.inStock ? "text-emerald-600" : "text-red-500"}`}>
            {product.inStock ? "In Stock" : "Out of Stock"}
          </p>
          <p className="text-sm leading-6 text-slate-700">{product.description}</p>
          <AddToCartQuantity productId={product.id} maxQuantity={product.inventory} className="max-w-xs rounded-md border border-slate-200 bg-slate-50 px-3 py-2" />
        </div>
      </section>

      {related.length > 0 && (
        <section className="mt-14">
          <h2 className="text-2xl font-bold text-brand-navy">Related products</h2>
          <div className="mt-5 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {related.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      )}

      {related.length === 0 && staticProducts.filter((p) => p.categoryId === product.categoryId).length > 0 && (
        <section className="mt-14">
          <h2 className="text-2xl font-bold text-brand-navy">More in this category</h2>
          <div className="mt-5 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {staticProducts
              .filter((p) => p.categoryId === product.categoryId && p.id !== product.id)
              .slice(0, 4)
              .map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
          </div>
        </section>
      )}
    </div>
  );
}
