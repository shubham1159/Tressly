export function formatINR(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function computeOrderTotals(subtotal: number, shippingFlat = 79, freeShippingAbove = 999) {
  const shipping = subtotal >= freeShippingAbove || subtotal === 0 ? 0 : shippingFlat;
  const gst = Math.round(subtotal * 0.18);
  const total = subtotal + shipping + gst;
  return { subtotal, shipping, gst, total };
}
