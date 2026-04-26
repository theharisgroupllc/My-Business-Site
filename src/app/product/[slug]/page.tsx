import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/ProductCard";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { getProductBySlug, getRelatedProducts, products } from "@/lib/catalog";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) {
    return { title: "Product | Everon Global Trades LLC" };
  }
  return {
    title: `${product.name} | Everon Global Trades LLC`,
    description: product.description,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) {
    notFound();
  }

  const relatedProducts = getRelatedProducts(product);

  return (
    <div className="mx-auto max-w-7xl px-4 md:px-6">
      <section className="mt-8 grid gap-8 md:grid-cols-2">
        <Image
          src={`https://picsum.photos/seed/${product.imageSeed}/900/900`}
          alt={product.name}
          width={900}
          height={900}
          className="h-auto w-full rounded-xl border border-slate-200 object-cover"
        />

        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-brand-navy">{product.name}</h1>
          <p className="text-2xl font-bold text-brand-teal">${product.price}</p>
          <p className={`text-sm font-medium ${product.inStock ? "text-emerald-600" : "text-red-500"}`}>
            {product.inStock ? "In Stock" : "Out of Stock"}
          </p>
          <p className="text-sm leading-6 text-slate-700">{product.description}</p>

          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-brand-navy">Specifications</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
              {product.specifications.map((spec) => (
                <li key={spec}>{spec}</li>
              ))}
            </ul>
          </div>

          <AddToCartButton productId={product.id} className="rounded-md bg-brand-navy px-6 py-3 text-sm font-semibold text-white hover:bg-brand-slate" />
        </div>
      </section>

      <section className="mt-14">
        <h2 className="text-2xl font-bold text-brand-navy">Related Products</h2>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {relatedProducts.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      </section>
    </div>
  );
}
