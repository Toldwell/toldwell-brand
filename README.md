# Toldwell Brand System

Single source of truth for the Toldwell visual identity. Edit `brand.yaml`, run `npm run build`, everything else regenerates.

## Design Files

These are the canonical, machine-readable outputs. Drop them into any project that needs to use Toldwell's brand.

| File | Format | For |
|------|--------|-----|
| [`DESIGN.md`](./DESIGN.md) | Markdown (Stitch + OmD v0.1) | AI agents (Claude, Cursor, etc.) |
| [`tokens.css`](./tokens.css) | CSS custom properties | Vanilla CSS, any framework |
| [`tailwind.css`](./tailwind.css) | Tailwind v4 `@theme` block | Tailwind v4 projects |
| [`tokens.json`](./tokens.json) | W3C Design Tokens spec | Figma, Style Dictionary, Tokens Studio |

All four are generated from [`brand.yaml`](./brand.yaml) — the only file you edit by hand.

## Pipeline

```
brand.yaml ───┬──>  DESIGN.md            (root)
              ├──>  tokens.css            (root)
              ├──>  tailwind.css          (root)
              ├──>  tokens.json           (root)
content.yaml ─┴──>  site/template/*  →  docs/*      (Cipherly-styled brand site)
```

```bash
npm run build      # Regenerate all design files + site
npm run preview    # Build and open the site locally
```

- `brand.yaml` — design tokens (the system). Drives the four design files.
- `content.yaml` — the swap map for the brand site: per-page and global
  `from` → `to` text/image/URL substitutions applied to the Cipherly
  template at build time. **Page rules run after global rules**, so a page
  rule's `from` must be the post-global-swap form of the string.

### Runtime swap layer

The site still loads Cipherly's Framer hydration bundle from
`framerusercontent.com` (their published site — a known dependency risk:
if Cipherly unpublishes, hydration breaks and the site falls back to the
static, fully-swapped HTML). Hydration re-renders pages with Cipherly's
data, so [`swap-runtime.js`](./swap-runtime.js) re-applies all swaps after
every re-render. It also:

- normalizes SPA-pushed URLs to canonical paths (`/color/typography` →
  `/typography/`)
- restores download-button `href`s that hydration strips
- re-applies `og:image` / favicon / head metadata

`docs/404.html` is a GitHub Pages fallback that redirects any stale
nested path to its canonical page.

### Downloadable assets

`site/template/toldwell-{logo,fonts,photos}.zip` back the Resources page
download buttons (plus `/tokens.json` for the tokens card). The fonts zip
includes a license note — Belwe is commercially licensed, not for
redistribution. Regenerate zips from `assets/` if the sources change.

## What's in `brand.yaml`

Sections 1–9 follow the [Google Stitch DESIGN.md format](https://stitch.withgoogle.com/docs/design-md/format/). Sections 10–12 follow the [OmD v0.1 Philosophy Layer](https://github.com/kwakseongjae/oh-my-design).

| # | Section | Content |
|---|---------|---------|
| 1 | Atmosphere | Mood, density, shape language, philosophy |
| 2 | Colors | Brand / Accent / Neutrals / Semantic |
| 2a | Surfaces | Semantic surface tokens (canvas, card, dark-stage…) |
| 3 | Typography | Fonts, type scale (with documented ratio), weights, tracking |
| 4 | Components | Buttons, cards, tags |
| 5 | Layout | Spacing scale (4px base), radii (named per component) |
| 6 | Depth | Shadow system (inset-only philosophy) |
| 7 | Guidelines | Do's and don'ts |
| 8 | Responsive | Breakpoints |
| 9 | Agent Guide | Quick reference + ready-to-use prompts |
| 10 | Voice & Tone | Personality, microcopy style |
| 11 | Narrative | Brand story, beliefs |
| 12 | Principles | Design decision-making rules |

## Site

Hosted at **[brand.toldwell.com](https://brand.toldwell.com)** (GitHub Pages, Cloudflare DNS).

The visual brand guide source lives in [`site/`](./site/):

- `site/template/` — editable Cipherly-styled HTML source
- `site/_archive/` — legacy attempts (failed onepage merge, raw Cipherly rips)

Generated output lands in [`docs/`](./docs/) at repo root (GitHub Pages constraint — only `/` or `/docs` are valid serve paths).

When you run `npm run build`, the site is regenerated from the templates with `tokens.css` injected — so site styles automatically reflect any change to `brand.yaml`.

## Repo layout

```
toldwell-brand/
├── README.md
├── brand.yaml             ← THE source of truth
├── DESIGN.md              ← generated
├── tokens.css             ← generated
├── tailwind.css           ← generated
├── tokens.json            ← generated
├── build.js               ← pipeline
├── package.json
├── docs/                  ← generated output, served by GitHub Pages
└── site/
    ├── template/          ← editable HTML source
    └── _archive/          ← legacy attempts
```
