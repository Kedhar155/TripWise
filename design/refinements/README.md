# Requested UI refinements

Local preview: http://127.0.0.1:3055. Branch: `retro-ui`. No merge, push or deployment.

- Explore cards use warm parchment bodies, navy category bands, darker navy names/addresses, and a contrasting dashed ticket stub. Saved-place tickets share the warmer paper and stronger type.
- Details uses parchment, bold navy titles, inset metadata tickets, and pale teal trip/weather panels. Empty fields, buttons and all data behavior are unchanged.
- Hero has a stamp-style kicker, large Georgia title with an earth-colored italic accent, three stripes and a small edition label.
- The same BackgroundArt component now lives in a page-wide decorative layer behind the navigation and hero on Explore. The compass starts 12px from the top (14px on phones), so its upper end is not clipped by the old hero boundary. Globe moves to the left page edge; stamp sits at the right page edge, farther down. The layer is clipped horizontally and cannot receive pointer input.
- SVG geometry, compass rotation and globe meridians are unchanged: 30s linear compass; 15s linear meridians with -5/-10/0s offsets. Positions intentionally supersede the earlier exact-template placement check, as requested in this follow-up. Original copied CSS rules and animation blocks remain intact; scoped rules supply the revised page positions.
- Success toasts retain the ticket appearance with a 32px light-green seal (`#bce7bd`) around the existing check icon. No toast logic or duration changes.

## Validation

- Final ESLint and production webpack build, including TypeScript: PASS.
- Existing Explore-session, keyboard-drag and trip-summary isolated suites: PASS.
- All 59 existing real-service API integration checks on the final production build: PASS. [Report](api-tests.md). Disposable API records cleaned up.
- Source audit: API routes, `src/lib`, database, original scripts, dependencies, location selectors, category filter, weather, drag implementation, and all existing component call/handler expressions unchanged from main. [Audit](source-audit.json).
- Browser: Eiffel Tower name search (two matches), sort, Details/weather, Back and refresh retain query/sort/ordered results. Paris location search returns 100 results. Add stays on Details; Day 1 persists after refresh, move to Unplanned, Remove and refresh-empty pass. Only the walkthrough's disposable saved places removed.
- Actual Add toast measured with the light-green background and dark-green check; screenshot saved during its five-second display. The screenshot catches its entrance transition. [Success toast](success-toast.png).
- Explore and Details tested at 320/390/768/1280px; populated My Trip at 320/390/768px. Document and client widths match throughout. Header click-through succeeds at all four widths with navigation in view. Art pointer events remain disabled, original animation durations observed and transforms change over time. [Measurements](browser-checks.json).
- New title/address contrast: 8.85:1 / 8.58:1. All sampled new text pairs exceed 4.5:1. [Contrast](contrast.json).
- Final browser warning/error log empty. Viewport reset. Source/evidence/browser-bundle and Git secret scans passed; `.env.local` remains ignored.

Visual evidence: [hero](hero.png), [cards](cards.png), [Details](details.png), [phone hero](phone-hero.png), [phone Details](phone-details.png).

Presentation code only: `src/app/retro-refinements.css`, its global import, hero markup in `src/components/explore.tsx`, and the decorative component placement in `src/app/layout.tsx`. The template and BackgroundArt SVG/animation sources are untouched. Development preview initially required normal permissions to be reachable from the browser; production build also ran with normal permissions, as before.
