"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, X } from "lucide-react";
import toast from "react-hot-toast";
import { useWishlistStore } from "@/context/wishlistStore";
import { useCartStore } from "@/context/cartStore";
import { formatINR } from "@/lib/utils";
import Button from "@/components/ui/Button";

export default function WishlistOffcanvas({ open, onClose }: { open: boolean; onClose: () => void }) {
  const items = useWishlistStore((s) => s.items);
  const remove = useWishlistStore((s) => s.remove);
  const addItem = useCartStore((s) => s.addItem);

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60]">
      <button aria-label="Close wishlist" onClick={onClose} className="absolute inset-0 bg-ink/40 backdrop-blur-sm" />
      <div className="absolute right-0 top-0 flex w-full max-w-sm flex-col bg-ivory shadow-card" style={{height:"100vh"}}>
        <div className="flex items-center justify-between border-b border-ink/10 px-5 py-4">
          <h2 className="font-display text-xl">Wishlist ({items.length})</h2>
          <button onClick={onClose} aria-label="Close" className="rounded-full p-2 hover:bg-ink/5">
            <X size={20} />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
            <Heart className="text-ink/30" size={32} />
            <p className="mt-4 text-sm text-ink/60">Nothing saved yet — tap the heart on any product to add it here.</p>
            <Link href="/products" onClick={onClose} className="mt-6">
              <Button variant="secondary">Browse products</Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-5 py-4">
              <ul className="space-y-4">
                {items.map((item) => (
                  <li key={item.productId} className="flex gap-3">
                    <Link
                      href={`/products/${item.slug}`}
                      onClick={onClose}
                      className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-sand"
                    >
                      <Image src={item.image} alt={item.title} fill sizes="80px" className="object-cover" />
                    </Link>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm">{item.title}</p>
                      <p className="mt-1 text-sm font-medium">{formatINR(item.price)}</p>
                      <div className="mt-2 flex gap-3 text-xs">
                        <button
                          onClick={() => {
                            addItem({
                              productId: item.productId,
                              title: item.title,
                              slug: item.slug,
                              image: item.image,
                              price: item.price,
                              isGift: false,
                            });
                            toast.success("Added to cart");
                          }}
                          className="link-underline"
                        >
                          Add to cart
                        </button>
                        <button onClick={() => remove(item.productId)} className="text-ink/50 hover:text-berry">
                          Remove
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="border-t border-ink/10 p-5">
              <Link href="/wishlist" onClick={onClose}>
                <Button className="w-full">View full wishlist</Button>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
