# TripWise — API test evidence

Run: 17/10/2026, 14:38:19 IST.
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
| 23 | DELETE /api/itinerary/31b1057c-f5f4-447f-8f56-cb57493f8dfb | 404 | 404 | PASS | ITEM_NOT_FOUND: This place is not in your trip. |
| 24 | POST /api/itinerary | 201 | 201 | PASS | Saved: Madras High Court Museum |
| 25 | DELETE /api/itinerary/31b1057c-f5f4-447f-8f56-cb57493f8dfb | 200 | 200 | PASS | Removed test item: 31b1057c-f5f4-447f-8f56-cb57493f8dfb |
| 26 | DELETE /api/itinerary/31b1057c-f5f4-447f-8f56-cb57493f8dfb | 404 | 404 | PASS | ITEM_NOT_FOUND: This place is not in your trip. |
| 27 | GET /api/itinerary | 200 | 200 | PASS | 0 saved items |
| 28 | DELETE /api/itinerary/14f2e4f3-c5d9-41a7-885e-df7f83d16529 | 200 | 200 | PASS | Removed test item: 14f2e4f3-c5d9-41a7-885e-df7f83d16529 |

Additional assertions: nonempty Chennai museum search; name and distance order; stable detail ID; saved item present in a new GET request; duplicate rejected; second visitor initially empty; same place allowed for separate visitors; another visitor cannot remove the first visitor's item; empty list after removal; no-store on every response.

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

Result: INVALID_CATEGORY: Choose a supported place category.

### 4. GET — HTTP 400

```powershell
curl.exe -s -i -X GET "https://tripwise-lime.vercel.app/api/places?city=Chennai&sort=invalid"
```

