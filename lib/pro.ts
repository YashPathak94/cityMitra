export const proPriceInr = Number(process.env.NEXT_PUBLIC_PRO_PRICE_INR || "199");

export const proFeatures = [
  "Curated, verified trip plans — hand-checked routes, timings, and backups",
  "Booking concierge with side-by-side flight, hotel, train, and cab options",
  "Negotiation guidance — best time to book and price-drop tactics",
  "Priority human agent support for planning anything, end to end",
  "Detailed interactive maps from your live location to every stop",
  "Unlimited longer AI plans and unbranded PDF exports"
];

export function razorpayConfigured() {
  return Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET);
}

export function razorpayPublicKey() {
  return process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID || "";
}
