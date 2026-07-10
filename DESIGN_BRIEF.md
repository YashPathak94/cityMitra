# CityMitra — Website Redesign Brief

> **Hand-off doc for Claude Design / Fable.** This describes what CityMitra
> *is* today (product, pages, flows, current design system) and the exact
> visual direction we want next: **vibrant color, real depth / 3D, Gen-Z
> energy, motion-first (Framer Motion).** Keep the product, content, and
> flows — transform the *visual + motion layer*.

---

## 0. TL;DR (paste-this-first summary)

Redesign **ctmitra.com** — an AI-powered city-discovery + travel-planning
app for India — from a clean, warm, "cream & orange" editorial look into a
**vibrant, dimensional, Gen-Z, motion-driven** experience.

- **Keep:** the CityMitra brand, the orange→blue signature gradient + "CM"
  monogram logo, the tagline **"Your Need. Your Mitra."**, every page,
  every feature, every flow, and the reduced-motion accessibility guardrail.
- **Transform:** color (add an electric secondary palette + optional dark
  "night-city" mode), depth (soft 3D / glass / clay / gradient orbs /
  parallax), typography (bigger, bolder, more expressive), and motion
  (scroll-linked reveals, spring physics, 3D hover-tilt, magnetic buttons,
  marquees, count-ups) using **Framer Motion (`motion/react`)** which is
  already installed.
- **Vibe words:** playful-but-trustworthy, "AI concierge in your pocket,"
  premium travel-tech, India-proud, energetic, tactile, alive.

---

## 1. Product in one paragraph

CityMitra is a free, no-sign-up **AI city guide + travel planner for India**.
Pick a city, pick from 30+ everyday categories (wholesale markets, hospitals,
hotels, EV charging, doctors, repairs, food, sightseeing…), and get curated,
map-ready recommendations with smart routes. On top of the directory it layers
four signature AI features: a **conversational City Chat**, a **booking
concierge** (cabs/flights/hotels), a **partner-offers rail**, and an
**industry-first "fund your trip" travel-planner** that turns a destination +
budget into an SIP / mutual-fund / card-rewards saving plan. A **Pro** tier
adds verified plans, a human concierge, and live maps.

**Positioning line:** *Your AI companion for Indian cities — markets, hotels,
doctors, EV charging, deals & travel plans. Free. No sign-up.*

---

## 2. Brand identity (fixed — design around these)

| Element | Value |
|---|---|
| Product name | **CityMitra** ("Mitra" = friend/companion in Hindi) |
| Domain | **ctmitra.com** (note: no "y" — brand is CityMitr**a**, domain is ct**mitra**) |
| Tagline | **Your Need. Your Mitra.** |
| Logo | **"CM" route monogram** — a stylized C flowing into an M, on a circular orange→blue gradient disc, ringed by a faint dashed "route" line with waypoint dots (suggests navigation / AI-guided discovery). Ships as `app/components/Logo.tsx` + favicon/app-icon/social PNGs in `public/brand/`. |
| Signature gradient | `linear-gradient(135deg, #fb923c 0%, #ea580c 55%, #2563eb 100%)` (orange → deep orange → blue). This is the brand's DNA — keep it as the anchor, build the vibrant palette *around* it. |
| Voice | Warm, plain-spoken, confident, a little witty. Anti-jargon. "Skip the 47-tab research spiral." India-aware (₹, SIP, wholesale, saree markets, EV). |

---

## 3. Current design system (the STARTING POINT to evolve, not keep as-is)

**Tech:** Next.js 16 (App Router), React 19, TypeScript (strict), **plain
CSS** in one `app/globals.css` (no Tailwind, no shadcn), **`motion/react`
(Framer Motion)** already installed, `lucide-react` icons, hosted on Vercel.

**Current tokens (`:root`):**
```
--ink:   #0f172a   (near-black text)
--muted: #64748b   (slate gray)
--paper: #fff7ed   (warm cream background)
--soft:  #fff3e8   (warmer cream)
--white: #ffffff
--line:  #f4dfd2   (warm border)
--orange:#ea580c   --gold: #f97316
--blue:  #2563eb   --teal: #0891b2
--green: #059669   --red:  #dc2626
--shadow: 0 24px 80px rgba(15,23,42,.14)
--glow:   0 18px 60px rgba(234,88,12,.18)
--smooth: cubic-bezier(0.22, 1, 0.36, 1)
```
**Font:** Plus Jakarta Sans (300–800). **Look today:** warm, editorial,
rounded, lots of soft shadows and cream — clean and trustworthy but *calm*.
It reads more "friendly startup" than "Gen-Z travel-tech." That's the gap.