Result: INVALID_SORT: Sort must be name or distance.

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
curl.exe -s -i -X POST "https://tripwise-lime.vercel.app/api/itinerary" -H 'x-visitor-id: a5d75a3e-abd4-4ae5-8ccb-445aa97a80ac' -H 'content-type: application/json' --data-raw '{broken'
```

Result: INVALID_BODY: A valid JSON object is required.

### 9. POST — HTTP 400

```powershell
curl.exe -s -i -X POST "https://tripwise-lime.vercel.app/api/itinerary" -H 'x-visitor-id: a5d75a3e-abd4-4ae5-8ccb-445aa97a80ac' -H 'content-type: application/json' --data-raw '[]'
```

Result: INVALID_BODY: A valid JSON object is required.

### 10. POST — HTTP 400

```powershell
curl.exe -s -i -X POST "https://tripwise-lime.vercel.app/api/itinerary" -H 'x-visitor-id: a5d75a3e-abd4-4ae5-8ccb-445aa97a80ac' -H 'content-type: application/json' --data-raw '{"place_id":"xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"}'
```

Result: INVALID_BODY: The request body is too large.

### 11. POST — HTTP 400

```powershell
curl.exe -s -i -X POST "https://tripwise-lime.vercel.app/api/itinerary" -H 'x-visitor-id: a5d75a3e-abd4-4ae5-8ccb-445aa97a80ac' -H 'content-type: application/json' --data-raw '{"place_id":"bad!"}'
```

Result: INVALID_PLACE_ID: A valid place ID is required.

### 12. DELETE — HTTP 400

```powershell
curl.exe -s -i -X DELETE "https://tripwise-lime.vercel.app/api/itinerary/not-a-uuid" -H 'x-visitor-id: a5d75a3e-abd4-4ae5-8ccb-445aa97a80ac' -H 'content-type: application/json'
```

Result: INVALID_ID: A valid trip item ID is required.

### 13. GET — HTTP 200

```powershell
curl.exe -s -i -X GET "https://tripwise-lime.vercel.app/api/itinerary" -H 'x-visitor-id: a5d75a3e-abd4-4ae5-8ccb-445aa97a80ac' -H 'content-type: application/json'
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
curl.exe -s -i -X POST "https://tripwise-lime.vercel.app/api/itinerary" -H 'x-visitor-id: a5d75a3e-abd4-4ae5-8ccb-445aa97a80ac' -H 'content-type: application/json' --data-raw '{"place_id":"51f86d64725712544059aa2c5787142c2a40f00102f90170bdce41000000009203184d6164726173204869676820436f757274204d757365756d"}'
```

Result: Saved: Madras High Court Museum

### 20. POST — HTTP 409

```powershell
curl.exe -s -i -X POST "https://tripwise-lime.vercel.app/api/itinerary" -H 'x-visitor-id: a5d75a3e-abd4-4ae5-8ccb-445aa97a80ac' -H 'content-type: application/json' --data-raw '{"place_id":"51f86d64725712544059aa2c5787142c2a40f00102f90170bdce41000000009203184d6164726173204869676820436f757274204d757365756d"}'
```

Result: ALREADY_SAVED: This place is already in My Trip.

### 21. GET — HTTP 200

```powershell
curl.exe -s -i -X GET "https://tripwise-lime.vercel.app/api/itinerary" -H 'x-visitor-id: a5d75a3e-abd4-4ae5-8ccb-445aa97a80ac' -H 'content-type: application/json'
```

Result: 1 saved items

### 22. GET — HTTP 200

```powershell
curl.exe -s -i -X GET "https://tripwise-lime.vercel.app/api/itinerary" -H 'x-visitor-id: e6e94bc5-392d-404b-8bd6-af04171dda33' -H 'content-type: application/json'
```

Result: 0 saved items

### 23. DELETE — HTTP 404

```powershell
curl.exe -s -i -X DELETE "https://tripwise-lime.vercel.app/api/itinerary/31b1057c-f5f4-447f-8f56-cb57493f8dfb" -H 'x-visitor-id: e6e94bc5-392d-404b-8bd6-af04171dda33' -H 'content-type: application/json'
```

Result: ITEM_NOT_FOUND: This place is not in your trip.

### 24. POST — HTTP 201

```powershell
curl.exe -s -i -X POST "https://tripwise-lime.vercel.app/api/itinerary" -H 'x-visitor-id: e6e94bc5-392d-404b-8bd6-af04171dda33' -H 'content-type: application/json' --data-raw '{"place_id":"51f86d64725712544059aa2c5787142c2a40f00102f90170bdce41000000009203184d6164726173204869676820436f757274204d757365756d"}'
```

Result: Saved: Madras High Court Museum

### 25. DELETE — HTTP 200

```powershell
curl.exe -s -i -X DELETE "https://tripwise-lime.vercel.app/api/itinerary/31b1057c-f5f4-447f-8f56-cb57493f8dfb" -H 'x-visitor-id: a5d75a3e-abd4-4ae5-8ccb-445aa97a80ac' -H 'content-type: application/json'
```

Result: Removed test item: 31b1057c-f5f4-447f-8f56-cb57493f8dfb

### 26. DELETE — HTTP 404

```powershell
curl.exe -s -i -X DELETE "https://tripwise-lime.vercel.app/api/itinerary/31b1057c-f5f4-447f-8f56-cb57493f8dfb" -H 'x-visitor-id: a5d75a3e-abd4-4ae5-8ccb-445aa97a80ac' -H 'content-type: application/json'
```

Result: ITEM_NOT_FOUND: This place is not in your trip.

### 27. GET — HTTP 200

```powershell
curl.exe -s -i -X GET "https://tripwise-lime.vercel.app/api/itinerary" -H 'x-visitor-id: a5d75a3e-abd4-4ae5-8ccb-445aa97a80ac' -H 'content-type: application/json'
```

Result: 0 saved items

### 28. DELETE — HTTP 200

```powershell
curl.exe -s -i -X DELETE "https://tripwise-lime.vercel.app/api/itinerary/14f2e4f3-c5d9-41a7-885e-df7f83d16529" -H 'x-visitor-id: e6e94bc5-392d-404b-8bd6-af04171dda33' -H 'content-type: application/json'
```

Result: Removed test item: 14f2e4f3-c5d9-41a7-885e-df7f83d16529
