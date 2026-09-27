"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatINR } from "@/lib/utils";

type OrderRow = {
  _id: string;
  items: { title: string; quantity: number }[];
  total: number;
  status: string;
  createdAt: string;
};

const STATUS_LABEL: Record<string, string> = {
  created: "Payment pending",
  paid: "Confirmed",
  failed: "Payment failed",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderRow[] | null>(null);

  useEffect(() => {
    fetch("/api/orders")
      .then((res) => (res.ok ? res.json() : { orders: [] }))
      .then((data) => setOrders(data.orders ?? []));
  }, []);

  return (
    <div className="container-page py-10">
      <h1 className="font-display text-3xl">Your Orders</h1>

      {orders === null && <p className="mt-6 text-ink/60">Loading orders…</p>}
      {orders?.length === 0 && (
        <p className="mt-6 text-ink/60">
          No orders yet. <Link href="/products" className="underline">Start shopping</Link>.
        </p>
      )}

      <div className="mt-6 space-y-4">
        {orders?.map((order) => (
          <div key={order._id} className="rounded-2xl border border-ink/10 p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm text-ink/60">
                Order #{order._id.slice(-8).toUpperCase()} · {new Date(order.createdAt).toLocaleDateString("en-IN")}
              </p>
              <span className="rounded-full bg-sand px-3 py-1 text-xs">{STATUS_LABEL[order.status] ?? order.status}</span>
            </div>
            <p className="mt-2 text-sm">
              {order.items.map((i) => `${i.title} × ${i.quantity}`).join(", ")}
            </p>
            <p className="mt-2 font-medium">{formatINR(order.total)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