**Motion already in place (build on these):** `MotionConfig reducedMotion="user"`,
a `Reveal` scroll component, `ContainerScroll`, `Typewriter`, an aurora-blob
field in the hero, a `layoutId` pill in the nav, marquee-ish offer rails.

---

## 4. The redesign direction (the actual ask)

### 4.1 Color — "vibrant"
Keep the orange→blue gradient as the hero brand mark, but expand into an
**electric secondary palette** so the site pops:

```
Brand anchor:   #fb923c → #ea580c → #2563eb  (keep)
Electric violet:#7c3aed / #8b5cf6
Hot magenta:    #ec4899 / #f472b6
Cyan pop:       #06b6d4 / #22d3ee
Acid lime:      #a3e635 / #84cc16   (use sparingly, accents only)
Sunny yellow:   #facc15
```
- Use **multi-stop gradient meshes** and **gradient orbs / auroras** as
  ambient backgrounds (the hero already has an aurora field — push it
  everywhere, bigger and more saturated).
- Introduce an **optional dark "night-city" mode**: deep indigo/navy base
  (`#0b1020` / `#111827`) with **neon** orange/cyan/magenta accents and
  glowing edges. Gen-Z strongly favors dark + neon; make it the "wow" theme.
- Add subtle **grain/noise overlay** and **glassmorphism** (frosted, blurred,
  translucent) on floating cards and the nav.

### 4.2 Depth — "3D website"
- **Layered parallax**: foreground cards, mid-ground content, background
  orbs move at different scroll speeds (`useScroll` + `useTransform`).
- **3D hover-tilt** on cards (concierge panels, category tiles, offer cards,
  city cards) — perspective + rotateX/rotateY toward the cursor.
- **Floating / stacked cards** with real depth: layered shadows,
  `translateZ`, soft "claymorphism" (puffy, tactile, rounded).
