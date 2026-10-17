import "server-only";
import { ApiError, placeId } from "./api";
import type { Place } from "./types";
import { categoryEntries, geoapifyCategories, getCategoryKey, parseCategory, type Category } from "./categories";
import { isCountryCode } from "./countries";
type Properties = {
  place_id?: string; name?: string; formatted?: string; address_line1?: string;
  lat?: number; lon?: number; categories?: string[]; category?: string; distance?: number;
  country_code?: string; city?: string; result_type?: string;
  website?: string; opening_hours?: string;
  contact?: { phone?: string; website?: string };
  datasource?: { raw?: { website?: string; phone?: string; opening_hours?: string } };
};
type GeoData = { features?: { properties: Properties }[]; results?: Properties[] };

async function geo(path: string, params: Record<string, string>, cacheSeconds = 0): Promise<GeoData> {
  const key = process.env.GEOAPIFY_API_KEY;
  if (!key) throw new ApiError(500, "PLACES_NOT_CONFIGURED", "Place search is not configured yet.");
  const url = new URL(path, "https://api.geoapify.com");
  for (const [name, value] of Object.entries({ ...params, apiKey: key })) url.searchParams.set(name, value);
  try {
    const response = await fetch(url, { ...(cacheSeconds ? { cache: "force-cache" as const, next: { revalidate: cacheSeconds } } : { cache: "no-store" as const }), signal: AbortSignal.timeout(12000) });
    if (response.status === 404 || (path === "/v2/place-details" && response.status === 400)) throw new ApiError(404, "PLACE_NOT_FOUND", "This place could not be found.");
    if (!response.ok) throw new Error();
    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(500, "PLACES_UNAVAILABLE", "The places service is unavailable. Please try again shortly.");
  }
}

function selectedCategories(params: URLSearchParams): Category[] {
  const values = params.getAll("category").flatMap(value => value.split(","));
  if (!values.length) values.push("all");
  if (values.some(value => value !== "all" && !parseCategory(value))) throw new ApiError(400, "INVALID_CATEGORY", "Choose supported place categories, or All.");
  if (values.includes("all") && values.length !== 1) throw new ApiError(400, "INVALID_CATEGORY", "Choose All on its own, or select specific categories.");
  return values[0] === "all" ? categoryEntries.map(([key]) => key) : [...new Set(values.map(value => parseCategory(value)!))];
}

