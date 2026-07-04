"use client";

import { Check, Send, Star } from "lucide-react";
import { FormEvent, useState, useSyncExternalStore } from "react";
import { trackActivity } from "@/lib/tracking";

const doneKey = "citymitra-feedback-done";

function subscribeToStorage(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function readStoredDone() {
  try {
    return Boolean(window.localStorage.getItem(doneKey));
  } catch {
    return false; // private mode — just show the widget
  }
}

// Compact one-row feedback strip: tap a star, optionally add a one-line note,
// send. Rides on the existing activity pipeline (type "feedback", value =
// rating, label = note) so there's no new API surface and it shows up in the
// admin analytics alongside other events.
export default function FeedbackBand({ city }: { city: string }) {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [note, setNote] = useState("");
  const [sent, setSent] = useState(false);
  const storedDone = useSyncExternalStore(subscribeToStorage, readStoredDone, () => false);
  const done = sent || storedDone;

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!rating) return;
    trackActivity({ type: "feedback", city, value: rating, label: note.trim().slice(0, 140) || undefined });
    try {
      window.localStorage.setItem(doneKey, "1");
    } catch {
      // ignore
    }
    setSent(true);
  }

  if (done) {
    return (
      <section className="feedbackBand feedbackBandDone" aria-label="Feedback">
        <Check size={16} />
        <p>Thanks for the feedback — it directly shapes what we build next.</p>
      </section>
    );
  }

  return (
    <section className="feedbackBand" aria-label="Feedback">
      <form onSubmit={submit}>
        <span className="feedbackPrompt">How&apos;s CityMitra working for you?</span>

        <div className="feedbackStars" role="radiogroup" aria-label="Rate CityMitra out of 5 stars">
          {[1, 2, 3, 4, 5].map((value) => {
            const active = value <= (hovered || rating);
            return (
              <button
                key={value}
                type="button"
                role="radio"
                aria-checked={rating === value}
                aria-label={`${value} star${value > 1 ? "s" : ""}`}
                className={active ? "feedbackStar active" : "feedbackStar"}
                onMouseEnter={() => setHovered(value)}
                onMouseLeave={() => setHovered(0)}
                onClick={() => setRating(value)}
              >
                <Star size={19} />
              </button>
            );
          })}
        </div>

        {rating > 0 && (
          <div className="feedbackDetail">
            <input
              value={note}
              maxLength={140}
              placeholder={rating >= 4 ? "What worked well? (optional)" : "What should we fix? (optional)"}
              onChange={(event) => setNote(event.target.value)}
              aria-label="Feedback note (optional)"
            />
            <button type="submit" className="feedbackSend">
              <Send size={14} /> Send
            </button>
          </div>
        )}
      </form>
    </section>
  );
}
