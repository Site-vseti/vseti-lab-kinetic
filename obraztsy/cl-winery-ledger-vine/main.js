/* ============================================================
   Ledger & Vine — interactions
   Progressive enhancement: the page reads fully without this file
   (hero shows the static photo, glasses render filled).
   ============================================================ */
(() => {
  'use strict';
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasGSAP = () => typeof window.gsap !== 'undefined';
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

  /* ---------- hero intro ---------- */
  const hero = document.querySelector('.hero');
  requestAnimationFrame(() => hero && hero.classList.add('loaded'));

  /* ---------- scroll reveals ----------
     Large top rootMargin: anything the user has already scrolled PAST
     (e.g. via an instant anchor jump) counts as seen and reveals. */
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
    }
  }, { threshold: 0.12, rootMargin: '4000px 0px -8% 0px' });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  /* ---------- signature #1 — layered vineyard parallax ---------- */
  if (hasGSAP() && window.ScrollTrigger && !reduce && hero) {
    window.gsap.registerPlugin(window.ScrollTrigger);
    const scrub = (sel, vars) => window.gsap.to(sel, {
      ease: 'none', ...vars,
      scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true }
    });
    scrub('.ph-photo', { yPercent: 16 });                    // deep layer drifts down, slowest
    scrub('.ph-rays',  { yPercent: 26, opacity: 0.15 });     // light rays thin out
    scrub('.ph-hills', { yPercent: -7 });                    // far silhouettes rise gently
    scrub('.ph-rows',  { yPercent: -16 });                   // near vine rows rise fastest
    scrub('.hero-copy',{ yPercent: -30, autoAlpha: 0 });     // wordmark lifts away
    scrub('.hero-meta-l', { xPercent: -14, autoAlpha: 0 });
    scrub('.hero-meta-r', { xPercent: 14, autoAlpha: 0 });
  }

  /* ---------- signature #2 — the pour ---------- */
  const tiers = document.querySelectorAll('.tier');
  const pour = (tier) => {
    if (reduce) { tier.classList.add('poured'); return; }
    tier.classList.add('poured', 'pouring');
    const stream = tier.querySelector('.stream');
    if (stream) stream.addEventListener('animationend', () => tier.classList.remove('pouring'), { once: true });
    else tier.classList.remove('pouring');
  };
  const tio = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      tio.unobserve(e.target);
      const delay = reduce ? 0 : [...tiers].indexOf(e.target) * 260;
      setTimeout(() => pour(e.target), delay);
    }
  }, { threshold: 0.35, rootMargin: '4000px 0px 0px 0px' });
  tiers.forEach(t => {
    tio.observe(t);
    // hover / focus re-pours the glass (drain, then pour again)
    let busy = false;
    const repour = () => {
      if (reduce || busy || !t.classList.contains('poured')) return;
      busy = true;
      t.classList.remove('poured');
      setTimeout(() => { pour(t); setTimeout(() => { busy = false; }, 1800); }, 700);
    };
    t.addEventListener('mouseenter', repour);
    t.addEventListener('focusin', repour);
  });

  /* ---------- animated counters ---------- */
  const cio = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      const el = e.target, to = parseFloat(el.dataset.to || '0');
      cio.unobserve(el);
      const fmt = (v) => Math.round(v).toLocaleString('en-US');
      if (reduce) { el.textContent = fmt(to); continue; }
      const dur = 1600, t0 = performance.now();
      const tick = (t) => {
        const p = clamp((t - t0) / dur, 0, 1);
        const eased = 1 - Math.pow(1 - p, 4);
        el.textContent = fmt(to * eased);
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }
  }, { threshold: 0.5, rootMargin: '4000px 0px 0px 0px' });
  document.querySelectorAll('.n-val').forEach(el => cio.observe(el));

  /* ---------- booking teaser (chips + summary) ---------- */
  const state = { guests: '2', day: 'Saturday', time: '13:00' };
  const sum = document.getElementById('bookSum');
  const note = document.getElementById('bookNote');
  const render = () => {
    if (sum) sum.textContent = `${state.day} · ${state.time} · ${state.guests} guests`;
  };
  document.querySelectorAll('.chips').forEach(group => {
    const key = group.dataset.group;
    group.querySelectorAll('.chip:not(.is-booked)').forEach(chip => {
      chip.addEventListener('click', () => {
        group.querySelectorAll('.chip').forEach(c => c.setAttribute('aria-pressed', 'false'));
        chip.setAttribute('aria-pressed', 'true');
        state[key] = chip.textContent.trim();
        if (note) note.textContent = '';
        render();
      });
    });
  });
  document.getElementById('bookBtn')?.addEventListener('click', () => {
    if (note) note.textContent =
      `Noted — ${state.day.toLowerCase()} at ${state.time}, ${state.guests} guests. ` +
      `(This is a design showcase: no table was reserved, no wine was harmed.)`;
  });
  render();
})();
