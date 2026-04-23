# DESIGN.md — Toldwell

> A Video Studio Creating Films That Stick
>
> We create videos for companies and individuals seeking a good story.
>
> Generated from `brand.yaml` — do not edit directly.

---

## 1. Visual Theme & Atmosphere

**Mood:** Warm, cinematic, story-driven

**Density:** Moderate — generous whitespace with purposeful density in portfolio sections

**Shape language:** Rounded and approachable — heavy use of pill shapes (100px radius) for buttons and tags, softer radii (9-25px) for cards

**Depth:** Subtle inset shadows on cards, creating a pressed/etched feel rather than elevated

**Philosophy:** The design reflects filmmaking craft — dark warm tones for the cinema, warm gold for the story, generous space for the visually-minded audience to breathe

## 2. Color Palette & Roles

- **Toldwell Dark** (`#191412`) — Primary text, dark backgrounds, footer, navigation — warm near-black
- **Toldwell Gold** (`#F3CC92`) — Primary accent, CTAs, highlight backgrounds, warm storytelling tone
- **Light Gray** (`#F2F2F2`) — Card backgrounds, section surfaces, content containers
- **White** (`#FFFFFF`) — Page canvas, light text on dark backgrounds

**Text selection:** #FFFFFF on #191412

## 3. Typography Rules

### Font Families

- **Belwe** (display) — variants: Regular (400), Medium (500), Bold, Italic
  Hero headlines, large display text — gives Toldwell its distinctive warm serif character
- **Red Hat Display** (body) — weights: 400, 500, 600, 700, 900
  Headings, subheadings, body text, UI elements — the workhorse font

### Type Scale

| Token | Size | Font | Use |
|-------|------|------|-----|
| `display-xxl` | 215px | Belwe | Hero splash text |
| `display-xl` | 120px | Belwe | Large hero headlines |
| `display-lg` | 100px | Belwe | Section hero text |
| `display-md` | 92px | Belwe | Feature headlines |
| `display-sm` | 70px | Belwe | Secondary headlines |
| `h1` | 48px | Red Hat Display | Page titles |
| `h2` | 32px | Red Hat Display | Section titles |
| `h3` | 30px | Red Hat Display | Subsection titles |
| `h4` | 26px | Red Hat Display | Card titles, feature headers |
| `h5` | 24px | Red Hat Display | Small section headers |
| `body-lg` | 22px | Red Hat Display | Lead paragraphs |
| `body-md` | 20px | Red Hat Display | Standard body text |
| `body-sm` | 18px | Red Hat Display | Compact body text |
| `caption` | 12px | Red Hat Display | Captions, labels, tags, buttons |
| `micro` | 11px | Red Hat Display | Fine print, metadata |

### Letter Spacing

| Token | Value |
|-------|-------|
| tight | -1.5px |
| medium_tight | -1px |
| snug | -0.8px |
| normal | -0.5px |
| reading | -0.4px |
| wide | 0.4px |

## 4. Component Stylings

### Buttons

**Primary:**
- Background: `#191412`
- Text: `#FFFFFF`
- Radius: `100px` (pill)
- Padding: `12px 24px`
- Font: Red Hat Display, 12px, weight 500
- Letter spacing: `0.4px`
- Text transform: uppercase
- Hover: `#3a3230`

**Accent:**
- Background: `#F3CC92` (Toldwell Gold)
- Text: `#191412`
- Radius: `100px`

**Ghost:**
- Background: `transparent`
- Border: `1px solid #191412`
- Radius: `100px`

### Cards

**Default:**
- Background: `#F2F2F2`
- Radius: `9px`
- Shadow: `rgba(0, 0, 0, 0.18) 0.3px 0.6px 0.67px -1.25px inset, rgba(0, 0, 0, 0.16) 1.14px 2.29px 2.56px -2.5px inset, rgba(0, 0, 0, 0.063) 5px 10px 11.18px -3.75px inset`
- Padding: `20px`

**Portfolio:**
- Radius: `20px`
- Overflow: hidden

### Tags

- Background: `#F2F2F2`
- Radius: `100px` (pill)
- Padding: `5px 15px`
- Font size: `12px`

