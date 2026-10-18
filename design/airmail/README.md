# Selected Orange Airmail

The chosen design combines the original Orange Airmail cream stock and orange strip with the latest preview's deep teal bottom and brown/ochre metadata panels. Every place category shares the treatment. Existing icons and category names remain.

The only runtime file changed in this step is `src/app/colorful-tickets.css`. Details retains its orange Add to Trip action in the separate right panel (below on phones), and stamp-style Back to Explore above the main card. No component, state, handler, request, database, saved setting, sensor or dependency edits.

## Verification

- ESLint and production webpack build / TypeScript: PASS.
- Existing Explore session, whole-card activation/independent-control, keyboard section coordinates and trip summary suites: PASS.
- Real API integration: 59 HTTP checks PASS; disposable records cleaned up. See [api-tests.md](api-tests.md).
- Browser: Paris location search 100 results; Eiffel Tower name search two results with different categories but identical card colors. Sort, Sights filter/removal, Details and Back restoration pass. Add, dropdown to Day 1, refresh persistence, keyboard whole-card drag to Unplanned, Remove and refresh-empty pass. Only the walkthrough's place removed.
- No horizontal overflow in recorded phone/tablet/desktop Explore/Details checks and populated My Trip phone checks. Initial resizing samples were collected before the viewport settled; later settled samples and screenshots confirm phone layouts. See [browser-checks.json](browser-checks.json).
- Actual opening-hours/website/coordinate panels use #F4E5C6 fill and #65451F labels. Missing phone remains hidden. Desktop Back is above the card and Add panel is to its right; on narrow screens the aside moves below as before.
- Source audit: current components byte-for-byte unchanged from previous commit. Protected API/lib/database/original scripts/dependencies match main. Earlier explicitly requested whole-card activation is audited separately; no further interaction changes. Exact art SVG/keyframes retained. See [source-audit.json](source-audit.json).
- Source/evidence/browser-bundle and Git secret scans: PASS. Local .env.local is ignored, untracked and absent from history; no secrets recorded in reports.
- Browser warning/error log empty. Temporary viewport reset. Physical touch long-press and a new pointer-drag walkthrough were not exercised; activation guards are covered by focused tests and component code is unchanged.

## Screenshots

- [Explore desktop](explore.png)
- [Explore phone](explore-phone.png)
- [Explore tablet](explore-tablet.png)
- [Matching Details and preserved action positions](details.png)
- [Saved ticket phone](trip-phone.png)

Preview: http://127.0.0.1:3055. Branch retro-ui. No merge, push or deployment.
