# TripWise Phase B — API test evidence

Run: 17/10/2026, 09:21:49 IST.
Server: http://127.0.0.1:3003. Overall integration assertions: PASS.

Additional checks from this run: `node scripts/test-errors.mjs` PASS (400/404/409/500 mapping, unexpected-error redaction, JSON handling); `npm run lint` PASS; `npm run typecheck` PASS; homepage HTTP 200 with TripWise content. Existing production build reused; application code unchanged.

These are real HTTP requests against the local site, using Geoapify and the Supabase database. Only newly generated test visitors and their temporary records are used. No credentials are included.

## Repeat the checks

In one PowerShell window inside the project, run `npm run start -- --hostname 127.0.0.1 --port 3003` after a successful build, unless the preview is already running. In another window:

```powershell
node scripts/test-api.mjs
node scripts/test-errors.mjs
```

The first command regenerates this report with fresh visitor and item IDs. The second checks 400/404/409/500 error formatting and private-error redaction in isolation; it does not deliberately break the live services.

## Recorded HTTP results

| # | Request | Expected | Actual | Result | Response summary |
| --- | --- | --- | --- | --- | --- |
| 1 | GET /api/places | 400 | 400 | PASS | INVALID_CITY: Enter a city name between 2 and 120 characters. |
| 2 | GET /api/places?city=a | 400 | 400 | PASS | INVALID_CITY: Enter a city name between 2 and 120 characters. |
| 3 | GET /api/places?city=Chennai&category=invalid | 400 | 400 | PASS | INVALID_CATEGORY: Choose a supported place category. |
| 4 | GET /api/places?city=Chennai&sort=invalid | 400 | 400 | PASS | INVALID_SORT: Sort must be name or distance. |
| 5 | GET /api/places/bad%21 | 400 | 400 | PASS | INVALID_PLACE_ID: A valid place ID is required. |
| 6 | GET /api/itinerary | 400 | 400 | PASS | INVALID_ID: A valid visitor ID is required. |
| 7 | GET /api/itinerary | 400 | 400 | PASS | INVALID_ID: A valid visitor ID is required. |
| 8 | POST /api/itinerary | 400 | 400 | PASS | INVALID_BODY: A valid JSON object is required. |
| 9 | POST /api/itinerary | 400 | 400 | PASS | INVALID_BODY: A valid JSON object is required. |
| 10 | POST /api/itinerary | 400 | 400 | PASS | INVALID_BODY: The request body is too large. |
| 11 | POST /api/itinerary | 400 | 400 | PASS | INVALID_PLACE_ID: A valid place ID is required. |
| 12 | DELETE /api/itinerary/not-a-uuid | 400 | 400 | PASS | INVALID_ID: A valid trip item ID is required. |
| 13 | GET /api/itinerary | 200 | 200 | PASS | 0 saved items |
| 14 | GET /api/places?city=Chennai&category=museums&sort=distance | 200 | 200 | PASS | 16 places; first: Madras High Court Museum |
| 15 | GET /api/places?city=Chennai&category=museums&sort=name | 200 | 200 | PASS | 16 places; first: Amma Museum |
| 16 | GET /api/places?city=zzzxxyyqqqnonexistentcity | 404 | 404 | PASS | CITY_NOT_FOUND: City not found. Try a city name with its country. |
| 17 | GET /api/places/0000 | 404 | 404 | PASS | PLACE_NOT_FOUND: This place could not be found. |
| 18 | GET /api/places/51f86d64725712544059aa2c5787142c2a40f00102f90170bdce41000000009203184d6164726173204869676820436f757274204d757365756d | 200 | 200 | PASS | Details: Madras High Court Museum |
| 19 | POST /api/itinerary | 201 | 201 | PASS | Saved: Madras High Court Museum |
| 20 | POST /api/itinerary | 409 | 409 | PASS | ALREADY_SAVED: This place is already in My Trip. |
| 21 | GET /api/itinerary | 200 | 200 | PASS | 1 saved items |
| 22 | GET /api/itinerary | 200 | 200 | PASS | 0 saved items |
| 23 | DELETE /api/itinerary/60446d8c-edf3-4e7e-8208-84f71bb0cb1c | 404 | 404 | PASS | ITEM_NOT_FOUND: This place is not in your trip. |
| 24 | POST /api/itinerary | 201 | 201 | PASS | Saved: Madras High Court Museum |
| 25 | DELETE /api/itinerary/60446d8c-edf3-4e7e-8208-84f71bb0cb1c | 200 | 200 | PASS | Removed test item: 60446d8c-edf3-4e7e-8208-84f71bb0cb1c |
| 26 | DELETE /api/itinerary/60446d8c-edf3-4e7e-8208-84f71bb0cb1c | 404 | 404 | PASS | ITEM_NOT_FOUND: This place is not in your trip. |
| 27 | GET /api/itinerary | 200 | 200 | PASS | 0 saved items |
| 28 | DELETE /api/itinerary/e5cc5538-bd8c-450f-b415-89df923823a0 | 200 | 200 | PASS | Removed test item: e5cc5538-bd8c-450f-b415-89df923823a0 |

