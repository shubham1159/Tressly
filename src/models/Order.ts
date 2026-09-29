import mongoose, { Schema, models, model, Model } from "mongoose";

export interface IOrderItem {
  product: string; // product id (Mongo ObjectId string or static catalog id)
  slug?: string;
  title: string;
  image: string;
  price: number;
  quantity: number;
  giftMessage?: string;
  isGift: boolean;
}

export interface IOrder extends mongoose.Document {
  user: mongoose.Types.ObjectId;
  items: IOrderItem[];
  address: {
    fullName: string;
    phone: string;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    pincode: string;
  };
  subtotal: number;
  shipping: number;
  gst: number;
  total: number;
  paymentMethod: "razorpay" | "cod";
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  status: "created" | "placed" | "paid" | "failed" | "shipped" | "delivered" | "cancelled";
  createdAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>(
  {
    product: { type: String, required: true },
    slug: { type: String },
    title: { type: String, required: true },
    image: { type: String },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
    giftMessage: { type: String },
    isGift: { type: Boolean, default: false },
  },
  { _id: false }
);

const OrderSchema = new Schema<IOrder>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    items: [OrderItemSchema],
    address: {
      fullName: String,
      phone: String,
      line1: String,
      line2: String,
      city: String,
      state: String,
      pincode: String,
    },
    subtotal: { type: Number, required: true },
    shipping: { type: Number, required: true },
    gst: { type: Number, required: true },
    total: { type: Number, required: true },
    paymentMethod: { type: String, enum: ["razorpay", "cod"], default: "razorpay" },
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
    razorpaySignature: { type: String },
    status: {
      type: String,
      enum: ["created", "placed", "paid", "failed", "shipped", "delivered", "cancelled"],
      default: "created",
    },
  },
  { timestamps: true }
);

export default (models.Order as Model<IOrder>) || model<IOrder>("Order", OrderSchema);
