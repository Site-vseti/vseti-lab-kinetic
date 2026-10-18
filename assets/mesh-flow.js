/* Фон первого экрана: сетка из точек, почти невидимая, пока курсор (или палец,
   а без них — плавный автопилот) не стягивает её в воронку, линии гнутся, как
   резиновая плёнка под грузом. Canvas 2D, без библиотек. Включается классом
   mesh-on у .hero; убрать класс — вернётся прежнее фото. */
(function () {
  var hero = document.querySelector('.hero.mesh-on');
  var cv = document.getElementById('meshFlow');
  if (!hero || !cv || !cv.getContext) return;
  var ctx = cv.getContext('2d');
  var root = document.documentElement;
  var RM = matchMedia('(prefers-reduced-motion: reduce)').matches;

  var P = { sp: 24, dot: 1.8, lw: 1, pull: 150, str: .95, glow: 270, rest: .1, peak: .95, follow: .16 };
  var W = 0, H = 0, dpr = 1, k = 1, sp = 24, R = 190, G = 320;
  var cols = 0, rows = 0, ox = 0, oy = 0, X, Y, A;
  var cx = 0, cy = 0, tx = 0, ty = 0, lastInput = -1e9, mouseIn = false, running = false, visible = true, raf = 0;
  var cLine = '132,244,234', cDot = '234,255,253', cGold = '232,199,102';

  function rgb(v, fb) {
    v = (v || '').trim();
    var m = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(v);
    if (!m) return fb;
    var h = m[1].length === 3 ? m[1].replace(/./g, '$&$&') : m[1];
    return [0, 2, 4].map(function (i) { return parseInt(h.substr(i, 2), 16); }).join(',');
  }
  function colors() {
    var s = getComputedStyle(root);
    cLine = rgb(s.getPropertyValue('--tif'), cLine);
    cDot = rgb(s.getPropertyValue('--ink'), cDot);
    cGold = rgb(s.getPropertyValue('--gold2'), cGold);
    if (!running) frame(performance.now(), true);
  }

  function resize() {
    var r = cv.getBoundingClientRect();
    if (!r.width || !r.height) return;
    W = r.width; H = r.height;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
    k = Math.max(.62, Math.min(1.15, Math.min(W, H) / 720));
    sp = W < 520 ? 22 : P.sp; R = P.pull * k; G = P.glow * k;
    cols = Math.ceil(W / sp) + 3; rows = Math.ceil(H / sp) + 3;
    ox = (W - (cols - 1) * sp) / 2; oy = (H - (rows - 1) * sp) / 2;
    X = new Float32Array(cols * rows); Y = new Float32Array(cols * rows); A = new Float32Array(cols * rows);
    if (!cx && !cy) { cx = tx = W * .62; cy = ty = H * .6; }
    if (!running) frame(performance.now(), true);
  }

  function autopilot(t) {
    tx = W * (.5 + .3 * Math.sin(t * .00021));
    ty = H * (.56 + .2 * Math.sin(t * .00029 + 1.3));
  }

  var NB = 10, buckets = [];
  for (var b = 0; b < NB; b++) buckets.push([]);

  function frame(t, still) {
    if (!W) return;
    if (!still) {
      if (!mouseIn && t - lastInput > 2500) autopilot(t);
      cx += (tx - cx) * P.follow; cy += (ty - cy) * P.follow;
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);

    var R2 = R * R, G2 = G * G, span = P.peak - P.rest, i, j, n, dx, dy, r2, f;
    for (j = 0; j < rows; j++) for (i = 0; i < cols; i++) {
      n = j * cols + i;
      dx = ox + i * sp - cx; dy = oy + j * sp - cy; r2 = dx * dx + dy * dy;
      f = 1 - P.str * Math.exp(-r2 / R2);
      X[n] = cx + dx * f; Y[n] = cy + dy * f;
      A[n] = P.rest + span * Math.exp(-r2 / G2);
    }

    var g = ctx.createRadialGradient(cx, cy, 0, cx, cy, G * .9);
    g.addColorStop(0, 'rgba(' + cLine + ',.16)');
    g.addColorStop(.35, 'rgba(' + cLine + ',.06)');
    g.addColorStop(1, 'rgba(' + cLine + ',0)');
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    var gc = ctx.createRadialGradient(cx, cy, 0, cx, cy, R * .55);
    gc.addColorStop(0, 'rgba(' + cGold + ',.18)');
    gc.addColorStop(1, 'rgba(' + cGold + ',0)');
    ctx.fillStyle = gc; ctx.fillRect(cx - R, cy - R, R * 2, R * 2);
    var gn = ctx.createRadialGradient(cx, cy, 0, cx, cy, 16 * k);
    gn.addColorStop(0, 'rgba(' + cDot + ',.55)');
    gn.addColorStop(1, 'rgba(' + cLine + ',0)');
    ctx.fillStyle = gn; ctx.fillRect(cx - 16 * k, cy - 16 * k, 32 * k, 32 * k);

    /* линии — только там, где сетка проявилась */
    var thr = P.rest + .03, a, q;
    for (b = 0; b < NB; b++) buckets[b].length = 0;
    var i0 = Math.max(0, Math.floor((cx - ox - 2.2 * G) / sp)), i1 = Math.min(cols - 1, Math.ceil((cx - ox + 2.2 * G) / sp));
    var j0 = Math.max(0, Math.floor((cy - oy - 2.2 * G) / sp)), j1 = Math.min(rows - 1, Math.ceil((cy - oy + 2.2 * G) / sp));
    for (j = j0; j <= j1; j++) for (i = i0; i <= i1; i++) {
      n = j * cols + i; a = A[n];
      if (a < thr) continue;
      q = Math.min(NB - 1, Math.floor((a - thr) / (P.peak - thr) * NB));
      if (i < i1 && A[n + 1] >= thr) buckets[q].push(n, n + 1);
      if (j < j1 && A[n + cols] >= thr) buckets[q].push(n, n + cols);
    }
    ctx.lineWidth = P.lw;
    for (b = 0; b < NB; b++) {
      var L = buckets[b]; if (!L.length) continue;
      ctx.strokeStyle = 'rgba(' + cLine + ',' + (thr + (b + .5) / NB * (P.peak - thr)) + ')';
      ctx.beginPath();
      for (var m = 0; m < L.length; m += 2) { ctx.moveTo(X[L[m]], Y[L[m]]); ctx.lineTo(X[L[m + 1]], Y[L[m + 1]]); }
      ctx.stroke();
    }

    /* точки — по всей площади, яркость по удалённости от воронки */
    var d = P.dot * (k < .8 ? .9 : 1), h = d / 2, lev = 8;
    for (b = 0; b < lev; b++) {
      var lo = P.rest + span * b / lev, hi = P.rest + span * (b + 1) / lev;
      ctx.fillStyle = 'rgba(' + cDot + ',' + Math.min(1, (lo + hi) / 2 + .02) + ')';
      ctx.beginPath();
      for (n = 0; n < A.length; n++) {
        a = A[n];
        if (a >= lo && (a < hi || b === lev - 1)) ctx.rect(X[n] - h, Y[n] - h, d, d);
      }
      ctx.fill();
    }
  }

  function loop(t) {
    raf = 0;
    if (!running) return;
    frame(t, false);
    raf = requestAnimationFrame(loop);
  }
  function setRun(on) {
    on = on && visible && !document.hidden && !RM && !root.classList.contains('hc');
    if (on === running) return;
    running = on;
    if (on && !raf) raf = requestAnimationFrame(loop);
  }

  function point(x, y) {
    var r = cv.getBoundingClientRect();
    tx = x - r.left; ty = y - r.top; lastInput = performance.now();
    if (RM) { cx = tx; cy = ty; frame(lastInput, true); }
  }
  /* слушаем окно: поверх первого экрана лежат другие слои, до .hero события доходят не везде */
  window.addEventListener('pointermove', function (e) {
    if (e.pointerType !== 'mouse') return;
    var r = cv.getBoundingClientRect();
    var inside = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
    if (inside) { mouseIn = true; point(e.clientX, e.clientY); }
    else if (mouseIn) { mouseIn = false; lastInput = -1e9; }
  }, { passive: true });
  document.addEventListener('mouseleave', function () { mouseIn = false; lastInput = -1e9; });
  function touch(e) {
    var t = e.touches[0]; if (!t) return;
    var r = cv.getBoundingClientRect();
    if (t.clientY >= r.top && t.clientY <= r.bottom) point(t.clientX, t.clientY);
  }
  window.addEventListener('touchstart', touch, { passive: true });
  window.addEventListener('touchmove', touch, { passive: true });

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (es) { visible = es[0].isIntersecting; setRun(true); }).observe(hero);
  }
  document.addEventListener('visibilitychange', function () { setRun(true); });
  new MutationObserver(function () { colors(); setRun(true); }).observe(root, { attributes: true, attributeFilter: ['class'] });
  var rt = 0;
  function later() { clearTimeout(rt); rt = setTimeout(resize, 120); }
  if ('ResizeObserver' in window) new ResizeObserver(later).observe(cv);
  else window.addEventListener('resize', later);

  colors(); resize(); setRun(true);
})();
