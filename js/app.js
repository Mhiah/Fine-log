/* Fine-log app: state, font library, colour roles, live UI preview, prompt, export and sharing. */
(function () {
"use strict";
const FL = window.FL, $ = (id) => document.getElementById(id);
const each = (sel, fn, root) => Array.prototype.forEach.call((root || document).querySelectorAll(sel), fn);
const CATS = { s: "Sans serif", e: "Serif", d: "Display", h: "Handwriting", m: "Monospace" };
const FALLBACK = { s: "sans-serif", e: "serif", d: "sans-serif", h: "cursive", m: "monospace" };
const FONTS = window.FL_FONTS.trim().split("\n").map((l) => {
  const p = l.split("|");
  return { n: p[0], c: p[1], v: p[2] || "", b: (p[3] || "").indexOf("b") > -1, x: (p[3] || "").indexOf("x") > -1 };
});
const BYNAME = {};
FONTS.forEach((f) => { BYNAME[f.n.toLowerCase()] = f; });
const info = (n) => BYNAME[String(n || "").toLowerCase()];
const TPLS = window.FL_TEMPLATES;
$("statFonts").textContent = FONTS.length.toLocaleString("en");
$("statTpl").textContent = TPLS.length;

/* ---------- small helpers ---------- */
let toastT;
function toast(msg) { const t = $("toast"); t.textContent = msg; t.classList.add("on"); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove("on"), 1900); }
function copy(text, ok) {
  const fail = () => toast("Copy is blocked here. Press and hold the text to copy it.");
  try { navigator.clipboard.writeText(text).then(() => toast(ok || "Copied"), fail); } catch (e) { fail(); }
}
function esc(s) { return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])); }
function seg(key, options, current) {
  return options.map((o) => '<button class="btn small" type="button" data-k="' + key + '" data-v="' + o[0] + '" aria-pressed="' + (o[0] === current) + '">' + o[1] + "</button>").join("");
}

/* ---------- fonts ---------- */
const loaded = {};
function ensureFont(name) {
  const f = info(name); if (!f || loaded[f.n]) return; loaded[f.n] = 1;
  let spec = "";
  if (f.v) { const it = f.v.charAt(0) === "i", w = f.v.replace("i", ""); spec = it ? ":ital,wght@1," + w : ":wght@" + w; }
  else if (f.b) spec = ":wght@400;700";
  const l = document.createElement("link"); l.rel = "stylesheet";
  l.href = "https://fonts.googleapis.com/css2?family=" + encodeURIComponent(f.n).replace(/%20/g, "+") + spec + "&display=swap";
  document.head.appendChild(l);
}
function fam(name) { const f = info(name); return f ? "'" + f.n + "'," + FALLBACK[f.c] : "sans-serif"; }
function wOf(name, bold) { const f = info(name); return !f ? "400" : f.v ? f.v.replace("i", "") : bold && f.b ? "700" : "400"; }
function stOf(name) { const f = info(name); return f && f.v && f.v.charAt(0) === "i" ? "italic" : "normal"; }
function fontCss(name, bold) { return "font-family:" + fam(name) + ";font-weight:" + wOf(name, bold) + ";font-style:" + stOf(name); }

