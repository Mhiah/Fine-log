/* Fine-log colour maths and token derivation. */
(function () {
  "use strict";
  var FL = (window.FL = window.FL || {});

  FL.normHex = function (s) {
    s = String(s || "").trim().replace(/^#/, "");
    if (/^[0-9a-f]{3}$/i.test(s)) s = s.replace(/./g, "$&$&");
    return /^[0-9a-f]{6}$/i.test(s) ? "#" + s.toUpperCase() : null;
  };
  FL.rgb = function (h) {
    return [parseInt(h.substr(1, 2), 16), parseInt(h.substr(3, 2), 16), parseInt(h.substr(5, 2), 16)];
  };
  FL.toHex = function (r, g, b) {
    return ("#" + [r, g, b].map(function (v) {
      return ("0" + Math.max(0, Math.min(255, Math.round(v))).toString(16)).slice(-2);
    }).join("")).toUpperCase();
  };
  /* mix(a, b, t): t = 0 gives a, t = 1 gives b */
  FL.mix = function (a, b, t) {
    var x = FL.rgb(a), y = FL.rgb(b);
    return FL.toHex(x[0] + (y[0] - x[0]) * t, x[1] + (y[1] - x[1]) * t, x[2] + (y[2] - x[2]) * t);
  };
  FL.hslToHex = function (h, s, l) {
    h = ((h % 360) + 360) % 360; s /= 100; l /= 100;
    var a = s * Math.min(l, 1 - l);
    function f(n) { var k = (n + h / 30) % 12; return 255 * (l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1))); }
    return FL.toHex(f(0), f(8), f(4));
  };
  FL.hexToHsl = function (hex) {
    var c = FL.rgb(hex), r = c[0] / 255, g = c[1] / 255, b = c[2] / 255;
    var mx = Math.max(r, g, b), mn = Math.min(r, g, b), h = 0, s = 0, l = (mx + mn) / 2, d = mx - mn;
    if (d) {
      s = d / (1 - Math.abs(2 * l - 1));
      h = mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4;
      h = (h * 60 + 360) % 360;
    }
    return [Math.round(h), Math.round(s * 100), Math.round(l * 100)];
  };
  FL.lum = function (hex) {
    var c = FL.rgb(hex).map(function (v) { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); });
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
  };
  FL.contrast = function (a, b) {
    var x = FL.lum(a), y = FL.lum(b);
    return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
  };
  FL.onColor = function (hex) {
    return FL.contrast(hex, "#FFFFFF") >= FL.contrast(hex, "#111111") ? "#FFFFFF" : "#111111";
  };

  /* The eight colour roles. bg, text and primary are always chosen by the person;
     the other five are worked out from those three until the person sets them. */
  FL.ROLES = [
    ["bg", "Background", "Page background"],
    ["surface", "Surface", "Cards, panels, inputs"],
    ["text", "Text", "Headings and body text"],
    ["muted", "Muted text", "Labels, captions, hints"],
    ["primary", "Primary", "Main buttons, active states"],
    ["secondary", "Secondary", "Supporting actions, second chart line"],
    ["accent", "Accent", "Badges, highlights, status"],
    ["border", "Border", "Dividers and outlines"]
  ];
  FL.AUTO_ROLES = ["surface", "muted", "secondary", "accent", "border"];

  FL.derive = function (c, auto) {
    var dark = FL.lum(c.bg) < 0.35, p = FL.hexToHsl(c.primary);
    if (auto.surface) c.surface = dark ? FL.mix(c.bg, "#FFFFFF", 0.07) : (FL.lum(c.bg) > 0.97 ? FL.mix(c.bg, c.text, 0.035) : FL.mix(c.bg, "#FFFFFF", 0.7));
    if (auto.muted) c.muted = FL.mix(c.text, c.bg, 0.36);
    if (auto.border) c.border = FL.mix(c.text, c.bg, 0.85);
    if (auto.secondary) c.secondary = FL.hslToHex(p[0] - 34, Math.max(30, p[1] * 0.78), dark ? Math.max(p[2], 60) : Math.min(Math.max(p[2], 38), 52));
    if (auto.accent) c.accent = FL.hslToHex(p[0] + 165, Math.max(62, Math.min(p[1], 88)), dark ? 64 : 50);
    return c;
  };
})();
