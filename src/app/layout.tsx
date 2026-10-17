import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "TripWise | Make room for discovery", description: "Discover places and build your own city itinerary with TripWise." };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
