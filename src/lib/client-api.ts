import { getVisitorId } from "./visitor";
export class RequestError extends Error {
  constructor(message: string, public status: number) { super(message); }
}
export async function request<T>(url: string, options: RequestInit = {}, personal = false): Promise<T> {
  const headers = new Headers(options.headers);
  if (personal) headers.set("x-visitor-id", getVisitorId());
  if (options.body) headers.set("Content-Type", "application/json");
  let response: Response;
  try { response = await fetch(url, { ...options, headers, cache: "no-store", signal: options.signal ? AbortSignal.any([options.signal, AbortSignal.timeout(30000)]) : AbortSignal.timeout(30000) }); }
  catch (error) {
    if (options.signal?.aborted) throw error;
    throw new Error("Could not connect. Check your connection and try again.");
  }
  let data;
  try { data = await response.json(); }
  catch { throw new Error("Could not read the response. Please try again."); }
  if (!response.ok) throw new RequestError(data.error?.message ?? "Something went wrong. Please try again.", response.status);
  return data;
}
export function message(error: unknown) { return error instanceof Error ? error.message : "Something went wrong. Please try again."; }
