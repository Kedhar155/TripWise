"use client";
import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

type Option = { id: string; label: string };
type Props = {
  id: string; label: string; value: string; placeholder: string; options: Option[];
  disabled?: boolean; loading?: boolean; loadingText?: string; note?: string; error?: string; empty?: string;
  onChange: (value: string) => void; onPick: (id: string) => void;
};

export function SearchCombobox({ id, label, value, placeholder, options, disabled, loading, loadingText = "Finding suggestions…", note, error, empty, onChange, onPick }: Props) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const list = useRef<HTMLUListElement>(null);
  const expanded = open && !disabled && options.length > 0;
  useEffect(() => {
    if (open && active >= 0) list.current?.children[active]?.scrollIntoView({ block: "nearest" });
  }, [open, active]);
  function pick(option: Option) { onPick(option.id); setOpen(false); setActive(-1); }
  return <div className="relative min-w-0" onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false); }}>
    <label htmlFor={id} className="mb-2 block text-sm font-semibold">{label}</label>
    <div className="relative">
      <input id={id} role="combobox" aria-autocomplete="list" aria-expanded={expanded} aria-controls={expanded ? `${id}-options` : undefined} aria-activedescendant={expanded && active >= 0 && options[active] ? `${id}-option-${active}` : undefined} aria-describedby={`${id}-note`} autoComplete="off" maxLength={120} disabled={disabled} value={value} placeholder={placeholder} className="field h-13 w-full pr-9 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500"
        onFocus={() => setOpen(true)} onChange={event => { onChange(event.target.value); setOpen(true); setActive(-1); }}
        onKeyDown={event => {
          if (event.key === "Escape") { setOpen(false); setActive(-1); }
          if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault(); setOpen(true);
            setActive(index => options.length ? (event.key === "ArrowDown" ? (index + 1) % options.length : (index <= 0 ? options.length - 1 : index - 1)) : -1);
          }
          if (event.key === "Enter" && open && options[active]) { event.preventDefault(); pick(options[active]); }
        }}/>
      <ChevronDown size={16} aria-hidden="true" className="pointer-events-none absolute right-3 top-4 text-slate-500"/>
    </div>
    <p id={`${id}-note`} role={error ? "alert" : "status"} className={`mt-2 text-xs ${error ? "text-red-700" : "text-slate-500"}`}>{error || (loading ? loadingText : open && !disabled && !options.length ? empty || "No matches found." : note)}</p>
    {expanded && <div className="absolute inset-x-0 z-30 mt-1 max-h-64 overflow-auto rounded-xl border border-slate-200 bg-white p-1 shadow-lg">
      <ul ref={list} id={`${id}-options`} role="listbox" aria-label={`${label} suggestions`}>
        {options.map((option, index) => <li key={option.id} id={`${id}-option-${index}`} role="option" aria-selected={active === index} onMouseDown={event => event.preventDefault()} onClick={() => pick(option)} className={`min-h-11 cursor-pointer break-words rounded-lg px-3 py-3 text-sm hover:bg-teal-50 ${active === index ? "bg-teal-50 text-teal-900" : "text-slate-800"}`}>{option.label}</li>)}
      </ul>
    </div>}
  </div>;
}
