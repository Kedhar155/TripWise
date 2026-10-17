"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, MapPin, Compass } from "lucide-react";
import { categories, type Category, type Place } from "@/lib/types";
import { categoryLabel, message, request } from "@/lib/client-api";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Feedback } from "./feedback";
type Results = { places: Place[]; city: { name: string } };
export function Explore() {
  const [draft, setDraft] = useState("");
  const [city, setCity] = useState("");
  const [category, setCategory] = useState<Category>("all");
  const [sort, setSort] = useState("distance");
  const [results, setResults] = useState<Results | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    if (!city) return;
    const controller = new AbortController();
    request<Results>(`/api/places?${new URLSearchParams({city, category, sort})}`, {signal:controller.signal})
      .then(setResults).catch(e => { if (!controller.signal.aborted) setError(message(e)); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [city, category, sort, attempt]);
  function begin() { setError(""); setResults(null); setLoading(true); }
  return <>
    <section className="py-8 sm:py-14"><p className="eyebrow">Small plans. Great adventures.</p><h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight tracking-tight sm:text-6xl">A new city.<br/><span className="text-teal-700">Your kind of journey.</span></h1><p className="mt-5 max-w-xl text-lg leading-8 text-slate-600">Find places worth a detour. Save your favorites and make room for discovery.</p></section>
    <form onSubmit={e => { e.preventDefault(); if (draft.trim().length < 2) { setError("Enter a city name with at least 2 characters."); return; } begin(); setCity(draft.trim()); setAttempt(a => a + 1); }} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <label htmlFor="city" className="mb-2 block text-sm font-semibold">Where would you like to go?</label><div className="flex flex-col gap-3 sm:flex-row"><input id="city" required minLength={2} maxLength={120} value={draft} onChange={e => setDraft(e.target.value)} placeholder="Try Chennai, India" className="field flex-1"/><button className="button" type="submit">Search places <ArrowUpRight size={17} aria-hidden="true"/></button></div>
      <div className="mt-5 grid gap-4 sm:grid-cols-2"><div><label htmlFor="category" className="mb-2 block text-sm font-semibold">Category</label><select id="category" className="field w-full" value={category} onChange={e => { if (city) begin(); setCategory(e.target.value as Category); }}>{Object.entries(categories).map(([value,label]) => <option key={value} value={value}>{label}</option>)}</select></div><div><label htmlFor="sort" className="mb-2 block text-sm font-semibold">Sort by</label><select id="sort" className="field w-full" value={sort} onChange={e => { if (city) begin(); setSort(e.target.value); }}><option value="distance">Distance from city center</option><option value="name">Name (A–Z)</option></select></div></div>
    </form>
    <section aria-label="Search results" aria-busy={loading} className="mt-8">
      {loading && <Feedback>Finding places for your next adventure…</Feedback>}
      {error && <Feedback error>{error}{city && <button className="retry" onClick={() => { begin(); setAttempt(a => a + 1); }}>Retry</button>}</Feedback>}
      {!city && !error && <div className="py-12 text-center"><Compass className="mx-auto mb-4 text-teal-700" size={32}/><h2 className="text-xl font-semibold">Your next adventure starts here</h2><p className="mt-3 text-slate-500">Search a city to discover attractions, cafés, parks, and more.</p></div>}
      {results && !loading && !error && <><div className="mb-6"><p className="eyebrow">Explore your way</p><h2 className="mt-2 text-2xl font-semibold">{results.city.name}</h2><p role="status" className="mt-2 text-sm text-slate-500">{results.places.length} places · Up to 100 results · Distances from city center</p></div>{!results.places.length ? <Feedback>No places found in this category. Try another category or city.</Feedback> : <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{results.places.map(place => <Card key={place.id} className="min-w-0 gap-4 transition-shadow hover:shadow-md"><div className="flex items-center justify-between"><span className="rounded-full bg-teal-50 px-3 py-1 text-xs capitalize text-teal-800">{categoryLabel(place.category)}</span><MapPin size={20} className="text-teal-700" aria-hidden="true"/></div><CardTitle>{place.name}</CardTitle><CardDescription>{place.address}</CardDescription><div className="mt-auto flex items-center justify-between gap-2 pt-3 text-sm"><span className="text-slate-500">{place.distance === undefined ? "" : `${(place.distance / 1000).toFixed(1)} km away`}</span><Link className="font-semibold text-teal-700" href={`/places/${encodeURIComponent(place.id)}`}>View details <span aria-hidden="true">↗</span><span className="sr-only"> for {place.name}</span></Link></div></Card>)}</div>}</>}
    </section>
  </>;
}
