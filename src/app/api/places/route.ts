import { failure, json } from "@/lib/api";
import { searchPlaces } from "@/lib/geoapify";

export async function GET(request: Request) {
  try { return json(await searchPlaces(new URL(request.url).searchParams)); }
  catch (error) { return failure(error); }
}
