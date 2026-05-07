# DESIGN.md — Toldwell

> A Video Studio Creating Films That Stick
>
> We create videos for companies and individuals seeking a good story.
>
> Generated from `brand.yaml` — do not edit directly.

---

## 1. Visual Theme & Atmosphere

**Mood:** Warm, cinematic, story-driven

**Density:** moderate

**Shape language:** Rounded and approachable — heavy use of pill shapes (100px radius) for buttons and tags, softer radii (9–25px) for cards

**Depth:** Subtle inset shadows on cards, creating a pressed/etched feel rather than elevated

**Philosophy:** The design reflects filmmaking craft — dark warm tones for the cinema, warm gold for the story, generous space for the visually-minded audience to breathe

**One-liner:** Cinematic warmth on warm parchment, gold reserved for moments that matter.

## 2. Color Palette

### Brand

| Token | Hex | Role |
|-------|-----|------|
| `brand.toldwell-gold` | `#F3CC92` | Primary accent, CTAs, highlight backgrounds — the warm storytelling tone. Used sparingly; reserved for moments that should warm. |

### Accent

| Token | Hex | Role |
|-------|-----|------|
| `accent.toldwell-gold-soft` | `#F8E0BB` | Tinted gold backgrounds, subtle accent fills |
| `accent.toldwell-gold-deep` | `#D9A85F` | Hover/pressed state for gold CTAs |

### Neutrals

| Token | Hex | Role |
|-------|-----|------|
| `neutrals.toldwell-dark` | `#191412` | Primary text, dark backgrounds, footer, navigation — warm near-black. Toldwell never uses pure black. |
| `neutrals.slate` | `#3A3230` | Hover state for dark surfaces, secondary dark text |
| `neutrals.graphite` | `#5C504C` | Tertiary text, captions on light surfaces, subtle borders on dark |
| `neutrals.fog` | `#9A8E89` | Disabled text, muted metadata, inactive icon fills |
| `neutrals.driftwood` | `#D6CFC9` | Dividers, hairline borders, subtle structural lines |
| `neutrals.surface-light` | `#F2F2F2` | Card backgrounds, secondary surface, content containers |
| `neutrals.parchment` | `#FAF8F4` | Page canvas alternative — warm off-white, mood-adjacent for editorial sections |
| `neutrals.bone` | `#FFFFFF` | Page canvas (default), light text on dark backgrounds, card surfaces over parchment |

### Semantic

| Token | Hex | Role |
|-------|-----|------|
| `semantic.success` | `#3D8A5F` | Success state, positive confirmations |
| `semantic.warning` | `#D9A85F` | Warning state, attention required |
| `semantic.error` | `#B5453A` | Error state, destructive actions |
| `semantic.info` | `#4A6B8A` | Informational notices, neutral status |

**Text selection:** `#FFFFFF` on `#191412`

## 2a. Surfaces

Semantic surface tokens — name describes role, not appearance.

| Token | Value | Role |
|-------|-------|------|
| `surface.canvas` | `#FFFFFF` | Default page background |
| `surface.canvas-warm` | `#FAF8F4` | Warm parchment alternative for editorial sections |
| `surface.card` | `#F2F2F2` | Default card surface — slightly recessed against canvas |
| `surface.card-elevated` | `#FFFFFF` | Elevated cards over warm canvas (parchment) |
| `surface.dark-stage` | `#191412` | Dark hero sections, footers, full-bleed cinematic blocks |
| `surface.dark-stage-soft` | `#3A3230` | Hover/secondary dark surfaces |
| `surface.accent-stage` | `#F3CC92` | Gold full-bleed sections — used rarely, for moments of high warmth |

## 3. Typography

### Font Families

- **Belwe** (display) — Regular (400), Medium (500), Bold, Italic
  Hero headlines, large display text — gives Toldwell its distinctive warm serif character
- **Red Hat Display** (body) — 400, 500, 600, 700, 900
  Headings, subheadings, body text, UI elements — the workhorse font

### Type Scale Ratio

- **Body:** Major Third (1.25) from 12px base
- **Display:** Editorial — Belwe sizes are chosen for cinematic impact, not a ratio

### Type Scale

