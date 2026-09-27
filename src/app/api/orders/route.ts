import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";

// GET: the signed-in user's own order history, newest first.
export async function GET(req: NextRequest) {
  const user = getAuthUser(req);
  if (!user) return NextResponse.json({ error: "Please sign in" }, { status: 401 });

  await connectDB();
  const orders = await Order.find({ user: user.userId }).sort({ createdAt: -1 }).lean();
  return NextResponse.json({ orders });
}
