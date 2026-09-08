# 🍷 Maison Rouge

> A premium, production-ready fictional restaurant website inspired by Michelin-star dining establishments.

[🌐 Live Demo](https://maison-rouge.netlify.app/)

---

## 📋 Project Overview

**Maison Rouge** is a fully responsive, luxury restaurant website built with pure HTML, CSS, and JavaScript—no frameworks required. It showcases contemporary French fine dining through elegant design, smooth animations, and comprehensive functionality across 10 pages.

The project is optimized for **Performance 95+**, **Accessibility 95+**, **SEO 95+**, and **Best Practices 95+** in Lighthouse audits.

---

## ✨ Features

### Pages
| Page | Description |
|------|-------------|
| **Home** | Hero section, about preview, featured menu, chef spotlight, gallery preview, testimonials, reservation CTA |
| **About** | Restaurant philosophy, awards & accolades, core values |
| **Chef** | Chef biography, career timeline, culinary philosophy |
| **Menu** | Full menu with category filtering (Starters, Mains, Desserts, Wine Pairing) |
| **Gallery** | Responsive image grid with lightbox viewer |
| **Testimonials** | Guest reviews in an elegant card layout |
| **FAQ** | Interactive accordion with common questions |
| **Reservation** | Interactive booking form with real-time validation |
| **Contact** | Contact form, info cards, Google Maps placeholder |
| **404** | Custom error page with return navigation |

### Technical Features
- 🎨 **Luxury Animations** — GSAP-powered scroll-triggered animations and page transitions
- 🌊 **Lenis Smooth Scroll** — Buttery smooth scrolling with inertia
- ✍️ **Elegant Typography** — Playfair Display, Cormorant Garamond, Montserrat font stack
- 📱 **Responsive Layout** — Mobile-first design, optimized for all devices
- 🔍 **SEO Optimization** — Meta tags, Open Graph, Twitter Cards, JSON-LD structured data
- ♿ **Accessibility** — ARIA labels, keyboard navigation, skip links, focus management, reduced motion support
- 🏗️ **Semantic HTML** — Proper heading hierarchy, landmarks, and document structure
- ⚡ **Optimized Loading** — Preconnect hints, resource preloading, lazy loading images
- 🖼️ **Image Lazy Loading** — Intersection Observer-based progressive loading
- 📝 **Interactive Forms** — Real-time validation, Formspree integration ready
- 🔖 **Menu Filtering** — Category-based filtering with smooth transitions
- 📧 **Newsletter** — Email signup with validation
- 🗺️ **Google Maps Placeholder** — Styled placeholder with link to actual maps
- 🔗 **Social Media Links** — Instagram, Facebook, Twitter icons
- 📄 **Open Graph & Twitter Cards** — Rich social sharing previews
- 🧠 **JSON-LD** — Schema.org structured data for restaurants
- 🤖 **robots.txt** — Search engine crawler directives
- 🗺️ **sitemap.xml** — Complete site map for search engines
- 🚫 **404 Page** — Custom not-found page

---

## 📸 Screenshots

> Screenshots will be added after deployment. The design features:
> - Deep burgundy and gold color palette
> - Elegant serif typography for headings
> - Smooth scroll-triggered fade-up animations
> - Full-screen hero with gradient overlays
> - Dark-themed menu and footer sections

---

## 📁 Folder Structure

```
restaurant/
├── index.html              # Home page
├── about.html              # About / Our Story
├── chef.html               # Chef profile
├── menu.html               # Full menu with filtering
├── gallery.html            # Photo gallery with lightbox
├── testimonials.html       # Guest reviews
├── faq.html                # Frequently asked questions
├── reservation.html        # Reservation booking form
├── contact.html            # Contact form & info
├── 404.html                # Custom error page
├── README.md               # Project documentation
├── LICENSE                 # MIT License
├── .gitignore              # Git ignore rules
├── robots.txt              # Search engine directives
├── sitemap.xml             # XML sitemap
├── css/
│   └── main.css            # Complete stylesheet (CSS variables, responsive, print)
├── js/
│   └── main.js             # All JavaScript (GSAP, Lenis, forms, gallery, etc.)
└── assets/
    └── images/             # Image assets (placeholders for OG images)
```

---

## 🛠 Technology Stack

| Technology | Purpose |
|------------|---------|
| **HTML5** | Semantic markup, accessibility, SEO |
| **CSS3** | Custom properties, Grid, Flexbox, animations, media queries |
| **Vanilla JavaScript** | Interactivity, form validation, gallery, menu filtering |
| **GSAP 3.12** + ScrollTrigger | Scroll-triggered animations, timeline sequences |
| **Lenis** | Smooth scroll with inertia |
| **Google Fonts** | Playfair Display, Cormorant Garamond, Montserrat |
| **Formspree** | Form submission handling (configure YOUR_FORM_ID) |

---

## 🚀 Installation

### Local Development

```bash
# Clone the repository
git clone https://github.com/rohitsahanibuilds/Maison-Rouge-Restaurant.git

# Navigate to project directory
cd Maison-Rouge-Restaurant

# Open in browser (no build step required)
open index.html

# Or serve with a local server for best results
npx serve .
# or
python -m http.server 8000
```

### Configuration

1. **Formspree Forms**: Replace `YOUR_FORM_ID` in:
   - `index.html` (newsletter form)
   - `reservation.html` (reservation form)
   - `contact.html` (contact form)

   Get your Formspree form ID from [formspree.io](https://formspree.io/)

2. **Open Graph Images**: Replace placeholder `og-*.jpg` URLs with actual images in the `<meta property="og:image">` tags.

3. **Domain**: Update `https://maisonrouge.com` in meta tags and sitemap to your actual domain.

---

## 🌐 Deployment to Netlify

### Method 1: Drag & Drop
1. Go to [Netlify Drop](https://app.netlify.com/drop)
2. Drag the entire `restaurant/` folder onto the page
3. Your site is live instantly!

### Method 2: Git Integration
1. Push to GitHub/GitLab/Bitbucket
2. Connect repository in Netlify dashboard
3. Build settings:
   - **Build command**: *(leave empty)*
   - **Publish directory**: `/` (root)
4. Click **Deploy**

### Method 3: Netlify CLI
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
cd restaurant
netlify deploy --prod --dir .
```

### Post-Deployment
- Set up a custom domain in Netlify settings
- Enable HTTPS (automatic with Netlify)
- Configure form handling if not using Formspree
- Set up branch deploys for staging

---

## 🔍 SEO

### Implemented
- ✅ Semantic HTML5 structure
- ✅ Proper heading hierarchy (h1 → h2 → h3)
- ✅ Meta descriptions and keywords on every page
- ✅ Canonical URLs
- ✅ Open Graph tags (title, description, image, URL)
- ✅ Twitter Card meta tags
- ✅ JSON-LD structured data (Restaurant schema)
- ✅ XML sitemap
- ✅ robots.txt
- ✅ Alt text on all images
- ✅ Descriptive link text
- ✅ Preconnect and DNS-prefetch hints
- ✅ Resource preloading for critical CSS/fonts

### Recommendations for Production
- Generate actual OG images (1200×630px)
- Submit sitemap to Google Search Console
- Set up Google Analytics 4
- Implement schema markup for reviews and menu items
- Add breadcrumb structured data

---

## ♿ Accessibility

### Implemented
- ✅ Skip navigation link
- ✅ ARIA labels and roles throughout
- ✅ Keyboard-navigable menu and lightbox
- ✅ Focus-visible styles
- ✅ Proper form labels and error messages
- ✅ `aria-expanded` on toggles
- ✅ `aria-live` regions for form feedback
- ✅ Reduced motion media query support
- ✅ Sufficient color contrast (WCAG AA)
- ✅ Logical tab order
- ✅ Descriptive alt text on images

### Audit Checklist
- [ ] Test with NVDA/JAWS screen readers
- [ ] Verify color contrast ratios with axe DevTools
- [ ] Test keyboard-only navigation
- [ ] Validate with WAVE accessibility evaluator

---

## ⚡ Performance

### Optimizations Applied
- ✅ Lazy loading on all images (`loading="lazy"` + Intersection Observer)
- ✅ Preconnect to Google Fonts and CDN
- ✅ DNS-prefetch for external resources
- ✅ CSS custom properties (no redundant values)
- ✅ Minimal JavaScript (no frameworks)
- ✅ Efficient CSS selectors
- ✅ Print stylesheet included
- ✅ SVG icons (no icon font overhead)

### Recommendations for 99+ Score
- Convert images to WebP/AVIF format
- Implement responsive images with `srcset`
- Add service worker for caching
- Minify CSS and JS for production
- Consider critical CSS inlining

---

## 🔮 Future Improvements

- [ ] **Backend Integration**: Real-time reservation system with availability calendar
- [ ] **CMS**: Headless CMS (Strapi/Sanity) for menu and content management
- [ ] **Blog**: Chef's journal and seasonal ingredient spotlights
- [ ] **Online Store**: Gift certificates and merchandise
- [ ] **Dark Mode Toggle**: User preference-based theme switching
- [ ] **PWA**: Service worker, manifest, offline support
- [ ] **Analytics**: Google Analytics 4 + Search Console integration
- [ ] **A/B Testing**: Experiment with hero layouts and CTAs
- [ ] **Multi-language**: i18n support for French and Spanish
- [ ] **WebGL Effects**: Subtle particle animations in hero section
- [ ] **Real Images**: Replace Unsplash placeholders with professional photography

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2024 Maison Rouge

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

---

## 👤 Author

**Maison Rouge Development Team**

- Website: [https://maison-rouge.netlify.app/](https://maisonrouge.com)
- Email: [rohit.sahani.dev@gmail.com](mailto:rohit.sahani.dev@gmail.com)
- Instagram: [@maisonrouge](https://instagram.com/maisonrouge)

---

<p align="center">
  <em>Crafted with passion, served with excellence.</em>
  <br>
  <strong>Maison Rouge</strong> 🍷
</p>
