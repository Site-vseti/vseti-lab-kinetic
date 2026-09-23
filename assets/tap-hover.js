/* Оживление эффектов на телефонах.
   На айфоне тап почти никогда не включает :hover — WebKit даёт это состояние
   только настоящим ссылкам, поэтому свечение блоков, счётчики и перевороты
   карточек там не наступают вовсе. Android-браузер, наоборот, вешает hover
   по первому тапу, и на нём всё выглядит рабочим.

   Что делаем: на устройствах без мыши дублируем все :hover-правила классом
   .tap-on, включаем его по касанию и когда блок выезжает на экран, и заодно
   шлём элементу событие mouseenter — чтобы ожил и скриптовый эффект
   (счётчики, магниты), написанный под мышь.

   Проверка ?tap=1 в адресе включает режим принудительно — для тестов. */
(function () {
  "use strict";
  var forced = location.search.indexOf("tap=1") > -1;
  var hasMouse = window.matchMedia && window.matchMedia("(hover: hover)").matches;
  if (hasMouse && !forced) return;

  var css = [], selectors = [];

  function collect(rules, wrapOpen, wrapClose) {
    for (var i = 0; i < rules.length; i++) {
      var r = rules[i];
      if (r.selectorText && r.selectorText.indexOf(":hover") > -1) {
        var sel = r.selectorText.replace(/:hover/g, ".tap-on");
        css.push(wrapOpen + sel + "{" + r.style.cssText + "}" + wrapClose);
        r.selectorText.split(",").forEach(function (part) {
          var head = part.split(":hover")[0].trim();
          if (head) selectors.push(head);
        });
      } else if (r.cssRules && r.conditionText !== undefined) {
        // @media и @supports — сохраняем условие
        var at = r.media ? "@media " + r.media.mediaText : "@supports " + r.conditionText;
        collect(r.cssRules, wrapOpen + at + "{", "}" + wrapClose);
      }
    }
  }

  var sheets = document.styleSheets;
  for (var s = 0; s < sheets.length; s++) {
    try {
      collect(sheets[s].cssRules || [], "", "");
    } catch (e) { /* чужой стиль — пропускаем */ }
  }
  if (css.length) {
    var style = document.createElement("style");
    style.textContent = css.join("\n");
    document.head.appendChild(style);
  }

  // Кого оживлять: элементы, у которых есть свой :hover-эффект.
  var nodes = [];
  selectors.forEach(function (sel) {
    try {
      [].forEach.call(document.querySelectorAll(sel), function (el) {
        if (nodes.indexOf(el) === -1) nodes.push(el);
      });
    } catch (e) { /* селектор вроде :root — не наш случай */ }
  });

  function wake(el) {
    if (el.classList.contains("tap-on")) return;
    el.classList.add("tap-on");
    try {
      el.dispatchEvent(new MouseEvent("mouseenter", { bubbles: false }));
      el.dispatchEvent(new MouseEvent("mouseover", { bubbles: true }));
    } catch (e) { /* очень старый браузер — обойдётся без скриптовых эффектов */ }
  }

  function sleep(el) {
    if (!el.classList.contains("tap-on")) return;
    el.classList.remove("tap-on");
    try {
      el.dispatchEvent(new MouseEvent("mouseleave", { bubbles: false }));
      el.dispatchEvent(new MouseEvent("mouseout", { bubbles: true }));
    } catch (e) {}
  }

  // Касание: включаем на этом блоке, гасим на остальных.
  document.addEventListener("touchstart", function (ev) {
    var hit = null;
    for (var i = 0; i < nodes.length; i++) {
      if (nodes[i].contains(ev.target)) { hit = nodes[i]; break; }
    }
    nodes.forEach(function (el) { if (el !== hit) sleep(el); });
    if (hit) wake(hit);
  }, { passive: true });

  // Прокрутка: блок посреди экрана оживает сам, ушёл — гаснет.
  if (window.IntersectionObserver) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) wake(en.target); else sleep(en.target);
      });
    }, { threshold: 0.6, rootMargin: "-10% 0px -10% 0px" });
    nodes.forEach(function (el) { io.observe(el); });
  }
})();
