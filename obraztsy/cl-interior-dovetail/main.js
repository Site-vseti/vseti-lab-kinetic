/* ============================================================
   DOVETAIL — interactions
   Progressive enhancement: the page reads fully without JS.
   Signature: a canvas 2D orthographic line-drawing of the
   Halyard Lounge that rotates front -> 3/4 -> side on scroll
   or drag, with a material-swatch swap. No libraries.
   ============================================================ */
(() => {
  'use strict';
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const root = document.documentElement;

  /* ---------- theme toggle ---------- */
  const themeBtn = document.getElementById('themeBtn');
  const syncTheme = () => {
    const dark = root.dataset.theme === 'dark';
    themeBtn.setAttribute('aria-pressed', String(dark));
    themeBtn.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
    document.querySelector('meta[name="theme-color"]').setAttribute('content', dark ? '#1a1611' : '#efe8dc');
  };
  syncTheme();
  themeBtn?.addEventListener('click', () => {
    root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem('dovetail-theme', root.dataset.theme); } catch (e) {}
    syncTheme();
    if (typeof redraw === 'function') redraw(true);   /* repaint canvas in new palette */
  });

  /* ---------- hero intro ---------- */
  const hero = document.querySelector('.hero');
  requestAnimationFrame(() => { if (hero) hero.classList.add('loaded'); });

  /* ---------- reveals ---------- */
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
    }
  }, { threshold: 0.14, rootMargin: '0px 0px -6% 0px' });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  /* ---------- animated counters ---------- */
  const cio = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      const el = e.target, to = parseFloat(el.dataset.to), dec = +(el.dataset.dec || 0);
      cio.unobserve(el);
      if (reduce) { el.textContent = to.toFixed(dec); continue; }
      const dur = 1400, t0 = performance.now();
      const tick = (t) => {
        const p = clamp((t - t0) / dur, 0, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = (to * eased).toFixed(dec);
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }
  }, { threshold: 0.6 });
  document.querySelectorAll('.c-num').forEach(el => cio.observe(el));

  /* ---------- commission demo form ---------- */
  const form = document.getElementById('commForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = form.querySelector('#cName'), email = form.querySelector('#cEmail');
      if (!name.checkValidity()) { name.reportValidity(); return; }
      if (!email.checkValidity()) { email.reportValidity(); return; }
      form.innerHTML =
        '<div class="comm-done"><strong>You’re in the book.</strong>' +
        '<span class="mono">demo only — no message sent. we’d normally reply within a day, with a first sketch inside the week.</span></div>';
    });
  }

  /* ============================================================
     Signature — orthographic rotating line-drawing (canvas 2D).
     The Halyard Lounge is a small 3D wireframe; we rotate it
     about the vertical axis and project it flat (no perspective),
     the way a draughtsman draws an elevation. Dimension lines
     read live in millimetres; materials recolour the stroke.
     ============================================================ */
  const canvas = document.getElementById('piece');
  let redraw = null;
  if (canvas) {
    const ctx = canvas.getContext('2d');
    const specCap = document.getElementById('specCap');
    const hintEl = document.getElementById('drawHint');

    /* ---- materials: theme-aware stroke + spec caption ---- */
    const MATS = {
      oak:    { light: '#8a5a22', dark: '#cd9a55', label: 'OAK',    spec: 'OAK — rift-sawn white oak · hard-wax oil · Janka 1360 · moves 0.3%/RH' },
      walnut: { light: '#4f3420', dark: '#c1926e', label: 'WALNUT', spec: 'WALNUT — book-matched American walnut · oiled · Janka 1010 · lightens with age' },
      steel:  { light: '#2c2d31', dark: '#b4b8c0', label: 'STEEL',  spec: 'BLACKENED STEEL — 3 mm hot-rolled · TIG-welded · wax-inhibited · heat-blued frame' },
      linen:  { light: '#7c6b4c', dark: '#dccca6', label: 'LINEN',  spec: 'BELGIAN LINEN — 480 g/m² flax · loose cushion over latex &amp; feather · washable' }
    };
    let mat = 'oak';

    /* ---- model: edges of a mid-century lounge chair (mm) ----
       x = width (right +), y = height (up +), z = depth (front +).
       Centroid is (0, *, 0) so it rotates about its own spine. */
    const box = (cx, cy, cz, w, h, d) => {
      const x0 = cx - w / 2, x1 = cx + w / 2, y0 = cy - h / 2, y1 = cy + h / 2, z0 = cz - d / 2, z1 = cz + d / 2;
      const c = [[x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0], [x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]];
      const idx = [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7]];
      return idx.map(([a, b]) => [c[a], c[b]]);
    };
    /* a prism between a top square (at topY) and bottom square (at 0) — used for splayed legs & the reclined back */
    const prism = (tx, ty, tz, bx, by, bz, s) => {
      const h = s / 2;
      const t = [[tx - h, ty, tz - h], [tx + h, ty, tz - h], [tx + h, ty, tz + h], [tx - h, ty, tz + h]];
      const b = [[bx - h, by, bz - h], [bx + h, by, bz - h], [bx + h, by, bz + h], [bx - h, by, bz + h]];
      const e = [];
      for (let i = 0; i < 4; i++) { e.push([t[i], t[(i + 1) % 4]], [b[i], b[(i + 1) % 4]], [t[i], b[i]]); }
      return e;
    };

    const EDGES = [].concat(
      box(0, 405, 60, 540, 44, 560),                       /* seat slab */
      prism(0, 820, -340, 0, 427, -200, 96),               /* reclined back (leaned back & up) */
      prism(-236, 383, 250, -284, 0, 286, 40),             /* front-left leg */
      prism(236, 383, 250, 284, 0, 286, 40),               /* front-right leg */
      prism(-236, 383, -170, -268, 0, -206, 40),           /* back-left leg */
      prism(236, 383, -170, 268, 0, -206, 40)              /* back-right leg */
    );
    const H_MM = 820;   /* overall height, constant under Y-rotation */

    /* ---- rotation state ---- */
    let angle = reduce ? Math.PI / 2 : 0.0;   /* reduced-motion: side elevation, fixed */
    let target = angle;
    let dragging = false, dragStartX = 0, dragStartA = 0;

    /* ---- palette read from CSS (re-read on theme change) ---- */
    let PAL = {};
    const readPalette = () => {
      const cs = getComputedStyle(root);
      PAL = {
        dim: cs.getPropertyValue('--dim').trim(),
        faint: cs.getPropertyValue('--faint').trim(),
        line: cs.getPropertyValue('--line').trim(),
        accent: cs.getPropertyValue('--accent').trim()
      };
    };

    /* ---- sizing ---- */
    const DPR = () => Math.min(devicePixelRatio || 1, 1.5);
    let W = 0, HH = 0;
    const resize = () => {
      const r = canvas.getBoundingClientRect();
      W = r.width; HH = r.height;
      const d = DPR();
      canvas.width = Math.max(1, Math.round(W * d));
      canvas.height = Math.max(1, Math.round(HH * d));
    };

    const project = (p, s, c) => ({ x: p[0] * c + p[2] * s, y: p[1], depth: -p[0] * s + p[2] * c });

    const elevationName = (a) => {
      const deg = (a * 180 / Math.PI) % 360;
      const d = deg < 0 ? deg + 360 : deg;
      const near = Math.min(d, Math.abs(d - 180), Math.abs(d - 360));
      if (near < 16) return 'FRONT ELEVATION';
      const side = Math.min(Math.abs(d - 90), Math.abs(d - 270));
      if (side < 16) return 'SIDE ELEVATION';
      return 'THREE-QUARTER';
    };

    const tick = (x, y) => { ctx.moveTo(x - 4, y + 4); ctx.lineTo(x + 4, y - 4); };  /* architect's slash tick */

    const paint = () => {
      const d = DPR();
      ctx.setTransform(d, 0, 0, d, 0, 0);
      ctx.clearRect(0, 0, W, HH);
      ctx.lineJoin = 'round'; ctx.lineCap = 'round';

      const s = Math.sin(angle), c = Math.cos(angle);
      const pts = EDGES.map(([a, b]) => [project(a, s, c), project(b, s, c)]);

      /* extents (in mm) for fit + live dimension */
      let minX = Infinity, maxX = -Infinity, minD = Infinity, maxD = -Infinity;
      for (const [a, b] of pts) {
        minX = Math.min(minX, a.x, b.x); maxX = Math.max(maxX, a.x, b.x);
        minD = Math.min(minD, a.depth, b.depth); maxD = Math.max(maxD, a.depth, b.depth);
      }
      const spanX = maxX - minX;
      const scale = Math.min((W * 0.78) / 900, (HH * 0.74) / 1000);
      const cx = W / 2;                         /* model centroid x = 0 -> drawing self-centres */
      const groundY = HH * 0.80;
      const SX = (x) => cx + x * scale;
      const SY = (y) => groundY - y * scale;

      const stroke = PAL[root.dataset.theme === 'dark' ? 'dark' : 'light'];
      const matCol = MATS[mat][root.dataset.theme === 'dark' ? 'dark' : 'light'];
      const dRange = Math.max(1, maxD - minD);

      /* ground line */
      ctx.strokeStyle = PAL.line; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(SX(minX) - 26, groundY); ctx.lineTo(SX(maxX) + 26, groundY); ctx.stroke();

      /* chair edges — depth cues nearer lines darker */
      ctx.lineWidth = 1.7;
      for (const [a, b] of pts) {
        const dep = ((a.depth + b.depth) / 2 - minD) / dRange;   /* 0 far .. 1 near */
        ctx.globalAlpha = 0.5 + 0.5 * dep;
        ctx.strokeStyle = matCol;
        ctx.beginPath(); ctx.moveTo(SX(a.x), SY(a.y)); ctx.lineTo(SX(b.x), SY(b.y)); ctx.stroke();
      }
      ctx.globalAlpha = 1;

      /* ---- dimensions (accent) ---- */
      ctx.strokeStyle = PAL.accent; ctx.fillStyle = PAL.accent;
      ctx.lineWidth = 1;
      ctx.font = '11px "Space Mono", monospace';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';

      /* overall height — left, constant 820 */
      const hx = SX(minX) - 40;
      ctx.beginPath();
      ctx.moveTo(hx, SY(0)); ctx.lineTo(hx, SY(H_MM));
      tick(hx, SY(0)); tick(hx, SY(H_MM));
      ctx.stroke();
      ctx.strokeStyle = PAL.line;
      ctx.beginPath(); ctx.moveTo(hx, SY(0)); ctx.lineTo(SX(minX), SY(0));
      ctx.moveTo(hx, SY(H_MM)); ctx.lineTo(SX(minX), SY(H_MM)); ctx.stroke();
      ctx.save(); ctx.translate(hx - 10, SY(H_MM / 2)); ctx.rotate(-Math.PI / 2);
      ctx.fillText(String(H_MM), 0, 0); ctx.restore();

      /* live length/width — bottom */
      ctx.strokeStyle = PAL.accent;
      const by = groundY + 34;
      ctx.beginPath();
      ctx.moveTo(SX(minX), by); ctx.lineTo(SX(maxX), by);
      tick(SX(minX), by); tick(SX(maxX), by);
      ctx.stroke();
      ctx.strokeStyle = PAL.line;
      ctx.beginPath(); ctx.moveTo(SX(minX), groundY); ctx.lineTo(SX(minX), by);
      ctx.moveTo(SX(maxX), groundY); ctx.lineTo(SX(maxX), by); ctx.stroke();
      ctx.fillStyle = PAL.accent;
      ctx.fillText(String(Math.round(spanX / 10) * 10), (SX(minX) + SX(maxX)) / 2, by + 12);

      /* ---- labels (faint mono) ---- */
      ctx.fillStyle = PAL.faint;
      ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
      ctx.font = '11px "Space Mono", monospace';
      ctx.fillText('DOVETAIL · LOUNGE-01', 18, 26);
      ctx.fillText('SCALE 1:10 · mm', 18, 42);
      ctx.textAlign = 'right';
      ctx.fillStyle = PAL.dim;
      ctx.font = '12px "Space Mono", monospace';
      ctx.fillText(elevationName(angle), W - 18, 26);
      ctx.fillStyle = PAL.faint; ctx.font = '11px "Space Mono", monospace';
      ctx.fillText(MATS[mat].label, W - 18, 42);
    };

    redraw = (force) => { readPalette(); if (force) resize(); paint(); };

    /* ---- material swatches ---- */
    const setMat = (m) => {
      mat = m;
      document.querySelectorAll('.swatch').forEach(btn => {
        const on = btn.dataset.mat === m;
        btn.classList.toggle('is-active', on);
        btn.setAttribute('aria-pressed', String(on));
      });
      if (specCap) specCap.innerHTML = MATS[m].spec;
      readPalette(); paint();
    };
    document.querySelectorAll('.swatch').forEach(btn => {
      btn.addEventListener('click', () => setMat(btn.dataset.mat));
    });

    /* ---- init ---- */
    readPalette();
    const ro = new ResizeObserver(() => { resize(); paint(); });
    ro.observe(canvas);
    resize();

    if (reduce) {
      /* one clean side elevation; swatch swap still works, no loop, no rotation */
      paint();
      if (hintEl) hintEl.textContent = 'side elevation · choose a material';
    } else {
      /* drag to inspect */
      const onDown = (e) => {
        dragging = true; canvas.classList.add('is-drag');
        dragStartX = (e.touches ? e.touches[0].clientX : e.clientX);
        dragStartA = angle;
        wake();
      };
      const onMove = (e) => {
        if (!dragging) return;
        const x = (e.touches ? e.touches[0].clientX : e.clientX);
        angle = dragStartA + (x - dragStartX) * 0.006;
        target = angle;                     /* dragged position sticks until next scroll */
        wake();
        if (e.cancelable && !e.touches) e.preventDefault();
      };
      const onUp = () => { dragging = false; canvas.classList.remove('is-drag'); };
      canvas.addEventListener('mousedown', onDown);
      addEventListener('mousemove', onMove);
      addEventListener('mouseup', onUp);
      canvas.addEventListener('touchstart', onDown, { passive: true });
      canvas.addEventListener('touchmove', onMove, { passive: true });
      canvas.addEventListener('touchend', onUp);

      /* render loop — eases toward target, then idles (no wasted frames) */
      let visible = false, raf = 0, last = 0;
      const settled = () => !dragging && Math.abs(target - angle) < 0.0006;
      const loop = (t) => {
        if (!visible) { raf = 0; return; }
        if (!dragging) angle += (target - angle) * 0.12;   /* ease toward target */
        if (t - last >= 22) { paint(); last = t; }
        if (settled()) { paint(); raf = 0; return; }       /* idle until woken */
        raf = requestAnimationFrame(loop);
      };
      const wake = () => { if (visible && !raf) { last = 0; raf = requestAnimationFrame(loop); } };

      /* scroll drives the target angle: front (top) -> past side (bottom) */
      const section = document.getElementById('joinery');
      const onScroll = () => {
        if (dragging) return;
        const r = section.getBoundingClientRect();
        const vh = innerHeight || 1;
        const p = clamp((vh - r.top) / (vh + r.height), 0, 1);
        target = p * (Math.PI * 0.56);      /* 0deg -> ~101deg */
        wake();
      };
      onScroll();
      addEventListener('scroll', onScroll, { passive: true });
      addEventListener('resize', onScroll);

      const vio = new IntersectionObserver((es) => {
        visible = es[0].isIntersecting;
        if (visible) wake();
      }, { threshold: 0 });
      vio.observe(canvas);
      paint();
    }
  }
})();
