import Hero from "@/components/home/Hero";
import ProductRail from "@/components/home/ProductRail";
import Occasions from "@/components/home/Occasions";
import Testimonials from "@/components/home/Testimonials";
import Newsletter from "@/components/home/Newsletter";
import { products } from "@/data/products";

export default function HomePage() {
  const featured = products.filter((p) => p.isFeatured);
  const bestSellers = products.filter((p) => p.isBestSeller);

  return (
    <>
      <Hero />
      <ProductRail title="Featured picks" subtitle="This week's edit" href="/products" items={featured} />
      <Occasions />
      <ProductRail title="Best sellers" subtitle="Loved again and again" href="/products?sort=popularity" items={bestSellers} />
      <Testimonials />
      <Newsletter />
    </>
  );
}
