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
/* system fonts: never downloaded, shown only where the device already has them */
const WHERE = { mac: "Apple devices", win: "Windows", both: "Apple and Windows" };
const GOOGLE_COUNT = FONTS.length;
(window.FL_SYSFONTS || []).forEach((l) => { const p = l.split("|"); if (BYNAME[p[0].toLowerCase()]) return;
  const f = { n: p[0], c: p[1], v: "", b: true, x: false, sys: p[2], css: p[3] || "" }; FONTS.push(f); BYNAME[f.n.toLowerCase()] = f; });
FONTS.sort((a, b) => a.n.localeCompare(b.n));
$("statFonts").textContent = FONTS.length.toLocaleString("en");
const info = (n) => BYNAME[String(n || "").toLowerCase()];
const TPLS = window.FL_TEMPLATES, DESIGNS = window.FL_DESIGNS, STYLES = window.FL_STYLES;
const designOf = (id) => DESIGNS.filter((d) => d.id === id)[0] || DESIGNS[0];

$("statTpl").textContent = DESIGNS.length;

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
  const f = info(name); if (!f || f.sys || loaded[f.n]) return; loaded[f.n] = 1;
  let spec = "";
  if (f.v) { const it = f.v.charAt(0) === "i", w = f.v.replace("i", ""); spec = it ? ":ital,wght@1," + w : ":wght@" + w; }
  else if (f.b) spec = ":wght@400;700";
  const l = document.createElement("link"); l.rel = "stylesheet";
  l.href = "https://fonts.googleapis.com/css2?family=" + encodeURIComponent(f.n).replace(/%20/g, "+") + spec + "&display=swap";
  document.head.appendChild(l);
}
function fam(name) { const f = info(name); return f ? (f.css || "'" + f.n + "'") + "," + FALLBACK[f.c] : "sans-serif"; }
function wOf(name, bold) { const f = info(name); return !f ? "400" : f.v ? f.v.replace("i", "") : bold && f.b ? "700" : "400"; }
function stOf(name) { const f = info(name); return f && f.v && f.v.charAt(0) === "i" ? "italic" : "normal"; }
function fontCss(name, bold) { return "font-family:" + fam(name) + ";font-weight:" + wOf(name, bold) + ";font-style:" + stOf(name); }

