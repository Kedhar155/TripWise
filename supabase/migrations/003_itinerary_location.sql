-- Nullable columns preserve existing saved places. Applied in Supabase SQL Editor.
alter table itinerary add column city text, add column state text, add column country text;
