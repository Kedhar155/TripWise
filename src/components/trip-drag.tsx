"use client";
import type { ReactNode } from "react";
import Link from "next/link";
import { useDraggable, useDroppable, type KeyboardCoordinateGetter } from "@dnd-kit/core";
import type { ItineraryItem } from "@/lib/types";
import { plannedDay } from "@/lib/trip-days";
import { Card } from "./ui/card";
import { CategoryBadge } from "./category-badge";

// Keyboard arrows choose whole sections, never an order within a day.
export const dayKeyboardCoordinates: KeyboardCoordinateGetter = (event, { context, currentCoordinates }) => {
  if (!["ArrowDown", "ArrowRight", "ArrowUp", "ArrowLeft"].includes(event.code)) return;
  event.preventDefault();
  const targets = context.droppableContainers.getEnabled();
  const current = targets.findIndex(target => target.id === (context.over?.id ?? `day-${context.active?.data.current?.day ?? "unplanned"}`));
  const step = event.code === "ArrowDown" || event.code === "ArrowRight" ? 1 : -1;
  const target = targets[current + step];
  const rect = target && context.droppableRects.get(target.id);
  const active = context.collisionRect;
  if (!rect || !active) return;
  return { x: currentCoordinates.x + rect.left + rect.width / 2 - active.left - active.width / 2,
    y: currentCoordinates.y + rect.top + rect.height / 2 - active.top - active.height / 2 };
};

export function TripDay({ day, children }: { day: number | null; children: ReactNode }) {
  const { setNodeRef, isOver, active } = useDroppable({ id: `day-${day ?? "unplanned"}`, data: { day } });
  const heading = day === null ? "Unplanned" : `Day ${day}`;
  return <section ref={setNodeRef} aria-label={heading} className={`min-h-28 rounded-2xl p-2 transition-colors ${active && isOver ? "bg-teal-50 ring-2 ring-teal-500" : "ring-2 ring-transparent"}`}>
    <h2 className="mb-4 text-2xl font-semibold text-teal-900">{heading}</h2>{children}
  </section>;
}

type Props = { item: ItineraryItem; index: number; dayCount: number; busy: boolean; controlsBusy: boolean; moving: string | null; removing: string | null;
  onMove: (item: ItineraryItem, day: number | null) => Promise<void>; onRemove: (item: ItineraryItem) => Promise<void> };
export function TripPlace({ item, index, dayCount, busy, controlsBusy, moving, removing, onMove, onRemove }: Props) {
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, isDragging } = useDraggable({ id: item.id, data: { day: plannedDay(item.day), name: item.name }, disabled: busy, attributes: { role: "group", roleDescription: "draggable place" } });
    return <Card ref={node => { setNodeRef(node); setActivatorNodeRef(node); }} {...attributes} id={`drag-${item.id}`} role="group" aria-roledescription="draggable place" aria-label={`Move ${item.name}`}
      onPointerDown={event => {
        if (event.pointerType === "touch" || (event.target as Element).closest("button, select, input, textarea, label, option")) return;
        listeners?.onPointerDown?.(event);
      }}
      onTouchStart={event => {
        if ((event.target as Element).closest("button, select, input, textarea, label, option")) return;
        listeners?.onTouchStart?.(event);
      }}
      onKeyDown={event => { if (event.target === event.currentTarget) listeners?.onKeyDown?.(event); }}
      className={`place-card gap-5 sm:flex-row sm:items-center ${isDragging ? "opacity-40" : ""}`} >
      <div className="trip-place-main min-w-0 flex-1">
        <div className="mb-2"><CategoryBadge category={item.category} /></div>
        <h3 className="break-words text-lg font-semibold"><span className="trip-place-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span><Link draggable={false} href={`/places/${encodeURIComponent(item.place_id)}`} className="hover:underline">{item.name}</Link></h3>
        <p className="mt-2 text-sm leading-6 text-slate-600">{item.address}</p>
      </div>
      <div className="trip-place-controls flex min-w-0 flex-col gap-3 sm:w-40 sm:shrink-0">
        <label htmlFor={`day-${item.id}`} className="text-xs font-semibold text-slate-600">{moving === item.id ? "Moving…" : "Plan for"}<span className="sr-only"> {item.name}</span></label>
        <select id={`day-${item.id}`} value={plannedDay(item.day) ?? ""} disabled={controlsBusy} onChange={event => void onMove(item, event.target.value === "" ? null : Number(event.target.value))} className="field w-full text-sm disabled:opacity-50">
          <option value="">Unplanned</option>
          {Array.from({ length: dayCount }, (_, i) => <option key={i + 1} value={i + 1}>Day {i + 1}</option>)}
        </select>
        <button className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold hover:bg-slate-50 disabled:opacity-50" disabled={controlsBusy} onClick={() => void onRemove(item)} aria-label={`Remove ${item.name}`}>{removing === item.id ? "Removing…" : "Remove"}</button>
      </div>
    </Card>;
}