/* ---------- state ---------- */
const DEFAULT = {
  fonts: { head: "Inter", body: "Inter", mono: "IBM Plex Mono" },
  colors: { bg: "#FFFFFF", text: "#111111", primary: "#111111", secondary: "#6B7280", accent: "#2B3FE0" },
  auto: { surface: true, muted: true, secondary: false, accent: false, border: true },
  shape: { radius: "soft", shadow: "soft", density: "comfortable", spacing: "tight", size: "medium" },
  tpl: "landing", view: "desktop",
  prompt: { mode: "new", tool: "any", len: "full" }
};
function sanitize(o) {
  const S = JSON.parse(JSON.stringify(DEFAULT)); o = o || {};
  ["head", "body", "mono"].forEach((k) => { const f = info(o.fonts && o.fonts[k]); if (f) S.fonts[k] = f.n; });
  FL.ROLES.forEach((r) => { const h = FL.normHex(o.colors && o.colors[r[0]]); if (h) S.colors[r[0]] = h; });
  if (o.auto) FL.AUTO_ROLES.forEach((k) => { S.auto[k] = !(o.auto[k] === false && S.colors[k]); });
  else if (o.colors) FL.AUTO_ROLES.forEach((k) => { S.auto[k] = !FL.normHex(o.colors[k]); });
  Object.keys(FL.SHAPE).forEach((k) => { if (o.shape && FL.SHAPE[k][o.shape[k]]) S.shape[k] = o.shape[k]; });
  if (TPLS.some((t) => t.id === o.tpl)) S.tpl = o.tpl;
  if (o.view === "mobile") S.view = "mobile";
  if (o.prompt) { if (o.prompt.mode === "redesign") S.prompt.mode = "redesign"; if (FL.TOOLS[o.prompt.tool]) S.prompt.tool = o.prompt.tool; if (o.prompt.len === "compact") S.prompt.len = "compact"; }
  FL.derive(S.colors, S.auto);
  return S;
}
function encodeState(S) {
  const o = { f: [S.fonts.head, S.fonts.body, S.fonts.mono], c: FL.ROLES.map((r) => S.colors[r[0]].slice(1)), a: FL.AUTO_ROLES.map((k) => (S.auto[k] ? 1 : 0)).join(""),
    s: Object.keys(FL.SHAPE).map((k) => S.shape[k]), t: S.tpl };
  return btoa(unescape(encodeURIComponent(JSON.stringify(o)))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
function decodeState(code) {
  try {
    const o = JSON.parse(decodeURIComponent(escape(atob(code.replace(/-/g, "+").replace(/_/g, "/")))));
    const colors = {}, auto = {}, shape = {};
    FL.ROLES.forEach((r, i) => { colors[r[0]] = "#" + o.c[i]; });
    FL.AUTO_ROLES.forEach((k, i) => { auto[k] = o.a.charAt(i) === "1"; });
    Object.keys(FL.SHAPE).forEach((k, i) => { shape[k] = o.s[i]; });
    return { fonts: { head: o.f[0], body: o.f[1], mono: o.f[2] }, colors, auto, shape, tpl: o.t };
  } catch (e) { return null; }
}
let S, cameFromLink = false;
(function boot() {
  let o = null;
  if (/^#s=/.test(location.hash)) { o = decodeState(location.hash.slice(3)); cameFromLink = !!o; }
  if (!o) { try { o = JSON.parse(localStorage.getItem("fl-state-v6") || "null"); } catch (e) {} }
  S = sanitize(o);
})();
let target = "primary", cur = S.colors.primary;
function save() { try { localStorage.setItem("fl-state-v6", JSON.stringify(S)); } catch (e) {} }

/* ---------- welcome ---------- */
/* 49 fonts grouped by resemblance, from cursive down to clean, then the site font: 50 in all */
const CYCLE = [
  /* cursive */ "Pinyon Script", "Great Vibes", "Allura", "Sacramento", "Dancing Script", "Satisfy", "Lobster", "Pacifico",
  /* handwriting */ "Homemade Apple", "Rock Salt", "Permanent Marker", "Shadows Into Light", "Caveat", "Indie Flower", "Patrick Hand",
  /* display */ "Monoton", "Limelight", "Shrikhand", "Bangers", "Bungee", "Orbitron", "Unbounded", "Righteous",
  /* mono and pixel */ "Press Start 2P", "VT323", "Space Mono", "IBM Plex Mono",
  /* slab */ "Special Elite", "Alfa Slab One", "Bitter",
  /* serif */ "Abril Fatface", "DM Serif Display", "Fraunces", "Cinzel", "Bodoni Moda", "Playfair Display", "Cormorant Garamond", "Merriweather", "Lora",
  /* bold sans */ "Archivo Black", "Anton", "Bebas Neue", "Oswald",
  /* clean sans */ "Comfortaa", "Quicksand", "Raleway", "DM Sans", "Montserrat", "Poppins"
];
const FINAL = "San Francisco / Inter", word = $("word"), stage = $("stage"), intro = $("intro");
let running = false, introT;
function fitWord() { word.style.transform = ""; word.style.transform = "scale(" + Math.min(1, stage.clientWidth / word.offsetWidth) + ")"; }
function setWelcome(i) {
  if (i < CYCLE.length) word.style.cssText = "font-family:" + fam(CYCLE[i]) + ";font-weight:400;letter-spacing:0";
  else word.style.cssText = "";
  $("tick").textContent = i < CYCLE.length ? CYCLE[i] : FINAL;
  fitWord();
}
function closeIntro() { running = false; clearTimeout(introT); intro.classList.add("out"); setTimeout(() => intro.classList.remove("show", "out"), 520); }
function playWelcome() {
  if (running) return; running = true; intro.classList.remove("out"); intro.classList.add("show"); $("rule").classList.remove("draw");
  let i = 0; const n = CYCLE.length;
  (function step() {
    if (!running) return;
    setWelcome(i);
    if (i >= n) { void $("rule").offsetWidth; $("rule").classList.add("draw"); introT = setTimeout(closeIntro, 1100); return; }
    /* fonts 1 to 40 at one steady, quicker speed; 41 to 50 slow down to the landing */
    const d = i < 40 ? 130 : 220 + 430 * Math.pow((i - 39) / (n - 39), 1.4); i++; introT = setTimeout(step, d);
  })();
}
function startWelcome() {
  if (window.matchMedia && matchMedia("(prefers-reduced-motion:reduce)").matches) return;
  intro.classList.add("show"); setWelcome(0);
  let go = false, left = 0; const begin = () => { if (go) return; go = true; playWelcome(); };
  const sheetDone = () => {
    if (--left > 0) return;
    if (!document.fonts || !document.fonts.load) return begin();
    Promise.all(CYCLE.map((n) => document.fonts.load("64px '" + n + "'", "Welcome").catch(() => {}))).then(begin);
  };
  for (let i = 0; i < CYCLE.length; i += 25) {   /* two small requests, only the letters of "Welcome" */
    const l = document.createElement("link"); l.rel = "stylesheet"; left++;
    l.href = "https://fonts.googleapis.com/css2?" + CYCLE.slice(i, i + 25).map((n) => "family=" + n.replace(/ /g, "+")).join("&") + "&text=Welcome&display=block";
    l.onload = sheetDone; l.onerror = sheetDone; document.head.appendChild(l);
  }
  setTimeout(begin, 4000);
}
$("replay").onclick = playWelcome;
$("skip").onclick = closeIntro;
window.addEventListener("resize", () => { if (running) fitWord(); });

/* ---------- font library ---------- */
let fq = "", fcat = "all", fshown = 0, flist = FONTS;
const PAGE = 12;
const io = "IntersectionObserver" in window ? new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { ensureFont(e.target.dataset.n); io.unobserve(e.target); } }), { rootMargin: "400px" }) : null;
function cardHtml(f) {
  return '<article class="fcard" data-n="' + esc(f.n) + '"><header><h3>' + esc(f.n) + '</h3><span class="tag">' + CATS[f.c] + (f.x ? " · non-Latin" : "") + "</span></header>" +
    '<p class="sample" style="' + fontCss(f.n) + '">' + esc($("fsample").value || f.n) + "</p>" +
    '<div class="row"><button class="btn small" data-use="head" aria-pressed="' + (S.fonts.head === f.n) + '" type="button">Heading</button>' +
    '<button class="btn small" data-use="body" aria-pressed="' + (S.fonts.body === f.n) + '" type="button">Body</button>' +
    (f.c === "m" ? '<button class="btn small" data-use="mono" aria-pressed="' + (S.fonts.mono === f.n) + '" type="button">Numbers</button>' : "") +
    '<button class="btn small" data-use="copy" type="button">Copy name</button></div></article>';
}
function renderFonts(reset) {
  const g = $("fgrid");
  if (reset) {
    const q = fq.toLowerCase();
    flist = FONTS.filter((f) => (fcat === "all" || f.c === fcat) && (!q || f.n.toLowerCase().indexOf(q) > -1));
    g.innerHTML = ""; fshown = 0;
  }
  const next = flist.slice(fshown, fshown + (fshown ? 24 : PAGE));
  g.insertAdjacentHTML("beforeend", next.map(cardHtml).join(""));
  fshown += next.length;
  if (next.length) Array.prototype.slice.call(g.children, -next.length).forEach((c) => (io ? io.observe(c) : ensureFont(c.dataset.n)));
  $("fcount").textContent = flist.length ? "Showing " + fshown.toLocaleString("en") + " of " + flist.length.toLocaleString("en") + " families" : "No font matches that. Check the spelling or try a shorter search.";
  $("fmore").hidden = fshown >= flist.length;
}
$("fcats").innerHTML = '<button class="btn small" data-c="all" aria-pressed="true" type="button">All</button>' + Object.keys(CATS).map((k) => '<button class="btn small" data-c="' + k + '" aria-pressed="false" type="button">' + CATS[k] + "</button>").join("");
$("fsearch").addEventListener("input", function () { fq = this.value.trim(); renderFonts(true); });
$("fsample").addEventListener("input", function () { const v = this.value; each(".sample", (p) => { p.textContent = v || p.parentNode.dataset.n; }); });
$("fcats").addEventListener("click", function (e) { const b = e.target.closest("button"); if (!b) return; fcat = b.dataset.c; each("button", (x) => x.setAttribute("aria-pressed", x === b), this); renderFonts(true); });
$("fmore").onclick = () => renderFonts(false);
const SLOT = { head: "Heading", body: "Body", mono: "Numbers" };
function setFont(slot, name) { const f = info(name); if (!f) return; S.fonts[slot] = f.n; ensureFont(f.n); apply(); toast(SLOT[slot] + " font set to " + f.n); }
$("fgrid").addEventListener("click", (e) => {
  const b = e.target.closest("button"); if (!b) return; const n = b.closest(".fcard").dataset.n, u = b.dataset.use;
  if (u === "copy") return copy(n, "Copied " + n);
  setFont(u, n);
});