| Token | Size | Line Height | Weight | Font | Use |
|-------|------|-------------|--------|------|-----|
| `display-xxl` | 215px | 1 | 400 | Belwe | Hero splash text |
| `display-xl` | 120px | 1 | 400 | Belwe | Large hero headlines |
| `display-lg` | 100px | 1.05 | 400 | Belwe | Section hero text |
| `display-md` | 92px | 1.05 | 400 | Belwe | Feature headlines |
| `display-sm` | 70px | 1.1 | 400 | Belwe | Secondary headlines |
| `h1` | 48px | 1.15 | 700 | Red Hat Display | Page titles |
| `h2` | 32px | 1.25 | 600 | Red Hat Display | Section titles |
| `h3` | 30px | 1.3 | 600 | Red Hat Display | Subsection titles |
| `h4` | 26px | 1.35 | 500 | Red Hat Display | Card titles, feature headers |
| `h5` | 24px | 1.4 | 500 | Red Hat Display | Small section headers |
| `body-lg` | 22px | 1.5 | 400 | Red Hat Display | Lead paragraphs |
| `body-md` | 20px | 1.55 | 400 | Red Hat Display | Standard body text |
| `body-sm` | 18px | 1.6 | 400 | Red Hat Display | Compact body text |
| `caption` | 12px | 1.4 | 500 | Red Hat Display | Captions, labels, tags, buttons |
| `micro` | 11px | 1.4 | 400 | Red Hat Display | Fine print, metadata |

### Weights

| Token | Value |
|-------|-------|
| `weight.regular` | 400 |
| `weight.medium` | 500 |
| `weight.semibold` | 600 |
| `weight.bold` | 700 |
| `weight.black` | 900 |

### Letter Spacing

| Token | Value |
|-------|-------|
| `tracking.display-xxl` | `-1.5px` |
| `tracking.display` | `-1px` |
| `tracking.heading` | `-0.8px` |
| `tracking.body` | `-0.4px` |
| `tracking.default` | `-0.5px` |
| `tracking.label` | `0.4px` |

## 4. Components

### Buttons

**primary:**
- background: `#191412`
- text_color: `#FFFFFF`
- radius: `100px`
- padding: `12px 24px`
- font_family: `Red Hat Display`
- font_size: `12px`
- font_weight: `500`
- letter_spacing: `0.4px`
- text_transform: `uppercase`
- hover.background: `#3A3230`

**accent:**
- background: `#F3CC92`
- text_color: `#191412`
- radius: `100px`
- padding: `12px 24px`
- font_size: `12px`
- font_weight: `500`
- hover.background: `#D9A85F`

**ghost:**
- background: `transparent`
- text_color: `#191412`
- border: `1px solid #191412`
- radius: `100px`
- padding: `12px 24px`

### Cards

**default:**
- background: `#F2F2F2`
- radius: `9px`
- shadow: `inset-card`
- padding: `20px`

**portfolio:**
- radius: `20px`
- overflow: `hidden`

**feature:**
- background: `#FFFFFF`
- radius: `25px`
- padding: `32px`

### Tags

- radius: `100px`
- padding: `5px 15px`
- font_size: `12px`
- background: `#F2F2F2`
- text_color: `#191412`

## 5. Layout

**Base unit:** 4px

**Max width:** 1200px

**Density:** moderate

### Spacing Scale

| Token | Value |
|-------|-------|
| `spacing.4` | 4px |
| `spacing.8` | 8px |
| `spacing.12` | 12px |
| `spacing.16` | 16px |
| `spacing.20` | 20px |
| `spacing.24` | 24px |
| `spacing.32` | 32px |
| `spacing.40` | 40px |
| `spacing.48` | 48px |
| `spacing.64` | 64px |
| `spacing.80` | 80px |
| `spacing.96` | 96px |
| `spacing.128` | 128px |

### Semantic Spacing

| Purpose | Value |
|---------|-------|
| section gap | 80px |
| card padding | 20px |
| element gap | 8px |

### Border Radii

| Token | Value |
|-------|-------|
| `radius.none` | 0px |
| `radius.sm` | 9px |
| `radius.md` | 20px |
| `radius.lg` | 25px |
| `radius.xl` | 40px |
| `radius.pill` | 100px |
| `radius.full` | 9999px |

