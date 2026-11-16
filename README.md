# Fine-log

A font and colour catalog that ends in a prompt.

Fine-log puts every Google Fonts family and every hex colour on one page, lets you try them together on a live sample, and then hands you a ready-to-paste prompt so any AI can build a UI in that exact look.

## The idea

Picking a look for a website usually means jumping between a font site, a colour picker and a blank chat box, then trying to describe what you saw. The description is where it goes wrong. "A clean serif with a warm blue" gives an AI room to choose something else.

Fine-log closes that gap. You choose the real things, a named font and an exact hex code, see them working together on a sample page, and leave with a prompt that states those values word for word and tells the AI not to swap them. What you picked is what gets built.

## What is on the page

### 1. Welcome

When the page opens, the word "Welcome" runs through 24 different fonts and settles on the 25th. A small counter under the word names each font as it passes. A Replay button plays it again. Visitors who have reduced motion turned on see the final word without the animation.

### 2. Fonts

All 1,908 families in the Google Fonts library.

- Search by name.
- Filter by style: sans serif, serif, display, handwriting, monospace.
- Type your own sample text and every card updates.
- Set any font as your heading font or body font, or copy its name.

Fonts load only when their card scrolls into view, so the page stays fast even with the full library behind it.

### 3. Colours

Any of the 16,777,216 hex colours.

- Hue, saturation and lightness sliders.
- A hex box that accepts typed or pasted codes, plus the browser's own picker.
- A swatch book of 13 colour families in 9 shades each.
- The standard named web colours, each shown with its hex code.

Tap any colour to select it, copy its hex, or give it a job: background, text or accent.

### 4. Your combination

A live sample page (navigation, headline, paragraph, buttons, a card) set in your two fonts and three colours. Under it, a contrast check shows whether the text is readable on the background, using the WCAG 2 formula. "Surprise me" generates a random combination, and "Swap background and text" flips light and dark.

### 5. Examples and prompt

Describe what you are building. "Show me examples" returns four combinations, which can be built around anything, around your chosen fonts, or around your chosen colours. Pick one, then "Write my prompt" produces the prompt with a Copy button.

The prompt always contains the exact font names, each hex code with its role, how to apply them, and an instruction not to substitute anything.

## Current status of the AI assistant

The assistant is **not connected yet** on this hosted version. Until it is:

- "Show me examples" gives four combinations generated on the page from a curated font list and colour harmony rules. They do not read your description.
- "Write my prompt" fills a fixed, well-structured template with your picks and your description.

Both work with no account and no key. Connecting a real AI model needs an API key kept on a server, which a static page cannot hold safely. See the roadmap below.

## How it works

Fine-log is a single HTML file. There is no build step, no framework and no backend.

- **Font list:** the family names, styles and available weights are embedded in the page as a compact text block, taken from Google Fonts metadata.
- **Font files:** loaded on demand from Google Fonts, one stylesheet per font, when a card comes into view or a font is chosen.
- **Colours:** all conversions (hex, HSL, contrast ratio) are done in the browser.
- **Your picks:** saved in the browser's local storage so they are still there on your next visit. Nothing is sent anywhere.
- **Themes:** the page follows the visitor's light or dark setting.

## Project structure

```
index.html   The whole site: markup, styles, script and font list
README.md    This file
```

## Run it locally

Download or clone the repository and open `index.html` in a browser. An internet connection is needed for the fonts to load.

```
git clone https://github.com/Mhiah/Fine-log.git
cd Fine-log
```

Then open `index.html`, or serve the folder with any static server.

## Deploy

Any static host works. On Vercel, import the repository and deploy with the default settings: no framework, no build command, output directory left as the root.

## Roadmap

1. Connect a real AI model through a small server function, so examples respond to the description and the prompt is written around the project.
2. Let visitors save and share a combination by link.
3. Add font pairing suggestions next to each font.
4. Export a combination as CSS variables.

## Credits

Fonts are served by Google Fonts and remain under their own open licences. The font list comes from Google Fonts metadata.
