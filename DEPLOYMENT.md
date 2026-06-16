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

## Accounts, Google sign-in, password reset, subscriptions

CityMitra Pro supports email/password accounts, Google sign-in, password reset,
and real monthly subscriptions with auto-renewal. All are env-gated and degrade
gracefully when unset.

### Required for accounts
- `AUTH_SESSION_SECRET` — long random string (`openssl rand -hex 32`). Without it,
  accounts are disabled in production.
- Supabase `users` table (SQL in the Supabase section above). Add subscription columns:

```sql
alter table users add column if not exists provider text default 'password';
alter table users add column if not exists subscription_id text;
alter table users add column if not exists subscription_status text;
alter table users add column if not exists current_period_end timestamptz;
```

### Google sign-in (optional)
1. Google Cloud Console → Credentials → OAuth client (Web).
2. Authorized redirect URI: `https://YOURDOMAIN/api/auth/google/callback`.
3. Set `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, and `NEXT_PUBLIC_GOOGLE_ENABLED=true`.

### Password reset email (optional)
- Set `RESEND_API_KEY` (resend.com) and `EMAIL_FROM` (a verified sender).
- Without it, the reset link is returned in the API response (dev only) so the flow still works.

### Monthly subscription with auto-renewal (Razorpay)
1. Razorpay Dashboard → Subscriptions → Plans → create a monthly plan (₹ amount).
2. Set `RAZORPAY_PLAN_ID` to that plan id. (Also needs `RAZORPAY_KEY_ID`/`_SECRET`
   and `NEXT_PUBLIC_RAZORPAY_KEY_ID`.) With a plan id set, /pro uses subscriptions;
   without it, it falls back to a one-time payment.
3. Razorpay Dashboard → Settings → Webhooks → add `https://YOURDOMAIN/api/webhooks/razorpay`,
   subscribe to subscription.charged / activated / cancelled / halted / completed,
   and set the secret as `RAZORPAY_WEBHOOK_SECRET`. The webhook keeps Pro in sync on
   renewals and cancellations. Users can cancel auto-renewal from /pro.
