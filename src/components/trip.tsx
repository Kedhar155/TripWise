"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Bookmark } from "lucide-react";
import type { ItineraryItem } from "@/lib/types";
import { categoryLabel, message, request, RequestError } from "@/lib/client-api";
import { Feedback } from "./feedback";
import { Card } from "./ui/card";
export function Trip() {
  const [items, setItems] = useState<ItineraryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [removeError, setRemoveError] = useState("");
  const [failedItem, setFailedItem] = useState<ItineraryItem | null>(null);
  const [removing, setRemoving] = useState<string | null>(null);
  const [notice, setNotice] = useState("");
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    request<{items:ItineraryItem[]}>("/api/itinerary", {signal:controller.signal}, true).then(data => setItems(data.items)).catch(e => {if (!controller.signal.aborted) setError(message(e));}).finally(() => {if (!controller.signal.aborted) setLoading(false);});
    return () => controller.abort();
  }, [attempt]);
  async function remove(item: ItineraryItem) {
    setRemoving(item.id); setRemoveError(""); setFailedItem(null); setNotice("");
    try { await request(`/api/itinerary/${item.id}`, {method:"DELETE"}, true); setItems(previous => previous.filter(row => row.id !== item.id)); setNotice(`${item.name} removed from your trip.`); }
    catch(e) {
      if (e instanceof RequestError && e.status === 404) { setItems(previous => previous.filter(row => row.id !== item.id)); setNotice(`${item.name} is already removed from your trip.`); }
      else { setFailedItem(item); setRemoveError(`Could not remove ${item.name}. ${message(e)}`); }
    }
    finally { setRemoving(null); }
  }
  return <section className="py-8 sm:py-12"><p className="eyebrow">A little planning. A lot to look forward to.</p><h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">My Trip</h1><p className="mt-5 mb-8 max-w-xl leading-7 text-slate-600">Your favorite places, all in one place. Saved for this browser, even after a refresh. Clearing browser data starts a new trip.</p>{loading ? <Feedback>Loading your saved places…</Feedback> : error ? <Feedback error>{error}<button className="retry" onClick={() => {setLoading(true);setError("");setAttempt(a => a + 1);}}>Retry</button></Feedback> : <>{removeError && <Feedback error>{removeError}{failedItem && <button className="retry" disabled={removing !== null} onClick={() => remove(failedItem)}>Retry</button>}</Feedback>}<p role="status" className="mb-4 text-sm text-teal-800">{notice || `${items.length} saved ${items.length === 1 ? "place" : "places"}`}</p>{!items.length ? <div className="rounded-3xl border border-dashed border-teal-200 bg-teal-50/40 px-6 py-16 text-center"><Bookmark className="mx-auto mb-5 text-teal-700" size={32}/><h2 className="text-2xl font-semibold">Your trip is a blank canvas</h2><p className="mt-3 mb-7 text-slate-600">Discover a city and add a place you would love to visit.</p><Link href="/" className="button inline-flex">Explore places →</Link></div> : <div className="space-y-4">{items.map((item,index) => <Card key={item.id} className="gap-5 sm:flex-row sm:items-center"><span className="text-2xl font-semibold text-teal-700">{String(index + 1).padStart(2,"0")}</span><div className="min-w-0 flex-1"><p className="mb-2 text-xs capitalize text-teal-700">{categoryLabel(item.category)}</p><h2 className="break-words text-lg font-semibold"><Link href={`/places/${encodeURIComponent(item.place_id)}`} className="hover:underline">{item.name}</Link></h2><p className="mt-2 text-sm leading-6 text-slate-600">{item.address}</p></div><button className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold hover:bg-slate-50 disabled:opacity-50" disabled={removing !== null} onClick={() => remove(item)} aria-label={`Remove ${item.name}`}>{removing === item.id ? "Removing…" : "Remove"}</button></Card>)}</div>}</>}</section>;
}
