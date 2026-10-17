"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, MapPin, Compass } from "lucide-react";
import type { Place } from "@/lib/types";
import type { Category } from "@/lib/categories";
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
  const [sort, setSort] = useState("distance");
  const [results, setResults] = useState<Results | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    if (!search) return;
    const controller = new AbortController();
    const params = search.kind === "location"
      ? new URLSearchParams({ ...search.value, category, sort })
      : new URLSearchParams({ name: search.name, category, sort: sort === "name" ? "name" : "relevance" });
    request<Results>(`${search.kind === "location" ? "/api/places" : "/api/places/search"}?${params}`, {signal:controller.signal})
      .then(setResults).catch(e => { if (!controller.signal.aborted) setError(message(e)); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [search, category, sort, attempt]);
  function begin() { setError(""); setResults(null); setLoading(true); }
  function searchLocation(value: LocationSearchValue) {
    begin(); setSearch({ kind: "location", value });
  }
  function searchName() {
    const name = nameDraft.trim();
    if (name.length < 3) { setNameError("Enter a place name with at least 3 characters."); return; }
    setNameError("");
    begin(); setSearch({ kind: "name", name });
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
      <div className="grid gap-4 sm:grid-cols-2"><CategoryFilter selected={selected} onChange={value => { if (value.join(",") === selected.join(",")) return; if (search) begin(); setSelected(value); }}/><div><label htmlFor="sort" className="mb-2 block text-sm font-semibold">Sort by</label><select id="sort" className="field w-full" value={sort} onChange={e => { if (search) begin(); setSort(e.target.value); }}><option value="distance">{search?.kind === "name" ? "Best match" : "Distance from city center"}</option><option value="name">Name (A–Z)</option></select></div></div>
    </div>
    <section aria-label="Search results" aria-busy={loading} className="mt-8">
      {loading && <PlaceSkeletons />}
      {error && <ErrorFeedback title="Could not search places" detail={error} onRetry={search ? () => { begin(); setAttempt(a => a + 1); } : undefined} />}
      {!search && !error && <div className="py-12 text-center"><Compass className="mx-auto mb-4 text-teal-700" size={32}/><h2 className="text-xl font-semibold">Your next adventure starts here</h2><p className="mt-3 text-slate-500">Choose a country and city, or find a place by name.</p></div>}
      {results && !loading && !error && <>
        <div className="mb-6"><p className="eyebrow">Explore your way</p><h2 className="mt-2 break-words text-2xl font-semibold">{results.city?.name ?? `Places matching “${results.query}”`}</h2>
          <p role="status" className="mt-2 text-sm text-slate-500">{results.places.length} {results.places.length === 1 ? "place" : "places"} · {results.city ? "Up to 100 results · Distances from city center" : "Up to 20 worldwide matches"}</p>
        </div>
        {!results.places.length ? <Feedback>{results.city ? "No places found in this category. Try another category or city." : "No places found, try a different name"}</Feedback> : <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{results.places.map(place => <Card key={place.id} className="place-card min-w-0 gap-4">
          <div className="flex items-center justify-between"><CategoryBadge category={place.category} /><MapPin size={20} className="text-teal-700" aria-hidden="true"/></div>
          <CardTitle>{place.name}</CardTitle><CardDescription>{place.address}</CardDescription>
          <div className="mt-auto flex items-center justify-between gap-2 pt-3 text-sm"><span className="text-slate-500">{place.distance === undefined ? "" : `${(place.distance / 1000).toFixed(1)} km away`}</span><Link className="font-semibold text-teal-700" href={`/places/${encodeURIComponent(place.id)}`}>View details <span aria-hidden="true">↗</span><span className="sr-only"> for {place.name}</span></Link></div>
        </Card>)}</div>}
      </>}
    </section>
  </>;
}
