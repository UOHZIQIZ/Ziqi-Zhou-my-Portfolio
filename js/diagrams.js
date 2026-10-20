
(function () {
  "use strict";
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  var R = {
    
    fragment: function (d, t) {
      var before = d.before.map(function (x) { return '<li class="dg-app">' + esc(t(x)) + "</li>"; }).join("");
      return '<div class="dg dg-fragment">' +
        '<div class="dg-col"><p class="dg-label">' + esc(t(d.beforeLabel)) + '</p><ul class="dg-apps">' + before + "</ul></div>" +
        '<div class="dg-arrow" aria-hidden="true">→</div>' +
        '<div class="dg-col"><p class="dg-label">' + esc(t(d.afterLabel)) + '</p><div class="dg-hub"><strong>' + esc(t(d.after)) + "</strong>" +
        '<ul class="dg-apps dg-apps--in">' + before + "</ul></div></div></div>";
    },

    modules: function (d, t) {
      return '<div class="dg dg-modules"><p class="dg-label">' + esc(t(d.label)) + '</p><ol class="dg-grid">' +
        d.items.map(function (x, i) {
          return '<li><span class="dg-num">' + (i + 1) + "</span>" + esc(t(x)) + '<span class="dg-notes" aria-hidden="true"><i></i><i></i><i></i></span></li>';
        }).join("") + "</ol></div>";
    },

    funnel: function (d, t) {
      function boxes(n, cls) { var s = ""; for (var i = 0; i < n; i++) s += '<i class="' + cls + '"></i>'; return s; }
      return '<div class="dg dg-funnel">' +
        '<div class="dg-col"><div class="dg-boxes">' + boxes(d.from, "dg-box") + '</div><p><b class="dg-big">' + d.from + "</b> " + esc(t(d.fromLabel)) + "</p></div>" +
        '<div class="dg-arrow" aria-hidden="true">→</div>' +
        '<div class="dg-col"><div class="dg-boxes dg-boxes--pick">' + boxes(d.to, "dg-box dg-box--pick") + '</div><p><b class="dg-big">' + d.to + "</b> " + esc(t(d.toLabel)) + "</p></div></div>";
    },

    iterations: function (d, t) {
      var html = '<ol class="dg dg-iter">';
      d.items.forEach(function (x, i) {
        html += '<li class="dg-step' + (i === d.items.length - 1 ? " is-final" : "") + '"><span class="dg-ver">' + esc(x.name) + "</span><p>" + esc(t(x.note)) + "</p></li>";
        if (i < d.items.length - 1) html += '<li class="dg-test" aria-label="' + esc(t(d.test)) + '"><span>' + esc(t(d.test)) + "</span></li>";
      });
      return html + "</ol>";
    },

    bars: function (d, t) {
      var max = d.max || 100, W = 600, rowH = 56, top = 10, left = 56, right = 64, H = top + d.items.length * rowH + 30;
      var plot = W - left - right;
      var ticks = [0, 25, 50, 75, 100].filter(function (v) { return v <= max; });
      var svg = '<svg class="dg-svg" viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="' + esc(t(d.label)) + ": " +
        d.items.map(function (x) { return x.name + " " + x.value + d.unit; }).join(", ") + '">';
      ticks.forEach(function (v) {
        var x = left + plot * v / max;
        svg += '<line x1="' + x + '" x2="' + x + '" y1="' + top + '" y2="' + (H - 26) + '" class="dg-grid-line"/>' +
          '<text x="' + x + '" y="' + (H - 8) + '" text-anchor="middle" class="dg-tick">' + v + d.unit + "</text>";
      });
      d.items.forEach(function (x, i) {
        var y = top + i * rowH + 10, w = plot * x.value / max, last = i === d.items.length - 1;
        svg += '<text x="' + (left - 12) + '" y="' + (y + 22) + '" text-anchor="end" class="dg-name">' + esc(x.name) + "</text>" +
          '<rect x="' + left + '" y="' + y + '" width="' + w + '" height="32" class="' + (last ? "dg-bar dg-bar--hi" : "dg-bar") + '"/>' +
          '<text x="' + (left + w + 8) + '" y="' + (y + 22) + '" class="dg-val">' + x.value + d.unit + "</text>";
      });
      return '<div class="dg dg-bars"><p class="dg-label">' + esc(t(d.label)) + "</p>" + svg + "</svg></div>";
    },

    ia: function (d, t) {
      return '<div class="dg dg-ia"><div class="dg-root">' + esc(t(d.root)) + '</div><div class="dg-branch" aria-hidden="true"></div>' +
        '<ul class="dg-tabs">' + d.items.map(function (x) { return "<li>" + esc(t(x)) + "</li>"; }).join("") + "</ul>" +
        '<p class="dg-label dg-label--center">' + esc(t(d.note)) + "</p></div>";
    }
  };

  window.Diagrams = {
    render: function (kind, data, t) { return R[kind] ? R[kind](data, t) : ""; }
  };
})();
