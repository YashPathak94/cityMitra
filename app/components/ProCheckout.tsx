"use client";

import { Check, Loader2, ShieldCheck, Sparkles } from "lucide-react";
import { useState } from "react";
import { trackActivity } from "@/lib/tracking";

type RazorpayResponse = {
  razorpay_payment_id: string;
  razorpay_order_id?: string;
  razorpay_subscription_id?: string;
  razorpay_signature: string;
};

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void };
  }
}

function loadRazorpayScript() {
  return new Promise<boolean>((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function ProCheckout({ priceInr, onPurchased }: { priceInr: number; onPurchased?: () => void }) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function startCheckout() {
    setStatus("loading");
    setMessage("");
    trackActivity({ type: "pro_checkout_start", label: "pro" });

    try {
      const checkoutResponse = await fetch("/api/pro/checkout", { method: "POST" });
      const data = (await checkoutResponse.json().catch(() => ({}))) as {
        mode?: "order" | "subscription";
        orderId?: string;
        subscriptionId?: string;
        amount?: number;
        currency?: string;
        keyId?: string;
        error?: string;
      };

      if (!checkoutResponse.ok || (!data.orderId && !data.subscriptionId)) {
        setStatus("error");
        setMessage(data.error || "Could not start checkout. Please try again.");
        return;
      }

      const loaded = await loadRazorpayScript();
      if (!loaded || !window.Razorpay) {
        setStatus("error");
        setMessage("Could not load the secure payment window. Check your connection.");
        return;
      }

      const isSubscription = data.mode === "subscription" && Boolean(data.subscriptionId);
      const razorpay = new window.Razorpay({
        key: data.keyId,
        name: "CityMitra Pro",
        description: isSubscription ? "CityMitra Pro · monthly auto-renew" : "CityMitra Pro membership",
        theme: { color: "#ea580c" },
        ...(isSubscription
          ? { subscription_id: data.subscriptionId }
          : { order_id: data.orderId, amount: data.amount, currency: data.currency }),
        handler: async (response: RazorpayResponse) => {
          setStatus("loading");
          const verifyResponse = await fetch("/api/pro/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(response)
          });
          if (verifyResponse.ok) {
            setStatus("success");
            setMessage(
              isSubscription
                ? "You're subscribed to CityMitra Pro — it renews automatically each month."
                : "Welcome to CityMitra Pro! Your payment is confirmed."
            );
            trackActivity({ type: "pro_purchase_confirmed", label: response.razorpay_subscription_id || response.razorpay_order_id });
            onPurchased?.();
          } else {
            setStatus("error");
            setMessage("Payment captured but verification failed. Contact support with your payment id.");
          }
        },
        modal: {
          ondismiss: () => {
            setStatus("idle");
          }
        }
      });
      razorpay.open();
    } catch {
      setStatus("error");
      setMessage("Something went wrong starting checkout. Please try again.");
    }
  }

  if (status === "success") {
    return (
      <div className="proSuccess" role="status">
        <Check size={20} />
        <strong>{message}</strong>
      </div>
    );
  }

  return (
    <div className="proCheckout">
      <button className="primaryButton" type="button" onClick={startCheckout} disabled={status === "loading"}>
        {status === "loading" ? <Loader2 size={18} className="spin" /> : <Sparkles size={18} />}
        {status === "loading" ? "Starting secure checkout…" : `Get CityMitra Pro · ₹${priceInr}/mo`}
      </button>
      <span className="proSecure">
        <ShieldCheck size={14} />
        Secured by Razorpay · UPI, cards, netbanking
      </span>
      {status === "error" && message && <p className="proError">{message}</p>}
    </div>
  );
}
