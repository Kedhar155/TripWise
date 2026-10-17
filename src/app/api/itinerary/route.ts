import { body, failure, json, placeId, visitor } from "@/lib/api";
import { getPlace } from "@/lib/geoapify";
import { database, databaseError } from "@/lib/supabase";

export async function GET(request: Request) {
  try {
    const visitorId = visitor(request);
    const { data, error } = await database().from("itinerary").select("*").eq("visitor_id", visitorId).order("created_at", { ascending: false });
    databaseError(error);
    return json({ items: data });
  } catch (error) { return failure(error); }
}

export async function POST(request: Request) {
  try {
    const visitorId = visitor(request);
    const id = placeId((await body(request)).place_id);
    // Resolve details on the server rather than trusting client-supplied coordinates or names.
    const place = await getPlace(id);
    const { data, error } = await database().from("itinerary").insert({
      visitor_id: visitorId, place_id: id, name: place.name, address: place.address,
      category: place.category, latitude: place.latitude, longitude: place.longitude,
    }).select().single();
    databaseError(error);
    return json({ item: data }, 201);
  } catch (error) { return failure(error); }
}
