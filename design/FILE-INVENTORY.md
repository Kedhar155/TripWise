# Pre-redesign file inventory

All tracked project files are listed below. Generated/ignored node_modules, .next, .git, .vercel and private environment files are excluded; never edit or commit credentials. Documentation/evidence updates and the requested design copy are authorized exceptions. Mixed UI/logic components are protected in full.

## Styling and layout files (allowed to change)

- src/app/globals.css
- src/app/layout.tsx
- src/app/loading.tsx
- src/components/feedback.tsx
- src/components/footer.tsx
- src/components/place-skeletons.tsx
- src/components/ui/card.tsx

## Logic files and protected support files (not allowed to change)

- .env.example
- .gitignore
- .vercelignore
- AGENTS.md
- API_TESTS.md
- PROGRESS.md
- README.md
- components.json
- docs/API.md
- docs/extras/feature-1-api-tests.md
- docs/extras/feature-1-saved-trip.png
- docs/extras/feature-2-api-tests.md
- docs/extras/feature-2-desktop.png
- docs/extras/feature-2-phone.png
- docs/extras/feature-3-add-toast.png
- docs/extras/feature-3-api-tests.md
- docs/extras/feature-3-explore-skeleton.png
- docs/extras/feature-3-phone-footer.png
- docs/extras/feature-3-trip-skeleton.png
- docs/extras/feature-4-api-tests.md
- docs/extras/feature-4-weather-desktop.png
- docs/extras/feature-4-weather-phone.png
- docs/extras/feature-5-api-tests.md
- docs/extras/feature-5-failed-move.png
- docs/extras/feature-5-phone.png
- docs/extras/feature-5-planned-desktop.png
- docs/extras/feature-5-sql.png
- docs/extras/feature-6-api-tests.md
- docs/extras/feature-6-summary-desktop.png
- docs/extras/feature-6-summary-phone.png
- docs/extras/final-api-tests.md
- docs/extras/final-details-weather.png
- docs/extras/final-empty-trip-phone.png
- docs/extras/final-planned-trip.png
- docs/extras/final-search.png
- docs/extras/release-live-api-tests.md
- docs/extras/release-live-phone.png
- docs/extras/release-live-site.png
- docs/extras/release-live-trip.png
- docs/extras/release-live-weather.png
- docs/extras/release-local-api-tests.md
- docs/extras/release-local-trip.png
- docs/extras/release-local-weather.png
- docs/phase-d/phone.jpg
- docs/phase-e/API_TESTS.md
- docs/phase-e/live-site.png
- docs/phase-e/phone.png
- docs/phase-e/saved-trip.png
- docs/polish/change-1-api-tests.md
- docs/polish/change-1-browser-checks.json
- docs/polish/change-2-api-tests.md
- docs/polish/change-2-browser-checks.json
- docs/polish/change-2-desktop.jpg
- docs/polish/change-2-mobile.jpg
- docs/polish/change-3-api-tests.md
- docs/polish/change-3-browser-checks.json
- docs/polish/change-3-keyboard.jpg
- docs/polish/change-3-mobile.jpg
- docs/polish/change-4-api-tests.md
- docs/polish/change-4-browser-checks.json
- docs/polish/change-4-desktop.jpg
- docs/polish/change-4-phone.jpg
- docs/polish/change-5-api-tests.md
- docs/polish/change-5-browser-checks.json
- docs/polish/change-5-state-api-tests.json
- docs/polish/change-6-api-tests.md
- docs/polish/change-6-browser-checks.json
- docs/polish/change-6-location-api-tests.json
- docs/polish/change-6-summary.jpg
- docs/polish/change-6-supabase.jpg
- docs/polish/change-7-api-tests.md
- docs/polish/change-7-browser-checks.json
- docs/polish/change-7-highlight.jpg
- docs/polish/change-7-phone.jpg
- docs/polish/final/README.md
- docs/polish/final/api-summary.json
- docs/polish/final/browser-checks.json
- docs/polish/final/category-api-tests.json
- docs/polish/final/general-api-tests.md
- docs/polish/final/location-api-tests.json
- docs/polish/final/name-api-tests.md
- docs/polish/final/phone-rollback.jpg
- docs/polish/final/phone-summary.jpg
- docs/polish/final/sort-api-tests.json
- docs/polish/final/state-api-tests.json
- docs/polish/live/api-tests.md
- docs/polish/live/browser-checks.json
- docs/polish/live/browser-secret-scan.json
- docs/polish/live/live-details.jpg
- docs/polish/live/live-explore.jpg
- docs/polish/live/live-trip.jpg
- docs/polish/live/release-checks.json
- docs/polish/live/vercel-before.jpg
- docs/polish/live/vercel-env.jpg
- docs/polish/live/vercel-ready.jpg
- docs/screenshots/database-ready.png
- docs/screenshots/phase-c-explore.png
- docs/search-rework/category-samples.json
- docs/search-rework/category-search-tests.json
- docs/search-rework/change-1-api-tests.md
- docs/search-rework/change-1-desktop.png
- docs/search-rework/change-1-phone.png
- docs/search-rework/change-2-api-tests.md
- docs/search-rework/change-2-browser-requests.jsonl
- docs/search-rework/change-2-city-phone.png
- docs/search-rework/change-2-desktop.png
- docs/search-rework/change-2-regression-tests.md
- docs/search-rework/change-3-browser-sorts.json
- docs/search-rework/change-3-desktop.png
- docs/search-rework/change-3-phone.png
- docs/search-rework/change-3-regression-tests.md
- docs/search-rework/change-3-sort-filter-tests.json
- docs/search-rework/change-4-desktop.png
- docs/search-rework/change-4-layout-checks.json
- docs/search-rework/change-4-location-phone.png
- docs/search-rework/change-4-phone.png
- docs/search-rework/change-4-regression-tests.md
- docs/search-rework/final-browser-checks.json
- docs/search-rework/final-category-tests.json
- docs/search-rework/final-phone.png
- docs/search-rework/final-regression-tests.md
- docs/search-rework/final-save-wait.png
- docs/search-rework/final-search-tests.md
- docs/search-rework/final-sort-filter-tests.json
- docs/search-rework/final-trip-phone.png
- docs/search-rework/live-browser-checks.json
- docs/search-rework/live-browser-secret-scan.json
- docs/search-rework/live-category-tests.json
- docs/search-rework/live-phone-explore.png
- docs/search-rework/live-phone-trip.png
- docs/search-rework/live-regression-tests.md
- docs/search-rework/live-release-checks.json
- docs/search-rework/live-search-tests.md
- docs/search-rework/live-sort-filter-tests.json
- docs/search-rework/name-service-probe.json
- eslint.config.mjs
- next-env.d.ts
- package-lock.json
- package.json
- postcss.config.mjs
- scripts/build-country-list.mjs
- scripts/check-git-secrets.mjs
- scripts/check-live-secrets.mjs
- scripts/check-secret-leaks.mjs
- scripts/check-services.mjs
- scripts/preview-states.mjs
- scripts/preview-trip-locations.mjs
- scripts/probe-city-search.mjs
- scripts/probe-distance-filter.mjs
- scripts/probe-name-search.mjs
- scripts/sample-categories.mjs
- scripts/test-api.mjs
- scripts/test-categories.mjs
- scripts/test-category-search.mjs
- scripts/test-client-errors.mjs
- scripts/test-errors.mjs
- scripts/test-explore-session.mjs
- scripts/test-itinerary-location-api.mjs
- scripts/test-itinerary-location.mjs
- scripts/test-place-sorting.mjs
- scripts/test-polish-api.mjs
- scripts/test-search-api.mjs
- scripts/test-search.mjs
- scripts/test-sort-filters-api.mjs
- scripts/test-state-search-api.mjs
- scripts/test-state-search.mjs
- scripts/test-trip-drag.mjs
- scripts/test-trip-summary.mjs
- scripts/test-visitor.mjs
- scripts/test-weather.mjs
- src/app/api/cities/route.ts
- src/app/api/itinerary/[id]/route.ts
- src/app/api/itinerary/route.ts
- src/app/api/places/[id]/route.ts
- src/app/api/places/route.ts
- src/app/api/places/search/route.ts
- src/app/api/states/route.ts
- src/app/error.tsx
- src/app/page.tsx
- src/app/places/[id]/page.tsx
- src/app/trip/page.tsx
- src/components/category-badge.tsx
- src/components/category-filter.tsx
- src/components/destination.tsx
- src/components/error-feedback.tsx
- src/components/explore.tsx
- src/components/location-search.tsx
- src/components/navigation.tsx
- src/components/search-combobox.tsx
- src/components/trip-drag.tsx
- src/components/trip-summary.tsx
- src/components/trip.tsx
- src/components/ui/sonner.tsx
- src/components/weather-box.tsx
- src/lib/api.ts
- src/lib/categories.ts
- src/lib/category-style.ts
- src/lib/city-suggestions.ts
- src/lib/client-api.ts
- src/lib/countries.ts
- src/lib/explore-session.ts
- src/lib/geoapify.ts
- src/lib/place-sorting.ts
- src/lib/supabase.ts
- src/lib/trip-days.ts
- src/lib/trip-summary.ts
- src/lib/types.ts
- src/lib/utils.ts
- src/lib/visitor.ts
- src/lib/weather.ts
- supabase/migrations/001_itinerary.sql
- supabase/migrations/002_itinerary_day.sql
- supabase/migrations/003_itinerary_location.sql
- tsconfig.json