Additional assertions: nonempty Chennai museum search; name and distance order; stable detail ID; saved item present in a new GET request; duplicate rejected; second visitor initially empty; same place allowed for separate visitors; another visitor cannot remove the first visitor's item; empty list after removal; no-store on every response.

## Exact requests from this run

These PowerShell curl commands record the actual inputs, including disposable test IDs. Deleted row IDs cannot be replayed as successful deletions; rerun the script to repeat the complete sequence with fresh IDs.

### 1. GET — HTTP 400

```powershell
curl.exe -s -i -X GET "http://127.0.0.1:3003/api/places"
```

Result: INVALID_CITY: Enter a city name between 2 and 120 characters.

### 2. GET — HTTP 400

```powershell
curl.exe -s -i -X GET "http://127.0.0.1:3003/api/places?city=a"
```

Result: INVALID_CITY: Enter a city name between 2 and 120 characters.

### 3. GET — HTTP 400

```powershell
curl.exe -s -i -X GET "http://127.0.0.1:3003/api/places?city=Chennai&category=invalid"
```

Result: INVALID_CATEGORY: Choose a supported place category.

### 4. GET — HTTP 400

```powershell
curl.exe -s -i -X GET "http://127.0.0.1:3003/api/places?city=Chennai&sort=invalid"
```

Result: INVALID_SORT: Sort must be name or distance.

### 5. GET — HTTP 400

```powershell
curl.exe -s -i -X GET "http://127.0.0.1:3003/api/places/bad%21"
```

Result: INVALID_PLACE_ID: A valid place ID is required.

### 6. GET — HTTP 400

```powershell
curl.exe -s -i -X GET "http://127.0.0.1:3003/api/itinerary"
```

Result: INVALID_ID: A valid visitor ID is required.

### 7. GET — HTTP 400

```powershell
curl.exe -s -i -X GET "http://127.0.0.1:3003/api/itinerary" -H 'x-visitor-id: invalid' -H 'content-type: application/json'
```

Result: INVALID_ID: A valid visitor ID is required.

### 8. POST — HTTP 400

```powershell
curl.exe -s -i -X POST "http://127.0.0.1:3003/api/itinerary" -H 'x-visitor-id: 85fb5e1d-f014-401e-9f88-878626c2e342' -H 'content-type: application/json' --data-raw '{broken'
```

Result: INVALID_BODY: A valid JSON object is required.

### 9. POST — HTTP 400

```powershell
curl.exe -s -i -X POST "http://127.0.0.1:3003/api/itinerary" -H 'x-visitor-id: 85fb5e1d-f014-401e-9f88-878626c2e342' -H 'content-type: application/json' --data-raw '[]'
```

