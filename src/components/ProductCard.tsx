import Image from "next/image";
import Link from "next/link";
import { Product } from "@/lib/catalog";
import { AddToCartButton } from "@/components/cart/AddToCartButton";

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md">
      <Link href={`/product/${product.slug}`} className="block">
        <Image
          src={`https://picsum.photos/seed/${product.imageSeed}/500/500`}
          alt={product.name}
          width={500}
          height={500}
          className="h-52 w-full object-cover"
        />
      </Link>

      <div className="space-y-3 p-4">
        <Link href={`/product/${product.slug}`} className="line-clamp-2 text-sm font-semibold text-slate-800 hover:text-brand-teal">
          {product.name}
        </Link>
        <div className="flex items-center justify-between">
          <p className="text-lg font-bold text-brand-navy">${product.price}</p>
          <p className="text-xs text-amber-600">★ {product.rating}</p>
        </div>
        <AddToCartButton productId={product.id} />
      </div>
    </article>
  );
}
