"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Button from "@/components/ui/Button";
import { formatINR } from "@/lib/utils";

type AdminProduct = {
  _id: string;
  title: string;
  slug: string;
  price: number;
  category: string;
  stock: number;
};

const EMPTY = { title: "", price: "", category: "jewellery", stock: "50", description: "", images: "" };

export default function AdminProductsPage() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(false);

  async function load() {
    const res = await fetch("/api/admin/products");
    if (res.ok) setProducts((await res.json()).products);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          price: Number(form.price),
          category: form.category,
          stock: Number(form.stock),
          description: form.description,
          images: form.images.split(",").map((s) => s.trim()).filter(Boolean),
        }),
      });
      if (!res.ok) {
        toast.error((await res.json()).error || "Could not create product");
        return;
      }
      toast.success("Product created");
      setForm(EMPTY);
      load();
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    await fetch("/api/admin/products", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    load();
  }

  return (
    <div className="container-page py-10">
      <h1 className="font-display text-3xl">Products</h1>

      <form onSubmit={handleCreate} className="mt-8 grid gap-4 rounded-2xl border border-ink/10 p-6 sm:grid-cols-2">
        <Input label="Title" value={form.title} onChange={(v) => setForm({ ...form, title: v })} required />
        <Input label="Price (₹)" value={form.price} onChange={(v) => setForm({ ...form, price: v })} required />
        <Input label="Category" value={form.category} onChange={(v) => setForm({ ...form, category: v })} required />
        <Input label="Stock" value={form.stock} onChange={(v) => setForm({ ...form, stock: v })} required />
        <Input
          label="Image URLs (comma-separated)"
          value={form.images}
          onChange={(v) => setForm({ ...form, images: v })}
          className="sm:col-span-2"
        />
        <label className="block sm:col-span-2">
          <span className="text-sm font-medium">Description</span>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={3}
            required
            className="mt-1.5 w-full rounded-lg border border-ink/15 bg-ivory p-3 text-sm outline-none focus:border-ink/40"
          />
        </label>
        <Button type="submit" disabled={loading} className="sm:col-span-2 w-fit">
          {loading ? "Saving…" : "Add product"}
        </Button>
      </form>

      <div className="mt-8 divide-y divide-ink/10 rounded-2xl border border-ink/10">
        {products.map((p) => (
          <div key={p._id} className="flex items-center justify-between p-4">
            <div>
              <p className="text-sm font-medium">{p.title}</p>
              <p className="text-xs text-ink/50">
                {p.category} · {formatINR(p.price)} · {p.stock} in stock
              </p>
            </div>
            <button onClick={() => handleDelete(p._id)} className="text-sm text-berry underline">
              Delete
            </button>
          </div>
        ))}
        {products.length === 0 && <p className="p-4 text-sm text-ink/50">No products yet.</p>}
      </div>
    </div>
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
  value: string;
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
