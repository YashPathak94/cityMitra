import { NextRequest, NextResponse } from "next/server";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { proPriceInr, razorpayConfigured } from "@/lib/pro";

export const runtime = "nodejs";

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

  const auth = Buffer.from(`${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`).toString("base64");
  const amountPaise = Math.max(100, Math.round(proPriceInr * 100));

  try {
    const response = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: { Authorization: `Basic ${auth}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: amountPaise,
        currency: "INR",
        receipt: `pro_${Date.now()}`,
        notes: { product: "CityMitra Pro" }
      })
    });

    const order = (await response.json()) as { id?: string; error?: { description?: string } };

    if (!response.ok || !order.id) {
      return NextResponse.json(
        { error: order.error?.description || "Could not create payment order." },
        { status: 502 }
      );
    }

    return NextResponse.json({
      orderId: order.id,
      amount: amountPaise,
      currency: "INR",
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID
    });
  } catch (error) {
    console.error("razorpay order failed", error);
    return NextResponse.json({ error: "Payment service unavailable. Try again later." }, { status: 502 });
  }
}
