import "server-only";
import { createClient } from "@supabase/supabase-js";
import { ApiError } from "./api";

export function database() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) throw new ApiError(500, "DATABASE_NOT_CONFIGURED", "Trip storage is not configured yet.");
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { fetch: (input, init) => fetch(input, { ...init, cache: "no-store", signal: AbortSignal.timeout(12000) }) },
  });
}

export function databaseError(error: { code?: string } | null) {
  if (!error) return;
  if (error.code === "23505") throw new ApiError(409, "ALREADY_SAVED", "This place is already in My Trip.");
  if (error.code === "PGRST205" || error.code === "42P01") {
    throw new ApiError(500, "DATABASE_NOT_READY", "Trip storage is not ready yet. Please try again later.");
  }
  throw new ApiError(500, "DATABASE_ERROR", "Your trip could not be saved or loaded. Please try again.");
}
