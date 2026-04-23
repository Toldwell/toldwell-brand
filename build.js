#!/usr/bin/env node
/**
 * Toldwell Brand Build Pipeline
 * Reads brand.yaml → generates DESIGN.md + docs/ static site
 * Site layout modeled on Cipherly brand guidelines (cipherly.framer.website)
 *
 * Usage: node build.js
 */

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const BRAND_FILE = path.join(__dirname, 'brand.yaml');
const DESIGN_MD_FILE = path.join(__dirname, 'DESIGN.md');
const DOCS_DIR = path.join(__dirname, 'docs');

function loadBrand() {
  const raw = fs.readFileSync(BRAND_FILE, 'utf8');
  return yaml.load(raw);
}

function isLight(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 128;
}

// ─── Generate DESIGN.md ────────────────────────────────────────────────────────

function generateDesignMd(brand) {
  const b = brand;
  const colors = b.colors;
  const typo = b.typography;
  const comp = b.components;

  const colorLines = Object.entries(colors)
    .filter(([k]) => k !== 'selection')
    .map(([_, c]) => `- **${c.name}** (\`${c.hex}\`) — ${c.role}`)
    .join('\n');

  const fontLines = Object.entries(typo.fonts)
    .map(([role, f]) => {
      const weights = f.weights ? ` — weights: ${f.weights.join(', ')}` : f.variants ? ` — variants: ${f.variants.join(', ')}` : '';
      return `- **${f.family}** (${role})${weights}\n  ${f.role}`;
    })
    .join('\n');

  const scaleLines = typo.scale
    .map(s => `| \`${s.name}\` | ${s.size} | ${s.font} | ${s.use} |`)
    .join('\n');

  const spacingLines = typo.letter_spacing
    ? Object.entries(typo.letter_spacing).map(([k, v]) => `| ${k} | ${v} |`).join('\n')
    : '';

  const doLines = b.guidelines.do.map(d => `- ${d}`).join('\n');
  const dontLines = b.guidelines.dont.map(d => `- ${d}`).join('\n');

  const principleLines = b.principles
    .map(p => `- **${p.name}**: ${p.description}`)
    .join('\n');

  const promptLines = b.agent.prompts
    .map(p => `- "${p}"`)
    .join('\n');

  const quickRef = Object.entries(b.agent.quick_reference)
    .map(([k, v]) => `| ${k} | \`${v}\` |`)
    .join('\n');

  return `# DESIGN.md — ${b.meta.name}

> ${b.meta.tagline}
>
> ${b.meta.description}
>
> Generated from \`brand.yaml\` — do not edit directly.

---

## 1. Visual Theme & Atmosphere

**Mood:** ${b.atmosphere.mood}

**Density:** ${b.atmosphere.density}

**Shape language:** ${b.atmosphere.shape_language}

**Depth:** ${b.atmosphere.depth}

**Philosophy:** ${b.atmosphere.philosophy}

## 2. Color Palette & Roles

${colorLines}

**Text selection:** ${colors.selection.text} on ${colors.selection.background}

## 3. Typography Rules

### Font Families

${fontLines}

### Type Scale

| Token | Size | Font | Use |
|-------|------|------|-----|
${scaleLines}

### Letter Spacing

| Token | Value |
|-------|-------|
${spacingLines}

## 4. Component Stylings

### Buttons

**Primary:**
- Background: \`${comp.buttons.primary.background}\`
- Text: \`${comp.buttons.primary.text_color}\`
- Radius: \`${comp.buttons.primary.radius}\` (pill)
- Padding: \`${comp.buttons.primary.padding}\`
- Font: ${comp.buttons.primary.font_family}, ${comp.buttons.primary.font_size}, weight ${comp.buttons.primary.font_weight}
- Letter spacing: \`${comp.buttons.primary.letter_spacing}\`
- Text transform: ${comp.buttons.primary.text_transform}
- Hover: \`${comp.buttons.primary.hover.background}\`

**Accent:**
- Background: \`${comp.buttons.accent.background}\` (Toldwell Gold)
- Text: \`${comp.buttons.accent.text_color}\`
- Radius: \`${comp.buttons.accent.radius}\`

**Ghost:**
- Background: \`${comp.buttons.ghost.background}\`
- Border: \`${comp.buttons.ghost.border}\`
- Radius: \`${comp.buttons.ghost.radius}\`

### Cards

**Default:**
- Background: \`${comp.cards.default.background}\`
- Radius: \`${comp.cards.default.radius}\`
- Shadow: \`${comp.cards.default.shadow}\`
- Padding: \`${comp.cards.default.padding}\`

**Portfolio:**
- Radius: \`${comp.cards.portfolio.radius}\`
- Overflow: ${comp.cards.portfolio.overflow}

### Tags

- Background: \`${comp.tags.background}\`
- Radius: \`${comp.tags.radius}\` (pill)
- Padding: \`${comp.tags.padding}\`
- Font size: \`${comp.tags.font_size}\`

## 5. Layout Principles

**Spacing scale:** ${b.layout.spacing_scale.map(s => `${s}px`).join(', ')}

**Base unit:** ${b.layout.base_unit}

**Max width:** ${b.layout.max_width}

**Border radii:**
| Token | Value |
|-------|-------|
${Object.entries(b.layout.radii).map(([k, v]) => `| ${k} | ${v} |`).join('\n')}

## 6. Depth & Elevation

**Shadow — inset card:** \`${b.depth.shadows.inset_card}\`

${b.depth.notes}

## 7. Do's and Don'ts

### Do

${doLines}

### Don't

${dontLines}

## 8. Responsive Behavior

**Breakpoints:**
| Name | Width |
|------|-------|
${Object.entries(b.responsive.breakpoints).map(([k, v]) => `| ${k} | ${v} |`).join('\n')}

${b.responsive.notes}

## 9. Agent Prompt Guide

### Quick Reference

| Token | Value |
|-------|-------|
${quickRef}

### Ready-to-Use Prompts

${promptLines}

## 10. Voice & Tone

**Personality:** ${b.voice.personality.join(', ')}

**Tone spectrum:** Formal ${b.voice.tone_spectrum.formal}/10 · Playful ${b.voice.tone_spectrum.playful}/10 · Technical ${b.voice.tone_spectrum.technical}/10 · Emotional ${b.voice.tone_spectrum.emotional}/10

**CTA style:** ${b.voice.microcopy.cta_style}

**Error style:** ${b.voice.microcopy.error_style}

**Avoid:** ${b.voice.avoid.join(', ')}

## 11. Brand Narrative

**What we are:** ${b.narrative.what_we_are}

**What we reject:** ${b.narrative.what_we_reject}

**Core belief:** ${b.narrative.belief}

## 12. Principles

${principleLines}

---

*Generated from \`brand.yaml\` by the Toldwell brand pipeline. Edit brand.yaml, not this file.*
`;
}