Result: INVALID_BODY: A valid JSON object is required.

### 10. POST — HTTP 400

```powershell
curl.exe -s -i -X POST "http://127.0.0.1:3003/api/itinerary" -H 'x-visitor-id: 85fb5e1d-f014-401e-9f88-878626c2e342' -H 'content-type: application/json' --data-raw '{"place_id":"xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"}'
```

Result: INVALID_BODY: The request body is too large.

### 11. POST — HTTP 400

```powershell
curl.exe -s -i -X POST "http://127.0.0.1:3003/api/itinerary" -H 'x-visitor-id: 85fb5e1d-f014-401e-9f88-878626c2e342' -H 'content-type: application/json' --data-raw '{"place_id":"bad!"}'
```

Result: INVALID_PLACE_ID: A valid place ID is required.

### 12. DELETE — HTTP 400

```powershell
curl.exe -s -i -X DELETE "http://127.0.0.1:3003/api/itinerary/not-a-uuid" -H 'x-visitor-id: 85fb5e1d-f014-401e-9f88-878626c2e342' -H 'content-type: application/json'
```

Result: INVALID_ID: A valid trip item ID is required.

### 13. GET — HTTP 200

```powershell
curl.exe -s -i -X GET "http://127.0.0.1:3003/api/itinerary" -H 'x-visitor-id: 85fb5e1d-f014-401e-9f88-878626c2e342' -H 'content-type: application/json'
```

Result: 0 saved items

### 14. GET — HTTP 200

```powershell
curl.exe -s -i -X GET "http://127.0.0.1:3003/api/places?city=Chennai&category=museums&sort=distance"
```

Result: 16 places; first: Madras High Court Museum

### 15. GET — HTTP 200

```powershell
curl.exe -s -i -X GET "http://127.0.0.1:3003/api/places?city=Chennai&category=museums&sort=name"
```

Result: 16 places; first: Amma Museum

### 16. GET — HTTP 404

```powershell
curl.exe -s -i -X GET "http://127.0.0.1:3003/api/places?city=zzzxxyyqqqnonexistentcity"
```

Result: CITY_NOT_FOUND: City not found. Try a city name with its country.

### 17. GET — HTTP 404

```powershell
curl.exe -s -i -X GET "http://127.0.0.1:3003/api/places/0000"
```

Result: PLACE_NOT_FOUND: This place could not be found.

### 18. GET — HTTP 200

```powershell
curl.exe -s -i -X GET "http://127.0.0.1:3003/api/places/51f86d64725712544059aa2c5787142c2a40f00102f90170bdce41000000009203184d6164726173204869676820436f757274204d757365756d"
```

Result: Details: Madras High Court Museum

### 19. POST — HTTP 201

```powershell
curl.exe -s -i -X POST "http://127.0.0.1:3003/api/itinerary" -H 'x-visitor-id: 85fb5e1d-f014-401e-9f88-878626c2e342' -H 'content-type: application/json' --data-raw '{"place_id":"51f86d64725712544059aa2c5787142c2a40f00102f90170bdce41000000009203184d6164726173204869676820436f757274204d757365756d"}'
```

Result: Saved: Madras High Court Museum

### 20. POST — HTTP 409

```powershell
curl.exe -s -i -X POST "http://127.0.0.1:3003/api/itinerary" -H 'x-visitor-id: 85fb5e1d-f014-401e-9f88-878626c2e342' -H 'content-type: application/json' --data-raw '{"place_id":"51f86d64725712544059aa2c5787142c2a40f00102f90170bdce41000000009203184d6164726173204869676820436f757274204d757365756d"}'
```

Result: ALREADY_SAVED: This place is already in My Trip.

### 21. GET — HTTP 200

```powershell
curl.exe -s -i -X GET "http://127.0.0.1:3003/api/itinerary" -H 'x-visitor-id: 85fb5e1d-f014-401e-9f88-878626c2e342' -H 'content-type: application/json'
```

