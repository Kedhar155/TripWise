-- TripWise: access through server routes only; no browser database access.
create table if not exists public.itinerary (
  id uuid primary key default gen_random_uuid(),
  visitor_id uuid not null,
  place_id text not null check (char_length(place_id) between 1 and 512),
  name text not null check (char_length(name) between 1 and 300),
  address text not null check (char_length(address) <= 1000),
  category text not null check (char_length(category) between 1 and 100),
  latitude double precision not null check (latitude between -90 and 90),
  longitude double precision not null check (longitude between -180 and 180),
  created_at timestamptz not null default now(),
  constraint itinerary_visitor_place_unique unique (visitor_id, place_id)
);
create index if not exists itinerary_visitor_created_idx
  on public.itinerary (visitor_id, created_at desc);
alter table public.itinerary enable row level security;
revoke all on public.itinerary from anon, authenticated;
grant select, insert, delete on public.itinerary to service_role;
