"use client";
import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { countries } from "@/lib/countries";
import { cityDebounceMs, cityQuery, citySuggestions } from "@/lib/city-suggestions";
import { message } from "@/lib/client-api";
import type { CitySuggestion } from "@/lib/types";
import type { LocationDraft, LocationSearchValue } from "@/lib/explore-session";
import { SearchCombobox } from "./search-combobox";

export function LocationSearch({ onSearch, draft, onDraftChange }: { onSearch: (value: LocationSearchValue) => void; draft: LocationDraft; onDraftChange: (draft: LocationDraft) => void }) {
  const { countryText, country, cityText, city } = draft;
  const [suggestions, setSuggestions] = useState<CitySuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    if (city || !cityQuery(country, cityText)) return;
    const controller = new AbortController();
    const timer = setTimeout(() => {
      citySuggestions(country, cityText, controller.signal).then(items => {
        if (!controller.signal.aborted) { setSuggestions(items); setError(""); }
      }).catch(error => { if (!controller.signal.aborted) setError(message(error)); })
        .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    }, cityDebounceMs);
    return () => { clearTimeout(timer); controller.abort(); };
  }, [country, cityText, city, attempt]);
  function resetCity() { setSuggestions([]); setLoading(false); setError(""); setFormError(""); }
  return <form onSubmit={event => {
    event.preventDefault();
    if (!country) { setFormError("Choose a country from the list first."); return; }
    if (!city || city.country !== country) { setFormError("Type at least 3 letters and choose a city suggestion."); return; }
    setFormError(""); onSearch({ city: city.label, country, ...(city.id ? { cityId: city.id } : {}) });
  }} className="space-y-4">
    <div className="grid items-start gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]">
      <SearchCombobox id="country" label="Country" value={countryText} placeholder="Search countries" options={countries.filter(item => item.name.toLowerCase().includes(countryText.trim().toLowerCase())).map(item => ({ id: item.code, label: item.name }))}
        note="Choose a country from the list." empty="No countries found. Try another spelling."
        onChange={text => { onDraftChange({ countryText: text, country: "", cityText: "", city: null }); resetCity(); }} onPick={code => { onDraftChange({ countryText: countries.find(item => item.code === code)!.name, country: code, cityText: "", city: null }); resetCity(); }}/>
      <SearchCombobox id="city" label="City" value={cityText} placeholder={country ? "Type at least 3 letters" : "Choose a country first"} disabled={!country} options={suggestions.map(item => ({ id: item.id, label: item.label }))} loading={loading} error={error}
        note={city ? "City selected. Ready to search." : "Suggestions start after 3 letters."} empty={city ? "Edit the city name to choose another city." : cityText.trim().length < 3 ? "Type at least 3 letters to see cities." : "No cities found. Try a different name."}
        onChange={text => { onDraftChange({ ...draft, cityText: text, city: null }); setSuggestions([]); setError(""); setFormError(""); setLoading(!!cityQuery(country, text)); }} onPick={id => { const found = suggestions.find(item => item.id === id)!; onDraftChange({ ...draft, city: found, cityText: found.label }); setSuggestions([]); setLoading(false); setError(""); setFormError(""); }}/>
      <button className="button min-h-13 w-full md:mt-7 md:w-auto" type="submit">Search <ArrowUpRight size={17} aria-hidden="true"/></button>
    </div>
    {error && <button type="button" className="mt-2 text-sm font-semibold text-teal-700 underline" onClick={() => { setError(""); setLoading(true); setAttempt(value => value + 1); }}>Retry city suggestions</button>}
    {formError && <p role="alert" className="mt-3 text-sm text-red-700">{formError}</p>}
  </form>;
}
