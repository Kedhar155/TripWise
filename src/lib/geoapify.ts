import "server-only";
import { ApiError, placeId } from "./api";
import type { Place } from "./types";
import { categoryEntries, geoapifyCategories, getCategoryKey, parseCategory, type Category } from "./categories";
import { isCountryCode } from "./countries";
import { isPlaceSort, sortPlaces, withinOptions } from "./place-sorting";
type Properties = {
  place_id?: string; name?: string; formatted?: string; address_line1?: string;
  lat?: number; lon?: number; categories?: string[]; category?: string; distance?: number;
  country_code?: string; country?: string; state?: string; city?: string; result_type?: string;
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
  const city = params.get("city")?.trim() ?? "";
  const state = params.has("state") ? searchText(params.get("state"), "state name") : undefined;
  const stateId = params.has("stateId") ? placeId(params.get("stateId")) : undefined;
  const sort = params.get("sort") ?? "relevance";
  const withinValue = params.get("within");
  if (withinValue !== null && !withinOptions.some(value => String(value) === withinValue)) throw new ApiError(400, "INVALID_WITHIN", "Within must be 1, 5, 10, or 25 km.");
  const within = withinValue === null ? undefined : Number(withinValue);
  const country = params.has("country") ? countryCode(params.get("country")) : undefined;
  const cityId = params.has("cityId") ? placeId(params.get("cityId")) : undefined;
  if ((state || stateId) && !country) throw new ApiError(400, "INVALID_COUNTRY", "Choose a country for this state.");
  if (stateId && !state) throw new ApiError(400, "INVALID_STATE", "Choose a state name with its ID.");
  if (!city && state && (within !== undefined || sort === "distance" || sort === "distance-desc")) throw new ApiError(400, "INVALID_STATE_FILTER", "Distance filters and sorts require a city.");
  if (cityId && !city) throw new ApiError(400, "INVALID_CITY", "Choose a city name with its ID.");
  if (cityId && !country) throw new ApiError(400, "INVALID_COUNTRY", "Choose a country for this city.");
  if ((!city && !state) || (city && (city.length < (country ? 3 : 2) || city.length > 120 || /[\u0000-\u001f]/.test(city)))) {
    throw new ApiError(400, "INVALID_CITY", `Enter a city name between ${country ? 3 : 2} and 120 characters.`);
  }
  const selected = selectedCategories(params);
  if (!isPlaceSort(sort)) throw new ApiError(400, "INVALID_SORT", "Choose a supported sort option.");
  return { city, country, cityId, state, stateId, selected, sort, within };
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
    city: p.city ?? null, state: p.state ?? null, country: p.country ?? p.country_code ?? null,
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
  const { city, country, cityId, state, stateId, selected, sort, within } = query(params);
  const region = state ? await resolveState(country!, state, stateId) : undefined;
  const stateOnly = !city && !!region;
  const resolved = stateOnly ? { results: [region!] } : cityId
    ? await geo("/v2/place-details", { id: cityId, features: "details" }, 86400)
    : await geo("/v1/geocode/search", { text: city, type: "city", format: "json", limit: "1", ...(country ? { filter: `countrycode:${country}${region ? `|place:${region.place_id}` : ""}` } : {}), lang: "en" });
  const center = cityId ? resolved.features?.[0]?.properties : resolved.results?.[0];
  if (country && center && center.country_code !== country) throw new ApiError(400, "CITY_COUNTRY_MISMATCH", "Choose a city in the selected country.");
  if (region && !stateOnly && center && center.state?.toLowerCase() !== region.state?.toLowerCase()) throw new ApiError(400, "CITY_STATE_MISMATCH", "Choose a city in the selected state.");
  if (!center?.place_id || !Number.isFinite(center.lat) || !Number.isFinite(center.lon)) {
    throw new ApiError(404, "CITY_NOT_FOUND", "City not found. Try a city name with its country.");
  }
  const data = await geo("/v2/places", {
    categories: geoapifyCategories(selected), filter: `place:${cityId ?? center.place_id}${within === undefined ? "" : `|circle:${center.lon},${center.lat},${within * 1000}`}`,
    ...(stateOnly ? {} : { bias: `proximity:${center.lon},${center.lat}` }), limit: "100",
  });
  const seen = new Set<string>();
  const places = (data.features ?? []).flatMap(({ properties }) => {
    const place = normalize(properties);
    // Geoapify tags overlap (e.g. entertainment includes museums). Keep only
    // the selected main groups after classification, before returning results.
    if (!place || !selected.includes(place.category as Category) || seen.has(place.id)) return [];
    seen.add(place.id);
    if (stateOnly) return [place];
    const meters = distance(center.lat!, center.lon!, place.latitude, place.longitude);
    // Also enforce the displayed center-to-place distance: Geoapify can measure
    // from the nearest edge of a large park rather than its displayed point.
    if (within !== undefined && meters > within * 1000) return [];
    return [{ ...place, distance: meters }];
  });
  return {
    places: sortPlaces(places, sort),
    ...(stateOnly ? { state: { name: center.formatted ?? state } } : { city: { name: center.formatted ?? city, latitude: center.lat, longitude: center.lon } }),
    resolvedState: center.state,
    meta: { limit: 100, count: places.length, within: within ?? null, distanceFrom: stateOnly ? null : "city center", attribution: "Powered by Geoapify | © OpenStreetMap contributors" },
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
  const region = params.has("state") ? await resolveState(country, searchText(params.get("state"), "state name"), params.has("stateId") ? placeId(params.get("stateId")) : undefined) : undefined;
  if (params.has("stateId") && !region) throw new ApiError(400, "INVALID_STATE", "Choose a state name with its ID.");
  const data = await geo("/v1/geocode/autocomplete", { text: text.toLowerCase(), type: "city", filter: `countrycode:${country}${region ? `|place:${region.place_id}` : ""}`, lang: "en", format: "json", limit: "6" }, 86400);
  const seen = new Set<string>();
  const cities = (data.results ?? []).flatMap(p => {
    if (!p.place_id || p.country_code !== country || !Number.isFinite(p.lat) || !Number.isFinite(p.lon) || seen.has(p.place_id)) return [];
    if (region && p.state?.toLowerCase() !== region.state?.toLowerCase()) return [];
    seen.add(p.place_id);
    return [{ id: p.place_id, name: p.city ?? p.name ?? p.address_line1 ?? p.formatted ?? text, label: [p.city ?? p.name ?? p.address_line1 ?? text, p.state, p.country].filter(Boolean).join(", "), country, state: p.state }];
  });
  return { cities };
}

export async function searchPlaceNames(params: URLSearchParams) {
  const name = searchText(params.get("name"), "place name");
  const selected = selectedCategories(params);
  const sort = params.get("sort") ?? "relevance";
  if (!isPlaceSort(sort) || sort === "distance" || sort === "distance-desc") throw new ApiError(400, "INVALID_SORT", "Choose a non-distance sort for a worldwide search.");
  if (params.has("within")) throw new ApiError(400, "INVALID_WITHIN", "Within distance is available for location searches only.");
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
  return { places: sortPlaces(filtered, sort), query: name, meta: { limit: 20, count: filtered.length, distanceFrom: null, attribution: "Powered by Geoapify | © OpenStreetMap contributors" } };
}

async function resolveState(country: string, name: string, id?: string) {
  const data = await geo("/v1/geocode/search", { text: name.toLowerCase(), type: "state", filter: `countrycode:${country}`, lang: "en", format: "json", limit: "5" }, 86400);
  const found = data.results?.find(p => p.result_type === "state" && p.country_code === country && p.place_id && (id ? p.place_id === id : (p.state ?? p.name)?.toLowerCase() === name.toLowerCase()));
  if (!found) throw new ApiError(400, "INVALID_STATE", "Choose a state in the selected country from the suggestions.");
  return found;
}

export async function suggestStates(params: URLSearchParams) {
  const country = countryCode(params.get("country"));
  const text = searchText(params.get("q"), "state name");
  const data = await geo("/v1/geocode/autocomplete", { text: text.toLowerCase(), type: "state", filter: `countrycode:${country}`, lang: "en", format: "json", limit: "6" }, 86400);
  const seen = new Set<string>();
  return { states: (data.results ?? []).flatMap(p => {
    if (!p.place_id || p.result_type !== "state" || p.country_code !== country || seen.has(p.place_id)) return [];
    seen.add(p.place_id);
    const name = p.state ?? p.name ?? p.address_line1 ?? text;
    return [{ id: p.place_id, name, label: [name, p.country].filter(Boolean).join(", "), country }];
  }) };
}
