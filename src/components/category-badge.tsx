import { categoryLabel } from "@/lib/client-api";
import { getCategoryStyle } from "@/lib/category-style";

export function CategoryBadge({ category }: { category: string }) {
  const { icon: Icon, color, backgroundColor } = getCategoryStyle(category);
  return (
    <span className="inline-flex max-w-full items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium capitalize" style={{ color, backgroundColor }}>
      <Icon size={16} className="shrink-0" aria-hidden="true" />
      <span>{categoryLabel(category) || "Other"}</span>
    </span>
  );
}
