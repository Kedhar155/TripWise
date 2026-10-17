export class ApiError extends Error {
  constructor(public status: number, public code: string, message: string) {
    super(message);
  }
}

export function json(data: unknown, status = 200) {
  return Response.json(data, { status, headers: { "Cache-Control": "no-store" } });
}

export function failure(error: unknown) {
  if (error instanceof ApiError) {
    return json({ error: { code: error.code, message: error.message } }, error.status);
  }
  // Never log upstream exceptions: they may contain URLs with API keys.
  return json({ error: { code: "INTERNAL_ERROR", message: "Something went wrong. Please try again." } }, 500);
}

export function uuid(value: unknown, field = "visitor ID") {
  if (typeof value !== "string" || !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)) {
    throw new ApiError(400, "INVALID_ID", `A valid ${field} is required.`);
  }
  return value;
}

export function visitor(request: Request) {
  return uuid(request.headers.get("x-visitor-id"));
}

export function placeId(value: unknown) {
  if (typeof value !== "string" || !/^[a-zA-Z0-9_-]{1,512}$/.test(value)) {
    throw new ApiError(400, "INVALID_PLACE_ID", "A valid place ID is required.");
  }
  return value;
}

export async function body(request: Request): Promise<Record<string, unknown>> {
  if (!request.headers.get("content-type")?.includes("application/json")) {
    throw new ApiError(400, "INVALID_BODY", "Send a JSON request body.");
  }
  // Bound streamed input rather than trusting Content-Length.
  const reader = request.body?.getReader();
  if (!reader) throw new ApiError(400, "INVALID_BODY", "A JSON object is required.");
  const decoder = new TextDecoder();
  let text = "";
  let size = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > 4096) {
      await reader.cancel();
      throw new ApiError(400, "INVALID_BODY", "The request body is too large.");
    }
    text += decoder.decode(value, { stream: true });
  }
  text += decoder.decode();
  try {
    const parsed = JSON.parse(text);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error();
    return parsed;
  } catch {
    throw new ApiError(400, "INVALID_BODY", "A valid JSON object is required.");
  }
}
