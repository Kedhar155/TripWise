# TripWise — API test evidence

Run: 18/10/2026, 18:04:14 IST.
Server: https://tripwise-lime.vercel.app. Overall integration assertions: PASS.

These are real HTTP requests against the server above, using Geoapify and the Supabase database. Only newly generated test visitors and their temporary records are used. No credentials are included.

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
| 3 | GET /api/places?city=Chennai&category=invalid | 400 | 400 | PASS | INVALID_CATEGORY: Choose supported place categories, or All. |
| 4 | GET /api/places?city=Chennai&sort=invalid | 400 | 400 | PASS | INVALID_SORT: Choose a supported sort option. |
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
| 19 | POST /api/itinerary | 201 | 201 | PASS | Saved: Madras High Court Museum; day: Unplanned |
| 20 | POST /api/itinerary | 409 | 409 | PASS | ALREADY_SAVED: This place is already in My Trip. |
| 21 | GET /api/itinerary | 200 | 200 | PASS | 1 saved items |
| 22 | GET /api/itinerary | 200 | 200 | PASS | 0 saved items |
| 23 | DELETE /api/itinerary/b1d51194-3c2e-4cf5-8c23-6261884256b9 | 404 | 404 | PASS | ITEM_NOT_FOUND: This place is not in your trip. |
| 24 | POST /api/itinerary | 201 | 201 | PASS | Saved: Madras High Court Museum; day: Unplanned |
| 25 | PATCH /api/itinerary/b1d51194-3c2e-4cf5-8c23-6261884256b9 | 400 | 400 | PASS | INVALID_ID: A valid visitor ID is required. |
| 26 | PATCH /api/itinerary/b1d51194-3c2e-4cf5-8c23-6261884256b9 | 400 | 400 | PASS | INVALID_ID: A valid visitor ID is required. |
| 27 | PATCH /api/itinerary/not-a-uuid | 400 | 400 | PASS | INVALID_ID: A valid trip item ID is required. |
| 28 | PATCH /api/itinerary/b1d51194-3c2e-4cf5-8c23-6261884256b9 | 400 | 400 | PASS | INVALID_BODY: A valid JSON object is required. |
| 29 | PATCH /api/itinerary/b1d51194-3c2e-4cf5-8c23-6261884256b9 | 400 | 400 | PASS | INVALID_BODY: A valid JSON object is required. |
| 30 | PATCH /api/itinerary/b1d51194-3c2e-4cf5-8c23-6261884256b9 | 400 | 400 | PASS | INVALID_BODY: Send a JSON request body. |
| 31 | PATCH /api/itinerary/b1d51194-3c2e-4cf5-8c23-6261884256b9 | 400 | 400 | PASS | INVALID_DAY: Choose a whole day from 1 to 14, or leave it unplanned. |
| 32 | PATCH /api/itinerary/b1d51194-3c2e-4cf5-8c23-6261884256b9 | 400 | 400 | PASS | INVALID_DAY: Choose a whole day from 1 to 14, or leave it unplanned. |
| 33 | PATCH /api/itinerary/b1d51194-3c2e-4cf5-8c23-6261884256b9 | 400 | 400 | PASS | INVALID_DAY: Choose a whole day from 1 to 14, or leave it unplanned. |
| 34 | PATCH /api/itinerary/b1d51194-3c2e-4cf5-8c23-6261884256b9 | 400 | 400 | PASS | INVALID_DAY: Choose a whole day from 1 to 14, or leave it unplanned. |
| 35 | PATCH /api/itinerary/b1d51194-3c2e-4cf5-8c23-6261884256b9 | 400 | 400 | PASS | INVALID_DAY: Choose a whole day from 1 to 14, or leave it unplanned. |
| 36 | PATCH /api/itinerary/b1d51194-3c2e-4cf5-8c23-6261884256b9 | 400 | 400 | PASS | INVALID_DAY: Choose a whole day from 1 to 14, or leave it unplanned. |
| 37 | PATCH /api/itinerary/b1d51194-3c2e-4cf5-8c23-6261884256b9 | 400 | 400 | PASS | INVALID_DAY: Choose a whole day from 1 to 14, or leave it unplanned. |
| 38 | PATCH /api/itinerary/b1d51194-3c2e-4cf5-8c23-6261884256b9 | 400 | 400 | PASS | INVALID_DAY: Choose a whole day from 1 to 14, or leave it unplanned. |
| 39 | PATCH /api/itinerary/b1d51194-3c2e-4cf5-8c23-6261884256b9 | 400 | 400 | PASS | INVALID_DAY: Choose a whole day from 1 to 14, or leave it unplanned. |
| 40 | PATCH /api/itinerary/b1d51194-3c2e-4cf5-8c23-6261884256b9 | 400 | 400 | PASS | INVALID_DAY: Choose a whole day from 1 to 14, or leave it unplanned. |
| 41 | PATCH /api/itinerary/b1d51194-3c2e-4cf5-8c23-6261884256b9 | 404 | 404 | PASS | ITEM_NOT_FOUND: This place is not in your trip. |
| 42 | PATCH /api/itinerary/c1a92c52-a43d-4be0-b082-eb33372ee476 | 404 | 404 | PASS | ITEM_NOT_FOUND: This place is not in your trip. |
| 43 | PATCH /api/itinerary/b1d51194-3c2e-4cf5-8c23-6261884256b9 | 200 | 200 | PASS | Updated: Madras High Court Museum; day: 1 |
| 44 | GET /api/itinerary | 200 | 200 | PASS | 1 saved items |
| 45 | PATCH /api/itinerary/b1d51194-3c2e-4cf5-8c23-6261884256b9 | 200 | 200 | PASS | Updated: Madras High Court Museum; day: 14 |
| 46 | GET /api/itinerary | 200 | 200 | PASS | 1 saved items |
| 47 | PATCH /api/itinerary/b1d51194-3c2e-4cf5-8c23-6261884256b9 | 200 | 200 | PASS | Updated: Madras High Court Museum; day: 2 |
| 48 | GET /api/itinerary | 200 | 200 | PASS | 1 saved items |
| 49 | PATCH /api/itinerary/b1d51194-3c2e-4cf5-8c23-6261884256b9 | 200 | 200 | PASS | Updated: Madras High Court Museum; day: 2 |
| 50 | GET /api/itinerary | 200 | 200 | PASS | 1 saved items |
| 51 | PATCH /api/itinerary/b1d51194-3c2e-4cf5-8c23-6261884256b9 | 200 | 200 | PASS | Updated: Madras High Court Museum; day: Unplanned |
| 52 | PATCH /api/itinerary/b1d51194-3c2e-4cf5-8c23-6261884256b9 | 200 | 200 | PASS | Updated: Madras High Court Museum; day: 1 |
| 53 | PATCH /api/itinerary/b1d51194-3c2e-4cf5-8c23-6261884256b9 | 200 | 200 | PASS | Updated: Madras High Court Museum; day: Unplanned |
| 54 | GET /api/itinerary | 200 | 200 | PASS | 1 saved items |
| 55 | GET /api/itinerary | 200 | 200 | PASS | 1 saved items |
| 56 | DELETE /api/itinerary/b1d51194-3c2e-4cf5-8c23-6261884256b9 | 200 | 200 | PASS | Removed test item: b1d51194-3c2e-4cf5-8c23-6261884256b9 |
| 57 | DELETE /api/itinerary/b1d51194-3c2e-4cf5-8c23-6261884256b9 | 404 | 404 | PASS | ITEM_NOT_FOUND: This place is not in your trip. |
| 58 | GET /api/itinerary | 200 | 200 | PASS | 0 saved items |
| 59 | DELETE /api/itinerary/8fb4a720-59e3-4a44-8495-0a9ad21d2890 | 200 | 200 | PASS | Removed test item: 8fb4a720-59e3-4a44-8495-0a9ad21d2890 |

