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
