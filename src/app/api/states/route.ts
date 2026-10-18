import { failure, json } from "@/lib/api";
import { suggestStates } from "@/lib/geoapify";

export async function GET(request: Request) {
  try { return json(await suggestStates(new URL(request.url).searchParams)); }
  catch (error) { return failure(error); }
}
