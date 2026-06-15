"use client";

import { Check, Loader2, ShieldCheck, Sparkles } from "lucide-react";
import { useState } from "react";
import { trackActivity } from "@/lib/tracking";

type RazorpayResponse = {
  razorpay_payment_id: string;
  razorpay_order_id: string;
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

export default function ProCheckout({ priceInr }: { priceInr: number }) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function startCheckout() {
    setStatus("loading");
    setMessage("");
    trackActivity({ type: "pro_checkout_start", label: "pro" });

    try {
      const orderResponse = await fetch("/api/pro/checkout", { method: "POST" });
      const orderData = (await orderResponse.json().catch(() => ({}))) as {
        orderId?: string;
        amount?: number;
        currency?: string;
        keyId?: string;
        error?: string;
      };

      if (!orderResponse.ok || !orderData.orderId) {
        setStatus("error");
        setMessage(orderData.error || "Could not start checkout. Please try again.");
        return;
      }

      const loaded = await loadRazorpayScript();
      if (!loaded || !window.Razorpay) {
        setStatus("error");
        setMessage("Could not load the secure payment window. Check your connection.");
        return;
      }

      const razorpay = new window.Razorpay({
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "CityMitra Pro",
        description: "CityMitra Pro membership",
        order_id: orderData.orderId,
        theme: { color: "#ea580c" },
        handler: async (response: RazorpayResponse) => {
          setStatus("loading");
          const verifyResponse = await fetch("/api/pro/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(response)
          });
          if (verifyResponse.ok) {
            setStatus("success");
            setMessage("Welcome to CityMitra Pro! Your payment is confirmed.");
            trackActivity({ type: "pro_purchase_confirmed", label: response.razorpay_order_id });
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
