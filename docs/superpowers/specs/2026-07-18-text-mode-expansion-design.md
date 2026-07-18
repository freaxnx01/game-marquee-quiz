# The Marquee — Text-Mode Expansion (Design)

## Background

The user requested a large roster of new game modes (~30 across Visual, Audio,
Knowledge, Connection, Format/Pace, Fun Facts, Series-Specific, and Cross-over
categories). That list spans several independent pieces of work:

1. **Text-based content modes** — fit the existing architecture, no new infra.
2. **Format/pace mechanics** (Survival, Speed Round, Daily Challenge) — cross-cutting
   run rules layered on top of modes; deferred to a follow-up design.
3. **Media pipeline** (Frame Freeze, Poster Blur, Spot the Actor, Name That Score,
   Voice Match) — needs royalty-free/public-domain image & audio sourcing and new
   asset-loading UI; deferred to a follow-up design.
4. **Head-to-Head** — implies realtime/async multiplayer; dropped (no backend in
   this static-site architecture).

This spec covers **piece 1 only**: the text-based content modes, chosen to go first
because it ships the most promised variety fastest with zero new infrastructure.

## Current architecture (recap)

`index.html` is a single self-contained React-style component (`support.js`-driven
DC build). Key pieces:

- `MODES` — array of `{id, name, glyph, tag}` shown as lobby cards.
- `BANKS` — object keyed by mode id, each an array of question-source items built
  via small factory functions: `C(prompt, answer, wrongs, fact)` for generic
  choice questions, `M(...)` for movie/series, `S(...)` for stat pairs, `H(metric,
  A, B, fact)` for higher-or-lower pairs.
- A `buildQuestion(id, item)` function maps a bank item to a renderable question of
  `kind: 'choice' | 'hilo' | 'mos'`. The generic `choice` kind already handles
  "prompt + N shuffled options, 1 correct" — this covers **every** new mode in this
  spec, including 2-option (true/false-style) ones. **No new question kind or
  rendering code is needed.**
- `buildQueue('mix')` pools every bank together for Marquee Mix.
- Lobby is a flat grid of mode cards today (5 cards).

## Scope: new modes (this spec)

All 14 modes below are wired identically: add an id to the `tags` map (display name
+ sub-label), add a `MODES`-equivalent entry (see Lobby Restructuring), and author a
`BANKS[id]` array using the existing `C()` builder (or `H()` for the Higher/Lower
budget metric). No new interaction code.

| Category | Mode id | Display name | Question shape (via `C()`) |
|---|---|---|---|
| Knowledge | `multichoice` | Multiple Choice Classic | prompt = cast/director/year trivia question; answer + 3 wrongs |
| Knowledge | `truefalse` | True or False | prompt = a claim; answer `'True'` or `'False'`, wrong = the other |
| Connection | `sixdegrees` | Six Degrees | prompt names two actors; answer = the connecting actor/title; wrongs = plausible non-connectors |
| Connection | `oddoneout` | Odd One Out | prompt = "which one doesn't belong?"; answer = the outlier; wrongs = the other 3 related items |
| Connection | `castconnect` | Cast Connect | prompt names 3 cast members; answer = the title; wrongs = other titles |
| Fun Facts | `factfiction` | Fact or Fiction | prompt = a claim about a title; answer `'Fact'` or `'Fiction'` |
| Fun Facts | `behindscenes` | Behind the Scenes | prompt = production/casting trivia; answer + 3 wrongs |
| Series-Specific | `showintro` | Name the Show from the Intro | prompt = intro/theme description; answer = show; wrongs = other shows |
| Series-Specific | `whichseason` | Which Season? | prompt = a plot beat (text, no stills); answer = season label; wrongs = other seasons |
| Series-Specific | `episodetitle` | Episode Title Match | prompt = an episode title; answer = the show; wrongs = other shows |
| Series-Specific | `characterarc` | Character Arc | prompt describes a character's journey; answer = the show; wrongs = other shows |
| Series-Specific | `gueststar` | Spot the Guest Star | prompt names a show + episode context; answer = the actual guest actor; wrongs = plausible other actors |
| Cross-over | `adaptmatch` | Adaptation Match | prompt names a movie/show; answer = its book/reboot/spin-off; wrongs = unrelated titles |
| Cross-over | `sameactor` | Same Actor, Different Screen | prompt names a film role + a TV role; answer = the actor who played both; wrongs = other actors |

Existing `hilo` bank additionally gets a `Budget` metric alongside its current
rating/box-office/runtime metrics (same `H()` shape, just a new `m` value).

Existing modes (`emoji`, `quote`, `fact`, `hilo`, `mos`) are untouched except for
the `hilo` budget-metric addition above — no code or content changes otherwise
required by this spec.

## Content volume

Each new bank gets **~12 authored questions**, matching the size of today's banks
and comfortably covering the default 10-question run with variety across replays.
Total: ~14 banks × ~12 items ≈ **168 new question items**, authored during
implementation directly in `BANKS`.

## Lobby restructuring

Today's lobby is a flat mode-card grid. With 19 total modes, it becomes a
**category layer**:

- Lobby shows: the Marquee Mix ticket button (unchanged, full-width, now pooling
  every bank including new ones), followed by a grid of **category tiles** reusing
  the existing mode-card visual style (glyph, name, tagline).
- Categories: **Classics** (the original 5: Emoji Plot, Quote Quiz, Fun Fact
  Feature, Higher or Lower, Movie or Series?), **Knowledge**, **Connection**, **Fun
  Facts**, **Series-Specific**, **Cross-over**.
- Tapping a category tile navigates to a new `category` screen: the same mode-card
  grid layout as today, scoped to that category's modes, plus a back action to
  return to the lobby.
- This adds exactly one new value to the existing `screen` state machine
  (`lobby` → `category` → `play` → `results`); no new persistence schema — the
  `records` object stays keyed by `modeId` exactly as today, so house-best
  tracking works unmodified for every new mode.

## Out of scope (deferred, separate specs)

- Format/pace mechanics: Survival, Speed Round, Daily Challenge.
- Media pipeline modes: Frame Freeze, Poster Blur, Spot the Actor, Name That
  Score, Voice Match.
- New interaction types needed by modes not in this spec: Release Year
  (numeric/closest-wins), Trivia Ladder (progressive multi-hint reveal), Binge
  Order (sequencing/ranking), Did You Know? Bonus Cards (unscored interstitial).
- Head-to-Head (dropped — no backend in this architecture).

## Testing

Manual verification in-browser (this is a static single-file game, no test
harness exists today):

- Each new mode playable end-to-end: lobby → category → mode → 10 questions →
  results, with correct/wrong/timeout states all reachable.
- Marquee Mix pulls from new banks (spot-check a few runs surface new modes'
  content).
- House-best persistence (`localStorage['marquee-quiz-records']`) still keyed and
  updated correctly per new `modeId`.
- Category navigation: back-to-lobby works from every category; lobby still
  renders correctly with the new tile grid.