/* pairing suggestions: fixed, hand-picked rules */
const PAIRS = {
  "Manrope": ["DM Sans", "Inter", "Source Serif 4"], "Playfair Display": ["Source Sans 3", "Lato", "Karla"], "Fraunces": ["Instrument Sans", "Work Sans", "DM Sans"],
  "Bricolage Grotesque": ["Instrument Sans", "Figtree", "Newsreader"], "Bebas Neue": ["Montserrat", "Open Sans", "Roboto"], "Syne": ["Inter", "DM Sans", "Karla"],
  "Space Grotesk": ["Inter", "IBM Plex Sans", "Work Sans"], "DM Serif Display": ["DM Sans", "Karla", "Nunito Sans"], "Unbounded": ["Manrope", "Figtree", "Outfit"],
  "Abril Fatface": ["Poppins", "Lato", "Work Sans"], "Cinzel": ["Raleway", "EB Garamond", "Lato"], "Montserrat": ["Merriweather", "Open Sans", "Lora"],
  "Poppins": ["Inter", "Lora", "Open Sans"], "Inter": ["Source Serif 4", "Lora", "Newsreader"], "Oswald": ["Quattrocento", "Open Sans", "Lato"],
  "Lora": ["Inter", "Source Sans 3", "Nunito Sans"], "Archivo Black": ["Archivo", "Roboto", "Work Sans"], "Anton": ["Roboto", "Open Sans", "Inter"], "Raleway": ["Lato", "Merriweather", "Roboto Slab"]
};
const PAIR_BY_CAT = { s: ["Source Serif 4", "Inter", "Lora"], e: ["DM Sans", "Inter", "Work Sans"], d: ["DM Sans", "Inter", "Work Sans"], h: ["DM Sans", "Karla", "Work Sans"], m: ["IBM Plex Sans", "Inter", "Work Sans"] };
const MONOS = ["IBM Plex Mono", "DM Mono", "JetBrains Mono", "Space Mono"];
function renderPair() {
  const f = info(S.fonts.head), sug = (PAIRS[S.fonts.head] || PAIR_BY_CAT[f ? f.c : "s"]).filter((n) => n !== S.fonts.head);
  const chip = (slot, n) => { ensureFont(n); return '<button class="btn small" type="button" data-slot="' + slot + '" data-n="' + esc(n) + '" aria-pressed="' + (S.fonts[slot] === n) + '" style="' + fontCss(n) + '">' + esc(n) + "</button>"; };
  $("pair").innerHTML =
    '<div class="cur"><div><span>Heading</span><b style="' + fontCss(S.fonts.head, true) + '">' + esc(S.fonts.head) + "</b></div><div><span>Body</span><b style=\"" + fontCss(S.fonts.body) + '">' + esc(S.fonts.body) + "</b></div><div><span>Numbers</span><b style=\"" + fontCss(S.fonts.mono) + '">' + esc(S.fonts.mono) + "</b></div></div>" +
    '<div class="sug">Body fonts that pair with ' + esc(S.fonts.head) + ": " + sug.map((n) => chip("body", n)).join("") + "</div>" +
    '<div class="sug">For numbers and code: ' + MONOS.map((n) => chip("mono", n)).join("") + "</div>";
}
$("pair").addEventListener("click", (e) => { const b = e.target.closest("[data-slot]"); if (b) setFont(b.dataset.slot, b.dataset.n); });

