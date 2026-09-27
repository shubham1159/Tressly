/**
 * Seeds MongoDB with the demo catalog used in src/data/products.ts.
 * Run with: npm run seed  (requires MONGODB_URI in .env.local)
 */
require("dotenv").config({ path: ".env.local" });
const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    title: String,
    slug: { type: String, unique: true },
    description: String,
    price: Number,
    discountPrice: Number,
    images: [String],
    category: String,
    occasions: [String],
    rating: Number,
    reviewCount: Number,
    stock: Number,
    isBestSeller: Boolean,
    isFeatured: Boolean,
    personalizationAvailable: Boolean,
  },
  { timestamps: true }
);

const Product = mongoose.models.Product || mongoose.model("Product", ProductSchema);

// Kept in plain JS (mirrors src/data/products.ts) so this script has no
// TypeScript build step and can run with a plain `node scripts/seed.js`.
const products = require("./seed-data.json");

async function main() {
  if (!process.env.MONGODB_URI) {
    console.error("Set MONGODB_URI in .env.local before seeding.");
    process.exit(1);
  }
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected to MongoDB");

  await Product.deleteMany({});
  await Product.insertMany(products);

  console.log(`Seeded ${products.length} products.`);
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
