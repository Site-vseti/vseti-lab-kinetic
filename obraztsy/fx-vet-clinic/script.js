/* ═══════════════════════════════════════════════════════════
   Sauvabelin veterinary clinic — behaviours
   Designed by Studio Alpix
   ═══════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* ── Real clinic opening hours (0 = Sunday) ─────────────── */
  const HORAIRES = {
    0: { plages: [],                                      texte: 'Fermé — garde vétérinaire' },
    1: { plages: [[480, 720], [810, 1110]],               texte: '08:00 – 12:00 · 13:30 – 18:30' },
    2: { plages: [[480, 720], [810, 1110]],               texte: '08:00 – 12:00 · 13:30 – 18:30' },
    3: { plages: [[480, 720], [810, 1110]],               texte: '08:00 – 12:00 · 13:30 – 18:30' },
    4: { plages: [[480, 720], [810, 1200]],               texte: '08:00 – 12:00 · 13:30 – 20:00' },
    5: { plages: [[480, 720], [810, 1110]],               texte: '08:00 – 12:00 · 13:30 – 18:30' },
    6: { plages: [[540, 780]],                            texte: '09:00 – 13:00' }
  };
  const JOURS = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];

  /* Lausanne local time, whatever the visitor's timezone. */
  function maintenantLausanne() {
    const parties = new Intl.DateTimeFormat('fr-CH', {
      timeZone: 'Europe/Zurich',
      weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false
    }).formatToParts(new Date());

    const lu = (t) => (parties.find((p) => p.type === t) || {}).value || '';
    const abrev = lu('weekday').toLowerCase().slice(0, 2);
    const index = { di: 0, lu: 1, ma: 2, me: 3, je: 4, ve: 5, sa: 6 };
    const heures = parseInt(lu('hour'), 10) % 24;
    const minutes = parseInt(lu('minute'), 10);

    return { jour: index[abrev] ?? new Date().getDay(), minutes: heures * 60 + minutes };
  }

  const enHM = (m) => String(Math.floor(m / 60) % 24).padStart(2, '0') + ':' + String(m % 60).padStart(2, '0');

  /* Rounds up to the next quarter hour available within a range. */
  function prochainCreneau(jour, minutes) {
    for (let saut = 0; saut < 8; saut++) {
      const j = (jour + saut) % 7;
      const plages = HORAIRES[j].plages;
      const depuis = saut === 0 ? minutes + 20 : 0;
      for (const [debut, fin] of plages) {
        const cible = Math.max(debut, Math.ceil(Math.max(depuis, debut) / 15) * 15);
        if (cible <= fin - 25) {
          const quand = saut === 0 ? "Aujourd'hui" : saut === 1 ? 'Demain' : JOURS[j].charAt(0).toUpperCase() + JOURS[j].slice(1);
          return quand + ' ' + enHM(cible);
        }
      }
    }
    return 'Sur demande';
  }

  function majStatut() {
    const { jour, minutes } = maintenantLausanne();
    const jourCourant = HORAIRES[jour];
    const plageOuverte = jourCourant.plages.find(([d, f]) => minutes >= d && minutes < f);
    const ouvert = Boolean(plageOuverte);

    /* A precise message rather than a bare « ouvert / fermé ». */
    let detail;
    if (ouvert) {
      const reste = plageOuverte[1] - minutes;
      detail = reste <= 45
        ? 'Ferme dans ' + reste + ' min, à ' + enHM(plageOuverte[1])
        : 'Ferme à ' + enHM(plageOuverte[1]);
    } else {
      const suivante = jourCourant.plages.find(([d]) => d > minutes);
      detail = suivante
        ? 'Rouvre à ' + enHM(suivante[0])
        : 'Rouvre ' + (jour === 6 ? 'lundi' : 'demain') + ' à ' + enHM((HORAIRES[(jour + 1) % 7].plages[0] || HORAIRES[1].plages[0])[0]);
    }

    document.querySelectorAll('[data-statut-texte]').forEach((n) => {
      n.textContent = ouvert ? 'Ouvert' : 'Fermé';
    });
    document.querySelectorAll('[data-statut-detail]').forEach((n) => { n.textContent = detail; });
    document.querySelectorAll('[data-horaire-jour]').forEach((n) => { n.textContent = jourCourant.texte; });
    document.querySelectorAll('[data-prochain-creneau]').forEach((n) => {
      n.textContent = ouvert || jourCourant.plages.length ? prochainCreneau(jour, minutes) : prochainCreneau(jour, 1e4);
    });

    const drapeau = ouvert ? 'oui' : 'non';
    const panneau = document.querySelector('.etat');
    const bandeau = document.getElementById('statut-bandeau');
    if (panneau) panneau.setAttribute('data-ouvert', drapeau);
    if (bandeau) {
      bandeau.setAttribute('data-ouvert', drapeau);
      bandeau.setAttribute('title', detail);
    }

    const horloge = document.getElementById('horloge');
    if (horloge) {
      horloge.textContent = enHM(minutes) + ' Lausanne';
      horloge.setAttribute('datetime', enHM(minutes));
    }

    document.querySelectorAll('[data-horaires] tr').forEach((tr) => {
      tr.toggleAttribute('data-aujourdhui', Number(tr.dataset.jour) === jour);
    });
  }

  majStatut();
  setInterval(majStatut, 30000);

  /* ── Species tabs (signature piece) ─────────────────────── */
  const onglets = Array.from(document.querySelectorAll('.onglet'));

  function choisir(index) {
    onglets.forEach((o, i) => {
      const actif = i === index;
      o.setAttribute('aria-selected', String(actif));
      o.tabIndex = actif ? 0 : -1;
      const panneau = document.getElementById(o.getAttribute('aria-controls'));
      if (panneau) panneau.hidden = !actif;
    });
  }

  onglets.forEach((onglet, i) => {
    onglet.addEventListener('click', () => choisir(i));
    onglet.addEventListener('keydown', (e) => {
      const pas = { ArrowRight: 1, ArrowLeft: -1, Home: -Infinity, End: Infinity }[e.key];
      if (pas === undefined) return;
      e.preventDefault();
      const cible = pas === -Infinity ? 0
        : pas === Infinity ? onglets.length - 1
        : (i + pas + onglets.length) % onglets.length;
      choisir(cible);
      onglets[cible].focus();
    });
  });

  /* ── Mobile menu ────────────────────────────────────────── */
  const burger = document.getElementById('burger');
  const nav = document.getElementById('nav');

  if (burger && nav) {
    const basculer = (ouvrir) => {
      burger.setAttribute('aria-expanded', String(ouvrir));
      burger.setAttribute('aria-label', ouvrir ? 'Fermer le menu' : 'Ouvrir le menu');
      nav.setAttribute('data-ouvert', ouvrir ? 'oui' : 'non');
    };
    burger.addEventListener('click', () => basculer(burger.getAttribute('aria-expanded') !== 'true'));
    nav.addEventListener('click', (e) => { if (e.target.tagName === 'A') basculer(false); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') basculer(false); });
  }

  /* ── Scroll reveal ──────────────────────────────────────── */
  const doux = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!doux && 'IntersectionObserver' in window) {
    const cibles = document.querySelectorAll('.tete, .equipements li, .soignant, .carte-info, .avis li, .formulaire, .clinique__prose');
    cibles.forEach((n) => n.classList.add('revele'));

    const observateur = new IntersectionObserver((entrees) => {
      entrees.forEach((entree, i) => {
        if (!entree.isIntersecting) return;
        entree.target.style.transitionDelay = Math.min(i * 55, 220) + 'ms';
        entree.target.classList.add('vu');
        observateur.unobserve(entree.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px' });

    cibles.forEach((n) => observateur.observe(n));
  }

  /* ── Appointment request form ───────────────────────────── */
  const formulaire = document.getElementById('formulaire');
  const note = document.getElementById('formulaire-note');

  if (formulaire && note) {
    formulaire.addEventListener('submit', (e) => {
      e.preventDefault();
      const requis = Array.from(formulaire.querySelectorAll('[required]'));
      const vides = requis.filter((champ) => !champ.value.trim());

      requis.forEach((champ) => champ.setAttribute('aria-invalid', String(!champ.value.trim())));

      if (vides.length) {
        note.dataset.etat = 'erreur';
        note.textContent = 'Il manque ' + (vides.length === 1 ? 'un champ' : vides.length + ' champs') + ' : nom et téléphone sont nécessaires pour vous rappeler.';
        vides[0].focus();
        return;
      }

      note.dataset.etat = 'ok';
      note.textContent = 'Demande envoyée. Nadia vous rappelle sous 2 h ouvrables au ' + formulaire.tel.value.trim() + '.';
      formulaire.reset();
    });
  }

  /* Minimum date: today. */
  const champDate = document.getElementById('f-date');
  if (champDate) {
    champDate.min = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Zurich' }).format(new Date());
  }
})();
