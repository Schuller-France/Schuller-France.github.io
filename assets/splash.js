/* Schuller Eh'klar — intro logo animation (vanilla JS, no dependency).
 * Usage: <script src="splash.js" data-wordmark="assets/wordmark.png" data-logo-selector=".logo"></script>
 * Plays once per browser session, skippable by click / key, disabled with prefers-reduced-motion.
 */
(function () {
  var script = document.currentScript;
  var cfg = {
    wordmark: (script && script.dataset.wordmark) || 'assets/wordmark.png',
    logoSelector: (script && script.dataset.logoSelector) || null, // real logo on the page (landing target)
    once: !(script && script.dataset.once === 'false'),
  };
  var KEY = 'schuller-splash-seen';
  // Pas d'intro si une session est deja enregistree : l'application s'ouvre directement,
  // la page de connexion ne sera pas affichee.
  var skipKeys = ((script && script.dataset.skipIfSession) || '').split(',').map(function (k) { return k.trim(); }).filter(Boolean);
  try {
    for (var i = 0; i < skipKeys.length; i++) {
      if (localStorage.getItem(skipKeys[i]) || sessionStorage.getItem(skipKeys[i])) return;
    }
  } catch (e) {}
  if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  try { if (cfg.once && sessionStorage.getItem(KEY)) return; sessionStorage.setItem(KEY, '1'); } catch (e) {}

  var RED = '#E30613', BG = '#F3F1EE', LW = 590, LH = 423;
  var DOTS = [
    { x: 294.5, y: 316, d: 170, sx: -460, sy: 700 },
    { x: 453.5, y: 209.5, d: 127, sx: -380, sy: 720 },
    { x: 511.5, y: 66, d: 96, sx: -300, sy: 740 },
  ];
  var FLIGHT = 0.9, GAP = 0.55, FIRST = 0.25, TRAIL_N = 14, TRAIL_DT = 0.028;
  var T_WORD = 2.65, T_MOVE = 4.0, MOVE_DUR = 1.0, BG_FADE = 1.2, END = T_MOVE + 1.3;

  var clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };
  var eOutCubic = function (t) { return 1 - Math.pow(1 - t, 3); };
  var eInOutCubic = function (t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };
  var eOutBack = function (t) { var c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); };
  var bez = function (d, u) {
    var cx = (d.sx + d.x) / 2 + 60, cy = Math.min(d.sy, d.y) - 460;
    var a = (1 - u) * (1 - u), b = 2 * u * (1 - u), c = u * u;
    return { x: a * d.sx + b * cx + c * d.x, y: a * d.sy + b * cy + c * d.y };
  };
  var el = function (css, parent) { var n = document.createElement('div'); n.style.cssText = css; if (parent) parent.appendChild(n); return n; };

  var target = cfg.logoSelector ? document.querySelector(cfg.logoSelector) : null;
  if (target) target.style.visibility = 'hidden';

  var overlay = el('position:fixed;inset:0;z-index:2147483000;overflow:hidden;pointer-events:auto;cursor:pointer;');
  var bg = el('position:absolute;inset:0;background:' + BG + ';', overlay);
  var logo = el('position:absolute;left:0;top:0;width:' + LW + 'px;height:' + LH + 'px;transform-origin:0 0;will-change:transform;', overlay);
  var word = document.createElement('img');
  word.src = cfg.wordmark; word.alt = '';
  word.style.cssText = 'position:absolute;left:0;top:0;width:' + LW + 'px;height:' + LH + 'px;opacity:0;';
  logo.appendChild(word);

  var dots = DOTS.map(function (d) {
    var ghosts = [];
    for (var k = 0; k < TRAIL_N; k++) ghosts.push(el('position:absolute;width:' + d.d + 'px;height:' + d.d + 'px;border-radius:50%;opacity:0;', logo));
    var ring = el('position:absolute;left:' + (d.x - d.d / 2) + 'px;top:' + (d.y - d.d / 2) + 'px;width:' + d.d + 'px;height:' + d.d + 'px;border-radius:50%;border:4px solid ' + RED + ';box-sizing:border-box;opacity:0;', logo);
    var body = el('position:absolute;width:' + d.d + 'px;height:' + d.d + 'px;opacity:0;', logo);
    var hue = el('position:absolute;inset:0;border-radius:50%;', body);
    var red = el('position:absolute;inset:0;border-radius:50%;background:' + RED + ';', body);
    return { d: d, ghosts: ghosts, ring: ring, body: body, hue: hue, red: red };
  });

  function poses() {
    var W = innerWidth, H = innerHeight;
    var s = Math.min((W * 0.78) / LW, (H * 0.45) / LH, 1.5);
    var center = { x: (W - LW * s) / 2, y: (H - LH * s) / 2 - 10, s: s };
    var end = null;
    if (target) {
      var r = target.getBoundingClientRect();
      if (r.width > 0) { var se = r.width / LW; end = { x: r.left, y: r.top, s: se }; }
    }
    return { center: center, end: end || center };
  }

  function render(t) {
    var P = poses();
    var m = target ? eInOutCubic(clamp((t - T_MOVE) / MOVE_DUR, 0, 1)) : 0;
    var x = P.center.x + (P.end.x - P.center.x) * m;
    var y = P.center.y + (P.end.y - P.center.y) * m;
    var s = P.center.s + (P.end.s - P.center.s) * m;
    logo.style.transform = 'translate(' + x + 'px,' + y + 'px) scale(' + s + ')';
    bg.style.opacity = 1 - eOutCubic(clamp((t - T_MOVE) / BG_FADE, 0, 1));
    if (!target) logo.style.opacity = 1 - clamp((t - T_MOVE) / 0.8, 0, 1);

    var w = eOutCubic(clamp((t - T_WORD) / 0.75, 0, 1));
    word.style.opacity = w > 0 ? 1 : 0;
    word.style.clipPath = 'inset(0 ' + (1 - w) * 100 + '% 0 0)';
    word.style.transform = 'translateX(' + (1 - w) * -24 + 'px)';

    dots.forEach(function (o, i) {
      var d = o.d, r = d.d / 2, t0 = FIRST + i * GAP, land = t0 + FLIGHT;
      var prog = function (tt) { return clamp((tt - t0) / FLIGHT, 0, 1); };
      var raw = prog(t);
      if (t < t0) { o.body.style.opacity = 0; return; }
      var u = eInOutCubic(raw), p = bez(d, u);
      var popU = clamp((t - land) / 0.45, 0, 1);
      var sc = raw < 1 ? 0.45 + 0.4 * u : 0.85 + 0.15 * eOutBack(popU);
      o.body.style.opacity = 1;
      o.body.style.left = (p.x - r) + 'px'; o.body.style.top = (p.y - r) + 'px';
      o.body.style.transform = 'scale(' + sc + ')';
      o.hue.style.background = 'hsl(' + (((1 - u) * 360) % 360) + ' 90% 55%)';
      o.red.style.opacity = clamp((raw - 0.8) / 0.2, 0, 1);
      var fade = 1 - clamp((t - land) / 0.5, 0, 1);
      o.ghosts.forEach(function (g, j) {
        var k = j + 1, gr = prog(t - k * TRAIL_DT);
        if (gr <= 0 || fade <= 0 || (gr >= 1 && raw >= 1)) { g.style.opacity = 0; return; }
        var gu = eInOutCubic(gr), gp = bez(d, gu);
        g.style.left = (gp.x - r) + 'px'; g.style.top = (gp.y - r) + 'px';
        g.style.transform = 'scale(' + (0.45 + 0.4 * gu) * (1 - (k / TRAIL_N) * 0.55) + ')';
        g.style.background = 'hsl(' + (k / TRAIL_N) * 290 + ' 88% 56%)';
        g.style.opacity = fade * (1 - k / (TRAIL_N + 2)) * 0.85;
      });
      var ru = clamp((t - land) / 0.6, 0, 1);
      o.ring.style.opacity = ru > 0 && ru < 1 ? 0.55 * (1 - ru) : 0;
      o.ring.style.transform = 'scale(' + (1 + 0.6 * eOutCubic(ru)) + ')';
    });
  }

  var start = null, done = false;
  function finish() {
    if (done) return; done = true;
    if (target) target.style.visibility = '';
    overlay.remove();
    document.dispatchEvent(new CustomEvent('schuller-splash-done'));
  }
  function frame(now) {
    if (done) return;
    if (start === null) start = now;
    var t = (now - start) / 1000;
    render(t);
    if (t >= T_MOVE) overlay.style.pointerEvents = 'none';
    if (t >= END) return finish();
    requestAnimationFrame(frame);
  }
  function skip() { if (!done && start !== null) start = performance.now() - T_MOVE * 1000; }
  overlay.addEventListener('click', skip);
  addEventListener('keydown', skip, { once: true });

  function boot() {
    document.body.appendChild(overlay);
    render(0);
    var go = function () { requestAnimationFrame(frame); };
    if (word.complete) go(); else { word.onload = go; word.onerror = go; }
  }
  if (document.body) boot(); else document.addEventListener('DOMContentLoaded', boot);
})();