## Files added by the authorized redesign
Styling/assets: public/retro/compass.svg, public/retro/globe.svg, public/retro/stamp.svg. Each is decorative SVG extracted from the supplied template.
Design/reference and documentation: design/tripwise_retro_airline_template.html, this inventory, baseline-api-tests.md, retro-api-tests.md, browser-checks.md and screenshots. PROGRESS.md is the requested running log.
Only src/app/globals.css is changed in the existing application source.

## Requested design-system Step 1 additions
- Allowed presentation files: src/app/design-system.css, src/app/background-art.css, src/components/background-art.tsx, src/app/design-system/page.tsx.
- Explicitly requested Explore art integration: two additive presentation lines in src/components/explore.tsx (import and component placement); all existing business logic remains protected and unchanged.
- Documentation/evidence: design/DESIGN-SYSTEM.md, design/design-system-api-tests.md, design/design-system-art.png, design/design-system-styles.png, PROGRESS.md.

## Requested Explore Step 2 presentation scope
- Added src/app/explore.css; globals.css imports it.
- Explicit presentation-only edits allowed by Step 2: Explore wrapper/heading; CategoryBadge class/data label; navigation/footer stripe markup and classes. No business logic changes.
- Protected catalog/category matching and all API, lib, location, combobox, filter/state/handler code remain unchanged. Evidence: design/explore-step2/.

