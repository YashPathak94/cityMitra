# CityMitra

CityMitra is an AI-assisted city discovery website for quickly finding trusted shops, markets, hospitals, malls, eateries, repair points, sightseeing areas, and service destinations across Indian cities — with smart routes, maps, exports, and a built-in AI chat planner.

## Architecture

```
app/
  page.tsx              Composition root (shared state + section wiring)
  layout.tsx            Fonts, SEO metadata, JSON-LD, skip link
  components/           Section components
    SiteHeader.tsx      Search + responsive nav
    Hero.tsx            City visual, live map preview, scene actions
    DirectoryExplorer   City/category filters + rotating results deck
    ChatSection.tsx     Streaming AI chat, markdown answers, follow-ups, exports
    NearbyPanel.tsx     Top-20 nearby picks, location, photo blocks
    MarkdownText.tsx    Lightweight markdown renderer for AI answers
    MarketingSections   Monetize / roadmap / about
    SiteFooter.tsx      Newsletter + links
  api/                  Route handlers (ask, activity, city-image, admin, reverse-location)
  robots.ts sitemap.ts manifest.ts   SEO infrastructure
lib/
  city-intel.ts         City/category detection, curated result builders
  maps.ts               Google Maps URL helpers
  tracking.ts           Privacy-light activity beacon
  export-plan.ts        PDF / CSV plan exports
data/
  city-directory.ts     Seed directory of verified places
```

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Enable AI answers

Create `.env.local`:

```bash
OPENAI_API_KEY=your_api_key_here
OPENAI_MODEL=gpt-5-mini
```

Without an API key, the chat uses a local demo response so the site remains previewable.

## Production

See `DEPLOYMENT.md` for hosting and `GROWTH.md` for the launch, reach, and monetization playbook.
