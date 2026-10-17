# TripWise progress

Project: AWS Student Builder Group, VIT Chennai
Track: Full-Stack
Deadline: 18 October 2026

## Phase 1 - Foundation (17 October 2026)
Completed:
- Verified Node.js v24.21.0, npm 11.19.0, and Git 2.55.0.
- Created Next.js App Router and TypeScript project in D:\Projects\TripWise.
- Added Tailwind CSS, shadcn/ui configuration and base card component, and Supabase client dependency.
- Built a white-and-teal welcome page with responsive layout rules.
- Created private .env.local with blank settings and a safe .env.example template.
- Confirmed Git ignores .env.local.
- Initialized Git. No remote, push, deployment, or file deletion performed.

Validation:
- npm run lint: PASS after fixing home navigation and configuration warning.
- npm run typecheck: PASS.
- npm run build: PASS with normal process permissions (sandbox blocked the CSS worker).
- Production preview running at http://127.0.0.1:3002; browser confirmed headings, cards, and footer; desktop screenshot inspected.
- Mobile layout uses responsive classes; actual mobile viewport testing remains for the functional UI phase.
- npm audit reports five high-severity development dependency findings, all through braces -> micromatch -> fast-glob -> Next ESLint plugin. Suggested automated fix downgrades the Next ESLint config to v14; not applied because it mismatches Next v16. Review a compatible upstream fix before final delivery.

## Phase 2 - Database and API (17 October 2026)
Completed:
- User confirmed keys are ready. Checked only presence and service statuses; no secret values printed.
- Verified Geoapify city lookup and Supabase access.
- Created public.itinerary in the connected TripWise project, with all requested columns, unique visitor/place constraint, coordinate checks, and visitor/date index.
- Enabled row-level security and restricted direct browser table access. All itinerary queries use the server key and visitor ID.
- Implemented GET /api/places, GET /api/places/[id], GET/POST /api/itinerary, DELETE /api/itinerary/[id].
- Added input checks, bounded JSON bodies, request timeouts, no-store responses, safe 400/404/409/500 errors, and API documentation.
- Search supports city boundaries, six category options, and name/distance sorting for up to 100 results. Distances are meters from city center.
- Fixed a real Geoapify mismatch: details may return a different centroid-encoded ID; the requested search ID stays stable.

Validation:
- Production build, lint, and TypeScript checks: PASS.
- Live integration checks: PASS for invalid inputs, empty itinerary, Chennai museums, both sorts, unknown city/place, detail lookup, save/load persistence, duplicate 409, two-visitor isolation, cross-visitor delete 404, removal, and missing item 404.
- Error checks: PASS for 400/404/409/500 mapping and removal of unexpected private error details.
- Test records were removed using only their random test visitor IDs and row IDs; no user records or files deleted.
- Local production preview: http://127.0.0.1:3003.
- Frontend integration and phone testing remain phase 3/4. No push or deployment performed.

## Remaining phases (one at a time)
3. Completed in Phase C below: city search, category filter, name/distance sort, place details, My Trip, random localStorage visitor ID, loading/empty/error feedback, and persistence checks.
4. Phone and desktop testing, final polish, documentation. Optional weather only if time permits.
5. GitHub push and Vercel deployment only after explicit approval.

Run, test, fix, update this file, and commit at the end of every phase. Ask before deleting files or installing outside this project.

## Phase A - Existing foundation rechecked (17 October 2026)
- Read prior progress first; preserved completed foundation and API work.
- Confirmed Next.js, TypeScript, Tailwind, shadcn/ui setup, and Supabase dependency already exist.
- Confirmed src/lib/supabase.ts is server-only and reads private environment settings.
- Read the existing Supabase itinerary table successfully (HTTP 200, exact row count 0).
- Local preview at http://127.0.0.1:3003 returned HTTP 200 with TripWise content.
- Itinerary route returned HTTP 200 with an empty items list using its required visitor header; missing header returned the expected 400.
- Lint, TypeScript checks, and saved-secret scan passed; .env.local is ignored by Git.
- Existing production build was reused; no application code or dependencies changed.
- Exact schema remains in supabase/migrations/001_itinerary.sql. Supabase location: project > SQL Editor > New query > paste schema > Run. Already applied; no repeat is needed.
- No files or database records deleted, no push, and no deployment. Phase A complete; later UI work remains separate.