/* ---------- colours ---------- */
function setCur(hex, from, silent) {
  hex = FL.normHex(hex); if (!hex) return; cur = hex; const h = FL.hexToHsl(hex);
  if (from !== "sliders") { $("sh").value = h[0]; $("ss").value = h[1]; $("sl").value = h[2]; }
  const H = +$("sh").value, Sa = +$("ss").value, L = +$("sl").value;
  $("oh").textContent = H + "°"; $("os").textContent = Sa + "%"; $("ol").textContent = L + "%";
  $("sh").style.background = "linear-gradient(90deg," + [0, 60, 120, 180, 240, 300, 360].map((d) => "hsl(" + d + "," + Math.max(Sa, 35) + "%," + Math.min(Math.max(L, 35), 65) + "%)").join(",") + ")";
  $("ss").style.background = "linear-gradient(90deg,hsl(" + H + ",0%," + L + "%),hsl(" + H + ",100%," + L + "%))";
  $("sl").style.background = "linear-gradient(90deg,#000,hsl(" + H + "," + Sa + "%,50%),#fff)";
  $("curchip").style.background = hex; $("curhex").textContent = hex;
  if (from !== "hex") $("hexin").value = hex;
  if (from !== "native") $("native").value = hex.toLowerCase();
  renderRel(H, Sa);
  if (target && !silent) { S.colors[target] = hex; if (target in S.auto) S.auto[target] = false; apply(); }
}
function renderRel(H, Sa) {
  const sw = (x, label) => '<button class="sw" type="button" data-hex="' + x + '" title="' + (label ? label + " " : "") + x + '" aria-label="' + (label ? label + " " : "") + x + '" style="background:' + x + '"></button>';
  const L = Math.min(Math.max(+$("sl").value, 30), 70);
  $("rel").innerHTML =
    '<div class="fam"><span>Shades</span>' + STEPS.map((l) => sw(FL.hslToHex(H, Sa, l))).join("") + "</div>" +
    '<div class="fam"><span>Goes with</span>' + [["Opposite", 180], ["Neighbour", 30], ["Neighbour", -30], ["Triad", 120], ["Triad", -120], ["Split", 150], ["Split", 210]].map((p) => sw(FL.hslToHex(H + p[1], Sa, L), p[0])).join("") + "</div>";
}
["sh", "ss", "sl"].forEach((id) => $(id).addEventListener("input", () => setCur(FL.hslToHex(+$("sh").value, +$("ss").value, +$("sl").value), "sliders")));
$("hexin").addEventListener("input", function () { setCur(this.value, "hex"); });
$("hexin").addEventListener("blur", function () { this.value = cur; });
$("native").addEventListener("input", function () { setCur(this.value, "native"); });
$("copyhex").onclick = () => copy(cur, "Copied " + cur);
$("target").innerHTML = FL.ROLES.map((r) => '<option value="' + r[0] + '">' + r[1] + "</option>").join("") + '<option value="">Nothing, just browsing</option>';
function setTarget(t) { target = t; $("target").value = t; if (t) setCur(S.colors[t], null, true); renderRoles(); }
$("target").addEventListener("change", function () { setTarget(this.value); });
function renderRoles() {
  const had = document.activeElement && $("roles").contains(document.activeElement) ? document.activeElement.dataset.role : null;
  $("roles").innerHTML = FL.ROLES.map((r) => {
    const k = r[0], isAuto = k in S.auto;
    return '<div class="role' + (target === k ? " on" : "") + '"><button type="button" data-role="' + k + '" aria-pressed="' + (target === k) + '"><i class="dot" style="background:' + S.colors[k] + '"></i><span><b>' + r[1] + "</b><small>" + r[2] + '</small></span><span class="mono">' + S.colors[k] + "</span></button>" +
      (isAuto ? (S.auto[k] ? '<span class="auto">auto</span>' : '<button class="auto" type="button" data-reset="' + k + '">reset to auto</button>') : "") + "</div>";
  }).join("");
  if (had) { const el = $("roles").querySelector('[data-role="' + had + '"]'); if (el) el.focus(); }
  const c = S.colors, onP = FL.onColor(c.primary);
  const pill = (label, a, b, min) => { const v = FL.contrast(a, b); return '<span class="pill ' + (v >= min ? "ok" : "bad") + '">' + label + " " + v.toFixed(1) + ":1</span>"; };
  $("pills").innerHTML = pill("Text on background", c.text, c.bg, 4.5) + pill("Muted text on background", c.muted, c.bg, 4.5) + pill("Button text on primary", onP, c.primary, 4.5) + pill("Primary on background", c.primary, c.bg, 3);
}
$("roles").addEventListener("click", (e) => {
  const r = e.target.closest("[data-reset]"); if (r) { S.auto[r.dataset.reset] = true; apply(); if (target === r.dataset.reset) setCur(S.colors[target], null, true); return; }
  const b = e.target.closest("[data-role]"); if (b) { setTarget(b.dataset.role); toast("Now changing " + b.querySelector("b").textContent + ". Move the sliders or tap a colour."); }
});
const HUES = [["Red", 2, 82], ["Orange", 24, 88], ["Amber", 40, 90], ["Yellow", 52, 90], ["Lime", 85, 70], ["Green", 140, 62], ["Teal", 172, 66], ["Cyan", 192, 80], ["Blue", 218, 84], ["Indigo", 240, 72], ["Violet", 268, 72], ["Pink", 328, 78], ["Neutral", 225, 7]];
const STEPS = [95, 88, 78, 66, 54, 44, 34, 24, 13];
const PALETTES = [
  ["Ink and cobalt", "#F3F4EF", "#151821", "#2B3FE0", "#6B5BD6", "#F2B01E"],
  ["Aubergine and copper", "#F7F1E8", "#2A1830", "#5B2A6B", "#B8683A", "#D99A2B"],
  ["Midnight mint", "#0E1420", "#E8EEF2", "#3DDC97", "#4AA8FF", "#FFC857"],
  ["Harbour sunset", "#FFF6EC", "#2B1A12", "#E4572E", "#F3A712", "#3A7D7B"],
  ["Forest ledger", "#F1F5EE", "#16241B", "#1F7A4D", "#8AB661", "#E0A526"],
  ["Rose quartz", "#FFF5F6", "#2D1B22", "#D6336C", "#8E5CD9", "#F59F00"],
  ["Graphite", "#111315", "#EDEDED", "#FFFFFF", "#9AA0A6", "#FF5C39"],
  ["Ocean deck", "#F0F7FA", "#0F2A3A", "#0B7FAB", "#1FB5A8", "#FF7A59"],
  ["Terminal", "#0B0F0C", "#D7F5DD", "#35E06F", "#1FA7A0", "#F2E94E"],
  ["Paper and plum", "#FBF8F3", "#231F2B", "#6C3FB5", "#C75B9B", "#2F9E8F"],
  ["Solar", "#FFFBEA", "#2A2305", "#D48806", "#B4531A", "#2563EB"],
  ["Violet night", "#15111F", "#EFEAFB", "#9B7BFF", "#FF7AC6", "#5EEAD4"]
];
function applyPalette(p) {
  S.colors.bg = p[1]; S.colors.text = p[2]; S.colors.primary = p[3]; S.colors.secondary = p[4]; S.colors.accent = p[5];
  S.auto = { surface: true, muted: true, border: true, secondary: false, accent: false };
  apply(); if (target) setCur(S.colors[target], null, true);
}
function buildColourStatic() {
  $("pals").innerHTML = PALETTES.map((p, i) => '<button class="pal" type="button" data-pal="' + i + '"><i>' + p.slice(1).map((x) => '<u style="background:' + x + '"></u>').join("") + "</i>" + p[0] + "</button>").join("");
  $("fams").innerHTML = HUES.map((h) => '<div class="fam"><span>' + h[0] + "</span>" + STEPS.map((l) => { const x = FL.hslToHex(h[1], h[2], l); return '<button class="sw" type="button" data-hex="' + x + '" title="' + x + '" aria-label="' + h[0] + " " + x + '" style="background:' + x + '"></button>'; }).join("") + "</div>").join("");
  const names = "aliceblue antiquewhite aqua aquamarine azure beige bisque black blanchedalmond blue blueviolet brown burlywood cadetblue chartreuse chocolate coral cornflowerblue cornsilk crimson darkblue darkcyan darkgoldenrod darkgray darkgreen darkkhaki darkmagenta darkolivegreen darkorange darkorchid darkred darksalmon darkseagreen darkslateblue darkslategray darkturquoise darkviolet deeppink deepskyblue dimgray dodgerblue firebrick floralwhite forestgreen fuchsia gainsboro ghostwhite gold goldenrod gray green greenyellow honeydew hotpink indianred indigo ivory khaki lavender lavenderblush lawngreen lemonchiffon lightblue lightcoral lightcyan lightgoldenrodyellow lightgray lightgreen lightpink lightsalmon lightseagreen lightskyblue lightslategray lightsteelblue lightyellow lime limegreen linen maroon mediumaquamarine mediumblue mediumorchid mediumpurple mediumseagreen mediumslateblue mediumspringgreen mediumturquoise mediumvioletred midnightblue mintcream mistyrose moccasin navajowhite navy oldlace olive olivedrab orange orangered orchid palegoldenrod palegreen paleturquoise palevioletred papayawhip peachpuff peru pink plum powderblue purple rebeccapurple red rosybrown royalblue saddlebrown salmon sandybrown seagreen seashell sienna silver skyblue slateblue slategray snow springgreen steelblue tan teal thistle tomato turquoise violet wheat white whitesmoke yellow yellowgreen".split(" ");
  const ctx = document.createElement("canvas").getContext("2d"); let h = "";
  names.forEach((n) => { ctx.fillStyle = "#000"; ctx.fillStyle = n; const x = FL.normHex(ctx.fillStyle); if (!x || (x === "#000000" && n !== "black")) return;
    h += '<button class="nc" type="button" data-hex="' + x + '"><i style="background:' + x + '"></i>' + n + " <code>" + x + "</code></button>"; });
  $("named").innerHTML = h;
}
$("colours").addEventListener("click", (e) => {
  const p = e.target.closest("[data-pal]"); if (p) { applyPalette(PALETTES[+p.dataset.pal]); toast(PALETTES[+p.dataset.pal][0] + " applied"); return; }
  const b = e.target.closest("[data-hex]"); if (!b) return; setCur(b.dataset.hex);
  const role = FL.ROLES.filter((r) => r[0] === target)[0];
  toast(role ? role[1] + " set to " + b.dataset.hex : b.dataset.hex + " selected");
});

