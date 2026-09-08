/* ============================================================
   SELVEDGE — interactions
   Progressive enhancement: the page reads in full without this file.
   Two signatures, both CSS-driven so there is no per-frame loop:
     1. an interactive measuring figure — hover / tab a point and a
        caliper draws itself in while the readout updates;
     2. a bolt of cloth that unrolls (clip-path) as it scrolls in.
   ============================================================ */
(() => {
  'use strict';
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const root = document.documentElement;

  /* ---------- theme toggle ---------- */
  const themeBtn = document.getElementById('themeBtn');
  const meta = document.querySelector('meta[name="theme-color"]');
  const syncTheme = () => {
    const dark = root.dataset.theme === 'dark';
    themeBtn.setAttribute('aria-pressed', String(dark));
    themeBtn.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
    if (meta) meta.setAttribute('content', dark ? '#16151a' : '#efe9de');
  };
  syncTheme();
  themeBtn?.addEventListener('click', () => {
    root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem('selvedge-theme', root.dataset.theme); } catch (e) {}
    syncTheme();
  });

  /* ---------- hero intro + jacket sheen ---------- */
  const hero = document.querySelector('.hero');
  const suit = document.querySelector('.suit-fig');
  requestAnimationFrame(() => {
    if (hero) hero.classList.add('loaded');
    setTimeout(() => suit && suit.classList.add('lit'), 260);
  });

  /* ---------- reveals + stage rails + cloth unroll ---------- */
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
    }
  }, { threshold: 0.14, rootMargin: '0px 0px -6% 0px' });
  document.querySelectorAll('.reveal, .stage, .cloth').forEach(el => io.observe(el));

  /* ---------- animated counters ---------- */
  const cio = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      const el = e.target, to = parseFloat(el.dataset.to), dec = +(el.dataset.dec || 0);
      cio.unobserve(el);
      if (reduce) { el.textContent = to.toFixed(dec); continue; }
      /* markup carries the final value for no-JS readers; zero it only
         now, just before the count-up begins */
      el.textContent = (0).toFixed(dec);
      const dur = 1300, t0 = performance.now();
      const tick = (t) => {
        const p = clamp((t - t0) / dur, 0, 1);
        const eased = 1 - Math.pow(1 - p, 3);          /* cubic-out settle */
        el.textContent = (to * eased).toFixed(dec);
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }
  }, { threshold: 0.6 });
  document.querySelectorAll('.c-num').forEach(el => cio.observe(el));

  /* ---------- the measuring figure ---------- */
  const measures = {
    shoulder: { t: 'Shoulder', v: '18¼″', n: 'Bone to bone across the back. A natural shoulder, lightly built — we follow the man’s line, not the season’s.' },
    chest:    { t: 'Chest',    v: '41½″', n: 'Taken over the shirt with two fingers of ease. This is where the drape lives — get it wrong and the whole coat fights the wearer.' },
    sleeve:   { t: 'Sleeve',   v: '25¾″', n: 'Shoulder seam to wristbone, finished a quarter-inch short so a clean shirt cuff always shows.' },
    waist:    { t: 'Waist',    v: '34″',  n: 'Suppressed to follow the figure, never to hold it in. The button should close with room to breathe.' },
    inseam:   { t: 'Inseam',   v: '31½″', n: 'To a single soft break on the shoe. The hem is turned and felled by hand, of course.' }
  };
  const roTitle = document.getElementById('roTitle');
  const roVal = document.getElementById('roVal');
  const roNote = document.getElementById('roNote');
  const mps = Array.from(document.querySelectorAll('.mp'));

  const activate = (key, mp) => {
    const d = measures[key]; if (!d) return;
    mps.forEach(m => m.classList.toggle('is-active', m === mp));
    if (roTitle) roTitle.textContent = d.t;
    if (roVal) roVal.textContent = d.v;
    if (roNote) roNote.textContent = d.n;
  };

  mps.forEach(mp => {
    const key = mp.dataset.key;
    mp.addEventListener('pointerenter', () => activate(key, mp));
    mp.addEventListener('focus', () => activate(key, mp));
    mp.addEventListener('click', () => activate(key, mp));
    mp.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); activate(key, mp); }
    });
  });
  /* chest sits active on arrival so the figure is never blank */
  const chest = document.querySelector('.mp--chest');
  if (chest) chest.classList.add('is-active');

  /* ---------- book-a-fitting demo form (no backend — see README) ---------- */
  const form = document.getElementById('fitForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = form.querySelector('#fName'), email = form.querySelector('#fEmail');
      if (!name.checkValidity()) { name.reportValidity(); return; }
      if (!email.checkValidity()) { email.reportValidity(); return; }
      form.innerHTML =
        '<div class="fit-done"><strong>Consider it in the book.</strong>' +
        '<span class="mono">demo only — no message is sent. we’d normally write back within a day to set a time and a cloth.</span></div>';
    });
  }
})();