## Phase B - API verification and submission evidence (17 October 2026)
- Read progress first and reviewed all five existing endpoints against the installed Next.js route guide. No endpoint rewrite was needed.
- Reused the running production preview at http://127.0.0.1:3003; homepage returned HTTP 200 with TripWise content.
- Re-ran real Geoapify and Supabase integration checks: all 28 HTTP requests passed, including Chennai museums (16 results), name/distance order, place details, add, fresh list, duplicate 409, visitor isolation, removal, and invalid/missing input 400/404.
- Added an invalid deletion-ID check and automatic API_TESTS.md generation with actual commands, response summaries, expected/actual statuses, and repeat instructions.
- Separate error checks passed for 400/404/409/500 formatting and private-error redaction. The 500 check is isolated, not a forced live-service outage.
- Lint and TypeScript checks passed. Existing production build reused because application code did not change.
- Extended the secret scan to include API_TESTS.md and PROGRESS.md; .env.local remains ignored.
- Removed only temporary database rows created by the requested removal tests; no files deleted. No push or deployment.
- Phase B complete. Browser localStorage, functional screens, and phone testing remain in the later UI phase.

## Phase C - Explore, destination details, and saved trips (17 October 2026)

Completed:
- Replaced the foundation placeholder with Explore: city search, six category choices, name/distance sorting, and responsive place cards.
- Added /places/[id] with address, available hours/contact/website, map link, Add to Trip, saved feedback, and a My Trip link.
- Added /trip with database-backed saved places, removal, loading/retry feedback, and an empty-trip message.
- Added a random UUID saved as tripwise.visitor-id in localStorage and sent in the existing visitor header. Invalid stored IDs are repaired; blocked storage shows a helpful message.
- Kept the white/teal design, shared navigation, visible keyboard focus, labeled fields, screen-reader status messages, and Geoapify/OpenStreetMap attribution.
- Reused the finished APIs and database. No new dependencies or optional weather added.

Validation:
- Lint and TypeScript checks: PASS. Initial production build passed. A later Turbopack rebuild hit a CSS-worker process error, including outside the sandbox; final production build PASS with the supported `npm run build -- --webpack` fallback. Use that command if the local Turbopack worker error recurs.
- Browser flow against real services: Chennai museums returned 16 places; distance order and A–Z order verified; opened Amma Museum and saved it; navigated to My Trip and refreshed; saved item remained; removed that test item and refreshed; empty trip remained.
- Unknown city showed the clear city-not-found error; a subsequent Chennai search recovered successfully. Loading messages observed during search, details, and trip reads.
- Desktop saved-trip layout visually inspected. At 390px viewport, Explore, destination details, and empty My Trip layouts visually inspected; details had no horizontal overflow (375px content/client width with scrollbar).
- node scripts/test-visitor.mjs: PASS for UUID format, repeated-visit persistence, separate storage, malformed ID repair, and blocked-storage feedback.
- Secret scan passed; .env.local remains ignored. No credentials printed or included in browser code.
- Preview: http://127.0.0.1:3005. The initial sandbox preview could not be reached; an approved preview outside the sandbox enabled browser testing.
- Only the place created for the requested add/remove test was removed. No files are removed in the final changes. No push or deployment performed.
- Phase C complete. Broader phone/desktop checks and final documentation remain Phase 4; GitHub/Vercel remain approval-gated.

## Phase D - Feedback and responsive polish (17 October 2026)

Completed:
- Added consistent, touch-friendly Retry buttons for search, details, trip reads, saved-status checks, and failed add/remove actions.
- Duplicate saves now explain that the place is already in My Trip and no duplicate was added. Failed removals keep the item visible; a 404 removal reconciles an already-removed item.
- Added shared route loading and unexpected-error fallbacks using this installed Next.js version's retry API.
- All client reads now have a 30-second timeout even when navigation cancellation is supplied; unreadable responses show a friendly message.
- Narrow navigation wraps cleanly, controls remain tappable, and long names/addresses stay within cards. No new product features or dependencies.

Validation:
- Final lint, production webpack build (including TypeScript), separate typecheck, client error tests, visitor tests, and secret scan: PASS.
- Browser checked Explore, details, and My Trip at requested widths 320, 768, and 1440; also real Chennai search at 390. No horizontal overflow in measured phone/detail/trip views. Long names and addresses wrap correctly.
- Local fixture proxy verified loading on all three pages, service errors with Retry on all three, empty search, empty trip, missing optional detail fields, search/details/saved-status recovery, failed save, duplicate 409 feedback, failed removal retaining the item, and successful removal Retry.
- Actual Geoapify search returned 16 Chennai museums on the phone preview. Screenshot: docs/phase-d/phone.jpg.
- Added scripts/preview-states.mjs for repeatable visual failure checks without contacting live services; change .next/qa-state.txt as documented in the script. This is a local QA tool, not an app route.
- Initial sandbox preview/build restrictions and a pre-existing development server prevented preview startup; final production preview runs at http://127.0.0.1:3006 with normal process permissions.
- Browser tests used simulated add/remove responses; no database records or files deleted. No push, deployment, or outside-project installation performed. Keys remain ignored in .env.local.
- Phase D complete. GitHub push and deployment remain approval-gated.
