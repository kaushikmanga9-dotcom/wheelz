# Supabase Setup

1. Create a Supabase project.
2. In the SQL editor, run `supabase/schema.sql`.
3. Run `supabase/seed.sql` to load the current mock cars.
4. Copy `.env.local.example` to `.env.local`.
5. Fill in:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_SITE_URL`
6. In Supabase Auth URL configuration, add `${NEXT_PUBLIC_SITE_URL}/auth/callback` as an allowed redirect URL.
7. Restart the Next.js dev server.
8. To use the hidden `/admin` page, configure `ADMIN_EMAIL`, `ADMIN_PASSCODE`, `ADMIN_SESSION_SECRET`, and `SUPABASE_SERVICE_ROLE_KEY`.
9. The schema also creates a public `car-images` storage bucket for listing uploads.

RLS notes:
- The app only uses the anon key in the browser/server session context.
- `/admin` is intentionally not linked in production public navigation. Direct access requires the private email/passcode gate.
- `cars` are publicly readable. Browser users cannot write listings through the anon key.
- `car-images` are publicly readable. Browser users cannot upload listing images through the anon key.
- Admin listing writes and uploads use `SUPABASE_SERVICE_ROLE_KEY` from server-only environment variables after the admin cookie is verified.
- `saved_cars` and `price_alerts` are readable/writable only when `auth.uid() = user_id`.
- Never expose the Supabase service-role key with a `NEXT_PUBLIC_` prefix.