### Named Radii (per component)

| Component | Radius |
|-----------|--------|
| `radius.buttons` | 100px |
| `radius.tags` | 100px |
| `radius.pill` | 100px |
| `radius.cards` | 9px |
| `radius.cards-md` | 20px |
| `radius.cards-lg` | 25px |
| `radius.portfolio` | 20px |
| `radius.feature` | 25px |
| `radius.inputs` | 9px |

## 6. Depth & Elevation

### Shadows

| Token | Value |
|-------|-------|
| `shadow.none` | `none` |
| `shadow.inset-card` | `rgba(0, 0, 0, 0.18) 0.3px 0.6px 0.67px -1.25px inset, rgba(0, 0, 0, 0.16) 1.14px 2.29px 2.56px -2.5px inset, rgba(0, 0, 0, 0.063) 5px 10px 11.18px -3.75px inset` |
| `shadow.inset-card-deep` | `rgba(0, 0, 0, 0.22) 0.5px 1px 1.5px -1.5px inset, rgba(0, 0, 0, 0.18) 2px 4px 5px -2.5px inset, rgba(0, 0, 0, 0.08) 7px 14px 16px -4px inset` |
| `shadow.focus-ring` | `0 0 0 3px rgba(243, 204, 146, 0.4)` |

> Toldwell uses inset shadows exclusively — pressed/etched aesthetic, not floating cards. This is distinctive. Drop shadows are reserved for focus rings only.

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
- Hold the gold in reserve — accent, not field. Used too often, it loses meaning.

### Don't

- Don't use pure black (#000000) — use Toldwell Dark (#191412)
- Don't use drop shadows — Toldwell cards are pressed in, not floating
- Don't introduce colors outside the palette
- Don't use Belwe for body text — it's display only
- Don't use fonts other than Belwe and Red Hat Display
- Don't use sharp corners — minimum radius is 9px
- Don't make buttons rectangular — always pill-shaped
- Don't field gold across full sections without intentional reason

## 8. Responsive Behavior

| Breakpoint | Width |
|------------|-------|
| mobile | 390px |
| tablet | 768px |
| desktop | 1200px |
| wide | 1440px |

> Framer-built — uses fluid responsive scaling. Display text scales dramatically between breakpoints.

## 9. Agent Quick Reference

| Token | Value |
|-------|-------|
| primary | `#191412` |
| accent | `#F3CC92` |
| canvas | `#FFFFFF` |
| canvas-warm | `#FAF8F4` |
| surface-card | `#F2F2F2` |
| display_font | `Belwe` |
| body_font | `Red Hat Display` |
| button_radius | `100px` |
| card_radius | `9px` |
| base_spacing | `4px` |
| type_ratio | `Major Third (1.25) from 12px` |

### Ready-to-Use Prompts

- Build a landing page with Toldwell Dark (#191412) hero section, warm gold (#F3CC92) accent reserved for the primary CTA, Belwe serif headlines, Red Hat Display body text, pill-shaped buttons (100px radius), inset card shadows.
- Create a portfolio card grid with light gray (#F2F2F2) cards, inset shadows, 9px radius, generous spacing (80px section gap, 20px card padding).
- Design a dark footer (#191412) with white text, Red Hat Display typography, pill-shaped CTA button in gold (#F3CC92).
- Editorial section: warm parchment canvas (#FAF8F4), Belwe display headline, Red Hat Display body. No gold unless it's earning attention.

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

- **Story First:** Every design decision serves the narrative. If it doesn't help tell the story, remove it.
- **Cinematic Craft:** Treat the screen like a frame. Composition, contrast, and timing matter.
- **Warm Professionalism:** Approachable but not casual. The gold accent warms the dark foundation.
- **Breathe:** Generous whitespace. Let content and visuals command attention without clutter.
- **Show, Don't Tell:** Lead with work. Portfolio pieces speak louder than copy.
- **Hold the Gold:** The accent is reserved. A single warm note across an otherwise neutral score is what makes it sing.

---

*Generated from `brand.yaml` by `build.js`. Edit the yaml, not this file.*
