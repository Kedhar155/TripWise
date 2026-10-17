# TripWise API

All responses are JSON and use `Cache-Control: no-store`. Credentials stay on the server in `.env.local`.

## Find places

`GET /api/places?city=Chennai&category=museums&sort=distance`

- `city`: required, 2–120 characters after trimming. Add country to disambiguate.
- `category`: `all` (default), or one or more comma-separated main category IDs: `sights`, `museums`, `parks`, `restaurants`, `beaches`, `entertainment`, `shopping`, `accommodation`, `other`. Example: `category=museums,parks`. Repeated `category` parameters are also accepted. Empty/unknown entries and mixing `all` with specific categories return 400. Old `attractions` and `cafes` URLs remain accepted as aliases for `sights` and `restaurants`.
- `src/lib/categories.ts` defines labels, icons, colors, Geoapify query prefixes, aliases, and classification priority. All tags on a place are considered; specialized groups take priority over broader groups. Unknown/missing tags become `other`. Category strings in responses are these main IDs. Existing saved raw category strings are mapped by the same catalog when displayed; no database migration is required.
- The server requests only the selected groups' Geoapify prefixes, then removes overlapping results classified outside the selection (for example, museums from an Entertainment-only query). Other searches practical amenities, rentals, and services, and is the display fallback for any unmatched place; it does not query every possible Geoapify category. All includes the union of this catalog's query prefixes.
- `sort`: `distance` (default) or `name`.
- Returns `{ places, city, meta }`. Searches inside the resolved city boundary. Returns up to 100 places, sorting this result set. Distance is straight-line meters from the city center, not the visitor's location or a driving distance.
- An unknown city returns 404; a city with no matching places returns 200 with an empty array.

`GET /api/places/[id]` returns `{ place }`. Keep the original search ID when saving. Geoapify sometimes encodes a different centroid in its detail response; the API preserves the requested ID.

## My Trip

Every itinerary request requires an `x-visitor-id` header containing a random v4 UUID. The frontend will create it once with `crypto.randomUUID()` and store it in localStorage.

- `GET /api/itinerary`: returns `{ items }`, newest first.
- `POST /api/itinerary`: send `Content-Type: application/json` and `{ "place_id": "<Geoapify place ID>" }`. Returns 201 with `{ item }`. Place fields are fetched from Geoapify on the server. Client-supplied names and coordinates are not trusted.
- `DELETE /api/itinerary/[id]`: use the saved itinerary row UUID, not its place ID. Returns `{ deleted: "<row UUID>" }`. Both the row ID and visitor ID must match.
- `PATCH /api/itinerary/[id]`: send `Content-Type: application/json` and `{ "day": 2 }` to plan a place. Accepts a whole number from 1 through 14; `{ "day": null }` or `{ "day": "" }` moves it to Unplanned. Returns 200 with `{ item }`, including its nullable `day`. Missing/invalid day, visitor ID, item ID, or body returns 400. A missing item or one belonging to another visitor returns 404. Only `day` is updated. New places default to `day: null`.

Example (replace the disposable v4 UUIDs with your visitor and saved row IDs):

```http
PATCH /api/itinerary/11111111-1111-4111-8111-111111111111
x-visitor-id: 22222222-2222-4222-8222-222222222222
Content-Type: application/json

{"day":2}
```

Response: HTTP 200, `{ "item": { "id": "11111111-1111-4111-8111-111111111111", "day": 2, ... } }` (all other saved item fields are returned unchanged). Full responses from real test requests are saved in `docs/extras/feature-5-api-tests.md`.

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

Day planning adds the nullable integer column with `supabase/migrations/002_itinerary_day.sql`. Empty day headings are stored in this browser per visitor; place assignments are stored in Supabase. The UI shows Unplanned first, then Days 1–14 in order.

Row-level security is enabled. Browser roles have no table privileges; only the server credential is used. Every itinerary route filters by the visitor ID. A visitor ID acts as a bearer identifier, not a login: anyone who obtains it can access that trip, and clearing localStorage loses the browser's link to it. Do not use this no-login design for sensitive travel records.

## Verification

- `node scripts/check-services.mjs`: reports only status codes for Supabase and Geoapify.
- `node scripts/test-errors.mjs`: checks error status mapping and private-data redaction.
- `node scripts/test-api.mjs`: live integration checks; defaults to `http://127.0.0.1:3003`, overridable with `TEST_BASE_URL`. Creates random test visitors, verifies persistence/duplicates/isolation/removal, and removes only its own temporary rows.
- `npm run lint`, `npm run typecheck`, `npm run build`.

API references: [Geoapify Places](https://apidocs.geoapify.com/docs/places/), [Geoapify Place Details](https://apidocs.geoapify.com/docs/place-details/).
