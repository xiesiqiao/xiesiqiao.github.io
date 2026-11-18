/* Illustrative population surface on a 40 x 40 grid.
   Deterministic (seeded), so it looks the same on every visit.
   Colors: cividis ramp, which stays readable with common color-vision deficiencies. */
(function () {
  var canvas = document.getElementById("grid");
  if (!canvas || !canvas.getContext) return;
  var N = 40;
  // photo occupies columns 17..36, rows 15..34 (0-indexed), plus a 1-cell gutter
  var PX0 = 17, PX1 = 36, PY0 = 15, PY1 = 34;

  // cividis, light (sparse) to dark (dense)
  var RAMP = ["#e9e2a6", "#cdbf6f", "#a89c6f", "#7f7c76", "#5b5f6e", "#344a71", "#00224e"];

  // seeded PRNG (mulberry32)
  function rng(seed) {
    return function () {
      seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
      var t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  var r = rng(2020);

  // settlement centres: a metro core, suburbs, and small towns
  var centres = [
    { x: 9, y: 9, s: 5.5, w: 1.0 },
    { x: 15, y: 6, s: 2.6, w: 0.55 },
    { x: 5, y: 16, s: 2.4, w: 0.5 },
    { x: 26, y: 5, s: 2.0, w: 0.45 },
    { x: 34, y: 10, s: 1.6, w: 0.35 },
    { x: 7, y: 30, s: 2.2, w: 0.42 },
    { x: 12, y: 37, s: 1.4, w: 0.3 },
    { x: 37, y: 37, s: 1.6, w: 0.3 }
  ];

  // a river: cells along this curve stay empty
  function riverY(x) { return 12 + 9 * Math.sin(x / 7.5) + x * 0.35; }

  var cells = [];
  for (var y = 0; y < N; y++) {
    for (var x = 0; x < N; x++) {
      if (x >= PX0 - 1 && x <= PX1 + 1 && y >= PY0 - 1 && y <= PY1 + 1) { r(); continue; }
      var v = 0;
      for (var i = 0; i < centres.length; i++) {
        var c = centres[i], dx = x - c.x, dy = y - c.y;
        v += c.w * Math.exp(-(dx * dx + dy * dy) / (2 * c.s * c.s));
      }
      // a road corridor between the core and the eastern towns
      var road = Math.abs(y - (9 - (x - 9) * 0.03));
      if (x > 9 && road < 0.8) v += 0.12;
      var noise = r();
      v = v * (0.75 + 0.5 * noise) + (noise > 0.9 ? 0.06 : 0);
      if (Math.abs(y - riverY(x)) < 0.7) v = 0;
      if (v < 0.05) continue;               // unpopulated cell: leave paper showing
      if (v < 0.22 && r() < 0.45) continue; // patchy rural settlement
      var k = Math.min(RAMP.length - 1, Math.floor(Math.pow(v, 0.6) * RAMP.length));
      cells.push({ x: x, y: y, k: k, v: v });
    }
  }
  // fill order for the one-time reveal: densest first, so settlement spreads outward
  cells.sort(function (a, b) { return b.v - a.v; });

  var ctx = canvas.getContext("2d");
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var shown = reduce ? cells.length : 0;

  function size() {
    var rect = canvas.getBoundingClientRect();
    var dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return rect.width;
  }

  var W = size();
  function draw() {
    var cs = W / N, gap = Math.max(1, cs * 0.12);
    ctx.clearRect(0, 0, W, W);
    for (var i = 0; i < shown; i++) {
      var c = cells[i];
      ctx.fillStyle = RAMP[c.k];
      ctx.fillRect(c.x * cs + gap / 2, c.y * cs + gap / 2, cs - gap, cs - gap);
    }
  }

  if (reduce) { draw(); }
  else {
    var start = null, DURATION = 1400;
    var step = function (t) {
      if (start === null) start = t;
      var p = Math.min(1, (t - start) / DURATION);
      var eased = 1 - Math.pow(1 - p, 3);
      shown = Math.round(eased * cells.length);
      draw();
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  var timer;
  window.addEventListener("resize", function () {
    clearTimeout(timer);
    timer = setTimeout(function () { W = size(); draw(); }, 100);
  });
})();
