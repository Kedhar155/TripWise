# TripWise API

All responses are JSON and use `Cache-Control: no-store`. Credentials stay on the server in `.env.local`.

## Find places

`GET /api/places?city=Chennai&category=museums&sort=distance`

- `city`: required, 2–120 characters after trimming. Add country to disambiguate.
- `category`: `all` (default), `attractions`, `restaurants`, `cafes`, `parks`, `museums`.
- `sort`: `distance` (default) or `name`.
- Returns `{ places, city, meta }`. Searches inside the resolved city boundary. Returns up to 100 places, sorting this result set. Distance is straight-line meters from the city center, not the visitor's location or a driving distance.
- An unknown city returns 404; a city with no matching places returns 200 with an empty array.

`GET /api/places/[id]` returns `{ place }`. Keep the original search ID when saving. Geoapify sometimes encodes a different centroid in its detail response; the API preserves the requested ID.

## My Trip

Every itinerary request requires an `x-visitor-id` header containing a random v4 UUID. The frontend will create it once with `crypto.randomUUID()` and store it in localStorage.

- `GET /api/itinerary`: returns `{ items }`, newest first.
- `POST /api/itinerary`: send `Content-Type: application/json` and `{ "place_id": "<Geoapify place ID>" }`. Returns 201 with `{ item }`. Place fields are fetched from Geoapify on the server. Client-supplied names and coordinates are not trusted.
- `DELETE /api/itinerary/[id]`: use the saved itinerary row UUID, not its place ID. Returns `{ deleted: "<row UUID>" }`. Both the row ID and visitor ID must match.

## Errors

Shape: `{ "error": { "code": "INVALID_CITY", "message": "Enter a city name between 2 and 120 characters." } }`

| Status | Meaning |
| --- | --- |
| 400 | Missing/invalid input, malformed JSON, oversized body |
| 404 | Unknown city/place or trip item not belonging to this visitor |
| 409 | Place already saved by this visitor |
| 500 | Missing configuration, unavailable upstream service, or database error |

Upstream errors and request URLs are not returned or logged because they can contain keys. External requests have timeouts.

## Database and access

Schema: `supabase/migrations/001_itinerary.sql`. Applied to the connected TripWise Supabase project on 17 October 2026. The table has the requested columns, coordinate checks, a unique `(visitor_id, place_id)` constraint, and an index for visitor/date lookups.

Row-level security is enabled. Browser roles have no table privileges; only the server credential is used. Every itinerary route filters by the visitor ID. A visitor ID acts as a bearer identifier, not a login: anyone who obtains it can access that trip, and clearing localStorage loses the browser's link to it. Do not use this no-login design for sensitive travel records.

## Verification

- `node scripts/check-services.mjs`: reports only status codes for Supabase and Geoapify.
- `node scripts/test-errors.mjs`: checks error status mapping and private-data redaction.
- `node scripts/test-api.mjs`: live integration checks; defaults to `http://127.0.0.1:3003`, overridable with `TEST_BASE_URL`. Creates random test visitors, verifies persistence/duplicates/isolation/removal, and removes only its own temporary rows.
- `npm run lint`, `npm run typecheck`, `npm run build`.

API references: [Geoapify Places](https://apidocs.geoapify.com/docs/places/), [Geoapify Place Details](https://apidocs.geoapify.com/docs/place-details/).
