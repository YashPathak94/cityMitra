import { createHmac, timingSafeEqual } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { readSessionToken, SESSION_COOKIE } from "@/lib/auth";
import { appendActivity, setUserPro, setUserSubscription } from "@/lib/storage";

export const runtime = "nodejs";

function safeEqualHex(a: string, b: string) {
  const bufferA = Buffer.from(a, "hex");
  const bufferB = Buffer.from(b, "hex");
  return bufferA.length === bufferB.length && timingSafeEqual(bufferA, bufferB);
}

export async function POST(request: NextRequest) {
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "Payments not configured." }, { status: 503 });
  }

  const payload = (await request.json().catch(() => null)) as {
    razorpay_payment_id?: string;
    razorpay_order_id?: string;
    razorpay_subscription_id?: string;
    razorpay_signature?: string;
  } | null;

  const paymentId = payload?.razorpay_payment_id;
  const signature = payload?.razorpay_signature;

  if (!paymentId || !signature) {
    return NextResponse.json({ error: "Missing payment fields." }, { status: 400 });
  }

  // Subscriptions sign as payment_id|subscription_id; one-time as order_id|payment_id.
  const isSubscription = Boolean(payload?.razorpay_subscription_id);
  const signedData = isSubscription
    ? `${paymentId}|${payload?.razorpay_subscription_id}`
    : `${payload?.razorpay_order_id}|${paymentId}`;

  if (!isSubscription && !payload?.razorpay_order_id) {
    return NextResponse.json({ error: "Missing payment fields." }, { status: 400 });
  }

  const expected = createHmac("sha256", secret).update(signedData).digest("hex");
  if (!safeEqualHex(expected, signature)) {
    return NextResponse.json({ error: "Payment verification failed." }, { status: 400 });
  }

  const session = readSessionToken(request.cookies.get(SESSION_COOKIE)?.value);
  if (session) {
    if (isSubscription) {
      await setUserSubscription(session.email, {
        isPro: true,
        subscriptionId: payload?.razorpay_subscription_id,
        subscriptionStatus: "active"
      }).catch((error) => console.error("pro subscription save failed", error));
    } else {
      await setUserPro(session.email, true).catch((error) => console.error("pro upgrade failed", error));
    }
  }

  await appendActivity({
    type: isSubscription ? "pro_subscribed" : "pro_purchase",
    label: `${payload?.razorpay_subscription_id || payload?.razorpay_order_id || ""} ${session?.email || ""}`.trim().slice(0, 160),
    timestamp: new Date().toISOString()
  }).catch((error) => console.error("pro purchase record failed", error));

  return NextResponse.json({ ok: true, isPro: Boolean(session) });
}