Additional assertions: nonempty Chennai museum search; name and distance order; stable detail ID; saved item present in a new GET request; duplicate rejected; second visitor initially empty; same place allowed for separate visitors; another visitor cannot remove or update the first visitor's item; new places start Unplanned; PATCH accepts whole days 1–14, null, and empty string; invalid/missing input returns 400; absent/other-visitor items return 404; day changes and clearing persist in fresh reads; empty list after removal; no-store on every response.

## Exact requests from this run

These PowerShell curl commands record the actual inputs, including disposable test IDs. Deleted row IDs cannot be replayed as successful deletions; rerun the script to repeat the complete sequence with fresh IDs.

### 1. GET — HTTP 400

```powershell
curl.exe -s -i -X GET "https://tripwise-lime.vercel.app/api/places"
```

Result: INVALID_CITY: Enter a city name between 2 and 120 characters.

### 2. GET — HTTP 400

```powershell
curl.exe -s -i -X GET "https://tripwise-lime.vercel.app/api/places?city=a"
```

Result: INVALID_CITY: Enter a city name between 2 and 120 characters.

### 3. GET — HTTP 400

```powershell
curl.exe -s -i -X GET "https://tripwise-lime.vercel.app/api/places?city=Chennai&category=invalid"
```

Result: INVALID_CATEGORY: Choose supported place categories, or All.

### 4. GET — HTTP 400

```powershell
curl.exe -s -i -X GET "https://tripwise-lime.vercel.app/api/places?city=Chennai&sort=invalid"
```

Result: INVALID_SORT: Choose a supported sort option.

### 5. GET — HTTP 400

```powershell
curl.exe -s -i -X GET "https://tripwise-lime.vercel.app/api/places/bad%21"
```

Result: INVALID_PLACE_ID: A valid place ID is required.

### 6. GET — HTTP 400

```powershell
curl.exe -s -i -X GET "https://tripwise-lime.vercel.app/api/itinerary"
```

