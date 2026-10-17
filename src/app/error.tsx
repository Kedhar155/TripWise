"use client";
import { Feedback } from "@/components/feedback";
export default function ErrorPage({ retry }: { retry: () => void }) {
  return <section className="py-12"><h1 className="mb-6 text-3xl font-semibold">This page could not load</h1><Feedback error>Please try again. Your saved trip has not been changed.<button className="retry" onClick={retry}>Retry</button></Feedback></section>;
}
