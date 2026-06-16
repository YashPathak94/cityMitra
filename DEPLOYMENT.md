# CityMitra Production Hosting

## Fastest Hosting Path

1. Push the repository to GitHub.
2. Import the repo in Vercel from the Vercel dashboard.
3. Set environment variables (see `.env.example` for the full list):
   - `OPENAI_API_KEY`
   - `ADMIN_PASSWORD` and `ADMIN_SESSION_TOKEN` (required - admin fails closed without them)
   - `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_CONTACT_EMAIL`
   - `NEXT_PUBLIC_SOCIAL_X/_INSTAGRAM/_LINKEDIN/_WHATSAPP` (footer links)
4. Build command:
   - `npm run build`
5. Start command:
   - Vercel handles this automatically for Next.js.

## Admin Analytics

The current `/api/activity` route stores activity in `.citymitra/activity.json` for local development.

The `/admin` route is protected by an HTTP-only admin session cookie. In local development the fallback password is `admin123`. In production the admin area FAILS CLOSED: if `ADMIN_PASSWORD` or `ADMIN_SESSION_TOKEN` is not set, no one can log in. Login is rate-limited (5 attempts / 5 min / IP) and uses constant-time comparison. `/admin` is also served with `X-Robots-Tag: noindex`.

Unique visitor counting is server-issued through an HTTP-only `citymitra_visitor` cookie. The public website can write activity events, but only logged-in admins can read totals from `GET /api/activity`.

Important: local JSON storage is not durable on serverless hosting. For a real hosted visitor count, connect `app/api/activity/route.ts` to a durable database before launch.

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

## Durable storage with Supabase (recommended for production)

Without Supabase, activity and newsletter data write to local JSON files - fine in
dev, but LOST/BROKEN on Vercel (read-only filesystem). To enable Supabase:

1. Create a free project at supabase.com.
2. In the SQL Editor, run:

```sql
create table if not exists activity (
  id bigint generated always as identity primary key,
  type text not null,
  city text,
  category text,
  label text,
  value integer,
  path text,
  session_id text,
  created_at timestamptz not null default now()
);

create table if not exists newsletter (
  email text primary key,
  subscribed_at timestamptz not null default now()
);

alter table activity enable row level security;
alter table newsletter enable row level security;

create table if not exists users (
  email text primary key,
  password_hash text not null,
  is_pro boolean not null default false,
  created_at timestamptz not null default now()
);
alter table users enable row level security;
```

(No public policies needed - the app uses the service-role key server-side, and RLS
blocks anonymous access.)

3. Project Settings -> API: copy the Project URL and the service_role secret key.
4. Set `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` env vars (Vercel + .env.local).
   The service-role key must NEVER be exposed client-side or prefixed NEXT_PUBLIC_.

## Data stored on the server

- `.citymitra/activity.json` — anonymous usage events (rolling ~1000 records)
- `.citymitra/newsletter.json` — newsletter emails (read via admin-only `GET /api/newsletter`)

Both are flat files: fine for a single Node server, ephemeral on serverless. Move to
Neon/Supabase before scaling. Rate limits protect `/api/ask` (10/min/IP),
`/api/newsletter` (5/min/IP), `/api/activity` (120/min/IP), and admin login.