Result: 1 saved items

### 22. GET — HTTP 200

```powershell
curl.exe -s -i -X GET "http://127.0.0.1:3003/api/itinerary" -H 'x-visitor-id: c67c1d9b-a243-49eb-951c-efe0c1568eed' -H 'content-type: application/json'
```

Result: 0 saved items

### 23. DELETE — HTTP 404

```powershell
curl.exe -s -i -X DELETE "http://127.0.0.1:3003/api/itinerary/60446d8c-edf3-4e7e-8208-84f71bb0cb1c" -H 'x-visitor-id: c67c1d9b-a243-49eb-951c-efe0c1568eed' -H 'content-type: application/json'
```

Result: ITEM_NOT_FOUND: This place is not in your trip.

### 24. POST — HTTP 201

```powershell
curl.exe -s -i -X POST "http://127.0.0.1:3003/api/itinerary" -H 'x-visitor-id: c67c1d9b-a243-49eb-951c-efe0c1568eed' -H 'content-type: application/json' --data-raw '{"place_id":"51f86d64725712544059aa2c5787142c2a40f00102f90170bdce41000000009203184d6164726173204869676820436f757274204d757365756d"}'
```

Result: Saved: Madras High Court Museum

### 25. DELETE — HTTP 200

```powershell
curl.exe -s -i -X DELETE "http://127.0.0.1:3003/api/itinerary/60446d8c-edf3-4e7e-8208-84f71bb0cb1c" -H 'x-visitor-id: 85fb5e1d-f014-401e-9f88-878626c2e342' -H 'content-type: application/json'
```

Result: Removed test item: 60446d8c-edf3-4e7e-8208-84f71bb0cb1c

### 26. DELETE — HTTP 404

```powershell
curl.exe -s -i -X DELETE "http://127.0.0.1:3003/api/itinerary/60446d8c-edf3-4e7e-8208-84f71bb0cb1c" -H 'x-visitor-id: 85fb5e1d-f014-401e-9f88-878626c2e342' -H 'content-type: application/json'
```

Result: ITEM_NOT_FOUND: This place is not in your trip.

### 27. GET — HTTP 200

```powershell
curl.exe -s -i -X GET "http://127.0.0.1:3003/api/itinerary" -H 'x-visitor-id: 85fb5e1d-f014-401e-9f88-878626c2e342' -H 'content-type: application/json'
```

Result: 0 saved items

### 28. DELETE — HTTP 200

```powershell
curl.exe -s -i -X DELETE "http://127.0.0.1:3003/api/itinerary/e5cc5538-bd8c-450f-b415-89df923823a0" -H 'x-visitor-id: c67c1d9b-a243-49eb-951c-efe0c1568eed' -H 'content-type: application/json'
```

Result: Removed test item: e5cc5538-bd8c-450f-b415-89df923823a0


## Feature 5 - Day planning PATCH (17 October 2026)

PASS: all 59 local integration HTTP checks, including the existing search/add/list/remove checks and new PATCH validation, persistence, boundary, and visitor-isolation checks. Full evidence: [feature-5-api-tests.md](docs/extras/feature-5-api-tests.md).

`PATCH /api/itinerary/[id]` requires a saved row UUID, `x-visitor-id`, and JSON content type. `day` must be a whole number 1–14, `null`, or an empty string. Missing/invalid input returns 400; an absent item or another visitor's item returns 404. Newly saved places return `day: null`.

The example below records a real successful request and response using disposable test IDs. The test item has since been removed; run the checker with a fresh test visitor to repeat it.

### Example: set Day 2

```powershell
curl.exe -s -i -X PATCH "http://127.0.0.1:3014/api/itinerary/88c8f568-90db-42d0-8bc9-3c03f3bc3ca8" -H 'x-visitor-id: d584080a-4e3b-4ca9-bd16-deb8760a4d0a' -H 'content-type: application/json' --data-raw '{"day":2}'
```

