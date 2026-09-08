<!-- parable:beautified -->
<div align="center">

<h1>Ledger & Vine</h1>

<p><strong>Boutique winery club — layered vineyard parallax + pour animations.</strong></p>

<p>
  <a href="https://bswxyz.github.io/ledger-and-vine/"><img alt="Live demo" src="https://img.shields.io/badge/demo-live-8b5cf6?style=flat-square&labelColor=1a1a1a"></a>
  <img alt="Family" src="https://img.shields.io/badge/family-Parable-ec4899?style=flat-square&labelColor=1a1a1a">
  <img alt="Stack" src="https://img.shields.io/badge/stack-HTML%2FJS-f5a623?style=flat-square&labelColor=1a1a1a">
  <a href="LICENSE"><img alt="MIT License" src="https://img.shields.io/badge/license-MIT-22c55e?style=flat-square&labelColor=1a1a1a"></a>
</p>

<p>
  <a href="https://bswxyz.github.io/ledger-and-vine/"><b>Live demo</b></a>
  &nbsp;·&nbsp;
  <a href="https://bswxyz.github.io/ledger-and-vine/guide/">Build notes</a>
  &nbsp;·&nbsp;
  <a href="https://parable-three.vercel.app/templates">More templates</a>
</p>

<a href="https://bswxyz.github.io/ledger-and-vine/">
  <img src=".github/preview.jpg" alt="Ledger & Vine — live preview" width="100%">
</a>

</div>

**Use this template** — copy the source into a new project:

```bash
npx degit bswxyz/ledger-and-vine my-app
```



A boutique estate winery & wine club — cinematic layered-parallax vineyard hero and an SVG "pour"
animation on the club tiers. Part of the [Parable 25 design showcase](https://parable-three.vercel.app).

---

## Concept

Ledger & Vine is a small fictional estate (est. 1962, eighteen dry-farmed hectares) that sells
restraint: four wines, three quarterly club allocations, a tasting room with short hours. The brand
conceit is the founder's green account book — wines are named *The Ledger*, *Marginalia*, *Double
Entry* and *Carried Forward*, lot numbers and pH read like ledger entries, and sections are ruled
off with double hairlines like an account page. The site's job is to make scarcity feel like
luxury, not absence: unhurried motion, terse copy, one photograph.

Interaction patterns were grounded in Mobbin research on shipped products: Blue Apron Wine's
spec-sheet product pages, Patreon/MasterClass emphasized-middle pricing rows, and OpenTable's
party/date/time-slot booking grammar (see `_research/ledger-and-vine.md` in the parent project).

## Design system

- **Palette (old-world burgundy):** `--bg:#2a0a14` burgundy-black · `--panel:#3a0f1d` ·
  `--ink:#f3e9dd` cream · `--dim:#c9a9a2` · `--faint:#8a6a63` · `--gold:#c9a24b` (+ `--gold-2:#e0be6f`
  for hover/large numerals) · `--wine:#7c1f38` (the pour) · `--line:rgba(243,233,221,.12)`.
  Gold is reserved for display type and accents; body text is always cream on burgundy (≈13:1).
- **Type:** `Cormorant Garamond` (elegant serif display — its *italic* is the "script" accent,
  no actual script face) · `Inter` (body/UI) · `DM Mono` (lot numbers, vintages, pH/ABV data,
  kickers). Google Fonts.
- **Signature ease:** `cubic-bezier(.5,.02,.16,1)` — "the decant": slow into the curve, stately
  settle. Pours take 2s; hero lines take 1.4s. Nothing hurries.
- **Signature motion:** (1) a six-layer hero parallax — photograph, gold light-ray wash, scrim,
  far-hill SVG silhouette, near vine-row SVG silhouette, wordmark — each scrubbed at a different
  rate by GSAP ScrollTrigger; (2) the club tiers' wine glasses pour themselves on scroll-in
  (a clipped SVG rect scaling to `var(--fill)`), and re-pour on hover. Fill level encodes
  bottles-per-quarter.

## Stack

- **Plain HTML / CSS / vanilla JS** — no framework, no build step.
- **[GSAP 3.12 + ScrollTrigger](https://gsap.com/)** (CDN, deferred) — used only for the hero
  parallax scrub. Reveals, counters, pours and the booking chips are IntersectionObserver +
  CSS transitions.
- **Inline SVG** for everything that isn't the one photograph: hill/vine-row silhouettes,
  bottle silhouettes, wine glasses.
- Chosen because the two signature effects are one scrubbed tween and one CSS transform —
  a framework would be freight on a page this quiet.

## Running locally

No install. Any static server works because all paths are relative:

```bash
git clone https://github.com/bswxyz/ledger-and-vine
cd ledger-and-vine
python3 -m http.server 8000      # or: npx serve .
# open http://localhost:8000
```

Nothing to build — edit `index.html` / `styles.css` / `main.js` and refresh.

## Structure

```
index.html          the page — hero, wines, club, estate, visit, footer
styles.css          all styling; design tokens live in :root at the top
main.js             parallax scrub, pours, reveals, counters, booking chips
assets/hero.jpg     the single generated photograph (1376×768, ~440 KB)
guide/index.html    "how this was built" write-up, styled to the site
.nojekyll           tells GitHub Pages to serve files as-is
```

Design tokens: `styles.css` `:root`. Pour levels: the `--fill` custom property on each
`.tier` card in `index.html`. Parallax rates: the `scrub()` calls at the top of `main.js`.

## Demo vs. real

This is an intentionally-scoped design showcase. What's **fictional or mocked**:

- **The estate, the wines and the numbers are invented.** There is no Alder Valley appellation,
  no lots, no barrels; tasting notes, pH and ABV values are plausible fabrications.
- **The hero photograph is AI-generated** — it is not a real vineyard.
- **No commerce.** "Join the club" scrolls to the tiers; there is no checkout, subscription
  billing, inventory, or age verification (which alcohol e-commerce legally requires).
- **No club backend.** Tiers have no accounts, allocation management, pause/skip flows,
  or shipping-state compliance (a real US wine club needs per-state licensing).
- **The booking card reserves nothing.** It's an interactive teaser of the OpenTable-style
  pattern; the CTA explicitly says no table was reserved. A real version needs availability,
  a reservations backend (or Tock/OpenTable embed), and confirmation email/SMS.

What's **real** and reusable as-is: the layered-parallax hero technique, the CSS-custom-property
pour animation, the chip-group selection UI, the full responsive / reduced-motion / keyboard /
no-JS layer, and the entire visual system.

## License

[MIT](LICENSE). Design & build by **Parable**. The vineyard photograph is
AI-generated. Drink responsibly; this page can't check your ID.
