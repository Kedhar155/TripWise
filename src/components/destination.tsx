"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { MapPin, Bookmark } from "lucide-react";
import type { Place, ItineraryItem } from "@/lib/types";
import { categoryLabel, message, request, RequestError } from "@/lib/client-api";
import { Feedback } from "./feedback";
export function Destination({ id }: { id: string }) {
  const [place, setPlace] = useState<Place | null>(null);
  const [error, setError] = useState("");
  const [saveError, setSaveError] = useState("");
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    request<{place:Place}>(`/api/places/${encodeURIComponent(id)}`, {signal:controller.signal}).then(data => setPlace(data.place)).catch(e => { if (!controller.signal.aborted) setError(message(e)); });
    request<{items:ItineraryItem[]}>("/api/itinerary", {signal:controller.signal}, true).then(data => setSaved(data.items.some(item => item.place_id === id))).catch(() => { /* Saving still reports storage or service errors and handles duplicates. */ });
    return () => controller.abort();
  }, [id, attempt]);
  async function save() {
    setSaving(true); setSaveError("");
    try { await request("/api/itinerary", {method:"POST", body:JSON.stringify({place_id:id})}, true); setSaved(true); }
    catch(e) { if (e instanceof RequestError && e.status === 409) setSaved(true); else setSaveError(message(e)); }
    finally { setSaving(false); }
  }
  return <div className="py-8 sm:py-12"><Link href="/" className="text-sm font-semibold text-teal-700">← Back to Explore</Link>{error ? <div className="mt-8"><Feedback error>{error}<button className="ml-3 underline" onClick={() => {setError("");setAttempt(a => a + 1);}}>Try again</button></Feedback></div> : !place ? <div className="mt-8"><Feedback>Loading destination details…</Feedback></div> : <div className="mt-8 grid gap-8 lg:grid-cols-[2fr_1fr]"><section className="min-w-0 rounded-3xl border border-slate-200 p-6 sm:p-10"><MapPin size={36} className="mb-8 text-teal-700" aria-hidden="true"/><p className="eyebrow">{categoryLabel(place.category)}</p><h1 className="mt-4 break-words text-3xl font-semibold tracking-tight sm:text-5xl">{place.name}</h1><p className="mt-5 leading-7 text-slate-600">{place.address}</p><dl className="mt-10 space-y-6 border-t border-slate-100 pt-6"><div><dt className="font-semibold">Opening hours</dt><dd className="mt-2 break-words text-slate-600">{place.openingHours || "Hours are not available. Check with the venue before visiting."}</dd></div><div><dt className="font-semibold">Phone</dt><dd className="mt-2 text-slate-600">{place.phone || "Not listed"}</dd></div><div><dt className="font-semibold">Website</dt><dd className="mt-2">{place.website ? <a href={place.website} target="_blank" rel="noopener noreferrer" className="text-teal-700 underline">Visit official website ↗</a> : <span className="text-slate-600">Not listed</span>}</dd></div></dl><a href={`https://www.openstreetmap.org/?mlat=${place.latitude}&mlon=${place.longitude}#map=16/${place.latitude}/${place.longitude}`} target="_blank" rel="noopener noreferrer" className="mt-8 inline-block font-semibold text-teal-700">View on OpenStreetMap ↗</a></section><aside className="h-fit space-y-5 rounded-3xl bg-teal-50 p-6 sm:p-8"><Bookmark className="text-teal-700" aria-hidden="true"/><h2 className="text-2xl font-semibold">Worth a spot in your trip?</h2><p className="text-sm leading-6 text-slate-600">Keep your favorite places together. Your trip stays saved for this browser.</p><button onClick={save} disabled={saving || saved} className="button w-full">{saving ? "Saving…" : saved ? "Added to My Trip ✓" : "Add to Trip"}</button>{saved && <p role="status" className="text-sm text-teal-800">Saved. Find this place in My Trip.</p>}{saveError && <Feedback error>{saveError}</Feedback>}<Link href="/trip" className="block text-center text-sm font-semibold text-teal-800">View My Trip →</Link></aside></div>}</div>;
}
