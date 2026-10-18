# Destination Details retro restyle - Step 3

18 October 2026. Local preview: http://127.0.0.1:3048 (open a place from Explore).

Changed presentation:
- Cream detail ticket with 1.5px navy border, 6px corners and a hard 2px navy shadow.
- Georgia title; Courier address, category badge, metadata labels and displayed coordinates.
- Dashed metadata/action dividers, wrapping card/sidebar layout and orange Add to Trip with darker navy text.
- Back to Explore keeps the same href and scroll=false, with a template-style orange stub, navy border and hard shadow.
- Weather retains its existing component, data fetch, loading, retry, icons and forecast formatting; scoped CSS gives it a boarding-pass panel with orange edge, paper fill and dashed forecast sections.
- Existing missing hours/phone/website fallbacks remain in source but their rows have data-empty display markers. Missing address/coordinates are similarly hidden; zero coordinates remain valid. No parsing/data transformation was added.
- Existing category CSS now also scopes to Destination so its badge uses the same palette as Explore. No category catalog or icon changes.

Validation:
- npm run lint and npm run build -- --webpack, including TypeScript: PASS.
- Weather, client-errors and Explore session suites: PASS. Weather tests include missing/invalid/zero coordinates, forecast parsing, requests, failure and cancellation.
- Source comparison after line-ending normalization: Destination imports, state, effects, all reads/save function and every event-handler attribute exactly match the prior commit. Weather component, Explore component, src/app/api and src/lib have no diff.
- All 59 real API integration checks PASS, including search/sorts, Details, add/persist, duplicates/isolation, day changes/clearing and removal. Own disposable records cleaned up. api-tests.md.
- Real browser searched Eiffel Tower and opened Paris Details (Tour Eiffel). Address, hours, website, map link, numeric coordinates, current weather and three forecast days rendered. Missing phone row computed display:none and was absent from the accessible page.
- Add to Trip saved the disposable place while staying on Details; saved button became disabled. Refresh retained saved state. Back to Explore restored the exact search text and two ordered place URLs.
- Opened the saved trip, moved the item to Day 1, refreshed and confirmed day=1, then removed only that disposable item. Refresh confirmed empty trip.
- Details and long-name fixture have no horizontal overflow: 390px viewport content/scroll 375/375; 320px 305/305. After viewport reset real page content/scroll 475/475.
- Local-only fixture omits hours/phone/website. All three rows computed display:none while coordinates and weather remained. Long title/address wrap at 320px.
- Local-only eight-second save: Saving disabled button and aria-disabled trip link; forcing an actual click on the link kept the Details URL unchanged. Completion restored normal link/saved feedback.
- Local fixture service errors showed Details and saved-status Retry; both recovered after fixture returned to ready. No fixture API calls reach Geoapify or Supabase. Weather continues to use its unchanged public provider.
- Final real page browser warning/error log empty. Source/docs/browser-bundle secret scan and whitespace checks PASS.

Screenshots: phone-details.png, weather.png, narrow-320.png, missing-fields.png, slow-save.png, error.png, add-panel.png.

Data code and handlers unchanged. No dependencies, push or deployment.
