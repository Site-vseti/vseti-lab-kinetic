/* Надпись «всети» в шапке живёт из звёздной пыли и «ездит» в эмблему и обратно.
   Каждые 15 секунд надпись стремительно втягивается в эмблему-кружок («вжух»), остаётся одна эмблема,
   потом из неё вылетает звёздная пыль и слева направо собирает слово заново («трррр»); дальше логотип держится целиком до следующего круга.
   При загрузке страницы — только сборка: пыль из эмблемы собирает надпись.
   Берём пиксели настоящего текста (тот же шрифт, кегль и положение, что у DOM-надписи) и раскладываем по ним частицы.
   Надпись всё время лежит в разметке (поиск, скринридеры); пока идёт анимация, DOM-текст прячется, потом проявляется.
   Между кругами анимации нет вовсе: ни кадров, ни таймеров, кроме одного отсчёта до следующего.
   Холст — узкая полоска шапки (эмблема + надпись), поэтому дёшево и на слабом телефоне; при прокрутке пыль сразу оседает в текст.
   Скрытая вкладка — пауза. prefers-reduced-motion — обычный логотип без движения. Без библиотек и внешних запросов.
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
      var TARGET = mobile ? 380 : 1100;                                // сколько частиц пытаемся набрать
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
    var ctx = cv.getContext('2d'), cvW = 0, cvH = 0, cvD = 0, cvX = -1;
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

    /* Сценарий (секунды от начала анимации):
       A  0 … ~.9   надпись «вжух» втягивается в эмблему: ближние к кружку буквы уходят первыми, за ними цепочкой остальные;
       B  ~.9 … 2.0 остаётся одна эмблема (на входе в кружок и на выходе из него — вспышка и круг по воде);
       C  2.0 … 4.0 «трррр»: из эмблемы вылетает звёздная пыль и слева направо собирает «всети»;
       дальше пыль оседает в настоящий текст, надпись держится до следующего круга (всего 15 с).
       При загрузке страницы — только C (эмблема только что прилетела в шапку из заставки). */
    var T_A_SPAN = .3, T_C_SPAN = .85, T_CYC_C = 2.0, T_IN_C = .3, T_C_LEN = 2.0;

    function play(mode) {                                              // mode: 'in' — при загрузке пыль из эмблемы собирает надпись, 'cycle' — надпись уезжает в эмблему и собирается заново
      if (document.hidden || anim) return false;
      var mobile = matchMedia('(max-width:768px)').matches;
      var cs = getComputedStyle(word), wr = word.getBoundingClientRect();
      if (!wr.width || !wr.height) return false;
      var B = build(wr, cs, mobile);
      if (!B) return false;

      /* эмблема: центр и радиус (если вдруг нет — точка слева от надписи) */
      var emb = document.getElementById('hlogo'), er = emb ? emb.getBoundingClientRect() : null;
      if (!er || !er.width) er = { left: wr.left - 58, width: 44, top: wr.top + wr.height / 2 - 22, height: 44 };
      var ex = er.left + er.width / 2, ey = er.top + er.height / 2, eR = er.width / 2;

      /* холст — только полоска шапки от эмблемы до конца надписи (с запасом на изгиб траекторий): дёшево и на слабом телефоне */
      var W = root.clientWidth || window.innerWidth, H = window.innerHeight;
      var x0 = Math.max(0, Math.floor(Math.min(er.left, wr.left) - 70)), x1 = Math.min(W, Math.ceil(wr.right + 70));
      var Hc = Math.min(H, Math.ceil(Math.max(wr.bottom, er.top + er.height) + 150));
      var Wc = Math.max(1, x1 - x0);
      var dpr = mobile ? 1 : Math.min(window.devicePixelRatio || 1, 1.5);
      if (cvW !== Wc || cvH !== Hc || cvD !== dpr || cvX !== x0) {
        cvW = Wc; cvH = Hc; cvD = dpr; cvX = x0;
        cv.width = Math.round(Wc * dpr); cv.height = Math.round(Hc * dpr);
        cv.style.width = Wc + 'px'; cv.style.height = Hc + 'px'; cv.style.left = x0 + 'px';
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
      var ringC = light ? mix(gold, black, .25) : gold;
      var sz = clamp(B.fs / 64, .66, 1) * (mobile ? .9 : 1);

      var ox0 = wr.left, oy0 = wr.top, ww = Math.max(1, wr.width);
      var cyc = mode === 'cycle', TC = cyc ? T_CYC_C : T_IN_C, END = TC + T_C_LEN;
      var P = B.pts.map(function (q) {
        var fx = clamp(q[0] / ww, 0, 1), a = Math.random() * 6.283, rr = Math.sqrt(Math.random()) * eR * .55;
        return { qx: q[0], qy: q[1],                                    // место в надписи
                 sx: ex + Math.cos(a) * rr, sy: ey + Math.sin(a) * rr,  // старт в эмблеме
                 da: fx * T_A_SPAN + Math.random() * .06, dua: rnd(.34, .55), cva: rnd(-.2, .2),   // втягивание: ближние буквы первыми
                 dc: fx * T_C_SPAN + Math.random() * .12, duc: rnd(.55, .9), cvc: rnd(-.3, .3),   // сборка: слева направо
                 r: rnd(1, 2.2) * sz, c: (Math.random() * 3) | 0, tw: 2 + Math.random() * 4, ph: Math.random() * 6.28 };
      });

      function pulse() {                                               // эмблема «глотает» / «выплёвывает» пыль: толчок и золотое свечение
        if (!emb || !emb.animate) return;
        try {                                                          // на телефоне — только толчок (transform, без перерисовки тени): дешевле для GPU
          var sh0 = '0 0 0 1px rgba(232,199,102,.35),0 6px 24px rgba(0,0,0,.4)', sh1 = '0 0 0 2px rgba(232,199,102,.9),0 0 26px 7px rgba(232,199,102,.55)';
          emb.animate(mobile
            ? [{ transform: 'scale(1)' }, { transform: 'scale(1.14)', offset: .35 }, { transform: 'scale(1)' }]
            : [{ transform: 'scale(1)', boxShadow: sh0 }, { transform: 'scale(1.14)', boxShadow: sh1, offset: .35 }, { transform: 'scale(1)', boxShadow: sh0 }],
            { duration: 640, easing: 'cubic-bezier(.2,.7,.3,1)' });
        } catch (err) { }
      }
      function ring(t, t0, dur, k) {                                   // круг по воде вокруг эмблемы
        var u = (t - t0) / dur; if (u < 0 || u > 1) return;
        var e = 1 - Math.pow(1 - u, 2.5);
        ctx.globalAlpha = .75 * (1 - u); ctx.lineWidth = 2.2 - 1.2 * u;
        ctx.strokeStyle = css(ringC, 1);
        ctx.beginPath(); ctx.arc(ex, ey, eR * (1.05 + (k - 1.05) * e), 0, 6.2832); ctx.stroke();
        ctx.globalAlpha = 1;
      }

      if (cyc) word.classList.add('ld-off');
      var T0 = 0, last = 0, ema = 0, nf = 0, frac = 1, fi = 0, ox = ox0, oy = oy0, pa = false, pc = false;
      var me = anim = { }; animStart = performance.now();

      function frame(now) {
        if (anim !== me) return;
        raf = requestAnimationFrame(frame);
        if (!T0) T0 = now;
        var t = (now - T0) / 1000;
        /* защита слабых телефонов: если кадры длиннее ~26 мс (реже ~38 к/с), понемногу рисуем меньше частиц */
        if (last) { var dt = now - last; ema = ema ? ema * .9 + dt * .1 : dt; if (++nf > 12 && ema > 26 && frac > .35) { frac *= .8; nf = 0; ema = 16; } }
        last = now;
        if (posDirty && (fi++ & 3) === 0) { posDirty = false; var w2 = word.getBoundingClientRect(); if (w2.width) { ox = w2.left; oy = w2.top; } }   // шапка закреплена: позицию перечитываем только после прокрутки (чтение раскладки в кадре дорого)
        ctx.setTransform(dpr, 0, 0, dpr, -x0 * dpr, 0);                 // координаты — как в окне, холст сдвинут на x0
        ctx.globalCompositeOperation = 'destination-out';              // шлейфы: не стираем холст, а лишь гасим предыдущий кадр
        ctx.fillStyle = 'rgba(0,0,0,.3)'; ctx.fillRect(x0, 0, cvW, cvH);
        ctx.globalCompositeOperation = 'source-over';

        if (cyc && !pa && t > .62) { pa = true; pulse(); }
        if (!pc && t > TC - .06) { pc = true; pulse(); }
        if (cyc) ring(t, .58, .75, 1.8);
        ring(t, TC - .06, .8, 1.9);

        var n = (P.length * frac) | 0, assemble = t >= TC - .04;
        for (var j = 0; j < n; j++) {
          var p = P[j], tx = ox + p.qx, ty = oy + p.qy, xa, ya, xb, yb, u, e, cv0, al, size, px, py;
          if (!assemble) {                                              // A и B: надпись втягивается в эмблему
            if (!cyc) continue;
            u = (t - p.da) / p.dua;
            if (u >= 1) continue;                                       // уже в эмблеме
            if (u <= 0) {                                               // своя очередь ещё не пришла: стоит на месте буквой
              px = tx + Math.sin(t * p.tw + p.ph) * .3; py = ty;
              al = .82 + .18 * Math.sin(t * p.tw + p.ph); size = .7;
            } else {
              e = Math.pow(u, 2.2);                                     // разгон: чем ближе к эмблеме, тем быстрее
              xa = tx; ya = ty; xb = p.sx; yb = p.sy; cv0 = p.cva;
              var dx = xb - xa, dy = yb - ya, len = Math.sqrt(dx * dx + dy * dy) || 1, s = Math.sin(Math.PI * e) * cv0 * len;
              px = xa + dx * e - dy / len * s; py = ya + dy * e + dx / len * s;
              al = u > .75 ? (1 - u) / .25 : 1; size = .85 - .45 * u;
            }
          } else {                                                      // C: из эмблемы летит пыль и собирает надпись
            u = (t - TC - p.dc) / p.duc;
            if (u <= 0) continue;                                       // ещё не вылетела
            if (u > 1) u = 1;
            e = 1 - Math.pow(1 - u, 3);                                 // easeOutCubic
            var cx2 = tx - p.sx, cy2 = ty - p.sy, len2 = Math.sqrt(cx2 * cx2 + cy2 * cy2) || 1, s2 = Math.sin(Math.PI * e) * p.cvc * len2;
            px = p.sx + cx2 * e - cy2 / len2 * s2; py = p.sy + cy2 * e + cx2 / len2 * s2;
            var tw = Math.sin(t * p.tw + p.ph);
            al = (.65 + .35 * e) * Math.min(1, u * 5); size = 1.45 - .75 * e;
            if (u >= 1) { px += tw * .4; py += Math.cos(t * p.tw + p.ph) * .4; al = .82 + .18 * tw; }
          }
          var d = p.r * 6.4 * size;
          ctx.globalAlpha = al;
          ctx.drawImage(SP[p.c], px - d / 2, py - d / 2, d, d);
        }
        ctx.globalAlpha = 1;
        if (t > END) stop();
      }
      raf = requestAnimationFrame(frame);
      return true;
    }

    function cycle() {                                                 // пора: надпись уезжает в эмблему
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
