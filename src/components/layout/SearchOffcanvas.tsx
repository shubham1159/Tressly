"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, X } from "lucide-react";
import { products } from "@/data/products";
import { formatINR } from "@/lib/utils";

export default function SearchOffcanvas({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      // Focus the input as soon as the panel opens so typing starts immediately.
      const t = setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = "hidden";
      return () => {
        clearTimeout(t);
        document.body.style.overflow = "";
      };
    }
  }, [open]);

  useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return products
      .filter((p) => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.category.includes(q))
      .slice(0, 6);
  }, [query]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60]">
      <button aria-label="Close search" onClick={onClose} className="absolute inset-0 bg-ink/40 backdrop-blur-sm" />
      <div className="absolute inset-x-0 top-0 max-h-[85vh] overflow-y-auto rounded-b-3xl bg-ivory shadow-card">
        <div className="container-page flex items-center gap-3 py-5">
          <Search size={20} className="shrink-0 text-ink/40" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search scrunchies, clips, headbands…"
            className="w-full bg-transparent text-lg outline-none placeholder:text-ink/40"
          />
          <button onClick={onClose} aria-label="Close" className="shrink-0 rounded-full p-2 hover:bg-ink/5">
            <X size={20} />
          </button>
        </div>

        {query.trim() && (
          <div className="container-page pb-8">
            {results.length === 0 ? (
              <p className="py-10 text-center text-sm text-ink/60">No products match "{query}".</p>
            ) : (
              <>
                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                  {results.map((p) => (
                    <Link
                      key={p.id}
                      href={`/products/${p.slug}`}
                      onClick={onClose}
                      className="flex items-center gap-3 rounded-xl p-2 hover:bg-sand"
                    >
                      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-sand">
                        <Image src={p.images[0]} alt={p.title} fill sizes="56px" className="object-cover" />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm">{p.title}</p>
                        <p className="text-xs text-ink/60">{formatINR(p.discountPrice ?? p.price)}</p>
                      </div>
                    </Link>
                  ))}
                </div>
                <Link
                  href={`/products?q=${encodeURIComponent(query.trim())}`}
                  onClick={onClose}
                  className="link-underline mt-5 inline-block text-sm"
                >
                  See all results for "{query.trim()}" →
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
