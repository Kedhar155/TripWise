"use client";
import { toast } from "sonner";
import { ErrorFeedback } from "./error-feedback";
import { useEffect, useState } from "react";
import Link from "next/link";
import { MapPin, Bookmark } from "lucide-react";
import type { Place, ItineraryItem } from "@/lib/types";
import { message, request, RequestError } from "@/lib/client-api";
import { Feedback } from "./feedback";
import { WeatherBox } from "./weather-box";
import { CategoryBadge } from "./category-badge";
export function Destination({ id }: { id: string }) {
  const [place, setPlace] = useState<Place | null>(null);
  const [error, setError] = useState("");
  const [tripError, setTripError] = useState("");
  const [tripAttempt, setTripAttempt] = useState(0);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    request<{place:Place}>(`/api/places/${encodeURIComponent(id)}`, {signal:controller.signal}).then(data => setPlace(data.place)).catch(e => { if (!controller.signal.aborted) setError(message(e)); });
    return () => controller.abort();
  }, [id, attempt]);
  useEffect(() => {
    const controller = new AbortController();
    request<{items:ItineraryItem[]}>("/api/itinerary", {signal:controller.signal}, true).then(data => { if (!controller.signal.aborted && data.items.some(item => item.place_id === id)) { setSaved(true); toast.info("Already in your trip", { id: `saved-${id}` }); } }).catch(e => { if (!controller.signal.aborted) setTripError(message(e)); });
    return () => controller.abort();
  }, [id, tripAttempt]);
  async function save() {
    setSaving(true); setTripError("");
    try { await request("/api/itinerary", {method:"POST", body:JSON.stringify({place_id:id})}, true); setSaved(true); toast.success("Added to your trip"); }
    catch(e) { if (e instanceof RequestError && e.status === 409) { setSaved(true); toast.info("Already in your trip"); } else toast.error("Could not add this place", { description: message(e) }); }
    finally { setSaving(false); }
  }
  return <div className="py-8 sm:py-12"><Link href="/" scroll={false} className="text-sm font-semibold text-teal-700">← Back to Explore</Link>{error ? <div className="mt-8"><ErrorFeedback title="Could not load this place" detail={error} onRetry={() => {setError("");setAttempt(a => a + 1);}} /></div> : !place ? <div className="mt-8"><Feedback>Loading destination details…</Feedback></div> : <div className="mt-8 grid gap-8 lg:grid-cols-[2fr_1fr]"><section className="min-w-0 rounded-3xl border border-slate-200 p-6 sm:p-10"><MapPin size={36} className="mb-8 text-teal-700" aria-hidden="true"/><CategoryBadge category={place.category} /><h1 className="mt-4 break-words text-3xl font-semibold tracking-tight sm:text-5xl">{place.name}</h1><p className="mt-5 leading-7 text-slate-600">{place.address}</p><dl className="mt-10 space-y-6 border-t border-slate-100 pt-6"><div><dt className="font-semibold">Opening hours</dt><dd className="mt-2 break-words text-slate-600">{place.openingHours || "Hours are not available. Check with the venue before visiting."}</dd></div><div><dt className="font-semibold">Phone</dt><dd className="mt-2 text-slate-600">{place.phone || "Not listed"}</dd></div><div><dt className="font-semibold">Website</dt><dd className="mt-2">{place.website ? <a href={place.website} target="_blank" rel="noopener noreferrer" className="text-teal-700 underline">Visit official website ↗</a> : <span className="text-slate-600">Not listed</span>}</dd></div></dl><a href={`https://www.openstreetmap.org/?mlat=${place.latitude}&mlon=${place.longitude}#map=16/${place.latitude}/${place.longitude}`} target="_blank" rel="noopener noreferrer" className="mt-8 inline-block font-semibold text-teal-700">View on OpenStreetMap ↗</a><WeatherBox latitude={place.latitude} longitude={place.longitude} /></section><aside className="h-fit space-y-5 rounded-3xl bg-teal-50 p-6 sm:p-8"><Bookmark className="text-teal-700" aria-hidden="true"/><h2 className="text-2xl font-semibold">Worth a spot in your trip?</h2><p className="text-sm leading-6 text-slate-600">Keep your favorite places together. Your trip stays saved for this browser.</p><button onClick={save} disabled={saving || saved} className="button w-full">{saving ? "Saving…" : saved ? "Added to My Trip ✓" : "Add to Trip"}</button>{tripError && !saved && <ErrorFeedback title="Could not check saved places" detail={tripError} onRetry={() => { setTripError(""); setTripAttempt(a => a + 1); }} />}<Link href="/trip" aria-disabled={saving || undefined} onClick={event => { if (saving) event.preventDefault(); }} className={`block text-center text-sm font-semibold text-teal-800 ${saving ? "cursor-wait opacity-60" : ""}`}>{saving ? "Wait for saving to finish…" : "View My Trip →"}</Link></aside></div>}</div>;
}
