"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass } from "lucide-react";
export function Navigation() {
  const path = usePathname();
  return <header className="border-b border-slate-100"><div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-5 py-5"><Link href="/" className="flex items-center gap-2 text-xl font-bold"><Compass className="text-teal-700" aria-hidden="true" />TripWise<span className="text-teal-700">.</span></Link><nav aria-label="Main navigation" className="flex gap-2">{[{href:"/", label:"Explore"},{href:"/trip",label:"My Trip"}].map(({href,label}) => <Link key={href} href={href} aria-current={path === href ? "page" : undefined} className={`rounded-full px-4 py-2 text-sm font-semibold ${path === href ? "bg-teal-50 text-teal-800" : "text-slate-600 hover:bg-slate-50"}`}>{label}</Link>)}</nav></div></header>;
}
