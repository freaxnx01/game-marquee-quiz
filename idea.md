# Handoff: The Marquee — Movies & Series Quiz

A retro-cinema browser quiz game. This package contains everything needed to **publish it on GitHub Pages via Claude Code**, plus a full design spec if you'd rather reimplement it in a framework.

## Quickest path: publish as-is

`site/index.html` is a **fully self-contained build** (all JS, fonts, and styles inlined — no network dependencies, no build step). It runs as a static file.

Claude Code instructions:

```bash
# from this folder
gh repo create marquee-quiz --public --source=./site --push   # or:
cd site
git init && git add index.html && git commit -m "The Marquee quiz game"
gh repo create marquee-quiz --public --source=. --remote=origin --push
# enable GitHub Pages, serving from the main branch root:
gh api -X POST repos/{owner}/marquee-quiz/pages -f 'source[branch]=main' -f 'source[path]=/'
```

Game will be live at `https://<owner>.github.io/marquee-quiz/`. No CI, no framework needed. (Any static host — Netlify, Vercel, Cloudflare Pages — works identically.)

## About the design files

- `site/index.html` — production-ready standalone build. Ship this directly.
- `source/The Marquee Quiz.dc.html` + `source/support.js` — the original design-component source (an HTML template + a React-style logic class run by `support.js`). Open `The Marquee Quiz.dc.html` in a browser with `support.js` beside it to run the source version. Treat these as **design reference** if reimplementing; they are not a conventional framework codebase.

## Fidelity

**High-fidelity.** Colors, type, spacing, copy, and interactions are final. If reimplementing, recreate pixel-perfectly.

## Game rules (behavior spec)

- 6 ways to play: **Marquee Mix** (random pull from all banks) + 5 single modes: Emoji Plot, Quote Quiz, Fun Fact Feature, Higher or Lower, Movie or Series?.
- A run = 10 questions (configurable 5–20). Per question: 20s timer (configurable 8–45s).
- Scoring per correct answer: `100 + round(50 × timeLeft/timerTotal) + 25 × min(streak, 4)`. Wrong or timeout = 0 and resets streak. Streak badge shows at ×2+.
- Question kinds:
  - **choice** (emoji / quote / fact): prompt + 4 shuffled options, 1 correct.
  - **mos**: a title; fixed options Movie / Series / Both.
  - **hilo**: two titled cards + metric (IMDb rating / box office / runtime); pick the higher. Reveal shows both values.
- Reveal state: correct answer highlighted gold, wrong pick dark red, others dimmed; banner CORRECT! / NOT QUITE / TIME'S UP! with `+points`; explanation line; optional "Intermission fact" panel; NEXT REEL ▸ / SEE THE CREDITS ▸ button.
- Results screen: final score, rank by % correct (≥100% Studio Mogul, ≥80% A-List Critic, ≥60% Head Projectionist, ≥40% Matinee Regular, else Popcorn Rookie), correct count, best streak, house record, "★ NEW HOUSE RECORD ★" when beaten. Encore replays same mode; Full Programme returns to lobby.
- **Persistence**: per-mode best scores in `localStorage` key `marquee-quiz-records` (JSON object `{modeId: score}`).
- Content: ~58 questions embedded in the logic class (`BANKS` in the source file). All text-based by design — no images, no copyrighted media.

## Screens

1. **Lobby** — red-curtain header strip (repeating dark-red vertical stripes), marquee sign card (gold border, animated chasing bulb rows, "THE MARQUEE" in Limelight), "NOW SHOWING" divider, full-width ticket-shaped Marquee Mix button (dashed outline, notched sides via radial-gradients), auto-fit grid `minmax(190px, 1fr)` of 5 mode cards (glyph, name, tagline, dashed divider, house-best line).
2. **Play** — header row (mode tag, REEL n/N, streak pill, score), 8px timer bar (gold `#e9b950`, turns `#d24a33` below 28%), centered prompt area (emoji at 64px / quote in Limelight gold / fact with kicker), answer grid `minmax(200px, 1fr)`, hilo VS layout, reveal block (pop-in animation `popin .3s`).
3. **Results** — "THAT'S A WRAP" headline, score card with bulb row, rank pill, stat rows, gold ENCORE ▸ + outlined FULL PROGRAMME buttons.

## Design tokens

- Background `#150a09`; card gradients `#241013→#1a0c0e`, `#211014→#170b0d`; curtain `#571420`/`#3c0e15`.
- Gold accent `#e9b950`, bright gold `#ffd97a`, dark gold border `#8a6420`, text-on-gold `#241203`.
- Cream text `#f6e8c8` (dimmed via rgba .5–.85); error red bg `#4e1d16`, border `#a04a34`, text `#eec9bb`.
- Type: **Limelight** (display: headlines, titles, VS badge), **Libre Franklin** (everything else). Wide letter-spacing (.18–.42em) on uppercase labels, weights 600/800.
- Radii: cards 12–16px, buttons 8–10px, pills 99px. Shadows: `0 16px 44px rgba(0,0,0,.45)` cards, gold glow `0 0 70px rgba(255,217,122,.12)` on marquee sign.
- Motifs: chasing-bulb rows (repeating radial-gradient dots animated `background-position-x` 0→26px, .85s linear infinite), dashed `#8a6420` dividers, spotlight radial glow at page top.
- Hover states: `translateY(-2/-3px)` + border/outline brightens to gold, .15s ease.

## Tweakable props (source DC)

`timerSeconds` (8–45, default 20), `questionsPerRun` (5–20, default 10), `showFacts` (bool), `lightsAnimated` (bool). In a reimplementation these become settings/constants.

## Assets

None — no images or icons; glyphs are Unicode characters (✪ ✶ ❝ ✦ ⇅ ⧉). Fonts from Google Fonts (inlined in the build).
