# Template-Veterinaire-CSS

[English](#english) · [Français](#francais)

<img width="1441" height="847" alt="template-veterinaire" src="https://github.com/user-attachments/assets/05a94ee7-7774-4712-a9cc-2bc22d132981" />

<a id="english"></a>
## English

Single-page website template for a veterinary clinic. Hand-written HTML, CSS and
vanilla JavaScript — no framework, no build step, nothing to install.

### Preview

Open `index.html` in any browser. That's it.

To publish a live demo: **Settings → Pages → Deploy from a branch → `main` / root**.

### What's inside

- **Three files**, ~1 500 lines total: `index.html` (570), `styles.css` (746), `script.js` (198)
- **No Tailwind, no CSS framework.** Plain CSS Grid and custom properties, BEM-style class names
- **Bricolage Grotesque**, **Instrument Sans** and **DM Mono** (Google Fonts); slate / copper
  palette on paper white, 1px rules, all figures set in monospace
- Sections: hero with live clinic status, emergency band, clinic, species tabs,
  team, appointment form, directions & opening hours, testimonials, footer
- **Live opening-hours status**, computed in `Europe/Zurich` whatever the visitor's
  timezone, refreshed every 30 s: open / closed, "closes in 25 min", next available
  slot rounded to the quarter hour, today's row highlighted in the hours table
- **Species tabs** (dog / cat / small pets / exotics) with full ARIA tab semantics
  and arrow-key, Home and End navigation
- Appointment form with client-side validation and `aria-invalid` feedback
- Scroll reveals via `IntersectionObserver`, mobile menu closed by `Escape`
- `prefers-reduced-motion` respected, visible keyboard focus throughout
- Responsive, three breakpoints: 1080 / 900 / 640 px
- Team portraits stored locally in `assets/equipe/` — no image CDN

### Before you ship this

Four things to change — the template is a demo, not a production build:

1. **All content is fictional.** The clinic, its address, phone numbers, the seven
   staff members, their biographies and the testimonials are invented for
   demonstration purposes.
2. **The six team portraits come from Unsplash.** The licence allows commercial use
   but forbids implying that a photographed person endorses a service — attaching a
   name and a veterinarian's title to these faces is fine for a mock-up, not for a
   published site. Replace the files in `assets/equipe/`, keeping the same names,
   and no code changes are needed. See [`CREDITS.md`](CREDITS.md).
3. **The form sends nothing.** Submitting only validates fields and prints a
   confirmation message. Wire it to your own backend, or to a form service.
4. **Fonts are loaded from Google Fonts.** Self-host them if you would rather not
   send your visitors' IP addresses to a third party.

Opening hours also live in the `HORAIRES` object at the top of
[`script.js`](script.js) — change them there and the banner, the status panel and
the table all follow.

### Customising

Design tokens sit in the `:root` block at the top of [`styles.css`](styles.css):
colours (`--ardoise`, `--cuivre`, `--papier`, `--encre`), the three font stacks,
container width, gutters, vertical rhythm and easing. Change them there and the
whole page follows.

---

<a id="francais"></a>
## Français

Template de site one-page pour clinique vétérinaire. HTML, CSS et JavaScript natifs,
écrits à la main — aucun framework, aucune compilation, rien à installer.

### Aperçu

Ouvrez `index.html` dans n'importe quel navigateur. C'est tout.

Pour publier une démo en ligne : **Settings → Pages → Deploy from a branch → `main` / root**.

### Ce que contient le template

- **Trois fichiers**, ~1 500 lignes au total : `index.html` (570), `styles.css` (746), `script.js` (198)
- **Ni Tailwind ni aucun framework CSS.** CSS Grid natif et variables personnalisées,
  nommage des classes en BEM
- **Bricolage Grotesque**, **Instrument Sans** et **DM Mono** (Google Fonts) ; palette
  ardoise / cuivre sur papier, filets 1px, tous les chiffres en monospace
- Sections : hero avec état de la clinique en direct, bandeau urgences, clinique,
  onglets par espèce, équipe, demande de rendez-vous, accès et horaires, avis, pied de page
- **État d'ouverture en temps réel**, calculé sur `Europe/Zurich` quel que soit le
  fuseau du visiteur, rafraîchi toutes les 30 s : ouvert / fermé, « ferme dans 25 min »,
  prochain créneau arrondi au quart d'heure, ligne du jour surlignée dans le tableau
- **Onglets par espèce** (chien / chat / NAC / exotiques) avec sémantique ARIA complète
  et navigation aux flèches, Home et End
- Formulaire de rendez-vous avec validation côté client et retour `aria-invalid`
- Révélations au défilement via `IntersectionObserver`, menu mobile refermé par `Échap`
- `prefers-reduced-motion` respecté, focus clavier visible partout
- Responsive, trois points de rupture : 1080 / 900 / 640 px
- Portraits de l'équipe stockés en local dans `assets/equipe/` — aucun CDN d'images

### Avant toute mise en ligne réelle

Quatre points à reprendre — ce template est une démonstration, pas une version de production :

1. **Tout le contenu est fictif.** La clinique, son adresse, ses numéros de téléphone,
   les sept membres de l'équipe, leurs biographies et les avis sont inventés à des fins
   de démonstration.
2. **Les six portraits de l'équipe viennent d'Unsplash.** La licence autorise l'usage
   commercial mais interdit de laisser entendre qu'une personne photographiée soutient
   un service — attribuer un nom et un titre de vétérinaire à ces visages convient à une
   maquette, pas à un site publié. Remplacez les fichiers de `assets/equipe/` en gardant
   les mêmes noms, aucune modification du code n'est nécessaire. Voir [`CREDITS.md`](CREDITS.md).
3. **Le formulaire n'envoie rien.** L'envoi se contente de valider les champs et
   d'afficher un message de confirmation. Reliez-le à votre backend ou à un service de
   formulaires.
4. **Les polices sont chargées depuis Google Fonts.** Auto-hébergez-les si vous préférez
   ne pas transmettre les adresses IP de vos visiteurs à un tiers.

Les horaires se trouvent dans l'objet `HORAIRES` en tête de [`script.js`](script.js) :
modifiez-les à cet endroit, le bandeau, le panneau d'état et le tableau suivent.

### Personnalisation

Les jetons de design sont regroupés dans le bloc `:root` en tête de
[`styles.css`](styles.css) : couleurs (`--ardoise`, `--cuivre`, `--papier`, `--encre`),
les trois familles de polices, la largeur du conteneur, les gouttières, le rythme
vertical et la courbe d'accélération. Modifiez-les à cet endroit, toute la page suit.

---

## Credits

Designed by [Studio Alpix](https://studio-alpix.com/).
Photography from [Unsplash](https://unsplash.com).

## License

MIT
