import Image from "next/image";
import Link from "next/link";
import { Product } from "@/lib/catalog";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { StarRating } from "@/components/StarRating";

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="flex h-full min-w-0 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <Link href={`/product/${product.slug}`} className="block">
        <Image
          src={`https://picsum.photos/seed/${product.imageSeed}/500/500`}
          alt={product.name}
          width={500}
          height={500}
          className="h-36 w-full object-cover sm:h-52"
        />
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-3 sm:p-4">
        <Link href={`/product/${product.slug}`} className="line-clamp-2 min-h-[2.5rem] text-sm font-semibold leading-5 text-slate-800 hover:text-brand-teal">
          {product.name}
        </Link>
        <div className="mt-auto space-y-2">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-base font-bold text-brand-navy sm:text-lg">${product.price}</p>
            <StarRating rating={product.rating} size="sm" />
          </div>
          <AddToCartButton productId={product.id} />
        </div>
      </div>
    </article>
  );
}
