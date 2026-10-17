import Link from "next/link";

export function Footer() {
  return <footer className="border-t border-teal-100 bg-teal-50/40">
    <div className="mx-auto max-w-6xl space-y-6 px-5 py-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div><Link href="/" className="text-lg font-semibold text-teal-800">TripWise</Link><p className="mt-2 text-sm text-slate-600">Small plans. Great adventures.</p></div>
        <nav aria-label="Footer navigation" className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold text-teal-800"><Link href="/" className="py-3 hover:underline">Explore</Link><Link href="/trip" className="py-3 hover:underline">My Trip</Link></nav>
      </div>
      <div className="border-t border-teal-100 pt-5 text-xs leading-6 text-slate-600">
        <p>Data source credits: <a href="https://www.geoapify.com/" className="underline">Geoapify</a> · © <a href="https://www.openstreetmap.org/copyright" className="underline">OpenStreetMap contributors</a> · <a href="https://open-meteo.com/" className="underline">Open-Meteo</a></p>
        <p className="mt-1">AWS Student Builder Group · VIT Chennai</p>
      </div>
    </div>
  </footer>;
}
