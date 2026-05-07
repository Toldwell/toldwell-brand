# DESIGN.md — Toldwell

> Good stories, told well.
>
> A video studio crafting work that holds meaning, creates impact, and stands the test of time.
>
> Generated from `brand.yaml` — do not edit directly.

---

## 1. Visual Theme & Atmosphere

**Mood:** Reverent, deliberate, story-driven

**Density:** comfortable

**Shape language:** Pill-rounded for actions (100px), softly rounded surfaces (40px), generous whitespace. Sharp edges only when intentional.

**Depth:** Subtle inset shadows on cards. Pressed/etched feel rather than elevated. Floating drop shadows feel synthetic — Toldwell prefers the weight of substance.

**Philosophy:** Toldwell makes work that lasts. The design should feel the same — calm where others are loud, considered where others are fast, durable where others are disposable.

**One-liner:** Nearly achromatic. Gold held in reserve. Story before style.

## 2. Color Palette

### Brand

| Token | Hex | Role |
|-------|-----|------|
| `brand.toldwell-gold` | `#F3CC92` | Primary accent. Reserved for moments that deserve warmth — hero punctuation, key CTAs, accent surfaces. Used sparingly; that's what gives it meaning. |

### Accent

| Token | Hex | Role |
|-------|-----|------|
| `accent.toldwell-gold-soft` | `#F8E0BB` | Tinted gold backgrounds, subtle accent fills, hover states on light surfaces |
| `accent.toldwell-gold-deep` | `#D9A85F` | Hover/pressed state for gold CTAs |

### Neutrals

| Token | Hex | Role |
|-------|-----|------|
| `neutrals.toldwell-dark` | `#1B1B1C` | Primary text, dark surfaces, footer, navigation. Toldwell's near-black — neutral charcoal with the faintest warm undertone. Pure black is reserved for overlays and special cases. |
| `neutrals.pure-black` | `#000000` | Hard black for overlay scrims, max-contrast situations, video letterboxing |
| `neutrals.pure-black-75` | `#000000BF` | 75% black overlay for video poster gradients and scrim effects |
| `neutrals.mid-gray` | `#6B6B6B` | Secondary text, muted captions, dividers on dark surfaces |
| `neutrals.surface-light` | `#F2F2F2` | Section surfaces, content containers on light pages |
| `neutrals.bone` | `#FFFFFF` | Page canvas, light text on dark backgrounds, card surfaces |

### Semantic

| Token | Hex | Role |
|-------|-----|------|
| `semantic.success` | `#3D8A5F` | Form success state, positive confirmation |
| `semantic.warning` | `#D9A85F` | Warning state — intentionally aligns with toldwell-gold-deep |
| `semantic.error` | `#B5453A` | Form error state, destructive action |
| `semantic.info` | `#4A6B8A` | Informational notice, neutral system status |

**Text selection:** `#FFFFFF` on `#1B1B1C`

## 2a. Surfaces

Semantic surface tokens — name describes role, not appearance.

| Token | Value | Role |
|-------|-------|------|
| `surface.canvas` | `#FFFFFF` | Default page background |
| `surface.card` | `#F2F2F2` | Card / section surface, slightly recessed against canvas |
| `surface.dark-stage` | `#1B1B1C` | Dark hero sections, footers, full-bleed cinematic blocks. The most common alternative canvas to white. |
| `surface.black-stage` | `#000000` | Pure black — reserved for video letterboxing, overlay scrims, max-contrast moments |
| `surface.accent-stage` | `#F3CC92` | Gold full-bleed sections. Used rarely, for moments that should feel warm and chosen. |

## 3. Typography

### Font Families

- **Belwe** (display) — Regular (400), Medium (500), Bold (700), Italic
  Hero headlines, display text, named brand moments. Belwe gives Toldwell its distinctive warm serif character — the editorial weight of a film title card.
- **Red Hat Display** (body) — 400, 500, 600, 700, 900
  Headings, subheadings, body text, UI elements. The clean sans-serif partner — modern, readable, gets out of the way.

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
- background: `#1B1B1C`
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
- text_color: `#1B1B1C`
- radius: `100px`
- padding: `12px 24px`
- font_size: `12px`
- font_weight: `500`
- hover.background: `#D9A85F`

**ghost:**
- background: `transparent`
- text_color: `#1B1B1C`
- border: `1px solid #1B1B1C`
- radius: `100px`
- padding: `12px 24px`

### Cards

**default:**
- background: `#F2F2F2`
- radius: `40px`
- shadow: `inset-card`
- padding: `32px`

**feature:**
- background: `#FFFFFF`
- radius: `40px`
- padding: `32px`

### Tags

- radius: `100px`
- padding: `5px 15px`
- font_size: `12px`
- background: `#F2F2F2`
- text_color: `#1B1B1C`

## 5. Layout

**Base unit:** 4px

**Max width:** 1200px

**Density:** comfortable

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
| card padding | 32px |
| element gap | 8px |

### Border Radii

| Token | Value |
|-------|-------|
| `radius.none` | 0px |
| `radius.md` | 40px |
| `radius.pill` | 100px |
| `radius.full` | 9999px |

### Named Radii (per component)

| Component | Radius |
|-----------|--------|
| `radius.buttons` | 100px |
| `radius.tags` | 100px |
| `radius.pill` | 100px |
| `radius.cards` | 40px |
| `radius.feature` | 40px |
| `radius.inputs` | 40px |

