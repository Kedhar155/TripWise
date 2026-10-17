import "server-only";
import { ApiError, placeId } from "./api";
import type { Place } from "./types";
import { categoryEntries, geoapifyCategories, getCategoryKey, parseCategory, type Category } from "./categories";
type Properties = {
  place_id?: string; name?: string; formatted?: string; address_line1?: string;
  lat?: number; lon?: number; categories?: string[]; distance?: number;
  website?: string; opening_hours?: string;
  contact?: { phone?: string; website?: string };
  datasource?: { raw?: { website?: string; phone?: string; opening_hours?: string } };
};
type GeoData = { features?: { properties: Properties }[]; results?: Properties[] };

async function geo(path: string, params: Record<string, string>): Promise<GeoData> {
  const key = process.env.GEOAPIFY_API_KEY;
  if (!key) throw new ApiError(500, "PLACES_NOT_CONFIGURED", "Place search is not configured yet.");
  const url = new URL(path, "https://api.geoapify.com");
  for (const [name, value] of Object.entries({ ...params, apiKey: key })) url.searchParams.set(name, value);
  try {
    const response = await fetch(url, { cache: "no-store", signal: AbortSignal.timeout(12000) });
    if (response.status === 404 || (path === "/v2/place-details" && response.status === 400)) throw new ApiError(404, "PLACE_NOT_FOUND", "This place could not be found.");
    if (!response.ok) throw new Error();
    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(500, "PLACES_UNAVAILABLE", "The places service is unavailable. Please try again shortly.");
  }
}

export function query(params: URLSearchParams) {
  const city = params.get("city")?.trim();
  const values = params.getAll("category").flatMap(value => value.split(","));
  if (!values.length) values.push("all");
  const sort = params.get("sort") ?? "distance";
  if (!city || city.length < 2 || city.length > 120 || /[\u0000-\u001f]/.test(city)) {
    throw new ApiError(400, "INVALID_CITY", "Enter a city name between 2 and 120 characters.");
  }
  if (values.some(value => value !== "all" && !parseCategory(value))) throw new ApiError(400, "INVALID_CATEGORY", "Choose supported place categories, or All.");
  if (values.includes("all") && values.length !== 1) throw new ApiError(400, "INVALID_CATEGORY", "Choose All on its own, or select specific categories.");
  const selected: Category[] = values[0] === "all" ? categoryEntries.map(([key]) => key) : [...new Set(values.map(value => parseCategory(value)!))];
  if (sort !== "name" && sort !== "distance") throw new ApiError(400, "INVALID_SORT", "Sort must be name or distance.");
  return { city, selected, sort };
}

function normalize(p: Properties): Place | null {
  if (!p.place_id || !Number.isFinite(p.lat) || !Number.isFinite(p.lon)) return null;
  const raw = p.datasource?.raw;
  const website = p.website ?? p.contact?.website ?? raw?.website;
  const validWebsite = website && /^https?:\/\//i.test(website) ? website : undefined;
  return {
    id: p.place_id,
    name: (p.name ?? p.address_line1 ?? "Unnamed place").slice(0, 300),
    address: (p.formatted ?? p.address_line1 ?? "Address unavailable").slice(0, 1000),
    category: getCategoryKey(p.categories ?? []),
    latitude: p.lat!, longitude: p.lon!,
    website: validWebsite, phone: p.contact?.phone ?? raw?.phone,
    openingHours: p.opening_hours ?? raw?.opening_hours,
  };
}

function distance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const rad = (n: number) => n * Math.PI / 180;
  const a = Math.sin(rad(lat2 - lat1) / 2) ** 2 + Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(rad(lon2 - lon1) / 2) ** 2;
  return Math.round(6371000 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(Math.max(0, 1 - a))));
}

export async function searchPlaces(params: URLSearchParams) {
  const { city, selected, sort } = query(params);
  const resolved = await geo("/v1/geocode/search", { text: city, type: "city", format: "json", limit: "1" });
  const center = resolved.results?.[0];
  if (!center?.place_id || !Number.isFinite(center.lat) || !Number.isFinite(center.lon)) {
    throw new ApiError(404, "CITY_NOT_FOUND", "City not found. Try a city name with its country.");
  }
  const data = await geo("/v2/places", {
    categories: geoapifyCategories(selected), filter: `place:${center.place_id}`,
    bias: `proximity:${center.lon},${center.lat}`, limit: "100",
  });
  const seen = new Set<string>();
  const places = (data.features ?? []).flatMap(({ properties }) => {
    const place = normalize(properties);
    // Geoapify tags overlap (e.g. entertainment includes museums). Keep only
    // the selected main groups after classification, before returning results.
    if (!place || !selected.includes(place.category as Category) || seen.has(place.id)) return [];
    seen.add(place.id);
    return [{ ...place, distance: distance(center.lat!, center.lon!, place.latitude, place.longitude) }];
  });
  places.sort(sort === "name" ? (a, b) => a.name.localeCompare(b.name, "en") : (a, b) => a.distance - b.distance || a.name.localeCompare(b.name, "en"));
  return {
    places, city: { name: center.formatted ?? city, latitude: center.lat, longitude: center.lon },
    meta: { limit: 100, count: places.length, distanceFrom: "city center", attribution: "Powered by Geoapify | © OpenStreetMap contributors" },
  };
}

export async function getPlace(id: string) {
  placeId(id);
  const data = await geo("/v2/place-details", { id, features: "details" });
  const found = data.features?.find(({ properties }) => properties.place_id === id) ?? data.features?.[0];
  const place = found ? normalize(found.properties) : null;
  if (!place) throw new ApiError(404, "PLACE_NOT_FOUND", "This place could not be found.");
  // Geoapify can encode a different centroid in the details ID for the same feature.
  // Keep the selected search ID stable for saved-state checks and duplicate handling.
  return { ...place, id };
}