Result: INVALID_ID: A valid visitor ID is required.

### 7. GET — HTTP 400

```powershell
curl.exe -s -i -X GET "https://tripwise-lime.vercel.app/api/itinerary" -H 'x-visitor-id: invalid' -H 'content-type: application/json'
```

Result: INVALID_ID: A valid visitor ID is required.

### 8. POST — HTTP 400

```powershell
curl.exe -s -i -X POST "https://tripwise-lime.vercel.app/api/itinerary" -H 'x-visitor-id: 33cc2705-c0ec-4005-a77a-8d80e42e1708' -H 'content-type: application/json' --data-raw '{broken'
```

Result: INVALID_BODY: A valid JSON object is required.

### 9. POST — HTTP 400

```powershell
curl.exe -s -i -X POST "https://tripwise-lime.vercel.app/api/itinerary" -H 'x-visitor-id: 33cc2705-c0ec-4005-a77a-8d80e42e1708' -H 'content-type: application/json' --data-raw '[]'
```

Result: INVALID_BODY: A valid JSON object is required.

### 10. POST — HTTP 400

```powershell
curl.exe -s -i -X POST "https://tripwise-lime.vercel.app/api/itinerary" -H 'x-visitor-id: 33cc2705-c0ec-4005-a77a-8d80e42e1708' -H 'content-type: application/json' --data-raw '{"place_id":"xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"}'
```

Result: INVALID_BODY: The request body is too large.

### 11. POST — HTTP 400

```powershell
curl.exe -s -i -X POST "https://tripwise-lime.vercel.app/api/itinerary" -H 'x-visitor-id: 33cc2705-c0ec-4005-a77a-8d80e42e1708' -H 'content-type: application/json' --data-raw '{"place_id":"bad!"}'
```

Result: INVALID_PLACE_ID: A valid place ID is required.

### 12. DELETE — HTTP 400

```powershell
curl.exe -s -i -X DELETE "https://tripwise-lime.vercel.app/api/itinerary/not-a-uuid" -H 'x-visitor-id: 33cc2705-c0ec-4005-a77a-8d80e42e1708' -H 'content-type: application/json'
```

Result: INVALID_ID: A valid trip item ID is required.

### 13. GET — HTTP 200

```powershell
curl.exe -s -i -X GET "https://tripwise-lime.vercel.app/api/itinerary" -H 'x-visitor-id: 33cc2705-c0ec-4005-a77a-8d80e42e1708' -H 'content-type: application/json'
```

Result: 0 saved items

### 14. GET — HTTP 200

```powershell
curl.exe -s -i -X GET "https://tripwise-lime.vercel.app/api/places?city=Chennai&category=museums&sort=distance"
```

Result: 16 places; first: Madras High Court Museum

### 15. GET — HTTP 200

```powershell
curl.exe -s -i -X GET "https://tripwise-lime.vercel.app/api/places?city=Chennai&category=museums&sort=name"
```

Result: 16 places; first: Amma Museum

### 16. GET — HTTP 404

```powershell
curl.exe -s -i -X GET "https://tripwise-lime.vercel.app/api/places?city=zzzxxyyqqqnonexistentcity"
```

Result: CITY_NOT_FOUND: City not found. Try a city name with its country.

### 17. GET — HTTP 404

```powershell
curl.exe -s -i -X GET "https://tripwise-lime.vercel.app/api/places/0000"
```

Result: PLACE_NOT_FOUND: This place could not be found.

### 18. GET — HTTP 200

```powershell
curl.exe -s -i -X GET "https://tripwise-lime.vercel.app/api/places/51f86d64725712544059aa2c5787142c2a40f00102f90170bdce41000000009203184d6164726173204869676820436f757274204d757365756d"
```

Result: Details: Madras High Court Museum

### 19. POST — HTTP 201

```powershell
curl.exe -s -i -X POST "https://tripwise-lime.vercel.app/api/itinerary" -H 'x-visitor-id: 33cc2705-c0ec-4005-a77a-8d80e42e1708' -H 'content-type: application/json' --data-raw '{"place_id":"51f86d64725712544059aa2c5787142c2a40f00102f90170bdce41000000009203184d6164726173204869676820436f757274204d757365756d"}'
```

Result: Saved: Madras High Court Museum; day: Unplanned

### 20. POST — HTTP 409

```powershell
curl.exe -s -i -X POST "https://tripwise-lime.vercel.app/api/itinerary" -H 'x-visitor-id: 33cc2705-c0ec-4005-a77a-8d80e42e1708' -H 'content-type: application/json' --data-raw '{"place_id":"51f86d64725712544059aa2c5787142c2a40f00102f90170bdce41000000009203184d6164726173204869676820436f757274204d757365756d"}'
```

Result: ALREADY_SAVED: This place is already in My Trip.

### 21. GET — HTTP 200

```powershell
curl.exe -s -i -X GET "https://tripwise-lime.vercel.app/api/itinerary" -H 'x-visitor-id: 33cc2705-c0ec-4005-a77a-8d80e42e1708' -H 'content-type: application/json'
```

