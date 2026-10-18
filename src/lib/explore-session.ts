import type { CitySuggestion, StateSuggestion, Place } from "./types";
import type { Category } from "./categories";
import { categories } from "./categories";
import { defaultWithin, sortOptions, withinOptions, type PlaceSort } from "./place-sorting";

export type LocationDraft = { countryText: string; country: string; stateText?: string; state?: StateSuggestion | null; cityText: string; city: CitySuggestion | null };
export type LocationSearchValue = { city: string; country: string; cityId?: string; state?: string; stateId?: string };
export type Search = { kind: "location"; value: LocationSearchValue } | { kind: "name"; name: string };
export type Results = { places: Place[]; city?: { name: string }; state?: { name: string }; resolvedState?: string; query?: string };
export type ExploreSession = {
  version: 1; mode: "location" | "name"; location: LocationDraft; nameDraft: string;
  selected: Category[]; sort: PlaceSort; within: number | null; filtersOpen: boolean;
  search: Search | null; results: Results | null; resultsKey: string; scrollY: number;
};
export const exploreSessionKey = "tripwise.explore.v1";
export function defaultExploreSession(): ExploreSession {
  return { version: 1, mode: "location", location: { countryText: "", country: "", stateText: "", state: null, cityText: "", city: null }, nameDraft: "", selected: [], sort: "relevance", within: defaultWithin, filtersOpen: false, search: null, results: null, resultsKey: "", scrollY: 0 };
}
export function searchUrl(search: Search | null, category: string, within: number | null) {
  if (!search) return "";
  const params = search.kind === "location"
    ? new URLSearchParams({ ...search.value, category, sort: "relevance", ...(within === null || !search.value.city ? {} : { within: String(within) }) })
    : new URLSearchParams({ name: search.name, category, sort: "relevance" });
  return `${search.kind === "location" ? "/api/places" : "/api/places/search"}?${params}`;
}
// A single bounded snapshot per tab. Memory also covers navigation when storage is blocked/full.
let memory: ExploreSession | null = null;
export function readExploreSession(): ExploreSession {
  try {
    const raw = sessionStorage.getItem(exploreSessionKey);
    if (!raw) return memory ?? defaultExploreSession();
    const value = JSON.parse(raw) as ExploreSession;
    if (value.version !== 1 || !["location", "name"].includes(value.mode)
      || !value.location || ![value.location.countryText, value.location.country, value.location.cityText, value.nameDraft, value.resultsKey].every(item => typeof item === "string")
      || !Array.isArray(value.selected) || !value.selected.every(item => Object.hasOwn(categories, item))
      || !sortOptions.some(item => item.value === value.sort)
      || (value.within !== null && !withinOptions.some(item => item === value.within))
      || typeof value.filtersOpen !== "boolean" || !Number.isFinite(value.scrollY) || value.scrollY < 0
      || (value.location.city !== null && ![value.location.city.id, value.location.city.name, value.location.city.label, value.location.city.country].every(item => typeof item === "string"))
      || (value.search !== null && !(value.search.kind === "name" ? typeof value.search.name === "string" : value.search.kind === "location" && typeof value.search.value?.city === "string" && typeof value.search.value?.country === "string"))) return defaultExploreSession();
    if (value.location.stateText !== undefined && typeof value.location.stateText !== "string") return defaultExploreSession();
    if (value.location.state && ![value.location.state.id, value.location.state.name, value.location.state.label, value.location.state.country].every(item => typeof item === "string")) return defaultExploreSession();
    if (value.search?.kind === "location" && [value.search.value.state, value.search.value.stateId].some(item => item !== undefined && typeof item !== "string")) return defaultExploreSession();
    // Discard an unusable result cache but retain the settings for a normal loading/retry flow.
    if (value.results && (!Array.isArray(value.results.places) || value.results.places.length > 100
      || !value.results.places.every(place => place && [place.id, place.name, place.address, place.category].every(item => typeof item === "string"))
      || ((value.results.city ?? value.results.state) ? typeof (value.results.city ?? value.results.state)!.name !== "string" : typeof value.results.query !== "string"))) {
      value.results = null; value.resultsKey = "";
    }
    return value;
  } catch { return memory ?? defaultExploreSession(); }
}
export function saveExploreSession(value: ExploreSession) {
  memory = value;
  try { sessionStorage.setItem(exploreSessionKey, JSON.stringify(value)); } catch { /* Session storage can be unavailable. Search remains usable. */ }
}
