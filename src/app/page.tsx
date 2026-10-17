import Link from "next/link";
import { ArrowUpRight, Compass, MapPin, Route, Bookmark } from "lucide-react";
export default function Home() {
  return (
    <div className="min-h-screen">
      <header className="mx-auto flex max-w-6xl items-center justify-between gap-4 border-b border-slate-100 px-6 py-6">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold tracking-tight"><Compass className="text-teal-700" aria-hidden="true" />TripWise<span className="text-teal-700">.</span></Link>
        <span className="rounded-full bg-teal-50 px-3 py-2 text-xs font-medium text-teal-800">Your next chapter awaits</span>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-14 sm:py-24">
        <div className="max-w-3xl">
          <p className="mb-6 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-teal-700"><MapPin size={16} aria-hidden="true" /> Small plans. Great adventures.</p>
          <h1 className="text-5xl font-semibold leading-[1.08] tracking-tight sm:text-7xl">A new city.<br /><span className="text-teal-700">Your kind of journey.</span></h1>
          <p className="mt-7 max-w-xl text-lg leading-8 text-slate-600">Find places worth a detour. Bring your favorites together in a trip that feels like you.</p>
        </div>
        <section aria-labelledby="setup-title" className="mt-12 flex flex-col gap-5 rounded-3xl border border-teal-100 bg-teal-50/60 p-7 sm:flex-row sm:items-center sm:justify-between">
          <div><p className="mb-2 text-xs font-semibold uppercase tracking-widest text-teal-700">Getting ready for takeoff</p><h2 id="setup-title" className="text-xl font-semibold">Your travel planner is taking shape.</h2><p className="mt-2 max-w-xl text-sm leading-6 text-slate-600">The foundation is ready. City search and saved trips will be connected in the next build phase.</p></div>
          <ArrowUpRight className="shrink-0 text-teal-700" size={32} aria-hidden="true" />
        </section>
        <section aria-label="What is coming" className="mt-10 grid gap-6 sm:grid-cols-3">
          {[{icon: Compass, title: "Discover a city", text: "Explore attractions, parks, restaurants, and more."}, {icon: Route, title: "Make it your own", text: "Filter your interests and sort places your way."}, {icon: Bookmark, title: "Keep your favorites", text: "Save a personal itinerary and return to it later."}].map(({icon: Icon, title, text}, i) => <article key={title} className="rounded-2xl border border-slate-200 p-6"><div className="mb-6 flex items-center justify-between"><Icon size={23} className="text-teal-700" aria-hidden="true" /><span className="text-xs text-slate-400">0{i + 1}</span></div><h2 className="font-semibold">{title}</h2><p className="mt-3 text-sm leading-6 text-slate-600">{text}</p></article>)}
        </section>
      </main>
      <footer className="mx-auto max-w-6xl border-t border-slate-100 px-6 py-6 text-xs leading-6 text-slate-500">TripWise · AWS Student Builder Group · VIT Chennai<br />Full-Stack recruitment project · October 2026</footer>
    </div>
  );
}

