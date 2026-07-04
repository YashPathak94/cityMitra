import type { Metadata } from "next";
import PageShell from "@/app/components/PageShell";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "What CityMitra collects, why, where it is stored, and how to have it removed.",
  alternates: { canonical: "/privacy" }
};

const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "helpdesk@ctmitra.com";

export default function PrivacyPage() {
  return (
    <PageShell>
      <article className="policyPage">
        <h1>Privacy Policy</h1>
        <p>
          <i>Last updated: July 2026.</i> This policy explains what CityMitra (“we”) collects when you use this
          website, why we collect it, and the choices you have.
        </p>

        <h2>What we collect</h2>
        <ul>
          <li>
            <b>Usage events.</b> Page views, city/category selections, search and chat submissions (first 80
            characters), map opens, and time on page. Events carry a random visitor identifier stored in an
            HTTP-only cookie (<code>citymitra_visitor</code>) and a random session identifier in your browser’s
            localStorage. Neither contains your name, email, or account data.
          </li>
          <li>
            <b>Location, only if you allow it.</b> If you tap “Use my nearby location”, your browser asks for
            permission and we use your coordinates to set your city and build map links. Coordinates are stored in
            your own browser (localStorage), not in our database. Reverse-geocoding uses OpenStreetMap’s Nominatim
            service.
          </li>
          <li>
            <b>Newsletter email.</b> If you subscribe, we store your email address and the subscription time, used
            only to send the newsletter. Unsubscribe or request deletion any time via email.
          </li>
          <li>
            <b>Chat content.</b> Questions you send to the AI guide are forwarded to OpenAI’s API to generate the
            answer. We instruct the API not to store conversations for training (<code>store: false</code>). Do not
            include sensitive personal information in chat.
          </li>
        </ul>

        <h2>What we do not do</h2>
        <ul>
          <li>We do not sell personal data.</li>
          <li>We do not require accounts or collect names, phone numbers, or payment details.</li>
        </ul>

        <h2>Advertising (Google AdSense)</h2>
        <p>
          CityMitra shows ads served by Google AdSense. Google, as a third-party vendor, uses cookies (including the
          DoubleClick/Google Ads cookie) to serve ads based on your visits to this site and other sites on the
          internet. This may include personalised advertising unless you opt out.
        </p>
        <ul>
          <li>
            You can opt out of personalised advertising by visiting{" "}
            <a href="https://adssettings.google.com" target="_blank" rel="noreferrer">
              Google Ads Settings
            </a>
            , or opt out of third-party vendor cookies generally at{" "}
            <a href="https://www.aboutads.info/choices/" target="_blank" rel="noreferrer">
              www.aboutads.info
            </a>
            .
          </li>
          <li>
            How Google uses information from sites that use its services is explained at{" "}
            <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noreferrer">
              policies.google.com/technologies/partner-sites
            </a>
            .
          </li>
          <li>We do not control the content of ads served by AdSense or the data Google collects to select them.</li>
        </ul>

        <h2>Third-party services</h2>
        <p>
          Pages embed Google Maps previews (Google’s privacy policy applies inside the frame), load city photos via
          Wikipedia/Wikimedia Commons and Unsplash, use OpenStreetMap Nominatim for optional reverse-geocoding, use
          OpenAI for chat answers, and serve ads via Google AdSense (see above). Links out to Google Maps, WhatsApp,
          Instagram, X, and LinkedIn are governed by those platforms’ policies.
        </p>

        <h2>Retention & your choices</h2>
        <p>
          Usage events are capped at a rolling window of recent records. The visitor cookie expires after one year;
          you can clear it (and localStorage) from your browser at any time. For newsletter removal or any data
          question, email <a href={`mailto:${contactEmail}?subject=Privacy%20request`}>{contactEmail}</a> with the
          subject “Privacy request” and we will act within 30 days.
        </p>

        <h2>Children</h2>
        <p>CityMitra is a general-audience travel and city-information service and does not knowingly collect data from children under 13.</p>

        <h2>Changes</h2>
        <p>We will update this page when our practices change and adjust the “last updated” date above.</p>
      </article>
    </PageShell>
  );
}
