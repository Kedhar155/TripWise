export const MAX_TRIP_DAYS = 14;

export function plannedDay(value: unknown): number | null {
  return typeof value === "number" && Number.isInteger(value) && value >= 1 && value <= MAX_TRIP_DAYS ? value : null;
}

export function visibleDayCount(items: { day?: number | null }[], stored: unknown): number {
  return Math.max(plannedDay(stored) ?? 1, ...items.map(item => plannedDay(item.day) ?? 0));
}
