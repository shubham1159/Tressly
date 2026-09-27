"use client";

import Script from "next/script";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useCartStore } from "@/context/cartStore";
import { useAuth } from "@/context/AuthContext";
import Button from "@/components/ui/Button";
import { formatINR } from "@/lib/utils";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function CheckoutPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const items = useCartStore((s) => s.items);
  const totals = useCartStore((s) => s.totals());
  const clearCart = useCartStore((s) => s.clearCart);

  const [address, setAddress] = useState({
    fullName: "",
    phone: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [placing, setPlacing] = useState(false);

  if (!authLoading && !user) {
    return (
      <div className="container-page py-24 text-center">
        <p className="text-ink/70">Please sign in to check out.</p>
        <Button className="mt-6" onClick={() => router.push("/login")}>
          Sign in
        </Button>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container-page py-24 text-center">
        <p className="text-ink/70">Your cart is empty.</p>
        <Button className="mt-6" onClick={() => router.push("/products")}>
          Browse products
        </Button>
      </div>
    );
  }

  function updateField(key: keyof typeof address, value: string) {
    setAddress((prev) => ({ ...prev, [key]: value }));
  }

  async function handlePay(e: React.FormEvent) {
    e.preventDefault();
    setPlacing(true);
    try {
      const createRes = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({
            productId: i.productId,
            title: i.title,
            image: i.image,
            price: i.price,
            quantity: i.quantity,
            isGift: i.isGift,
            giftMessage: i.giftMessage,
          })),
          address,
          ...totals,
        }),
      });
      const orderData = await createRes.json();
      if (!createRes.ok) {
        toast.error(orderData.error || "Could not start payment");
        setPlacing(false);
        return;
      }

      const rzp = new window.Razorpay({
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: process.env.NEXT_PUBLIC_SITE_NAME || "Tressly",
        description: "Order payment",
        order_id: orderData.razorpayOrderId,
        prefill: {
          name: address.fullName,
          contact: address.phone,
          email: user?.email,
        },
        theme: { color: "#7A2E43" },
        handler: async (response: any) => {
          const verifyRes = await fetch("/api/razorpay/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              orderId: orderData.orderId,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });
          if (verifyRes.ok) {
            clearCart();
            router.push(`/order/success?orderId=${orderData.orderId}`);
          } else {
            router.push(`/order/failure?orderId=${orderData.orderId}`);
          }
        },
        modal: {
          ondismiss: () => setPlacing(false),
        },
      });

      rzp.on("payment.failed", () => {
        router.push(`/order/failure?orderId=${orderData.orderId}`);
      });

      rzp.open();
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Please try again.");
      setPlacing(false);
    }
  }

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />
      <div className="container-page grid gap-10 py-10 md:grid-cols-[1fr_340px]">
        <form id="checkout-form" onSubmit={handlePay}>
          <h1 className="font-display text-3xl">Delivery Address</h1>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <Input label="Full name" value={address.fullName} onChange={(v) => updateField("fullName", v)} required />
            <Input label="Phone number" value={address.phone} onChange={(v) => updateField("phone", v)} required />
            <Input
              label="Address line 1"
              value={address.line1}
              onChange={(v) => updateField("line1", v)}
              required
              className="sm:col-span-2"
            />
            <Input
              label="Address line 2 (optional)"
              value={address.line2}
              onChange={(v) => updateField("line2", v)}
              className="sm:col-span-2"
            />
            <Input label="City" value={address.city} onChange={(v) => updateField("city", v)} required />
            <Input label="State" value={address.state} onChange={(v) => updateField("state", v)} required />
            <Input label="Pincode" value={address.pincode} onChange={(v) => updateField("pincode", v)} required />
          </div>
        </form>

        <div className="h-fit rounded-2xl border border-ink/10 p-6 md:sticky md:top-24">
          <h2 className="font-display text-xl">Order Summary</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {items.map((i) => (
              <li key={i.productId} className="flex justify-between gap-3">
                <span className="text-ink/70">
                  {i.title} × {i.quantity}
                </span>
                <span>{formatINR(i.price * i.quantity)}</span>
              </li>
            ))}
          </ul>
          <div className="my-4 border-t border-ink/10" />
          <dl className="space-y-2 text-sm">
            <Row label="Subtotal" value={formatINR(totals.subtotal)} />
            <Row label="GST (18%)" value={formatINR(totals.gst)} />
            <Row label="Shipping" value={totals.shipping === 0 ? "Free" : formatINR(totals.shipping)} />
            <div className="my-2 border-t border-ink/10" />
            <Row label="Total" value={formatINR(totals.total)} bold />
          </dl>

          <Button type="submit" form="checkout-form" disabled={placing} className="mt-6 w-full">
            {placing ? "Opening payment…" : `Pay ${formatINR(totals.total)}`}
          </Button>
          <p className="mt-3 text-center text-xs text-ink/40">Secure checkout via Razorpay</p>
        </div>
      </div>
    </>
  );
}

function Input({
  label,
  value,
  onChange,
  required,
  className,
}: {
  label: string;
  value?: string;
  onChange: (v: string) => void;
  required?: boolean;
  className?: string;
}) {
  return (
    <label className={`block ${className ?? ""}`}>
      <span className="text-sm font-medium">{label}</span>
      <input
        value={value}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 w-full rounded-lg border border-ink/15 bg-ivory px-3 py-2.5 text-sm outline-none focus:border-ink/40"
      />
    </label>
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
