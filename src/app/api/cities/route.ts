import { failure, json } from "@/lib/api";
import { suggestCities } from "@/lib/geoapify";

export async function GET(request: Request) {
  try { return json(await suggestCities(new URL(request.url).searchParams)); }
  catch (error) { return failure(error); }
}
