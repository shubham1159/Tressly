import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductCard from "@/components/product/ProductCard";
import { products, occasions } from "@/data/products";

export function generateStaticParams() {
  return occasions.map((o) => ({ slug: o.value }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const occasion = occasions.find((o) => o.value === params.slug);
  if (!occasion) return {};
  return {
    title: `${occasion.label} picks`,
    description: `Hair accessories picked for ${occasion.label.toLowerCase()} — scrunchies, clips, clutchers and more.`,
  };
}

export default function OccasionPage({ params }: { params: { slug: string } }) {
  const occasion = occasions.find((o) => o.value === params.slug);
  if (!occasion) notFound();

  const items = products.filter((p) => p.occasions.includes(occasion.value as any));

  return (
    <div className="container-page py-10">
      <p className="text-sm text-berry">Occasion</p>
      <h1 className="mt-1 font-display text-3xl">{occasion.label} picks</h1>
      <p className="mt-2 text-sm text-ink/60">{items.length} curated picks</p>

      <div className="mt-8 grid grid-cols-2 gap-x-5 gap-y-8 md:grid-cols-4">
        {items.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}