Result: 1 saved items

### 22. GET — HTTP 200

```powershell
curl.exe -s -i -X GET "https://tripwise-lime.vercel.app/api/itinerary" -H 'x-visitor-id: f68e6235-a537-4857-9cf7-d3b61701dec0' -H 'content-type: application/json'
```

Result: 0 saved items

### 23. DELETE — HTTP 404

```powershell
curl.exe -s -i -X DELETE "https://tripwise-lime.vercel.app/api/itinerary/b1d51194-3c2e-4cf5-8c23-6261884256b9" -H 'x-visitor-id: f68e6235-a537-4857-9cf7-d3b61701dec0' -H 'content-type: application/json'
```

Result: ITEM_NOT_FOUND: This place is not in your trip.

### 24. POST — HTTP 201

```powershell
curl.exe -s -i -X POST "https://tripwise-lime.vercel.app/api/itinerary" -H 'x-visitor-id: f68e6235-a537-4857-9cf7-d3b61701dec0' -H 'content-type: application/json' --data-raw '{"place_id":"51f86d64725712544059aa2c5787142c2a40f00102f90170bdce41000000009203184d6164726173204869676820436f757274204d757365756d"}'
```

Result: Saved: Madras High Court Museum; day: Unplanned

### 25. PATCH — HTTP 400

```powershell
curl.exe -s -i -X PATCH "https://tripwise-lime.vercel.app/api/itinerary/b1d51194-3c2e-4cf5-8c23-6261884256b9" -H 'content-type: application/json' --data-raw '{"day":1}'
```

Result: INVALID_ID: A valid visitor ID is required.

Response:

```json
{
  "error": {
    "code": "INVALID_ID",
    "message": "A valid visitor ID is required."
  }
}
```

### 26. PATCH — HTTP 400

```powershell
curl.exe -s -i -X PATCH "https://tripwise-lime.vercel.app/api/itinerary/b1d51194-3c2e-4cf5-8c23-6261884256b9" -H 'x-visitor-id: invalid' -H 'content-type: application/json' --data-raw '{"day":1}'
```

Result: INVALID_ID: A valid visitor ID is required.

Response:

```json
{
  "error": {
    "code": "INVALID_ID",
    "message": "A valid visitor ID is required."
  }
}
```

### 27. PATCH — HTTP 400

```powershell
curl.exe -s -i -X PATCH "https://tripwise-lime.vercel.app/api/itinerary/not-a-uuid" -H 'x-visitor-id: 33cc2705-c0ec-4005-a77a-8d80e42e1708' -H 'content-type: application/json' --data-raw '{"day":1}'
```

Result: INVALID_ID: A valid trip item ID is required.

Response:

```json
{
  "error": {
    "code": "INVALID_ID",
    "message": "A valid trip item ID is required."
  }
}
```

### 28. PATCH — HTTP 400

```powershell
curl.exe -s -i -X PATCH "https://tripwise-lime.vercel.app/api/itinerary/b1d51194-3c2e-4cf5-8c23-6261884256b9" -H 'x-visitor-id: 33cc2705-c0ec-4005-a77a-8d80e42e1708' -H 'content-type: application/json' --data-raw '{broken'
```

Result: INVALID_BODY: A valid JSON object is required.

Response:

```json
{
  "error": {
    "code": "INVALID_BODY",
    "message": "A valid JSON object is required."
  }
}
```

### 29. PATCH — HTTP 400

```powershell
curl.exe -s -i -X PATCH "https://tripwise-lime.vercel.app/api/itinerary/b1d51194-3c2e-4cf5-8c23-6261884256b9" -H 'x-visitor-id: 33cc2705-c0ec-4005-a77a-8d80e42e1708' -H 'content-type: application/json' --data-raw '[]'
```

Result: INVALID_BODY: A valid JSON object is required.

Response:

```json
{
  "error": {
    "code": "INVALID_BODY",
    "message": "A valid JSON object is required."
  }
}
```

### 30. PATCH — HTTP 400

```powershell
curl.exe -s -i -X PATCH "https://tripwise-lime.vercel.app/api/itinerary/b1d51194-3c2e-4cf5-8c23-6261884256b9" -H 'x-visitor-id: 33cc2705-c0ec-4005-a77a-8d80e42e1708' --data-raw '{"day":1}'
```

Result: INVALID_BODY: Send a JSON request body.

Response:

```json
{
  "error": {
    "code": "INVALID_BODY",
    "message": "Send a JSON request body."
  }
}
```

### 31. PATCH — HTTP 400

```powershell
curl.exe -s -i -X PATCH "https://tripwise-lime.vercel.app/api/itinerary/b1d51194-3c2e-4cf5-8c23-6261884256b9" -H 'x-visitor-id: 33cc2705-c0ec-4005-a77a-8d80e42e1708' -H 'content-type: application/json' --data-raw '{"day":0}'
```

