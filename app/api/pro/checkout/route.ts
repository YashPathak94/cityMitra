import { NextRequest, NextResponse } from "next/server";
import { readSessionToken, SESSION_COOKIE } from "@/lib/auth";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { proPriceInr, razorpayConfigured, razorpayPlanId, subscriptionsEnabled } from "@/lib/pro";

export const runtime = "nodejs";

function authHeader() {
  const auth = Buffer.from(`${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`).toString("base64");
  return `Basic ${auth}`;
}

export async function POST(request: NextRequest) {
  const limit = rateLimit(`pro-checkout:${clientIp(request)}`, 10, 60 * 1000);
  if (!limit.ok) {
    return NextResponse.json({ error: "Too many attempts. Try again in a minute." }, { status: 429 });
  }

  if (!razorpayConfigured()) {
    return NextResponse.json(
      { error: "Payments are not configured yet. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET." },
      { status: 503 }
    );
  }

  // Must be logged in so the purchase ties to an account.
  const session = readSessionToken(request.cookies.get(SESSION_COOKIE)?.value);
  if (!session) {
    return NextResponse.json({ error: "Please log in first." }, { status: 401 });
  }

  const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID;

  try {
    // Preferred path: real monthly subscription with auto-renewal.
    if (subscriptionsEnabled()) {
      const response = await fetch("https://api.razorpay.com/v1/subscriptions", {
        method: "POST",
        headers: { Authorization: authHeader(), "Content-Type": "application/json" },
        body: JSON.stringify({
          plan_id: razorpayPlanId(),
          total_count: 120, // up to 120 monthly cycles (~10 years); renews automatically
          customer_notify: 1,
          notes: { email: session.email, product: "CityMitra Pro" }
        })
      });
      const subscription = (await response.json()) as { id?: string; error?: { description?: string } };

      if (!response.ok || !subscription.id) {
        return NextResponse.json({ error: subscription.error?.description || "Could not start subscription." }, { status: 502 });
      }

      return NextResponse.json({ mode: "subscription", subscriptionId: subscription.id, keyId });
    }

    // Fallback: one-time payment (no plan configured).
    const amountPaise = Math.max(100, Math.round(proPriceInr * 100));
    const response = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: { Authorization: authHeader(), "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: amountPaise,
        currency: "INR",
        receipt: `pro_${Date.now()}`,
        notes: { email: session.email, product: "CityMitra Pro" }
      })
    });
    const order = (await response.json()) as { id?: string; error?: { description?: string } };

    if (!response.ok || !order.id) {
      return NextResponse.json({ error: order.error?.description || "Could not create payment order." }, { status: 502 });
    }

    return NextResponse.json({ mode: "order", orderId: order.id, amount: amountPaise, currency: "INR", keyId });
  } catch (error) {
    console.error("razorpay checkout failed", error);
    return NextResponse.json({ error: "Payment service unavailable. Try again later." }, { status: 502 });
  }
}
