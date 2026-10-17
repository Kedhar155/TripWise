"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, MapPin, Compass, X } from "lucide-react";
import type { Place } from "@/lib/types";
import { categories, type Category } from "@/lib/categories";
import { availableSorts, defaultWithin, groupPlaces, sortPlaces, sortOptions, withinOptions, type PlaceSort } from "@/lib/place-sorting";
import { CategoryFilter } from "./category-filter";
import { message, request } from "@/lib/client-api";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Feedback } from "./feedback";
import { PlaceSkeletons } from "./place-skeletons";
import { ErrorFeedback } from "./error-feedback";
import { CategoryBadge } from "./category-badge";
import { LocationSearch, type LocationSearchValue } from "./location-search";
const popularCities = [{ city: "Paris", country: "fr" }, { city: "Tokyo", country: "jp" }, { city: "Goa", country: "in" }, { city: "Dubai", country: "ae" }, { city: "London", country: "gb" }];

type Results = { places: Place[]; city?: { name: string }; query?: string };
type Search = { kind: "location"; value: LocationSearchValue } | { kind: "name"; name: string };
export function Explore() {
  const [nameDraft, setNameDraft] = useState("");
  const [nameError, setNameError] = useState("");
  const [search, setSearch] = useState<Search | null>(null);
  const [preset, setPreset] = useState<LocationSearchValue>();
  const [selected, setSelected] = useState<Category[]>([]);
  const category = selected.length ? selected.join(",") : "all";
  const [sort, setSort] = useState<PlaceSort>("relevance");
  const [within, setWithin] = useState<number | null>(defaultWithin);
  const [results, setResults] = useState<Results | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);
  const locationMode = search?.kind !== "name";
  const withinQuery = locationMode ? within : null;
  const currentResults = results && (!!results.city === locationMode) ? results : null;
  const options = availableSorts(currentResults?.places ?? []);
  const activeSort = options.some(option => option.value === sort) ? sort : "relevance";
  const places = sortPlaces(currentResults?.places ?? [], activeSort);
  const activeFilters = selected.length > 0 || (locationMode && within !== null) || activeSort !== "relevance";
  useEffect(() => {
    if (!search) return;
    const controller = new AbortController();
    const params = search.kind === "location"
      ? new URLSearchParams({ ...search.value, category, sort: "relevance", ...(withinQuery === null ? {} : { within: String(withinQuery) }) })
      : new URLSearchParams({ name: search.name, category, sort: "relevance" });
    request<Results>(`${search.kind === "location" ? "/api/places" : "/api/places/search"}?${params}`, {signal:controller.signal})
      .then(data => { if (!controller.signal.aborted) setResults(data); }).catch(e => { if (!controller.signal.aborted) setError(message(e)); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [search, category, withinQuery, attempt]);
  function begin() { setError(""); setLoading(true); }
  function searchLocation(value: LocationSearchValue) {
    begin(); setSearch({ kind: "location", value });
  }
  function searchName() {
    const name = nameDraft.trim();
    if (name.length < 3) { setNameError("Enter a place name with at least 3 characters."); return; }
    setNameError("");
    begin(); setSearch({ kind: "name", name });
  }
  function clearFilters() {
    if (search && (selected.length || (locationMode && within !== null))) begin();
    setSelected([]); setWithin(null); setSort("relevance");
  }
  function cards(items: Place[]) {
    return <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{items.map(place => <Card key={place.id} className="place-card min-w-0 gap-4">
      <div className="flex items-center justify-between"><CategoryBadge category={place.category} /><MapPin size={20} className="text-teal-700" aria-hidden="true"/></div>
      <CardTitle>{place.name}</CardTitle><CardDescription>{place.address}</CardDescription>
      <div className="mt-auto flex items-center justify-between gap-2 pt-3 text-sm"><span className="text-slate-500">{place.distance === undefined ? "" : `${(place.distance / 1000).toFixed(1)} km away`}</span><Link className="font-semibold text-teal-700" href={`/places/${encodeURIComponent(place.id)}`}>View details <span aria-hidden="true">↗</span><span className="sr-only"> for {place.name}</span></Link></div>
    </Card>)}</div>;
  }
  return <>
    <section aria-labelledby="explore-heading" className="mt-6 rounded-3xl bg-linear-to-br from-teal-900 to-teal-700 px-5 py-8 text-white sm:mt-8 sm:px-10 sm:py-12">
      <p className="text-xs font-semibold uppercase tracking-widest text-teal-100">Small plans. Great adventures.</p>
      <h1 id="explore-heading" className="mt-4 max-w-3xl text-4xl font-semibold leading-tight tracking-tight sm:text-6xl">Plan your next trip</h1>
      <p className="mt-4 max-w-xl text-base leading-7 text-teal-50 sm:text-lg">Find places worth a detour. Save your favorites and make room for discovery.</p>
      <LocationSearch key={preset ? `${preset.country}:${preset.city}` : "custom"} preset={preset} onSearch={searchLocation}/>
      <form onSubmit={e => { e.preventDefault(); searchName(); }} className="mt-4 rounded-2xl bg-white p-4 text-slate-800 shadow-sm sm:p-5">
        <h2 className="mb-4 text-base font-semibold">Search by place name</h2>
        <label htmlFor="place-name" className="mb-2 block text-sm font-semibold">Place name</label>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input id="place-name" aria-describedby={nameError ? "place-name-error" : undefined} aria-invalid={!!nameError} maxLength={120} value={nameDraft} onChange={e => { setNameDraft(e.target.value); setNameError(""); }} placeholder="Try Eiffel Tower or Taj Mahal" className="field flex-1"/>
          <button className="button" type="submit">Find a place <ArrowUpRight size={17} aria-hidden="true"/></button>
        </div>
        <p className="mt-2 text-xs text-slate-500">Search worldwide. No country or city needed.</p>
        {nameError && <p id="place-name-error" role="alert" className="mt-3 text-sm text-red-700">{nameError}</p>}
      </form>
      <div className="mt-5 flex flex-wrap items-center gap-2" role="group" aria-label="Popular cities">
        <span className="mr-1 w-full text-sm font-medium text-teal-50 sm:w-auto">Popular cities</span>
        {popularCities.map(value => <button key={value.city} type="button" onClick={() => { setPreset(value); searchLocation(value); }} className="min-h-11 rounded-full border border-teal-200 bg-white px-4 py-2 text-sm font-semibold text-teal-800 transition-colors hover:bg-teal-50 focus-visible:outline-white">{value.city}</button>)}
      </div>
    </section>
    <div className="mt-5 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className={`grid gap-4 ${locationMode ? "sm:grid-cols-3" : "sm:grid-cols-2"}`}>
        <CategoryFilter selected={selected} onChange={value => { if (value.join(",") === selected.join(",")) return; if (search) begin(); setSelected(value); }}/>
        {locationMode && <div><label htmlFor="within" className="mb-2 block text-sm font-semibold">Within</label><select id="within" className="field w-full" value={within ?? "all"} onChange={event => { if (search) begin(); setWithin(event.target.value === "all" ? null : Number(event.target.value)); }}><option value="all">Any distance</option>{withinOptions.map(value => <option key={value} value={value}>{value} km</option>)}</select><p className="mt-2 text-xs text-slate-500">From the city center</p></div>}
        <div><label htmlFor="sort" className="mb-2 block text-sm font-semibold">Sort by</label><select id="sort" className="field w-full" value={activeSort} onChange={event => setSort(event.target.value as PlaceSort)}>{options.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}</select></div>
      </div>
      {activeFilters && <div role="group" aria-label="Active filters" className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-4">
        {selected.map(key => { const Icon = categories[key].icon; return <button type="button" key={key} aria-label={`Remove ${categories[key].label} filter`} className="inline-flex min-h-11 max-w-full items-center gap-2 rounded-full bg-teal-50 px-3 py-2 text-xs font-medium text-teal-900" onClick={() => { if (search) begin(); setSelected(value => value.filter(item => item !== key)); }}><Icon size={14} className="shrink-0" aria-hidden="true"/>{categories[key].label}<X size={14} className="shrink-0" aria-hidden="true"/></button>; })}
        {locationMode && within !== null && <button type="button" aria-label="Remove distance filter" className="inline-flex min-h-11 items-center gap-2 rounded-full bg-teal-50 px-3 py-2 text-xs font-medium text-teal-900" onClick={() => { if (search) begin(); setWithin(null); }}>Within {within} km<X size={14} aria-hidden="true"/></button>}
        {activeSort !== "relevance" && <button type="button" aria-label="Remove sort filter" className="inline-flex min-h-11 items-center gap-2 rounded-full bg-teal-50 px-3 py-2 text-xs font-medium text-teal-900" onClick={() => setSort("relevance")}>{sortOptions.find(option => option.value === activeSort)!.label}<X size={14} aria-hidden="true"/></button>}
        <button type="button" className="min-h-11 px-2 text-sm font-semibold text-teal-700 underline" onClick={clearFilters}>Clear all</button>
      </div>}
    </div>
    <section aria-label="Search results" aria-busy={loading} className="mt-8">
      {loading && <PlaceSkeletons />}
      {error && <ErrorFeedback title="Could not search places" detail={error} onRetry={search ? () => { begin(); setAttempt(a => a + 1); } : undefined} />}
      {!search && !error && <div className="py-12 text-center"><Compass className="mx-auto mb-4 text-teal-700" size={32}/><h2 className="text-xl font-semibold">Your next adventure starts here</h2><p className="mt-3 text-slate-500">Choose a country and city, or find a place by name.</p></div>}
      {currentResults && !loading && !error && <>
        <div className="mb-6"><p className="eyebrow">Explore your way</p><h2 className="mt-2 break-words text-2xl font-semibold">{currentResults.city?.name ?? `Places matching “${currentResults.query}”`}</h2>
          <p role="status" className="mt-2 text-sm text-slate-500">{places.length} {places.length === 1 ? "result" : "results"} · {currentResults.city ? `Up to 100 results · ${within === null ? "Distances" : `Within ${within} km`} from city center` : "Up to 20 worldwide matches"}</p>
        </div>
        {!places.length ? <Feedback>{currentResults.city ? "No places found with these filters. Try a larger distance, another category, or Clear all." : "No places found, try a different name"}</Feedback> : activeSort === "category" ? <div className="space-y-8">{groupPlaces(places).map(group => <section key={group.category} aria-label={`${categories[group.category as Category].label} results`}><h3 className="mb-4 text-xl font-semibold">{categories[group.category as Category].label} <span className="text-sm font-normal text-slate-500">({group.places.length})</span></h3>{cards(group.places)}</section>)}</div> : cards(places)}
      </>}
    </section>
  </>;
}