## Requested Destination Step 3 presentation scope
- Allowed new stylesheet: src/app/destination.css (imported by globals.css).
- Explicit Destination presentation-only edits: style classes, decorative Back stub, coordinate display, empty-row markers. Data reads, save logic, state/effects and all handlers remain unchanged.
- explore.css only shares its category palette selectors with Destination. WeatherBox, API/data/helper source remains protected and unchanged.
- Documentation/evidence: design/details-step3/ and PROGRESS.md.

## Requested My Trip Step 4 presentation scope
- Added src/app/trip.css and its globals.css import. Category CSS scope in explore.css also includes My Trip.
- Explicit looks-only markup: Trip root style class and a span around the existing summary city text. Removing those markers reproduces the previous components exactly.
- trip-drag.tsx, day/summary helpers, event handlers, API/database code and persistence logic remain protected and unchanged.
- Documentation/evidence: design/trip-step4/ and PROGRESS.md.

## Final verification scope
- Styling fix: src/app/destination.css enlarges the existing View My Trip link tap area only.
- Documentation/evidence: design/final/ contains the main diff stat, source/artwork/secret audit, existing-suite runner, API/unit reports, browser measurements and screenshots. PROGRESS.md records the final results.
- All previously protected runtime logic remains unchanged from main.

## Requested visual refinements
- Styling: src/app/retro-refinements.css and its globals.css import.
- Presentation markup: Explore hero in src/components/explore.tsx; existing decorative BackgroundArt moves to a page-wide layer in src/app/layout.tsx. No state, handlers, requests or SVG/animation changes.
- Documentation/evidence: design/refinements/ and PROGRESS.md. Existing protected logic remains unchanged.

## Colorful tickets and explicitly requested whole-card dragging
- Styling/layout: src/app/colorful-tickets.css, globals.css import, Explore sort-group/label markup.
- Explicit user-authorized interaction exception: src/components/trip-drag.tsx moves listeners/activation to the card, guards controls, removes the grip and aligns numbering; src/components/trip.tsx adds delayed touch activation and updates instructions. Existing day/drop/keyboard coordinates, API requests and save/remove behavior remain protected and unchanged.
- Documentation/tests/evidence: design/ticket-update/ and PROGRESS.md. APIs, lib, database, dependencies and original scripts remain unchanged.

## Selected Orange Airmail
- Styling/layout only: src/app/colorful-tickets.css replaces category-based ticket colors with shared cream/orange/teal stock, and matching Details with brown metadata panels.
- No component, handler, drag sensor, API, data or settings changes in this step. Add/Back style and layout rules remain unchanged.
- Documentation/evidence: design/airmail/ and PROGRESS.md. The earlier explicitly authorized whole-card dragging exception remains confined to the previous commit.

## Textured & Shaded Retro Airline
- Styling/layout only: src/app/colorful-tickets.css applies the specified paper texture, gradient stitched spine, badge/pin presentation, shaded footer, and matching Details with a teal Add action.
- No component/content/props/handlers/API/data changes. Brown metadata and Back/Add positioning retained. Existing pin remains decorative.
- Documentation/verification/screenshots: design/textured-airline/ and PROGRESS.md.

## Explicitly requested Any distance default
- Authorized behavior exception: only the defaultWithin constant in src/lib/place-sorting.ts changes from 5 to null. Existing saved choices, fetching, APIs, database and component handlers stay unchanged.
- Verification: scripts/test-explore-session.mjs adds fresh-default/omitted-query/saved-5-km assertions; design/any-distance/ holds API report and browser screenshot. PROGRESS.md records results.

## Textured Boarding-Pass Stub sidebar
- Styling/layout: src/app/sidebar-pass.css and globals.css import; colorful-tickets.css removes superseded teal sidebar action rules.
- Presentation wrappers only: src/components/destination.tsx adds header/body/bookmark/footer containers. All state, handlers, requests and link guards remain exactly unchanged; main card/Back/brown metadata untouched.
- Evidence/source comparison/API report/screenshots: design/sidebar-pass/ and PROGRESS.md.
