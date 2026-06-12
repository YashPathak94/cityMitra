import type { Metadata } from "next";
import { Mail, MessageCircle, Store } from "lucide-react";
import PageShell from "@/app/components/PageShell";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact CityMitra for support, corrections, business listings, and partnership enquiries.",
  alternates: { canonical: "/contact" }
};

const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "raj.yash.pathak@gmail.com";

export default function ContactPage() {
  return (
    <PageShell>
      <article className="policyPage">
        <h1>Contact CityMitra</h1>
        <p>
          Questions, corrections, or business enquiries — we read everything. Expect a reply within 2–3 working days.
        </p>
        <div className="contactCards">
          <a href={`mailto:${contactEmail}?subject=CityMitra%20support`}>
            <Mail size={20} />
            <h2>Support & corrections</h2>
            <p>Wrong listing, broken page, or a guide update we should make? Email us at {contactEmail}.</p>
          </a>
          <a href={`mailto:${contactEmail}?subject=CityMitra%20business`}>
            <Store size={20} />
            <h2>Business & listings</h2>
            <p>Featured listings, category sponsorships, and partnerships for shops, hotels, and services.</p>
          </a>
          <a href={`mailto:${contactEmail}?subject=CityMitra%20feedback`}>
            <MessageCircle size={20} />
            <h2>Feedback</h2>
            <p>Tell us what city or category to cover next, or what the AI guide should do better.</p>
          </a>
        </div>
        <h2>Postal & legal</h2>
        <p>
          CityMitra operates from India. For legal and privacy requests, use the email above with the subject
          “Privacy request” — see our <a href="/privacy">Privacy Policy</a> for what we store and how to have it removed.
        </p>
      </article>
    </PageShell>
  );
}
