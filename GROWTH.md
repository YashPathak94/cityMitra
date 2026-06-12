# CityMitra — Launch, Reach & Monetization Playbook

A practical, ordered checklist to take CityMitra from repo to revenue.

---

## 1. Host it (Day 1)

**Recommended: Vercel (free Hobby tier is enough to launch).**

1. Go to [vercel.com/new](https://vercel.com/new) → Import `YashPathak94/cityMitra` from GitHub.
2. Framework is auto-detected (Next.js). No build settings needed.
3. Add environment variables in Project → Settings → Environment Variables:
   - `OPENAI_API_KEY` — enables live AI chat
   - `OPENAI_MODEL` — e.g. `gpt-5-mini` (cheap + fast for this use case)
   - `ADMIN_PASSWORD`, `ADMIN_SESSION_TOKEN` — protect `/admin`
   - `NEXT_PUBLIC_SITE_URL` — your final domain (used by SEO metadata/sitemap)
4. Deploy. Every push to `main` auto-deploys; PRs get preview URLs.

**Custom domain (strongly recommended for trust + SEO):**
- Buy `citymitra.in` / `citymitra.com` (GoDaddy, Namecheap, or Cloudflare Registrar — ₹700–1,200/yr).
- Vercel → Project → Domains → add domain → update the DNS records it shows you.
- Set `NEXT_PUBLIC_SITE_URL=https://citymitra.in` and redeploy.

**Before real traffic (durability):**
- Replace the JSON-file analytics store in `app/api/activity/route.ts` with a durable DB — easiest paths: [Neon](https://neon.tech) (free Postgres) or Supabase. Serverless filesystems are ephemeral; today's counter resets on every deploy.
- Set a spending limit on your OpenAI account, and consider per-IP rate limiting on `/api/ask` (e.g. Upstash Redis `@upstash/ratelimit`, free tier) so the chat can't be abused into a big bill.

## 2. Measure (Week 1)

- Add [Vercel Analytics](https://vercel.com/analytics) (one click) or Google Analytics 4.
- Register the site in **Google Search Console**, submit `https://yourdomain/sitemap.xml`.
- The built-in `/admin` dashboard already tracks city/category demand, map opens, and chat intent — this data tells you which city to invest content in first.

## 3. Reach users (Weeks 1–8)

**SEO (the compounding channel for a directory product):**
- The biggest lever: **programmatic city + category landing pages** (e.g. `/delhi/markets`, `/jaipur/sarees`). Each becomes an indexable page targeting "wholesale market in Delhi"-style searches. The data structures in `data/city-directory.ts` and `lib/city-intel.ts` already support this — it's the highest-ROI next feature.
- Write 2–3 genuinely useful guides per week ("Leh road-trip checklist: petrol, hospitals, altitude", "Chandni Chowk wholesale timing guide"). Long-tail Indian city queries are low competition.
- JSON-LD, sitemap, robots, and OpenGraph are already wired in.

**Distribution:**
- **WhatsApp & Telegram**: city-specific groups (travel, wedding shopping, students). Share a useful answer + link, not an ad.
- **Instagram Reels / YouTube Shorts**: 30-second "plan a Jaipur saree run with AI" screen recordings. Map-route content performs well in the India travel niche.
- **Reddit**: r/india, r/IndiaTravel, r/delhi, r/mumbai — answer real questions, link when relevant.
- **Product Hunt / Peerlist launch** once the chat feels polished — good for backlinks even if traffic spike is temporary.
- **Local partnerships**: hotels, travel agents, and college fest pages will share a free tool that makes their city easier.

**Retention:**
- The newsletter form already captures emails — connect it to a real provider (Resend, Buttondown, Mailchimp free tier) and send a weekly "city brief".

## 4. Earn money (Months 1–6, in order of effort)

| # | Stream | Effort | When to start |
|---|--------|--------|---------------|
| 1 | **Google AdSense** display ads | Low | After ~50–100 organic visits/day |
| 2 | **Affiliate links** — hotels (Booking.com, Agoda, MakeMyTrip via EarnKaro/Cuelinks), Amazon for gear | Low | Immediately — hotel/dinner cards are natural placements |
| 3 | **Featured listings** — shops/hotels/clinics pay ₹500–2,000/month for verified placement, photos, "Verified" badge priority | Medium | Once a city shows real traffic in `/admin` |
| 4 | **Lead routing** — charge per qualified map-open/call click for hotels, repair shops, clinics | Medium | After featured listings prove demand |
| 5 | **City sponsorships** — a local brand sponsors a category ("Food trail powered by X") | Medium | 1k+ daily visits in a city |
| 6 | **CityMitra Pro** — saved trips, longer AI plans, PDF branding removal, WhatsApp delivery (₹99–199/mo via Razorpay) | High | When chat retention is proven |

**Practical notes:**
- Start outreach manually: pick your top city from admin analytics, walk the actual market, and sell 10 shopkeepers a ₹500/month featured slot with a WhatsApp onboarding flow. Ten paying vendors validates the whole model.
- Use **Razorpay** (Indian cards/UPI) for payments; payment links are enough at first — no checkout build needed.
- Keep ads off the chat panel. Monetize intent (directory, results, exports), not conversation — it protects the product's core trust.

## 5. The 90-day sequence

1. **Week 1**: Deploy on Vercel + domain + Search Console + analytics + OpenAI spending cap.
2. **Weeks 2–4**: Ship programmatic `/city/category` pages; publish 6–8 guides; start Reels/Shorts.
3. **Weeks 4–8**: Apply for AdSense; add affiliate links to hotel/dinner surfaces; connect newsletter.
4. **Weeks 8–12**: Pick the #1 city by analytics; sell first 10 featured listings in person/WhatsApp; wire Razorpay payment links.
5. **Ongoing**: Watch `/admin` weekly — double down on the cities and categories users actually pull.
