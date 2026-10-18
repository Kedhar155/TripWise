import type { Metadata } from "next";
import "./globals.css";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Toaster } from "@/components/ui/sonner";
import { BackgroundArt } from "@/components/background-art";
export const metadata: Metadata = { title: "TripWise | Make room for discovery", description: "Discover places and build your own city itinerary with TripWise." };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><a href="#main" className="sr-only focus:not-sr-only">Skip to content</a><div className="site-art-layer"><BackgroundArt/></div><Navigation/><main id="main" className="mx-auto min-h-[75vh] max-w-6xl px-5 pb-14">{children}</main><Footer/><Toaster/></body></html>;
}
