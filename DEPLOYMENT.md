# CityMitra Production Hosting

## Fastest Hosting Path

1. Push the repository to GitHub.
2. Import the repo in Vercel.
3. Set environment variables:
   - `OPENAI_API_KEY`
   - `ADMIN_PASSWORD`
   - `ADMIN_SESSION_TOKEN`
4. Build command:
   - `npm run build`
5. Start command:
   - Vercel handles this automatically for Next.js.

## Admin Analytics

The current `/api/activity` route stores activity in `.citymitra/activity.json` for local development.

The `/admin` route is protected by an HTTP-only admin session cookie. In local development, the fallback password is `admin123`, but production must set `ADMIN_PASSWORD` and `ADMIN_SESSION_TOKEN`.

For production, replace the file write in `app/api/activity/route.ts` with one of:

- Supabase Postgres
- Neon Postgres
- Vercel KV
- PlanetScale

Keep the same event shape:

```json
{
  "type": "search_submit",
  "city": "Delhi",
  "category": "markets",
  "label": "Delhi wholesale",
  "value": 12,
  "sessionId": "uuid",
  "timestamp": "2026-06-09T12:00:00.000Z"
}
```

## Monetization Checklist

- Featured listing payment plans
- Verified vendor profile pages
- Lead tracking for map opens and chat intent
- Admin dashboard protected by authentication
- Durable activity database
- Privacy notice for analytics collection
