# Memory Match 🕰️

Flip 24 cards, find all 12 pairs, and don't let the Flux Capacitor down.

> "Roads? Where we're going, we don't need roads."
> — Doc Brown

![The board](docs/screenshots/board.png)

## Features

- 🎴 **24 cards, 12 pairs**, all straight from the trilogy
- 📊 **Live stats**: games played, matches, attempts, and accuracy
- 🚗 **Win screen** with a DeLorean payoff
- 🎵 **Theme music** you can mute
- 📱 **Phone-friendly** layout

> "Great Scott!"
> — Doc Brown

> "Wait a minute, Doc. Are you telling me you built a time machine... out of a DeLorean?"
> — Marty McFly

## Quick start

```bash
npm install
npm run dev      # local dev server
npm run build    # production build in dist/
npm test         # run the test suite
```

## Use it in another React app 🧩

Everything the game needs lives in one folder, `src/memory-match/`. Copy it
into your project and render it:

```jsx
import MemoryGame from "./memory-match";

// The game fills whatever box it is placed in, so give that box a height.
<div style={{ height: "80vh" }}>
  <MemoryGame />
</div>
```

| Prop | Default | |
|---|---|---|
| `className` | | extra class for the game's outer box |
| `style` | | extra inline style for the outer box |
| `music` | `true` | `false` turns background music off |

Good to know:

- **Needs** React (tested with 19) and a bundler that handles CSS Modules and asset imports
  (Vite does). No other dependencies.
- **Styles are scoped** (CSS Modules), so it won't clash with Tailwind,
  Bootstrap or your own CSS, and it sets nothing on `body` or `:root`.
- **Assets are imported**, not hard-coded, so it works at any route depth and
  base path (e.g. `/games/memory-match`). They add about 6 MB, mostly the music,
  the win video and the wallpaper.
- **Layout adapts to its box**, not the window: wide boxes get the side menu,
  tall ones get a menu strip on top.
- **Music** starts on the player's first click *inside* the game (browsers block
  autoplay), never from a click elsewhere on the page, and stops on unmount.
- The win flash and modal stay inside the game box and never cover your nav.

## Artwork

The 12 matching images are cropped from the official trilogy galleries: Marty at
Enchantment Under the Sea, Doc at the clock tower, the DeLorean, the hoverboard,
and other recognizable characters and moments. The night-time clock-tower
background has a dark overlay to keep the board and stats readable.

All refreshed images are bundled locally as optimized WebP files (640 × 640 for
cards, 1920 × 1080 for the background), with no runtime third-party image requests.
![Artwork preview — all cards revealed for illustration only](docs/screenshots/artwork-preview.png)

Full source pages, original image URLs, crop centers, and rights notes are in
[`src/memory-match/assets/refresh/credits.json`](src/memory-match/assets/refresh/credits.json).
Attribution does not grant a license: the images remain copyrighted by their
respective rights holders and are not represented as openly licensed.

## Built with

React + Vite. Originally written in AngularJS + jQuery.

```
src/memory-match/   the game: copy this folder to reuse it
src/main.jsx        tiny standalone shell used by `npm run dev`
```

---

*Fan project. Back to the Future is property of its respective owners.*
