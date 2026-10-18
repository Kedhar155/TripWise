# Retro UI browser checks - 18 October 2026

Final production preview: http://127.0.0.1:3043

- Real name search Eiffel Tower returned two matches; Paris result opened Tour Eiffel Details.
- Details showed address, opening hours, website, map link and live weather with three forecast days.
- Add to Trip showed saving feedback and then saved state without navigating away.
- My Trip showed the disposable saved place and France / Ile-de-France / Paris summary.
- Dropdown moved the place to Day 1; summary became one planned day / zero unplanned.
- Keyboard drag with focused handle, Space, Up, Space moved it to Unplanned. Refresh retained the assignment, place and location summary.
- Important automation detail: use keys on the current focus while dragging. Refocusing the handle between keys scrolls back to its original section and changes collision targeting.
- Removed only this walkthrough's disposable saved place; refreshed and confirmed empty-trip heading and hidden summary.
- Returning to Explore restored the Eiffel Tower search and both results.
- Explore and My Trip measured 475px content width / 475px scroll width (no horizontal overflow). This is a browser viewport check, not a physical-device test.
- Final browser warning/error logs: empty. An earlier preview was invalidated by a concurrent rebuild; the final walkthrough used a fresh production server after the build completed.
- Screenshots: retro-explore.png and retro-trip.png.

Build/lint and all 59 real API checks pass for the final build. Isolated search, Explore session, keyboard drag and trip summary suites pass. No API, database, data helper, state, settings or event-handler files changed. Only existing application file changed: src/app/globals.css.
