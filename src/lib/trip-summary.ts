import { getCategoryKey, getCategoryStyle } from "./categories";
import { plannedDay } from "./trip-days";

export function summarizeTrip(items: { category: string; day: number | null }[]) {
  const days = new Set<number>();
  let unplanned = 0;
  const groups = new Map<string, { category: string; count: number }>();
  for (const item of items) {
    const day = plannedDay(item.day);
    if (day === null) unplanned += 1;
    else days.add(day);
    const category = item.category.trim().toLowerCase();
    const key = getCategoryKey(category);
    const group = groups.get(key);
    if (group) group.count += 1;
    else groups.set(key, { category: key, count: 1 });
  }
  const categories = [...groups.values()].map(group => {
    const style = getCategoryStyle(group.category);
    const name = group.count === 1 ? style.singular : style.plural;
    return { ...group, label: `${group.count} ${name}` };
  }).sort((a, b) => b.count - a.count || a.category.localeCompare(b.category, "en"));
  return { total: items.length, plannedDays: days.size, unplanned, categories };
}