- **Blob & squircle shapes**, isometric spot illustrations, gradient rings.
- **Hero 3D scene**: elevate the existing animated "city directory map" into
  a genuine dimensional scene — parallax map layers, a moving route line, a
  traveler dot, floating category chips orbiting a pin. (Optional: a
  lightweight Spline/Three.js embed for the hero only — must lazy-load and
  have a static fallback; don't tank LCP.)
- Depth cues on scroll: cards rise + settle with spring, shadows deepen.

### 4.3 Motion — "Framer Motion" (motion/react, already installed)
Lean in hard, but tastefully. Patterns to apply:
- **Scroll reveals** with stagger (`whileInView`, `staggerChildren`).
- **Spring physics** for everything interactive (`type: "spring"`, stiffness
  ~240–380, damping ~26–32 — matches the existing feel).
- **Magnetic buttons** (button eases toward cursor on hover).
- **3D tilt cards** (pointer-driven rotate + a moving specular highlight).
- **Marquee rails** for offers/logos/city chips (infinite horizontal scroll,
  pause on hover).
- **Number count-ups** on the metric stats (categories, 500+ cities, AI).
- **Layout animations** (`layoutId`) for tab pills, filter chips, the city
  picker — already used for the nav pill; extend the pattern.
- **Page/section transitions**, cursor-follow gradient glow, animated gradient
  text on headlines, typewriter on hero sub-lines (component exists).
- **Micro-interactions**: icon wiggles, chip pop-in, toast slides, confetti
  on Pro purchase / plan-generated success.
- **Guardrail:** respect `prefers-reduced-motion` (already wired via
  `MotionConfig reducedMotion="user"`) — every animation needs a calm
  fallback.

### 4.4 Typography — "Gen-Z attractive"
- **Bigger, bolder display headlines** — oversized, tight leading, mixed
  weights, gradient-filled or outlined words for emphasis.
- Consider pairing Plus Jakarta Sans (keep for body/UI) with an expressive
  **display face** for headlines (e.g. a chunky grotesk or a rounded
  variable font) — Fable to propose 1–2 options.
- Playful accents: emoji-adjacent iconography, sticker/badge chips, kinetic
  (animated) type on key headlines, highlighter-swipe underlines.

### 4.5 Gen-Z texture / details
Bento-grid layouts, sticker-style badges, chunky rounded buttons with
tactile press states, "as-seen" social proof chips, marquee tickers, bold
section dividers, tasteful glass + neon, generous whitespace *punctuated* by
loud moments. Trustworthy underneath (it handles money, health, travel) —
so: **playful surface, credible bones.**

---

## 5. Sitemap & pages (every surface to restyle)

| Route | Purpose | Redesign priority |
|---|---|---|
| `/` (Home) | The full funnel — see §6 | **P0 (flagship)** |
| `/chat` | AI City Chat — conversational city guide (ChatWorkspace) | P0 |
| `/travel-plan` | "Fund your trip" AI planner (SIP/funds/stocks/card offers) | P0 |
| `/offers` | Partner deals rail (sponsored vs curated, clearly labeled) | P1 |
| `/cities` + `/cities/[slug]` | City guide index + per-city guide pages | P1 |
| `/pro` | Pro subscription (₹/mo, Razorpay/UPI, concierge upgrade) | P1 |
| `/blog` + `/blog/[slug]` | Content (has RSS feed) | P2 |
| `/partner` | Partner/business landing | P2 |
| `/about`, `/contact` | Marketing/support | P2 |
| `/signin`, `/reset` | Auth (email + Google), password reset | P2 |
| `/privacy`, `/terms` | Legal | P3 (typographic polish only) |
| `/admin`, `/admin/login` | Internal analytics dashboard | P3 (not public) |

Shared chrome: **SiteHeader** (glass nav: logo+tagline, city picker,
7 nav links, ⌘K search, Ask-AI, Log in, mobile hamburger), **SiteFooter**
(brand + tagline + social row incl. Instagram/RSS + link columns +
newsletter), **WelcomeIntro** modal (first-visit onboarding), **Command
Palette** (⌘K), **PageShell** (header+footer wrapper for subpages).

---

## 6. Home page flow (section-by-section — the flagship)

Render order in `app/page.tsx`. Each is a restyle target:

1. **WelcomeIntro modal** (first visit) — "Your AI companion for Indian
   cities" + 3 CTAs: Start with AI guide / Browse categories / Auto-detect
   location. → *Make it a delightful, animated onboarding moment.*
2. **SiteHeader** (glass nav, sticky). → *Frosted glass + subtle motion,
   animated active pill, magnetic CTAs.*
3. **AiTeaser / Concierge** (`#ai`) — an **OfferRibbon** ticker + a
   **ConciergeSelector** of 5 big image panels: *Ask City Guide, Book a Cab,
   Book Flights, Book Hotels, Explore Wholesale*. Clicking opens a
   **ConciergePip** popover with booking-provider options + local picks.
   → *This is the signature interactive surface. Make the panels 3D
   tilt-cards with parallax imagery; the pip should spring in.*
4. **OffersSection** — partner deals rail. → *Marquee + tilt offer cards,
   clear "Sponsored/Curated" sticker badges.*
5. **DirectoryExplorer** (`#directory`) — city selector + **30-category**
   grid + a framed result carousel with Map/Directions buttons. → *Bento
   category grid, animated filter chips (layoutId), swipeable result frames.*
6. **NearbyPanel** (`#nearby`, "Top Picks") — geolocation-aware picks +
   photo blocks (Hotels/Places/Dining/Hospitals/Petrol/Repair) + map routes.
   → *Location-permission moment as a friendly animated prompt; photo blocks
   as a bento/masonry with hover-zoom.*
7. **Hero** (note: rendered *below* the fold here) — the animated **3D city
   directory map scene**: parallax mountains/skyline, moving route line,
   traveler, live route board, map preview iframe, stat pills. → *Push the
   dimensionality hardest here.*
8. **CoverageSection** + **AboutSection** (MarketingSections) — story +
   coverage claims (30+ categories, 500+ cities). → *Count-up stats, animated
   India map / coverage viz, bento explainers.*
9. **FeedbackBand** — feedback capture. → *Playful, low-friction.*
10. **SiteFooter**.

**Hero copy anchors (keep/adapt):** eyebrow "AI city navigation for
commerce", H1 "CityMitra", metrics: **30 categories · 500+ cities · AI route
advice**, flow steps: *Choose city → Pick category → Ask AI → Open map*.

---

## 7. Signature features to make shine (differentiators)

1. **"Fund your trip" travel planner** (`/travel-plan`) — the standout,
   industry-first hook: enter destination + budget + date → AI builds a
   **saving/investing plan** (SIPs, trending mutual funds & stocks, credit-
   card offers) so returns + rewards pay for the trip. → *Deserves a bold,
   almost fintech-grade animated calculator UI: sliders, animated charts,
   growth curves, a "your trip is funded" reveal.*
2. **AI City Chat** (`/chat`) — conversational planner. → *Modern chat UI:
   streaming bubbles, suggested prompts, city/context chips, a friendly
   concierge persona.*
3. **Booking Concierge** (home `#ai`) — cabs/flights/hotels/wholesale +
   provider comparison pip. → *3D panels + spring popover.*
4. **Offers rail** — disclosed partner deals. → *Marquee + sticker labels.*
5. **30-category directory** — the practical everyday breadth. → *Bento grid
   with expressive category icons.*

---

## 8. Component inventory (existing — restyle in place)

Header/nav: `SiteHeader`, `PageShell`, `CityPicker`, `CommandPalette`,
`Logo`. Home: `WelcomeIntro`, `AiTeaser`, `ConciergeSelector`,
`ConciergeCard`, `ConciergePip`, `OfferRibbon`, `OffersSection`, `OfferCard`,
`OfferChip`, `DirectoryExplorer`, `NearbyPanel`, `NearbyDock`, `Hero`,
`ContainerScroll`, `ImageAccordion`, `MarketingSections`, `FeedbackBand`,
`Reveal`. Chat: `ChatSection`, `ChatWorkspace`, `AiTeaser`, `Typewriter`,
`MarkdownText`. Travel: `TravelPlanner`, `TravelPlanStack`. Pro/auth:
`ProAccess`, `ProCheckout`, `AuthPanel`. Shared: `SiteFooter`, `ShareRow`,
`LocationPrompt`, `Reveal`, `motion/` helpers.

---

## 9. Guardrails (do NOT break these)

- **Keep the brand:** CM monogram logo, orange→blue gradient, "Your Need.
  Your Mitra.", CityMitra/ctmitra naming (SEO-sensitive — don't "fix" the
  spelling gap).