/* ---------- live preview ---------- */
const tplOf = (id) => TPLS.filter((t) => t.id === id)[0] || TPLS[0];
function fitFrame(frame) {
  const inner = frame.firstElementChild, W = frame.clientWidth; if (!W || !inner) return;
  const mode = frame.dataset.mode;
  if (mode === "mobile") { const w = Math.min(390, W - 16); inner.style.width = w + "px"; inner.style.transform = ""; inner.style.marginLeft = (W - w) / 2 + "px"; frame.style.height = ""; return; }
  const tw = Math.max(W, 1040), s = W / tw;
  inner.style.marginLeft = "0"; inner.style.width = tw + "px"; inner.style.transform = s < 1 ? "scale(" + s + ")" : "";
  frame.style.height = (mode === "thumb" ? Math.round(W * (+frame.dataset.ratio || 0.66)) : Math.ceil(inner.offsetHeight * s)) + "px";
}
const ro = "ResizeObserver" in window ? new ResizeObserver((es) => es.forEach((e) => fitFrame(e.target.classList.contains("frame") ? e.target : e.target.parentNode))) : null;
function watch(frame) { if (ro) { ro.observe(frame); ro.observe(frame.firstElementChild); } fitFrame(frame); }
function buildPreviewStatic() {
  $("gallery").innerHTML = TPLS.map((t) => '<button class="thumb" type="button" data-tpl="' + t.id + '" aria-pressed="' + (S.tpl === t.id) + '"><div class="frame" data-mode="thumb"><div class="tpl">' + t.html + "</div></div><span><b>" + t.name + "</b><small>" + t.blurb + "</small></span></button>").join("");
  each("#gallery .frame", watch);
  $("filters").innerHTML = seg("cat", [["All", "All"]].concat(TPLS.map((t) => [t.cat, t.cat])), "All").replace(/class="btn small"/g, "");
  $("pvinner").className = "tpl"; watch($("pvframe")); watch($("heroprev").firstElementChild);
  window.addEventListener("resize", () => each(".frame", fitFrame));
}
function renderTools() {
  const sh = FL.SHAPE, opt = (k) => Object.keys(sh[k]).map((v) => [v, sh[k][v].label]);
  const grp = (label, key, options, curV) => '<div class="grp"><span>' + label + '</span><div class="seg">' + seg(key, options, curV) + "</div></div>";
  $("tools").innerHTML = grp("View", "view", [["desktop", "Desktop"], ["mobile", "Mobile"]], S.view) + grp("Corners", "radius", opt("radius"), S.shape.radius) + grp("Shadows", "shadow", opt("shadow"), S.shape.shadow) +
    grp("Spacing", "density", opt("density"), S.shape.density) + grp("Heading spacing", "spacing", opt("spacing"), S.shape.spacing) + grp("Text size", "size", opt("size"), S.shape.size);
}
$("tools").addEventListener("click", (e) => { const b = e.target.closest("[data-k]"); if (!b) return; if (b.dataset.k === "view") S.view = b.dataset.v; else S.shape[b.dataset.k] = b.dataset.v; apply(); });
$("gallery").addEventListener("click", (e) => { const b = e.target.closest("[data-tpl]"); if (!b) return; S.tpl = b.dataset.tpl; apply(); });
$("filters").addEventListener("click", function (e) {
  const b = e.target.closest("[data-v]"); if (!b) return; const c = b.dataset.v;
  each("button", (x) => x.setAttribute("aria-pressed", x === b), this);
  each("#gallery .thumb", (t) => { t.hidden = c !== "All" && tplOf(t.dataset.tpl).cat !== c; });
  each("#gallery .frame", fitFrame);
});
$("heroprev").onclick = () => { showTab("library"); $("pvframe").scrollIntoView({ block: "start" }); };
let shownTpl = null;
function renderPreview() {
  if (shownTpl !== S.tpl) { $("pvinner").innerHTML = tplOf(S.tpl).html; $("heroinner").innerHTML = tplOf(S.tpl).html; shownTpl = S.tpl; each("#gallery .thumb", (b) => b.setAttribute("aria-pressed", b.dataset.tpl === S.tpl)); }
  $("pvframe").dataset.mode = S.view; fitFrame($("pvframe"));
}