## 5. Layout Principles

**Spacing scale:** 2px, 5px, 10px, 15px, 20px, 25px, 32px, 40px, 50px, 80px, 96px

**Base unit:** 5px

**Max width:** 1200px

**Border radii:**
| Token | Value |
|-------|-------|
| sm | 9px |
| md | 20px |
| lg | 25px |
| xl | 40px |
| pill | 100px |

## 6. Depth & Elevation

**Shadow — inset card:** `rgba(0, 0, 0, 0.18) 0.3px 0.6px 0.67px -1.25px inset, rgba(0, 0, 0, 0.16) 1.14px 2.29px 2.56px -2.5px inset, rgba(0, 0, 0, 0.063) 5px 10px 11.18px -3.75px inset`

Toldwell uses inset shadows exclusively — pressed/etched aesthetic, not floating cards. This is distinctive.

## 7. Do's and Don'ts

### Do

- Use Belwe for hero/display text — it defines the Toldwell look
- Use Red Hat Display for everything else — headings, body, UI
- Use the warm gold (#F3CC92) for CTAs and accent backgrounds
- Use Toldwell Dark (#191412) instead of pure black — it's warmer
- Maintain generous whitespace — the design breathes
- Use pill-shaped buttons (100px radius) consistently
- Use inset shadows on cards, not drop shadows
- Pair serif display (Belwe) with Red Hat Display for body

### Don't

- Don't use pure black (#000000) — use Toldwell Dark (#191412)
- Don't use drop shadows — Toldwell cards are pressed in, not floating
- Don't introduce colors outside the palette
- Don't use Belwe for body text — it's display only
- Don't use fonts other than Belwe and Red Hat Display
- Don't use sharp corners — minimum radius is 9px
- Don't make buttons rectangular — always pill-shaped

## 8. Responsive Behavior

**Breakpoints:**
| Name | Width |
|------|-------|
| mobile | 390px |
| tablet | 768px |
| desktop | 1200px |
| wide | 1440px |

Framer-built — uses fluid responsive scaling. Display text scales dramatically between breakpoints.

## 9. Agent Prompt Guide

### Quick Reference

| Token | Value |
|-------|-------|
| primary | `#191412` |
| accent | `#F3CC92` |
| surface | `#F2F2F2` |
| background | `#FFFFFF` |
| display_font | `Belwe` |
| body_font | `Red Hat Display` |
| button_radius | `100px` |
| card_radius | `9px` |

### Ready-to-Use Prompts

- "Build a landing page with dark (#191412) hero section, warm gold (#F3CC92) accent, Belwe serif headlines, Red Hat Display body text, pill-shaped buttons"
- "Create a portfolio card grid with light gray (#F2F2F2) cards, inset shadows, 9px radius, generous spacing"
- "Design a dark footer with white text, Red Hat Display typography, pill-shaped CTA button in gold"

## 10. Voice & Tone

**Personality:** Warm, Confident, Story-driven, Crafted

**Tone spectrum:** Formal 6/10 · Playful 4/10 · Technical 3/10 · Emotional 7/10

**CTA style:** Action-oriented, concise — 'Start your story', 'See our work', 'Let's talk'

**Error style:** Friendly, direct — avoid technical jargon

**Avoid:** Corporate buzzwords, Overly casual/slang, Technical filmmaking jargon in client-facing copy, Passive voice

## 11. Brand Narrative

**What we are:** A video studio that creates films that stick — memorable, emotional, purposeful

**What we reject:** Generic corporate videos, stock-footage-driven content, style without substance

**Core belief:** Every company and individual has a story worth telling well

## 12. Principles

- **Story First**: Every design decision serves the narrative. If it doesn't help tell the story, remove it.
- **Cinematic Craft**: Treat the screen like a frame. Composition, contrast, and timing matter.
- **Warm Professionalism**: Approachable but not casual. The gold accent warms the dark foundation.
- **Breathe**: Generous whitespace. Let content and visuals command attention without clutter.
- **Show, Don't Tell**: Lead with work. Portfolio pieces speak louder than copy.

---

*Generated from `brand.yaml` by the Toldwell brand pipeline. Edit brand.yaml, not this file.*
