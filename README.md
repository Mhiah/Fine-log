# Fine-log

A visual design builder that ends in a prompt.

Fine-log lets you choose fonts and colours, see them on a real interface, shape the details, and leave with an exact build specification that any AI coding tool can follow.

## The idea

Picking a look for a website usually means jumping between a font site, a colour picker and a blank chat box, then trying to describe what you saw. The description is where it goes wrong. "A clean serif with a warm blue" gives an AI room to choose something else, and a font and three colours are not enough to build a whole interface anyway.

Fine-log closes that gap in three connected steps:

1. **Discover.** Browse every Google Fonts family, any hex colour, ready-made palettes and font pairings.
2. **Customize.** Set eight colour roles, three fonts, corners, shadows, spacing and text size, and watch a working interface restyle as you go.
3. **Implement.** Copy a complete prompt, CSS variables, a Tailwind config or design tokens that state every value word for word.

What you picked is what gets built.

## What is on the page

### Welcome

When the site opens, a full-screen "Welcome" runs through 99 different fonts and settles on the 100th, then fades into the home page. A counter names each font as it passes. There is a Skip button, and "Replay welcome" at the bottom of the page plays it again. Visitors who have reduced motion turned on go straight to the home page.

### Home

One headline, three numbers and a live preview of the design you have chosen. The menu at the top (Fonts, Colours, UI Library, Prompt, Export) opens one screen at a time, and a bar at the bottom always shows your current fonts and colours with Preview and Generate Prompt buttons.

### 1. Fonts

All 1,908 families in the Google Fonts library.

- Search by name, filter by style (sans serif, serif, display, handwriting, monospace) and type your own sample text.
- Set any font as the heading font or body font. Monospace fonts can also be set as the numbers font.
- A pairing strip shows your three current fonts and suggests body and number fonts that go with your heading font.

Fonts load only when their card scrolls into view, so the page stays fast with the full library behind it.

### 2. Colours

A complete interface needs more than three colours, so Fine-log works with eight roles: background, surface, text, muted text, primary, secondary, accent and border.

- You choose background, text and primary. The other five are worked out from those three and marked "auto" until you change one. "Reset to auto" hands a role back.
- Tap a role, then move the hue, saturation and lightness sliders, type a hex code, or tap any swatch. The design updates live.
- Under the sliders: nine shades of the current colour and seven colours that go with it (opposite, neighbours, triads, splits).
- Twelve ready-made palettes, a swatch book of 13 colour families in 9 shades, and the standard named web colours with their hex codes.
- Four contrast checks using the WCAG 2 formula: text, muted text, button text on primary, and primary on background.

### 3. UI Library

Five working interface designs, each restyled live by your fonts, colours and shape settings. A filter row narrows them by type.

| Template | What it contains |
| --- | --- |
| Fintech dashboard | Sidebar, stat cards, cash-flow chart, spending breakdown, transactions table |
| Landing page | Navigation, split hero with artwork, client names, feature cards, offers, call-to-action band |
| Portfolio | Editorial headline, intro, project grid, about section |
| Blog | Navigation, featured post, post cards, newsletter band |
| E-commerce | Navigation with cart, filter chips, product grid, order summary |

Controls above the preview:

- **View:** desktop or mobile. Templates respond to their own width, so the mobile view is the real small-screen layout.
- **Corners:** sharp, soft or round.
- **Shadows:** none, soft or strong.
- **Spacing:** compact, comfortable or spacious.
- **Heading spacing:** tight, normal or wide.
- **Text size:** small, medium or large.

### 4. Get your prompt

Describe what you are building (optional), then choose:

- **Mode:** build a new site, or redesign an existing one.
- **Tool:** any AI, Claude Code, Cursor or Codex.
- **Length:** full specification or compact.

The full specification covers the role, what to build, page structure for the chosen template, typography with a type scale and the Google Fonts link, all eight colour tokens with their jobs, component rules, layout and spacing, responsive behaviour, measured contrast values, a CSS variables block and a final checklist.

Redesign mode adds a list of what must not change (content, routes, APIs, business logic, wallet and payment integrations, working functionality) and a step-by-step way of working.

The prompt rewrites itself as you change the design.

"Suggest combinations" offers four font and palette combinations. It reads your description for keywords such as "playful", "luxury", "fintech" or "retro" and picks from matching presets.

### 5. Export and share

- Copy the design as **CSS variables**, a **Tailwind config** or **design tokens (JSON)**.
- **Share link:** a link that opens Fine-log with the exact fonts, colours, shape and template restored.
- **Saved designs:** name a design and keep it in the browser to reopen later.

## About the "AI" in Fine-log

Fine-log does not call an AI model. Prompts, pairings, palettes and suggested combinations all come from preset rules written into the site, and the page says so. This keeps it free, instant and usable with no account or key.

Connecting a real model would let suggestions respond to a project description in full sentences. That needs an API key kept on a server, which a static site cannot hold safely. It is the last item on the roadmap.

## How it works

Fine-log is a static site. There is no build step, no framework and no backend.

- **Design tokens:** every template is styled only through CSS variables (`--t-bg`, `--t-primary`, `--t-fh` and so on). Changing a pick updates the variables, and every template restyles at once.
- **Derived colours:** surface, muted text and border are mixes of background and text. Secondary and accent are hue shifts of primary.
- **One screen at a time:** the five menu items switch screens without reloading, and each has its own link (`#fonts`, `#colours`, `#library`, `#prompt`, `#export`).
- **Responsive previews:** templates use container queries, so they respond to the preview frame's width. The desktop view is drawn at 1040px and scaled to fit.
- **Font files:** loaded on demand from Google Fonts, one stylesheet per font.
- **Your picks:** saved in the browser's local storage. Share links carry the design inside the link itself. Nothing is sent to a server.
- **Look:** the site itself is always white and minimal, whatever the device theme. It uses the system font on Apple devices (San Francisco, the iPhone font) and Inter everywhere else. The designs in the library show only your chosen fonts and colours.

## Project structure

```
index.html          Page markup
styles.css          Page styles and the UI designs' styles
js/fonts.js         The Google Fonts family list (name, style, weights)
js/colour.js        Colour maths, the eight roles and how five are derived
js/templates.js     Template markup plus the structure notes used in prompts
js/prompt.js        Prompt generator and CSS, Tailwind and token exports
js/app.js           State, font library, colour tools, preview, sharing
README.md           This file
```

## Run it locally

Clone the repository and open `index.html` in a browser. An internet connection is needed for the fonts to load.

```
git clone https://github.com/Mhiah/Fine-log.git
cd Fine-log
```

## Deploy

Any static host works. On Vercel, import the repository and deploy with the default settings: no framework, no build command, output directory left as the root.

## Add a template

Add an entry to `js/templates.js` with an `id`, `name`, `blurb`, `html`, and the `structure`, `layout` and `responsive` notes. Style it in `styles.css` using only the `--t-*` variables and the shared classes (`.h` heading, `.m` monospace, `.mu` muted, `.card`, `.bt` button, `.pill`). It then appears in the gallery and in prompts automatically.

## Roadmap

1. More designs: documentation, analytics, admin and mobile app.
2. Layout controls such as sidebar or top navigation and content width.
3. More font pairings and palettes.
4. A real AI model behind the suggestions, through a small server function.

## Credits

Fonts are served by Google Fonts and remain under their own open licences. The font list comes from Google Fonts metadata.