/* ---------- apply everything ---------- */
function setVars() {
  const c = S.colors, sh = FL.SHAPE, st = document.documentElement.style, rad = sh.radius[S.shape.radius], den = sh.density[S.shape.density];
  const v = {
    bg: c.bg, surface: c.surface, text: c.text, muted: c.muted, primary: c.primary, secondary: c.secondary, accent: c.accent, border: c.border,
    onp: FL.onColor(c.primary), ons: FL.onColor(c.secondary), ona: FL.onColor(c.accent),
    fh: fam(S.fonts.head), fhw: wOf(S.fonts.head, true), fhs: stOf(S.fonts.head), fb: fam(S.fonts.body), fbw: wOf(S.fonts.body), fbs: stOf(S.fonts.body), fm: fam(S.fonts.mono), fmw: wOf(S.fonts.mono),
    fs: sh.size[S.shape.size].v + "px", ls: sh.spacing[S.shape.spacing].v, r: rad.r + "px", rs: Math.min(rad.r, 8) + "px", rb: rad.rb, sh: sh.shadow[S.shape.shadow].v, pad: den.pad + "px", gap: den.gap + "px"
  };
  Object.keys(v).forEach((k) => st.setProperty("--t-" + k, v[k]));
}
let exTab = "css";
function renderExport() {
  const fn = { css: FL.cssVars, tailwind: FL.tailwind, tokens: FL.tokens }[exTab];
  $("expre").textContent = fn(S, info);
  $("exlab").textContent = { css: "CSS variables", tailwind: "Tailwind config", tokens: "Design tokens (JSON)" }[exTab];
  $("sharelink").value = location.href.split("#")[0] + "#s=" + encodeState(S);
}
function markFonts() {
  each(".fcard", (c) => ["head", "body", "mono"].forEach((k) => { const b = c.querySelector('[data-use="' + k + '"]'); if (b) b.setAttribute("aria-pressed", S.fonts[k] === c.dataset.n); }));
}
let promptShown = false;
function syncSegs() {
  each("#tools [data-k], #popts [data-k]", (b) => { const k = b.dataset.k, v = k === "view" ? S.view : k in S.shape ? S.shape[k] : S.prompt[k]; b.setAttribute("aria-pressed", v === b.dataset.v); });
}
function apply() {
  FL.derive(S.colors, S.auto);
  ["head", "body", "mono"].forEach((k) => ensureFont(S.fonts[k]));
  setVars(); renderRoles(); renderPair(); syncSegs(); renderPreview(); renderExport(); markFonts();
  $("dockaa").style.cssText = fontCss(S.fonts.head, true) + ";background:" + S.colors.bg + ";color:" + S.colors.text;
  $("dockfonts").textContent = S.fonts.head === S.fonts.body ? S.fonts.head : S.fonts.head + " + " + S.fonts.body;
  $("dockcols").innerHTML = ["bg", "text", "primary", "accent"].map((k) => '<i style="background:' + S.colors[k] + '" title="' + k + " " + S.colors[k] + '"></i>').join("") + ["primary", "accent", "surface", "bg"].map((k) => "<span>" + S.colors[k] + "</span>").join("");
  $("docktpl").textContent = tplOf(S.tpl).name;
  if (promptShown) writePrompt(true);
  save();
}

