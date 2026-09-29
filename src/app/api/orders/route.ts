import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getAuthUser } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import Product from "@/models/Product";
import { computeOrderTotals } from "@/lib/utils";
import { products as staticProducts } from "@/data/products";

// GET: the signed-in user's own order history, newest first.
export async function GET(req: NextRequest) {
  const user = getAuthUser(req);
  if (!user) return NextResponse.json({ error: "Please sign in" }, { status: 401 });

  await connectDB();
  const orders = await Order.find({ user: user.userId }).sort({ createdAt: -1 }).lean();
  return NextResponse.json({ orders });
}

const CodSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string(),
        slug: z.string().min(1),
        quantity: z.number().int().positive().max(50),
        isGift: z.boolean().optional().default(false),
        giftMessage: z.string().max(300).optional(),
      })
    )
    .min(1),
  address: z.object({
    fullName: z.string().min(1),
    phone: z.string().min(6),
    line1: z.string().min(1),
    line2: z.string().optional(),
    city: z.string().min(1),
    state: z.string().min(1),
    pincode: z.string().min(4),
  }),
});

// POST: place a Cash-on-Delivery order. No payment gateway involved.
// Prices are re-read from the DB so a client can't tamper with totals.
export async function POST(req: NextRequest) {
  try {
    const user = getAuthUser(req);
    if (!user) return NextResponse.json({ error: "Please sign in to continue" }, { status: 401 });

    const parsed = CodSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }
    const { items, address } = parsed.data;

    await connectDB();

    // Storefront currently renders from the static catalog (ids like "1", "2"),
    // so look products up by slug: MongoDB first, static catalog as fallback.
    const dbProducts = await Product.find({ slug: { $in: items.map((i) => i.slug) } }).lean();
    const dbBySlug = new Map(dbProducts.map((p) => [p.slug, p]));
    const staticBySlug = new Map(staticProducts.map((p) => [p.slug, p]));

    const orderItems = [];
    for (const i of items) {
      const db = dbBySlug.get(i.slug);
      const st = staticBySlug.get(i.slug);
      const src = db ?? st;
      if (!src) {
        return NextResponse.json({ error: "A product in your cart is no longer available" }, { status: 400 });
      }
      orderItems.push({
        product: db ? String(db._id) : i.productId,
        slug: i.slug,
        title: src.title,
        image: (db ? db.images?.[0] : st?.images[0]) ?? "",
        price: src.discountPrice ?? src.price,
        quantity: i.quantity,
        isGift: i.isGift,
        giftMessage: i.giftMessage,
      });
    }

    const subtotal = orderItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const { shipping, gst, total } = computeOrderTotals(subtotal);

    const order = await Order.create({
      user: user.userId,
      items: orderItems,
      address,
      subtotal,
      shipping,
      gst,
      total,
      paymentMethod: "cod",
      status: "placed",
    });

    return NextResponse.json({ orderId: order._id.toString() }, { status: 201 });
  } catch (err) {
    console.error("COD order error:", err);
    return NextResponse.json({ error: "Could not place order. Please try again." }, { status: 500 });
  }
}
