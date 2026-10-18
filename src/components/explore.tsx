"use client";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { ArrowUpRight, MapPin, Compass, SlidersHorizontal, ChevronDown, X } from "lucide-react";
import type { Place } from "@/lib/types";
import { categories, type Category } from "@/lib/categories";
import { availableSorts, groupPlaces, sortPlaces, sortOptions, withinOptions, type PlaceSort } from "@/lib/place-sorting";
import { CategoryFilter } from "./category-filter";
import { message, request } from "@/lib/client-api";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Feedback } from "./feedback";
import { PlaceSkeletons } from "./place-skeletons";
import { ErrorFeedback } from "./error-feedback";
import { CategoryBadge } from "./category-badge";
import { LocationSearch } from "./location-search";
import { readExploreSession, saveExploreSession, searchUrl, type ExploreSession, type LocationSearchValue, type Results, type Search } from "@/lib/explore-session";
import { countries } from "@/lib/countries";
const popularCities = [{ city: "Paris", country: "fr" }, { city: "Tokyo", country: "jp" }, { city: "Goa", country: "in" }, { city: "Dubai", country: "ae" }, { city: "London", country: "gb" }];

const subscribe = () => () => {};
export function Explore() {
  // Read session data after hydration, without mismatching the server HTML.
  const hydrated = useSyncExternalStore(subscribe, () => true, () => false);
  return hydrated ? <RestoredExplore /> : <div className="py-8"><PlaceSkeletons /></div>;
}
function RestoredExplore() {
  const [initial] = useState(readExploreSession);
  const [location, setLocation] = useState(initial.location);
  const [locationVersion, setLocationVersion] = useState(0);
  const [mode, setMode] = useState<"location" | "name">(initial.mode);
  const [filtersOpen, setFiltersOpen] = useState(initial.filtersOpen);
  const filterTrigger = useRef<HTMLButtonElement>(null);
  const [nameDraft, setNameDraft] = useState(initial.nameDraft);
  const [nameError, setNameError] = useState("");
  const [search, setSearch] = useState<Search | null>(initial.search);
  const [selected, setSelected] = useState<Category[]>(initial.selected);
  const category = selected.length ? selected.join(",") : "all";
  const [sort, setSort] = useState<PlaceSort>(initial.sort);
  const [within, setWithin] = useState<number | null>(initial.within);
  const [results, setResults] = useState<Results | null>(initial.results);
  const [loading, setLoading] = useState(!!initial.search);
  const [resultsKey, setResultsKey] = useState(initial.resultsKey);
  const cache = useRef({ key: initial.resultsKey, results: initial.results });
  const restoreScroll = useRef<number | null>(initial.scrollY);
  const snapshot = useRef<ExploreSession>(initial);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);
  const locationMode = search?.kind !== "name";
  const stateOnly = search?.kind === "location" && !search.value.city && !!search.value.state;
  const distanceEnabled = locationMode && !stateOnly;
  const withinQuery = distanceEnabled ? within : null;
  const currentResults = results && (!!(results.city || results.state) === locationMode) ? results : null;
  const options = availableSorts(currentResults?.places ?? []);
  const activeSort = options.some(option => option.value === sort) ? sort : "relevance";
  const places = sortPlaces(currentResults?.places ?? [], activeSort);
  const activeFilters = selected.length > 0 || (distanceEnabled && within !== null) || activeSort !== "relevance";
  const filterCount = selected.length + (mode === "location" && distanceEnabled && within !== null ? 1 : 0);
  function switchMode(next: "location" | "name") {
    if (next === mode) return;
    setMode(next); setFiltersOpen(false);
    // Clear only the displayed search state; mounted forms keep their drafts.
    setSearch(null); setResults(null); setLoading(false); setError(""); setNameError("");
  }
  useEffect(() => {
    if (!search) return;
    const controller = new AbortController();
    const url = searchUrl(search, category, withinQuery);
    if (attempt === 0 && cache.current.key === url && cache.current.results) {
      setResults(cache.current.results); setResultsKey(url); setLoading(false);
      return;
    }
    setLoading(true); setError("");
    request<Results>(url, { signal: controller.signal })
      .then(data => { if (!controller.signal.aborted) {
        cache.current = { key: url, results: data };
        setResults(data); setResultsKey(url);
        if (search.kind === "location" && data.resolvedState) setLocation(draft => {
          // Do not overwrite edits made while the request was in flight.
          if (draft.country !== search.value.country || draft.city?.label !== search.value.city || draft.state || draft.stateText) return draft;
          return { ...draft, stateText: data.resolvedState!, state: { id: "", name: data.resolvedState!, label: data.resolvedState!, country: draft.country } };
        });
      } }).catch(e => { if (!controller.signal.aborted) setError(message(e)); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [search, category, withinQuery, attempt]);
  useEffect(() => {
    snapshot.current = { version: 1, mode, location, nameDraft, selected, sort, within, filtersOpen, search, results, resultsKey, scrollY: restoreScroll.current ?? window.scrollY };
    saveExploreSession(snapshot.current);
  }, [mode, location, nameDraft, selected, sort, within, filtersOpen, search, results, resultsKey]);
  useEffect(() => {
    const saveScroll = () => {
      if (restoreScroll.current !== null) return;
      snapshot.current = { ...snapshot.current, scrollY: window.scrollY };
      saveExploreSession(snapshot.current);
    };
    window.addEventListener("scroll", saveScroll, { passive: true });
    window.addEventListener("pagehide", saveScroll);
    return () => { window.removeEventListener("scroll", saveScroll); window.removeEventListener("pagehide", saveScroll); };
  }, []);
  useEffect(() => {
    if (loading || restoreScroll.current === null) return;
    // Restore after cards have layout and after the router's scroll handling.
    let second = 0;
    const first = requestAnimationFrame(() => { second = requestAnimationFrame(() => {
      window.scrollTo({ top: restoreScroll.current ?? 0, behavior: "instant" });
      restoreScroll.current = null;
    }); });
    return () => { cancelAnimationFrame(first); cancelAnimationFrame(second); };
  }, [loading]);
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
    if (search && (selected.length || (distanceEnabled && within !== null))) begin();
    setSelected([]); setWithin(null); setSort("relevance");
  }
  function rememberDeparture() {
    // Freeze before Next scrolls the outgoing page during navigation.
    restoreScroll.current = window.scrollY;
    snapshot.current = { ...snapshot.current, scrollY: window.scrollY };
    saveExploreSession(snapshot.current);
  }
  function cards(items: Place[]) {
    return <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{items.map(place => <Card key={place.id} className="place-card relative min-w-0 cursor-pointer gap-4">
      <div className="flex items-center justify-between"><CategoryBadge category={place.category} /><MapPin size={20} className="text-teal-700" aria-hidden="true"/></div>
      <CardTitle>{place.name}</CardTitle><CardDescription>{place.address}</CardDescription>
      <div className="mt-auto flex items-center justify-between gap-2 pt-3 text-sm"><span className="text-slate-500">{place.distance === undefined ? "" : `${(place.distance / 1000).toFixed(1)} km away`}</span><Link className="font-semibold text-teal-700 after:absolute after:inset-0 after:rounded-2xl focus-visible:outline-none focus-visible:after:outline-3 focus-visible:after:outline-teal-600 focus-visible:after:outline-offset-4" onNavigate={rememberDeparture} href={`/places/${encodeURIComponent(place.id)}`}>View details <span aria-hidden="true">↗</span><span className="sr-only"> for {place.name}</span></Link></div>
    </Card>)}</div>;
  }
  return <div className="explore-page">
    <section aria-labelledby="explore-heading" className="mt-6 rounded-3xl bg-linear-to-br from-teal-900 to-teal-700 px-5 py-8 text-white sm:mt-8 sm:px-10 sm:py-12">
      <div className="hero-copy">
        <p className="hero-kicker"><span aria-hidden="true">✦</span> Small plans. Great adventures.</p>
        <h1 id="explore-heading">Where to <em>next?</em></h1>
        <p className="hero-description">Find places worth a detour. Save your favorites and make room for discovery.</p>
        <div className="retro-stripes" aria-hidden="true"><span /><span /><span /></div>
      </div>
      <p className="hero-edition" aria-hidden="true">A world of possibilities<br /><span>EXPLORE / 01</span></p>
    </section>
    <section aria-label="Search tools" className="mt-5">
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div role="tablist" aria-label="Search type" className="mb-5 grid grid-cols-2 gap-1 rounded-2xl bg-slate-100 p-1 sm:inline-flex" onKeyDown={event => {
        if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
        event.preventDefault();
        const next = event.key === "Home" ? "location" : event.key === "End" ? "name" : mode === "location" ? "name" : "location";
        switchMode(next); document.getElementById(`search-tab-${next}`)?.focus();
      }}>
        {([{ value: "location", label: "Search by location" }, { value: "name", label: "Search by place name" }] as const).map(tab => <button key={tab.value} id={`search-tab-${tab.value}`} role="tab" type="button" aria-selected={mode === tab.value} aria-controls={`search-panel-${tab.value}`} tabIndex={mode === tab.value ? 0 : -1} onClick={() => switchMode(tab.value)} className={`min-h-12 rounded-xl px-3 py-2 text-sm font-semibold transition-colors sm:px-5 ${mode === tab.value ? "bg-white text-teal-800 shadow-sm" : "text-slate-600 hover:text-teal-800"}`}>{tab.label}</button>)}
      </div>
      <div id="search-panel-location" role="tabpanel" aria-labelledby="search-tab-location" hidden={mode !== "location"}>
        <LocationSearch key={locationVersion} draft={location} onDraftChange={setLocation} onSearch={searchLocation}/>
        <div className="mt-4 flex flex-wrap items-center gap-2" role="group" aria-label="Popular cities">
          <span className="mr-1 text-xs text-slate-500">Try</span>
          {popularCities.map(value => <button key={value.city} type="button" onClick={() => { setLocationVersion(value => value + 1); setLocation({ countryText: countries.find(item => item.code === value.country)!.name, country: value.country, stateText: "", state: null, cityText: value.city, city: { id: "", name: value.city, label: value.city, country: value.country } }); searchLocation(value); }} className="min-h-10 rounded-full border border-teal-100 bg-teal-50/50 px-3 py-2 text-xs font-semibold text-teal-800 transition-colors hover:bg-teal-50">{value.city}</button>)}
        </div>
      </div>
      <div id="search-panel-name" role="tabpanel" aria-labelledby="search-tab-name" hidden={mode !== "name"}>
      <form onSubmit={e => { e.preventDefault(); searchName(); }}>
        <label htmlFor="place-name" className="mb-2 block text-sm font-semibold">Place name</label>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input id="place-name" aria-describedby={nameError ? "place-name-error" : undefined} aria-invalid={!!nameError} maxLength={120} value={nameDraft} onChange={e => { setNameDraft(e.target.value); setNameError(""); }} placeholder="Try Eiffel Tower or Taj Mahal" className="field h-13 w-full flex-1"/>
          <button className="button min-h-13" type="submit">Search <ArrowUpRight size={17} aria-hidden="true"/></button>
        </div>
        <p className="mt-2 text-xs text-slate-500">Search worldwide. No country or city needed.</p>
        {nameError && <p id="place-name-error" role="alert" className="mt-3 text-sm text-red-700">{nameError}</p>}
      </form>
      </div>
      </div>
      <div aria-label="Result controls" className="mt-5 flex flex-wrap items-center gap-2">
        <button ref={filterTrigger} type="button" aria-expanded={filtersOpen} aria-controls="explore-filters" onClick={() => setFiltersOpen(value => !value)} className="inline-flex min-h-13 shrink-0 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm font-semibold text-teal-800"><SlidersHorizontal size={17} aria-hidden="true"/>Filters{filterCount > 0 && <span className="rounded-full bg-teal-50 px-2 py-0.5 text-xs">{filterCount}</span>}<ChevronDown size={17} className={`transition-transform ${filtersOpen ? "rotate-180" : ""}`} aria-hidden="true"/></button>
        <div className="min-w-0 max-w-full flex-[0_1_11rem]">
          <label htmlFor="sort" className="sr-only">Sort by</label>
          <select id="sort" className="min-h-13 w-full min-w-0 rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm font-semibold text-teal-800" value={activeSort} onChange={event => setSort(event.target.value as PlaceSort)}>{options.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}</select>
        </div>
        <p role="status" className="min-w-0 text-sm text-slate-500">{loading ? "Finding places…" : error ? "Search unavailable" : `${places.length} ${places.length === 1 ? "result" : "results"}`}</p>
      </div>
      <div id="explore-filters" className={`${filtersOpen ? "flex" : "hidden"} mt-5 flex-wrap items-start gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm`}>
        <div className="min-w-0 max-w-full flex-[1_1_14rem]"><CategoryFilter selected={selected} onChange={value => { if (value.join(",") === selected.join(",")) return; if (search) begin(); setSelected(value); }}/></div>
        {mode === "location" && distanceEnabled && <div className="min-w-0 max-w-full flex-[1_1_14rem]"><label htmlFor="within" className="mb-2 block text-sm font-semibold">Within</label><select id="within" className="field h-13 w-full" value={within ?? "all"} onChange={event => { if (search) begin(); setWithin(event.target.value === "all" ? null : Number(event.target.value)); }}><option value="all">Any distance</option>{withinOptions.map(value => <option key={value} value={value}>{value} km</option>)}</select><p className="mt-2 text-xs text-slate-500">From the city center</p></div>}
        <button type="button" className="button min-h-13" onClick={() => { setFiltersOpen(false); filterTrigger.current?.focus(); }}>Done</button>
      </div>
    </section>
    <section aria-label="Search results" aria-busy={loading} className="mt-8">
      {currentResults && !loading && !error && <div className="mb-4"><p className="eyebrow">Explore your way</p><h2 className="mt-2 break-words text-2xl font-semibold">{currentResults.state?.name ?? currentResults.city?.name ?? `Places matching “${currentResults.query}”`}</h2>
        <p className="mt-2 text-sm text-slate-500">{currentResults.state ? "Up to 100 places across the state · Choose a city to narrow your search" : currentResults.city ? `Up to 100 results · ${within === null ? "Distances" : `Within ${within} km`} from city center` : "Up to 20 worldwide matches"}</p>
      </div>}
      {activeFilters && search && <div role="group" aria-label="Active filters" className="mb-6 flex flex-wrap items-center gap-2">
        {selected.map(key => { const Icon = categories[key].icon; return <button type="button" key={key} aria-label={`Remove ${categories[key].label} filter`} className="inline-flex min-h-11 max-w-full items-center gap-2 rounded-full bg-teal-50 px-3 py-2 text-xs font-medium text-teal-900" onClick={() => { if (search) begin(); setSelected(value => value.filter(item => item !== key)); }}><Icon size={14} className="shrink-0" aria-hidden="true"/>{categories[key].label}<X size={14} className="shrink-0" aria-hidden="true"/></button>; })}
        {distanceEnabled && within !== null && <button type="button" aria-label="Remove distance filter" className="inline-flex min-h-11 items-center gap-2 rounded-full bg-teal-50 px-3 py-2 text-xs font-medium text-teal-900" onClick={() => { if (search) begin(); setWithin(null); }}>Within {within} km<X size={14} aria-hidden="true"/></button>}
        {activeSort !== "relevance" && <button type="button" aria-label="Remove sort filter" className="inline-flex min-h-11 items-center gap-2 rounded-full bg-teal-50 px-3 py-2 text-xs font-medium text-teal-900" onClick={() => setSort("relevance")}>{sortOptions.find(option => option.value === activeSort)!.label}<X size={14} aria-hidden="true"/></button>}
        <button type="button" className="min-h-11 px-2 text-sm font-semibold text-teal-700 underline" onClick={clearFilters}>Clear all</button>
      </div>}
      {loading && <PlaceSkeletons />}
      {error && <ErrorFeedback title="Could not search places" detail={error} onRetry={search ? () => { begin(); setAttempt(a => a + 1); } : undefined} />}
      {!search && !error && <div className="py-12 text-center"><Compass className="mx-auto mb-4 text-teal-700" size={32}/><h2 className="text-xl font-semibold">Your next adventure starts here</h2><p className="mt-3 text-slate-500">Choose a country and a state or city, or find a place by name.</p></div>}
      {currentResults && !loading && !error && <>
        {!places.length ? <Feedback>{currentResults.state ? "No places found in this state with these filters. Try another category or Clear all." : currentResults.city ? "No places found with these filters. Try a larger distance, another category, or Clear all." : "No places found, try a different name"}</Feedback> : activeSort === "category" ? <div className="space-y-8">{groupPlaces(places).map(group => <section key={group.category} aria-label={`${categories[group.category as Category].label} results`}><h3 className="mb-4 text-xl font-semibold">{categories[group.category as Category].label} <span className="text-sm font-normal text-slate-500">({group.places.length})</span></h3>{cards(group.places)}</section>)}</div> : cards(places)}
      </>}
    </section>
  </div>;
}
