import { getCategoryStyle } from "@/lib/categories";

export function CategoryBadge({ category, label }: { category: string; label?: string }) {
  const { icon: Icon, color, backgroundColor, label: categoryLabel } = getCategoryStyle(category);
  return (
    <span className="inline-flex max-w-full items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium capitalize" style={{ color, backgroundColor }}>
      <Icon size={16} className="shrink-0" aria-hidden="true" />
      <span>{label ?? categoryLabel}</span>
    </span>
  );
}
