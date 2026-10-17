import type { CitySuggestion } from "./types";
import { request } from "./client-api";

const cache = new Map<string, { expires: number; cities: CitySuggestion[] }>();
const ttl = 10 * 60 * 1000;
export const cityDebounceMs = 400;
export function cityQuery(country: string, text: string) {
  const q = text.trim().replace(/\s+/g, " ").toLowerCase();
  return country && q.length >= 3 ? new URLSearchParams({ country, q }) : null;
}
export async function citySuggestions(country: string, text: string, signal: AbortSignal) {
  const query = cityQuery(country, text);
  if (!query) return [];
  const key = query.toString();
  const saved = cache.get(key);
  if (saved && saved.expires > Date.now()) return saved.cities;
  const data = await request<{ cities: CitySuggestion[] }>(`/api/cities?${query}`, { signal });
  if (!signal.aborted) {
    if (cache.size >= 100) cache.delete(cache.keys().next().value!);
    cache.set(key, { cities: data.cities, expires: Date.now() + ttl });
  }
  return data.cities;
}
