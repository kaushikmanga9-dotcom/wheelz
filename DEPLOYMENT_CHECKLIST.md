# Vercel Deployment Checklist

## Before Deploying

- Run `npm install`.
- Run `npm run build` and fix any TypeScript, lint, or route errors.
- Create a Supabase project.
- Run `supabase/schema.sql` in the Supabase SQL editor.
- Run `supabase/seed.sql` if you want the starter inventory.
- Confirm Row Level Security is enabled by the schema.
- Confirm the `car-images` Supabase Storage bucket exists.

## Vercel Environment Variables

Add these in Vercel Project Settings > Environment Variables:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_SITE_URL`
- `ADMIN_EMAIL`
- `ADMIN_PASSCODE`
- `ADMIN_SESSION_SECRET`
- `SUPABASE_SERVICE_ROLE_KEY`

Use the production URL for `NEXT_PUBLIC_SITE_URL`, for example `https://your-app.vercel.app`.

## Supabase Auth

- Add `${NEXT_PUBLIC_SITE_URL}/auth/callback` to Supabase Auth > URL Configuration > Redirect URLs.
- Hidden admin listing access uses `ADMIN_EMAIL` and `ADMIN_PASSCODE`, not Supabase user login.
- Add `SUPABASE_SERVICE_ROLE_KEY` only as a server-side Vercel env var. Never prefix it with `NEXT_PUBLIC_`.

## Vercel Settings

- Framework preset: Next.js.
- Build command: `npm run build`.
- Install command: `npm install`.
- Output directory: leave empty.
- Node.js version: use Vercel default LTS.

## Post-Deploy Smoke Test

- Open `/`.
- Open `/search`.
- Open `/cars/honda-city-zx-cvt`.
- Open `/compare`.
- Open `/login`.
- Confirm no Admin link appears in the production header or footer.
- Open `/admin` without the admin cookie and confirm it redirects to `/admin/login?next=/admin`.
- Try an incorrect admin email/passcode and confirm access is denied.
- Try the configured admin email/passcode and confirm `/admin` loads.
- Submit one test listing with images and confirm it appears on `/search`.
- Check `/robots.txt` and `/sitemap.xml`.