Result: INVALID_DAY: Choose a whole day from 1 to 14, or leave it unplanned.

Response:

```json
{
  "error": {
    "code": "INVALID_DAY",
    "message": "Choose a whole day from 1 to 14, or leave it unplanned."
  }
}
```

### 32. PATCH — HTTP 400

```powershell
curl.exe -s -i -X PATCH "https://tripwise-lime.vercel.app/api/itinerary/b1d51194-3c2e-4cf5-8c23-6261884256b9" -H 'x-visitor-id: 33cc2705-c0ec-4005-a77a-8d80e42e1708' -H 'content-type: application/json' --data-raw '{"day":-1}'
```

Result: INVALID_DAY: Choose a whole day from 1 to 14, or leave it unplanned.

Response:

```json
{
  "error": {
    "code": "INVALID_DAY",
    "message": "Choose a whole day from 1 to 14, or leave it unplanned."
  }
}
```

### 33. PATCH — HTTP 400

```powershell
curl.exe -s -i -X PATCH "https://tripwise-lime.vercel.app/api/itinerary/b1d51194-3c2e-4cf5-8c23-6261884256b9" -H 'x-visitor-id: 33cc2705-c0ec-4005-a77a-8d80e42e1708' -H 'content-type: application/json' --data-raw '{"day":15}'
```

Result: INVALID_DAY: Choose a whole day from 1 to 14, or leave it unplanned.

Response:

```json
{
  "error": {
    "code": "INVALID_DAY",
    "message": "Choose a whole day from 1 to 14, or leave it unplanned."
  }
}
```

### 34. PATCH — HTTP 400

```powershell
curl.exe -s -i -X PATCH "https://tripwise-lime.vercel.app/api/itinerary/b1d51194-3c2e-4cf5-8c23-6261884256b9" -H 'x-visitor-id: 33cc2705-c0ec-4005-a77a-8d80e42e1708' -H 'content-type: application/json' --data-raw '{"day":1.5}'
```

Result: INVALID_DAY: Choose a whole day from 1 to 14, or leave it unplanned.

Response:

```json
{
  "error": {
    "code": "INVALID_DAY",
    "message": "Choose a whole day from 1 to 14, or leave it unplanned."
  }
}
```

### 35. PATCH — HTTP 400

```powershell
curl.exe -s -i -X PATCH "https://tripwise-lime.vercel.app/api/itinerary/b1d51194-3c2e-4cf5-8c23-6261884256b9" -H 'x-visitor-id: 33cc2705-c0ec-4005-a77a-8d80e42e1708' -H 'content-type: application/json' --data-raw '{"day":"1"}'
```

Result: INVALID_DAY: Choose a whole day from 1 to 14, or leave it unplanned.

Response:

```json
{
  "error": {
    "code": "INVALID_DAY",
    "message": "Choose a whole day from 1 to 14, or leave it unplanned."
  }
}
```

### 36. PATCH — HTTP 400

```powershell
curl.exe -s -i -X PATCH "https://tripwise-lime.vercel.app/api/itinerary/b1d51194-3c2e-4cf5-8c23-6261884256b9" -H 'x-visitor-id: 33cc2705-c0ec-4005-a77a-8d80e42e1708' -H 'content-type: application/json' --data-raw '{"day":" "}'
```

Result: INVALID_DAY: Choose a whole day from 1 to 14, or leave it unplanned.

Response:

```json
{
  "error": {
    "code": "INVALID_DAY",
    "message": "Choose a whole day from 1 to 14, or leave it unplanned."
  }
}
```

### 37. PATCH — HTTP 400

```powershell
curl.exe -s -i -X PATCH "https://tripwise-lime.vercel.app/api/itinerary/b1d51194-3c2e-4cf5-8c23-6261884256b9" -H 'x-visitor-id: 33cc2705-c0ec-4005-a77a-8d80e42e1708' -H 'content-type: application/json' --data-raw '{"day":true}'
```

Result: INVALID_DAY: Choose a whole day from 1 to 14, or leave it unplanned.

Response:

```json
{
  "error": {
    "code": "INVALID_DAY",
    "message": "Choose a whole day from 1 to 14, or leave it unplanned."
  }
}
```

### 38. PATCH — HTTP 400

```powershell
curl.exe -s -i -X PATCH "https://tripwise-lime.vercel.app/api/itinerary/b1d51194-3c2e-4cf5-8c23-6261884256b9" -H 'x-visitor-id: 33cc2705-c0ec-4005-a77a-8d80e42e1708' -H 'content-type: application/json' --data-raw '{"day":{}}'
```

Result: INVALID_DAY: Choose a whole day from 1 to 14, or leave it unplanned.

Response:

```json
{
  "error": {
    "code": "INVALID_DAY",
    "message": "Choose a whole day from 1 to 14, or leave it unplanned."
  }
}
```

### 39. PATCH — HTTP 400

