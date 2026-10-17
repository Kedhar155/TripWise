import { failure, json } from "@/lib/api";
import { getPlace } from "@/lib/geoapify";

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  try { return json({ place: await getPlace((await context.params).id) }); }
  catch (error) { return failure(error); }
}
