"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import clsx from "clsx";
import type { Product } from "@/data/products";
import Stars from "@/components/ui/Stars";
import { formatINR } from "@/lib/utils";
import { useWishlistStore } from "@/context/wishlistStore";
import toast from "react-hot-toast";

export default function ProductCard({ product }: { product: Product }) {
  const isWishlisted = useWishlistStore((s) => s.isWishlisted(product.id));
  const toggle = useWishlistStore((s) => s.toggle);
  const price = product.discountPrice ?? product.price;
  const hasDiscount = !!product.discountPrice;

  return (
    <div className="group relative">
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-sand">
          <Image
            src={product.images[0]}
            alt={product.title}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
          {product.isBestSeller && (
            <span className="absolute left-3 top-3 rounded-full bg-ivory/90 px-3 py-1 text-[11px]">
              Best seller
            </span>
          )}
        </div>
      </Link>
      <button
        onClick={() => {
          toggle({
            productId: product.id,
            title: product.title,
            slug: product.slug,
            image: product.images[0],
            price,
          });
          toast.success(isWishlisted ? "Removed from wishlist" : "Saved to wishlist");
        }}
        aria-label="Toggle wishlist"
        className="absolute right-3 top-3 z-10 rounded-full bg-ivory/90 p-2 opacity-100 shadow-sm transition-opacity md:opacity-0 md:group-hover:opacity-100"
      >
        <Heart size={16} className={clsx(isWishlisted ? "fill-berry text-berry" : "text-ink")} />
      </button>

      <div className="mt-3">
        <Link href={`/products/${product.slug}`}>
          <p className="text-[15px] leading-snug">{product.title}</p>
        </Link>
        <Stars rating={product.rating} count={product.reviewCount} />
        <div className="mt-1 flex items-center gap-2">
          <span className="text-sm font-medium">{formatINR(price)}</span>
          {hasDiscount && <span className="text-xs text-ink/40 line-through">{formatINR(product.price)}</span>}
        </div>
      </div>
    </div>
  );
}