Result: Updated: Madras High Court Museum; day: 2

Response:

```json
{
  "item": {
    "id": "88c8f568-90db-42d0-8bc9-3c03f3bc3ca8",
    "visitor_id": "d584080a-4e3b-4ca9-bd16-deb8760a4d0a",
    "place_id": "51f86d64725712544059aa2c5787142c2a40f00102f90170bdce41000000009203184d6164726173204869676820436f757274204d757365756d",
    "name": "Madras High Court Museum",
    "address": "Madras High Court Museum, North Fort Road, Zone 5 Royapuram, Chennai - 600009, Tamil Nadu, India",
    "category": "building",
    "latitude": 13.0860973,
    "longitude": 80.2865932,
    "created_at": "2026-10-17T11:38:13.732205+00:00",
    "day": 2
  }
}
```

<!-- BEGIN SEARCH REWORK 2 -->
## Search rework: country/city and worldwide place-name search

Verified against http://127.0.0.1:3021: 32 real HTTP requests PASS. Full responses: [change-2-api-tests.md](docs/search-rework/change-2-api-tests.md).

Repeat: `node scripts/test-search-api.mjs` (default local port 3021; override TEST_BASE_URL if needed).

- `GET /api/cities?country=fr&q=Par`: country is a lowercase code from src/lib/countries.ts; q must be 3–120 characters. Suggestions are country-restricted, deduplicated, and cached upstream for 24 hours. Browser waits 400 ms and caches repeats for 10 minutes.
- `GET /api/places?city=Paris&country=fr&cityId=<suggestion-id>&category=museums,parks&sort=name`: existing route extended with optional country and cityId. City IDs require a country and must resolve inside that country; old city-only requests remain supported.
- `GET /api/places/search?name=Eiffel%20Tower`: worldwide Geocoding amenity search, no country/city required, up to 20 matches with shared Place fields and category mapping. Supports category selections and sort=relevance (default) or name. No invented city-center distances. Empty name/under three characters returns 400; no matches returns 200 with places: [].

### Example: GET /api/places/search?name=ab

HTTP 400

```json
{
  "error": {
    "code": "INVALID_SEARCH",
    "message": "Enter a place name between 3 and 120 characters."
  }
}
```

### Example: GET /api/cities?country=fr&q=Par

HTTP 200

```json
{
  "cities": [
    {
      "id": "517808e3a7718f024059852f0219f06d4840f00101f901141d000000000000c002059203055061726973",
      "name": "Paris",
      "label": "Paris, France",
      "country": "fr"
    },
    {
      "id": "5194a2957b81c9024059ece5d2533f6d4840f00103f90189b90f0100000000c002089203055061726973",
      "name": "Paris",
      "label": "Paris, IDF, France",
      "country": "fr"
    },
    {
      "id": "512ead86c43d36024059ee9aeb8f8b6e4840f00101f9012d25000000000000c0020592031331367468204172726f6e64697373656d656e74",
      "name": "Paris",
      "label": "16th Arrondissement, Paris, France",
      "country": "fr"
    },
    {
      "id": "5145717d0ee2a9024059f57695ffda6c4840f00101f9013725000000000000c00205920312367468204172726f6e64697373656d656e74",
      "name": "Paris",
      "label": "6th Arrondissement, Paris, France",
      "country": "fr"
    },
    {
      "id": "51d034176eaf7b0240590fcb0b55d66f4840f00101f9018851000000000000c0020592031b387468204172726f6e64697373656d656e74206f66205061726973",
      "name": "Paris",
      "label": "8th Arrondissement of Paris, Paris, France",
      "country": "fr"
    },
    {
      "id": "51aa8251499d8002405954e81780a16d4840f00101f9013125000000000000c00205920312377468204172726f6e64697373656d656e74",
      "name": "Paris",
      "label": "7th Arrondissement, Paris, France",
      "country": "fr"
    }
  ]
}
```

