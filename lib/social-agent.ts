// Content-growth agent for CityMitra's social channels.
//
// Runs unattended via Vercel Cron (see vercel.json) hitting
// /api/agents/social-content daily: picks the day's topic from a fixed
// rotation, generates a LinkedIn post + X post (<280 chars) + Instagram
// caption + hashtags + image idea + CTA in a founder build-in-public tone,
// and stores the batch durably. When OPENAI_API_KEY is missing or the call
// fails, a deterministic template batch is produced instead so the daily
// cadence never breaks.
//
// Honesty rules baked into both paths: it's an independent MVP / learning
// initiative, no invented metrics or user counts, no exaggerated claims.

export type SocialPostContent = {
  linkedin: string;
  x: string;
  instagram: string;
  hashtags: string[];
  imageIdea: string;
  cta: string;
};

export type SocialPost = {
  id: string; // YYYY-MM-DD
  topic: string;
  source: "ai" | "template";
  content: SocialPostContent;
  createdAt: string;
};

export type SocialTopic = {
  key: string;
  name: string;
  angle: string;
  url: string;
};

// Rotation of product truths the agent may talk about. Every claim here is
// verifiably true of the live product — the prompt forbids going beyond it.
export const SOCIAL_TOPICS: SocialTopic[] = [
  {
    key: "hyperlocal",
    name: "Hyperlocal discovery",
    angle:
      "30+ practical categories per city (wholesale markets, street food, EV chargers, doctors, public restrooms, sports academies) — each two taps from a Google Maps route. Cities: Delhi, Mumbai, Bengaluru, Jaipur, Surat, Hyderabad, Leh.",
    url: "https://ctmitra.com"
  },
  {
    key: "city-chat",
    name: "City Chat",
    angle:
      "An AI guide that answers like a local and keeps it short — named places, areas, timing hints. Booking handoffs to Cleartrip, Booking.com, Uber, Practo etc. It never claims live availability; Google Maps handles the live part.",
    url: "https://ctmitra.com/chat"
  },
  {
    key: "travel-plan",
    name: "Travel Plan",
    angle:
      "Enter destination, date and budget; get a month-by-month saving plan with transport fare ranges, hotel tiers, and card-reward math. Honest by design: illustrative returns with a disclaimer, never 'guaranteed returns' or 'free travel'.",
    url: "https://ctmitra.com/travel-plan"
  },
  {
    key: "city-guides",
    name: "City Guides",
    angle:
      "Neighbourhood-level guides: best time to visit, how to get around, which areas do what, and an honest budget note — for seven Indian cities at launch.",
    url: "https://ctmitra.com/cities"
  },
  {
    key: "blog",
    name: "The blog",
    angle:
      "Practical write-ups: wholesale market buyer's guides, trip-funding math, utility finding (EV chargers, restrooms), and how-to posts for every feature.",
    url: "https://ctmitra.com/blog"
  },
  {
    key: "local-services",
    name: "Local services & recommendations",
    angle:
      "The unglamorous everyday searches — plumber, electrician, AC repair, pest control, packers & movers, laundry — treated as first-class categories with map-ready searches per city.",
    url: "https://ctmitra.com"
  },
  {
    key: "free-no-signup",
    name: "Free & sign-up-free",
    angle:
      "Everything core — browsing, AI chat, travel plans, PDF export — works with no account. Funded by disclosed partner commissions and ads, not data sales.",
    url: "https://ctmitra.com/blog/citymitra-free-no-signup-explained"
  },
  {
    key: "offers",
    name: "Offers & deals",
    angle:
      "A deals rail with real partner discounts (Booking.com, Agoda, MakeMyTrip, Cleartrip, Myntra). Slots without a live deal say 'Coming soon' instead of showing a fabricated discount.",
    url: "https://ctmitra.com/offers"
  }
];

export function topicForDate(date: Date): SocialTopic {
  const start = Date.UTC(date.getUTCFullYear(), 0, 0);
  const dayOfYear = Math.floor((date.getTime() - start) / 86_400_000);
  return SOCIAL_TOPICS[dayOfYear % SOCIAL_TOPICS.length];
}

