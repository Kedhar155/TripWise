"use client";
import { ErrorFeedback } from "@/components/error-feedback";
export default function ErrorPage({ retry }: { retry: () => void }) {
  return <section className="py-12"><h1 className="mb-6 text-3xl font-semibold">This page could not load</h1><ErrorFeedback title="This page could not load" detail="Please try again. Your saved trip has not been changed." onRetry={retry} /></section>;
}
