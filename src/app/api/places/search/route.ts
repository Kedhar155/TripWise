import { failure, json } from "@/lib/api";
import { searchPlaceNames } from "@/lib/geoapify";

export async function GET(request: Request) {
  try { return json(await searchPlaceNames(new URL(request.url).searchParams)); }
  catch (error) { return failure(error); }
}
