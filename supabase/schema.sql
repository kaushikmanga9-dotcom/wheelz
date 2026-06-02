create extension if not exists pgcrypto;

create table if not exists public.cars (
  id text primary key,
  brand text not null,
  model text not null,
  variant text not null,
  year integer not null check (year between 1980 and 2100),
  price integer not null check (price > 0),
  location text not null,
  mileage integer not null check (mileage >= 0),
  fuel text not null check (fuel in ('Petrol', 'Diesel', 'CNG', 'EV')),
  transmission text not null check (transmission in ('Manual', 'Automatic')),
  ownership text not null check (ownership in ('1st owner', '2nd owner', '3rd owner', '4th+ owner')),
  value_score integer not null check (value_score between 0 and 100),
  market_delta integer not null default 0,
  added_label text not null default 'Recently added',
  body_type text not null check (body_type in ('Hatchback', 'Sedan', 'SUV', 'EV')),
  color text not null default 'White',
  source_platform text not null default 'Dealer Direct',
  source_listing_url text not null default 'https://example.com',
  dealer_name text not null default 'Verified dealer',
  insurance_valid boolean not null default false,
  service_history text not null default 'missing' check (service_history in ('full', 'partial', 'missing')),
  accident_history text not null default 'none' check (accident_history in ('none', 'minor', 'major')),
  image_urls text[] not null default '{}',
  price_dropped boolean not null default false,
  image_position text not null default '50% 50%',
  highlights text[] not null default '{}',
  inspection jsonb not null default '{"engine":0,"exterior":0,"tyres":0,"documents":0}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.saved_cars (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  car_id text not null references public.cars(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, car_id)
);

create table if not exists public.price_alerts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  car_id text not null references public.cars(id) on delete cascade,
  target_price integer not null check (target_price > 0),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists cars_search_idx on public.cars (brand, model, location, price, value_score);
create index if not exists saved_cars_user_idx on public.saved_cars (user_id, created_at desc);
create index if not exists price_alerts_user_idx on public.price_alerts (user_id, is_active, created_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_cars_updated_at on public.cars;
create trigger set_cars_updated_at
before update on public.cars
for each row execute function public.set_updated_at();

drop trigger if exists set_price_alerts_updated_at on public.price_alerts;
create trigger set_price_alerts_updated_at
before update on public.price_alerts
for each row execute function public.set_updated_at();

alter table public.cars enable row level security;
alter table public.saved_cars enable row level security;
alter table public.price_alerts enable row level security;

drop policy if exists "Cars are readable by everyone" on public.cars;
create policy "Cars are readable by everyone"
on public.cars
for select
to anon, authenticated
using (true);

drop policy if exists "Admins can insert cars" on public.cars;
create policy "Admins can insert cars"
on public.cars
for insert
to authenticated
with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

drop policy if exists "Admins can update cars" on public.cars;
create policy "Admins can update cars"
on public.cars
for update
to authenticated
using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

insert into storage.buckets (id, name, public)
values ('car-images', 'car-images', true)
on conflict (id) do nothing;

drop policy if exists "Car images are publicly readable" on storage.objects;
create policy "Car images are publicly readable"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'car-images');

drop policy if exists "Admins can upload car images" on storage.objects;
create policy "Admins can upload car images"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'car-images' and (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

drop policy if exists "Users can read their saved cars" on public.saved_cars;
create policy "Users can read their saved cars"
on public.saved_cars
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Users can save cars for themselves" on public.saved_cars;
create policy "Users can save cars for themselves"
on public.saved_cars
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "Users can delete their saved cars" on public.saved_cars;
create policy "Users can delete their saved cars"
on public.saved_cars
for delete
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Users can read their price alerts" on public.price_alerts;
create policy "Users can read their price alerts"
on public.price_alerts
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Users can create price alerts for themselves" on public.price_alerts;
create policy "Users can create price alerts for themselves"
on public.price_alerts
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "Users can update their price alerts" on public.price_alerts;
create policy "Users can update their price alerts"
on public.price_alerts
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users can delete their price alerts" on public.price_alerts;
create policy "Users can delete their price alerts"
on public.price_alerts
for delete
to authenticated
using (auth.uid() = user_id);
