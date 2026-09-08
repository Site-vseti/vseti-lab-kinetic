# LaunchForge — Bootstrap Landing Page Template

A clean, responsive **Bootstrap 5 landing-page starter template** for mobile apps, SaaS products, marketplaces, startups, and digital products.

LaunchForge is built around a simple conversion-oriented structure:

- Sticky responsive navigation
- Hero section with product mockup and primary CTA
- "How it works" process section
- Feature/status section
- Service/card showcase
- Safety & security section
- App download CTA
- Responsive footer

## Preview

Open `index.html` directly in a browser, or use a local development server such as VS Code Live Server.

> The template references images and an icon from `assets/`. Add your own files using the paths already used in `index.html`, or replace those paths with your own assets.

## Tech Stack

- HTML5
- CSS3
- Bootstrap 5.3
- Bootstrap Icons 1.13
- Responsive layout with Bootstrap Grid
- No JavaScript framework
- No build step required

## Folder Structure

```text
launchforge-bootstrap-landing/
├── index.html
├── README.md
├── LICENSE
├── CHANGELOG.md
├── .gitignore
└── assets/
    ├── images/
    │   ├── abstract.jpeg
    │   ├── phone-mockup.png
    │   ├── phone mockup-2.png
    │   ├── mob-1.jpg
    │   ├── mob-2.jpg
    │   └── mob-3.jpg
    └── icons/
        └── handbag-fill.svg
```

## Customization

### 1. Brand
Search for `LaunchForge` in `index.html` and replace it with your product name.

### 2. Colors
The default palette is:

- Primary: `#6C4BF4`
- Secondary: `#FF865E`

Update the CSS variables/classes if you want a different brand identity.

### 3. Content
Replace the placeholder copy in:

- Hero
- How it Works
- Features
- Services
- Safety & Security
- Download CTA
- Footer

### 4. Images
Replace the files in `assets/images/` with your own product screenshots, mockups, and illustrations while keeping the same filenames, or update the `src` paths.

### 5. App Download Links
The CTA links currently point to `#download` as a template hook. Replace them with your App Store, Google Play, website, or signup URL.

## Design Philosophy

The template intentionally keeps the implementation lightweight. Bootstrap handles the grid, spacing, typography utilities, cards, navigation, and responsive behavior while a small custom CSS layer handles the brand palette and template-specific components.

## Known Template Constraints

This is a front-end landing-page starter, not a complete application. It does not include:

- Backend functionality
- Authentication
- Forms processing
- Payment integration
- App-store deployment
- CMS integration
- Analytics
- SEO tooling beyond basic HTML metadata

## License

Released under the MIT License. See `LICENSE`.

## Credits

Built with [Bootstrap](https://getbootstrap.com/) and [Bootstrap Icons](https://icons.getbootstrap.com/).
