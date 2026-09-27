import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import { slugify } from "@/lib/utils";

function requireAdmin(req: NextRequest) {
  const user = getAuthUser(req);
  if (!user || user.role !== "admin") return null;
  return user;
}

export async function GET(req: NextRequest) {
  if (!requireAdmin(req)) return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  await connectDB();
  const products = await Product.find().sort({ createdAt: -1 }).lean();
  return NextResponse.json({ products });
}

export async function POST(req: NextRequest) {
  if (!requireAdmin(req)) return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  const body = await req.json();
  await connectDB();
  const product = await Product.create({ ...body, slug: body.slug || slugify(body.title) });
  return NextResponse.json({ product }, { status: 201 });
}

export async function PATCH(req: NextRequest) {
  if (!requireAdmin(req)) return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  const body = await req.json();
  await connectDB();
  const product = await Product.findByIdAndUpdate(body.id, body, { new: true });
  return NextResponse.json({ product });
}

export async function DELETE(req: NextRequest) {
  if (!requireAdmin(req)) return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  const { id } = await req.json();
  await connectDB();
  await Product.findByIdAndDelete(id);
  return NextResponse.json({ ok: true });
}