/* ---------- state ---------- */
const DEFAULT = {
  fonts: { head: "Manrope", body: "DM Sans", mono: "IBM Plex Mono" },
  colors: { bg: "#FAF7F2", text: "#241A22", primary: "#32132D", secondary: "#8A5A6B", accent: "#B65B3D" },
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
  if (DESIGNS.some((d) => d.id === o.tpl)) S.tpl = o.tpl;
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
  if (!o) { try { o = JSON.parse(localStorage.getItem("fl-state-v7") || "null"); } catch (e) {} }
  S = sanitize(o);
})();
let target = "primary", cur = S.colors.primary;
function save() { try { localStorage.setItem("fl-state-v7", JSON.stringify(S)); } catch (e) {} }

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
  fitWord(); requestAnimationFrame(fitWord);
}
function lockScroll(on) { document.documentElement.classList.toggle("intro-on", on); }
function closeIntro() { running = false; clearTimeout(introT); intro.classList.add("out"); lockScroll(false); window.scrollTo(0, 0); setTimeout(() => intro.classList.remove("show", "out"), 520); }
function playWelcome() {
  if (running) return; running = true; intro.classList.remove("out"); intro.classList.add("show"); lockScroll(true); $("rule").classList.remove("draw");
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
  intro.classList.add("show"); lockScroll(true); setWelcome(0);
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

const SLOT = { head: "Heading", body: "Body", mono: "Numbers" };
/* ---------- font chooser: a dropdown, 100 fonts at a time, as a list or as tiles ---------- */
let fq = "", fcat = "all", fpage = 0, flist = FONTS, picked = null, fslot = "head", fviewMode = "list", favs = [];
try { favs = JSON.parse(localStorage.getItem("fl-favs") || "[]").filter((n) => info(n)); } catch (e) {}
const FPAGE = 100, combo = $("fcombo"), drop = $("fdrop");
const io = "IntersectionObserver" in window ? new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { ensureFont(e.target.dataset.n); io.unobserve(e.target); } }), { root: $("flist"), rootMargin: "200px" }) : null;
function filterFonts() {
  const q = fq.toLowerCase();
  const inCat = (f) => fcat === "all" || (fcat === "fav" ? favs.indexOf(f.n) > -1 : fcat === "mac" ? f.sys === "mac" || f.sys === "both" : fcat === "win" ? f.sys === "win" || f.sys === "both" : f.c === fcat);
  flist = FONTS.filter((f) => inCat(f) && (!q || f.n.toLowerCase().indexOf(q) > -1));
  fpage = 0;
}
function renderList() {
  const items = flist.slice(fpage * FPAGE, (fpage + 1) * FPAGE), box = $("flist"), tiles = fviewMode === "tiles";
  box.classList.toggle("tiles", tiles);
  const star = (f) => '<button class="fstar" type="button" aria-pressed="' + (favs.indexOf(f.n) > -1) + '" aria-label="Favourite ' + esc(f.n) + '">★</button>';
  box.innerHTML = items.length ? items.map((f) => tiles
      ? '<div class="ftile" role="option" data-n="' + esc(f.n) + '" aria-selected="' + (picked === f.n) + '"><button class="fsel" type="button"><span class="aa" style="' + fontCss(f.n) + '">Aa</span><span class="nm">' + esc(f.n) + "</span></button>" + star(f) + "</div>"
      : '<div class="fitem" role="option" data-n="' + esc(f.n) + '" aria-selected="' + (picked === f.n) + '"><button class="fsel" type="button"><span style="' + fontCss(f.n) + '">' + esc(f.n) + "</span><small>" + (f.sys ? WHERE[f.sys] + " only" : CATS[f.c]) + "</small></button>" + star(f) + "</div>").join("")
    : '<div class="fnone">' + (fcat === "fav" && !fq ? "No favourites yet. Press the star beside any font to keep it here." : "No font matches that. Check the spelling or try a shorter search.") + "</div>";
  each("[data-n]", (el) => (io ? io.observe(el) : ensureFont(el.dataset.n)), box);
  box.scrollTop = 0;
  $("fless").disabled = fpage === 0; $("fmore").disabled = (fpage + 1) * FPAGE >= flist.length;
}
/* the Sample text box is always drawn in the font shown in the Choose a font box */
function paintSample(n) { const el = $("fsample"); ensureFont(n); el.style.fontFamily = fam(n); el.style.fontWeight = wOf(n, fslot === "head"); el.style.fontStyle = stOf(n); }
/* trying a font: show it in the selected row without changing the design yet */
function tryFont(n) {
  const row = $("pair").querySelector('[data-row="' + fslot + '"]'); if (!row) return;
  if (!n) { renderPair(); paintSample(S.fonts[fslot]); return; }
  ensureFont(n); row.classList.add("previewing"); paintSample(n);
  row.querySelector(".who b").textContent = n;
  row.querySelector(".ex1,.ex2,.ex3").style.cssText = fontCss(n, fslot === "head");
}
function openList(on) {
  drop.hidden = !on; combo.classList.toggle("open", on); $("fsearch").setAttribute("aria-expanded", on);
  if (on) { renderList(); const r = drop.getBoundingClientRect(), limit = window.innerHeight - 90; if (r.bottom > limit) window.scrollBy({ top: r.bottom - limit, behavior: "auto" }); }
  else tryFont(null);
}
/* choosing a font applies it straight away to whichever row is selected */
function pickFont(n) { picked = n; $("fsearch").value = n; fq = ""; openList(false); setFont(fslot, n); }
function setSlot(slot) {
  fslot = slot; picked = S.fonts[slot]; $("fsearch").value = picked; fq = "";
  $("fsearchlab").textContent = "Choose a font for " + SLOT[slot];
  if (fcat !== "all" && fcat !== "mac" && fcat !== "win" && fcat !== "fav") fcat = "all";
  renderCats();
  filterFonts(); if (!drop.hidden) renderList(); renderPair(); paintSample(picked);
}
function renderCats() {
  $("fcats").innerHTML = [["all", "All"], ["mac", "Apple fonts"], ["win", "Windows fonts"], ["fav", "★ Favourites" + (favs.length ? " (" + favs.length + ")" : "")]]
    .map((c) => '<button class="btn small" data-c="' + c[0] + '" aria-pressed="' + (fcat === c[0]) + '" type="button">' + c[1] + "</button>").join("");
}
function toggleFav(n) {
  const i = favs.indexOf(n); if (i > -1) favs.splice(i, 1); else favs.push(n);
  try { localStorage.setItem("fl-favs", JSON.stringify(favs)); } catch (e) {}
  renderCats(); toast(i > -1 ? n + " removed from favourites" : n + " added to favourites");
}
renderCats();
$("fsearch").addEventListener("input", function () { fq = this.value.trim(); filterFonts(); openList(true); });
$("fsearch").addEventListener("focus", function () { this.select(); });
$("fsearch").addEventListener("keydown", (e) => { if (e.key === "Escape") openList(false); if (e.key === "ArrowDown") { e.preventDefault(); openList(true); const first = $("flist").querySelector(".fsel"); if (first) first.focus(); } });
$("fopen").onclick = () => { if (drop.hidden) { fq = ""; filterFonts(); } openList(drop.hidden); };
$("flist").addEventListener("click", (e) => {
  const w = e.target.closest("[data-n]"); if (!w) return;
  const st = e.target.closest(".fstar");
  if (st) { toggleFav(w.dataset.n); st.setAttribute("aria-pressed", favs.indexOf(w.dataset.n) > -1); if (fcat === "fav") { filterFonts(); renderList(); } return; }
  pickFont(w.dataset.n);
});
$("flist").addEventListener("mouseover", (e) => { const w = e.target.closest("[data-n]"); if (w) tryFont(w.dataset.n); });
$("flist").addEventListener("focusin", (e) => { const w = e.target.closest("[data-n]"); if (w && e.target.classList.contains("fsel")) tryFont(w.dataset.n); });
$("flist").addEventListener("mouseleave", () => { if (!drop.hidden) tryFont(null); });
$("flist").addEventListener("keydown", (e) => {
  if (e.key === "Escape") { openList(false); $("fsearch").focus(); return; }
  if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
  const all = Array.prototype.slice.call($("flist").querySelectorAll(".fsel")), i = all.indexOf(document.activeElement); if (i < 0) return;
  e.preventDefault(); const nx = all[i + (e.key === "ArrowDown" ? 1 : -1)]; if (nx) nx.focus(); else if (e.key === "ArrowUp") $("fsearch").focus();
});
$("fview").addEventListener("click", function (e) { const b = e.target.closest("[data-view]"); if (!b) return; fviewMode = b.dataset.view; each("button", (x) => x.setAttribute("aria-pressed", x === b), this); renderList(); });
$("fmore").onclick = () => { fpage++; renderList(); };
$("fless").onclick = () => { fpage = Math.max(0, fpage - 1); renderList(); };
document.addEventListener("click", (e) => { if (!drop.hidden && !combo.contains(e.target)) openList(false); });
$("fsample").addEventListener("input", () => { renderPair(); });
$("fcats").addEventListener("click", function (e) { const b = e.target.closest("button"); if (!b) return; e.stopPropagation(); fcat = b.dataset.c; renderCats(); fq = ""; filterFonts(); openList(true); });
function setFont(slot, name) { const f = info(name); if (!f) return; S.fonts[slot] = f.n; ensureFont(f.n); apply(); toast(SLOT[slot] + " font set to " + f.n); }

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
/* ready-made combinations: heading, body, numbers */
const TRIOS = [
  ["Manrope", "DM Sans", "IBM Plex Mono"], ["Playfair Display", "Source Sans 3", "IBM Plex Mono"], ["Fraunces", "Work Sans", "DM Mono"], ["Space Grotesk", "Inter", "JetBrains Mono"],
  ["Bebas Neue", "Inter", "Space Mono"], ["DM Serif Display", "Karla", "DM Mono"], ["Bricolage Grotesque", "Instrument Sans", "DM Mono"], ["Syne", "Inter", "IBM Plex Mono"]
];
function setTrio(t, msg) { S.fonts.head = t[0]; S.fonts.body = t[1]; S.fonts.mono = t[2]; apply(); toast(msg); }
function renderTrios() {
  $("trios").innerHTML = TRIOS.map((t, i) => { t.forEach(ensureFont); const on = S.fonts.head === t[0] && S.fonts.body === t[1] && S.fonts.mono === t[2];
    return '<button class="trio" type="button" data-trio="' + i + '" aria-pressed="' + on + '"><b style="' + fontCss(t[0], true) + '">' + esc(t[0]) + '</b><span style="' + fontCss(t[1]) + '">with ' + esc(t[1]) + '</span><code style="' + fontCss(t[2]) + '">' + esc(t[2]) + " 0123</code></button>"; }).join("");
}
$("trios").addEventListener("click", (e) => { const b = e.target.closest("[data-trio]"); if (b) { const t = TRIOS[+b.dataset.trio]; setTrio(t, t[0] + " with " + t[1] + " applied"); } });
$("fsurprise").onclick = () => {
  const heads = []; Object.keys(MOODS).forEach((m) => MOODS[m].heads.forEach((n) => { if (heads.indexOf(n) < 0) heads.push(n); }));
  let h = heads[Math.floor(Math.random() * heads.length)], tries = 0; while (h === S.fonts.head && tries++ < 5) h = heads[Math.floor(Math.random() * heads.length)];
  const bodies = (PAIRS[h] || PAIR_BY_CAT[info(h).c]).filter((n) => n !== h);
  setTrio([h, bodies[Math.floor(Math.random() * bodies.length)], MONOS[Math.floor(Math.random() * MONOS.length)]], "Surprise: " + h + " it is");
};

