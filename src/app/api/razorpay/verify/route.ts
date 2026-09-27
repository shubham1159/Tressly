import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { z } from "zod";
import { getAuthUser } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";

const VerifySchema = z.object({
  orderId: z.string(), // our own Mongo order id
  razorpay_order_id: z.string(),
  razorpay_payment_id: z.string(),
  razorpay_signature: z.string(),
});

export async function POST(req: NextRequest) {
  try {
    const user = getAuthUser(req);
    if (!user) return NextResponse.json({ error: "Please sign in to continue" }, { status: 401 });

    const body = await req.json();
    const parsed = VerifySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid payment payload" }, { status: 400 });
    }
    const { orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = parsed.data;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET as string)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    const isValid = expectedSignature === razorpay_signature;

    await connectDB();

    if (!isValid) {
      await Order.findByIdAndUpdate(orderId, { status: "failed" });
      return NextResponse.json({ error: "Payment verification failed" }, { status: 400 });
    }

    const order = await Order.findOneAndUpdate(
      { _id: orderId, user: user.userId },
      {
        status: "paid",
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
      },
      { new: true }
    );

    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

    return NextResponse.json({ ok: true, orderId: order._id.toString() });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Could not verify payment." }, { status: 500 });
  }
}
