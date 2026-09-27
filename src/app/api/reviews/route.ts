import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getAuthUser } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Review from "@/models/Review";
import Product from "@/models/Product";
import User from "@/models/User";

const ReviewSchema = z.object({
  productId: z.string(),
  rating: z.number().min(1).max(5),
  comment: z.string().min(3),
});

export async function GET(req: NextRequest) {
  await connectDB();
  const productId = new URL(req.url).searchParams.get("productId");
  if (!productId) return NextResponse.json({ error: "productId is required" }, { status: 400 });
  const reviews = await Review.find({ product: productId }).sort({ createdAt: -1 }).lean();
  return NextResponse.json({ reviews });
}

export async function POST(req: NextRequest) {
  const authUser = getAuthUser(req);
  if (!authUser) return NextResponse.json({ error: "Please sign in to leave a review" }, { status: 401 });

  const body = await req.json();
  const parsed = ReviewSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });

  await connectDB();
  const user = await User.findById(authUser.userId);
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const review = await Review.create({
    product: parsed.data.productId,
    user: user._id,
    userName: user.name,
    rating: parsed.data.rating,
    comment: parsed.data.comment,
  });

  // Keep the product's aggregate rating in sync with its reviews.
  const agg = await Review.aggregate([
    { $match: { product: review.product } },
    { $group: { _id: "$product", avg: { $avg: "$rating" }, count: { $sum: 1 } } },
  ]);
  if (agg[0]) {
    await Product.findByIdAndUpdate(review.product, { rating: agg[0].avg, reviewCount: agg[0].count });
  }

  return NextResponse.json({ review }, { status: 201 });
}
