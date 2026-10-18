# Explore retro restyle - Step 2 (18 October 2026)

Local production preview: http://127.0.0.1:3046

Presentation:
- Georgia Where to next? heading with the unchanged template BackgroundArt.
- Stamp navigation and actual reusable three-stripe dividers under the header and in the footer.
- Cream/navy search fields, selected navy tabs, orange Search with darker navy text for contrast.
- One wrapping flex layout for search fields, tabs and result controls; no device-specific control layout.
- Courier filters, result count, category rows, dropdowns and removable chips. Native input, checkbox, combobox and tab behavior retained.
- Cream ticket cards with compact navy borders and hard shadows, Georgia names, Courier addresses/badges and dashed action separators. Whole-card stretched links unchanged.
- Nine distinct category tints use presentation CSS keyed by existing category labels. Category catalog, matching, request parameters and icons unchanged.
- Paper skeletons, ticket empty state, stamp Retry and ticket toasts. Footer keeps credits/links.

Contrast:
- Nine category text/background pairs: 5.77:1 through 9.26:1.
- Orange Search background #E8702A uses darker navy #122B46: 4.65:1. Original template navy on orange was 3.75:1 for small text.
- Navy on cream 11.26:1. All sampled small body/control text exceeds 4.5:1. Full numerical report: contrast.json.

Verification:
- Lint and production webpack build, including TypeScript: PASS.
- Existing search, categories and Explore session suites: PASS.
- Source invariant: undoing only Explore's wrapper and heading changes reproduces the previous file exactly. All expressions, handlers, effects, state, saved settings, API requests and restored-search code unchanged.
- No changes to src/lib, src/app/api, location-search.tsx, search-combobox.tsx or category-filter.tsx. Badge adds presentation class/data attribute only; navigation/footer add decorative stripes and style classes only.
- All 59 real API checks: PASS (search, Details, add/persist, duplicates/isolation, day updates/clearing and removal). Only disposable test rows removed. api-tests.md.
- Real browser at 390x844: selected India, Tamil Nadu and Chennai through suggestions, searched, selected Museums and Parks, changed distance to 10km and sort to Name Z to A; 100 results. Native menu can be closed with Escape before interacting with controls below it.
- Whole-card heading click opened Details. Back to Explore restored identical ordered 100 place URLs, Country/State/City, category chips, 10km and Name Z to A.
- Removed category/sort chips, switched tabs using ArrowRight, searched Eiffel Tower. Existing museum filter correctly produced the styled empty result; Clear all recovered the two worldwide matches. Name mode hid distance controls. Selected Name Z to A, opened Details and used browser Back: identical query, two ordered place URLs and sort restored. Refresh preserved them too.
- No horizontal overflow at 390 viewport (375px content/scroll) or 320 (305px content/scroll), including the open category menu. All ten category rows remain at least 44px tall. Viewport reset requested afterward.
- Existing local fixture at port 3047 verified service error/toast, Retry, paper skeleton loading and recovery, then empty results. Fixture rendering inspected at desktop width 1265. No fixture API request reaches Supabase/Geoapify.
- Final real browser warning/error logs: empty. Fixture deliberately returns HTTP 500 for its error check.
- Screenshots: phone-cards.png, narrow-320.png, phone-hero-320.png, loading.png, empty.png, error-toast.png.

The 1440px viewport request did not resize the already-bound native tab; actual DOM measurements are recorded above. No 1440px result is claimed.

No dependencies, push or deployment. Shared navigation/footer/toast styles also appear on other routes; Details/My Trip content styling and all behavior remain unchanged in this step.
