import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";

// Backed by MongoDB in production. The storefront itself reads from
// src/data/products.ts during development so the UI works with no DB
// configured — point client fetches here once real inventory is seeded.
export async function GET(req: NextRequest) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const occasion = searchParams.get("occasion");
  const q = searchParams.get("q");
  const sort = searchParams.get("sort") || "featured";
  const page = Number(searchParams.get("page") || 1);
  const pageSize = 12;

  const filter: Record<string, unknown> = {};
  if (category) filter.category = category;
  if (occasion) filter.occasions = occasion;
  if (q) filter.$text = { $search: q };

  let sortSpec: Record<string, 1 | -1> = { isFeatured: -1, createdAt: -1 };
  if (sort === "popularity") sortSpec = { reviewCount: -1 };
  if (sort === "price-asc") sortSpec = { price: 1 };
  if (sort === "price-desc") sortSpec = { price: -1 };

  const [items, total] = await Promise.all([
    Product.find(filter)
      .sort(sortSpec)
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .lean(),
    Product.countDocuments(filter),
  ]);

  return NextResponse.json({ items, total, page, pageCount: Math.max(1, Math.ceil(total / pageSize)) });
}

export async function POST(req: NextRequest) {
  // Admin-only product creation — see /api/admin/products for the guarded version
  // used by the admin panel. Left here as the plain REST entry point.
  await connectDB();
  const body = await req.json();
  const product = await Product.create(body);
  return NextResponse.json({ product }, { status: 201 });
}
