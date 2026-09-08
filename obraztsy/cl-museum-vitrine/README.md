<!-- parable:beautified -->
<div align="center">

<h1>Vitrine</h1>

<p><strong>Museum exhibition microsite — works hung at parallax depth, navigated by a clickable floor plan.</strong></p>

<p>
  <a href="https://bswxyz.github.io/vitrine/"><img alt="Live demo" src="https://img.shields.io/badge/demo-live-8b5cf6?style=flat-square&labelColor=1a1a1a"></a>
  <img alt="Family" src="https://img.shields.io/badge/family-Parable-ec4899?style=flat-square&labelColor=1a1a1a">
  <img alt="Stack" src="https://img.shields.io/badge/stack-Astro-f5a623?style=flat-square&labelColor=1a1a1a">
  <a href="LICENSE"><img alt="MIT License" src="https://img.shields.io/badge/license-MIT-22c55e?style=flat-square&labelColor=1a1a1a"></a>
</p>

<p>
  <a href="https://bswxyz.github.io/vitrine/"><b>Live demo</b></a>
  &nbsp;·&nbsp;
  <a href="https://bswxyz.github.io/vitrine/guide/">Build notes</a>
  &nbsp;·&nbsp;
  <a href="https://parable-three.vercel.app/templates">More templates</a>
</p>

<a href="https://bswxyz.github.io/vitrine/">
  <img src=".github/preview.jpg" alt="Vitrine — live preview" width="100%">
</a>

</div>

**Use this template** — copy the source into a new project:

```bash
npx degit bswxyz/vitrine my-app
```


A museum exhibition microsite for a single temporary show: *The Blue Hour — European
abstraction between daylight and dark, 1959–1973*. Built for
[Parable](https://bswxyz.github.io/parable/), a curated showcase of individually-crafted
website templates.


## Concept

Museums solved this layout problem on real walls long ago: big type on the title wall, works
hung in a deliberate order, a floor plan by the door, a label beside every frame. Vitrine
borrows the whole system. The show is fiction — eleven invented painters converging on one
cobalt — but every convention is real: curatorial wall text, plaques with medium and lender,
room numerals, timed entry.

The signature is a pair:

1. **Gallery-wall parallax** — every framed work (all inline SVG) and each room's giant
   numeral carries a `data-depth`; on scroll they drift at different rates, like walking past
   a hung wall. Positions are measured from `offsetTop` chains so applied transforms never
   feed back into the next frame.
2. **A floor plan that is the navigation** — an SVG architectural plan whose rooms are real
   `<a>` anchors. Click a room to go to its wall; an `IntersectionObserver` band across the
   middle of the viewport reports the room you're in, and a visitor dot walks the plan to match.

## Design system

- **Palette** — light (default): gallery-white `#f5f3ee` on charcoal `#17161a`; dark flips them.
  Accent: exhibition cobalt `#3b4de0` (lifted to `#8b97ff` for text on dark). The paintings keep
  fixed pigment in both themes — the lighting changes, the paintings don't.
- **Type** — Playfair Display (display), Inter (body), Space Mono (labels, plaques, wayfinding).
- **Motion** — one named ease, `cubic-bezier(.3,.86,.16,1)` ("visitor's glide"), clipped-line
  hero rise, IntersectionObserver reveals, and the two-part signature above.
- Theme toggle persists to `localStorage` (`vitrine-theme`); tokens live at the top of
  `src/styles/global.css` on `:root[data-theme]`.

## Stack

[Astro 5](https://astro.build), static output, zero client framework. All art is inline SVG
(no image files); all interactivity is one inline vanilla script. Fonts from Google Fonts.

## Run locally

```sh
npm install
npm run dev        # dev server at localhost:4321/vitrine/
npm run build      # static build → ./docs
npm run preview    # serve the build
```

## Structure

```
astro.config.mjs        site/base/outDir for GitHub Pages (main + /docs)
src/
  pages/index.astro     the exhibition (works data in frontmatter)
  pages/guide.astro     "How Vitrine was built"
  components/
    Artwork.astro       the ten paintings, as inline SVG variants
    FloorPlan.astro     the interactive plan
  styles/global.css     design tokens (both themes) + all styling
public/.nojekyll        keeps Pages from running Jekyll
docs/                   build output, served by GitHub Pages
```

## Demo vs. real

- The **timed-entry form** validates and confirms in place but sends nothing and books
  nothing. Wire it to a ticketing service or your own endpoint before real use.
- The exhibition, painters, works, lenders, address, prices and hours are all invented.

## Accessibility

Skip link, `:focus-visible` outlines, reduced-motion support (no parallax drift, instant
scroll, no pulse — the plan still navigates), `.js`-gated reveals so content is never hidden
without JavaScript, and per-work `aria-label`s describing what a visitor sees.

## License

MIT — see [LICENSE](./LICENSE).
