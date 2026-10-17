import { Card } from "./ui/card";

export function PlaceSkeletons({ trip = false }: { trip?: boolean }) {
  return <div role="status" aria-label={trip ? "Loading your saved places" : "Finding places"}>
    <span className="sr-only">{trip ? "Loading your saved places…" : "Finding places for your next adventure…"}</span>
    <div aria-hidden="true" className={trip ? "space-y-4" : "grid gap-5 sm:grid-cols-2 lg:grid-cols-3"}>
      {Array.from({ length: trip ? 3 : 6 }, (_, index) => <Card key={index} className={trip ? "gap-5 sm:flex-row sm:items-center" : "gap-4"}>
        {trip && <div className="skeleton h-8 w-8 shrink-0" />}
        <div className="min-w-0 flex-1 space-y-4">
          <div className="skeleton h-6 w-24 rounded-full" />
          <div className="skeleton h-5 w-3/4" />
          <div className="skeleton h-4 w-full" />
          <div className="skeleton h-4 w-2/3" />
        </div>
        <div className={trip ? "skeleton h-11 w-24" : "mt-3 flex justify-between gap-5"}>
          {!trip && <><div className="skeleton h-4 w-20" /><div className="skeleton h-4 w-24" /></>}
        </div>
      </Card>)}
    </div>
  </div>;
}