```powershell
curl.exe -s -i -X PATCH "https://tripwise-lime.vercel.app/api/itinerary/b1d51194-3c2e-4cf5-8c23-6261884256b9" -H 'x-visitor-id: 33cc2705-c0ec-4005-a77a-8d80e42e1708' -H 'content-type: application/json' --data-raw '{"day":[]}'
```

Result: INVALID_DAY: Choose a whole day from 1 to 14, or leave it unplanned.

Response:

```json
{
  "error": {
    "code": "INVALID_DAY",
    "message": "Choose a whole day from 1 to 14, or leave it unplanned."
  }
}
```

### 40. PATCH — HTTP 400

```powershell
curl.exe -s -i -X PATCH "https://tripwise-lime.vercel.app/api/itinerary/b1d51194-3c2e-4cf5-8c23-6261884256b9" -H 'x-visitor-id: 33cc2705-c0ec-4005-a77a-8d80e42e1708' -H 'content-type: application/json' --data-raw '{}'
```

Result: INVALID_DAY: Choose a whole day from 1 to 14, or leave it unplanned.

Response:

```json
{
  "error": {
    "code": "INVALID_DAY",
    "message": "Choose a whole day from 1 to 14, or leave it unplanned."
  }
}
```

### 41. PATCH — HTTP 404

```powershell
curl.exe -s -i -X PATCH "https://tripwise-lime.vercel.app/api/itinerary/b1d51194-3c2e-4cf5-8c23-6261884256b9" -H 'x-visitor-id: f68e6235-a537-4857-9cf7-d3b61701dec0' -H 'content-type: application/json' --data-raw '{"day":1}'
```

Result: ITEM_NOT_FOUND: This place is not in your trip.

Response:

```json
{
  "error": {
    "code": "ITEM_NOT_FOUND",
    "message": "This place is not in your trip."
  }
}
```

### 42. PATCH — HTTP 404

```powershell
curl.exe -s -i -X PATCH "https://tripwise-lime.vercel.app/api/itinerary/c1a92c52-a43d-4be0-b082-eb33372ee476" -H 'x-visitor-id: 33cc2705-c0ec-4005-a77a-8d80e42e1708' -H 'content-type: application/json' --data-raw '{"day":1}'
```

Result: ITEM_NOT_FOUND: This place is not in your trip.

Response:

```json
{
  "error": {
    "code": "ITEM_NOT_FOUND",
    "message": "This place is not in your trip."
  }
}
```

### 43. PATCH — HTTP 200

```powershell
curl.exe -s -i -X PATCH "https://tripwise-lime.vercel.app/api/itinerary/b1d51194-3c2e-4cf5-8c23-6261884256b9" -H 'x-visitor-id: 33cc2705-c0ec-4005-a77a-8d80e42e1708' -H 'content-type: application/json' --data-raw '{"day":1}'
```

Result: Updated: Madras High Court Museum; day: 1

Response:

```json
{
  "item": {
    "id": "b1d51194-3c2e-4cf5-8c23-6261884256b9",
    "visitor_id": "33cc2705-c0ec-4005-a77a-8d80e42e1708",
    "place_id": "51f86d64725712544059aa2c5787142c2a40f00102f90170bdce41000000009203184d6164726173204869676820436f757274204d757365756d",
    "name": "Madras High Court Museum",
    "address": "Madras High Court Museum, North Fort Road, Zone 5 Royapuram, Chennai - 600009, Tamil Nadu, India",
    "category": "museums",
    "latitude": 13.0860973,
    "longitude": 80.2865932,
    "created_at": "2026-10-18T12:33:52.552431+00:00",
    "day": 1,
    "city": "Chennai",
    "state": "Tamil Nadu",
    "country": "India"
  }
}
```

### 44. GET — HTTP 200

```powershell
curl.exe -s -i -X GET "https://tripwise-lime.vercel.app/api/itinerary" -H 'x-visitor-id: 33cc2705-c0ec-4005-a77a-8d80e42e1708' -H 'content-type: application/json'
```

Result: 1 saved items

### 45. PATCH — HTTP 200

```powershell
curl.exe -s -i -X PATCH "https://tripwise-lime.vercel.app/api/itinerary/b1d51194-3c2e-4cf5-8c23-6261884256b9" -H 'x-visitor-id: 33cc2705-c0ec-4005-a77a-8d80e42e1708' -H 'content-type: application/json' --data-raw '{"day":14}'
```

Result: Updated: Madras High Court Museum; day: 14

Response:

```json
{
  "item": {
    "id": "b1d51194-3c2e-4cf5-8c23-6261884256b9",
    "visitor_id": "33cc2705-c0ec-4005-a77a-8d80e42e1708",
    "place_id": "51f86d64725712544059aa2c5787142c2a40f00102f90170bdce41000000009203184d6164726173204869676820436f757274204d757365756d",
    "name": "Madras High Court Museum",
    "address": "Madras High Court Museum, North Fort Road, Zone 5 Royapuram, Chennai - 600009, Tamil Nadu, India",
    "category": "museums",
    "latitude": 13.0860973,
    "longitude": 80.2865932,
    "created_at": "2026-10-18T12:33:52.552431+00:00",
    "day": 14,
    "city": "Chennai",
    "state": "Tamil Nadu",
    "country": "India"
  }
}
```

