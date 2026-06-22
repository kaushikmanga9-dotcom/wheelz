# Wheelz

Wheelz is a premium, mobile-first used-car comparison platform built with Next.js, React, Tailwind CSS, TypeScript, and Supabase.

It includes a Skyscanner-style search flow, value-for-money scoring, car details pages, side-by-side comparison, saved cars, email login, and an admin listing form.

## Tech Stack

- Next.js 14 App Router
- React 18
- TypeScript
- Tailwind CSS
- Supabase Auth, Database, Storage, and Row Level Security
- Vercel-ready image optimization, metadata, sitemap, and robots routes

## Local Setup

Install dependencies:

```bash
npm install
```

Create local environment variables:

```bash
cp .env.local.example .env.local
```

Fill in:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
ADMIN_EMAIL=you@example.com
ADMIN_PASSCODE=change-this-private-passcode
ADMIN_SESSION_SECRET=change-this-long-random-secret
SUPABASE_SERVICE_ROLE_KEY=your-server-only-service-role-key
```

Run the development server:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Supabase Setup

1. Create a Supabase project.
2. Run `supabase/schema.sql` in the Supabase SQL editor.
3. Run `supabase/seed.sql` to load starter car listings.
4. Add `${NEXT_PUBLIC_SITE_URL}/auth/callback` to Supabase Auth redirect URLs.
5. To use the hidden `/admin` add-listing page, configure `ADMIN_EMAIL`, `ADMIN_PASSCODE`, `ADMIN_SESSION_SECRET`, and `SUPABASE_SERVICE_ROLE_KEY`.

The schema creates:

- `cars`
- `saved_cars`
- `price_alerts`
- `car-images` storage bucket
- RLS policies for public car reads and user-owned saves/alerts. Admin writes run through a server-only service-role client after email/passcode verification.

## Main Routes

- `/` - Homepage
- `/search` - Search results and filters
- `/cars/[id]` - Car details
- `/compare` - Side-by-side comparison
- `/saved` - Saved cars
- `/login` - Email magic-link login
- `/admin/login` - Private admin email/passcode login
- `/admin` - Hidden admin add-listing form, available only after email/passcode authentication

## Production Build

```bash
npm run build
```

Start production locally:

```bash
npm run start
```

## Deploying to Vercel

1. Import the repository into Vercel.
2. Add the environment variables from `.env.example`.
3. Set `NEXT_PUBLIC_SITE_URL` to the final Vercel or custom domain URL.
4. Deploy with the default Next.js settings.
5. Follow `DEPLOYMENT_CHECKLIST.md` for the smoke test.

## Notes

- The buyer-facing app uses the Supabase anon key. The admin form uses `SUPABASE_SERVICE_ROLE_KEY` only in server actions.
- Add the service-role key to Vercel only as `SUPABASE_SERVICE_ROLE_KEY`; never expose it with a `NEXT_PUBLIC_` prefix.
- The admin page is intentionally not linked in production public navigation; open `/admin` directly after signing in with the private admin passcode.
- Car uploads go to the public `car-images` bucket and are optimized by Next.js when rendered.
- If Supabase env vars are missing, the public car pages fall back to local mock data.
