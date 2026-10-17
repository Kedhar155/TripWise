const KEY = "tripwise.visitor-id";
export function getVisitorId(): string {
  try {
    const existing = localStorage.getItem(KEY);
    if (existing && /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(existing)) return existing;
    const id = crypto.randomUUID();
    localStorage.setItem(KEY, id);
    return id;
  } catch { throw new Error("Allow browser storage to save and view your trip, then try again."); }
}
