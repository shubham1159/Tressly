"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { useWishlistStore } from "@/context/wishlistStore";
import { useCartStore } from "@/context/cartStore";
import { formatINR } from "@/lib/utils";
import Button from "@/components/ui/Button";
import toast from "react-hot-toast";

export default function WishlistPage() {
  const items = useWishlistStore((s) => s.items);
  const remove = useWishlistStore((s) => s.remove);
  const addItem = useCartStore((s) => s.addItem);

  if (items.length === 0) {
    return (
      <div className="container-page flex flex-col items-center py-24 text-center">
        <Heart className="text-ink/30" size={32} />
        <h1 className="mt-4 font-display text-2xl">Your wishlist is empty</h1>
        <Link href="/products" className="mt-6">
          <Button>Browse products</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container-page py-10">
      <h1 className="font-display text-3xl">Wishlist</h1>
      <div className="mt-6 grid gap-6 sm:grid-cols-2 md:grid-cols-3">
        {items.map((item) => (
          <div key={item.productId} className="rounded-2xl border border-ink/10 p-4">
            <Link href={`/products/${item.slug}`} className="relative block aspect-square overflow-hidden rounded-xl bg-sand">
              <Image src={item.image} alt={item.title} fill sizes="33vw" className="object-cover" />
            </Link>
            <p className="mt-3 text-[15px]">{item.title}</p>
            <p className="mt-1 text-sm font-medium">{formatINR(item.price)}</p>
            <div className="mt-3 flex gap-2">
              <Button
                variant="secondary"
                className="flex-1 py-2 text-xs"
                onClick={() => {
                  addItem({ productId: item.productId, title: item.title, slug: item.slug, image: item.image, price: item.price, isGift: false });
                  toast.success("Added to cart");
                }}
              >
                Add to Cart
              </Button>
              <button onClick={() => remove(item.productId)} className="rounded-full border border-ink/15 px-3 text-xs">
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
