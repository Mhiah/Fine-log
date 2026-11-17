/* Fine-log prompt generator and exports.
   Everything here is built from the person's picks with fixed rules. No AI model is called. */
(function () {
  "use strict";
  var FL = (window.FL = window.FL || {});

  FL.SHAPE = {
    radius: { sharp: { r: 0, rb: "0px", label: "Sharp" }, soft: { r: 10, rb: "8px", label: "Soft" }, round: { r: 18, rb: "999px", label: "Round" } },
    shadow: {
      none: { v: "none", label: "None" },
      soft: { v: "0 1px 2px rgba(0,0,0,.06), 0 4px 14px rgba(0,0,0,.06)", label: "Soft" },
      strong: { v: "0 2px 4px rgba(0,0,0,.10), 0 14px 34px rgba(0,0,0,.16)", label: "Strong" }
    },
    density: { compact: { pad: 12, gap: 10, label: "Compact" }, comfortable: { pad: 18, gap: 16, label: "Comfortable" }, spacious: { pad: 26, gap: 24, label: "Spacious" } },
    spacing: { tight: { v: "-0.025em", label: "Tight" }, normal: { v: "0", label: "Normal" }, wide: { v: "0.04em", label: "Wide" } },
    size: { small: { v: 15, label: "Small" }, medium: { v: 16, label: "Medium" }, large: { v: 18, label: "Large" } }
  };
  FL.TOOLS = {
    any: { label: "Any AI", note: "Return complete, runnable code. If this is a single page, give one HTML file with the CSS and JavaScript included. Do not leave placeholders or comments such as \"rest of the code here\"." },
    claude: { label: "Claude Code", note: "You are working in my repository with Claude Code. Read the relevant files before editing, tell me your plan in a few lines, then make the changes. Run the project's build or tests when you finish and report what you changed, file by file." },
    cursor: { label: "Cursor", note: "You are working in Cursor with access to my codebase. Apply the changes directly across the files that need them and keep each edit focused. When you finish, list the files you touched and why." },
    codex: { label: "Codex", note: "You are working as Codex in my repository. Work in small, reviewable commits, run the build and tests before you finish, and summarise the diff." }
  };

  function fontsUrl(S, info) {
    var seen = {}, parts = [];
    [[S.fonts.head, true], [S.fonts.body, true], [S.fonts.mono, false]].forEach(function (p) {
      var f = info(p[0]); if (!f || f.sys || seen[f.n]) return; seen[f.n] = 1;
      var spec = "";
      if (f.v) { var it = f.v.charAt(0) === "i", w = f.v.replace("i", ""); spec = it ? ":ital,wght@1," + w : ":wght@" + w; }
      else if (f.b) spec = ":wght@400;700";
      parts.push("family=" + encodeURIComponent(f.n).replace(/%20/g, "+") + spec);
    });
    return parts.length ? "https://fonts.googleapis.com/css2?" + parts.join("&") + "&display=swap" : "";
  }
  /* plain-language notes about fonts that are built into devices rather than downloaded */
  var WHERE = { mac: "Apple devices (Mac, iPhone, iPad)", win: "Windows", both: "Apple devices and Windows" }, GEN = { s: "sans-serif", e: "serif", d: "sans-serif", h: "cursive", m: "monospace" };
  function sysLines(S, info) {
    var out = [], seen = {};
    [S.fonts.head, S.fonts.body, S.fonts.mono].forEach(function (n) { var f = info(n); if (!f || !f.sys || seen[f.n]) return; seen[f.n] = 1;
      out.push(f.n + " is a system font built into " + WHERE[f.sys] + ". Do not download it or look for it on Google Fonts. Use the CSS font-family " + (f.css || "\"" + f.n + "\"") + ", " + GEN[f.c] + " so other devices fall back to their own " + GEN[f.c] + " font."); });
    return out;
  }
  FL.sysLines = sysLines;
  function fontLoadLines(S, info) { var u = fontsUrl(S, info), l = sysLines(S, info); if (u) l.unshift("Load the fonts from Google Fonts: " + u); return l; }
  function stack(S, info, slot) { var f = info(S.fonts[slot]); return (f && f.css ? f.css : "\"" + S.fonts[slot] + "\"") + ", " + (f ? GEN[f.c] : "sans-serif"); }
  FL.fontsUrl = fontsUrl;

  function headWeight(S, info) { var f = info(S.fonts.head); return f && f.v ? f.v.replace("i", "") : f && f.b ? "700" : "400"; }

  function ratio(a, b) { return FL.contrast(a, b).toFixed(1) + ":1"; }

  FL.cssVars = function (S, info) {
    var c = S.colors, sh = FL.SHAPE;
    return ":root {\n" +
      "  --color-bg: " + c.bg + ";\n  --color-surface: " + c.surface + ";\n  --color-text: " + c.text + ";\n  --color-muted: " + c.muted + ";\n" +
      "  --color-primary: " + c.primary + ";\n  --color-on-primary: " + FL.onColor(c.primary) + ";\n  --color-secondary: " + c.secondary + ";\n  --color-on-secondary: " + FL.onColor(c.secondary) + ";\n" +
      "  --color-accent: " + c.accent + ";\n  --color-on-accent: " + FL.onColor(c.accent) + ";\n  --color-border: " + c.border + ";\n\n" +
      "  --font-heading: " + stack(S, info, "head") + ";\n  --font-body: " + stack(S, info, "body") + ";\n  --font-mono: " + stack(S, info, "mono") + ";\n" +
      "  --font-size-base: " + sh.size[S.shape.size].v + "px;\n  --heading-weight: " + headWeight(S, info) + ";\n  --heading-letter-spacing: " + sh.spacing[S.shape.spacing].v + ";\n\n" +
      "  --radius-card: " + sh.radius[S.shape.radius].r + "px;\n  --radius-button: " + sh.radius[S.shape.radius].rb + ";\n  --shadow-card: " + sh.shadow[S.shape.shadow].v + ";\n" +
      "  --space-card: " + sh.density[S.shape.density].pad + "px;\n  --space-gap: " + sh.density[S.shape.density].gap + "px;\n}";
  };

  FL.tailwind = function (S, info) {
    var c = S.colors, sh = FL.SHAPE;
    return "// tailwind.config.js\nmodule.exports = {\n  theme: {\n    extend: {\n      colors: {\n" +
      "        bg: \"" + c.bg + "\",\n        surface: \"" + c.surface + "\",\n        text: \"" + c.text + "\",\n        muted: \"" + c.muted + "\",\n" +
      "        primary: { DEFAULT: \"" + c.primary + "\", on: \"" + FL.onColor(c.primary) + "\" },\n        secondary: { DEFAULT: \"" + c.secondary + "\", on: \"" + FL.onColor(c.secondary) + "\" },\n" +
      "        accent: { DEFAULT: \"" + c.accent + "\", on: \"" + FL.onColor(c.accent) + "\" },\n        border: \"" + c.border + "\",\n      },\n" +
      "      fontFamily: {\n        heading: [\"" + S.fonts.head + "\", \"sans-serif\"],\n        body: [\"" + S.fonts.body + "\", \"sans-serif\"],\n        mono: [\"" + S.fonts.mono + "\", \"monospace\"],\n      },\n" +
      "      fontSize: { base: \"" + sh.size[S.shape.size].v + "px\" },\n" +
      "      borderRadius: { card: \"" + sh.radius[S.shape.radius].r + "px\", button: \"" + sh.radius[S.shape.radius].rb + "\" },\n" +
      "      boxShadow: { card: \"" + sh.shadow[S.shape.shadow].v + "\" },\n" +
      "      spacing: { card: \"" + sh.density[S.shape.density].pad + "px\", gap: \"" + sh.density[S.shape.density].gap + "px\" },\n    },\n  },\n};";
  };

  FL.tokens = function (S, info) {
    var c = S.colors, sh = FL.SHAPE, col = {};
    Object.keys(c).forEach(function (k) { col[k] = { value: c[k], type: "color" }; });
    ["primary", "secondary", "accent"].forEach(function (k) { col["on-" + k] = { value: FL.onColor(c[k]), type: "color" }; });
    return JSON.stringify({
      color: col,
      font: {
        heading: { value: S.fonts.head, type: "fontFamily" }, body: { value: S.fonts.body, type: "fontFamily" }, mono: { value: S.fonts.mono, type: "fontFamily" },
        "base-size": { value: sh.size[S.shape.size].v + "px", type: "dimension" }, "heading-weight": { value: headWeight(S, info), type: "fontWeight" },
        "heading-letter-spacing": { value: sh.spacing[S.shape.spacing].v, type: "dimension" }
      },
      radius: { card: { value: sh.radius[S.shape.radius].r + "px", type: "dimension" }, button: { value: sh.radius[S.shape.radius].rb, type: "dimension" } },
      shadow: { card: { value: sh.shadow[S.shape.shadow].v, type: "shadow" } },
      space: { card: { value: sh.density[S.shape.density].pad + "px", type: "dimension" }, gap: { value: sh.density[S.shape.density].gap + "px", type: "dimension" } }
    }, null, 2);
  };

  function list(a) { return a.map(function (x) { return "- " + x; }).join("\n"); }

  FL.buildPrompt = function (S, brief, tpl, info) {
    var c = S.colors, sh = FL.SHAPE, P = S.prompt, redesign = P.mode === "redesign";
    brief = (brief || "").trim().replace(/[.\s]+$/, "");
    var base = sh.size[S.shape.size].v, hw = headWeight(S, info), rad = sh.radius[S.shape.radius], den = sh.density[S.shape.density];
    var onP = FL.onColor(c.primary), tool = FL.TOOLS[P.tool] || FL.TOOLS.any;
    var tokenLines = [
      "Background " + c.bg, "Surface " + c.surface, "Text " + c.text, "Muted text " + c.muted, "Primary " + c.primary + " (text on it " + onP + ")",
      "Secondary " + c.secondary + " (text on it " + FL.onColor(c.secondary) + ")", "Accent " + c.accent + " (text on it " + FL.onColor(c.accent) + ")", "Border " + c.border
    ];

    if (P.len === "compact") {
      return (redesign
        ? "Restyle my existing project" + (brief ? " (" + brief + ")" : "") + " to the design system below. Change presentation only. Keep all content, routes, APIs, business logic, wallet or payment integrations and working functionality exactly as they are."
        : (brief ? "Build this: " + brief + ". Use" : "Build " + tpl.what + " using") + " the design system below, laid out as " + tpl.what + ".") +
        "\n\nDo not substitute any font or colour.\n\n" +
        "Fonts: headings " + S.fonts.head + " at weight " + hw + ", body " + S.fonts.body + " at " + base + "px, numbers and code " + S.fonts.mono + ". " + fontLoadLines(S, info).join(" ") + "\n" +
        "Colours: " + tokenLines.join("; ") + ".\n" +
        "Shape: card radius " + rad.r + "px, button radius " + rad.rb + ", card shadow " + sh.shadow[S.shape.shadow].label.toLowerCase() + ", " + den.label.toLowerCase() + " spacing (" + den.pad + "px card padding, " + den.gap + "px gaps), heading letter-spacing " + sh.spacing[S.shape.spacing].v + ".\n" +
        "Layout: " + tpl.structure.map(function (s) { return s.split(":")[0]; }).join(", ").toLowerCase() + ".\n\n" +
        "Define every value as a CSS variable and reuse it. Make it responsive from 360px up, with visible focus states and body text contrast of at least 4.5:1.\n\n" + tool.note;
    }

    var out = [];
    out.push("ROLE\nYou are a senior front-end engineer and UI designer. Follow this specification exactly. Do not substitute any font, colour or measurement, and do not add colours that are not listed.");

    if (redesign) {
      out.push("WHAT TO DO\nRestyle my existing project" + (brief ? ": " + brief : "") + ". Apply the design system below to every page and component. This is a visual redesign only.");
      out.push("WHAT MUST NOT CHANGE\n" + list([
        "All existing content and copy, unless I ask for a wording change.",
        "Routes, URLs, page names and navigation destinations.",
        "API calls, data fetching, state management and business logic.",
        "Authentication, wallet connections, contract calls, payment flows and any third-party integration.",
        "Analytics, SEO tags, tests and build configuration.",
        "Anything that works today must work the same way afterwards. If a style change would require changing behaviour, stop and ask me first."
      ]));
      out.push("HOW TO WORK\n" + list([
        "Start by listing where fonts, colours, spacing and radii are currently defined.",
        "Create the design tokens below once, in one place, then replace hard-coded values with them.",
        "Restyle shared components first (buttons, cards, inputs, navigation, tables), then page layouts.",
        "After each area, check that the page still loads and its interactions still work."
      ]));
      out.push("REFERENCE LAYOUT\nWhere it fits my existing pages, use this " + tpl.name.toLowerCase() + " structure as the guide. Do not remove sections I already have.\n" + list(tpl.structure));
    } else {
      out.push("WHAT TO BUILD\n" + (brief ? "Build this: " + brief : "Build " + tpl.what) + ". Use the " + tpl.name.toLowerCase() + " structure below, with realistic content in place of anything I have not supplied.");
      out.push("PAGE STRUCTURE\n" + list(tpl.structure));
    }

    out.push("TYPOGRAPHY\n" + list([
      "Headings: " + S.fonts.head + ", weight " + hw + ", letter-spacing " + sh.spacing[S.shape.spacing].v + ", line-height 1.1.",
      "Body text, labels and buttons: " + S.fonts.body + ", weight 400 (600 for buttons and emphasis), base size " + base + "px, line-height 1.5.",
      "Numbers, prices, dates, code and anything that must line up: " + S.fonts.mono + " with tabular figures.",
      "Type scale from the " + base + "px base: display " + Math.round(base * 3.4) + "px, page title " + Math.round(base * 2.1) + "px, section heading " + Math.round(base * 1.5) + "px, card heading " + Math.round(base * 1.25) + "px, small text " + Math.round(base * 0.84) + "px.",
      "Balance multi-line headings and keep paragraphs under about 65 characters wide."
    ].concat(fontLoadLines(S, info))));

    out.push("COLOUR TOKENS\n" + list([
      "Background " + c.bg + ": the page background.",
      "Surface " + c.surface + ": cards, panels, sidebars, inputs and menus.",
      "Text " + c.text + ": headings and body text.",
      "Muted text " + c.muted + ": labels, captions, placeholders and secondary information.",
      "Primary " + c.primary + ": main buttons, active navigation, links and the main chart series. Text and icons on it use " + onP + ".",
      "Secondary " + c.secondary + ": supporting actions, call-to-action bands and the second chart series. Text on it uses " + FL.onColor(c.secondary) + ".",
      "Accent " + c.accent + ": badges, highlights, notification counts and status. Use it sparingly so it stays special. Text on it uses " + FL.onColor(c.accent) + ".",
      "Border " + c.border + ": dividers, card outlines, input outlines and table rules.",
      "Any tint you need (hover fills, soft badge backgrounds) must be a transparent mix of one of these tokens, never a new colour."
    ]));

    out.push("COMPONENTS\n" + list([
      "Corners: cards, panels and images " + rad.r + "px. Buttons, inputs and chips " + rad.rb + ".",
      "Card shadow: " + sh.shadow[S.shape.shadow].v + ".",
      "Primary button: primary background, " + onP + " text, weight 600, no border. Hover darkens it by about 8%.",
      "Secondary button: transparent background, text colour, 1.5px border in the border colour.",
      "Cards: surface background, 1px border in the border colour, " + den.pad + "px padding.",
      "Inputs: surface background, 1px border, same radius as buttons, at least 44px tall, primary-coloured focus ring.",
      "Badges: fully rounded, accent colour at about 20% opacity as the fill, text colour for the label.",
      "Tables and lists: muted column labels, 1px row dividers in the border colour, amounts right-aligned in the monospace font."
    ]));

    out.push("LAYOUT AND SPACING\n" + list(tpl.layout.concat([
      den.label + " density: " + den.pad + "px padding inside cards and " + den.gap + "px gaps between cards and grid items.",
      "Use one spacing scale based on 4px steps and keep it consistent across the whole UI."
    ])));

    out.push("RESPONSIVE BEHAVIOUR\n" + list(tpl.responsive.concat([
      "Work from 360px wide upward. Nothing scrolls sideways except wide tables, which scroll inside their own container.",
      "Tap targets are at least 44px on touch screens."
    ])));

    var cm = FL.contrast(c.muted, c.bg), ct = FL.contrast(c.text, c.bg), cp = FL.contrast(onP, c.primary);
    var acc = [
      "Measured contrast: text on background " + ratio(c.text, c.bg) + ", muted text on background " + ratio(c.muted, c.bg) + ", button text on primary " + ratio(onP, c.primary) + "."
    ];
    if (ct < 4.5) acc.push("Text on background is below 4.5:1. Keep body text at " + (base + 2) + "px or larger and tell me if it reads poorly.");
    if (cm < 4.5) acc.push("Muted text is below 4.5:1, so use it only for short labels and captions, never for paragraphs.");
    if (cp < 4.5) acc.push("Button text on primary is below 4.5:1, so keep button labels at weight 600 and at least " + base + "px.");
    acc.push("Use semantic HTML (header, nav, main, section, button, table) and label every control.");
    acc.push("Show a visible focus state on every interactive element and respect the reduced-motion setting.");
    out.push("ACCESSIBILITY\n" + list(acc));

    out.push("IMPLEMENTATION\nDefine these variables once and use them everywhere. Do not hard-code a colour, font or radius anywhere else.\n\n" + FL.cssVars(S, info) + "\n\n" + tool.note);

    out.push("BEFORE YOU FINISH, CHECK\n" + list([
      "Every heading is in " + S.fonts.head + " and every paragraph is in " + S.fonts.body + ".",
      "Only the eight colour tokens (and transparent mixes of them) appear in the UI.",
      "The layout holds at 360px, 768px and 1280px wide.",
      redesign ? "Every feature that worked before still works, and no content was removed." : "Every section in the page structure is present and filled with realistic content.",
      "Then list the fonts and hex codes you used so I can confirm they match."
    ]));

    return out.join("\n\n");
  };
})();
