import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

// The storefront keeps the wishlist in a persisted Zustand store client-side
// for guests. Once signed in, syncing through this endpoint lets it follow
// the user across devices.
export async function GET(req: NextRequest) {
  const authUser = getAuthUser(req);
  if (!authUser) return NextResponse.json({ error: "Please sign in" }, { status: 401 });
  await connectDB();
  const user = await User.findById(authUser.userId).populate("wishlist");
  return NextResponse.json({ wishlist: user?.wishlist ?? [] });
}

export async function POST(req: NextRequest) {
  const authUser = getAuthUser(req);
  if (!authUser) return NextResponse.json({ error: "Please sign in" }, { status: 401 });

  const { productId } = await req.json();
  await connectDB();
  const user = await User.findById(authUser.userId);
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const exists = user.wishlist.some((id) => id.toString() === productId);
  user.wishlist = exists
    ? user.wishlist.filter((id) => id.toString() !== productId)
    : [...user.wishlist, productId];
  await user.save();

  return NextResponse.json({ wishlist: user.wishlist });
}
