# Toldwell Brand System

Single source of truth for the Toldwell visual identity. Edit `brand.yaml`, everything else updates automatically.

## Structure

```
brand.yaml          ← THE source of truth (edit this)
DESIGN.md           ← Generated — agent-readable design tokens (Google Stitch + OmD v0.1)
docs/index.html     ← Generated — human-readable brand guide site
build.js            ← Pipeline that generates both outputs
```

## How it works

```
Edit brand.yaml → git push → GitHub Action runs build.js
                                    ↓              ↓
                              DESIGN.md      docs/index.html
                             (for agents)   (brand.toldwell.com)
```

## Local development

```bash
npm run build      # Regenerate DESIGN.md and docs/
npm run preview    # Build and open the brand guide in browser
```

## What's in brand.yaml

Sections 1-9 follow the [Google Stitch DESIGN.md format](https://stitch.withgoogle.com/docs/design-md/format/). Sections 10-12 follow the [OmD v0.1 Philosophy Layer](https://github.com/kwakseongjae/oh-my-design).

| # | Section | Content |
|---|---------|---------|
| 1 | Atmosphere | Mood, density, shape language, philosophy |
| 2 | Colors | Palette with semantic roles |
| 3 | Typography | Font families, type scale, letter spacing |
| 4 | Components | Buttons, cards, tags with exact values |
| 5 | Layout | Spacing scale, border radii |
| 6 | Depth | Shadow system |
| 7 | Guidelines | Do's and don'ts |
| 8 | Responsive | Breakpoints |
| 9 | Agent Guide | Quick reference + ready-to-use prompts |
| 10 | Voice & Tone | Personality, microcopy style |
| 11 | Narrative | Brand story, beliefs |
| 12 | Principles | Design decision-making rules |

## Hosted at

**brand.toldwell.com** — via GitHub Pages + Cloudflare DNS
