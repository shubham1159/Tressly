import type { MetadataRoute } from "next";
import { products, occasions } from "@/data/products";
import { posts } from "@/data/blog";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/products", "/blog", "/login", "/signup"].map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date(),
  }));

  const productRoutes = products.map((p) => ({
    url: `${siteUrl}/products/${p.slug}`,
    lastModified: new Date(),
  }));

  const occasionRoutes = occasions.map((o) => ({
    url: `${siteUrl}/occasions/${o.value}`,
    lastModified: new Date(),
  }));

  const blogRoutes = posts.map((p) => ({
    url: `${siteUrl}/blog/${p.slug}`,
    lastModified: new Date(p.publishedAt),
  }));

  return [...staticRoutes, ...productRoutes, ...occasionRoutes, ...blogRoutes];
}
