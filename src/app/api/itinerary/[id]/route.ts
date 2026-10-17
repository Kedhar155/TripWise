import { ApiError, body, failure, json, uuid, visitor } from "@/lib/api";
import { database, databaseError } from "@/lib/supabase";

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const visitorId = visitor(request);
    const id = uuid((await context.params).id, "trip item ID");
    const { data, error } = await database().from("itinerary").delete().eq("id", id).eq("visitor_id", visitorId).select("id").maybeSingle();
    databaseError(error);
    if (!data) throw new ApiError(404, "ITEM_NOT_FOUND", "This place is not in your trip.");
    return json({ deleted: data.id });
  } catch (error) { return failure(error); }
}

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const visitorId = visitor(request);
    const id = uuid((await context.params).id, "trip item ID");
    const value = (await body(request)).day;
    const day = value === "" ? null : value;
    if (day !== null && (typeof day !== "number" || !Number.isInteger(day) || day < 1 || day > 14)) {
      throw new ApiError(400, "INVALID_DAY", "Choose a whole day from 1 to 14, or leave it unplanned.");
    }
    const { data, error } = await database().from("itinerary").update({ day }).eq("id", id).eq("visitor_id", visitorId).select().maybeSingle();
    databaseError(error);
    if (!data) throw new ApiError(404, "ITEM_NOT_FOUND", "This place is not in your trip.");
    return json({ item: data });
  } catch (error) { return failure(error); }
}
