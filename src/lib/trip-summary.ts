import { getCategoryKey, getCategoryStyle } from "./categories";
import { plannedDay } from "./trip-days";

type TripPlace = { category: string; day: number | null; country?: string | null; state?: string | null; city?: string | null };
type CityGroup = { city: string; count: number };
type StateGroup = { state: string | null; count: number; cities: CityGroup[] };
type CountryGroup = { country: string | null; states: StateGroup[] };

function locationGroups(items: TripPlace[]) {
  const countries = new Map<string, { country: string | null; states: Map<string, { state: string | null; count: number; cities: Map<string, CityGroup> }> }>();
  const stateIds = new Set<string>();
  const cityIds = new Set<string>();
  const clean = (value?: string | null) => value?.trim().replace(/\s+/g, " ").normalize("NFC") || null;
  const key = (value: string | null) => value?.toLocaleLowerCase("en") ?? "";
  for (const item of items) {
    const country = clean(item.country), state = clean(item.state), city = clean(item.city);
    if (!state && !city) continue;
    const countryKey = key(country), stateKey = key(state), cityKey = key(city);
    if (state) stateIds.add(JSON.stringify([countryKey, stateKey]));
    if (city) cityIds.add(JSON.stringify([countryKey, stateKey, cityKey]));
    let parent = countries.get(countryKey);
    if (!parent) { parent = { country, states: new Map() }; countries.set(countryKey, parent); }
    let region = parent.states.get(stateKey);
    if (!region) { region = { state, count: 0, cities: new Map() }; parent.states.set(stateKey, region); }
    region.count += 1;
    if (city) {
      const existing = region.cities.get(cityKey);
      if (existing) existing.count += 1;
      else region.cities.set(cityKey, { city, count: 1 });
    }
  }
  const locations: CountryGroup[] = [...countries.values()].map(country => ({
    country: country.country,
    states: [...country.states.values()].map(state => ({
      state: state.state, count: state.count,
      cities: [...state.cities.values()].sort((a, b) => a.city.localeCompare(b.city, "en")),
    })).sort((a, b) => (a.state ?? "").localeCompare(b.state ?? "", "en")),
  })).sort((a, b) => (a.country ?? "").localeCompare(b.country ?? "", "en"));
  return { stateCount: stateIds.size, cityCount: cityIds.size, locations };
}

export function summarizeTrip(items: TripPlace[]) {
  const days = new Set<number>();
  let unplanned = 0;
  const groups = new Map<string, { category: string; count: number }>();
  for (const item of items) {
    const day = plannedDay(item.day);
    if (day === null) unplanned += 1;
    else days.add(day);
    const category = item.category.trim().toLowerCase();
    const key = getCategoryKey(category);
    const group = groups.get(key);
    if (group) group.count += 1;
    else groups.set(key, { category: key, count: 1 });
  }
  const categories = [...groups.values()].map(group => {
    const style = getCategoryStyle(group.category);
    const name = group.count === 1 ? style.singular : style.plural;
    return { ...group, label: `${group.count} ${name}` };
  }).sort((a, b) => b.count - a.count || a.category.localeCompare(b.category, "en"));
  return { total: items.length, plannedDays: days.size, unplanned, categories, ...locationGroups(items) };
}
