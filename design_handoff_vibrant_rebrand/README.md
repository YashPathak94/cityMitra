# Handoff: CityMitra Vibrant Rebrand (no-black, brand-gradient)

## Overview
Recolor + polish of ctmitra.com: the cinematic monochrome Gen-Z prototype re-themed to the vibrant CityMitra brand — warm paper surfaces, orange→blue gradient DNA, zero black fills — while keeping the site's existing page flow, routes, copy, and logic **unchanged**.

## About the Design Files
Files in `reference/` are **HTML design references** (prototypes), not production code. The task is to **recreate this look inside the existing Next.js codebase** (`YashPathak94/cityMitra`, branch off `claude/nifty-ritchie-3vbrev`), using its established token architecture — NOT to ship these HTML files.

## Fidelity
**High-fidelity for color, typography, elevation, and motion values** (use exact values below). **Structure/flow is NOT to be changed** — same components, same section order as `app/page.tsx`, same routes.

## The safe implementation strategy (why this won't break the site)
The repo already centralizes brand in `design-system/src/tokens.css` (`--cm-*`) and `app/globals.css`. This redesign is a **token-level change**: edit token values + a small set of component color rules. No logic, no routes, no data, no API, no SEO files.

### Steps to give Claude Code
1. `git checkout -b redesign/vibrant-rebrand` (never commit to main directly).
2. Update `design-system/src/tokens.css` with the token values below (they already match `--cm-*` names).
3. Sweep `app/globals.css` + components for hard-coded blacks/monochrome (`#000`, `#0a0a0a`, gray gradients) → replace per the mapping table. Never touch selectors, layout, spacing, or class names.
4. Page-by-page visual QA (`npm run dev`): Home, /cities, /chat, /travel-plan, /offers, /pro, /partner, /about, mobile viewport.
5. `npm run build` must pass. Open a PR; do not merge without preview review.

## Design tokens (light theme)
- Background `--cm-paper`: `#FFF7ED` · secondary `--cm-soft`: `#FFF3E8` · cards: `#FFFFFF`
- Ink `--cm-ink`: `#0F172A` (text only — **never as a fill**) · muted `--cm-muted`: `#64748B`
- Lines/borders `--cm-line`: `#F4DFD2` · chip fill: `#FFEDD5`
- Brand: orange `#EA580C`, gold `#F97316`, light orange `#FB923C`, blue `#2563EB`, teal accent `#0891B2`, live-green `#059669`
- Signature gradient `--cm-gradient`: `linear-gradient(135deg,#FB923C,#EA580C 55%,#2563EB)`
- Shadows: card `0 1px 2px rgba(15,23,42,.04), 0 10px 28px rgba(234,88,12,.06)`; hover glow `--cm-glow`: `0 18px 60px rgba(234,88,12,.20)`; CTA shadow `0 12px 30px rgba(234,88,12,.32)`
- Easing `--cm-smooth`: `cubic-bezier(.22,1,.36,1)` · radius: 24px cards, 999px pills
- Font: **Plus Jakarta Sans** (body, weights 400–800) + **Instrument Serif** (display headlines, italic accents)

## Night theme (optional dark mode)
bg `#0B1020`, surface `#111832`, ink `#F8FAFC`, muted `#94A3B8`, line `rgba(251,146,60,.16)`, chip `rgba(251,146,60,.10)`, orange `#FB923C`, blue `#60A5FA`, glow `0 18px 60px rgba(249,115,22,.30)`. Deep navy — never pure black.

## No-black mapping table (apply everywhere)
- Black/ink **button or pill fill** → signature gradient, text `#FFFFFF`
- Black **panels/bands** (dark teasers, contact CTA) → `linear-gradient(120deg,#F97316,#EA580C 42%,#2563EB)`, text `#FFFFFF`, muted text `rgba(255,255,255,.75–.88)`
- Black **icon glyphs, dots, bars, avatar squares** → `linear-gradient(135deg,#F97316,#2563EB)`
- Black **chat bubble (user)** → signature gradient, white text
- Gray gradients (`#000→#6F6F6F` etc.) → orange/blue pairs: `#F97316→#EA580C`, `#FB923C→#2563EB`, `#2563EB→#0891B2`
- Radial glow ornaments → `rgba(249,115,22,.18)` (orange) / `rgba(37,99,235,.16)` (blue)
- Selected/active states (chips, nav pill) → signature gradient bg + white text
- Serif italic words in headlines → gradient text (background-clip:text, gradient at 115deg)
- Link hover: `#EA580C`; `::selection`: `rgba(249,115,22,.25)`; `a:focus-visible, button:focus-visible`: `outline:2px solid #EA580C; outline-offset:3px`

## Interactions & motion (already in repo patterns — keep)
- Card hover: `translateY(-6px)` + orange glow, `.25s var(--cm-smooth)`
- Scroll reveals: fade + 26px rise, `.7s var(--cm-smooth)`; count-up stats on intersection
- Marquee offers strip ~38s linear loop; respect `prefers-reduced-motion` everywhere
- Range inputs: `accent-color:#EA580C`

## Flow (must stay exactly as `app/page.tsx`)
WelcomeIntro → SiteHeader → AiTeaser → OffersSection → DirectoryExplorer → NearbyPanel → Hero → Coverage → About → FeedbackBand → SiteFooter. Other routes unchanged.

## Files
`reference/` — recolored prototypes per page: GenzSite (home), CityGuide, CityChat, TravelPlan, Offers, Pro, Partner, About, HomeMobile (mobile home), SiteNav, SiteFooter, and `theme.js` (the exact light/night palette objects — the source of truth for values).

## Paste-ready prompt for Claude Code
> Read design_handoff_vibrant_rebrand/README.md. On a new branch `redesign/vibrant-rebrand`, re-theme the site to these tokens: update design-system/src/tokens.css and app/globals.css, then replace every black/monochrome fill per the README's mapping table. Do NOT change any component structure, props, routes, copy, data, or API code — colors, gradients, shadows, fonts and focus states only. Keep the section order in app/page.tsx exactly as-is. Verify each page visually and ensure `npm run build` passes before opening a PR.