### Example: GET /api/places/search?name=Eiffel+Tower

HTTP 200

```json
{
  "places": [
    {
      "id": "5112386d21235b024059effbdc75db6d4840f00102f901747f4c0000000000c0020192030c45696666656c20546f776572",
      "name": "Eiffel Tower",
      "address": "Eiffel Tower, 5 Avenue Anatole France, 75007 Paris, France",
      "category": "sights",
      "latitude": 48.8582599,
      "longitude": 2.2945006
    },
    {
      "id": "51d7a3703d0a0f5dc05909f9a067b3aa4940f00103f90139b34ba000000000c0020192030c45696666656c20546f776572",
      "name": "Eiffel Tower",
      "address": "Eiffel Tower, Improvement District No. 9, AB, Canada",
      "category": "parks",
      "latitude": 51.3336,
      "longitude": -116.235
    }
  ],
  "query": "Eiffel Tower",
  "meta": {
    "limit": 20,
    "count": 2,
    "distanceFrom": null,
    "attribution": "Powered by Geoapify | © OpenStreetMap contributors"
  }
}
```

### Example: GET /api/places/search?name=zzzxxyyqqqnonexistentplace

HTTP 200

```json
{
  "places": [],
  "query": "zzzxxyyqqqnonexistentplace",
  "meta": {
    "limit": 20,
    "count": 0,
    "distanceFrom": null,
    "attribution": "Powered by Geoapify | © OpenStreetMap contributors"
  }
}
```

<!-- END SEARCH REWORK 2 -->

## Search rework: sorting and distance filters (Change 3)

Verified on the local preview at http://127.0.0.1:3023: 56 new real HTTP requests and 237 ordering/grouping assertions passed. The existing 59-request integration suite also passed, including Details, add, fresh itinerary reads, duplicate/visitor isolation, day updates, removal, and empty-trip persistence.

Repeat: `node scripts/test-sort-filters-api.mjs` (optional TEST_BASE_URL override). Evidence: `docs/search-rework/change-3-sort-filter-tests.json`; regression evidence: `docs/search-rework/change-3-regression-tests.md`; browser sort evidence: `docs/search-rework/change-3-browser-sorts.json`.

- City sort IDs: `relevance` (default), `distance`, `distance-desc`, `name`, `name-desc`, `category`, `details`.
- Name search supports the same non-distance sorts. Unsupported name distance/radius requests return 400.
- `within=1`, `5`, `10`, or `25` filters city results by kilometers from the city center. Missing within means Any distance; the website's initial default is 5 km.
- The browser sorts locally using the shared helper, preserving the original response for Best match. It hides sorts that lack data, renders Category groups, and shows removable category/radius/sort chips with Clear all. Sorting never removes records.
- The real matrix crossed Chennai and Paris with All, Museums, and Parks + Restaurants at all four radii plus Any distance; every available sort was checked on each response. Name queries Central Park, Eiffel Tower, and Museum were checked with All, Parks, and Museums + Parks. Each applicable server sort was also checked directly against the corresponding real result set.

Examples (response excerpts):

```http
GET /api/places?city=Chennai&category=museums&within=5&sort=name-desc
```

HTTP 200. The recorded real search returned 11 museum/culture places inside 5 km; names sort Z to A.

```json
{ "meta": { "count": 11, "within": 5, "distanceFrom": "city center" } }
```

```http
GET /api/places?city=Chennai&category=museums&within=1
```

HTTP 200 with `places: []` and count 0. Increasing the radius returned 11 at 5 km, 13 at 10 km, and 16 at 25 km. This empty result was expected, not a sorting failure.

```http
GET /api/places/search?name=Central%20Park&sort=category
```

HTTP 200 with 11 matches. The browser rendered Entertainment (1) and Parks and Nature (10); it offered Best match, both name directions, and Category, with no distance or Most details option for that response.

