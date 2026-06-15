# CityMitra — Affiliate Setup Guide

How to earn commission when users tap the booking concierge links.

## How it works in the code (already built)

Every concierge link in the chat passes through `withAffiliate()` in
`lib/booking.ts`. It appends your affiliate query string from an env var named
`NEXT_PUBLIC_AFFILIATE_<PROVIDER>`. No code change needed — you only set env vars.

| Provider | Env var | Example value |
|----------|---------|---------------|
| Booking.com | `NEXT_PUBLIC_AFFILIATE_BOOKING` | `aid=1234567` |
| Agoda | `NEXT_PUBLIC_AFFILIATE_AGODA` | `cid=1234567` |
| MakeMyTrip | `NEXT_PUBLIC_AFFILIATE_MAKEMYTRIP` | `affid=xxxx` |
| Skyscanner | `NEXT_PUBLIC_AFFILIATE_SKYSCANNER` | `associateid=xxxx` |
| Zomato | `NEXT_PUBLIC_AFFILIATE_ZOMATO` | `utm_source=citymitra` |

Set them in Vercel → Settings → Environment Variables (Production), then redeploy.
The exact parameter name (`aid`, `cid`, `affid`…) is given to you by each program
when you join — paste the whole `key=value` string.

> Tip: the fastest path is an aggregator (below) that gives you ONE dashboard and
> wraps links for many merchants, instead of applying to each program separately.

## Option A — Aggregators (recommended to start, India-friendly)

These approve fast, cover MakeMyTrip / Agoda / Booking / Amazon / Zomato etc.,
and pay in INR:

1. **Cuelinks** (cuelinks.com) — sign up, get approved (usually 1-2 days), add
   your site `citymitra` domain. Cuelinks gives you either a script or a
   link-wrapping format. For CityMitra, use their **link-level** format: they show
   you how to convert `https://www.booking.com/...` into a tracked link. Put the
   tracking suffix into the matching `NEXT_PUBLIC_AFFILIATE_*` var.
2. **EarnKaro** (earnkaro.com) — similar, very easy KYC, good for MakeMyTrip and
   hotel brands. Generate a "profit link", copy the tracking params.
3. **INRDeals / Admitad / Impact** — broader networks if you want flights +
   global hotels.

Start with **Cuelinks or EarnKaro** — one approval covers most of your providers.

## Option B — Direct programs (higher rates, slower approval)

Apply directly once you have steady traffic:

- **Booking.com Affiliate Partner Programme** — partner.booking.com → get your
  `aid`. Pays ~25-40% of Booking's commission per completed stay.
- **Agoda Partners** — partners.agoda.com → get your `cid`.
- **MakeMyTrip Affiliate** — via their partner page or through Cuelinks.
- **Skyscanner** — partners.skyscanner.net (Travel APIs + affiliate); approval is
  stricter and usually wants real traffic first.
- **Amazon Associates** (amazon.in/associates) — for any gear links you add later.

Practo, Ola, Uber, IRCTC: no open consumer-affiliate program, so those concierge
links stay as plain deep links (still useful to users, just not commissionable).

## What to do, in order

1. **Now:** sign up for **Cuelinks** (or EarnKaro). Add `citymitra` as your site.
2. Get the tracking format for Booking, Agoda, MakeMyTrip, Zomato.
3. In Vercel, set the `NEXT_PUBLIC_AFFILIATE_*` vars with those tracking strings.
4. Redeploy. Done — concierge links now earn.
5. **Later (after real traffic):** apply to Booking.com and Agoda direct programs
   for better rates, and swap the env values.

## Disclosure (already handled, keep it)

Each concierge link uses `rel="sponsored"` and the card shows a short disclosure
("CityMitra may earn a commission"). This is required by the FTC/most programs and
by Google — do not remove it. The Privacy Policy also notes affiliate links.

## Measure it

Tapped links fire `concierge_open` / `concierge_quick_action` events, visible in
`/admin` → Leads. Cross-check those counts against each affiliate dashboard's
clicks to confirm tracking is wired correctly.
