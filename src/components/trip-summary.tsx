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
    <div><h3 className="mb-3 text-sm font-semibold text-teal-900">Places by category</h3>
      <ul className="flex flex-wrap gap-2">{summary.categories.map(group => <li key={group.category} className="max-w-full"><CategoryBadge category={group.category} label={group.label} /></li>)}</ul>
    </div>
  </Card>;
}
