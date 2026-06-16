import { createHmac, timingSafeEqual } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { getUserBySubscriptionId, setUserSubscription } from "@/lib/storage";

export const runtime = "nodejs";

function safeEqualHex(a: string, b: string) {
  const bufferA = Buffer.from(a, "hex");
  const bufferB = Buffer.from(b, "hex");
  return bufferA.length === bufferB.length && timingSafeEqual(bufferA, bufferB);
}

// Razorpay calls this on subscription lifecycle events so Pro stays in sync
// with renewals, failed charges, and cancellations (auto-renewal handling).
export async function POST(request: NextRequest) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "Webhook not configured." }, { status: 503 });
  }

  const rawBody = await request.text();
  const signature = request.headers.get("x-razorpay-signature") || "";
  const expected = createHmac("sha256", secret).update(rawBody).digest("hex");

  if (!signature || !safeEqualHex(expected, signature)) {
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  let event: {
    event?: string;
    payload?: { subscription?: { entity?: { id?: string; current_end?: number } } };
  };
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Bad payload." }, { status: 400 });
  }

  const subscription = event.payload?.subscription?.entity;
  const subscriptionId = subscription?.id;

  if (!subscriptionId) {
    return NextResponse.json({ ok: true, ignored: true });
  }

  try {
    const user = await getUserBySubscriptionId(subscriptionId);
    if (!user) return NextResponse.json({ ok: true, ignored: true });

    const periodEnd = subscription?.current_end ? new Date(subscription.current_end * 1000).toISOString() : undefined;

    switch (event.event) {
      case "subscription.charged":
      case "subscription.activated":
      case "subscription.resumed":
        // Renewal succeeded — keep Pro on and extend the period.
        await setUserSubscription(user.email, {
          isPro: true,
          subscriptionStatus: "active",
          currentPeriodEnd: periodEnd
        });
        break;
      case "subscription.halted":
      case "subscription.cancelled":
      case "subscription.completed":
      case "subscription.expired":
        // No more renewals — revoke Pro.
        await setUserSubscription(user.email, {
          isPro: false,
          subscriptionStatus: event.event.replace("subscription.", "")
        });
        break;
      default:
        break;
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("razorpay webhook failed", error);
    return NextResponse.json({ error: "Webhook processing error." }, { status: 500 });
  }
}
