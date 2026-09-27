import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getAuthUser } from "@/lib/auth";
import { getRazorpayInstance } from "@/lib/razorpay";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";

const ItemSchema = z.object({
  productId: z.string(),
  title: z.string(),
  image: z.string(),
  price: z.number().positive(),
  quantity: z.number().int().positive(),
  isGift: z.boolean().optional().default(false),
  giftMessage: z.string().optional(),
});

const AddressSchema = z.object({
  fullName: z.string().min(1),
  phone: z.string().min(6),
  line1: z.string().min(1),
  line2: z.string().optional(),
  city: z.string().min(1),
  state: z.string().min(1),
  pincode: z.string().min(4),
});

const CreateOrderSchema = z.object({
  items: z.array(ItemSchema).min(1),
  address: AddressSchema,
  subtotal: z.number().nonnegative(),
  shipping: z.number().nonnegative(),
  gst: z.number().nonnegative(),
  total: z.number().positive(),
});

// This endpoint only opens a Razorpay order and records a "created" order in
// our own DB — funds don't move until /api/razorpay/verify confirms the
// signature after checkout completes client-side.
export async function POST(req: NextRequest) {
  try {
    const user = getAuthUser(req);
    if (!user) return NextResponse.json({ error: "Please sign in to continue" }, { status: 401 });

    const body = await req.json();
    const parsed = CreateOrderSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }
    const { items, address, subtotal, shipping, gst, total } = parsed.data;

    const razorpay = getRazorpayInstance();
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(total * 100), // paise
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
    });

    await connectDB();
    const order = await Order.create({
      user: user.userId,
      items: items.map((i) => ({ ...i, product: i.productId })),
      address,
      subtotal,
      shipping,
      gst,
      total,
      razorpayOrderId: razorpayOrder.id,
      status: "created",
    });

    return NextResponse.json({
      orderId: order._id.toString(),
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Could not start payment. Please try again." }, { status: 500 });
  }
}
