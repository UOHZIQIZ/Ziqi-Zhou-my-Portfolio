
(function () {
  "use strict";

  function rng(seed) {
    var a = seed >>> 0;
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function hash(str) {
    var h = 2166136261; str = String(str);
    for (var i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
    return h >>> 0;
  }
  function hex2rgb(h) { var n = parseInt(h.slice(1), 16); return [n >> 16, (n >> 8) & 255, n & 255]; }
  function rgba(h, a) { var c = hex2rgb(h); return "rgba(" + c[0] + "," + c[1] + "," + c[2] + "," + (a == null ? 1 : a) + ")"; }
  function shade(h, amt) {
    var c = hex2rgb(h), t = amt < 0 ? 0 : 255, p = Math.abs(amt);
    return "rgb(" + c.map(function (v) { return Math.round((t - v) * p + v); }).join(",") + ")";
  }
  function pick(r, arr) { return arr[Math.floor(r() * arr.length)]; }
  function between(r, a, b) { return a + r() * (b - a); }
  var INK = "rgba(62, 40, 30, ";          

  function setup(canvas) {
    var w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return null;
    var DPR = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(w * DPR); canvas.height = Math.round(h * DPR);
    var c = canvas.getContext("2d");
    c.setTransform(DPR, 0, 0, DPR, 0, 0);
    c.lineCap = "round"; c.lineJoin = "round";
    return { c: c, w: w, h: h };
  }

  var THEMES = {
    rose:    { paper: "#F2E8D8", flowers: ["#E6AEB2", "#D38791", "#9E3A4C", "#F2D3CB"], accent: "#8E2B3C",
               leaves: ["#7F9A78", "#5F7B5B", "#9DB095", "#4F6A4B"], butterfly: ["#D99A3D", "#3E6399"] },
    blue:    { paper: "#EEE6D6", flowers: ["#6C8FC2", "#9DB7DA", "#E3AFBA", "#3F5F92"], accent: "#2F5C92",
               leaves: ["#7D9A7F", "#5A775E", "#A2B6A2", "#4B6650"], butterfly: ["#3E6DB0", "#5B86C4"] },
    garden:  { paper: "#E7E4D2", flowers: ["#B8323A", "#D8665A", "#F4EEE3", "#E89A7C"], accent: "#8F1D25",
               leaves: ["#6F8B60", "#4C6843", "#91A882", "#3F5838"], butterfly: ["#C4452F", "#A7C9AE"] },
    pressed: { paper: "#EEE3CF", flowers: ["#E8CCBB", "#CF9E9A", "#7B2440", "#F4E6D6"], accent: "#7B1E3A",
               leaves: ["#9AA88A", "#7C8B6D", "#B4BCA2", "#667357"], butterfly: ["#B98A5A", "#C9A77A"] },
    meadow:  { paper: "#F2E8D2", flowers: ["#E7B941", "#F6F1E6", "#E0833F", "#8EA6D1"], accent: "#B8612A",
               leaves: ["#7B9467", "#5A7349", "#9DB08A", "#4A6139"], butterfly: ["#E3A13A", "#3E6DB0"] }
  };
  THEMES.lily = { paper: "#F1E9DB", flowers: ["#F8F1EA", "#F0C4CC", "#E394A8", "#FBEFE6"], accent: "#8E2B3C",
                  leaves: ["#6F8E68", "#56744F", "#8FA886", "#43603F"], butterfly: ["#D99A3D", "#3E6399"], spot: "#9E3550" };
  var THEME_NAMES = Object.keys(THEMES);

  var SCRIPT = ["my dearest", "the garden in June", "forget me not", "yours always", "spring is here",
    "in full bloom", "mon amour", "le jardin", "with love", "wildflowers", "under the roses", "see you soon", "sweet peas"];
  var F_SCRIPT = '"Homemade Apple", "Mrs Saint Delafield", cursive';
  var F_PRINT = '"IM Fell English", Georgia, serif';
  var F_TYPE = '"Special Elite", "Courier New", monospace';

  function grain(c, w, h, r, dens) {
    var n = Math.floor(w * h / (dens || 110));
    for (var i = 0; i < n; i++) {
      c.fillStyle = r() < .55 ? "rgba(110,80,45,.07)" : "rgba(255,255,255,.22)";
      c.fillRect(r() * w, r() * h, 1, 1);
    }
  }
  function stain(c, w, h, r, k) {
    for (var s = 0; s < (k || 2); s++) {
      var sx = r() * w, sy = r() * h, sr = between(r, .2, .5) * Math.max(w, h);
      var g = c.createRadialGradient(sx, sy, 0, sx, sy, sr);
      g.addColorStop(0, "rgba(150,105,55,.07)"); g.addColorStop(1, "rgba(150,105,55,0)");
      c.fillStyle = g; c.fillRect(0, 0, w, h);
    }
  }
  function tornPath(c, w, h, r, j) {
    var step = 6; j = j || 2.2;
    c.beginPath(); c.moveTo(0, 0);
    for (var i = step; i < w; i += step) c.lineTo(i, between(r, -j, j));
    c.lineTo(w, 0);
    for (i = step; i < h; i += step) c.lineTo(w + between(r, -j, j), i);
    c.lineTo(w, h);
    for (i = w - step; i > 0; i -= step) c.lineTo(i, h + between(r, -j, j));
    c.lineTo(0, h);
    for (i = h - step; i > 0; i -= step) c.lineTo(between(r, -j, j), i);
    c.closePath();
  }
  
  function paperPiece(c, x, y, w, h, kind, T, r, rot) {
    c.save();
    c.translate(x + w / 2, y + h / 2); c.rotate(rot || 0); c.translate(-w / 2, -h / 2);
    tornPath(c, w, h, r);
    c.shadowColor = "rgba(70,45,20,.16)"; c.shadowBlur = 8; c.shadowOffsetY = 2;
    c.fillStyle = kind === "kraft" ? "#D5BA90" : kind === "plaid" ? "#F2F2EE" : shade(T.paper, .35);
    c.fill();
    c.shadowColor = "transparent";
    c.clip();
    var yy, i;
    if (kind === "letter") {
      var fs = Math.max(11, Math.min(17, h / 10));
      c.fillStyle = "rgba(70,48,34,.34)"; c.font = fs + "px " + F_SCRIPT;
      for (yy = fs * 1.8; yy < h - 4; yy += fs * 1.9) {
        var line = "";
        while (c.measureText(line).width < w + 40) line += pick(r, SCRIPT) + " ";
        c.fillText(line, 10 - r() * 20, yy);
      }
    } else if (kind === "news") {
      var cols = Math.max(2, Math.round(w / 90)), cw = (w - 16) / cols;
      c.fillStyle = "rgba(50,40,35,.55)"; c.font = "600 " + Math.min(22, w / 9) + "px " + F_PRINT;
      c.fillText(pick(r, ["The Garden", "Botanica", "Flora", "Le Jardin"]), 10, Math.min(26, w / 8));
      c.fillStyle = "rgba(60,50,45,.22)";
      for (i = 0; i < cols; i++) for (yy = 38; yy < h - 6; yy += 5.5) c.fillRect(10 + i * cw, yy, cw - 10 - (r() < .1 ? r() * cw * .4 : 0), 1.6);
    } else if (kind === "music") {
      c.strokeStyle = "rgba(60,45,40,.32)"; c.lineWidth = .7;
      for (var st = 18; st < h - 26; st += 40) {
        for (i = 0; i < 5; i++) { c.beginPath(); c.moveTo(0, st + i * 4.5 + .5); c.lineTo(w, st + i * 4.5 + .5); c.stroke(); }
        c.fillStyle = "rgba(50,38,32,.45)";
        for (var nx = 16; nx < w - 8; nx += between(r, 14, 24)) {
          var ny = st + Math.floor(r() * 9) * 2.25;
          c.beginPath(); c.ellipse(nx, ny, 2.8, 2, -.4, 0, 7); c.fill(); c.fillRect(nx + 2, ny - 13, .8, 13);
        }
      }
    } else if (kind === "plaid") {
      var b = "#6C8FC2";
      for (i = 0; i < w; i += 16) { c.fillStyle = rgba(b, .16); c.fillRect(i, 0, 6, h); }
      for (i = 0; i < h; i += 16) { c.fillStyle = rgba(b, .16); c.fillRect(0, i, w, 6); }
    } else if (kind === "ledger") {
      c.strokeStyle = "rgba(62,99,153,.2)"; c.lineWidth = 1;
      for (yy = 20; yy < h; yy += 16) { c.beginPath(); c.moveTo(0, yy + .5); c.lineTo(w, yy + .5); c.stroke(); }
    }
    grain(c, w, h, r, 140);
    c.restore();
  }

  function wash(c, x, y, R, col, r) {
    c.save(); c.globalCompositeOperation = "multiply";
    for (var i = 0; i < 4; i++) {
      var ox = x + between(r, -.3, .3) * R, oy = y + between(r, -.3, .3) * R, rr = R * between(r, .5, .9);
      var g = c.createRadialGradient(ox, oy, 0, ox, oy, rr);
      g.addColorStop(0, rgba(col, .10)); g.addColorStop(.7, rgba(col, .05)); g.addColorStop(1, rgba(col, 0));
      c.fillStyle = g; c.beginPath(); c.arc(ox, oy, rr, 0, 7); c.fill();
    }
    c.restore();
  }

  function petalPath(c, w, h, notch, wave) {
    wave = wave || 0;
    c.beginPath(); c.moveTo(0, 0);
    c.bezierCurveTo(-w * .95, -h * .18, -w * 1.08, -h * .78, -w * .42, -h * .98);
    if (notch) { c.quadraticCurveTo(-w * .14, -h * 1.03, 0, -h * (.9 + wave)); c.quadraticCurveTo(w * .14, -h * 1.03, w * .42, -h * .98); }
    else c.quadraticCurveTo(0, -h * (1.1 + wave), w * .42, -h * .98);
    c.bezierCurveTo(w * 1.08, -h * .78, w * .95, -h * .18, 0, 0);
    c.closePath();
  }

  function leaf(c, x, y, len, ang, col, r, serrate) {
    var wd = len * between(r, .24, .32), bend = between(r, -.12, .12) * len;
    c.save(); c.translate(x, y); c.rotate(ang);
    
    c.strokeStyle = shade(col, -.3); c.lineWidth = Math.max(.8, len * .025);
    c.beginPath(); c.moveTo(-len * .1, 0); c.lineTo(0, 0); c.stroke();
    
    function edge(side, t) {
      var u = 1 - t, px = 3 * u * u * t * (len * .22) + 3 * u * t * t * (len * .68) + t * t * t * len;
      var py = side * (3 * u * u * t * (wd * 1.12) + 3 * u * t * t * (wd * .85)) + (3 * u * t * t * bend * .3 + t * t * t * bend * .2);
      return [px, py];
    }
    c.beginPath(); c.moveTo(0, 0);
    var N = 26, k, p, tooth;
    for (k = 1; k <= N; k++) { p = edge(-1, k / N); tooth = serrate && k % 2 && k < N - 1 ? -len * .018 : 0; c.lineTo(p[0], p[1] + tooth); }
    for (k = N - 1; k >= 0; k--) { p = edge(1, k / N); tooth = serrate && k % 2 && k > 1 ? len * .018 : 0; c.lineTo(p[0], p[1] + tooth); }
    c.closePath();
    var g = c.createLinearGradient(0, -wd, 0, wd);
    g.addColorStop(0, shade(col, .16)); g.addColorStop(.5, col); g.addColorStop(1, shade(col, -.22));
    c.fillStyle = g; c.fill();
    var g2 = c.createLinearGradient(0, 0, len, 0);
    g2.addColorStop(0, "rgba(30,40,20,.14)"); g2.addColorStop(1, "rgba(255,255,230,.10)");
    c.fillStyle = g2; c.fill();
    c.strokeStyle = INK + ".32)"; c.lineWidth = .6; c.stroke();
    
    c.strokeStyle = shade(col, .38); c.lineWidth = Math.max(.7, len * .014);
    c.beginPath(); c.moveTo(0, 0); c.quadraticCurveTo(len * .5, bend * .25, len * .94, bend * .2); c.stroke();
    c.lineWidth = .5; c.globalAlpha = .7;
    for (var i = 1; i <= 5; i++) {
      var t = i / 6.2, mx = len * t, my = bend * .25 * t * 1.6 * (1 - t) + bend * .2 * t * t;
      for (var s = -1; s <= 1; s += 2) {
        c.beginPath(); c.moveTo(mx, my);
        c.quadraticCurveTo(mx + len * .08, my + s * wd * .35, mx + len * .16, my + s * wd * .62 * (1 - t * .5));
        c.stroke();
      }
    }
    c.globalAlpha = 1;
    c.restore();
  }

  function roseLeaf(c, x, y, len, ang, col, r) {
    c.save(); c.translate(x, y); c.rotate(ang);
    c.strokeStyle = shade(col, -.35); c.lineWidth = Math.max(.9, len * .02);
    c.beginPath(); c.moveTo(0, 0); c.quadraticCurveTo(len * .5, len * .04, len * .82, 0); c.stroke();
    var sz = len * .36;
    leaf(c, len * .78, 0, sz * 1.05, 0, col, r, true);
    leaf(c, len * .52, 0, sz, -1.0, shade(col, -.05), r, true);
    leaf(c, len * .52, 0, sz, 1.0, shade(col, .04), r, true);
    leaf(c, len * .24, 0, sz * .82, -1.15, col, r, true);
    leaf(c, len * .24, 0, sz * .82, 1.15, shade(col, -.06), r, true);
    c.restore();
  }

  function stem(c, p, col, w0) {
    var N = 18;
    for (var i = 0; i < N; i++) {
      var a = bez(p, i / N), b = bez(p, (i + 1) / N);
      c.strokeStyle = col; c.lineWidth = Math.max(.6, w0 * (1 - i / N * .7));
      c.beginPath(); c.moveTo(a[0], a[1]); c.lineTo(b[0], b[1]); c.stroke();
    }
  }
  function bez(p, t) {
    var u = 1 - t;
    return [u * u * u * p[0][0] + 3 * u * u * t * p[1][0] + 3 * u * t * t * p[2][0] + t * t * t * p[3][0],
            u * u * u * p[0][1] + 3 * u * u * t * p[1][1] + 3 * u * t * t * p[2][1] + t * t * t * p[3][1]];
  }
  function tangent(p, t) { var a = bez(p, Math.max(0, t - .01)), b = bez(p, Math.min(1, t + .01)); return Math.atan2(b[1] - a[1], b[0] - a[0]); }

  function tendril(c, x, y, s, dir, col) {
    c.strokeStyle = col; c.lineWidth = .8;
    c.beginPath(); c.moveTo(x, y);
    for (var a = 0; a < Math.PI * 3.6; a += .15) {
      var rr = s * (1 - a / (Math.PI * 4));
      c.lineTo(x + Math.cos(a * dir) * rr - s, y + Math.sin(a * dir) * rr);
    }
    c.stroke();
  }

  function rose(c, x, y, R, col, r) {
    c.save(); c.translate(x, y); c.rotate(r() * Math.PI * 2);
    c.shadowColor = "rgba(70,35,30,.22)"; c.shadowBlur = R * .25; c.shadowOffsetY = R * .06;
    var layers = [[5, 1.0, .64], [5, .8, .58], [5, .6, .5]];
    layers.forEach(function (L, li) {
      for (var i = 0; i < L[0]; i++) {
        c.save(); c.rotate(i * Math.PI * 2 / L[0] + li * .62 + between(r, -.12, .12));
        petalPath(c, R * L[2], R * L[1], false, between(r, -.04, .04));
        var g = c.createRadialGradient(0, -R * .05, R * .05, 0, -R * L[1] * .5, R * L[1] * .75);
        g.addColorStop(0, shade(col, -.32)); g.addColorStop(.55, col); g.addColorStop(.92, shade(col, .32)); g.addColorStop(1, shade(col, .5));
        c.fillStyle = g; c.fill();
        if (li === 0) c.shadowColor = "transparent";
        c.strokeStyle = rgba("#ffffff", .35); c.lineWidth = 1.1; c.stroke();
        c.strokeStyle = INK + ".22)"; c.lineWidth = .6; c.stroke();
        c.restore();
      }
    });
    c.shadowColor = "transparent";
    
    var cg = c.createRadialGradient(0, R * .02, 0, 0, 0, R * .36);
    cg.addColorStop(0, shade(col, -.5)); cg.addColorStop(.7, shade(col, -.15)); cg.addColorStop(1, col);
    c.fillStyle = cg; c.beginPath(); c.ellipse(0, 0, R * .36, R * .31, 0, 0, 7); c.fill();
    for (var k = 0; k < 5; k++) {
      var rr = R * (.32 - k * .058), a0 = k * 1.3 + r();
      c.strokeStyle = shade(col, .35); c.lineWidth = 1; c.globalAlpha = .8;
      c.beginPath(); c.arc(Math.cos(a0) * R * .02, Math.sin(a0) * R * .02, rr, a0, a0 + Math.PI * 1.15); c.stroke();
      c.strokeStyle = shade(col, -.5); c.lineWidth = .9; c.globalAlpha = .6;
      c.beginPath(); c.arc(Math.cos(a0) * R * .02, Math.sin(a0) * R * .02 + 1, rr * .96, a0 + .1, a0 + Math.PI * 1.05); c.stroke();
    }
    c.globalAlpha = 1;
    c.restore();
  }

  function blossom(c, x, y, R, col, r, rot) {
    c.save(); c.translate(x, y); c.rotate(rot == null ? r() * 6.28 : rot);
    c.shadowColor = "rgba(70,35,30,.18)"; c.shadowBlur = R * .2; c.shadowOffsetY = R * .05;
    for (var i = 0; i < 5; i++) {
      c.save(); c.rotate(i * Math.PI * 2 / 5 + between(r, -.08, .08));
      petalPath(c, R * .5, R, true);
      var g = c.createLinearGradient(0, 0, 0, -R);
      g.addColorStop(0, shade(col, -.25)); g.addColorStop(.25, shade(col, .45)); g.addColorStop(.7, col); g.addColorStop(1, shade(col, .15));
      c.fillStyle = g; c.fill();
      if (i === 0) c.shadowColor = "transparent";
      c.strokeStyle = INK + ".26)"; c.lineWidth = .6; c.stroke();
      c.strokeStyle = shade(col, -.28); c.lineWidth = .45; c.globalAlpha = .35;
      [[-.22, .78], [0, .86], [.22, .78]].forEach(function (v) {
        c.beginPath(); c.moveTo(0, -R * .12); c.quadraticCurveTo(R * v[0] * .6, -R * .5, R * v[0], -R * v[1]); c.stroke();
      });
      c.globalAlpha = 1;
      c.restore();
    }
    c.shadowColor = "transparent";
    c.fillStyle = "#B5A447"; c.beginPath(); c.arc(0, 0, R * .12, 0, 7); c.fill();
    for (i = 0; i < 16; i++) {
      var a = i / 16 * 6.28 + r() * .2, L = R * between(r, .26, .38);
      c.strokeStyle = "#D8C27A"; c.lineWidth = .6;
      c.beginPath(); c.moveTo(0, 0); c.lineTo(Math.cos(a) * L, Math.sin(a) * L); c.stroke();
      c.fillStyle = "#8A5A1E"; c.beginPath(); c.arc(Math.cos(a) * L, Math.sin(a) * L, Math.max(.8, R * .03), 0, 7); c.fill();
    }
    c.restore();
  }

  function daisy(c, x, y, R, col, r) {
    var white = hex2rgb(col).reduce(function (s, v) { return s + v; }, 0) > 640;
    var n = white ? 18 : 8, w = white ? R * .13 : R * .36;
    c.save(); c.translate(x, y); c.rotate(r() * 6.28);
    c.shadowColor = "rgba(70,35,30,.16)"; c.shadowBlur = R * .18; c.shadowOffsetY = R * .04;
    var base = white ? "#FFFDF7" : col;
    for (var i = 0; i < n; i++) {
      c.save(); c.rotate(i * Math.PI * 2 / n + between(r, -.05, .05));
      petalPath(c, w, R * between(r, .92, 1.02), !white);
      var g = c.createLinearGradient(0, 0, 0, -R);
      g.addColorStop(0, white ? "#E7E1D2" : shade(col, -.3)); g.addColorStop(.35, base); g.addColorStop(1, white ? "#FFFFFF" : shade(col, .22));
      c.fillStyle = g; c.fill();
      if (i === 0) c.shadowColor = "transparent";
      c.strokeStyle = INK + ".22)"; c.lineWidth = .5; c.stroke();
      c.restore();
    }
    c.shadowColor = "transparent";
    var d = c.createRadialGradient(-R * .05, -R * .06, 0, 0, 0, R * .24);
    d.addColorStop(0, "#F3CF5B"); d.addColorStop(1, "#B27A18");
    c.fillStyle = d; c.beginPath(); c.arc(0, 0, R * .22, 0, 7); c.fill();
    c.fillStyle = "rgba(110,60,10,.55)";
    for (i = 0; i < 70; i++) {
      var rr = Math.sqrt(i / 70) * R * .2, aa = i * 2.39996;
      c.beginPath(); c.arc(Math.cos(aa) * rr, Math.sin(aa) * rr, Math.max(.5, R * .012), 0, 7); c.fill();
    }
    c.restore();
  }

  function bud(c, x, y, s, col, ang, leafCol) {
    c.save(); c.translate(x, y); c.rotate(ang);
    c.beginPath(); c.moveTo(0, 0);
    c.bezierCurveTo(-s * .5, -s * .3, -s * .35, -s * .95, 0, -s * 1.1);
    c.bezierCurveTo(s * .35, -s * .95, s * .5, -s * .3, 0, 0);
    var g = c.createLinearGradient(0, 0, 0, -s);
    g.addColorStop(0, shade(col, -.25)); g.addColorStop(1, shade(col, .25));
    c.fillStyle = g; c.fill(); c.strokeStyle = INK + ".25)"; c.lineWidth = .5; c.stroke();
    c.fillStyle = leafCol;
    [-1, 0, 1].forEach(function (k) {
      c.beginPath(); c.moveTo(0, s * .05);
      c.quadraticCurveTo(k * s * .45, -s * .25, k * s * .22, -s * .62);
      c.quadraticCurveTo(k * s * .1, -s * .25, 0, s * .05); c.fill();
    });
    c.restore();
  }

  function babyBreath(c, x, y, s, r, stemCol) {
    c.strokeStyle = stemCol; c.lineWidth = .5;
    for (var i = 0; i < 7; i++) {
      var a = between(r, -2.6, -.5), L = s * between(r, .5, 1);
      var ex = x + Math.cos(a) * L, ey = y + Math.sin(a) * L;
      c.beginPath(); c.moveTo(x, y); c.quadraticCurveTo(x + Math.cos(a) * L * .5 + 3, y + Math.sin(a) * L * .5, ex, ey); c.stroke();
      for (var k = 0; k < 4; k++) {
        var fx = ex + between(r, -s * .12, s * .12), fy = ey + between(r, -s * .12, s * .12), fr = s * .05;
        c.fillStyle = "#FFFDF5"; c.beginPath(); c.arc(fx, fy, fr, 0, 7); c.fill();
        c.strokeStyle = INK + ".18)"; c.stroke(); c.strokeStyle = stemCol;
        c.fillStyle = "#E7D9A8"; c.beginPath(); c.arc(fx, fy, fr * .35, 0, 7); c.fill();
      }
    }
  }

  function spike(c, x, y, len, col, T, r) {
    var lean = between(r, -.2, .2);
    var p = [[x, y], [x + len * lean * .3, y - len * .35], [x + len * lean * .8, y - len * .7], [x + len * lean, y - len]];
    stem(c, p, shade(T.leaves[1], -.3), 2);
    for (var i = 0; i < 2; i++) { var q = bez(p, .08 + i * .1); leaf(c, q[0], q[1], len * .3, -Math.PI / 2 + (i % 2 ? .9 : -.9), T.leaves[i % 2], r); }
    for (var t = .3; t <= 1.001; t += .05) {
      var a = bez(p, t), s = len * .075 * (1.15 - t * .8), side = Math.round(t * 20) % 2 ? 1 : -1;
      c.save(); c.translate(a[0] + side * s * .45, a[1]); c.rotate(side * .45);
      c.beginPath();
      c.moveTo(-s * .4, -s * .6); c.quadraticCurveTo(-s * .7, s * .5, -s * .5, s * .9);
      c.quadraticCurveTo(0, s * .72, s * .5, s * .9); c.quadraticCurveTo(s * .7, s * .5, s * .4, -s * .6); c.closePath();
      var g = c.createLinearGradient(0, -s, 0, s);
      g.addColorStop(0, shade(col, -.22)); g.addColorStop(1, shade(col, .35));
      c.fillStyle = g; c.fill(); c.strokeStyle = INK + ".25)"; c.lineWidth = .5; c.stroke();
      c.fillStyle = "rgba(255,255,255,.7)"; c.beginPath(); c.arc(0, s * .55, s * .09, 0, 7); c.fill();
      c.restore();
    }
  }

  function butterfly(c, x, y, s, col, rot) {
    c.save(); c.translate(x, y); c.rotate(rot);
    c.shadowColor = "rgba(40,30,20,.2)"; c.shadowBlur = s * .3; c.shadowOffsetY = s * .1;
    for (var side = -1; side <= 1; side += 2) {
      c.save(); c.scale(side, 1);
      var g = c.createRadialGradient(0, 0, s * .08, s * .45, -s * .4, s * 1.05);
      g.addColorStop(0, shade(col, -.35)); g.addColorStop(.5, col); g.addColorStop(.82, shade(col, .12)); g.addColorStop(.86, "#2A211B"); g.addColorStop(1, "#2A211B");
      c.beginPath(); c.moveTo(0, 0);
      c.bezierCurveTo(s * .12, -s * .92, s * 1.12, -s * 1.02, s * 1.0, -s * .36);
      c.bezierCurveTo(s * .9, -s * .06, s * .4, 0, 0, 0);
      c.fillStyle = g; c.fill();
      c.beginPath(); c.moveTo(0, 0);
      c.bezierCurveTo(s * .62, s * .02, s * .86, s * .46, s * .56, s * .72);
      c.bezierCurveTo(s * .3, s * .88, s * .08, s * .44, 0, 0);
      c.fill();
      c.shadowColor = "transparent";
      c.strokeStyle = "rgba(35,25,20,.55)"; c.lineWidth = s * .02;
      [[.95, -.62], [.72, -.84], [1.0, -.36], [.6, .6], [.76, .34]].forEach(function (v) {
        c.beginPath(); c.moveTo(s * .04, 0); c.quadraticCurveTo(s * v[0] * .45, s * v[1] * .28, s * v[0] * .9, s * v[1] * .9); c.stroke();
      });
      c.fillStyle = "rgba(255,255,255,.9)";
      for (var i = 0; i < 6; i++) { c.beginPath(); c.arc(s * (.62 + i * .07), -s * (.9 - i * .11), s * .028, 0, 7); c.fill(); }
      for (i = 0; i < 3; i++) { c.beginPath(); c.arc(s * (.58 - i * .1), s * (.68 - i * .06), s * .025, 0, 7); c.fill(); }
      c.restore();
    }
    c.fillStyle = "#2A211B";
    c.beginPath(); c.ellipse(0, s * .1, s * .05, s * .36, 0, 0, 7); c.fill();
    c.strokeStyle = "#2A211B"; c.lineWidth = s * .02;
    [-1, 1].forEach(function (k) {
      c.beginPath(); c.moveTo(0, -s * .2); c.quadraticCurveTo(k * s * .1, -s * .55, k * s * .26, -s * .64); c.stroke();
      c.beginPath(); c.arc(k * s * .26, -s * .64, s * .03, 0, 7); c.fill();
    });
    c.restore();
  }

  function stamp(c, x, y, w, T, r, rot) {
    var h = w * 1.22, pad = 6, k = 2;
    var off = document.createElement("canvas");
    off.width = (w + pad * 2) * k; off.height = (h + pad * 2) * k;
    var o = off.getContext("2d"); o.scale(k, k); o.lineCap = "round";
    o.fillStyle = "#FBF7EE"; o.fillRect(pad, pad, w, h);
    o.fillStyle = shade(T.paper, .2); o.fillRect(pad + w * .1, pad + w * .1, w * .8, h - w * .34);
    o.strokeStyle = rgba(T.accent, .8); o.lineWidth = 1; o.strokeRect(pad + w * .1, pad + w * .1, w * .8, h - w * .34);
    blossom(o, pad + w * .5, pad + w * .1 + (h - w * .34) * .45, w * .22, pick(r, T.flowers), r);
    o.fillStyle = T.accent;
    o.font = Math.round(w * .15) + "px " + F_PRINT; o.fillText(Math.ceil(r() * 9) + "¢", pad + w * .12, pad + h - w * .08);
    o.font = Math.round(w * .08) + "px " + F_TYPE; o.fillText("FLORA", pad + w * .52, pad + h - w * .09);
    o.globalCompositeOperation = "destination-out";
    for (var i = pad; i <= pad + w; i += 7) { o.beginPath(); o.arc(i, pad, 2.4, 0, 7); o.fill(); o.beginPath(); o.arc(i, pad + h, 2.4, 0, 7); o.fill(); }
    for (i = pad; i <= pad + h; i += 7) { o.beginPath(); o.arc(pad, i, 2.4, 0, 7); o.fill(); o.beginPath(); o.arc(pad + w, i, 2.4, 0, 7); o.fill(); }
    c.save(); c.translate(x, y); c.rotate(rot);
    c.shadowColor = "rgba(60,40,20,.25)"; c.shadowBlur = 5; c.shadowOffsetY = 2;
    c.drawImage(off, -w / 2 - pad, -h / 2 - pad, w + pad * 2, h + pad * 2);
    c.restore();
  }

  function tape(c, x, y, w, rot, col) {
    c.save(); c.translate(x, y); c.rotate(rot);
    c.fillStyle = rgba(col, .45);
    c.beginPath(); c.moveTo(-w / 2, -8);
    for (var i = -8; i <= 8; i += 2.7) c.lineTo(-w / 2 + (i % 2 ? 1.5 : -1), i);
    c.lineTo(w / 2, 8);
    for (i = 8; i >= -8; i -= 2.7) c.lineTo(w / 2 + (i % 2 ? -1.5 : 1), i);
    c.closePath(); c.fill();
    c.restore();
  }

  function lily(c, x, y, R, col, r, rot, spot) {
    spot = spot || "#9E3550";
    c.save(); c.translate(x, y); c.rotate(rot == null ? r() * 6.28 : rot);
    c.shadowColor = "rgba(70,35,30,.2)"; c.shadowBlur = R * .18; c.shadowOffsetY = R * .05;
    var order = [1, 3, 5, 0, 2, 4];               
    order.forEach(function (i, n) {
      var a = i * Math.PI / 3 + between(r, -.06, .06), back = n < 3;
      var L = R * (back ? .95 : 1.02), W = R * (back ? .2 : .24), curl = between(r, -.18, .18);
      c.save(); c.rotate(a);
      c.beginPath(); c.moveTo(0, 0);
      c.bezierCurveTo(-W * 1.2, -L * .25, -W * 1.1, -L * .7, -W * .15 + curl * W, -L);
      c.quadraticCurveTo(curl * W * 2, -L * 1.06, W * .25 + curl * W, -L * .96);
      c.bezierCurveTo(W * 1.1, -L * .68, W * 1.25, -L * .25, 0, 0);
      c.closePath();
      var g = c.createLinearGradient(0, 0, 0, -L);
      g.addColorStop(0, "#E9E3A8"); g.addColorStop(.18, shade(col, back ? -.06 : 0)); g.addColorStop(.55, col); g.addColorStop(1, shade(col, .35));
      c.fillStyle = g; c.fill();
      if (n === 0) c.shadowColor = "transparent";
      
      var g2 = c.createLinearGradient(-W, 0, W, 0);
      g2.addColorStop(0, rgba(spot, 0)); g2.addColorStop(.5, rgba(spot, back ? .22 : .32)); g2.addColorStop(1, rgba(spot, 0));
      c.fillStyle = g2; c.fill();
      c.strokeStyle = INK + ".24)"; c.lineWidth = .6; c.stroke();
      
      c.strokeStyle = rgba(spot, .45); c.lineWidth = .8;
      c.beginPath(); c.moveTo(0, -L * .08); c.quadraticCurveTo(curl * W, -L * .55, curl * W * .6, -L * .92); c.stroke();
      
      c.fillStyle = rgba(spot, .75);
      for (var k = 0; k < 9; k++) {
        var t = between(r, .12, .5), sx = between(r, -.5, .5) * W * (1 - t);
        c.beginPath(); c.ellipse(sx, -L * t, R * .012 + .5, R * .02 + .6, 0, 0, 7); c.fill();
      }
      
      c.strokeStyle = "rgba(255,255,255,.55)"; c.lineWidth = .9;
      c.beginPath(); c.moveTo(-W * .9, -L * .45); c.quadraticCurveTo(-W * 1.05, -L * .7, -W * .3, -L * .95); c.stroke();
      c.restore();
    });
    c.shadowColor = "transparent";
    
    for (var s = 0; s < 6; s++) {
      var aa = s * Math.PI / 3 + .5 + between(r, -.15, .15), LL = R * between(r, .55, .72);
      var ex = Math.cos(aa) * LL, ey = Math.sin(aa) * LL;
      c.strokeStyle = "#D8D49A"; c.lineWidth = Math.max(.7, R * .018);
      c.beginPath(); c.moveTo(0, 0); c.quadraticCurveTo(ex * .5 + ey * .1, ey * .5 - ex * .1, ex, ey); c.stroke();
      c.save(); c.translate(ex, ey); c.rotate(aa + Math.PI / 2);
      c.fillStyle = "#A8541E"; c.beginPath(); c.ellipse(0, 0, R * .07, R * .025, 0, 0, 7); c.fill();
      c.restore();
    }
    c.strokeStyle = "#BFC98A"; c.lineWidth = Math.max(1, R * .028);
    c.beginPath(); c.moveTo(0, 0); c.lineTo(R * .1, -R * .62); c.stroke();
    c.fillStyle = "#9FAE63"; c.beginPath(); c.arc(R * .1, -R * .62, R * .04, 0, 7); c.fill();
    c.restore();
  }

  function lilyBud(c, x, y, s, col, ang, spot) {
    c.save(); c.translate(x, y); c.rotate(ang);
    c.beginPath(); c.moveTo(0, 0);
    c.bezierCurveTo(-s * .28, -s * .3, -s * .24, -s * .85, 0, -s * 1.15);
    c.bezierCurveTo(s * .24, -s * .85, s * .28, -s * .3, 0, 0);
    var g = c.createLinearGradient(0, 0, 0, -s);
    g.addColorStop(0, "#A9BD84"); g.addColorStop(.5, shade(col, -.05)); g.addColorStop(1, rgba(spot || "#9E3550", .55));
    c.fillStyle = g; c.fill(); c.strokeStyle = INK + ".25)"; c.lineWidth = .5; c.stroke();
    c.strokeStyle = "rgba(255,255,255,.5)"; c.beginPath(); c.moveTo(0, -s * .1); c.lineTo(0, -s * 1.05); c.stroke();
    c.restore();
  }

  function lilyStem(c, x, y, len, T, r, lean) {
    lean = lean == null ? between(r, -.25, .25) : lean;
    var p = [[x, y], [x + len * lean * .2, y - len * .4], [x + len * lean * .7, y - len * .75], [x + len * lean, y - len]];
    stem(c, p, shade(T.leaves[1], -.28), Math.max(1.4, len * .012));
    for (var i = 1; i < 9; i++) {
      var t = i / 11, q = bez(p, t), tg = tangent(p, t);
      leaf(c, q[0], q[1], len * between(r, .13, .18), tg + (i % 2 ? .45 : -.45), pick(r, T.leaves), r, false);
    }
    var top = bez(p, 1), mid = bez(p, .82), tg2 = tangent(p, .85);
    var col = T.flowers[pick(r, [0, 0, 1, 3])], spot = T.spot;
    lily(c, top[0], top[1], len * .2, col, r, null, spot);
    lily(c, mid[0] + Math.cos(tg2 + 1.3) * len * .14, mid[1] + Math.sin(tg2 + 1.3) * len * .14, len * .16, T.flowers[pick(r, [0, 1, 3])], r, null, spot);
    var bq = bez(p, .7);
    lilyBud(c, bq[0], bq[1], len * .14, T.flowers[1], tg2 - 1.1, spot);
    lilyBud(c, top[0], top[1] - len * .05, len * .11, T.flowers[0], tg2 + .6, spot);
  }

  function berries(c, x, y, s, col, r) {
    c.strokeStyle = INK + ".35)"; c.lineWidth = .6;
    for (var i = 0; i < 7; i++) {
      var bx = x + between(r, -s, s), by = y + between(r, -s * .6, s * .9), br = s * between(r, .22, .32);
      c.beginPath(); c.moveTo(x, y - s * .6); c.quadraticCurveTo((x + bx) / 2, y, bx, by - br); c.stroke();
      var g = c.createRadialGradient(bx - br * .35, by - br * .35, br * .1, bx, by, br);
      g.addColorStop(0, shade(col, .45)); g.addColorStop(.6, col); g.addColorStop(1, shade(col, -.4));
      c.fillStyle = g; c.beginPath(); c.arc(bx, by, br, 0, 7); c.fill();
      c.fillStyle = "rgba(255,255,255,.7)"; c.beginPath(); c.arc(bx - br * .35, by - br * .35, br * .18, 0, 7); c.fill();
    }
  }

  function bell(c, x, y, s, col, ang) {
    c.save(); c.translate(x, y); c.rotate(ang);
    c.strokeStyle = INK + ".35)"; c.lineWidth = .6;
    c.beginPath(); c.moveTo(0, 0); c.quadraticCurveTo(s * .3, s * .2, s * .2, s * .5); c.stroke();
    c.translate(s * .2, s * .5);
    c.beginPath();
    c.moveTo(-s * .25, 0); c.quadraticCurveTo(-s * .35, s * .55, -s * .5, s * .75);
    c.lineTo(-s * .25, s * .66); c.lineTo(0, s * .8); c.lineTo(s * .25, s * .66); c.lineTo(s * .5, s * .75);
    c.quadraticCurveTo(s * .35, s * .55, s * .25, 0); c.closePath();
    var g = c.createLinearGradient(0, 0, 0, s * .8);
    g.addColorStop(0, shade(col, -.2)); g.addColorStop(1, shade(col, .3));
    c.fillStyle = g; c.fill(); c.strokeStyle = INK + ".25)"; c.stroke();
    c.restore();
  }

  function richVine(c, p, T, r, size) {
    var stemCol = shade(T.leaves[1], -.35);
    stem(c, p, stemCol, Math.max(1.4, size * .07));
    
    var p2 = p.map(function (pt, i) { return [pt[0] + (i % 2 ? size * .35 : -size * .25), pt[1] + (i % 2 ? -size * .3 : size * .25)]; });
    stem(c, p2, shade(T.leaves[2], -.3), Math.max(.8, size * .03));
    var N = 22, side = 1;
    for (var i = 1; i < N; i++) {
      var t = i / N, a = bez(p, t), tg = tangent(p, t);
      leaf(c, a[0], a[1], size * between(r, .45, .7), tg + side * between(r, .6, 1.0), pick(r, T.leaves), r, r() < .3);
      if (r() < .3) tendril(c, a[0], a[1], size * .2, side, stemCol);
      if (i % 4 === 2) {
        
        var ang = tg + side * between(r, .7, 1.1), L = size * between(r, 1.4, 2.2);
        var e = [a[0] + Math.cos(ang) * L, a[1] + Math.sin(ang) * L];
        var bp = [a, [a[0] + Math.cos(ang - side * .3) * L * .4, a[1] + Math.sin(ang - side * .3) * L * .4], [e[0] - Math.cos(ang) * L * .2, e[1] - Math.sin(ang) * L * .2], e];
        stem(c, bp, stemCol, Math.max(.8, size * .035));
        var q = bez(bp, .5);
        leaf(c, q[0], q[1], size * .45, tangent(bp, .5) - side * .8, pick(r, T.leaves), r, false);
        var k = r();
        if (k < .3) blossom(c, e[0], e[1], size * .38, pick(r, T.flowers), r);
        else if (k < .5) berries(c, e[0], e[1], size * .22, pick(r, ["#8E2B3C", "#3F5F92", "#6B2D5C"]), r);
        else if (k < .75) { bell(c, e[0], e[1], size * .38, pick(r, T.flowers), -side * .3); bell(c, e[0] - side * size * .25, e[1] + size * .1, size * .3, pick(r, T.flowers), side * .3); }
        else bud(c, e[0], e[1], size * .35, pick(r, T.flowers), tangent(bp, 1) + Math.PI / 2, T.leaves[1]);
      } else if (r() < .15) {
        blossom(c, a[0], a[1], size * .28, pick(r, T.flowers), r);
      }
      side = -side;
    }
  }

  function wallpaper(size) {
    var cv = document.createElement("canvas"); cv.width = cv.height = size;
    var c = cv.getContext("2d"), r = rng(20260925);
    c.lineCap = "round"; c.lineJoin = "round";
    c.strokeStyle = "rgba(110, 80, 60, .09)"; c.lineWidth = 1.1;
    function outlineLily(x, y, R, rot) {
      c.save(); c.translate(x, y); c.rotate(rot);
      for (var i = 0; i < 6; i++) {
        c.save(); c.rotate(i * Math.PI / 3);
        c.beginPath(); c.moveTo(0, 0);
        c.bezierCurveTo(-R * .25, -R * .3, -R * .22, -R * .75, 0, -R);
        c.bezierCurveTo(R * .22, -R * .75, R * .25, -R * .3, 0, 0); c.stroke();
        c.beginPath(); c.moveTo(0, -R * .1); c.lineTo(0, -R * .8); c.stroke();
        c.restore();
      }
      c.restore();
    }
    function outlineLeaf(x, y, L, rot) {
      c.save(); c.translate(x, y); c.rotate(rot);
      c.beginPath(); c.moveTo(0, 0); c.quadraticCurveTo(L * .5, -L * .28, L, 0); c.quadraticCurveTo(L * .5, L * .28, 0, 0); c.stroke();
      c.beginPath(); c.moveTo(0, 0); c.lineTo(L * .9, 0); c.stroke();
      c.restore();
    }
    var spots = [[.25, .25, 1], [.75, .75, 1], [.75, .2, .6], [.2, .78, .6]];
    spots.forEach(function (s) {
      var x = s[0] * size, y = s[1] * size, R = size * .09 * s[2];
      c.beginPath(); c.moveTo(x, y); c.bezierCurveTo(x - R, y + R * 1.5, x + R * .5, y + R * 2.4, x - R * .2, y + R * 3.2); c.stroke();
      outlineLeaf(x - R * .3, y + R * 1.4, R * 1.4, 2.5); outlineLeaf(x + R * .1, y + R * 2.2, R * 1.2, .5);
      outlineLily(x, y, R, r() * 6.28);
      for (var k = 0; k < 5; k++) { c.beginPath(); c.arc(x + between(r, -R * 2, R * 2), y + between(r, -R * 2, R * 2), 1.4, 0, 7); c.stroke(); }
    });
    return cv.toDataURL("image/png");
  }

  function spray(c, cx, cy, S, T, r, dir, spread, withLilies) {
    dir = dir == null ? -Math.PI / 2 : dir; spread = spread == null ? Math.PI * 2 : spread;
    var stemCol = shade(T.leaves[1], -.3), i, a, p, end;
    wash(c, cx, cy, S * .75, T.flowers[0], r);
    
    var n = 9, ends = [];
    for (i = 0; i < n; i++) {
      a = dir + (i / (n - 1) - .5) * spread + between(r, -.12, .12);
      var L = S * between(r, .55, .95);
      end = [cx + Math.cos(a) * L, cy + Math.sin(a) * L];
      p = [[cx, cy], [cx + Math.cos(a) * L * .35, cy + Math.sin(a) * L * .35 + between(r, -10, 10)],
           [cx + Math.cos(a + .2) * L * .7, cy + Math.sin(a + .2) * L * .7], end];
      stem(c, p, stemCol, Math.max(1, S * .012));
      var q = bez(p, .45), tg = tangent(p, .45), lc = pick(r, T.leaves);
      if (r() < .5) roseLeaf(c, q[0], q[1], S * .32, tg + (i % 2 ? .7 : -.7), lc, r);
      else leaf(c, q[0], q[1], S * .24, tg + (i % 2 ? .6 : -.6), lc, r, false);
      if (r() < .4) { q = bez(p, .75); tendril(c, q[0], q[1], S * .04, i % 2 ? 1 : -1, stemCol); }
      ends.push([end, tangent(p, 1)]);
    }
    
    for (i = 0; i < 3; i++) {
      a = dir + between(r, -.5, .5) * spread;
      babyBreath(c, cx + Math.cos(a) * S * .45, cy + Math.sin(a) * S * .45, S * .16, r, stemCol);
    }
    
    ends.forEach(function (e, k) {
      var col = pick(r, T.flowers);
      if (k % 3 === 0) bud(c, e[0][0], e[0][1], S * .08, col, e[1] + Math.PI / 2, T.leaves[1]);
      else if (k % 3 === 1) blossom(c, e[0][0], e[0][1], S * .09, col, r);
      else daisy(c, e[0][0], e[0][1], S * .085, pick(r, T.flowers), r);
    });
    
    for (i = 0; i < 4; i++) {
      a = dir + between(r, -.45, .45) * spread; var d = S * between(r, .22, .42);
      var x = cx + Math.cos(a) * d, y = cy + Math.sin(a) * d, col2 = pick(r, T.flowers);
      if (i % 2) blossom(c, x, y, S * between(r, .11, .15), col2, r); else daisy(c, x, y, S * between(r, .11, .14), col2, r);
    }
    
    if (withLilies) {
      var LT = THEMES.lily;
      for (i = 0; i < 3; i++) {
        a = dir + (i - 1) * spread * .22;
        var lx = cx + Math.cos(a) * S * .38, ly = cy + Math.sin(a) * S * .38;
        leaf(c, lx, ly, S * .4, a + .4, LT.leaves[i % 4], r, false);
        leaf(c, lx, ly, S * .36, a - .5, LT.leaves[(i + 1) % 4], r, false);
        lily(c, lx, ly, S * between(r, .2, .26), LT.flowers[pick(r, [0, 0, 1, 3])], r, null, LT.spot);
      }
      lilyBud(c, cx + Math.cos(dir) * S * .7, cy + Math.sin(dir) * S * .7, S * .16, LT.flowers[1], dir + Math.PI / 2, LT.spot);
    }
    
    rose(c, cx + Math.cos(dir + .6) * S * .14, cy + Math.sin(dir + .6) * S * .14, S * .2, T.flowers[1], r);
    rose(c, cx, cy, S * .26, T.flowers[0], r);
    if (r() < .6) rose(c, cx + Math.cos(dir - .9) * S * .22, cy + Math.sin(dir - .9) * S * .22, S * .15, T.flowers[2], r);
  }

  function vine(c, p, T, r, size, buds) {
    var stemCol = shade(T.leaves[1], -.35);
    stem(c, p, stemCol, Math.max(1.1, size * .05));
    var N = 16, side = 1;
    for (var i = 1; i < N; i++) {
      var t = i / N, a = bez(p, t), tg = tangent(p, t);
      leaf(c, a[0], a[1], size * between(r, .5, .75), tg + side * between(r, .7, 1.0), pick(r, T.leaves), r, false);
      if (r() < .18) tendril(c, a[0], a[1], size * .16, side, stemCol);
      if (buds && r() < .22) blossom(c, a[0], a[1], size * .26, pick(r, T.flowers), r);
      else if (buds && r() < .12) bud(c, a[0], a[1], size * .3, pick(r, T.flowers), tg + side * 1.3, T.leaves[1]);
      side = -side;
    }
  }

  function base(c, w, h, T, r) {
    c.fillStyle = T.paper; c.fillRect(0, 0, w, h);
    grain(c, w, h, r, 80); stain(c, w, h, r, 2);
  }

  function collage(canvas, themeName, seed) {
    var s = setup(canvas); if (!s) return;
    var c = s.c, w = s.w, h = s.h, T = THEMES[themeName] || THEMES.rose, r = rng(hash(seed)), m = Math.min(w, h);
    base(c, w, h, T, r);
    
    paperPiece(c, w * between(r, -.05, .1), h * between(r, .05, .2), w * .62, h * .7, "letter", T, r, between(r, -.03, .03));
    paperPiece(c, w * between(r, .45, .6), -8, w * .5, h * .42, themeName === "blue" ? "plaid" : pick(r, ["news", "music"]), T, r, between(r, -.03, .03));
    if (w > 320) paperPiece(c, w * .55, h * .7, w * .5, h * .4, pick(r, ["kraft", "ledger", "music"]), T, r, between(r, -.02, .02));
    
    richVine(c, [[-10, h * between(r, .1, .3)], [w * .25, h * between(r, -.05, .2)], [w * .5, h * between(r, .05, .3)], [w * .8, -10]], T, r, m * .1);
    if (themeName === "blue" || r() < .35) spike(c, w * between(r, .08, .22), h + 6, h * .75, T.flowers[0], T, r);
    
    spray(c, w * between(r, .5, .62), h * between(r, .55, .65), m * .62, T, r, -Math.PI / 2 - .3, Math.PI * 1.7, r() < .6);
    
    stamp(c, w * between(r, .78, .88), h * between(r, .16, .26), m * .16, T, r, between(r, -.12, .12));
    tape(c, w * between(r, .2, .4), h * between(r, .06, .12), m * .28, between(r, -.25, .25), T.flowers[0]);
    butterfly(c, w * between(r, .15, .4), h * between(r, .3, .55), m * .085, pick(r, T.butterfly), between(r, -.5, .5));
  }

  function heroScene(canvas, seed, opts) {
    var s = setup(canvas); if (!s) return;
    var c = s.c, w = s.w, h = s.h, r = rng(hash(seed)), narrow = w < 900;
    if (!(opts && opts.transparent)) base(c, w, h, { paper: "#EFE5D3" }, r);
    paperPiece(c, -20, h * .08, w * .55, h * .84, "letter", THEMES.pressed, r, -.015);
    paperPiece(c, w * .5, -10, w * .3, h * .42, "news", THEMES.pressed, r, .02);
    paperPiece(c, w * .68, h * .45, w * .36, h * .5, "music", THEMES.pressed, r, -.02);
    if (!narrow) paperPiece(c, w * .42, h * .7, w * .2, h * .34, "plaid", THEMES.blue, r, .03);
    
    richVine(c, [[-10, h * .05], [w * .28, -24], [w * .55, h * .14], [w * .85, -10]], THEMES.garden, r, 26);
    richVine(c, [[w * .02, -10], [-20, h * .35], [w * .06, h * .65], [-10, h + 10]], THEMES.pressed, r, 22);
    if (narrow) {
      lilyStem(c, w * .88, h + 10, h * .7, THEMES.lily, r, -.2);
      spray(c, w * .95, h * .06, Math.min(w, h) * .7, THEMES.rose, r, Math.PI * .75, Math.PI * 1.1, true);
      spray(c, w * .02, h * .98, Math.min(w, h) * .6, THEMES.blue, r, -Math.PI * .25, Math.PI * 1.1);
    } else {
      
      lilyStem(c, w * .8, h + 10, h * .95, THEMES.lily, r, -.12);
      lilyStem(c, w * .9, h + 10, h * .8, THEMES.lily, r, .08);
      spikeRow(c, w, h, r);
      spray(c, w * .97, h * .03, h * .82, THEMES.rose, r, Math.PI * .72, Math.PI * 1.2, true);
      spray(c, w * .03, h * 1.0, h * .62, THEMES.pressed, r, -Math.PI * .28, Math.PI * 1.1);
      spray(c, w * .7, h * 1.03, h * .5, THEMES.garden, r, -Math.PI / 2, Math.PI * 1.1, true);
      stamp(c, w * .6, h * .16, 50, THEMES.garden, r, -.1);
      tape(c, w * .62, h * .06, 90, .2, "#E3AFBA");
    }
    butterfly(c, w * (narrow ? .7 : .58), h * .38, 20, "#3E6DB0", -.3);
    butterfly(c, w * (narrow ? .25 : .86), h * .62, 16, "#D99A3D", .4);
    if (!narrow) butterfly(c, w * .45, h * .9, 14, "#C4452F", .2);
  }
  function spikeRow(c, w, h, r) {
    for (var i = 0; i < 3; i++) spike(c, w * (.84 + i * .045), h + 6, h * between(r, .5, .7), THEMES.blue.flowers[i % 2], THEMES.blue, r);
  }

  function banner(canvas, themeName, seed, opts) {
    var s = setup(canvas); if (!s) return;
    var c = s.c, w = s.w, h = s.h, T = THEMES[themeName] || THEMES.rose, r = rng(hash(seed));
    if (!(opts && opts.transparent)) base(c, w, h, { paper: "#EFE5D3" }, r);
    paperPiece(c, w * .05, h * .15, w * .4, h * .9, "letter", THEMES.pressed, r, -.01);
    paperPiece(c, w * .6, -10, w * .35, h * .6, themeName === "blue" ? "plaid" : "news", THEMES.pressed, r, .015);
    richVine(c, [[-10, h * .2], [w * .3, h * -.1], [w * .6, h * .25], [w + 10, h * .05]], T, r, 22);
    if (w > 600) lilyStem(c, w * .86, h + 10, h * 1.05, THEMES.lily, r, -.15);
    spray(c, w * .98, h * .5, h * .95, T, r, Math.PI, Math.PI * 1.2, true);
    if (w > 600) spray(c, w * .02, h * .9, h * .7, THEMES[pick(r, THEME_NAMES)], r, -Math.PI / 4, Math.PI);
    butterfly(c, w * .8, h * .3, 16, pick(r, T.butterfly), -.3);
  }

  function garland(canvas, themeName, seed) {
    var s = setup(canvas); if (!s) return;
    var c = s.c, w = s.w, h = s.h, T = THEMES[themeName] || THEMES.rose, r = rng(hash(seed)), mid = h / 2;
    var p = [[-10, mid], [w * .33, mid - h * .3], [w * .66, mid + h * .3], [w + 10, mid]];
    richVine(c, p, T, r, h * .3);
    var n = Math.max(3, Math.round(w / 220));
    for (var i = 0; i < n; i++) {
      var a = bez(p, (i + .5) / n), col = pick(r, T.flowers), R = h * between(r, .17, .23), k = i % 4;
      if (k === 0) rose(c, a[0], a[1], R, col, r);
      else if (k === 1) lily(c, a[0], a[1], R * 1.25, pick(r, THEMES.lily.flowers), r, null, THEMES.lily.spot);
      else if (k === 2) blossom(c, a[0], a[1], R, col, r);
      else daisy(c, a[0], a[1], R, pick(r, T.flowers), r);
    }
    if (w > 500) butterfly(c, w * between(r, .25, .75), h * .26, h * .15, pick(r, T.butterfly), between(r, -.4, .4));
  }

  function corners(canvas, seed) {
    var s = setup(canvas); if (!s) return;
    var c = s.c, w = s.w, h = s.h, r = rng(hash(seed)), m = Math.min(w, h), narrow = w < 900;
    richVine(c, [[-10, h * .08], [w * .3, -20], [w * .6, h * .1], [w + 10, -10]], THEMES.garden, r, 24);
    spray(c, w * .02, h * .02, m * .55, THEMES.rose, r, Math.PI / 4, Math.PI, true);
    spray(c, w * .98, h * .98, m * .6, THEMES.pressed, r, -Math.PI * .75, Math.PI, true);
    if (!narrow) {
      lilyStem(c, w * .06, h + 10, h * .75, THEMES.lily, r, .15);
      spray(c, w * .97, h * .05, m * .4, THEMES.blue, r, Math.PI * .75, Math.PI);
    }
    butterfly(c, w * .9, h * .45, 18, "#D99A3D", -.3);
  }

  function specimen(canvas, themeName, seed) {
    var s = setup(canvas); if (!s) return;
    var c = s.c, w = s.w, h = s.h, T = THEMES[themeName] || THEMES.rose, r = rng(hash(seed));
    var p = [[w * .5, h + 4], [w * .46, h * .72], [w * .54, h * .5], [w * .5, h * .36]];
    stem(c, p, shade(T.leaves[1], -.3), 1.8);
    roseLeaf(c, w * .49, h * .78, Math.min(w, h) * .42, -2.5, T.leaves[0], r);
    leaf(c, w * .52, h * .62, Math.min(w, h) * .3, -.6, T.leaves[1], r, true);
    bud(c, w * .53, h * .55, Math.min(w, h) * .09, T.flowers[1], .9, T.leaves[1]);
    var k = r(), col = T.flowers[0], R = Math.min(w, h) * .22;
    if (k < .45) rose(c, w * .5, h * .34, R, col, r);
    else if (k < .75) blossom(c, w * .5, h * .34, R, col, r);
    else daisy(c, w * .5, h * .34, R, col, r);
  }

  window.Flora = {
    themes: THEME_NAMES,
    collage: collage, heroScene: heroScene, banner: banner, garland: garland, specimen: specimen,
    wallpaper: wallpaper, corners: corners
  };
})();
