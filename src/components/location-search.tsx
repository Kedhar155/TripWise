"use client";
import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { countries } from "@/lib/countries";
import { cityDebounceMs, cityQuery, citySuggestions } from "@/lib/city-suggestions";
import { message } from "@/lib/client-api";
import type { CitySuggestion } from "@/lib/types";
import { SearchCombobox } from "./search-combobox";

export type LocationSearchValue = { city: string; country: string; cityId?: string };
export function LocationSearch({ onSearch, preset }: { onSearch: (value: LocationSearchValue) => void; preset?: LocationSearchValue }) {
  const [countryText, setCountryText] = useState(countries.find(item => item.code === preset?.country)?.name ?? "");
  const [country, setCountry] = useState(preset?.country ?? "");
  const [cityText, setCityText] = useState(preset?.city ?? "");
  const [city, setCity] = useState<CitySuggestion | null>(preset ? { id: "", name: preset.city, label: preset.city, country: preset.country } : null);
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
  function resetCity() { setCity(null); setCityText(""); setSuggestions([]); setLoading(false); setError(""); setFormError(""); }
  return <form onSubmit={event => {
    event.preventDefault();
    if (!country) { setFormError("Choose a country from the list first."); return; }
    if (!city || city.country !== country) { setFormError("Type at least 3 letters and choose a city suggestion."); return; }
    setFormError(""); onSearch({ city: city.label, country, ...(city.id ? { cityId: city.id } : {}) });
  }} className="mt-7 rounded-2xl bg-white p-4 text-slate-800 shadow-sm sm:p-5">
    <h2 className="mb-4 text-base font-semibold">Search by location</h2>
    <div className="grid items-start gap-4 sm:grid-cols-2">
      <SearchCombobox id="country" label="Country" value={countryText} placeholder="Search countries" options={countries.filter(item => item.name.toLowerCase().includes(countryText.trim().toLowerCase())).map(item => ({ id: item.code, label: item.name }))}
        note="Choose a country from the list." empty="No countries found. Try another spelling."
        onChange={text => { setCountryText(text); setCountry(""); resetCity(); }} onPick={code => { setCountry(code); setCountryText(countries.find(item => item.code === code)!.name); resetCity(); }}/>
      <SearchCombobox id="city" label="City" value={cityText} placeholder={country ? "Type at least 3 letters" : "Choose a country first"} disabled={!country} options={suggestions.map(item => ({ id: item.id, label: item.label }))} loading={loading} error={error}
        note={city ? "City selected. Ready to search." : "Suggestions start after 3 letters."} empty={city ? "Edit the city name to choose another city." : cityText.trim().length < 3 ? "Type at least 3 letters to see cities." : "No cities found. Try a different name."}
        onChange={text => { setCityText(text); setCity(null); setSuggestions([]); setError(""); setFormError(""); setLoading(!!cityQuery(country, text)); }} onPick={id => { const found = suggestions.find(item => item.id === id)!; setCity(found); setCityText(found.label); setSuggestions([]); setLoading(false); setError(""); setFormError(""); }}/>
    </div>
    {error && <button type="button" className="mt-2 text-sm font-semibold text-teal-700 underline" onClick={() => { setError(""); setLoading(true); setAttempt(value => value + 1); }}>Retry city suggestions</button>}
    {formError && <p role="alert" className="mt-3 text-sm text-red-700">{formError}</p>}
    <button className="button mt-4" type="submit">Search places <ArrowUpRight size={17} aria-hidden="true"/></button>
  </form>;
}