### 46. GET — HTTP 200

```powershell
curl.exe -s -i -X GET "https://tripwise-lime.vercel.app/api/itinerary" -H 'x-visitor-id: 33cc2705-c0ec-4005-a77a-8d80e42e1708' -H 'content-type: application/json'
```

Result: 1 saved items

### 47. PATCH — HTTP 200

```powershell
curl.exe -s -i -X PATCH "https://tripwise-lime.vercel.app/api/itinerary/b1d51194-3c2e-4cf5-8c23-6261884256b9" -H 'x-visitor-id: 33cc2705-c0ec-4005-a77a-8d80e42e1708' -H 'content-type: application/json' --data-raw '{"day":2}'
```

Result: Updated: Madras High Court Museum; day: 2

Response:

```json
{
  "item": {
    "id": "b1d51194-3c2e-4cf5-8c23-6261884256b9",
    "visitor_id": "33cc2705-c0ec-4005-a77a-8d80e42e1708",
    "place_id": "51f86d64725712544059aa2c5787142c2a40f00102f90170bdce41000000009203184d6164726173204869676820436f757274204d757365756d",
    "name": "Madras High Court Museum",
    "address": "Madras High Court Museum, North Fort Road, Zone 5 Royapuram, Chennai - 600009, Tamil Nadu, India",
    "category": "museums",
    "latitude": 13.0860973,
    "longitude": 80.2865932,
    "created_at": "2026-10-18T12:33:52.552431+00:00",
    "day": 2,
    "city": "Chennai",
    "state": "Tamil Nadu",
    "country": "India"
  }
}
```

### 48. GET — HTTP 200

```powershell
curl.exe -s -i -X GET "https://tripwise-lime.vercel.app/api/itinerary" -H 'x-visitor-id: 33cc2705-c0ec-4005-a77a-8d80e42e1708' -H 'content-type: application/json'
```

Result: 1 saved items

### 49. PATCH — HTTP 200

```powershell
curl.exe -s -i -X PATCH "https://tripwise-lime.vercel.app/api/itinerary/b1d51194-3c2e-4cf5-8c23-6261884256b9" -H 'x-visitor-id: 33cc2705-c0ec-4005-a77a-8d80e42e1708' -H 'content-type: application/json' --data-raw '{"day":2}'
```

Result: Updated: Madras High Court Museum; day: 2

Response:

```json
{
  "item": {
    "id": "b1d51194-3c2e-4cf5-8c23-6261884256b9",
    "visitor_id": "33cc2705-c0ec-4005-a77a-8d80e42e1708",
    "place_id": "51f86d64725712544059aa2c5787142c2a40f00102f90170bdce41000000009203184d6164726173204869676820436f757274204d757365756d",
    "name": "Madras High Court Museum",
    "address": "Madras High Court Museum, North Fort Road, Zone 5 Royapuram, Chennai - 600009, Tamil Nadu, India",
    "category": "museums",
    "latitude": 13.0860973,
    "longitude": 80.2865932,
    "created_at": "2026-10-18T12:33:52.552431+00:00",
    "day": 2,
    "city": "Chennai",
    "state": "Tamil Nadu",
    "country": "India"
  }
}
```

### 50. GET — HTTP 200

```powershell
curl.exe -s -i -X GET "https://tripwise-lime.vercel.app/api/itinerary" -H 'x-visitor-id: 33cc2705-c0ec-4005-a77a-8d80e42e1708' -H 'content-type: application/json'
```

Result: 1 saved items

### 51. PATCH — HTTP 200

```powershell
curl.exe -s -i -X PATCH "https://tripwise-lime.vercel.app/api/itinerary/b1d51194-3c2e-4cf5-8c23-6261884256b9" -H 'x-visitor-id: 33cc2705-c0ec-4005-a77a-8d80e42e1708' -H 'content-type: application/json' --data-raw '{"day":null}'
```

Result: Updated: Madras High Court Museum; day: Unplanned

Response:

```json
{
  "item": {
    "id": "b1d51194-3c2e-4cf5-8c23-6261884256b9",
    "visitor_id": "33cc2705-c0ec-4005-a77a-8d80e42e1708",
    "place_id": "51f86d64725712544059aa2c5787142c2a40f00102f90170bdce41000000009203184d6164726173204869676820436f757274204d757365756d",
    "name": "Madras High Court Museum",
    "address": "Madras High Court Museum, North Fort Road, Zone 5 Royapuram, Chennai - 600009, Tamil Nadu, India",
    "category": "museums",
    "latitude": 13.0860973,
    "longitude": 80.2865932,
    "created_at": "2026-10-18T12:33:52.552431+00:00",
    "day": null,
    "city": "Chennai",
    "state": "Tamil Nadu",
    "country": "India"
  }
}
```

