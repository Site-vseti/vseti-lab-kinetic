/* Надпись «в сети» в шапке собирается из звёздной пыли.
   Берём пиксели настоящего текста (тот же шрифт, кегль и положение базовой линии, что у DOM-надписи),
   раскладываем по ним частицы; частицы стартуют рассыпанными по экрану и слетаются в буквы,
   потом проявляется обычный текст, а холст гаснет и удаляется.
   Надпись всё время лежит в разметке (поиск, скринридеры). Без библиотек и внешних запросов.
   Один раз за визит (sessionStorage); при prefers-reduced-motion сразу обычный текст.
   Ждёт, пока уедет вступительная заставка #intro, чтобы пыль была видна. */
(function () {
  'use strict';
  var root = document.documentElement, KEY = 'vseti-logo-dust';
  var reduced = window.matchMedia && matchMedia('(prefers-reduced-motion:reduce)').matches;
  var seen = false;
  try { seen = sessionStorage.getItem(KEY) === '1'; } catch (e) {}
  if (reduced || seen || !window.requestAnimationFrame) return;      // обычный текст, ничего не прячем

  root.classList.add('ld-pre');                                       // до отрисовки шапки: надпись скрыта (в CSS есть запасной таймер)

  function ready(fn) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn); else fn();
  }

  ready(function () {
    var word = document.querySelector('.hdr .bname');
    var text = word ? (word.textContent || '').trim() : '';
    function show() {
      if (word) word.classList.add('in');
      setTimeout(function () { root.classList.remove('ld-pre'); }, 900);
    }
    if (!word || !text) { show(); return; }

    var mobile = matchMedia('(max-width:768px)').matches;
    var TARGET = mobile ? 420 : 820;                                  // сколько частиц пытаемся набрать

    var intro = document.getElementById('intro'), started = false;
    function introGone() { return !intro || getComputedStyle(intro).display === 'none'; }
    function start() {
      if (started) return; started = true;
      var fam = getComputedStyle(word).fontFamily;
      var fontReady = (document.fonts && document.fonts.load) ? document.fonts.load('700 40px ' + fam, text) : Promise.resolve();
      Promise.race([fontReady, new Promise(function (r) { setTimeout(r, 1500); })])
        .then(function () { requestAnimationFrame(begin); }, function () { requestAnimationFrame(begin); });
    }
    if (introGone()) start();
    else {
      if (window.MutationObserver) {
        var mo = new MutationObserver(function () { if (introGone()) { mo.disconnect(); start(); } });
        mo.observe(intro, { attributes: true, attributeFilter: ['style', 'class'] });
      }
      setTimeout(start, 7000);                                        // запасной вариант: заставка не должна держать надпись вечно
    }

    function rgb(str) {
      var m = /rgba?\(\s*([\d.]+)[ ,]+([\d.]+)[ ,]+([\d.]+)/.exec(str || '');
      if (m) return [+m[1], +m[2], +m[3]];
      m = /^\s*#([0-9a-f]{3}|[0-9a-f]{6})\s*$/i.exec(str || '');
      if (!m) return null;
      var h = m[1].length === 3 ? m[1].replace(/./g, '$&$&') : m[1];
      return [parseInt(h.substr(0, 2), 16), parseInt(h.substr(2, 2), 16), parseInt(h.substr(4, 2), 16)];
    }
    function mix(a, b, t) { return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]; }
    function css(c, a) { return 'rgba(' + (c[0] | 0) + ',' + (c[1] | 0) + ',' + (c[2] | 0) + ',' + a + ')'; }
    function sprite(core, mid) {
      var c = document.createElement('canvas'); c.width = c.height = 48;
      var x = c.getContext('2d'), g = x.createRadialGradient(24, 24, 0, 24, 24, 24);
      g.addColorStop(0, css(core, 1)); g.addColorStop(.2, css(core, 1)); g.addColorStop(.44, css(mid, .55)); g.addColorStop(1, css(mid, 0));
      x.fillStyle = g; x.fillRect(0, 0, 48, 48);
      return c;
    }

    function begin() {
      if (document.hidden) { show(); return; }
      var cs = getComputedStyle(word), fs = parseFloat(cs.fontSize);
      var wr = word.getBoundingClientRect();
      if (!wr.width || !wr.height) { show(); return; }
      try { sessionStorage.setItem(KEY, '1'); } catch (e) {}

      /* 1. растр слова: тот же шрифт и кегль; поля сверху/снизу/по бокам, чтобы ничего не обрезалось */
      var PX = Math.ceil(fs * .15), PY = Math.ceil(fs * .5);
      var rw = Math.ceil(wr.width) + 2 * PX, rh = Math.ceil(wr.height) + 2 * PY;
      var off = document.createElement('canvas'); off.width = rw; off.height = rh;
      var oc = off.getContext('2d', { willReadFrequently: true });
      var fam = cs.fontFamily, wt = cs.fontWeight, ls = cs.letterSpacing === 'normal' ? 0 : parseFloat(cs.letterSpacing) || 0;
      var hasLS = 'letterSpacing' in oc;
      oc.font = wt + ' ' + fs + 'px ' + fam; if (hasLS) oc.letterSpacing = ls + 'px';
      var m0 = oc.measureText(text).width;
      var k = m0 ? wr.width / m0 : 1;                                 // 1, если у страницы нет zoom
      oc.font = wt + ' ' + (fs * k) + 'px ' + fam; if (hasLS) oc.letterSpacing = (ls * k) + 'px';
      var mm = oc.measureText(text);
      var asc = mm.fontBoundingBoxAscent, desc = mm.fontBoundingBoxDescent;
      if (asc == null) { asc = fs * k * .995; desc = fs * k * .245; }
      var base = (wr.height - (asc + desc)) / 2 + asc;
      oc.fillStyle = '#fff'; oc.textBaseline = 'alphabetic'; oc.fillText(text, PX, PY + base);
      var data = oc.getImageData(0, 0, rw, rh).data, filled = 0, i;
      for (i = 3; i < data.length; i += 4) if (data[i] > 128) filled++;
      if (!filled) { show(); return; }

      /* 2. точки: по сетке с шагом, при котором набирается ~TARGET частиц */
      var g = Math.max(2, Math.sqrt(filled / TARGET)), pts = [], x, y;
      for (y = g / 2; y < rh; y += g) for (x = g / 2; x < rw; x += g) {
        if (data[((y | 0) * rw + (x | 0)) * 4 + 3] > 110) {
          pts.push([x + (Math.random() - .5) * g * .7 - PX, y + (Math.random() - .5) * g * .7 - PY]);   // от левого верхнего угла надписи
        }
      }

      /* 3. холст на весь экран, поверх шапки; клики и прокрутка проходят сквозь него */
      var W = window.innerWidth, H = window.innerHeight;
      var cv = document.createElement('canvas'); cv.className = 'ld-canvas'; cv.setAttribute('aria-hidden', 'true');
      cv.style.width = W + 'px'; cv.style.height = H + 'px';
      var ctx = cv.getContext('2d');
      var dpr = Math.min(window.devicePixelRatio || 1, mobile ? 1.25 : 1.5);
      cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
      root.appendChild(cv);

      /* цвет пыли берём у самой надписи; на светлой теме частицы тёмные (светлое на светлом не видно) */
      var base0 = rgb(cs.color) || [132, 244, 234], gold = rgb(getComputedStyle(root).getPropertyValue('--gold2')) || [232, 199, 102];
      var light = root.classList.contains('light');
      var white = [255, 255, 255], black = [0, 0, 0];
      var SP = light
        ? [sprite(base0, base0), sprite(mix(base0, black, .25), base0), sprite(gold, gold)]
        : [sprite(mix(base0, white, .75), base0), sprite(mix(base0, white, .35), base0), sprite(mix(gold, white, .35), gold)];
      var sz = Math.max(.42, Math.min(.85, fs / 80)) * (mobile ? .92 : 1);

      var ox0 = wr.left, oy0 = wr.top;
      var P = pts.map(function (q) {
        var sx = (Math.random() * 1.3 - .15) * W, sy = (Math.random() * 1.2 - .1) * H;
        var dx = ox0 + q[0] - sx, dy = oy0 + q[1] - sy, len = Math.hypot(dx, dy) || 1;
        return { qx: q[0], qy: q[1], sx: sx, sy: sy, dx: dx / len, dy: dy / len, cv: (Math.random() - .5) * len * .42,
                 d: Math.random() * .45, du: .9 + Math.random() * .8, r: (.9 + Math.random() * 1.1) * sz,
                 c: (Math.random() * 3) | 0, tw: 2 + Math.random() * 4, ph: Math.random() * 6.28 };
      });

      var T0 = 0, raf = 0, fin = false, dead = false, W0 = W;
      function cleanup() {
        if (dead) return; dead = true;
        cancelAnimationFrame(raf); window.removeEventListener('resize', onResize);
        if (cv.parentNode) cv.parentNode.removeChild(cv);
      }
      function finish() {
        if (fin) return; fin = true;
        show(); cv.classList.add('out');
        setTimeout(cleanup, 1100);
      }
      function onResize() { if (window.innerWidth !== W0) finish(); }   // смена высоты (панель адреса на телефоне) не считается
      window.addEventListener('resize', onResize);

      function frame(now) {
        if (dead) return;
        raf = requestAnimationFrame(frame);
        if (!T0) T0 = now;
        var t = (now - T0) / 1000;
        var w2 = word.getBoundingClientRect(), ox = w2.left, oy = w2.top;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.clearRect(0, 0, W, H);
        var a0 = Math.min(1, t / .35), n = P.length;
        for (var j = 0; j < n; j++) {
          var p = P[j];
          var u = (t - p.d) / p.du; u = u < 0 ? 0 : u > 1 ? 1 : u;
          var e = 1 - Math.pow(1 - u, 3);                             // easeOutCubic
          var tx = ox + p.qx, ty = oy + p.qy;
          var px = p.sx + (tx - p.sx) * e, py = p.sy + (ty - p.sy) * e;
          var s = Math.sin(Math.PI * e) * p.cv;                       // изгиб траектории: частицы закручиваются
          px += -p.dy * s; py += p.dx * s;
          var tw = Math.sin(t * p.tw + p.ph);
          if (u >= 1) { px += tw * .4; py += Math.cos(t * p.tw + p.ph) * .4; }
          var al = a0 * (.5 + .5 * e) * (u >= 1 ? .8 + .2 * tw : 1);
          var d = p.r * (1.7 - .6 * e) * 5.4;
          ctx.globalAlpha = al;
          ctx.drawImage(SP[p.c], px - d / 2, py - d / 2, d, d);
        }
        ctx.globalAlpha = 1;
        if (!fin && t > 1.75) finish();
      }
      raf = requestAnimationFrame(frame);
    }
  });
})();
