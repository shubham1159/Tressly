import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductGallery from "@/components/product/ProductGallery";
import AddToCartPanel from "@/components/product/AddToCartPanel";
import Stars from "@/components/ui/Stars";
import ProductRail from "@/components/home/ProductRail";
import { products } from "@/data/products";
import { formatINR } from "@/lib/utils";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const product = products.find((p) => p.slug === params.slug);
  if (!product) return {};
  return {
    title: product.title,
    description: product.description,
    openGraph: {
      title: product.title,
      description: product.description,
      images: product.images,
    },
  };
}

export default function ProductDetailPage({ params }: { params: { slug: string } }) {
  const product = products.find((p) => p.slug === params.slug);
  if (!product) notFound();

  const recommended = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);
  const hasDiscount = !!product.discountPrice;

  return (
    <div className="container-page py-10">
      <div className="grid gap-10 md:grid-cols-2">
        <ProductGallery images={product.images} title={product.title} />

        <div>
          <p className="text-sm capitalize text-ink/50">{product.category.replace("-", " ")}</p>
          <h1 className="mt-1 font-display text-3xl">{product.title}</h1>
          <div className="mt-2">
            <Stars rating={product.rating} count={product.reviewCount} />
          </div>
          <div className="mt-4 flex items-center gap-3">
            <span className="text-2xl font-medium">{formatINR(product.discountPrice ?? product.price)}</span>
            {hasDiscount && (
              <>
                <span className="text-ink/40 line-through">{formatINR(product.price)}</span>
                <span className="rounded-full bg-sage/20 px-2 py-0.5 text-xs text-sage">
                  {Math.round(100 - ((product.discountPrice as number) / product.price) * 100)}% off
                </span>
              </>
            )}
          </div>
          <p className="mt-5 max-w-prose text-ink/70">{product.description}</p>

          <AddToCartPanel product={product} />

          <dl className="mt-8 grid grid-cols-2 gap-y-2 border-t border-ink/10 pt-6 text-sm text-ink/60">
            <dt>Delivery</dt>
            <dd>3–5 business days, pan-India</dd>
            <dt>Returns</dt>
            <dd>7-day return on unopened items</dd>
          </dl>
        </div>
      </div>

      {recommended.length > 0 && (
        <ProductRail
          title="You might also like"
          href={`/products?category=${product.category}`}
          items={recommended}
        />
      )}
    </div>
  );
}
