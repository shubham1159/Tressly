"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { useCartStore } from "@/context/cartStore";
import Button from "@/components/ui/Button";
import { formatINR } from "@/lib/utils";

export default function CartPage() {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const totals = useCartStore((s) => s.totals());

  if (items.length === 0) {
    return (
      <div className="container-page flex flex-col items-center py-24 text-center">
        <h1 className="font-display text-2xl">Your cart is empty</h1>
        <p className="mt-2 text-ink/60">Find something thoughtful to give.</p>
        <Link href="/products" className="mt-6">
          <Button>Browse products</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container-page grid gap-10 py-10 md:grid-cols-[1fr_340px]">
      <div>
        <h1 className="font-display text-3xl">Your Cart</h1>
        <div className="mt-6 divide-y divide-ink/10">
          {items.map((item) => (
            <div key={item.productId} className="flex gap-4 py-5">
              <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl bg-sand">
                <Image src={item.image} alt={item.title} fill sizes="96px" className="object-cover" />
              </div>
              <div className="flex flex-1 flex-col justify-between">
                <div className="flex justify-between gap-4">
                  <div>
                    <Link href={`/products/${item.slug}`} className="text-[15px]">
                      {item.title}
                    </Link>
                    {item.isGift && <p className="mt-1 text-xs text-berry">Gift-wrapped with message</p>}
                  </div>
                  <button onClick={() => removeItem(item.productId)} aria-label="Remove item" className="text-ink/40 hover:text-berry">
                    <Trash2 size={17} />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center rounded-full border border-ink/15">
                    <button className="px-3 py-1" onClick={() => updateQuantity(item.productId, item.quantity - 1)}>
                      −
                    </button>
                    <span className="w-6 text-center text-sm">{item.quantity}</span>
                    <button className="px-3 py-1" onClick={() => updateQuantity(item.productId, item.quantity + 1)}>
                      +
                    </button>
                  </div>
                  <span className="text-sm font-medium">{formatINR(item.price * item.quantity)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="h-fit rounded-2xl border border-ink/10 p-6">
        <h2 className="font-display text-xl">Order Summary</h2>
        <dl className="mt-4 space-y-2 text-sm">
          <Row label="Subtotal" value={formatINR(totals.subtotal)} />
          <Row label="GST (18%)" value={formatINR(totals.gst)} />
          <Row label="Shipping" value={totals.shipping === 0 ? "Free" : formatINR(totals.shipping)} />
          <div className="my-2 border-t border-ink/10" />
          <Row label="Total" value={formatINR(totals.total)} bold />
        </dl>
        <Button className="mt-6 w-full" onClick={() => router.push("/checkout")}>
          Proceed to Checkout
        </Button>
      </div>
    </div>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className={`flex justify-between ${bold ? "font-medium" : "text-ink/70"}`}>
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}