export function socialPrompt(topic: SocialTopic): string {
  return (
    `You are the content growth agent for CityMitra, an AI-powered city discovery and hyperlocal reach platform at ctmitra.com. ` +
    `Create today's professional social content focused on this feature:\n\n` +
    `Feature: ${topic.name}\nWhat is true about it: ${topic.angle}\nLink: ${topic.url}\n\n` +
    `Tone: professional, interesting, founder-style build-in-public. Not exaggerated. Written by someone building this ` +
    `independently outside full-time work — mention it is an independent MVP and learning initiative where it fits naturally. ` +
    `HARD RULES: do not invent metrics, user counts, testimonials, or capabilities beyond "what is true" above. ` +
    `No guaranteed-returns or free-travel claims. The X post MUST be under 260 characters including the link.\n\n` +
    `Return ONLY JSON: {` +
    `"linkedin": string (a full LinkedIn post, 120-220 words, short paragraphs or tight bullets, ends inviting feedback), ` +
    `"x": string (<260 chars including ${topic.url}), ` +
    `"instagram": string (60-120 words, line breaks, at most one emoji per line, ends with "link in bio"), ` +
    `"hashtags": string[] (exactly 5, no # collisions with generic spam tags), ` +
    `"imageIdea": string (<=200 chars, something makeable in Canva from a real product screenshot — no stock-photo-only ideas), ` +
    `"cta": string (<=140 chars, one clear action)}`
  );
}

const str = (value: unknown, max: number) => String(value ?? "").trim().slice(0, max);

export function coerceSocialContent(raw: Record<string, unknown>, topic: SocialTopic): SocialPostContent | null {
  const linkedin = str(raw.linkedin, 2600);
  let x = str(raw.x, 280);
  const instagram = str(raw.instagram, 2000);
  if (!linkedin || !x || !instagram) return null;

  // Enforce the X limit even if the model overshoots: trim to the last full
  // word and re-append the link if truncation dropped it.
  if (x.length > 279) {
    const withoutLink = x.replace(topic.url, "").trim();
    const room = 279 - (topic.url.length + 1);
    x = `${withoutLink.slice(0, room).replace(/\s+\S*$/, "")} ${topic.url}`;
  }

  const hashtags = Array.isArray(raw.hashtags)
    ? raw.hashtags.map((tag) => str(tag, 40).replace(/^#/, "")).filter(Boolean).slice(0, 5)
    : [];

  return {
    linkedin,
    x,
    instagram,
    hashtags: hashtags.length ? hashtags : ["BuildInPublic", "IndianCities", "TravelTech", "HyperlocalDiscovery", "SideProject"],
    imageIdea:
      str(raw.imageIdea, 220) ||
      "Phone mockup of the CityMitra home screen on a warm cream background with the tagline and ctmitra.com.",
    cta: str(raw.cta, 160) || `Try it free at ${topic.url} — no sign-up. Tell me what your city needs next.`
  };
}

// Deterministic fallback so the daily cadence survives OpenAI being
// unavailable. Plain but honest — clearly better than a silent gap.
export function templateContent(topic: SocialTopic): SocialPostContent {
  return {
    linkedin:
      `I've been building CityMitra (ctmitra.com) outside work hours — an AI city guide for India, and an independent MVP / learning initiative.\n\n` +
      `Today's focus: ${topic.name}.\n\n${topic.angle}\n\n` +
      `It's free and needs no sign-up. If you try it, I'd genuinely value feedback — especially what's missing for your city: ${topic.url}`,
    x: `Building CityMitra nights & weekends — an AI city guide for India. Today: ${topic.name}. Free, no sign-up. It's an MVP and a learning project. ${topic.url}`,
    instagram:
      `${topic.name} on CityMitra 🧭\n\n${topic.angle}\n\nBuilt independently as a learning project. Free, no sign-up.\n\nTry it — link in bio.`,
    hashtags: ["BuildInPublic", "IndianCities", "TravelTech", "HyperlocalDiscovery", "SideProject"],
    imageIdea: `Phone mockup showing CityMitra's ${topic.name} screen on a warm cream background, with "${topic.name}" as headline text and ctmitra.com below.`,
    cta: `Try it free at ${topic.url} — no sign-up. Tell me what your city needs next.`
  };
}
