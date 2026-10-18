"use client";
import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { allCategories, categories, categoryEntries, type Category } from "@/lib/categories";

// Native checkboxes keep multi-selection keyboard and screen-reader friendly.
// An empty selection represents All; removing the last check returns to All.
function rowStyle(checked: boolean) {
  return `flex min-h-11 w-full cursor-pointer items-center gap-3 rounded-xl border px-3 py-2 text-sm transition-colors focus-within:ring-2 focus-within:ring-teal-600 ${checked ? "border-teal-200 bg-teal-50 font-medium text-teal-900 hover:bg-teal-100" : "border-transparent hover:bg-slate-50"}`;
}
export function CategoryFilter({ selected, onChange }: { selected: Category[]; onChange: (value: Category[]) => void }) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    function outside(event: PointerEvent) {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("pointerdown", outside);
    return () => document.removeEventListener("pointerdown", outside);
  }, []);
  const Icon = selected.length === 1 ? categories[selected[0]].icon : allCategories.icon;
  const label = selected.length === 0 ? allCategories.label : selected.length === 1 ? categories[selected[0]].label : `${selected.length} categories`;
  return <div ref={root} className="relative min-w-0" onKeyDown={event => {
    if (event.key === "Escape") { setOpen(false); trigger.current?.focus(); }
  }} onBlur={event => {
    // A label click can briefly blur to the document before focusing its checkbox.
    // Outside pointer clicks are already handled above; close only on a known focus exit.
    if (event.relatedTarget && !event.currentTarget.contains(event.relatedTarget)) setOpen(false);
  }}>
    <span id="category-label" className="mb-2 block text-sm font-semibold">Category</span>
    <button ref={trigger} type="button" className="field flex h-13 w-full items-center gap-2 text-left" title={label} aria-labelledby="category-label category-selection" aria-expanded={open} aria-controls="category-options" onClick={() => setOpen(value => !value)}>
      <Icon size={17} className="shrink-0" aria-hidden="true"/><span id="category-selection" className="min-w-0 flex-1 truncate">{label}</span><ChevronDown size={17} className="shrink-0" aria-hidden="true"/>
    </button>
    {open && <fieldset id="category-options" className="absolute inset-x-0 top-full z-20 mt-2 max-h-96 overflow-y-auto rounded-2xl border border-slate-200 bg-white p-2 shadow-lg">
      <legend className="sr-only">Choose categories</legend>
      {/* The full-width native label activates its checkbox once, including icon/text/space clicks. */}
      <label htmlFor="category-all" className={rowStyle(!selected.length)}>
        <input id="category-all" type="checkbox" checked={!selected.length} onChange={() => onChange([])} className="size-4 shrink-0 accent-teal-700"/><allCategories.icon size={17} className="shrink-0" aria-hidden="true"/><span>{allCategories.label}</span>
      </label>
      {categoryEntries.map(([key, entry]) => <label key={key} htmlFor={`category-${key}`} className={rowStyle(selected.includes(key))}>
        <input id={`category-${key}`} type="checkbox" checked={selected.includes(key)} onChange={() => onChange(selected.includes(key) ? selected.filter(value => value !== key) : [...selected, key])} className="size-4 shrink-0 accent-teal-700"/>
        <entry.icon size={17} className="shrink-0" style={{ color: entry.color }} aria-hidden="true"/><span>{entry.label}</span>
      </label>)}
    </fieldset>}
  </div>;
}