### 52. PATCH — HTTP 200

```powershell
curl.exe -s -i -X PATCH "https://tripwise-lime.vercel.app/api/itinerary/b1d51194-3c2e-4cf5-8c23-6261884256b9" -H 'x-visitor-id: 33cc2705-c0ec-4005-a77a-8d80e42e1708' -H 'content-type: application/json' --data-raw '{"day":1}'
```

Result: Updated: Madras High Court Museum; day: 1

Response:

```json
{
  "item": {
    "id": "b1d51194-3c2e-4cf5-8c23-6261884256b9",
    "visitor_id": "33cc2705-c0ec-4005-a77a-8d80e42e1708",
    "place_id": "51f86d64725712544059aa2c5787142c2a40f00102f90170bdce41000000009203184d6164726173204869676820436f757274204d757365756d",
    "name": "Madras High Court Museum",
    "address": "Madras High Court Museum, North Fort Road, Zone 5 Royapuram, Chennai - 600009, Tamil Nadu, India",
    "category": "museums",
    "latitude": 13.0860973,
    "longitude": 80.2865932,
    "created_at": "2026-10-18T12:33:52.552431+00:00",
    "day": 1,
    "city": "Chennai",
    "state": "Tamil Nadu",
    "country": "India"
  }
}
```

### 53. PATCH — HTTP 200

```powershell
curl.exe -s -i -X PATCH "https://tripwise-lime.vercel.app/api/itinerary/b1d51194-3c2e-4cf5-8c23-6261884256b9" -H 'x-visitor-id: 33cc2705-c0ec-4005-a77a-8d80e42e1708' -H 'content-type: application/json' --data-raw '{"day":""}'
```

Result: Updated: Madras High Court Museum; day: Unplanned

Response:

```json
{
  "item": {
    "id": "b1d51194-3c2e-4cf5-8c23-6261884256b9",
    "visitor_id": "33cc2705-c0ec-4005-a77a-8d80e42e1708",
    "place_id": "51f86d64725712544059aa2c5787142c2a40f00102f90170bdce41000000009203184d6164726173204869676820436f757274204d757365756d",
    "name": "Madras High Court Museum",
    "address": "Madras High Court Museum, North Fort Road, Zone 5 Royapuram, Chennai - 600009, Tamil Nadu, India",
    "category": "museums",
    "latitude": 13.0860973,
    "longitude": 80.2865932,
    "created_at": "2026-10-18T12:33:52.552431+00:00",
    "day": null,
    "city": "Chennai",
    "state": "Tamil Nadu",
    "country": "India"
  }
}
```

### 54. GET — HTTP 200

```powershell
curl.exe -s -i -X GET "https://tripwise-lime.vercel.app/api/itinerary" -H 'x-visitor-id: 33cc2705-c0ec-4005-a77a-8d80e42e1708' -H 'content-type: application/json'
```

Result: 1 saved items

### 55. GET — HTTP 200

```powershell
curl.exe -s -i -X GET "https://tripwise-lime.vercel.app/api/itinerary" -H 'x-visitor-id: f68e6235-a537-4857-9cf7-d3b61701dec0' -H 'content-type: application/json'
```

Result: 1 saved items

### 56. DELETE — HTTP 200

```powershell
curl.exe -s -i -X DELETE "https://tripwise-lime.vercel.app/api/itinerary/b1d51194-3c2e-4cf5-8c23-6261884256b9" -H 'x-visitor-id: 33cc2705-c0ec-4005-a77a-8d80e42e1708' -H 'content-type: application/json'
```

Result: Removed test item: b1d51194-3c2e-4cf5-8c23-6261884256b9

### 57. DELETE — HTTP 404

```powershell
curl.exe -s -i -X DELETE "https://tripwise-lime.vercel.app/api/itinerary/b1d51194-3c2e-4cf5-8c23-6261884256b9" -H 'x-visitor-id: 33cc2705-c0ec-4005-a77a-8d80e42e1708' -H 'content-type: application/json'
```

Result: ITEM_NOT_FOUND: This place is not in your trip.

### 58. GET — HTTP 200

```powershell
curl.exe -s -i -X GET "https://tripwise-lime.vercel.app/api/itinerary" -H 'x-visitor-id: 33cc2705-c0ec-4005-a77a-8d80e42e1708' -H 'content-type: application/json'
```

Result: 0 saved items

### 59. DELETE — HTTP 200

```powershell
curl.exe -s -i -X DELETE "https://tripwise-lime.vercel.app/api/itinerary/8fb4a720-59e3-4a44-8495-0a9ad21d2890" -H 'x-visitor-id: f68e6235-a537-4857-9cf7-d3b61701dec0' -H 'content-type: application/json'
```

Result: Removed test item: 8fb4a720-59e3-4a44-8495-0a9ad21d2890
