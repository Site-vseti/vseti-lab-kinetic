/* Надпись «всети» в шапке живёт из звёздной пыли.
   При загрузке частицы слетаются со всего верхнего экрана в буквы; потом каждые 15 секунд
   надпись рассыпается в звёздную пыль и снова собирается — бесконечно, пока вкладка видна.
   Берём пиксели настоящего текста (тот же шрифт, кегль и положение, что у DOM-надписи) и раскладываем по ним частицы.
   Надпись всё время лежит в разметке (поиск, скринридеры); пока идёт анимация, DOM-текст прячется, потом проявляется.
   Между сборками анимации нет вовсе: ни кадров, ни таймеров, кроме одного отсчёта до следующей.
   Скрытая вкладка — пауза. prefers-reduced-motion — обычный текст. Без библиотек и внешних запросов.
   Ждёт, пока уедет вступительная заставка #intro, чтобы пыль была видна. */
(function () {
  'use strict';
  var root = document.documentElement;
  var PERIOD = 15000;                                                  // раз в 15 секунд надпись рассыпается и собирается
  var reduced = window.matchMedia && matchMedia('(prefers-reduced-motion:reduce)').matches;
  if (reduced || !window.requestAnimationFrame) return;               // обычный текст, ничего не прячем

  root.classList.add('ld-pre');                                       // до отрисовки шапки: надпись скрыта (в CSS есть запасной таймер)

  function ready(fn) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn); else fn();
  }

  ready(function () {
    var word = document.querySelector('.hdr .bname');
    var text = word ? (word.textContent || '').trim() : '';
    function reveal() {
      if (word) { word.classList.remove('ld-off'); word.classList.add('in'); }
      setTimeout(function () { root.classList.remove('ld-pre'); }, 900);
    }
    if (!word || !text) { reveal(); return; }

    /* ---------- вспомогательное ---------- */
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
    function sprite(core, mid) {                                       // мягкая звёздочка: яркое ядро и ореол
      var c = document.createElement('canvas'); c.width = c.height = 48;
      var x = c.getContext('2d'), g = x.createRadialGradient(24, 24, 0, 24, 24, 24);
      g.addColorStop(0, css(core, 1)); g.addColorStop(.2, css(core, 1)); g.addColorStop(.42, css(mid, .6)); g.addColorStop(1, css(mid, 0));
      x.fillStyle = g; x.fillRect(0, 0, 48, 48);
      return c;
    }
    function rnd(a, b) { return a + Math.random() * (b - a); }
    function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }

    /* ---------- растр слова -> точки ---------- */
    var cache = null;                                                  // {key, pts, ...} пересобирается при смене размера, цвета, темы
    function build(wr, cs, mobile) {
      var fs = parseFloat(cs.fontSize);
      var key = [wr.width.toFixed(1), wr.height.toFixed(1), fs, cs.color, mobile ? 1 : 0, root.classList.contains('light') ? 1 : 0].join('|');
      if (cache && cache.key === key) return cache;
      var fam = cs.fontFamily, wt = cs.fontWeight, ls = cs.letterSpacing === 'normal' ? 0 : parseFloat(cs.letterSpacing) || 0;
      var off = document.createElement('canvas'), oc = off.getContext('2d', { willReadFrequently: true });
      var hasLS = 'letterSpacing' in oc;
      oc.font = wt + ' ' + fs + 'px ' + fam; if (hasLS) oc.letterSpacing = ls + 'px';
      var m0 = oc.measureText(text).width;
      var k = m0 ? wr.width / m0 : 1;                                  // 1, если у страницы нет zoom (иначе — поправка на увеличенный шрифт)
      var fpx = fs * k;
      var PX = Math.ceil(fpx * .15), PY = Math.ceil(fpx * .5);        // поля, чтобы ничего не обрезалось
      var rw = Math.ceil(wr.width) + 2 * PX, rh = Math.ceil(wr.height) + 2 * PY;
      off.width = rw; off.height = rh;
      oc.font = wt + ' ' + fpx + 'px ' + fam; if (hasLS) oc.letterSpacing = (ls * k) + 'px';
      var mm = oc.measureText(text);
      var asc = mm.fontBoundingBoxAscent, desc = mm.fontBoundingBoxDescent;
      if (asc == null) { asc = fpx * .995; desc = fpx * .245; }
      var base = (wr.height - (asc + desc)) / 2 + asc;
      oc.fillStyle = '#fff'; oc.textBaseline = 'alphabetic'; oc.fillText(text, PX, PY + base);
      var data = oc.getImageData(0, 0, rw, rh).data, filled = 0, i;
      for (i = 3; i < data.length; i += 4) if (data[i] > 128) filled++;
      if (!filled) return null;
      var TARGET = mobile ? 520 : 1100;                                // сколько частиц пытаемся набрать
      var g = Math.max(1.8, Math.sqrt(filled / TARGET)), pts = [], x, y;
      for (y = g / 2; y < rh; y += g) for (x = g / 2; x < rw; x += g) {
        if (data[((y | 0) * rw + (x | 0)) * 4 + 3] > 110) {
          pts.push([x + (Math.random() - .5) * g * .7 - PX, y + (Math.random() - .5) * g * .7 - PY]);   // от левого верхнего угла надписи
        }
      }
      for (i = pts.length - 1; i > 0; i--) { var j = (Math.random() * (i + 1)) | 0, t = pts[i]; pts[i] = pts[j]; pts[j] = t; }   // перемешать: при нехватке мощности лишние частицы отбрасываются равномерно
      cache = { key: key, pts: pts, fs: fpx };
      return cache;
    }

    /* ---------- холст: один на страницу, живёт в <html>, клики и прокрутка проходят сквозь него ---------- */
    var cv = document.createElement('canvas'); cv.className = 'ld-canvas out'; cv.setAttribute('aria-hidden', 'true');
    var ctx = cv.getContext('2d'), cvW = 0, cvH = 0, cvD = 0;
    cv.style.visibility = 'hidden';
    root.appendChild(cv);

    /* ---------- состояние ---------- */
    var posDirty = false, animStart = 0, anim = null, raf = 0, timer = 0, due = 0, remain = PERIOD, ready0 = false, lastScroll = 0, defers = 0, offTimer = 0;

    function stop() {                                                  // остановить кадры, показать настоящий текст, плавно погасить холст
      if (!anim) return;
      anim = null; cancelAnimationFrame(raf);
      reveal();
      cv.classList.add('out');
      clearTimeout(offTimer);
      offTimer = setTimeout(function () { ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, cv.width, cv.height); cv.style.visibility = 'hidden'; }, 1000);
    }

    function arm(ms) {
      clearTimeout(timer); remain = ms; due = performance.now() + ms;
      timer = setTimeout(function () { timer = 0; cycle(); }, ms);
    }

    function play(mode) {                                              // mode: 'in' — слёт при загрузке, 'cycle' — рассыпаться и собраться
      if (document.hidden || anim) return false;
      var mobile = matchMedia('(max-width:768px)').matches;
      var cs = getComputedStyle(word), wr = word.getBoundingClientRect();
      if (!wr.width || !wr.height) return false;
      var B = build(wr, cs, mobile);
      if (!B) return false;

      var W = root.clientWidth || window.innerWidth, H = window.innerHeight;
      var Hc = Math.min(H, mobile ? 520 : 640);                         // холст только на верхнюю часть экрана — дешевле
      var dpr = mobile ? 1 : Math.min(window.devicePixelRatio || 1, 1.5);
      if (cvW !== W || cvH !== Hc || cvD !== dpr) {
        cvW = W; cvH = Hc; cvD = dpr;
        cv.width = Math.round(W * dpr); cv.height = Math.round(Hc * dpr);
        cv.style.width = W + 'px'; cv.style.height = Hc + 'px';
      }
      clearTimeout(offTimer);
      cv.style.transition = 'none'; cv.classList.remove('out'); cv.style.visibility = 'visible'; void cv.offsetWidth; cv.style.transition = '';
      ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, cv.width, cv.height);

      /* цвет пыли берём у самой надписи; на светлой теме частицы тёмные (светлое на светлом не видно) */
      var base0 = rgb(cs.color) || [132, 244, 234], gold = rgb(getComputedStyle(root).getPropertyValue('--gold2')) || [232, 199, 102];
      var light = root.classList.contains('light'), white = [255, 255, 255], black = [0, 0, 0];
      var SP = light
        ? [sprite(base0, base0), sprite(mix(base0, black, .3), base0), sprite(mix(gold, black, .25), gold)]
        : [sprite(mix(base0, white, .8), base0), sprite(mix(base0, white, .4), base0), sprite(mix(gold, white, .4), gold)];
      var sz = clamp(B.fs / 64, .66, 1) * (mobile ? .9 : 1);

      var ox0 = wr.left, oy0 = wr.top, cx = wr.left + wr.width / 2;
      var cyc = mode === 'cycle', T1 = 1.25;                            // в 'cycle' до T1 — разлёт, после — сбор
      var END = cyc ? 3.5 : 3.1;
      var P = B.pts.map(function (q) {
        var sx, sy;
        if (cyc) {                                                      // облако вокруг надписи, вниз по экрану
          var gx = (Math.random() + Math.random() + Math.random() - 1.5) / 1.5;
          sx = clamp(cx + gx * (wr.width * .9 + 230), 6, W - 6);
          sy = clamp(oy0 - 8 + Math.pow(Math.random(), .8) * (mobile ? 300 : 340), 4, Hc - 4);
        } else {                                                        // слёт со всего верхнего экрана
          sx = rnd(-.04, 1.04) * W; sy = rnd(-.02, 1.0) * Hc;
        }
        return { qx: q[0], qy: q[1], sx: sx, sy: sy,
                 cv: rnd(-.5, .5), d1: Math.random() * .12, du1: rnd(.7, 1.05),
                 d: Math.random() * (cyc ? .45 : .7), du: cyc ? rnd(1.1, 1.7) : rnd(1.3, 2.3),
                 r: rnd(1, 2.2) * sz, c: (Math.random() * 3) | 0, tw: 2 + Math.random() * 4, ph: Math.random() * 6.28 };
      });

      if (cyc) word.classList.add('ld-off');
      var T0 = 0, last = 0, ema = 0, nf = 0, frac = 1, fi = 0, ox = ox0, oy = oy0, Wc = cvW, Hcc = cvH;
      var me = anim = { }; animStart = performance.now();

      function frame(now) {
        if (anim !== me) return;
        raf = requestAnimationFrame(frame);
        if (!T0) T0 = now;
        var t = (now - T0) / 1000;
        /* защита слабых телефонов: если кадры длиннее ~38 мс, понемногу рисуем меньше частиц */
        if (last) { var dt = now - last; ema = ema ? ema * .9 + dt * .1 : dt; if (++nf > 20 && ema > 38 && frac > .38) { frac *= .82; nf = 0; ema = 20; } }
        last = now;
        if (posDirty && (fi++ & 3) === 0) { posDirty = false; var w2 = word.getBoundingClientRect(); if (w2.width) { ox = w2.left; oy = w2.top; } }   // шапка закреплена: позицию перечитываем только после прокрутки (чтение раскладки в кадре дорого)
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.globalCompositeOperation = 'destination-out';              // шлейфы: не стираем холст, а лишь гасим предыдущий кадр
        ctx.fillStyle = 'rgba(0,0,0,.3)'; ctx.fillRect(0, 0, Wc, Hcc);
        ctx.globalCompositeOperation = 'source-over';
        var n = (P.length * frac) | 0, a0 = cyc ? 1 : Math.min(1, t / .3);
        for (var j = 0; j < n; j++) {
          var p = P[j], tx = ox + p.qx, ty = oy + p.qy, x0, y0, x1, y1, u, e, burst = false;
          if (cyc && t < T1) { burst = true; u = (t - p.d1) / p.du1; x0 = tx; y0 = ty; x1 = p.sx; y1 = p.sy; }
          else { u = (t - (cyc ? T1 : 0) - p.d) / p.du; x0 = p.sx; y0 = p.sy; x1 = tx; y1 = ty; }
          u = u < 0 ? 0 : u > 1 ? 1 : u;
          e = 1 - Math.pow(1 - u, 3);                                   // easeOutCubic
          var dx = x1 - x0, dy = y1 - y0, len = Math.sqrt(dx * dx + dy * dy) || 1;
          var s = Math.sin(Math.PI * e) * p.cv * len;                   // изгиб траектории: частицы закручиваются
          var px = x0 + dx * e - dy / len * s, py = y0 + dy * e + dx / len * s;
          var tw = Math.sin(t * p.tw + p.ph), al, size;
          if (burst) { al = 1 - .35 * e; size = 1 + .2 * e; }
          else { al = (cyc ? .65 : .5) + (cyc ? .35 : .5) * e; size = 1.45 - .75 * e; }
          if (!burst && u >= 1) { px += tw * .4; py += Math.cos(t * p.tw + p.ph) * .4; al = .82 + .18 * tw; }
          var d = p.r * 6.4 * size;
          ctx.globalAlpha = al * a0;
          ctx.drawImage(SP[p.c], px - d / 2, py - d / 2, d, d);
        }
        ctx.globalAlpha = 1;
        if (t > END) stop();
      }
      raf = requestAnimationFrame(frame);
      return true;
    }

    function cycle() {                                                 // пора рассыпаться
      if (document.hidden) return;                                     // скрытая вкладка: ждём возвращения (см. visibilitychange)
      if (matchMedia('(prefers-reduced-motion:reduce)').matches) { arm(PERIOD); return; }
      if (performance.now() - lastScroll < 350 && defers < 6) { defers++; arm(500); return; }   // не мешаем активной прокрутке
      defers = 0;
      arm(PERIOD);                                                     // период считаем от начала анимации
      play('cycle');
    }

    window.addEventListener('scroll', function () {                      // листание важнее эффекта: если пользователь начал прокрутку, пыль сразу оседает в текст
      lastScroll = performance.now(); posDirty = true;
      if (anim && lastScroll - animStart > 300) stop();
    }, { passive: true });
    var W0 = window.innerWidth;
    window.addEventListener('resize', function () {                      // ширина окна изменилась — дособирать не будем, покажем текст (смена высоты из-за панели адреса на телефоне не в счёт)
      if (window.innerWidth !== W0) { W0 = window.innerWidth; if (anim) stop(); }
    });
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) {
        if (anim) { stop(); remain = PERIOD; }
        else if (timer) remain = Math.max(1500, due - performance.now());
        clearTimeout(timer); timer = 0;
      } else if (ready0 && !anim && !timer) arm(remain);
    });

    /* ---------- запуск: ждём заставку и шрифт ---------- */
    var intro = document.getElementById('intro'), started = false;
    function introGone() { return !intro || !intro.isConnected || getComputedStyle(intro).display === 'none'; }
    function start() {
      if (started) return; started = true;
      var fam = getComputedStyle(word).fontFamily;
      var fontReady = (document.fonts && document.fonts.load) ? document.fonts.load('700 40px ' + fam, text) : Promise.resolve();
      Promise.race([fontReady, new Promise(function (r) { setTimeout(r, 1500); })])
        .then(function () { requestAnimationFrame(first); }, function () { requestAnimationFrame(first); });
    }
    function first() {
      ready0 = true;
      if (document.hidden) { reveal(); return; }                       // вкладка скрыта: текст сразу, анимация — когда вернутся
      if (!play('in')) reveal();
      arm(PERIOD);
    }
    if (introGone()) start();
    else {
      if (window.MutationObserver) {
        var mo = new MutationObserver(function () { if (introGone()) { mo.disconnect(); start(); } });
        mo.observe(intro, { attributes: true, attributeFilter: ['style', 'class'] });
      }
      setTimeout(start, 7000);                                         // запасной вариант: заставка не должна держать надпись вечно
    }
  });
})();
