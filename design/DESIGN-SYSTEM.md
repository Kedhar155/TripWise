# Retro design system

Preview: /design-system (local production preview http://127.0.0.1:3045/design-system).

The seven palette variables live in src/app/globals.css. Named Tailwind utilities include bg-paper, bg-card, text-navy, bg-orange, bg-teal, text-earth and bg-stamp. Standard shadcn semantic colors (primary, secondary, destructive, card, popover, muted, accent, border, input, ring and foreground variants) resolve to these variables in src/app/design-system.css. The primary action is orange, secondary is teal, and destructive is stamp red. No font files or downloads.

| Primitive | Class |
| --- | --- |
| Card with offset shadow, hover lift and pressed state | retro-card |
| Orange main action | retro-button |
| Teal secondary action | retro-button retro-button-secondary |
| Navy outline neutral action | retro-button retro-button-neutral |
| Stamp danger/remove action | retro-button retro-button-danger |
| Text input | retro-input |
| Native dropdown | retro-dropdown |
| Chip | retro-chip (aria-pressed=true for selected) |
| Badge | retro-badge |
| Small label / navigation | retro-label / retro-nav |
| Three stripes | retro-stripes containing three decorative spans |

Georgia is available through font-serif and font-sans; Courier New through font-mono. The primitive classes apply these families directly. Native labels, keyboard focus, disabled states and form semantics remain available. New primitives are opt-in; existing pages are not migrated in this step.

BackgroundArt is a visual-only client component (useId provides unique SVG reference IDs). Place it in a positioned hero with isolation and clipping; put content above it. For new frames use retro-art-host and retro-art-content. Explore already supplies the positioned hero and uses the component once. Its old static compass/route pseudo-elements are suppressed to prevent duplicate artwork. The rest of the existing page presentation remains as it was before this step.

All SVG paths, opacity/stroke values, sizes, positions and animation keyframes/timings are copied from the supplied template; only React attribute spelling, selector scoping, and unique reference IDs differ. The original 600px breakpoint is preserved. The clipping wrapper adds no input targets: aria-hidden=true, pointer-events:none on all artwork, overflow:hidden. Default animation is exactly compass-rotate 30s linear infinite and globe-meridian 15s linear infinite with -5s/-10s delays. Preview frame height is independent of artwork geometry.

Verification, 18 October 2026:
- Production webpack build including TypeScript and lint PASS.
- Compared both complete animation keyframe blocks against template: identical. Compared SVG geometry, transformation and color attributes: identical.
- Browser computed all seven swatches match their template hex values; Georgia body/input and Courier button/badge; primary/secondary/destructive semantic mapping confirmed.
- Browser computed 30s compass, 15s meridians, -5s/-10s offsets, desktop 84%/26% compass coordinates. Screenshots at different times show rotation progressing.
- All artwork descendants ignore pointer events. Wrapper clips overflow. Explore has exactly one art component and no old hero pseudo-element. Preview/Explore 1265px document and scroll widths match.
- Preview input and native dropdown accept changes. Explore Paris chip initiates real search.
- All 59 real API regression checks PASS: search, Details, add, persistent day changes and removal. Disposable test rows cleaned up; report design/design-system-api-tests.md.
- Explore session and keyboard drag isolated suites PASS.
- Screenshots: design-system-art.png and design-system-styles.png.

No API/database/state/handler changes, dependencies, push or deployment.
