# TODO — The Marquee

Follow-up ideas pulled from `idea.md`'s "Tweakable props" and design-fidelity notes.
Nothing here is required — `site/index.html` already ships as a complete, high-fidelity build.

## Settings / configurability

- [ ] Expose `timerSeconds` (8–45s, default 20) as an in-game setting instead of a hardcoded constant.
- [ ] Expose `questionsPerRun` (5–20, default 10) as an in-game setting.
- [ ] Add a `showFacts` toggle to hide/show the "Intermission fact" panel on reveal.
- [ ] Add a `lightsAnimated` toggle to disable the chasing-bulb animation (perf / motion-sensitivity option).

## Content

- [x] Grow the `BANKS` question pool beyond the current ~58 questions (more emoji plots, quotes, facts, hilo pairs). — done: the `text-mode-expansion` branch added 14 new text-based quiz modes plus a Budget metric, spanning 6 categories (Classics, Knowledge, Connection, Fun Facts, Series-Specific, Cross-over; 19 mode/category pairs total) and ~150+ new question items.
- [ ] Consider a difficulty tag on questions, mirroring Acronym Quiz's difficulty-select pattern.

## Reimplementation reference

- [ ] If ever rebuilt in a framework, treat `source/The Marquee Quiz.dc.html` + `support.js` as the design reference and reproduce pixel-perfectly per the fidelity note in `idea.md`.

## Housekeeping

- [ ] No GitHub issues exist yet for this repo — decide whether future ideas above become issues or stay in this TODO.
