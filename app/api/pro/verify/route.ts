import { createHmac, timingSafeEqual } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { readSessionToken, SESSION_COOKIE } from "@/lib/auth";
import { appendActivity, setUserPro } from "@/lib/storage";

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
    razorpay_order_id?: string;
    razorpay_payment_id?: string;
    razorpay_signature?: string;
    email?: string;
  } | null;

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = payload || {};

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return NextResponse.json({ error: "Missing payment fields." }, { status: 400 });
  }

  const expected = createHmac("sha256", secret)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (!safeEqualHex(expected, razorpay_signature)) {
    return NextResponse.json({ error: "Payment verification failed." }, { status: 400 });
  }

  // upgrade the logged-in account to Pro (best-effort)
  const session = readSessionToken(request.cookies.get(SESSION_COOKIE)?.value);
  if (session) {
    await setUserPro(session.email, true).catch((error) => console.error("pro upgrade failed", error));
  }

  // record the successful purchase as an activity event (best-effort)
  await appendActivity({
    type: "pro_purchase",
    label: `${razorpay_order_id} ${session?.email || payload?.email || ""}`.trim().slice(0, 160),
    timestamp: new Date().toISOString()
  }).catch((error) => console.error("pro purchase record failed", error));

  return NextResponse.json({ ok: true, isPro: Boolean(session) });
}
