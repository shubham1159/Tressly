import { Suspense } from "react";
import type { Metadata } from "next";
import ProductFilters from "@/components/product/ProductFilters";
import ProductCard from "@/components/product/ProductCard";
import { ProductCardSkeleton } from "@/components/ui/Skeleton";
import { products as allProducts } from "@/data/products";

export const metadata: Metadata = {
  title: "Shop all hair accessories",
  description: "Browse scrunchies, claw clips, clutchers, headbands and hair pins — filter by category, look, or price.",
};

const PAGE_SIZE = 8;

function getFilteredProducts(searchParams: Record<string, string | string[] | undefined>) {
  const category = typeof searchParams.category === "string" ? searchParams.category : undefined;
  const occasion = typeof searchParams.occasion === "string" ? searchParams.occasion : undefined;
  const sort = typeof searchParams.sort === "string" ? searchParams.sort : "featured";
  const page = Number(searchParams.page ?? 1);
  const q = typeof searchParams.q === "string" ? searchParams.q.toLowerCase() : undefined;

  let items = [...allProducts];

  if (category) items = items.filter((p) => p.category === category);
  if (occasion) items = items.filter((p) => p.occasions.includes(occasion as any));
  if (q) items = items.filter((p) => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));

  if (sort === "popularity") items.sort((a, b) => b.reviewCount - a.reviewCount);
  if (sort === "price-asc") items.sort((a, b) => (a.discountPrice ?? a.price) - (b.discountPrice ?? b.price));
  if (sort === "price-desc") items.sort((a, b) => (b.discountPrice ?? b.price) - (a.discountPrice ?? a.price));

  const total = items.length;
  const start = (page - 1) * PAGE_SIZE;
  const paged = items.slice(start, start + PAGE_SIZE);

  return { items: paged, total, page, pageCount: Math.max(1, Math.ceil(total / PAGE_SIZE)) };
}

export default function ProductsPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const { items, total, page, pageCount } = getFilteredProducts(searchParams);

  return (
    <div className="container-page py-10">
      <h1 className="font-display text-3xl">Shop all hair accessories</h1>
      <p className="mt-1 text-sm text-ink/60">{total} products</p>

      <div className="mt-8 grid gap-10 md:grid-cols-[220px_1fr]">
        <aside className="md:sticky md:top-24 md:self-start">
          <Suspense fallback={null}>
            <ProductFilters />
          </Suspense>
        </aside>

        <div>
          <Suspense
            fallback={
              <div className="grid grid-cols-2 gap-x-5 gap-y-8 md:grid-cols-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            }
          >
            {items.length === 0 ? (
              <p className="py-20 text-center text-ink/60">No products match those filters yet — try clearing one.</p>
            ) : (
              <div className="grid grid-cols-2 gap-x-5 gap-y-8 md:grid-cols-4">
                {items.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}
          </Suspense>

          {pageCount > 1 && (
            <div className="mt-10 flex justify-center gap-2">
              {Array.from({ length: pageCount }).map((_, i) => (
                <a
                  key={i}
                  href={`?${new URLSearchParams({ ...(searchParams as any), page: String(i + 1) }).toString()}`}
                  className={`flex h-9 w-9 items-center justify-center rounded-full border text-sm ${
                    page === i + 1 ? "border-ink bg-ink text-ivory" : "border-ink/15"
                  }`}
                >
                  {i + 1}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