export function query(params: URLSearchParams) {
  const city = params.get("city")?.trim();
  const sort = params.get("sort") ?? "distance";
  const country = params.has("country") ? countryCode(params.get("country")) : undefined;
  const cityId = params.has("cityId") ? placeId(params.get("cityId")) : undefined;
  if (cityId && !country) throw new ApiError(400, "INVALID_COUNTRY", "Choose a country for this city.");
  if (!city || city.length < (country ? 3 : 2) || city.length > 120 || /[\u0000-\u001f]/.test(city)) {
    throw new ApiError(400, "INVALID_CITY", `Enter a city name between ${country ? 3 : 2} and 120 characters.`);
  }
  const selected = selectedCategories(params);
  if (sort !== "name" && sort !== "distance") throw new ApiError(400, "INVALID_SORT", "Sort must be name or distance.");
  return { city, country, cityId, selected, sort };
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
    category: getCategoryKey([...(p.categories ?? []), ...(p.category ? [p.category] : [])]),
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
  const { city, country, cityId, selected, sort } = query(params);
  const resolved = cityId
    ? await geo("/v2/place-details", { id: cityId, features: "details" }, 86400)
    : await geo("/v1/geocode/search", { text: city, type: "city", format: "json", limit: "1", ...(country ? { filter: `countrycode:${country}` } : {}) });
  const center = cityId ? resolved.features?.[0]?.properties : resolved.results?.[0];
  if (country && center && center.country_code !== country) throw new ApiError(400, "CITY_COUNTRY_MISMATCH", "Choose a city in the selected country.");
  if (!center?.place_id || !Number.isFinite(center.lat) || !Number.isFinite(center.lon)) {
    throw new ApiError(404, "CITY_NOT_FOUND", "City not found. Try a city name with its country.");
  }
  const data = await geo("/v2/places", {
    categories: geoapifyCategories(selected), filter: `place:${cityId ?? center.place_id}`,
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

export async function getPlace(id: string, cacheSeconds = 0) {
  placeId(id);
  const data = await geo("/v2/place-details", { id, features: "details" }, cacheSeconds);
  const found = data.features?.find(({ properties }) => properties.place_id === id) ?? data.features?.[0];
  const place = found ? normalize(found.properties) : null;
  if (!place) throw new ApiError(404, "PLACE_NOT_FOUND", "This place could not be found.");
  // Geoapify can encode a different centroid in the details ID for the same feature.
  // Keep the selected search ID stable for saved-state checks and duplicate handling.
  return { ...place, id };
}

function countryCode(value: string | null) {
  if (!value || !isCountryCode(value)) throw new ApiError(400, "INVALID_COUNTRY", "Choose a supported country.");
  return value;
}

function searchText(value: string | null, label: string) {
  const text = value?.trim().replace(/\s+/g, " ");
  if (!text || text.length < 3 || text.length > 120 || /[\u0000-\u001f]/.test(value!)) {
    throw new ApiError(400, "INVALID_SEARCH", `Enter a ${label} between 3 and 120 characters.`);
  }
  return text;
}

export async function suggestCities(params: URLSearchParams) {
  const country = countryCode(params.get("country"));
  const text = searchText(params.get("q"), "city name");
  const data = await geo("/v1/geocode/autocomplete", { text: text.toLowerCase(), type: "city", filter: `countrycode:${country}`, lang: "en", format: "json", limit: "6" }, 86400);
  const seen = new Set<string>();
  const cities = (data.results ?? []).flatMap(p => {
    if (!p.place_id || p.country_code !== country || !Number.isFinite(p.lat) || !Number.isFinite(p.lon) || seen.has(p.place_id)) return [];
    seen.add(p.place_id);
    return [{ id: p.place_id, name: p.city ?? p.name ?? p.address_line1 ?? p.formatted ?? text, label: p.formatted ?? p.name ?? text, country }];
  });
  return { cities };
}

export async function searchPlaceNames(params: URLSearchParams) {
  const name = searchText(params.get("name"), "place name");
  const selected = selectedCategories(params);
  const sort = params.get("sort") ?? "relevance";
  if (sort !== "name" && sort !== "relevance") throw new ApiError(400, "INVALID_SORT", "Sort must be name or relevance for a worldwide search.");
  // Geocoding amenity search accepts a name without a spatial constraint.
  // Disabling the default IP-country bias keeps this search worldwide.
  const data = await geo("/v1/geocode/search", { text: name.toLowerCase(), type: "amenity", bias: "countrycode:none", lang: "en", format: "json", limit: "20" }, 3600);
  const seen = new Set<string>();
  const places: Place[] = [];
  for (const p of data.results ?? []) {
    const place = normalize(p);
    if (!place || seen.has(place.id)) continue;
    seen.add(place.id);
    places.push(place);
  }
  // Some geocoding matches omit category tags. Resolve those from details so
  // their card, Details page, and saved trip share the same category.
  const enriched = await Promise.all(places.map(async place => {
    if (place.category !== "other") return place;
    try { return { ...place, category: (await getPlace(place.id, 3600)).category }; }
    catch { return place; } // A missing optional category must not hide a match.
  }));
  const filtered = enriched.filter(place => selected.includes(place.category as Category));
  if (sort === "name") filtered.sort((a, b) => a.name.localeCompare(b.name, "en"));
  return { places: filtered, query: name, meta: { limit: 20, count: filtered.length, distanceFrom: null, attribution: "Powered by Geoapify | © OpenStreetMap contributors" } };
}