// ─── Generate Static Site ──────────────────────────────────────────────────────
// Layout modeled on cipherly.framer.website with exact token mapping

function generateSite(brand) {
  const b = brand;
  const c = b.colors;

  fs.mkdirSync(DOCS_DIR, { recursive: true });

  const sections = [
    { id: 'introduction', num: '01', title: 'Introduction' },
    { id: 'strategy', num: '02', title: 'Strategy' },
    { id: 'colors', num: '03', title: 'Color', subs: [
      { id: 'color-palette', title: 'Palette' },
      { id: 'color-usage', title: 'Usage' },
    ]},
    { id: 'typography', num: '04', title: 'Typography', subs: [
      { id: 'type-fonts', title: 'Fonts' },
      { id: 'type-scale', title: 'Type Scale' },
      { id: 'type-spacing', title: 'Letter Spacing' },
    ]},
    { id: 'components', num: '05', title: 'Components', subs: [
      { id: 'comp-buttons', title: 'Buttons' },
      { id: 'comp-cards', title: 'Cards' },
      { id: 'comp-tags', title: 'Tags' },
    ]},
    { id: 'layout', num: '06', title: 'Layout', subs: [
      { id: 'layout-spacing', title: 'Spacing' },
      { id: 'layout-radii', title: 'Border Radii' },
    ]},
    { id: 'guidelines', num: '07', title: 'Guidelines' },
    { id: 'voice', num: '08', title: 'Voice & Narrative', subs: [
      { id: 'voice-tone', title: 'Tone' },
      { id: 'voice-narrative', title: 'Narrative' },
      { id: 'voice-principles', title: 'Principles' },
    ]},
  ];

  // Sidebar nav HTML
  const sidebarNav = sections.map(s => {
    let html = `<a href="#${s.id}" class="nav-item" data-section="${s.id}"><span class="nav-num">${s.num}</span><span class="nav-text">${s.title}</span></a>`;
    if (s.subs) {
      const subs = s.subs.map(sub =>
        `<a href="#${sub.id}" class="nav-sub-item" data-parent="${s.id}">${sub.title}</a>`
      ).join('\n');
      html += `\n<div class="nav-sub-group" data-parent="${s.id}">${subs}</div>`;
    }
    return html;
  }).join('\n');

  // Color swatches
  const swatches = Object.entries(c)
    .filter(([k]) => k !== 'selection')
    .map(([, col]) => {
      const txtCol = isLight(col.hex) ? c.primary.hex : '#fff';
      return `<div class="swatch-card">
        <div class="swatch-color" style="background:${col.hex};color:${txtCol}"><span>${col.hex}</span></div>
        <div class="swatch-meta"><strong>${col.name}</strong><span>${col.role}</span></div>
      </div>`;
    }).join('\n');

  // Type scale table
  const typeRows = b.typography.scale.map(s =>
    `<tr><td><code>${s.name}</code></td><td>${s.size}</td><td>${s.font}</td><td>${s.use}</td></tr>`
  ).join('\n');

  // Letter spacing table
  const lsRows = Object.entries(b.typography.letter_spacing).map(([k, v]) =>
    `<tr><td>${k}</td><td><code>${v}</code></td></tr>`
  ).join('\n');

  // Spacing bars
  const spacingBars = b.layout.spacing_scale.map(s =>
    `<div class="sp-row"><div class="sp-bar" style="width:${Math.min(s, 240)}px"></div><code>${s}px</code></div>`
  ).join('\n');

  // Radii demos
  const radiiDemos = Object.entries(b.layout.radii).map(([k, v]) =>
    `<div class="rad-item"><div class="rad-box" style="border-radius:${v}"></div><strong>${k}</strong><code>${v}</code></div>`
  ).join('\n');

  // Guidelines
  const doItems = b.guidelines.do.map(d => `<li>${d}</li>`).join('\n');
  const dontItems = b.guidelines.dont.map(d => `<li>${d}</li>`).join('\n');

  // Principles
  const principles = b.principles.map(p =>
    `<div class="info-block"><h4>${p.name}</h4><p>${p.description}</p></div>`
  ).join('\n');

  // Tone bars
  const tones = Object.entries(b.voice.tone_spectrum).map(([k, v]) =>
    `<div class="tone-row"><span class="tone-name">${k}</span><div class="tone-track"><div class="tone-bar" style="width:${v*10}%"></div></div><span class="tone-val">${v}/10</span></div>`
  ).join('\n');

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${b.meta.name} — Brand Guidelines</title>
<meta name="description" content="${b.meta.tagline}">
<link rel="icon" href="${b.meta.favicon}">
<link href="https://fonts.googleapis.com/css2?family=Red+Hat+Display:ital,wght@0,400;0,500;0,600;0,700;0,900;1,400;1,700;1,900&display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&display=swap" rel="stylesheet">
<style>
/* ════════════════════════════════════════════════════════════════════════════════
   Cipherly-mapped tokens → Toldwell brand
   ════════════════════════════════════════════════════════════════════════════ */
:root{
  --white:#fff;
  --black:${c.primary.hex};
  --accent:${c.accent.hex};
  --surface:${c.surface.hex};
  --gray:#7f7f7f;
  --border:#f0f0f0;
  --border2:#ebebeb;
  --sidebar-bg:${c.primary.hex};
  --sidebar-w:240px;
  --accent-7:rgba(243,204,146,.07);
  --accent-20:rgba(243,204,146,.20);
  --white-5:rgba(255,255,255,.05);
  --white-15:rgba(255,255,255,.15);
  --white-50:rgba(255,255,255,.50);
}
*,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
::selection{color:${c.selection.text};background:${c.selection.background}}
html{scroll-behavior:smooth;scroll-padding-top:20px}
body{
  font-family:'Red Hat Display',sans-serif;
  font-size:16px;
  font-weight:500;
  line-height:128%;
  color:var(--black);
  background:var(--white);
  -webkit-font-smoothing:antialiased;
  -moz-osx-font-smoothing:grayscale;
}

/* ─── Two-column layout ─── */
.wrap{display:flex;min-height:100vh}

/* ─── Sidebar ─── */
.sidebar{
  width:var(--sidebar-w);
  position:fixed;top:0;left:0;bottom:0;
  background:var(--sidebar-bg);
  display:flex;flex-direction:column;
  z-index:100;
  overflow:hidden;
}
.sb-head{
  padding:28px 20px 20px;
  border-bottom:1px solid var(--white-15);
}
.sb-logo{
  font-size:18px;font-weight:700;color:var(--white);
  letter-spacing:-.36px;line-height:120%;
}
.sb-label{
  font-size:10px;font-weight:600;color:var(--white-50);
  letter-spacing:.4px;text-transform:uppercase;
  margin-top:4px;
}
.sb-nav{
  flex:1;overflow-y:auto;
  padding:12px 0;
  scrollbar-width:none;
}
.sb-nav::-webkit-scrollbar{display:none}

.nav-item{
  display:flex;align-items:center;gap:10px;
  padding:9px 20px;
  color:var(--white-50);
  text-decoration:none;
  font-size:14px;font-weight:500;
  letter-spacing:-.14px;
  line-height:120%;
  transition:color .15s,background .15s;
  border-left:2px solid transparent;
}
.nav-item:hover{color:rgba(255,255,255,.8);background:var(--white-5)}
.nav-item.active{color:var(--accent);border-left-color:var(--accent);background:var(--white-5)}
.nav-num{
  font-family:'DM Mono',monospace;font-size:10px;
  min-width:18px;opacity:.6;
}
.nav-item.active .nav-num{opacity:1;color:var(--accent)}

.nav-sub-group{display:none;padding:2px 0}
.nav-sub-group.visible{display:block}
.nav-sub-item{
  display:block;
  padding:5px 20px 5px 52px;
  color:rgba(255,255,255,.3);
  text-decoration:none;
  font-size:14px;font-weight:400;
  letter-spacing:-.14px;
  transition:color .15s;
}
.nav-sub-item:hover{color:rgba(255,255,255,.6)}
.nav-sub-item.active{color:var(--accent)}

.sb-foot{
  padding:16px 20px;
  border-top:1px solid var(--white-15);
}
.sb-foot a{
  display:block;padding:5px 0;
  color:var(--white-50);text-decoration:none;
  font-size:14px;font-weight:500;
  letter-spacing:-.14px;
  transition:color .15s;
}
.sb-foot a:hover{color:var(--accent)}
.sb-cta{
  display:inline-block;margin-top:12px;
  padding:8px 18px;
  background:var(--accent);color:var(--black);
  border-radius:100px;
  font-size:10px;font-weight:600;
  letter-spacing:.4px;text-transform:uppercase;
  text-decoration:none;
  transition:opacity .15s;
}
.sb-cta:hover{opacity:.85}

/* ─── Main ─── */
.main{flex:1;margin-left:var(--sidebar-w)}

.section{
  padding:80px 60px 100px;
  border-bottom:1px solid var(--border);
}
.section:last-child{border-bottom:none}
.sec-inner{max-width:780px}

/* ─── Section header — matches Cipherly pattern ─── */
.sec-num{
  font-family:'DM Mono',monospace;
  font-size:42px;font-weight:600;
  color:var(--accent);
  letter-spacing:-.56px;
  line-height:104%;
  margin-bottom:4px;
  opacity:.25;
}
.sec-title{
  font-size:42px;font-weight:600;
  letter-spacing:-.56px;
  line-height:104%;
  margin-bottom:20px;
}
.sec-intro{
  font-size:18px;font-weight:400;
  line-height:128%;
  color:var(--gray);
  letter-spacing:-.16px;
  max-width:620px;
  margin-bottom:60px;
}

/* ─── Content headings ─── */
h3.sub-head{
  font-size:10px;font-weight:600;
  letter-spacing:.4px;text-transform:uppercase;
  color:var(--gray);
  margin:56px 0 20px;
  padding-bottom:12px;
  border-bottom:1px solid var(--border);
}
h3.sub-head:first-of-type{margin-top:0}

/* ─── Info blocks (cards) ─── */
.info-block{
  background:var(--surface);
  border-radius:10px;
  padding:24px 28px;
  margin-bottom:12px;
}
.info-block h4{
  font-size:14px;font-weight:600;
  letter-spacing:-.14px;margin-bottom:6px;
}
.info-block p{
  font-size:16px;font-weight:400;
  color:var(--gray);line-height:128%;
  letter-spacing:-.16px;
}
.info-block p:last-child{margin-bottom:0}

/* ─── Color swatches ─── */
.swatch-grid{
  display:grid;
  grid-template-columns:repeat(auto-fill,minmax(200px,1fr));
  gap:16px;
}
.swatch-card{
  border-radius:10px;overflow:hidden;
  border:1px solid var(--border);
}
.swatch-color{
  height:120px;display:flex;align-items:flex-end;padding:14px;
}
.swatch-color span{
  font-family:'DM Mono',monospace;font-size:12px;opacity:.8;
}
.swatch-meta{
  padding:14px;background:var(--white);
}
.swatch-meta strong{
  display:block;font-size:14px;font-weight:600;
  letter-spacing:-.14px;margin-bottom:2px;
}
.swatch-meta span{font-size:12px;color:var(--gray);line-height:140%}

/* ─── Type specimens ─── */
.type-spec{
  background:var(--surface);border-radius:10px;
  padding:40px;margin-bottom:16px;
}
.type-spec .label{
  font-size:10px;font-weight:600;
  letter-spacing:.4px;text-transform:uppercase;
  color:var(--gray);margin-bottom:14px;
}
.type-spec .sample-lg{
  font-size:48px;font-weight:700;
  letter-spacing:-.56px;line-height:104%;
}
.type-spec .sample-body{
  font-size:18px;font-weight:400;
  line-height:128%;letter-spacing:-.16px;
  max-width:520px;
}

/* ─── Tables ─── */
table{width:100%;border-collapse:collapse}
th,td{
  text-align:left;padding:12px 14px;
  border-bottom:1px solid var(--border);
  font-size:14px;font-weight:500;
  letter-spacing:-.14px;
}
th{
  font-size:10px;font-weight:600;
  letter-spacing:.4px;text-transform:uppercase;
  color:var(--gray);
}
code{
  font-family:'DM Mono',monospace;font-size:12px;
  background:var(--surface);padding:2px 6px;border-radius:4px;
}

/* ─── Buttons ─── */
.btn-row{display:flex;gap:12px;flex-wrap:wrap;align-items:center}
.btn{
  font-family:'Red Hat Display',sans-serif;
  font-size:10px;font-weight:600;
  letter-spacing:.4px;text-transform:uppercase;
  padding:12px 24px;border-radius:100px;
  border:none;cursor:pointer;transition:all .15s;
}
.btn-p{background:var(--black);color:var(--white)}
.btn-p:hover{opacity:.85}
.btn-a{background:var(--accent);color:var(--black)}
.btn-a:hover{opacity:.85}
.btn-g{background:transparent;color:var(--black);border:1.5px solid var(--black)}
.btn-g:hover{background:var(--surface)}
.btn-note{
  margin-top:14px;font-family:'DM Mono',monospace;
  font-size:12px;color:var(--gray);
}

/* ─── Cards ─── */
.card-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px}
.demo-card{
  background:var(--surface);border-radius:9px;padding:24px;
  box-shadow:rgba(0,0,0,.18) .3px .6px .67px -1.25px inset,
    rgba(0,0,0,.16) 1.14px 2.29px 2.56px -2.5px inset,
    rgba(0,0,0,.063) 5px 10px 11.18px -3.75px inset;
}
.demo-card h4{font-size:14px;font-weight:600;margin-bottom:6px;letter-spacing:-.14px}
.demo-card p{font-size:14px;color:var(--gray);line-height:128%}
.demo-card.portfolio{border-radius:20px}

