// Set these in .env.local / Vercel to point at your real profiles. Instagram
// already has a real default below so the footer and JSON-LD sameAs work
// out of the box; X/LinkedIn/WhatsApp stay generic placeholders until an
// env var is set for them.
const INSTAGRAM_URL = "https://www.instagram.com/citymitra_/";

export const socialProfiles = {
  x: process.env.NEXT_PUBLIC_SOCIAL_X || "https://x.com",
  instagram: process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM || INSTAGRAM_URL,
  linkedin: process.env.NEXT_PUBLIC_SOCIAL_LINKEDIN || "https://linkedin.com",
  whatsapp: process.env.NEXT_PUBLIC_SOCIAL_WHATSAPP || "https://whatsapp.com"
};

// Only profiles with a real (non-placeholder) URL — safe to publish in
// structured data so search engines link the brand entity to these
// accounts instead of pointing at generic platform homepages.
export const knownSocialProfiles = [
  socialProfiles.instagram,
  ...(process.env.NEXT_PUBLIC_SOCIAL_X ? [socialProfiles.x] : []),
  ...(process.env.NEXT_PUBLIC_SOCIAL_LINKEDIN ? [socialProfiles.linkedin] : [])
];
