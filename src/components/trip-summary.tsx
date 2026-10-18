import type { ItineraryItem } from "@/lib/types";
import { summarizeTrip } from "@/lib/trip-summary";
import { CategoryBadge } from "./category-badge";
import { Card } from "./ui/card";

export function TripSummary({ items }: { items: ItineraryItem[] }) {
  if (!items.length) return null;
  const summary = summarizeTrip(items);
  return <Card className="mb-8 gap-5 border-teal-100 bg-teal-50/40" role="region" aria-label="Trip summary">
    <h2 className="text-xl font-semibold text-teal-900">Your trip at a glance</h2>
    <dl className="grid gap-4 sm:grid-cols-3" aria-live="polite" aria-atomic="true">
      <div className="rounded-xl bg-white p-4"><dt className="text-sm text-slate-600">Total places</dt><dd className="mt-1 text-3xl font-semibold text-teal-800">{summary.total}</dd></div>
      <div className="rounded-xl bg-white p-4"><dt className="text-sm text-slate-600">Days planned</dt><dd className="mt-1 text-3xl font-semibold text-teal-800">{summary.plannedDays}</dd></div>
      <div className="rounded-xl bg-white p-4"><dt className="text-sm text-slate-600">Unplanned places</dt><dd className="mt-1 text-3xl font-semibold text-teal-800">{summary.unplanned}</dd></div>
    </dl>
    {(summary.stateCount > 0 || summary.cityCount > 0) && <div>
      <dl className="mb-4 flex flex-wrap gap-x-6 gap-y-2 text-sm" aria-live="polite" aria-atomic="true">
        {summary.stateCount > 0 && <div className="flex gap-2"><dt className="text-slate-600">States</dt><dd className="font-semibold text-teal-900">{summary.stateCount}</dd></div>}
        {summary.cityCount > 0 && <div className="flex gap-2"><dt className="text-slate-600">Cities</dt><dd className="font-semibold text-teal-900">{summary.cityCount}</dd></div>}
      </dl>
      <h3 className="mb-3 text-sm font-semibold text-teal-900">Places by location</h3>
      <div role="region" aria-label="Places by location" tabIndex={0} className="max-h-64 space-y-4 overflow-y-auto rounded-xl bg-white p-4 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600">
        {summary.locations.map(country => <div key={country.country ?? ""}>
          {country.country && <h4 className="mb-2 break-words font-semibold text-teal-900">{country.country}</h4>}
          <ul className="space-y-2 text-slate-600">{country.states.map(region => <li key={region.state ?? ""} className="break-words leading-6">
            {region.state && <><span className="font-semibold text-slate-800">{region.state}</span> <span>({region.count} {region.count === 1 ? "place" : "places"})</span>{region.cities.length > 0 && ": "}</>}
            <span className="trip-city-stamp">{region.cities.map(city => `${city.city} (${city.count})`).join(", ")}</span>
          </li>)}</ul>
        </div>)}
      </div>
    </div>}
    <div><h3 className="mb-3 text-sm font-semibold text-teal-900">Places by category</h3>
      <ul className="flex flex-wrap gap-2">{summary.categories.map(group => <li key={group.category} className="max-w-full"><CategoryBadge category={group.category} label={group.label} /></li>)}</ul>
    </div>
  </Card>;
}
