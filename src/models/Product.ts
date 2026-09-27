import mongoose, { Schema, models, model, Model } from "mongoose";

export interface IProduct extends mongoose.Document {
  title: string;
  slug: string;
  description: string;
  price: number;
  discountPrice?: number;
  images: string[];
  category: string;
  occasions: string[];
  rating: number;
  reviewCount: number;
  stock: number;
  isBestSeller: boolean;
  isFeatured: boolean;
  personalizationAvailable: boolean;
  createdAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    discountPrice: { type: Number },
    images: [{ type: String }],
    category: { type: String, required: true, index: true }, // e.g. "jewellery", "hampers"
    occasions: [{ type: String, index: true }], // e.g. "birthday", "anniversary"
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    stock: { type: Number, default: 100 },
    isBestSeller: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
    personalizationAvailable: { type: Boolean, default: true },
  },
  { timestamps: true }
);

ProductSchema.index({ title: "text", description: "text" });

export default (models.Product as Model<IProduct>) || model<IProduct>("Product", ProductSchema);