/* ---------- prompt ---------- */
function renderPromptOpts() {
  const grp = (label, key, options, curV) => '<div class="grp"><span class="lab" style="margin:0">' + label + '</span><div class="seg">' + seg(key, options, curV) + "</div></div>";
  $("popts").innerHTML = grp("I want to", "mode", [["new", "Build a new site"], ["redesign", "Redesign an existing site"]], S.prompt.mode) +
    grp("For", "tool", Object.keys(FL.TOOLS).map((k) => [k, FL.TOOLS[k].label]), S.prompt.tool) +
    grp("Length", "len", [["full", "Full specification"], ["compact", "Compact"]], S.prompt.len);
}
$("popts").addEventListener("click", (e) => { const b = e.target.closest("[data-k]"); if (!b) return; S.prompt[b.dataset.k] = b.dataset.v; apply(); });
function writePrompt(quiet) {
  const t = tplOf(S.tpl), text = FL.buildPrompt(S, $("brief").value, t, info);
  $("out").hidden = false; $("outpre").textContent = text; promptShown = true;
  $("outlab").textContent = "Your prompt · " + t.name + " · " + FL.TOOLS[S.prompt.tool].label + " · " + text.split(/\s+/).length + " words";
  if (!quiet) $("anote").textContent = "Built from your picks with preset rules. It updates as you change the design.";
}
$("askprompt").onclick = () => writePrompt(false);
$("brief").addEventListener("input", () => { if (promptShown) writePrompt(true); });
$("copyprompt").onclick = () => copy($("outpre").textContent, "Prompt copied");

/* suggestions: keyword rules, not AI */
const MOODS = {
  playful: { k: ["fun", "playful", "kids", "children", "toy", "party", "friendly", "cute"], heads: ["Fredoka", "Shrikhand", "Righteous", "Bungee", "Unbounded"], bodies: ["Nunito", "Figtree", "Outfit"], pals: [3, 5, 11, 10] },
  luxury: { k: ["luxury", "premium", "elegant", "fashion", "jewellery", "jewelry", "hotel", "wedding", "beauty"], heads: ["Italiana", "Cinzel", "Playfair Display", "DM Serif Display"], bodies: ["Lora", "Karla", "Work Sans"], pals: [1, 6, 9, 5] },
  tech: { k: ["saas", "tech", "ai", "developer", "crypto", "web3", "defi", "dashboard", "fintech", "app", "startup", "software", "blockchain", "finance"], heads: ["Space Grotesk", "Manrope", "Syne", "Bricolage Grotesque"], bodies: ["DM Sans", "IBM Plex Sans", "Instrument Sans", "Public Sans"], pals: [0, 2, 7, 11] },
  calm: { k: ["calm", "wellness", "minimal", "clean", "health", "soft", "yoga", "skincare", "simple", "quiet"], heads: ["Fraunces", "DM Serif Display", "Manrope"], bodies: ["Karla", "Figtree", "Work Sans"], pals: [4, 7, 5, 9] },
  editorial: { k: ["blog", "magazine", "portfolio", "editorial", "writer", "news", "journal", "agency", "studio"], heads: ["Playfair Display", "Fraunces", "Abril Fatface", "Archivo Black"], bodies: ["Source Serif 4", "Libre Franklin", "Instrument Sans"], pals: [0, 9, 6, 10] },
  dark: { k: ["dark", "night", "neon", "gaming", "game", "cyber", "terminal"], heads: ["Unbounded", "Syne", "Bebas Neue", "Space Grotesk"], bodies: ["Manrope", "DM Sans", "IBM Plex Sans"], pals: [2, 8, 11, 6] },
  retro: { k: ["retro", "vintage", "nft", "art", "bold", "poster", "music", "festival"], heads: ["Shrikhand", "Abril Fatface", "Bebas Neue", "Anton", "Righteous"], bodies: ["Karla", "Work Sans", "DM Sans"], pals: [3, 10, 1, 11] }
};
const pick = (a) => a[Math.floor(Math.random() * a.length)];
let examples = [], around = "none";
function suggest() {
  const words = $("brief").value.toLowerCase().split(/[^a-z0-9]+/);
  let matched = Object.keys(MOODS).filter((m) => MOODS[m].k.some((k) => words.indexOf(k) > -1));
  const label = matched.length ? "Matched to: " + matched.join(", ") + "." : "No keywords matched, so this is a mixed set.";
  if (!matched.length) matched = Object.keys(MOODS).sort(() => Math.random() - 0.5);
  const used = {}; examples = [];
  for (let i = 0; i < 4; i++) {
    const m = MOODS[matched[i % matched.length]];
    let pi = pick(m.pals), tries = 0; while (used[pi] && tries++ < 8) pi = pick(m.pals.concat([i, i + 4, i + 8]));
    used[pi] = 1; const p = PALETTES[pi % PALETTES.length];
    const ex = { name: p[0], heading: pick(m.heads), body: pick(m.bodies), pal: p };
    if (around === "fonts") { ex.heading = S.fonts.head; ex.body = S.fonts.body; }
    if (around === "colours") { ex.pal = ["Your colours", S.colors.bg, S.colors.text, S.colors.primary, S.colors.secondary, S.colors.accent]; ex.name = ex.heading; }
    examples.push(ex);
  }
  $("examples").innerHTML =
    '<div style="grid-column:1/-1" class="row"><span class="lab" style="margin:0">Build them around</span><div class="seg">' + seg("around", [["none", "Anything"], ["fonts", "My fonts"], ["colours", "My colours"]], around) + "</div></div>" +
    examples.map((c, i) => {
      ensureFont(c.heading); ensureFont(c.body); const p = c.pal;
      return '<article class="ex"><div class="face" style="background:' + p[1] + ";color:" + p[2] + '"><b style="' + fontCss(c.heading, true) + '">' + esc(c.name) + "</b>" +
        '<span style="' + fontCss(c.body) + '">Body text looks like this on the background.</span><em style="background:' + p[3] + ";color:" + FL.onColor(p[3]) + ";" + fontCss(c.body) + '">Button</em></div>' +
        '<div class="meta"><span>' + esc(c.heading) + " + " + esc(c.body) + '</span><span class="mono">' + p[1] + " · " + p[2] + " · " + p[3] + '</span><div><button class="btn small" type="button" data-ex="' + i + '">Use this one</button></div></div></article>';
    }).join("");
  $("anote").textContent = label + " These come from preset rules, not an AI model.";
}
$("askex").onclick = suggest;
$("examples").addEventListener("click", (e) => {
  const a = e.target.closest('[data-k="around"]'); if (a) { around = a.dataset.v; suggest(); return; }
  const b = e.target.closest("[data-ex]"); if (!b) return; const c = examples[+b.dataset.ex];
  S.fonts.head = c.heading; S.fonts.body = c.body; applyPalette(c.pal); toast("Applied. See it in the UI Library.");
});