## 6. Depth & Elevation

### Shadows

| Token | Value |
|-------|-------|
| `shadow.none` | `none` |
| `shadow.inset-card` | `rgba(0, 0, 0, 0.18) 0.3px 0.6px 0.67px -1.25px inset, rgba(0, 0, 0, 0.16) 1.14px 2.29px 2.56px -2.5px inset, rgba(0, 0, 0, 0.063) 5px 10px 11.18px -3.75px inset` |
| `shadow.inset-card-deep` | `rgba(0, 0, 0, 0.22) 0.5px 1px 1.5px -1.5px inset, rgba(0, 0, 0, 0.18) 2px 4px 5px -2.5px inset, rgba(0, 0, 0, 0.08) 7px 14px 16px -4px inset` |
| `shadow.focus-ring` | `0 0 0 3px rgba(243, 204, 146, 0.4)` |

> Toldwell uses inset shadows for surfaces — pressed, not floating. Drop shadows reserved for focus rings only. The aesthetic is substance, not lift.

## 7. Do's and Don'ts

### Do

- Use Belwe for hero / display text — it carries the brand voice
- Use Red Hat Display for everything else
- Use Toldwell Dark (#1B1B1C) instead of pure black — pure black is reserved for video overlays
- Hold the gold (#F3CC92) in reserve — for CTAs, key punctuation, deliberate warmth
- Maintain generous whitespace — let the work breathe
- Pill-shaped buttons (100px) and softly-rounded cards (40px)
- Use inset shadows on cards, not drop shadows

### Don't

- Don't use pure black (#000000) for text or surfaces — that's for video letterboxing only
- Don't use drop shadows — Toldwell surfaces are pressed, not floating
- Don't introduce colors outside the palette
- Don't use Belwe for body text — display only
- Don't field gold across full sections without a reason — it loses meaning when overused
- Don't use sharp corners except when intentional
- Don't make interactive elements rectangular — always pill-shaped

## 8. Responsive Behavior

| Breakpoint | Width |
|------------|-------|
| mobile | 390px |
| tablet | 768px |
| desktop | 1200px |
| wide | 1440px |

> Display text scales dramatically between breakpoints. Mobile gets simplified hero treatment, desktop gets full editorial weight.

## 9. Agent Quick Reference

| Token | Value |
|-------|-------|
| primary | `#1B1B1C` |
| accent | `#F3CC92` |
| canvas | `#FFFFFF` |
| surface-card | `#F2F2F2` |
| display_font | `Belwe` |
| body_font | `Red Hat Display` |
| button_radius | `100px` |
| card_radius | `40px` |
| base_spacing | `4px` |
| type_ratio | `Major Third (1.25) from 12px` |

### Ready-to-Use Prompts

- Build a Toldwell hero section: dark canvas (#1B1B1C), Belwe display headline 'Good stories, told well.', Red Hat Display sub-tagline, single warm-gold (#F3CC92) CTA pill button. Generous whitespace. No drop shadows.
- Create a portfolio grid of video case studies: light canvas, F2F2F2 card surfaces with 40px radius and inset shadows, Belwe project titles, Red Hat Display body. Pill-shaped tags for category.
- Design a dark footer (#1B1B1C) with Red Hat Display, sub-100% opacity socials list (Instagram + LinkedIn + YouTube), gold pill CTA 'Let's make something meaningful', email hello@toldwell.com.
- Editorial film case study layout: white canvas, Belwe display title, em-dash heavy body copy, hold gold for the closing 'Watch the film' CTA only.

## 10. Voice & Tone

**Personality:** Reverent, Considered, Story-driven, Earnest, Crafted

**Tone spectrum:** Formal 5/10 · Playful 3/10 · Technical 4/10 · Emotional 8/10

**CTA style:** Direct, declarative, low-noise. 'Let's get to work.' / 'Watch our showreel.' / 'View our deck.' / 'Work with us.' Short, action-oriented, never salesy.

**Error style:** Friendly, direct — never blame the user. Plain language.

**Avoid:** Corporate buzzwords ('synergy', 'leverage', 'best-in-class'), Hype language ('mind-blowing', 'next-level', 'game-changing'), Filmmaking jargon in client-facing copy, Passive voice, Anything that prizes speed over substance

## 11. Brand Narrative

**What we are:** A video studio partnering with agencies, brands, and leaders to create films and narratives that stick.

**What we reject:** Fleeting content. Fast churn. Style without substance. Work designed only for the demands of social media and fast marketing.

**Core belief:** Every brand and leader has a story worth telling well. We long to create meaningful work that outlasts all those involved in its creation.

## 12. Principles

- **Story First:** Every design and creative decision serves the narrative. If it doesn't help tell the story, remove it.
- **Make It Last:** We craft work meant to outlive the moment that prompted it. Durability over disposability, always.
- **Hold the Gold:** The accent is reserved. A single warm note across an otherwise neutral score is what makes it sing. Same goes for any element of style — restraint creates meaning.
- **Talent Density:** Small, expert crews of 5-25 over large impersonal ones. Closer collaboration, faster decisions, no wasted craft.
- **Substance Before Style:** Beautiful work that isn't true to the brief is a failure. Truth first, then polish.
- **Breathe:** Generous whitespace. Let work and visuals command attention without clutter.

---

*Generated from `brand.yaml` by `build.js`. Edit the yaml, not this file.*
