<div align="center">

<h1>Ormecia</h1>
<p><em>A digital luxury heritage institution for rare antiques and historical masterpieces.</em></p>

[![License: MIT](https://img.shields.io/badge/License-MIT-b8954a.svg)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
[![HTML5](https://img.shields.io/badge/HTML-5-E34F26?logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS-3-1572B6?logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

**[Live Demo](https://ormecia.vercel.app)** · **[Report Bug](https://github.com/ormecia/ormecia/issues/new?template=bug_report.md)** · **[Request Feature](https://github.com/ormecia/ormecia/issues/new?template=feature_request.md)**

</div>

---

![Ormecia Homepage](docs/screenshots/hero.png)

---

## About

**Ormecia** is a production-grade, zero-dependency static frontend for a luxury antique e-commerce brand. It is designed to serve as:

- A **reference implementation** for premium, dark-theme, editorial UI in vanilla HTML/CSS/JS
- A **starter template** for high-end e-commerce storefronts
- A **study resource** for luxury UI design patterns, CSS design token architecture, and accessibility-compliant component patterns

The visual design follows the *"Digital Curator"* system — museum-grade aesthetics, full editorial typographic control, motion design without JavaScript frameworks, and a strict zero-rounded-corner rule that enforces visual discipline.

---

## Key Features

- **Zero runtime dependencies** — pure HTML5, CSS3 (custom properties), and vanilla ES6 JS
- **Design token architecture** — all colour, spacing, typography, and shadow values defined as CSS variables; one file to retheme the entire system
- **Accessibility-first** — semantic HTML5 elements, ARIA roles, keyboard-navigable navigation, `prefers-reduced-motion` support
- **IntersectionObserver animations** — staggered fade-in with motion-safe guard, no GSAP or animation library required
- **Live countdown timers** — per-listing auction countdown in plain JS
- **Editorial typography system** — Cormorant Garamond (serif) + Inter (sans-serif) pairing with a 10-stop type scale
- **Authentication Certificate UI** — purely CSS-driven certificate component with visual signature line
- **Responsive** — mobile-first, tested from 375px to 2560px
- **SEO-optimised** — semantic structure, descriptive titles, meta descriptions, Open Graph ready

---

## Screenshots

| Homepage Hero | Collections Grid |
|---|---|
| ![Hero](docs/screenshots/hero.png) | ![Collections](docs/screenshots/collections.png) |

| Product Detail Page | Authentication Certificate |
|---|---|
| ![PDP](docs/screenshots/pdp.png) | ![Certificate](docs/screenshots/certificate.png) |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Markup | HTML5 (Semantic) |
| Styling | CSS3 — Custom Properties, Grid, Flexbox, `clamp()`, `@keyframes` |
| Scripting | Vanilla JavaScript (ES6+), IIFE-scoped |
| Fonts | Google Fonts — Cormorant Garamond, Inter |
| Tooling | Python `http.server` / `npx serve` (local dev only) |
| Deployment | Vercel / Netlify / GitHub Pages |

---

## Quick Start

No build step. No package manager required.

```bash
git clone https://github.com/ormecia/ormecia.git
cd ormecia
python -m http.server 3000
```

Open [http://localhost:3000](http://localhost:3000).

**Alternative — Node.js:**
```bash
npx serve .
```

---

## Project Structure

```
ormecia/
├── src/
│   ├── pages/              # HTML page files
│   │   ├── index.html      # Homepage
│   │   ├── product.html    # Product detail page
│   │   └── collection.html # Collection listing page
│   ├── styles/
│   │   ├── tokens.css      # Design system — all CSS custom properties
│   │   ├── base.css        # Reset, typography, global defaults
│   │   ├── components/     # Per-component stylesheets
│   │   └── pages/          # Page-specific layout overrides
│   ├── scripts/
│   │   ├── main.js         # Core interactions
│   │   └── utils/          # Reusable helpers (timers, observers, etc.)
│   └── assets/
│       ├── images/         # Optimised product and editorial photographs
│       └── fonts/          # Self-hosted font fallbacks (if applicable)
├── public/                 # Static files served at root (favicon, robots.txt, og-image)
├── docs/                   # Project documentation and screenshots
├── .github/
│   ├── ISSUE_TEMPLATE/     # Bug report and feature request templates
│   └── PULL_REQUEST_TEMPLATE/
├── .gitignore
├── CONTRIBUTING.md
├── LICENSE
└── README.md
```

> **Note:** The current repository ships a flat file structure at its root. The `src/` structure above is the target architecture being migrated toward — see [Issue #1](https://github.com/ormecia/ormecia/issues/1) to contribute.

---

## Design System

The full *Digital Curator* design system is documented in [`docs/DESIGN_SYSTEM.md`](docs/DESIGN_SYSTEM.md).

Key principles:
- All colours referenced via `--gold`, `--surface`, `--on-surface`, etc. — never literal hex values in component CSS
- All spacing via the `--space-N` scale (4px base, up to `--space-28`)
- Zero border radius on all components (enforced via `--radius-none: 0px`)
- Elevation via tonal layering, not box-shadow

---

## Contributing

Contributions are welcome. Please read [`CONTRIBUTING.md`](CONTRIBUTING.md) before opening a pull request.

**Quick contribution guide:**

1. [Fork](https://github.com/ormecia/ormecia/fork) the repository
2. `git checkout -b feat/your-feature-name`
3. Make your changes, following the coding standards in `CONTRIBUTING.md`
4. `git commit -m "feat(scope): description"`
5. Open a pull request against `main`

See [`CONTRIBUTING.md`](CONTRIBUTING.md) for branch naming conventions, commit message format, PR requirements, and coding standards.

---

## Deployment

| Platform | Status |
|---|---|
| Vercel | [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/ormecia/ormecia) |
| Netlify | [![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/ormecia/ormecia) |

Full deployment instructions: [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md)

---

## Roadmap

- [ ] Migrate to `src/` directory structure
- [ ] Collection listing page (`collection.html`)
- [ ] CSS-driven lightbox for artifact images
- [ ] Accessible filter/sort component for listings
- [ ] Dark/light mode toggle with `prefers-color-scheme` fallback
- [ ] `robots.txt` and sitemap
- [ ] Structured data (`application/ld+json`) for product pages

Track progress in [GitHub Projects](https://github.com/ormecia/ormecia/projects).

---

## License

Distributed under the MIT License. See [`LICENSE`](LICENSE) for full terms.

---

<div align="center">
<p>Built with precision. Designed for heritage.</p>
<p><strong>Ormecia Fine Arts</strong> · Est. MCMXLVII · Geneva · London · Florence</p>
</div>