/* ---------- export, share, saved ---------- */
$("extabs").addEventListener("click", function (e) { const b = e.target.closest("[data-x]"); if (!b) return; exTab = b.dataset.x; each("button", (x) => x.setAttribute("aria-pressed", x === b), this); renderExport(); });
$("copyex").onclick = () => copy($("expre").textContent, "Copied");
$("copylink").onclick = () => copy($("sharelink").value, "Link copied");
function getSaved() { try { return JSON.parse(localStorage.getItem("fl-saved") || "[]"); } catch (e) { return []; } }
function putSaved(a) { try { localStorage.setItem("fl-saved", JSON.stringify(a)); return true; } catch (e) { return false; } }
function renderSaved() {
  const a = getSaved();
  $("saved").innerHTML = a.length ? a.map((it, i) => { const o = decodeState(it.code) || {}, c = o.colors || {};
    return '<div class="it"><i>' + ["bg", "text", "primary", "secondary", "accent"].map((k) => '<u style="background:' + (c[k] || "#888") + '"></u>').join("") + "</i><b>" + esc(it.name) + '</b><button class="btn small" type="button" data-open="' + i + '">Open</button><button class="btn small" type="button" data-del="' + i + '" aria-label="Delete ' + esc(it.name) + '">Delete</button></div>'; }).join("")
    : '<p class="note" style="margin:0">Nothing saved yet. Name the current design and press Save.</p>';
}
$("savebtn").onclick = () => {
  const name = $("savename").value.trim() || S.fonts.head + " on " + S.colors.bg, a = getSaved();
  a.unshift({ name: name.slice(0, 40), code: encodeState(S) });
  if (putSaved(a.slice(0, 30))) { $("savename").value = ""; renderSaved(); toast("Saved " + name); } else toast("This browser would not let the design be saved. Copy the link instead.");
};
$("saved").addEventListener("click", (e) => {
  const o = e.target.closest("[data-open]"), d = e.target.closest("[data-del]"), a = getSaved();
  if (o) { const st = decodeState(a[+o.dataset.open].code); if (st) { const keep = { view: S.view, prompt: S.prompt }; S = sanitize(Object.assign(st, keep)); apply(); if (target) setCur(S.colors[target], null, true); toast("Opened " + a[+o.dataset.open].name); } }
  if (d) { a.splice(+d.dataset.del, 1); putSaved(a); renderSaved(); }
});

/* ---------- tabs ---------- */
const TABS = ["fonts", "colours", "library", "prompt", "export"];
let tab = "library";
function showTab(id, scroll) {
  if (TABS.indexOf(id) < 0) return; tab = id;
  each("section", (s) => s.classList.toggle("on", s.id === id));
  each("#nav a, #steps a", (l) => l.classList.toggle("on", l.getAttribute("href") === "#" + id));
  each(".frame", fitFrame);
  if (scroll) { const y = document.querySelector(".hero").getBoundingClientRect().bottom + window.scrollY - 70; window.scrollTo({ top: Math.max(0, y), behavior: "auto" }); }
}
document.addEventListener("click", (e) => {
  const a = e.target.closest('a[href^="#"]'); if (!a) return; const id = a.getAttribute("href").slice(1);
  if (TABS.indexOf(id) < 0) return; e.preventDefault();
  showTab(id, true);
  if (a.id === "dockprev") $("pvframe").scrollIntoView({ block: "start" });
  if (a.id === "dockprompt") { writePrompt(false); $("out").scrollIntoView({ block: "start" }); }
  try { history.replaceState(null, "", "#" + id); } catch (err) {}
});

/* ---------- boot ---------- */
FL._names = [].concat(MONOS, CYCLE, ...Object.keys(PAIRS).map((k) => [k].concat(PAIRS[k])), ...Object.keys(PAIR_BY_CAT).map((k) => PAIR_BY_CAT[k]), ...Object.keys(MOODS).map((k) => MOODS[k].heads.concat(MOODS[k].bodies))).filter((n) => !info(n));
buildColourStatic(); buildPreviewStatic(); renderTools(); renderPromptOpts(); renderFonts(true); renderSaved();
$("target").value = target; setCur(cur, null, true); apply(); startWelcome();
showTab(TABS.indexOf(location.hash.slice(1)) > -1 ? location.hash.slice(1) : "library");
if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => each(".frame", fitFrame));
if (cameFromLink) { toast("Opened a shared design"); try { history.replaceState(null, "", location.pathname + location.search); } catch (e) {} }
})();
