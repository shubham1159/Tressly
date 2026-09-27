import Link from "next/link";
import ProductCard from "@/components/product/ProductCard";
import type { Product } from "@/data/products";

export default function ProductRail({
  title,
  subtitle,
  href,
  items,
}: {
  title: string;
  subtitle?: string;
  href: string;
  items: Product[];
}) {
  return (
    <section className="container-page mt-20">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="font-display text-2xl sm:text-3xl">{title}</h2>
          {subtitle && <p className="mt-1 text-sm text-ink/60">{subtitle}</p>}
        </div>
        <Link href={href} className="link-underline hidden text-sm sm:block">
          View all
        </Link>
      </div>
      <div className="mt-6 grid grid-cols-2 gap-x-5 gap-y-8 md:grid-cols-4">
        {items.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
