import { getCategoryKey, getCategoryStyle } from "./categories";
import type { Place } from "./types";

export const sortOptions = [
  { value: "relevance", label: "Best match" },
  { value: "distance", label: "Nearest first" },
  { value: "distance-desc", label: "Farthest first" },
  { value: "name", label: "Name A to Z" },
  { value: "name-desc", label: "Name Z to A" },
  { value: "category", label: "Category (grouped)" },
  { value: "details", label: "Most details first" },
] as const;
export type PlaceSort = typeof sortOptions[number]["value"];
export const withinOptions = [1, 5, 10, 25] as const;
export const defaultWithin: number | null = null;

export function isPlaceSort(value: string): value is PlaceSort {
  return sortOptions.some(option => option.value === value);
}
export function detailsCount(place: Place) {
  return [place.website, place.phone, place.openingHours].filter(value => typeof value === "string" && value.trim().length > 0).length;
}
export function hasDistance(place: Place) {
  return typeof place.distance === "number" && Number.isFinite(place.distance) && place.distance >= 0;
}
export function availableSorts(places: readonly Place[]) {
  return sortOptions.filter(option => {
    if (option.value === "relevance") return true;
    if (places.length < 2) return false;
    if (option.value.startsWith("distance")) return places.every(hasDistance);
    if (option.value === "details") return places.some(place => detailsCount(place) > 0);
    return true;
  });
}

// A copy keeps provider relevance order intact when the user switches back.
// Equal values retain provider order; missing distances always sort last.
export function sortPlaces(places: readonly Place[], sort: PlaceSort): Place[] {
  const result = [...places];
  if (sort === "relevance") return result;
  return result.sort((a, b) => {
    if (sort === "name" || sort === "name-desc") return a.name.localeCompare(b.name, "en") * (sort === "name" ? 1 : -1);
    if (sort === "category") return getCategoryStyle(a.category).label.localeCompare(getCategoryStyle(b.category).label, "en") || a.name.localeCompare(b.name, "en");
    if (sort === "details") return detailsCount(b) - detailsCount(a);
    if (!hasDistance(a)) return hasDistance(b) ? 1 : 0;
    if (!hasDistance(b)) return -1;
    return (a.distance! - b.distance!) * (sort === "distance" ? 1 : -1) || a.name.localeCompare(b.name, "en");
  });
}

export function groupPlaces(places: readonly Place[]) {
  const groups = new Map<string, { category: string; places: Place[] }>();
  for (const place of places) {
    const key = getCategoryKey(place.category);
    if (!groups.has(key)) groups.set(key, { category: key, places: [] });
    groups.get(key)!.places.push(place);
  }
  return [...groups.values()];
}