```http
GET /api/places?city=Paris&within=2
GET /api/places/search?name=Park&sort=distance-desc
GET /api/places/search?name=Park&within=5
```

Each returned HTTP 400 with a clear INVALID_WITHIN or INVALID_SORT message. Blank/non-whitelisted radius values are also rejected before an upstream request.

## Final search-rework regression - 17 October 2026

PASS: all requested phone flows and 160 API cases across four suites; sorting adds 237 independent order/group checks. Latest rebuilt local site: http://127.0.0.1:3025. Only disposable test visitors/items were changed and removed. No merge, push, or deployment.

| Suite | Result | Evidence |
| --- | --- | --- |
| Original routes, Details, saves, duplicates, visitor separation, day planning, refresh/read, removal, errors | 59 HTTP checks passed | [Full regression](docs/search-rework/final-regression-tests.md) |
| Country/city for India, France, Japan; famous, common, misspelled, nonexistent names; validation; name Details/save/remove | 32 HTTP checks passed | [Search responses](docs/search-rework/final-search-tests.md) |
| Every category and combined categories across Chennai, Paris, Tokyo, Dubai | 13 real searches passed | [Category counts](docs/search-rework/final-category-tests.json) |
| All available sorts, all radius choices, category combinations, grouping and conditional options | 56 HTTP requests and 237 order/group checks passed | [Sort/filter matrix](docs/search-rework/final-sort-filter-tests.json) |
| Phone controls, icons, chips, Details, days, summary, refresh and removal | Passed at 390px and 320px without horizontal overflow | [Browser checks](docs/search-rework/final-browser-checks.json) |

Examples and their full real responses remain in the linked search/general reports:

- `GET /api/cities?country=fr&q=Par`: 200 with suggestions restricted to France; repeated results stable.
- `GET /api/places?city=Chennai&category=museums&within=1`: 200 with an empty places list; 5/10/25 km returned 11/13/16 museums respectively.
- `GET /api/places/search?name=Eiffel%20Tower`: 200 with two matches, both usable in Details and My Trip.
- `GET /api/places/search?name=zzzxxyyqqqnonexistentplace`: 200 with an empty places list and the helpful empty-state message in the UI.
- `GET /api/places/search?name=ab`: 400 with INVALID_SEARCH and a clear minimum-input message.
- `GET /api/places/search?name=Park&sort=distance-desc` and `GET /api/places?city=Paris&within=2`: 400 with INVALID_SORT / INVALID_WITHIN.

The category/sort matrix used the existing production preview at port 3024. The final search/general suites used the rebuilt site at port 3025. Only the Details save link changed; API and database behavior stayed the same. The link waits during saving so opening My Trip cannot outrun that save through the Details link. An isolated eight-second slow-save preview verified blocked activation and restoration; the real Eiffel Tower add/plan/refresh/remove flow passed afterward.

To repeat without replacing earlier phase reports, run these from the project after starting a successful production build:

```powershell
$env:TEST_BASE_URL='http://127.0.0.1:3025'
$env:TEST_REPORT_PATH='docs/search-rework/final-regression-tests.md'
node scripts/test-api.mjs
$env:TEST_REPORT_PATH='docs/search-rework/final-search-tests.md'
node scripts/test-search-api.mjs
$env:TEST_REPORT_PATH='docs/search-rework/final-category-tests.json'
node scripts/test-category-search.mjs
$env:TEST_REPORT_PATH='docs/search-rework/final-sort-filter-tests.json'
node scripts/test-sort-filters-api.mjs
```

The optional TEST_REPORT_PATH now preserves the older search examples in this file when the search suite runs. API errors and empty searches are expected cases, not test failures. Screenshots: [phone Explore](docs/search-rework/final-phone.png), [trip summary](docs/search-rework/final-trip-phone.png), [saving link](docs/search-rework/final-save-wait.png).
