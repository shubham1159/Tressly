"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import Button from "@/components/ui/Button";
import { useCartStore } from "@/context/cartStore";
import type { Product } from "@/data/products";

export default function AddToCartPanel({ product }: { product: Product }) {
  const router = useRouter();
  const addItem = useCartStore((s) => s.addItem);
  const [isGift, setIsGift] = useState(false);
  const [giftMessage, setGiftMessage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const price = product.discountPrice ?? product.price;

  function buildItem() {
    return {
      productId: product.id,
      title: product.title,
      slug: product.slug,
      image: product.images[0],
      price,
      isGift,
      giftMessage: isGift ? giftMessage : undefined,
    };
  }

  function handleAddToCart() {
    addItem(buildItem(), quantity);
    toast.success("Added to cart");
  }

  function handleBuyNow() {
    addItem(buildItem(), quantity);
    router.push("/checkout");
  }

  return (
    <div className="mt-6 space-y-5">
      {product.personalizationAvailable && (
        <div className="rounded-xl border border-ink/10 p-4">
          <label className="flex items-center gap-2 text-sm font-medium">
            <input type="checkbox" checked={isGift} onChange={(e) => setIsGift(e.target.checked)} />
            Send as a gift
          </label>
          {isGift && (
            <textarea
              value={giftMessage}
              onChange={(e) => setGiftMessage(e.target.value)}
              placeholder="Write a personal message (printed on the gift card)"
              maxLength={200}
              rows={3}
              className="mt-3 w-full rounded-lg border border-ink/15 bg-ivory p-3 text-sm outline-none focus:border-ink/40"
            />
          )}
        </div>
      )}

      <div className="flex items-center gap-4">
        <div className="flex items-center rounded-full border border-ink/15">
          <button className="px-3 py-2" onClick={() => setQuantity((q) => Math.max(1, q - 1))} aria-label="Decrease quantity">
            −
          </button>
          <span className="w-6 text-center text-sm">{quantity}</span>
          <button className="px-3 py-2" onClick={() => setQuantity((q) => q + 1)} aria-label="Increase quantity">
            +
          </button>
        </div>
        <Button variant="secondary" className="flex-1" onClick={handleAddToCart}>
          Add to Cart
        </Button>
        <Button className="flex-1" onClick={handleBuyNow}>
          Buy Now
        </Button>
      </div>
    </div>
  );
}
