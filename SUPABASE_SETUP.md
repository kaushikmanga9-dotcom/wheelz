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
8. To use `/admin`, set the logged-in user's Supabase `app_metadata.role` to `admin`.
9. The schema also creates a public `car-images` storage bucket for listing uploads.

RLS notes:
- The app only uses the anon key in the browser/server session context.
- `cars` are publicly readable. Inserts and updates are limited to authenticated users with `app_metadata.role = "admin"`.
- `car-images` are publicly readable. Uploads are limited to authenticated admins.
- `saved_cars` and `price_alerts` are readable/writable only when `auth.uid() = user_id`.
- Do not expose the Supabase service-role key in this Next.js app.
