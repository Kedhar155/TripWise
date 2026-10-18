"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Bookmark, Plus } from "lucide-react";
import { toast } from "sonner";
import type { ItineraryItem } from "@/lib/types";
import { message, request, RequestError } from "@/lib/client-api";
import { getVisitorId } from "@/lib/visitor";
import { MAX_TRIP_DAYS, plannedDay, visibleDayCount } from "@/lib/trip-days";
import { ErrorFeedback } from "./error-feedback";
import { PlaceSkeletons } from "./place-skeletons";
import { DndContext, DragOverlay, PointerSensor, TouchSensor, KeyboardSensor, useSensor, useSensors, pointerWithin, closestCenter, type CollisionDetection, type DragEndEvent } from "@dnd-kit/core";
import { TripDay, TripPlace, dayKeyboardCoordinates } from "./trip-drag";
import { Card } from "./ui/card";
import { TripSummary } from "./trip-summary";

const dayCollision: CollisionDetection = args => args.pointerCoordinates ? pointerWithin(args) : closestCenter(args);
const dayLabel = (day: unknown) => day === null ? "Unplanned" : `Day ${day}`;
function dayStorageKey() { return `tripwise.day-count.${getVisitorId()}`; }

export function Trip() {
  const [items, setItems] = useState<ItineraryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [removing, setRemoving] = useState<string | null>(null);
  const [moving, setMoving] = useState<string | null>(null);
  const [dayCount, setDayCount] = useState(1);
  const [attempt, setAttempt] = useState(0);
  const [activeId, setActiveId] = useState<string | null>(null);
  const mutation = useRef(false);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }), useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 8 } }), useSensor(KeyboardSensor, { coordinateGetter: dayKeyboardCoordinates }));
  const activeItem = items.find(item => item.id === activeId);
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

  async function move(item: ItineraryItem, day: number | null, fromDrag = false) {
    if (mutation.current || day === plannedDay(item.day)) return;
    mutation.current = true;
    setMoving(item.id);
    setItems(previous => previous.map(row => row.id === item.id ? { ...row, day } : row));
    try {
      const data = await request<{ item: ItineraryItem }>(`/api/itinerary/${item.id}`, { method: "PATCH", body: JSON.stringify({ day }) }, true);
      setItems(previous => previous.map(row => row.id === item.id ? data.item : row));
      toast.success(day === null ? "Moved to Unplanned" : `Moved to Day ${day}`);
    } catch (e) {
      setItems(previous => previous.map(row => row.id === item.id ? item : row));
      toast.error("Could not move this place", { description: message(e) });
    } finally {
      mutation.current = false; setMoving(null);
      requestAnimationFrame(() => document.getElementById(`${fromDrag ? "drag" : "day"}-${item.id}`)?.focus());
    }
  }

  async function remove(item: ItineraryItem) {
    if (mutation.current) return;
    mutation.current = true;
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
    } finally { mutation.current = false; setRemoving(null); }
  }


  function drop({ active, over }: DragEndEvent) {
    setActiveId(null);
    const item = items.find(row => row.id === active.id);
    if (!item || !over) return;
    const day = over.data.current?.day;
    if (day !== null && (typeof day !== "number" || plannedDay(day) !== day)) return;
    void move(item, day, true);
  }

  return <section className="trip-page py-8 sm:py-12">
    <p className="eyebrow">A little planning. A lot to look forward to.</p>
    <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">My Trip</h1>
    <p className="mt-5 mb-8 max-w-xl leading-7 text-slate-600">Your favorite places, all in one place. Saved for this browser, even after a refresh. Clearing browser data starts a new trip.</p>
    {loading ? <PlaceSkeletons trip /> : error ? <ErrorFeedback title="Could not load your trip" detail={error} onRetry={() => { setLoading(true); setError(""); setAttempt(a => a + 1); }} /> : <>
      <TripSummary items={items} />
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p role="status" className="text-sm text-teal-800">{`${items.length} saved ${items.length === 1 ? "place" : "places"}`}</p>
        <div><button className="button" onClick={addDay} disabled={dayCount >= MAX_TRIP_DAYS || busy || activeId !== null}><Plus size={16} aria-hidden="true" />Add day</button><p className="mt-2 text-xs text-slate-500">{dayCount >= MAX_TRIP_DAYS ? "Maximum of 14 days reached." : "Plan up to 14 days."}</p></div>
      </div>
      <p className="mb-4 text-xs text-slate-500">Drag a place card to another day or Unplanned. On touch screens, press and hold the card before dragging. Keyboard: focus the card, press Space or Enter, use arrow keys to choose a section, then press again to drop. Escape cancels.</p>
      <DndContext id="trip-days" sensors={sensors} collisionDetection={dayCollision} onDragStart={({ active }) => setActiveId(String(active.id))} onDragCancel={() => setActiveId(null)} onDragEnd={drop}
        accessibility={{ screenReaderInstructions: { draggable: "Press Space or Enter to pick up a place. Use arrow keys to choose a day section. Press Space or Enter to drop, or Escape to cancel." }, announcements: {
          onDragStart: ({ active }) => `Picked up ${active.data.current?.name}. Use arrow keys to choose a day section.`,
          onDragOver: ({ over }) => over ? `Over ${dayLabel(over.data.current?.day)}.` : "Outside a day section.",
          onDragEnd: ({ over }) => over ? `Dropped in ${dayLabel(over.data.current?.day)}. Saving move.` : "No move made.",
          onDragCancel: () => "Move cancelled.",
        } }}>
      <div className="space-y-8">
        {[null, ...Array.from({ length: dayCount }, (_, i) => i + 1)].map(day => {
          const group = items.filter(item => plannedDay(item.day) === day);
          return <TripDay key={day ?? "unplanned"} day={day}>
            {group.length ? <div className="space-y-4">{group.map((item, index) => <TripPlace key={item.id} item={item} index={index} dayCount={dayCount} busy={busy} controlsBusy={busy || activeId !== null} moving={moving} removing={removing} onMove={move} onRemove={remove} />)}</div> : day === null && !items.length ? <div className="rounded-3xl border border-dashed border-teal-200 bg-teal-50/40 px-6 py-10 text-center">
              <Bookmark className="mx-auto mb-5 text-teal-700" size={32} aria-hidden="true" />
              <h3 className="text-2xl font-semibold">Your trip is a blank canvas</h3>
              <p className="mt-3 mb-7 text-slate-600">Discover a city and add a place you would love to visit.</p>
              <Link href="/" className="button inline-flex">Explore places →</Link>
            </div> : <p className="rounded-2xl border border-dashed border-teal-200 bg-teal-50/30 p-6 text-sm text-slate-600">{day === null ? "No unplanned places. Add a place or move one here." : "No places yet. Drop a place here or choose this day from its dropdown."}</p>}
          </TripDay>;
        })}
      </div>
      <DragOverlay dropAnimation={null}>{activeItem ? <Card className="pointer-events-none max-w-sm gap-2 border-teal-400 shadow-xl"><p className="break-words font-semibold text-teal-900">{activeItem.name}</p><p className="text-xs text-slate-500">Drop into a day or Unplanned</p></Card> : null}</DragOverlay>
      </DndContext>
    </>}
  </section>;
}