- **Keep content & flows:** all 30 categories, all pages, city picker,
  geolocation flow, ⌘K palette, booking pip, Pro checkout, auth.
- **Accessibility:** honor `prefers-reduced-motion` (already wired), keep
  contrast AA, keep focus states, keep keyboard nav (⌘K, tab order),
  `aria-label`s. Neon on dark must still pass contrast.
- **Performance:** lazy-load heavy 3D (Spline/Three), keep hero LCP fast,
  don't ship megabytes of video. Mobile-first — most users are on phones.
- **Stack:** stay on Next.js App Router + React + TypeScript + `motion/react`.
  Tailwind/shadcn are optional if Fable prefers them, but today it's plain
  CSS in `globals.css` — a token-driven CSS or CSS-Modules approach is fine;
  just keep it themeable (light + the new dark mode) via CSS variables.

---

## 10. Deliverables wanted from Claude Design / Fable

1. A refreshed **design system**: light + dark themes, the vibrant palette,
   type scale (display + body), gradient/orb/glass/clay tokens, shadow/depth
   scale, motion tokens (durations, springs, easings).
2. **Home page** fully redesigned (flagship), section-by-section per §6.
3. The three **P0 feature surfaces**: `/chat`, `/travel-plan`, and the home
   concierge.
4. A **reusable component kit** (buttons, chips, cards, tilt-card, bento,
   marquee, stat count-up, glass nav, modal, chat bubble) with Framer Motion
   baked in and reduced-motion fallbacks.
5. Mobile + desktop, with the extra-long-content edge cases handled (e.g.
   very long city names in the header — this was a real bug we just fixed).

---

### One-liner to paste into the tool
> Redesign **ctmitra.com** (an AI city-guide + "fund-your-trip" travel
> planner for India, Next.js + React + Framer Motion) into a **vibrant,
> 3D-depth, Gen-Z, motion-first** experience. Keep the CityMitra brand,
> orange→blue gradient, "CM" route-monogram logo, tagline "Your Need. Your
> Mitra.", every page and flow, and the reduced-motion guardrail. Add an
> electric secondary palette + an optional dark neon "night-city" theme,
> soft-3D/glass/clay cards, parallax + tilt + spring motion, bento layouts,
> marquees, count-ups, and a bold expressive type scale. Flagship = the home
> page; hero = a dimensional animated city-map scene; make the "fund your
> trip" planner and AI chat feel premium.
