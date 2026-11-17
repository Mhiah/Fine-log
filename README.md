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

When the site opens, a full-screen "Welcome" runs through 49 different fonts and settles on the 50th, then fades into the home page. The fonts are ordered by resemblance, from cursive down to clean, and each font's name shows under the word as it passes. There is a Skip button, and "Replay welcome" at the bottom of the page plays it again. Visitors who have reduced motion turned on go straight to the home page.

### Home

A centred headline, two buttons, three numbers and a live preview of the design you have chosen, shown in a browser-window frame. The floating menu at the top (Fonts, Colours, UI Library, Prompt, Export) opens one screen at a time, and a bar at the bottom always shows your current fonts and colours with Preview and Generate Prompt buttons.

### 1. Fonts

All 1,908 families in the Google Fonts library, plus 84 fonts built into Apple devices and Windows: 1,992 in total.

- **Heading, Body, Numbers.** One box shows the three fonts of your design with a live sample of each. Click a row to select it.
- **Choose a font.** A dropdown lists every font in its own style, 100 at a time, with Show more and Show less. Typing a name filters the list. Choosing a font applies it straight away to the selected row.
- **Try before you click.** With a mouse, pointing at a font shows it in the selected row without changing the design.
- **List or tiles.** The dropdown can show fonts as a list or as large "Aa" tiles.
- **Favourites.** Star any font to keep it under a Favourites filter. Favourites stay in the browser.
- **Ready-made combinations.** Eight heading, body and numbers trios that apply in one click.
- **Surprise me.** Picks a random combination from the curated fonts.
- **Four filters inside the list:** All, Apple fonts, Windows fonts and Favourites. Your own sample text sits beside the font box.
- **System fonts are labelled.** Fonts such as San Francisco, Helvetica Neue, Avenir, Segoe UI and Calibri are not downloaded; each shows only on a device that already has it, and is marked "Apple devices only", "Windows only" or "Apple and Windows". The prompt tells the AI not to look for them on Google Fonts and what other devices should fall back to.

The Numbers font is used wherever digits appear in a design, such as prices, dates and tables, so columns line up.

Fonts load only when they come into view in the list, so the page stays fast with the full library behind it.

### 2. Colours

A complete interface needs more than three colours, so Fine-log works with eight roles: background, surface, text, muted text, primary, secondary, accent and border.

- You choose background, text and primary. The other five are worked out from those three and marked "auto" until you change one. "Reset to auto" hands a role back.
- Tap a role, then move the hue, saturation and lightness sliders, type a hex code, or tap any swatch. The design updates live.
- Under the sliders: nine shades of the current colour and seven colours that go with it (opposite, neighbours, triads, splits).
- Twelve ready-made palettes, a swatch book of 13 colour families in 9 shades, and the standard named web colours with their hex codes.
- Four contrast checks using the WCAG 2 formula: text, muted text, button text on primary, and primary on background.

### 3. UI Library

24 ready-made designs built from 12 working layouts. Each layout appears twice in two very different styles, and every card shows its design in its own fonts, colours and shape.

| Layout | What it contains |
| --- | --- |
| Landing page | Navigation, split hero with a photo, client names, feature cards, offers, call-to-action band |
| Fintech dashboard | Sidebar, stat cards, cash-flow chart, spending breakdown, transactions table |
| Agency | Floating menu, statement headline, wide photo, tile grid, client names, closing band |
| SaaS product | Centred hero, product window with an inbox, customer names, feature cards |
| Portfolio | Editorial headline, intro, project grid with photos, about section |
| Blog | Navigation, featured post, post cards, newsletter band |
| Mobile app | Centred hero, phone mockup with a mini app screen, feature blocks, rating |
| E-commerce | Navigation with cart, filter chips, product grid with photos, order summary |
| Documentation | Top bar with search, grouped sidebar, article with code blocks and a callout, on-this-page list |
| Sign in | Coloured quote panel beside a centred sign-in form |
| Event | Dates, large headline, speaker cards, schedule, ticket tiers |
| Moodboard | Search, topic chips and a masonry wall of photos |

- **Filter row:** narrow the designs by type.
- **Their own style / My fonts and colours:** a switch above the cards. In the first mode, choosing a design applies its fonts, colours and shape, which you can then change. In the second, all 24 are redrawn in your picks and choosing one changes only the layout.

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
- **Signature styles:** twelve named styles (fonts, five colours, shape) live in `js/templates.js`. Each library card applies its style to itself through the same variables, so cards differ while sharing one set of layouts.
- **Photos:** some designs load photos from Unsplash. If a photo fails to load, a tinted block in the design's colours shows instead.
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
js/fonts.js         The Google Fonts family list (name, style, weights) and the Apple and Windows system fonts
js/colour.js        Colour maths, the eight roles and how five are derived
js/templates.js     Layout markup, structure notes used in prompts, signature styles and the list of 24 designs
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

Add a layout to `FL_TEMPLATES` in `js/templates.js` with an `id`, `name`, `blurb`, `cat`, `html`, and the `structure`, `layout` and `responsive` notes, then add one or more entries to `FL_DESIGNS` that pair it with a style from `FL_STYLES`. Style it in `styles.css` using only the `--t-*` variables and the shared classes (`.h` heading, `.m` monospace, `.mu` muted, `.card`, `.bt` button, `.pill`). It then appears in the gallery and in prompts automatically.

## Roadmap

1. More layouts, so the 24 designs come from more than 12: analytics, admin, pricing and onboarding.
2. Layout controls such as sidebar or top navigation and content width.
3. More font pairings and palettes.
4. A real AI model behind the suggestions, through a small server function.

## Credits

Fonts are served by Google Fonts and remain under their own open licences. The font list comes from Google Fonts metadata.

Photos in the designs are from [Unsplash](https://unsplash.com), used under the Unsplash License, by Yana Hurska, Chloe Bolton, WARION Taipei, Kasia Sikorska, Oshin Khandelwal, Andrej Lišakov, Denys Striyeshyn, Bench Accounting, Roman Bozhko, Max Andrey and others. The home page and menu took general layout patterns from Framer, Dribbble and Pinterest; no specific design was copied.
