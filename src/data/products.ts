// Static catalog used to render the storefront in development, and as the
// payload for scripts/seed.js. In production, product reads go through
// /api/products against MongoDB — this file is not imported by API routes.
export type Product = {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  discountPrice?: number;
  images: string[];
  category: "scrunchies" | "clips" | "clutchers" | "headbands" | "hair-pins" | "hair-ties";
  occasions: ("everyday" | "party" | "bridal" | "festive" | "office")[];
  rating: number;
  reviewCount: number;
  isBestSeller?: boolean;
  isFeatured?: boolean;
  personalizationAvailable?: boolean;
};

export const products: Product[] = [
  {
    id: "1",
    title: "Velvet Scrunchie Set — Blush Trio",
    slug: "velvet-scrunchie-set-blush-trio",
    description:
      "Three oversized velvet scrunchies in blush, dusty rose, and cream. Soft on hair, gentle on ties, no creases left behind.",
    price: 499,
    discountPrice: 399,
    images: [
      "https://images.unsplash.com/photo-1596993100471-c3905dafa78e?w=800",
      "https://images.unsplash.com/photo-1620331311520-246422fd82f9?w=800",
    ],
    category: "scrunchies",
    occasions: ["everyday", "office"],
    rating: 4.7,
    reviewCount: 156,
    isBestSeller: true,
    isFeatured: true,
  },
  {
    id: "2",
    title: "Pearl Edge Hair Clutcher",
    slug: "pearl-edge-hair-clutcher",
    description:
      "A statement hair clutcher lined with freshwater-style pearls along the edge — strong grip for thick hair, dressy enough for a night out.",
    price: 349,
    images: ["https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=800"],
    category: "clutchers",
    occasions: ["party", "festive"],
    rating: 4.6,
    reviewCount: 88,
    isBestSeller: true,
    isFeatured: true,
  },
  {
    id: "3",
    title: "Gold Vine Hair Pin Set (Pack of 6)",
    slug: "gold-vine-hair-pin-set",
    description:
      "Delicate gold-tone vine pins that tuck flyaways away or pull double duty as a half-up accent. Sold as a set of six.",
    price: 299,
    images: ["https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800"],
    category: "hair-pins",
    occasions: ["bridal", "festive"],
    rating: 4.8,
    reviewCount: 121,
    isFeatured: true,
  },
  {
    id: "4",
    title: "Claw Clip — Matte Tortoise",
    slug: "claw-clip-matte-tortoise",
    description: "A large matte tortoiseshell claw clip that holds thick or curly hair without slipping out.",
    price: 249,
    images: ["https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800"],
    category: "clips",
    occasions: ["everyday", "office"],
    rating: 4.5,
    reviewCount: 203,
    isBestSeller: true,
  },
  {
    id: "5",
    title: "Knotted Headband — Satin Ivory",
    slug: "knotted-headband-satin-ivory",
    description: "A padded, knotted satin headband that sits comfortably all day without pinching behind the ears.",
    price: 399,
    images: ["https://images.unsplash.com/photo-1520763185298-1b434c919102?w=800"],
    category: "headbands",
    occasions: ["everyday", "bridal"],
    rating: 4.6,
    reviewCount: 97,
  },
  {
    id: "6",
    title: "No-Crease Hair Tie Set (Pack of 10)",
    slug: "no-crease-hair-tie-set",
    description: "Ten spiral hair ties in mixed neutral tones — no dent, no snag, gentle enough for everyday wear.",
    price: 199,
    images: ["https://images.unsplash.com/photo-1544816155-12df9643f363?w=800"],
    category: "hair-ties",
    occasions: ["everyday", "office"],
    rating: 4.4,
    reviewCount: 174,
  },
  {
    id: "7",
    title: "Crystal Bridal Hair Vine",
    slug: "crystal-bridal-hair-vine",
    description: "A handcrafted crystal hair vine for updos and half-up styles — a bridal party favourite.",
    price: 899,
    discountPrice: 749,
    images: ["https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=800"],
    category: "hair-pins",
    occasions: ["bridal", "festive"],
    rating: 4.9,
    reviewCount: 64,
    isFeatured: true,
    personalizationAvailable: true,
  },
  {
    id: "8",
    title: "Silk Scrunchie — Emerald",
    slug: "silk-scrunchie-emerald",
    description: "Pure mulberry silk scrunchie in emerald — kind to hair strands and doubles as a wrist accessory.",
    price: 349,
    discountPrice: 279,
    images: ["https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=800"],
    category: "scrunchies",
    occasions: ["party", "festive"],
    rating: 4.6,
    reviewCount: 112,
    isBestSeller: true,
  },
];

export const categories = [
  { label: "Scrunchies", value: "scrunchies" },
  { label: "Claw Clips", value: "clips" },
  { label: "Clutchers", value: "clutchers" },
  { label: "Headbands", value: "headbands" },
  { label: "Hair Pins", value: "hair-pins" },
  { label: "Hair Ties", value: "hair-ties" },
] as const;

export const occasions = [
  { label: "Everyday", value: "everyday" },
  { label: "Office", value: "office" },
  { label: "Party", value: "party" },
  { label: "Festive", value: "festive" },
  { label: "Bridal", value: "bridal" },
] as const;