function renderPair() {
  const chip = (slot, n) => { ensureFont(n); return '<button class="btn small" type="button" data-slot="' + slot + '" data-n="' + esc(n) + '" aria-pressed="' + (S.fonts[slot] === n) + '" style="' + fontCss(n) + '">' + esc(n) + "</button>"; };
  const sample = esc($("fsample").value || "Welcome to Fine-log");
  const sysNote = (n) => { const f = info(n); return f && f.sys ? '<i class="sysn">' + WHERE[f.sys] + " only</i>" : ""; };
  const row = (slot, ex) => '<button type="button" class="slotrow' + (fslot === slot ? " on" : "") + '" data-row="' + slot + '" aria-pressed="' + (fslot === slot) + '"><span class="who"><span>' + SLOT[slot] + "</span><b>" + esc(S.fonts[slot]) + "</b>" + sysNote(S.fonts[slot]) + "</span>" + ex + '<span class="tagc">' + (fslot === slot ? "Choosing" : "Change") + "</span></button>";
  $("pair").innerHTML =
    row("head", '<span class="ex1" style="' + fontCss(S.fonts.head, true) + '">' + sample + "</span>") +
    row("body", '<span class="ex2" style="' + fontCss(S.fonts.body) + '">This is how paragraphs, buttons and labels will read in your design.</span>') +
    row("mono", '<span class="ex3" style="' + fontCss(S.fonts.mono) + '">0123456789 &nbsp; $1,240.50 &nbsp; 17/11/2026</span>') +
    (fslot === "mono" ? '<div class="sug">Suggested fonts for numbers: ' + MONOS.map((n) => chip("mono", n)).join("") + "</div>" : "");
}
$("pair").addEventListener("click", (e) => {
  const b = e.target.closest("[data-slot]"); if (b) { setFont(b.dataset.slot, b.dataset.n); picked = b.dataset.n; $("fsearch").value = picked; return; }
  const r = e.target.closest("[data-row]"); if (r) setSlot(r.dataset.row);
});

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
const tplOf = (id) => { const l = designOf(id).layout; return TPLS.filter((t) => t.id === l)[0] || TPLS[0]; };
/* a design's signature style as a full set of fonts, colours and shape */
function styleState(key) {
  const st = STYLES[key], c = { bg: st.colors[0], text: st.colors[1], primary: st.colors[2], secondary: st.colors[3], accent: st.colors[4] };
  FL.derive(c, { surface: true, muted: true, border: true, secondary: false, accent: false });
  return { fonts: { head: st.fonts[0], body: st.fonts[1], mono: st.fonts[2] }, colors: c, shape: { radius: st.shape[0], shadow: st.shape[1], density: st.shape[2], spacing: st.shape[3], size: "medium" } };
}
let libMode = "own";
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
function paintThumbs() {
  each("#gallery .thumb", (b) => {
    const el = b.querySelector(".tpl"), d = designOf(b.dataset.tpl);
    el.removeAttribute("style");
    if (libMode === "own") { const st = styleState(d.style), v = varsFor(st.fonts, st.colors, st.shape); Object.keys(v).forEach((k) => el.style.setProperty("--t-" + k, v[k])); }
  });
}
function buildPreviewStatic() {
  Object.keys(STYLES).forEach((k) => STYLES[k].fonts.forEach(ensureFont));
  $("gallery").innerHTML = DESIGNS.map((d) => { const l = TPLS.filter((t) => t.id === d.layout)[0];
    return '<button class="thumb" type="button" data-tpl="' + d.id + '" aria-pressed="' + (S.tpl === d.id) + '"><div class="frame" data-mode="thumb"><div class="tpl">' + l.html + "</div></div><span><b>" + esc(d.name) + "</b><small>" + l.name + "</small></span></button>"; }).join("");
  each("#gallery .frame", watch);
  const cats = []; TPLS.forEach((t) => { if (cats.indexOf(t.cat) < 0) cats.push(t.cat); });
  $("filters").innerHTML = seg("cat", [["All", "All"]].concat(cats.map((c) => [c, c])), "All").replace(/class="btn small"/g, "");
  $("libmode").innerHTML = "<span>Show designs in</span>" + seg("lib", [["own", "Their own style"], ["mine", "My fonts and colours"]], libMode);
  $("pvinner").className = "tpl"; watch($("pvframe")); watch($("heroprev").firstElementChild);
  window.addEventListener("resize", () => each(".frame", fitFrame));
}
$("libmode").addEventListener("click", function (e) { const b = e.target.closest("[data-v]"); if (!b) return; libMode = b.dataset.v; each("button", (x) => x.setAttribute("aria-pressed", x === b), this); paintThumbs(); each("#gallery .frame", fitFrame); });
function renderTools() {
  const sh = FL.SHAPE, opt = (k) => Object.keys(sh[k]).map((v) => [v, sh[k][v].label]);
  const grp = (label, key, options, curV) => '<div class="grp"><span>' + label + '</span><div class="seg">' + seg(key, options, curV) + "</div></div>";
  $("tools").innerHTML = grp("View", "view", [["desktop", "Desktop"], ["mobile", "Mobile"]], S.view) + grp("Corners", "radius", opt("radius"), S.shape.radius) + grp("Shadows", "shadow", opt("shadow"), S.shape.shadow) +
    grp("Spacing", "density", opt("density"), S.shape.density) + grp("Heading spacing", "spacing", opt("spacing"), S.shape.spacing) + grp("Text size", "size", opt("size"), S.shape.size);
}
$("tools").addEventListener("click", (e) => { const b = e.target.closest("[data-k]"); if (!b) return; if (b.dataset.k === "view") S.view = b.dataset.v; else S.shape[b.dataset.k] = b.dataset.v; apply(); });
$("gallery").addEventListener("click", (e) => {
  const b = e.target.closest("[data-tpl]"); if (!b) return; const d = designOf(b.dataset.tpl); S.tpl = d.id;
  if (libMode === "own") {
    const st = styleState(d.style); S.fonts = st.fonts; S.shape = st.shape;
    ["bg", "text", "primary", "secondary", "accent"].forEach((k) => { S.colors[k] = st.colors[k]; });
    S.auto = { surface: true, muted: true, border: true, secondary: false, accent: false };
    toast(d.name + " applied with its own fonts and colours. Change them under Fonts and Colours.");
  } else toast(d.name + " applied with your fonts and colours.");
  apply(); if (target) setCur(S.colors[target], null, true);
});
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
function varsFor(fonts, c, shape) {
  const sh = FL.SHAPE, rad = sh.radius[shape.radius], den = sh.density[shape.density];
  return {
    bg: c.bg, surface: c.surface, text: c.text, muted: c.muted, primary: c.primary, secondary: c.secondary, accent: c.accent, border: c.border,
    onp: FL.onColor(c.primary), ons: FL.onColor(c.secondary), ona: FL.onColor(c.accent),
    fh: fam(fonts.head), fhw: wOf(fonts.head, true), fhs: stOf(fonts.head), fb: fam(fonts.body), fbw: wOf(fonts.body), fbs: stOf(fonts.body), fm: fam(fonts.mono), fmw: wOf(fonts.mono),
    fs: sh.size[shape.size].v + "px", ls: sh.spacing[shape.spacing].v, r: rad.r + "px", rs: Math.min(rad.r, 8) + "px", rb: rad.rb, sh: sh.shadow[shape.shadow].v, pad: den.pad + "px", gap: den.gap + "px"
  };
}
function setVars() { const v = varsFor(S.fonts, S.colors, S.shape), st = document.documentElement.style; Object.keys(v).forEach((k) => st.setProperty("--t-" + k, v[k])); }
let exTab = "css";
function renderExport() {
  const fn = { css: FL.cssVars, tailwind: FL.tailwind, tokens: FL.tokens }[exTab];
  $("expre").textContent = fn(S, info);
  $("exlab").textContent = { css: "CSS variables", tailwind: "Tailwind config", tokens: "Design tokens (JSON)" }[exTab];
  $("sharelink").value = location.href.split("#")[0] + "#s=" + encodeState(S);
}
function markFonts() { if (document.activeElement !== $("fsearch")) { picked = S.fonts[fslot]; $("fsearch").value = picked; } paintSample(S.fonts[fslot]); renderTrios(); }
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
  $("docktpl").textContent = designOf(S.tpl).name;
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
  $("outlab").textContent = "Your prompt · " + designOf(S.tpl).name + " (" + t.name + ") · " + FL.TOOLS[S.prompt.tool].label + " · " + text.split(/\s+/).length + " words";
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
let tab = "fonts";
function showTab(id, scroll) {
  if (TABS.indexOf(id) < 0) return; tab = id;
  each("section", (s) => s.classList.toggle("on", s.id === id));
  each("#nav a, #steps a", (l) => l.classList.toggle("on", l.getAttribute("href") === "#" + id));
  each(".frame", fitFrame);
  if (scroll) { const y = document.querySelector(".hero").getBoundingClientRect().bottom + window.scrollY - 70; window.scrollTo({ top: Math.max(0, y), behavior: "auto" }); }
}
/* the Fine-log name always returns to the main page */
function goHome() { showTab("fonts"); window.scrollTo(0, 0); try { history.replaceState(null, "", location.pathname + location.search); } catch (err) {} }
$("homelink").addEventListener("click", (e) => { e.preventDefault(); goHome(); });
document.addEventListener("click", (e) => {
  const a = e.target.closest('a[href^="#"]'); if (!a) return; const id = a.getAttribute("href").slice(1);
  if (TABS.indexOf(id) < 0) return; e.preventDefault();
  showTab(id, true);
  if (a.id === "dockprev") $("pvframe").scrollIntoView({ block: "start" });
  if (a.id === "dockprompt") { writePrompt(false); $("out").scrollIntoView({ block: "start" }); }
  try { history.replaceState(null, "", "#" + id); } catch (err) {}
});

