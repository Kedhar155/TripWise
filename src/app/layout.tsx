import type { Metadata } from "next";
import "./globals.css";
import { Navigation } from "@/components/navigation";
export const metadata: Metadata = { title: "TripWise | Make room for discovery", description: "Discover places and build your own city itinerary with TripWise." };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><a href="#main" className="sr-only focus:not-sr-only">Skip to content</a><Navigation/><main id="main" className="mx-auto min-h-[75vh] max-w-6xl px-5 pb-14">{children}</main><footer className="mx-auto max-w-6xl border-t border-slate-100 px-5 py-6 text-xs leading-6 text-slate-500">TripWise · AWS Student Builder Group · VIT Chennai<br/>Places powered by <a href="https://www.geoapify.com/" className="underline">Geoapify</a> · © <a href="https://www.openstreetmap.org/copyright" className="underline">OpenStreetMap contributors</a></footer></body></html>;
}
