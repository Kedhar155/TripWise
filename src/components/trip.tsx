"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Bookmark, Plus } from "lucide-react";
import { toast } from "sonner";
import type { ItineraryItem } from "@/lib/types";
import { message, request, RequestError } from "@/lib/client-api";
import { getVisitorId } from "@/lib/visitor";
import { MAX_TRIP_DAYS, plannedDay, visibleDayCount } from "@/lib/trip-days";
import { ErrorFeedback } from "./error-feedback";
import { PlaceSkeletons } from "./place-skeletons";
import { CategoryBadge } from "./category-badge";
import { Card } from "./ui/card";

function dayStorageKey() { return `tripwise.day-count.${getVisitorId()}`; }

export function Trip() {
  const [items, setItems] = useState<ItineraryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [removing, setRemoving] = useState<string | null>(null);
  const [moving, setMoving] = useState<string | null>(null);
  const [dayCount, setDayCount] = useState(1);
  const [attempt, setAttempt] = useState(0);
  const busy = removing !== null || moving !== null;

  useEffect(() => {
    const controller = new AbortController();
    request<{ items: ItineraryItem[] }>("/api/itinerary", { signal: controller.signal }, true)
      .then(data => {
        if (controller.signal.aborted) return;
        setItems(data.items);
        let stored = 1;
        try { stored = Number(localStorage.getItem(dayStorageKey()) ?? 1); } catch { /* Saved places can still be displayed. */ }
        setDayCount(visibleDayCount(data.items, stored));
      })
      .catch(e => { if (!controller.signal.aborted) setError(message(e)); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [attempt]);

  function addDay() {
    if (dayCount >= MAX_TRIP_DAYS) return;
    const next = dayCount + 1;
    setDayCount(next);
    try { localStorage.setItem(dayStorageKey(), String(next)); }
    catch { toast.error("This day may not stay after refresh", { description: "Browser storage is unavailable. You can still plan places for this session." }); }
  }

  async function move(item: ItineraryItem, day: number | null) {
    if (day === plannedDay(item.day)) return;
    setMoving(item.id);
    try {
      const data = await request<{ item: ItineraryItem }>(`/api/itinerary/${item.id}`, { method: "PATCH", body: JSON.stringify({ day }) }, true);
      setItems(previous => previous.map(row => row.id === item.id ? data.item : row));
      toast.success(day === null ? "Moved to Unplanned" : `Moved to Day ${day}`);
    } catch (e) { toast.error("Could not move this place", { description: message(e) }); }
    finally { setMoving(null); }
  }

  async function remove(item: ItineraryItem) {
    setRemoving(item.id);
    try {
      await request(`/api/itinerary/${item.id}`, { method: "DELETE" }, true);
      setItems(previous => previous.filter(row => row.id !== item.id));
      toast.success("Removed from your trip");
    } catch (e) {
      if (e instanceof RequestError && e.status === 404) {
        setItems(previous => previous.filter(row => row.id !== item.id));
        toast.info("Removed from your trip", { description: "This place had already been removed." });
      } else toast.error("Could not remove this place", { description: message(e) });
    } finally { setRemoving(null); }
  }

  function renderItem(item: ItineraryItem, index: number) {
    return <Card key={item.id} className="place-card gap-5 sm:flex-row sm:items-center">
      <span className="text-2xl font-semibold text-teal-700">{String(index + 1).padStart(2, "0")}</span>
      <div className="min-w-0 flex-1">
        <div className="mb-2"><CategoryBadge category={item.category} /></div>
        <h3 className="break-words text-lg font-semibold"><Link href={`/places/${encodeURIComponent(item.place_id)}`} className="hover:underline">{item.name}</Link></h3>
        <p className="mt-2 text-sm leading-6 text-slate-600">{item.address}</p>
      </div>
      <div className="flex min-w-0 flex-col gap-3 sm:w-40 sm:shrink-0">
        <label htmlFor={`day-${item.id}`} className="text-xs font-semibold text-slate-600">{moving === item.id ? "Moving…" : "Plan for"}<span className="sr-only"> {item.name}</span></label>
        <select id={`day-${item.id}`} value={plannedDay(item.day) ?? ""} disabled={busy} onChange={event => void move(item, event.target.value === "" ? null : Number(event.target.value))} className="field w-full text-sm disabled:opacity-50">
          <option value="">Unplanned</option>
          {Array.from({ length: dayCount }, (_, i) => <option key={i + 1} value={i + 1}>Day {i + 1}</option>)}
        </select>
        <button className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold hover:bg-slate-50 disabled:opacity-50" disabled={busy} onClick={() => void remove(item)} aria-label={`Remove ${item.name}`}>{removing === item.id ? "Removing…" : "Remove"}</button>
      </div>
    </Card>;
  }

  return <section className="py-8 sm:py-12">
    <p className="eyebrow">A little planning. A lot to look forward to.</p>
    <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">My Trip</h1>
    <p className="mt-5 mb-8 max-w-xl leading-7 text-slate-600">Your favorite places, all in one place. Saved for this browser, even after a refresh. Clearing browser data starts a new trip.</p>
    {loading ? <PlaceSkeletons trip /> : error ? <ErrorFeedback title="Could not load your trip" detail={error} onRetry={() => { setLoading(true); setError(""); setAttempt(a => a + 1); }} /> : <>
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p role="status" className="text-sm text-teal-800">{`${items.length} saved ${items.length === 1 ? "place" : "places"}`}</p>
        <div><button className="button" onClick={addDay} disabled={dayCount >= MAX_TRIP_DAYS}><Plus size={16} aria-hidden="true" />Add day</button><p className="mt-2 text-xs text-slate-500">{dayCount >= MAX_TRIP_DAYS ? "Maximum of 14 days reached." : "Plan up to 14 days."}</p></div>
      </div>
      <div className="space-y-8">
        {[null, ...Array.from({ length: dayCount }, (_, i) => i + 1)].map(day => {
          const group = items.filter(item => plannedDay(item.day) === day);
          const heading = day === null ? "Unplanned" : `Day ${day}`;
          return <section key={day ?? "unplanned"} aria-label={heading}>
            <h2 className="mb-4 text-2xl font-semibold text-teal-900">{heading}</h2>
            {group.length ? <div className="space-y-4">{group.map(renderItem)}</div> : day === null && !items.length ? <div className="rounded-3xl border border-dashed border-teal-200 bg-teal-50/40 px-6 py-10 text-center">
              <Bookmark className="mx-auto mb-5 text-teal-700" size={32} aria-hidden="true" />
              <h3 className="text-2xl font-semibold">Your trip is a blank canvas</h3>
              <p className="mt-3 mb-7 text-slate-600">Discover a city and add a place you would love to visit.</p>
              <Link href="/" className="button inline-flex">Explore places →</Link>
            </div> : <p className="rounded-2xl border border-dashed border-teal-200 bg-teal-50/30 p-6 text-sm text-slate-600">{day === null ? "No unplanned places. Add a place or move one here." : "No places yet. Choose this day from a place’s dropdown."}</p>}
          </section>;
        })}
      </div>
    </>}
  </section>;
}