/* ---------- boot ---------- */
FL._names = [].concat(MONOS, CYCLE, ...TRIOS, ...Object.keys(STYLES).map((k) => STYLES[k].fonts), ...Object.keys(PAIRS).map((k) => [k].concat(PAIRS[k])), ...Object.keys(PAIR_BY_CAT).map((k) => PAIR_BY_CAT[k]), ...Object.keys(MOODS).map((k) => MOODS[k].heads.concat(MOODS[k].bodies))).filter((n) => !info(n));
buildColourStatic(); buildPreviewStatic(); paintThumbs(); renderTools(); renderPromptOpts(); filterFonts(); picked = S.fonts.head; $("fsearch").value = picked; renderSaved();
$("target").value = target; setCur(cur, null, true); apply(); startWelcome();
/* always open on the main page, whatever screen was open last time */
if ("scrollRestoration" in history) history.scrollRestoration = "manual";
if (TABS.indexOf(location.hash.slice(1)) > -1) { try { history.replaceState(null, "", location.pathname + location.search); } catch (e) {} }
showTab("fonts"); window.scrollTo(0, 0);
if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => each(".frame", fitFrame));
if (cameFromLink) { toast("Opened a shared design"); try { history.replaceState(null, "", location.pathname + location.search); } catch (e) {} }
})();
