<!-- parable:beautified -->
<div align="center">

<h1>Dovetail</h1>

<p><strong>Furniture design studio — an orthographic blueprint chair that turns through its elevations, with live material swaps.</strong></p>

<p>
  <a href="https://bswxyz.github.io/dovetail/"><img alt="Live demo" src="https://img.shields.io/badge/demo-live-8b5cf6?style=flat-square&labelColor=1a1a1a"></a>
  <img alt="Family" src="https://img.shields.io/badge/family-Parable-ec4899?style=flat-square&labelColor=1a1a1a">
  <img alt="Stack" src="https://img.shields.io/badge/stack-HTML%2FJS-f5a623?style=flat-square&labelColor=1a1a1a">
  <a href="LICENSE"><img alt="MIT License" src="https://img.shields.io/badge/license-MIT-22c55e?style=flat-square&labelColor=1a1a1a"></a>
</p>

<p>
  <a href="https://bswxyz.github.io/dovetail/"><b>Live demo</b></a>
  &nbsp;·&nbsp;
  <a href="https://bswxyz.github.io/dovetail/guide/">Build notes</a>
  &nbsp;·&nbsp;
  <a href="https://parable-three.vercel.app/templates">More templates</a>
</p>

<a href="https://bswxyz.github.io/dovetail/">
  <img src=".github/preview.jpg" alt="Dovetail — live preview" width="100%">
</a>

</div>

**Use this template** — copy the source into a new project:

```bash
npx degit bswxyz/dovetail my-app
```


A single-page site for a bespoke furniture & industrial-design studio — bench-made,
made-to-order pieces in solid oak, walnut and blackened steel. Built for **Parable**, a
showcase of individually-crafted, Awwwards-quality website templates.

Dovetail is styled like a sheet of drawing paper. The hero is a dimensioned orthographic
elevation instead of a hero photo, and the centrepiece is a line-drawing of a lounge chair
you can **rotate through its elevations** and **re-skin by material**.

## Concept

Furniture photography flatters; a drawing tells the truth. The brand voice is precise,
material-honest and unhurried — it talks about grain, joinery and tolerances — so the site
is built to *look measured*: a blueprint grid behind everything, architect's dimension ticks,
and millimetres in the mono type.

## Design system

- **Palette** — light (default) is *bone paper* `#efe8dc` on *oak-dark* ink `#1a1611`;
  dark is the inverse (oiled-oak ground, bone ink). Accent **rust** `#b5561f`; secondary
  **warm oak** `#a9793f`. Both themes are defined as tokens in `:root[data-theme="…"]` at the
  top of `styles.css` and flipped by the nav toggle (persisted to `localStorage`).
- **Type** — **Fraunces** (display), **Inter** (body), **Space Mono** (technical labels /
  eyebrows), via Google Fonts with preconnect.
- **Motion** — a named signature ease, `--ease: cubic-bezier(.2,.85,.24,1)` ("the drawer
  glide"). Clipped-line hero intro, `.reveal` IntersectionObserver scroll-ins, animated
  counters, and the rotating drawing.
- **Signature flourish** — a canvas 2D orthographic wireframe of the *Halyard Lounge* that
  rotates front → 3/4 → side on scroll or drag, with live millimetre dimensions and a
  four-way material swatch swap (oak / walnut / blackened steel / linen).

## Stack

Vanilla HTML, CSS and JavaScript. No framework, no bundler, no dependencies — the drawing is
hand-rolled canvas 2D. All artwork is inline SVG / canvas / CSS; there are **no image files**.

## Run locally

It's a static site — open `index.html`, or serve the folder:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Structure

```
dovetail/
├── index.html        # semantic sections; .js gate; theme bootstrap in <head>
├── styles.css        # design tokens for both themes at top; full reduced-motion block
├── main.js           # theme toggle · hero intro · reveals · counters · demo form · the signature
├── guide/
│   └── index.html    # "How Dovetail was built" — idea, stack, technique (real code), ship notes
├── README.md
├── LICENSE           # MIT
├── .nojekyll         # serve as-is on GitHub Pages
└── .gitignore
```

## Demo vs real

This is a **design showcase**, not a working studio.

- **The commission form is a demo.** It validates and confirms in place but **sends nothing** —
  no network request is made. Wire it to your own endpoint (Formspree, a serverless function,
  an email service) before taking real enquiries.
- **All content is invented.** Studio, prices, lead times, material specs, plate numbers and
  the "Est. 2011" line are plausible fiction for the concept.
- **No tracking, no cookies, no external calls** beyond the Google Fonts stylesheet.

## Accessibility & performance

- Works without JavaScript (progressive enhancement; hidden states are gated behind `.js`).
- Full `prefers-reduced-motion` support: no auto-rotation, one static side elevation, instant
  material swaps.
- `:focus-visible` outlines, a skip link, real `alt`/`aria` text, decorative layers hidden.
- Canvas caps device-pixel-ratio at ~1.5 and pauses its render loop when off-screen.

## License

MIT — see [LICENSE](./LICENSE).