/* ─── Tags ─── */
.tag{
  display:inline-block;background:var(--surface);
  color:var(--black);border-radius:100px;
  padding:5px 14px;font-size:12px;font-weight:500;
  margin:3px;letter-spacing:-.14px;
}

/* ─── Spacing bars ─── */
.sp-row{display:flex;align-items:center;gap:14px;margin-bottom:6px}
.sp-bar{height:20px;background:var(--accent);border-radius:4px;min-width:4px}
.sp-row code{font-size:12px;color:var(--gray);min-width:50px}

/* ─── Radii ─── */
.rad-grid{display:flex;gap:20px;flex-wrap:wrap}
.rad-item{text-align:center}
.rad-box{
  width:72px;height:72px;
  background:var(--surface);border:1.5px solid var(--border2);
  margin-bottom:6px;
}
.rad-item strong{display:block;font-size:12px}
.rad-item code{display:block;font-size:11px;background:none;padding:0}

/* ─── Guidelines ─── */
.gl-split{display:grid;grid-template-columns:1fr 1fr;gap:40px}
.gl-title{
  font-size:14px;font-weight:600;letter-spacing:-.14px;
  margin-bottom:14px;
}
.gl-do{color:#2a9d2a}
.gl-dont{color:#d32f2f}
.gl-split ul{list-style:none}
.gl-split li{
  padding:10px 0 10px 24px;position:relative;
  font-size:14px;line-height:128%;letter-spacing:-.14px;
  border-bottom:1px solid var(--border);
}
.gl-split li:last-child{border-bottom:none}
.do-list li::before{content:"\\2713";position:absolute;left:0;color:#2a9d2a;font-weight:700}
.dont-list li::before{content:"\\2717";position:absolute;left:0;color:#d32f2f;font-weight:700}

/* ─── Tone bars ─── */
.tone-row{display:flex;align-items:center;gap:14px;margin-bottom:10px}
.tone-name{font-size:14px;font-weight:500;width:80px;text-transform:capitalize;letter-spacing:-.14px}
.tone-track{flex:1;height:5px;background:var(--surface);border-radius:100px}
.tone-bar{height:100%;background:var(--accent);border-radius:100px}
.tone-val{font-family:'DM Mono',monospace;font-size:11px;color:var(--gray);width:35px;text-align:right}

/* ─── Principles grid ─── */
.pr-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}

/* ─── Mobile ─── */
.mob-btn{
  display:none;position:fixed;top:14px;left:14px;z-index:200;
  width:40px;height:40px;background:var(--black);color:var(--white);
  border:none;border-radius:10px;font-size:18px;cursor:pointer;
  align-items:center;justify-content:center;
}
.mob-overlay{display:none;position:fixed;inset:0;background:rgba(0,0,0,.45);z-index:99}

@media(max-width:1023px){
  .mob-btn{display:flex}
  .sidebar{transform:translateX(-100%);transition:transform .25s ease}
  .sidebar.open{transform:translateX(0)}
  .mob-overlay.open{display:block}
  .main{margin-left:0}
  .section{padding:56px 28px 72px}
  .sec-num,.sec-title{font-size:36px}
  .type-spec .sample-lg{font-size:36px}
  .type-spec{padding:28px}
  .card-grid,.gl-split,.pr-grid{grid-template-columns:1fr}
  .swatch-grid{grid-template-columns:1fr 1fr}
}
@media(max-width:480px){
  .swatch-grid{grid-template-columns:1fr}
  .section{padding:40px 20px 60px}
}
</style>
</head>
<body>

<button class="mob-btn" onclick="tog()" aria-label="Menu">&#9776;</button>
<div class="mob-overlay" onclick="tog()"></div>

<div class="wrap">
<aside class="sidebar">
  <div class="sb-head">
    <div class="sb-logo">${b.meta.name}</div>
    <div class="sb-label">Brand Guidelines</div>
  </div>
  <nav class="sb-nav">${sidebarNav}</nav>
  <div class="sb-foot">
    <a href="${b.meta.url}" target="_blank">Go to Website &rarr;</a>
    <a class="sb-cta" href="mailto:hello@toldwell.com">Connect With Us</a>
  </div>
</aside>

<main class="main">

<!-- 01 Introduction -->
<div class="section" id="introduction">
<div class="sec-inner">
  <div class="sec-num">01</div>
  <h1 class="sec-title">Introduction</h1>
  <p class="sec-intro">${b.meta.description} ${b.atmosphere.philosophy}</p>
  <h3 class="sub-head">Atmosphere</h3>
  <div class="info-block"><h4>Mood</h4><p>${b.atmosphere.mood}</p></div>
  <div class="info-block"><h4>Shape Language</h4><p>${b.atmosphere.shape_language}</p></div>
  <div class="info-block"><h4>Depth</h4><p>${b.atmosphere.depth}</p></div>
</div></div>

<!-- 02 Strategy -->
<div class="section" id="strategy">
<div class="sec-inner">
  <div class="sec-num">02</div>
  <h1 class="sec-title">Strategy</h1>
  <p class="sec-intro">${b.narrative.what_we_are}</p>
  <h3 class="sub-head">Brand Narrative</h3>
  <div class="info-block"><h4>What We Are</h4><p>${b.narrative.what_we_are}</p></div>
  <div class="info-block"><h4>What We Reject</h4><p>${b.narrative.what_we_reject}</p></div>
  <div class="info-block"><h4>Core Belief</h4><p>${b.narrative.belief}</p></div>
</div></div>

<!-- 03 Color -->
<div class="section" id="colors">
<div class="sec-inner">
  <div class="sec-num">03</div>
  <h1 class="sec-title">Color</h1>
  <p class="sec-intro">Our palette is intentionally restrained — warm dark tones anchored by a distinctive gold accent that carries the warmth of storytelling through every touchpoint.</p>
  <h3 class="sub-head" id="color-palette">Palette</h3>
  <div class="swatch-grid">${swatches}</div>
  <h3 class="sub-head" id="color-usage">Usage</h3>
  <div class="info-block"><h4>Text Selection</h4><p>Selection uses <code>${c.selection.text}</code> on <code>${c.selection.background}</code>, reinforcing the brand in micro-interactions.</p></div>
</div></div>

<!-- 04 Typography -->
<div class="section" id="typography">
<div class="sec-inner">
  <div class="sec-num">04</div>
  <h1 class="sec-title">Typography</h1>
  <p class="sec-intro">Two fonts define Toldwell. Belwe brings warmth and character to display text. Red Hat Display handles everything else with clean precision.</p>
  <h3 class="sub-head" id="type-fonts">Fonts</h3>
  ${Object.entries(b.typography.fonts).map(([role, f]) => `
  <div class="type-spec">
    <div class="label">${role.toUpperCase()} — ${f.family}</div>
    <div class="${role === 'display' ? 'sample-lg' : 'sample-body'}">${role === 'display' ? 'Films That Stick' : 'We create videos for companies and individuals seeking a good story. Every frame is crafted with intention, every cut serves the narrative.'}</div>
  </div>`).join('\n')}
  <h3 class="sub-head" id="type-scale">Type Scale</h3>
  <table><thead><tr><th>Token</th><th>Size</th><th>Font</th><th>Use</th></tr></thead><tbody>${typeRows}</tbody></table>
  <h3 class="sub-head" id="type-spacing">Letter Spacing</h3>
  <table><thead><tr><th>Token</th><th>Value</th></tr></thead><tbody>${lsRows}</tbody></table>
</div></div>

<!-- 05 Components -->
<div class="section" id="components">
<div class="sec-inner">
  <div class="sec-num">05</div>
  <h1 class="sec-title">Components</h1>
  <p class="sec-intro">Core UI components that maintain brand consistency. Pill-shaped buttons, inset-shadow cards, and clean tags.</p>
  <h3 class="sub-head" id="comp-buttons">Buttons</h3>
  <div class="btn-row">
    <button class="btn btn-p">Primary</button>
    <button class="btn btn-a">Accent</button>
    <button class="btn btn-g">Ghost</button>
  </div>
  <div class="btn-note">radius: 100px &middot; padding: 12px 24px &middot; weight: 600 &middot; uppercase</div>
  <h3 class="sub-head" id="comp-cards">Cards</h3>
  <div class="card-grid">
    <div class="demo-card"><h4>Default Card</h4><p>Light gray surface with inset shadow. Pressed-in, not floating. 9px radius.</p></div>
    <div class="demo-card portfolio"><h4>Portfolio Card</h4><p>Larger 20px radius with overflow hidden for media content.</p></div>
  </div>
  <h3 class="sub-head" id="comp-tags">Tags</h3>
  <div><span class="tag">Video Production</span><span class="tag">Brand Film</span><span class="tag">Documentary</span><span class="tag">Motion Graphics</span><span class="tag">Commercial</span></div>
</div></div>

<!-- 06 Layout -->
<div class="section" id="layout">
<div class="sec-inner">
  <div class="sec-num">06</div>
  <h1 class="sec-title">Layout</h1>
  <p class="sec-intro">A spacing system built on a 5px base unit with generous whitespace. Maximum content width of ${b.layout.max_width}.</p>
  <h3 class="sub-head" id="layout-spacing">Spacing Scale</h3>
  ${spacingBars}
  <h3 class="sub-head" id="layout-radii">Border Radii</h3>
  <div class="rad-grid">${radiiDemos}</div>
</div></div>

<!-- 07 Guidelines -->
<div class="section" id="guidelines">
<div class="sec-inner">
  <div class="sec-num">07</div>
  <h1 class="sec-title">Guidelines</h1>
  <p class="sec-intro">Rules that keep the brand consistent. When in doubt, reference these guardrails.</p>
  <div class="gl-split">
    <div><h4 class="gl-title gl-do">Do</h4><ul class="do-list">${doItems}</ul></div>
    <div><h4 class="gl-title gl-dont">Don't</h4><ul class="dont-list">${dontItems}</ul></div>
  </div>
</div></div>

<!-- 08 Voice -->
<div class="section" id="voice">
<div class="sec-inner">
  <div class="sec-num">08</div>
  <h1 class="sec-title">Voice & Narrative</h1>
  <p class="sec-intro">${b.voice.personality.join(' &middot; ')} — the personality that shapes every word.</p>
  <h3 class="sub-head" id="voice-tone">Tone Spectrum</h3>
  ${tones}
  <div style="margin-top:24px">
    <div class="info-block"><h4>CTA Style</h4><p>${b.voice.microcopy.cta_style}</p></div>
    <div class="info-block"><h4>Avoid</h4><p>${b.voice.avoid.join(' &middot; ')}</p></div>
  </div>
  <h3 class="sub-head" id="voice-narrative">Narrative</h3>
  <div class="info-block"><h4>What We Are</h4><p>${b.narrative.what_we_are}</p></div>
  <div class="info-block"><h4>What We Reject</h4><p>${b.narrative.what_we_reject}</p></div>
  <div class="info-block"><h4>Core Belief</h4><p>${b.narrative.belief}</p></div>
  <h3 class="sub-head" id="voice-principles">Principles</h3>
  <div class="pr-grid">${principles}</div>
</div></div>

</main>
</div>

<script>
function tog(){
  document.querySelector('.sidebar').classList.toggle('open');
  document.querySelector('.mob-overlay').classList.toggle('open');
}
const NL=document.querySelectorAll('.nav-item');
const NS=document.querySelectorAll('.nav-sub-item');
const SG=document.querySelectorAll('.nav-sub-group');
const SE=document.querySelectorAll('.section');
function upd(){
  let cur='';const y=window.scrollY+100;
  SE.forEach(s=>{if(s.offsetTop<=y)cur=s.id});
  NL.forEach(l=>{l.classList.toggle('active',l.dataset.section===cur)});
  SG.forEach(g=>{g.classList.toggle('visible',g.dataset.parent===cur)});
  let anc='';
  document.querySelectorAll('[id]').forEach(e=>{if(e.offsetTop<=y)anc=e.id});
  NS.forEach(s=>{s.classList.toggle('active',s.getAttribute('href')==='#'+anc)});
}
window.addEventListener('scroll',upd,{passive:true});
upd();
document.querySelectorAll('.sidebar a').forEach(a=>{
  a.addEventListener('click',()=>{if(window.innerWidth<=1023)tog()});
});
</script>
</body>
</html>`;

  fs.writeFileSync(path.join(DOCS_DIR, 'index.html'), html);
}

// ─── Main ──────────────────────────────────────────────────────────────────────

function main() {
  console.log('Loading brand.yaml...');
  const brand = loadBrand();

  console.log('Generating DESIGN.md...');
  fs.writeFileSync(DESIGN_MD_FILE, generateDesignMd(brand));
  console.log('  -> ' + DESIGN_MD_FILE);

  console.log('Generating docs/ site...');
  generateSite(brand);
  console.log('  -> ' + path.join(DOCS_DIR, 'index.html'));

  console.log('Done.');
}

main();
