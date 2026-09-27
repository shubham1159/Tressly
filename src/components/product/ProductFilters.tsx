"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { categories, occasions } from "@/data/products";

export default function ProductFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function setParam(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    router.push(`${pathname}?${params.toString()}`);
  }

  const activeCategory = searchParams.get("category");
  const activeOccasion = searchParams.get("occasion");
  const activeSort = searchParams.get("sort") ?? "featured";

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-sm font-medium">Category</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <FilterChip active={!activeCategory} onClick={() => setParam("category", null)} label="All" />
          {categories.map((c) => (
            <FilterChip
              key={c.value}
              active={activeCategory === c.value}
              onClick={() => setParam("category", c.value)}
              label={c.label}
            />
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm font-medium">Occasion</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <FilterChip active={!activeOccasion} onClick={() => setParam("occasion", null)} label="All" />
          {occasions.map((o) => (
            <FilterChip
              key={o.value}
              active={activeOccasion === o.value}
              onClick={() => setParam("occasion", o.value)}
              label={o.label}
            />
          ))}
        </div>
      </div>

      <div>
        <label className="text-sm font-medium" htmlFor="sort">
          Sort by
        </label>
        <select
          id="sort"
          value={activeSort}
          onChange={(e) => setParam("sort", e.target.value)}
          className="mt-3 w-full rounded-lg border border-ink/15 bg-ivory px-3 py-2 text-sm"
        >
          <option value="featured">Featured</option>
          <option value="popularity">Popularity</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
        </select>
      </div>
    </div>
  );
}

function FilterChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
        active ? "border-ink bg-ink text-ivory" : "border-ink/15 hover:border-ink/40"
      }`}
    >
      {label}
    </button>
  );
}
