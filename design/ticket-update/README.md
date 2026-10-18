# Colorful tickets, right-aligned sort and whole-card dragging

Local preview: http://127.0.0.1:3055. Branch: `retro-ui`. No merge, push or deployment.

- Place tickets now use category-based teal, orange and cool-blue stock, with matching tinted stubs. Existing category badges/icons remain. Titles are larger; address text is 14px, weight 600, in deep navy `#102a43`. New body/stub text contrast is 10.39–13.07:1. Map-pin icon contrast meets the 3:1 non-text requirement. [Contrast](contrast.json).
- Sort By is visibly labeled and aligned with the right edge of the result controls. Filters and the count stay together; the sort group wraps to the next row on phones. Sort options, state and handlers are unchanged.
- TripWise is 38px on the tested desktop viewport, 30px on phone/tablet, with a 32px compass logo. Logo and navigation centers align exactly at desktop width.
- Removed the six-dot handle. The saved card is now the drag activator, and its number sits on the same baseline as the place name. Links still open Details on a normal click; dragging the name moves the card. Day menus, labels and Remove buttons cannot start a drag.
- This is the explicitly requested exception to the earlier frozen-drag-file rule: `trip-drag.tsx` changes the activation surface, its guards, accessibility role, and number markup. `trip.tsx` adds a delayed touch sensor and updates the user instructions. Existing pointer activation distance, keyboard section coordinates, drop targets, day validation, requests, optimistic updates/rollback and focus-return IDs are retained. Touch uses a 250ms hold with 8px tolerance, while the card allows normal vertical scrolling before activation.

## Validation

- Final ESLint and production webpack build including TypeScript: PASS.
- Existing keyboard-drag, trip-summary and Explore-session suites: PASS. Added focused [drag-surface checks](test-drag-surface.mjs) for activation refs, mouse/pen/touch guards, independent controls, nested keyboard events, disabled state, and number/title markup: PASS.
- All 59 real-service API integration checks against the final build: PASS. [Report](api-tests.md). Disposable API records cleaned up.
- Source audit confirms APIs, `src/lib`, database, original scripts and dependencies unchanged from main. Component calls/handlers match after normalizing only the explicitly added touch sensor; original keyboard coordinates, day targets, day-menu and Remove handlers remain unchanged. [Audit](source-audit.json).
- Development browser: two disposable saved places show aligned 01/02 numbers and distinct orange/teal tickets. Drag from address → Day 1, drag from title → Unplanned, refresh persistence, keyboard pickup/arrows/drop, focus return, Escape cancellation, ordinary title click, day dropdown and Remove all pass. Both disposable rows removed and refresh confirms empty trip.
- Final production browser: Paris location search returns 100 results; Eiffel Tower name search returns two. Sort, Details/Add, Back restoring the exact query/sort/ordered IDs, whole-card pointer drag to Day 1, refresh persistence, accessible group pickup/cancel, dropdown return to Unplanned, Remove and refresh-empty pass. Only this run's disposable saved place removed.
- Explore and populated My Trip tested at widths 320/390/768/1280: no horizontal overflow. Sort's right-edge gap is effectively zero at all sizes; all three ticket stock colors render in production. Header logo/nav center difference is zero at desktop width. [Measurements](browser-checks.json).
- Browser tests used mouse and keyboard at phone-sized viewports. Physical-device long-press touch was not exercised; touch guards are covered by the focused test. Final browser warning/error log empty; temporary viewport override reset.
- Source/evidence/browser-bundle and Git-object secret scans pass. Local `.env.local` remains ignored and absent from tracked files/history.

Screenshots: [Explore colors and sort](explore-cards.png), [phone sort](phone-sort.png), [My Trip alignment](trip-cards.png), [phone trip](phone-trip.png), [larger logo](logo-hero.png).
