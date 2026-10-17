export function Feedback({ error, children }: { error?: boolean; children: React.ReactNode }) {
  return <div role={error ? "alert" : "status"} className={`rounded-2xl border p-6 text-sm leading-6 ${error ? "border-rose-200 bg-rose-50 text-rose-900" : "border-teal-100 bg-teal-50/50 text-slate-600"}`}>{children}</div>;
}
