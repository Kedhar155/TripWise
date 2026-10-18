"use client";
import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { countries } from "@/lib/countries";
import { cityDebounceMs, cityQuery, citySuggestions, stateSuggestions } from "@/lib/city-suggestions";
import { message } from "@/lib/client-api";
import type { CitySuggestion, StateSuggestion } from "@/lib/types";
import type { LocationDraft, LocationSearchValue } from "@/lib/explore-session";
import { SearchCombobox } from "./search-combobox";

export function LocationSearch({ onSearch, draft, onDraftChange }: { onSearch: (value: LocationSearchValue) => void; draft: LocationDraft; onDraftChange: (draft: LocationDraft) => void }) {
  const { countryText, country, stateText = "", state = null, cityText, city } = draft;
  const [states, setStates] = useState<StateSuggestion[]>([]);
  const [stateLoading, setStateLoading] = useState(false);
  const [stateError, setStateError] = useState("");
  const [stateAttempt, setStateAttempt] = useState(0);
  useEffect(() => {
    if (state || !cityQuery(country, stateText)) return;
    const controller = new AbortController();
    const timer = setTimeout(() => {
      stateSuggestions(country, stateText, controller.signal).then(items => {
        if (!controller.signal.aborted) { setStates(items); setStateError(""); }
      }).catch(error => { if (!controller.signal.aborted) setStateError(message(error)); })
        .finally(() => { if (!controller.signal.aborted) setStateLoading(false); });
    }, cityDebounceMs);
    return () => { clearTimeout(timer); controller.abort(); };
  }, [country, stateText, state, stateAttempt]);
  const [suggestions, setSuggestions] = useState<CitySuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    if (city || !cityQuery(country, cityText)) return;
    const controller = new AbortController();
    const timer = setTimeout(() => {
      citySuggestions(country, cityText, controller.signal, state).then(items => {
        if (!controller.signal.aborted) { setSuggestions(items); setError(""); }
      }).catch(error => { if (!controller.signal.aborted) setError(message(error)); })
        .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    }, cityDebounceMs);
    return () => { clearTimeout(timer); controller.abort(); };
  }, [country, cityText, city, state, attempt]);
  function resetCity() { setSuggestions([]); setLoading(false); setError(""); setFormError(""); }
  return <form onSubmit={event => {
    event.preventDefault();
    if (!country) { setFormError("Choose a country from the list first."); return; }
    if (!state && stateText.trim()) { setFormError("Choose a state suggestion or clear the State field."); return; }
    if (!city && !state && !cityText.trim()) { setFormError("Choose a country and at least a state or a city."); return; }
    if ((cityText.trim() && !city) || (city && city.country !== country)) { setFormError("Type at least 3 letters and choose a city suggestion."); return; }
    if (state && (state.country !== country || (city?.state && city.state.toLowerCase() !== state.name.toLowerCase()))) { setFormError("Choose a city in the selected state."); return; }
    if (!state && city?.state) onDraftChange({ ...draft, stateText: city.state, state: { id: "", name: city.state, label: city.state, country } });
    setFormError(""); onSearch({ city: city?.label ?? "", country, ...(city?.id ? { cityId: city.id } : {}), ...(state ? { state: state.name, ...(state.id ? { stateId: state.id } : {}) } : {}) });
  }} className="space-y-4">
    <div className="grid items-start gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_auto]">
      <SearchCombobox id="country" label="Country" value={countryText} placeholder="Search countries" options={countries.filter(item => item.name.toLowerCase().includes(countryText.trim().toLowerCase())).map(item => ({ id: item.code, label: item.name }))}
        note="Choose a country from the list." empty="No countries found. Try another spelling."
        onChange={text => { onDraftChange({ countryText: text, country: "", stateText: "", state: null, cityText: "", city: null }); resetCity(); setStates([]); setStateError(""); setStateLoading(false); }} onPick={code => { onDraftChange({ countryText: countries.find(item => item.code === code)!.name, country: code, stateText: "", state: null, cityText: "", city: null }); resetCity(); setStates([]); setStateError(""); setStateLoading(false); }}/>
      <SearchCombobox id="state" label="State (optional)" value={stateText} placeholder={country ? "Type at least 3 letters" : "Choose a country first"} disabled={!country} options={states.map(item => ({ id: item.id, label: item.label }))} loading={stateLoading} error={stateError}
        note={state ? "State selected. City is optional." : "Choose a state, or leave blank and choose a city."} empty={state ? "Edit the state name to choose another state." : stateText.trim().length < 3 ? "Type at least 3 letters to see states." : "No states found. Try a different name."}
        onChange={text => { onDraftChange({ ...draft, stateText: text, state: null, cityText: "", city: null }); resetCity(); setStates([]); setStateError(""); setStateLoading(!!cityQuery(country, text)); }}
        onPick={id => { const found = states.find(item => item.id === id)!; onDraftChange({ ...draft, state: found, stateText: found.name, cityText: "", city: null }); resetCity(); setStates([]); setStateLoading(false); setStateError(""); }}/>
      <SearchCombobox id="city" label="City" value={cityText} placeholder={country ? "Type at least 3 letters" : "Choose a country first"} disabled={!country} options={suggestions.map(item => ({ id: item.id, label: item.label }))} loading={loading} error={error}
        note={city ? "City selected. Ready to search." : "Suggestions start after 3 letters."} empty={city ? "Edit the city name to choose another city." : cityText.trim().length < 3 ? "Type at least 3 letters to see cities." : "No cities found. Try a different name."}
        onChange={text => { onDraftChange({ ...draft, cityText: text, city: null }); setSuggestions([]); setError(""); setFormError(""); setLoading(!!cityQuery(country, text)); }} onPick={id => { const found = suggestions.find(item => item.id === id)!; onDraftChange({ ...draft, city: found, cityText: found.label }); setSuggestions([]); setLoading(false); setError(""); setFormError(""); }}/>
      <button className="button min-h-13 w-full md:mt-7 md:w-auto" type="submit">Search <ArrowUpRight size={17} aria-hidden="true"/></button>
    </div>
    {stateError && <button type="button" className="mt-2 text-sm font-semibold text-teal-700 underline" onClick={() => { setStateError(""); setStateLoading(true); setStateAttempt(value => value + 1); }}>Retry state suggestions</button>}
    {error && <button type="button" className="mt-2 text-sm font-semibold text-teal-700 underline" onClick={() => { setError(""); setLoading(true); setAttempt(value => value + 1); }}>Retry city suggestions</button>}
    {formError && <p role="alert" className="mt-3 text-sm text-red-700">{formError}</p>}
  </form>;
}
