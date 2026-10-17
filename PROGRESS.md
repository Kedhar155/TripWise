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
3. City search, category filter, name/distance sort, place details, My Trip, random localStorage visitor ID, loading/empty/error feedback, and persistence checks.
4. Phone and desktop testing, final polish, documentation. Optional weather only if time permits.
5. GitHub push and Vercel deployment only after explicit approval.

Run, test, fix, update this file, and commit at the end of every phase. Ask before deleting files or installing outside this project.
