import { NextRequest, NextResponse } from "next/server";
import { readSessionToken, SESSION_COOKIE } from "@/lib/auth";
import { razorpayConfigured } from "@/lib/pro";
import { getUserByEmail, setUserSubscription } from "@/lib/storage";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const session = readSessionToken(request.cookies.get(SESSION_COOKIE)?.value);
  if (!session) {
    return NextResponse.json({ error: "Please log in first." }, { status: 401 });
  }

  try {
    const user = await getUserByEmail(session.email);
    if (!user?.subscriptionId) {
      return NextResponse.json({ error: "No active subscription to cancel." }, { status: 400 });
    }

    if (razorpayConfigured()) {
      const auth = Buffer.from(`${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`).toString("base64");
      // Cancel at the end of the current cycle so the user keeps Pro until it expires.
      const response = await fetch(`https://api.razorpay.com/v1/subscriptions/${user.subscriptionId}/cancel`, {
        method: "POST",
        headers: { Authorization: `Basic ${auth}`, "Content-Type": "application/json" },
        body: JSON.stringify({ cancel_at_cycle_end: 1 })
      });
      if (!response.ok) {
        const detail = (await response.json().catch(() => ({}))) as { error?: { description?: string } };
        return NextResponse.json({ error: detail.error?.description || "Could not cancel with the payment provider." }, { status: 502 });
      }
    }

    await setUserSubscription(session.email, { subscriptionStatus: "cancelled" });
    return NextResponse.json({ ok: true, message: "Subscription will not renew. Pro stays active until the period ends." });
  } catch (error) {
    console.error("cancel subscription failed", error);
    return NextResponse.json({ error: "Could not cancel right now. Please try again." }, { status: 500 });
  }
}
