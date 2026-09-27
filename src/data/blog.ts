export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  content: string[];
  publishedAt: string;
};

export const posts: BlogPost[] = [
  {
    slug: "gift-ideas-for-anniversaries",
    title: "12 anniversary gift ideas that don't feel generic",
    excerpt: "From personalized star maps to hand-tied bouquets — gifts that mark the year without repeating last year's.",
    content: [
      "Anniversary gifts get a bad reputation for being predictable — chocolates, flowers, done. The trick is picking something that references the two of you specifically, rather than the occasion in general.",
      "A personalized star map keyed to the date and place you met turns an abstract idea into something you can point to on a wall. Jewellery works the same way when it's engraved rather than generic — initials, a date, a coordinate.",
      "If you'd rather give an experience than an object, a hamper built around a shared ritual — the coffee you both drink, the snack you always split — reads as more considered than a bigger, more expensive box.",
    ],
    publishedAt: "2026-06-02",
  },
  {
    slug: "how-to-write-a-gift-message",
    title: "How to write a gift message people actually keep",
    excerpt: "Short beats clever. A few lines on what to say, and what to leave out.",
    content: [
      "The best gift messages are specific and short. Naming one real detail — an inside joke, a shared memory — does more work than a paragraph of generic warmth.",
      "Avoid explaining the gift itself; let it speak for itself. Use the message for the relationship, not the receipt.",
    ],
    publishedAt: "2026-05-14",
  },
];
