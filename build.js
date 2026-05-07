#!/usr/bin/env node
/**
 * Toldwell Brand Build Pipeline
 *
 *   brand.yaml ──┬──>  DESIGN.md           (root — for LLMs / GitHub viewing)
 *                ├──>  tokens.css           (CSS custom properties)
 *                ├──>  tailwind.css         (Tailwind v4 @theme block)
 *                ├──>  tokens.json          (W3C Design Tokens spec)
 *                └──>  site/template/* → site/docs/*   (Cipherly rip with token injection)
 *
 * Edit brand.yaml. Run `npm run build`. Both design files and site update.
 *
 * Usage:
 *   node build.js
 */

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const ROOT = __dirname;
const BRAND_FILE = path.join(ROOT, 'brand.yaml');
const DESIGN_MD = path.join(ROOT, 'DESIGN.md');
const TOKENS_CSS = path.join(ROOT, 'tokens.css');
const TAILWIND_CSS = path.join(ROOT, 'tailwind.css');
const TOKENS_JSON = path.join(ROOT, 'tokens.json');
const OVERRIDES_CSS = path.join(ROOT, 'site-overrides.css');
const SITE_DIR = path.join(ROOT, 'site');
const TEMPLATE_DIR = path.join(SITE_DIR, 'template');
const DOCS_DIR = path.join(ROOT, 'docs');

// ─── Helpers ──────────────────────────────────────────────────────────────────

function loadBrand() {
  return yaml.load(fs.readFileSync(BRAND_FILE, 'utf8'));
}

function slugify(s) {
  return String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}

function rmDirContents(dir, except = []) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir)) {
    if (except.includes(entry)) continue;
    const full = path.join(dir, entry);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      fs.rmSync(full, { recursive: true, force: true });
    } else {
      fs.unlinkSync(full);
    }
  }
}

function copyDir(src, dst, transform = null) {
  ensureDir(dst);
  for (const entry of fs.readdirSync(src)) {
    const sp = path.join(src, entry);
    const dp = path.join(dst, entry);
    const stat = fs.statSync(sp);
    if (stat.isDirectory()) {
      copyDir(sp, dp, transform);
    } else if (transform) {
      const out = transform(sp, fs.readFileSync(sp));
      fs.writeFileSync(dp, out);
    } else {
      fs.copyFileSync(sp, dp);
    }
  }
}

// ─── Token flattening ─────────────────────────────────────────────────────────
// Walks the brand.yaml structure and produces flat key→value pairs for emit.

function flattenTokens(brand) {
  const tokens = {
    colors: {},
    surfaces: {},
    typography: { fonts: {}, scale: [], weights: {}, letter_spacing: {} },
    spacing: {},
    radii: {},
    named_radii: {},
    shadows: {},
    breakpoints: {},
  };

  // Colors: brand / accent / neutrals / semantic
  for (const group of ['brand', 'accent', 'neutrals', 'semantic']) {
    if (!brand.colors[group]) continue;
    for (const [name, def] of Object.entries(brand.colors[group])) {
      tokens.colors[`${group}-${name}`] = { hex: def.hex, role: def.role, group, name };
    }
  }
  if (brand.colors.selection) {
    tokens.colors['selection-text'] = { hex: brand.colors.selection.text, role: 'Text selection foreground', group: 'selection', name: 'text' };
    tokens.colors['selection-background'] = { hex: brand.colors.selection.background, role: 'Text selection background', group: 'selection', name: 'background' };
  }

  // Surfaces
  for (const [name, def] of Object.entries(brand.surfaces || {})) {
    tokens.surfaces[name] = { value: def.value, role: def.role };
  }

  // Typography
  tokens.typography.fonts = brand.typography.fonts;
  tokens.typography.scale = brand.typography.scale;
  tokens.typography.weights = brand.typography.weights || {};
  tokens.typography.letter_spacing = brand.typography.letter_spacing || {};
  tokens.typography.ratio = brand.typography.ratio || {};

  // Spacing
  tokens.spacing = brand.layout.spacing || {};
  tokens.semantic_spacing = brand.layout.semantic_spacing || {};

  // Radii
  tokens.radii = brand.layout.radii || {};
  tokens.named_radii = brand.layout.named_radii || {};

  // Shadows
  tokens.shadows = brand.depth.shadows || {};

  // Breakpoints
  tokens.breakpoints = brand.responsive.breakpoints || {};

  return tokens;
}

// ─── Emit: DESIGN.md ──────────────────────────────────────────────────────────

function emitDesignMd(brand) {
  const t = flattenTokens(brand);

  const lines = [];
  const p = (s = '') => lines.push(s);

  p(`# DESIGN.md — ${brand.meta.name}`);
  p('');
  p(`> ${brand.meta.tagline}`);
  p(`>`);
  p(`> ${brand.meta.description}`);
  p(`>`);
  p(`> Generated from \`brand.yaml\` — do not edit directly.`);
  p('');
  p('---');
  p('');

  // 1. Atmosphere
  p('## 1. Visual Theme & Atmosphere');
  p('');
  p(`**Mood:** ${brand.atmosphere.mood}`);
  p('');
  p(`**Density:** ${brand.atmosphere.density}`);
  p('');
  p(`**Shape language:** ${brand.atmosphere.shape_language}`);
  p('');
  p(`**Depth:** ${brand.atmosphere.depth}`);
  p('');
  p(`**Philosophy:** ${brand.atmosphere.philosophy}`);
  p('');
  if (brand.atmosphere.one_liner) {
    p(`**One-liner:** ${brand.atmosphere.one_liner}`);
    p('');
  }

  // 2. Colors — grouped
  p('## 2. Color Palette');
  p('');
  for (const group of ['brand', 'accent', 'neutrals', 'semantic']) {
    if (!brand.colors[group]) continue;
    const label = group[0].toUpperCase() + group.slice(1);
    p(`### ${label}`);
    p('');
    p('| Token | Hex | Role |');
    p('|-------|-----|------|');
    for (const [name, def] of Object.entries(brand.colors[group])) {
      p(`| \`${group}.${name}\` | \`${def.hex}\` | ${def.role} |`);
    }
    p('');
  }
  if (brand.colors.selection) {
    p(`**Text selection:** \`${brand.colors.selection.text}\` on \`${brand.colors.selection.background}\``);
    p('');
  }

  // 2a. Surfaces
  if (brand.surfaces) {
    p('## 2a. Surfaces');
    p('');
    p('Semantic surface tokens — name describes role, not appearance.');
    p('');
    p('| Token | Value | Role |');
    p('|-------|-------|------|');
    for (const [name, def] of Object.entries(brand.surfaces)) {
      p(`| \`surface.${name}\` | \`${def.value}\` | ${def.role} |`);
    }
    p('');
  }

  // 3. Typography
  p('## 3. Typography');
  p('');
  p('### Font Families');
  p('');
  for (const [role, f] of Object.entries(brand.typography.fonts)) {
    const w = f.weights ? f.weights.join(', ') : (f.variants ? f.variants.join(', ') : '');
    p(`- **${f.family}** (${role}) — ${w}`);
    p(`  ${f.role}`);
  }
  p('');

  if (brand.typography.ratio) {
    p('### Type Scale Ratio');
    p('');
    if (brand.typography.ratio.body) p(`- **Body:** ${brand.typography.ratio.body}`);
    if (brand.typography.ratio.display) p(`- **Display:** ${brand.typography.ratio.display}`);
    p('');
  }

  p('### Type Scale');
  p('');
  p('| Token | Size | Line Height | Weight | Font | Use |');
  p('|-------|------|-------------|--------|------|-----|');
  for (const s of brand.typography.scale) {
    p(`| \`${s.name}\` | ${s.size}px | ${s.line_height} | ${s.weight} | ${s.font} | ${s.use} |`);
  }
  p('');

  if (brand.typography.weights && Object.keys(brand.typography.weights).length) {
    p('### Weights');
    p('');
    p('| Token | Value |');
    p('|-------|-------|');
    for (const [k, v] of Object.entries(brand.typography.weights)) {
      p(`| \`weight.${k}\` | ${v} |`);
    }
    p('');
  }

  if (brand.typography.letter_spacing && Object.keys(brand.typography.letter_spacing).length) {
    p('### Letter Spacing');
    p('');
    p('| Token | Value |');
    p('|-------|-------|');
    for (const [k, v] of Object.entries(brand.typography.letter_spacing)) {
      p(`| \`tracking.${k}\` | \`${v}\` |`);
    }
    p('');
  }

  // 4. Components
  p('## 4. Components');
  p('');
  const c = brand.components;
  p('### Buttons');
  p('');
  for (const [variant, def] of Object.entries(c.buttons)) {
    p(`**${variant}:**`);
    for (const [k, v] of Object.entries(def)) {
      if (k === 'hover') {
        p(`- hover.background: \`${def.hover.background}\``);
      } else {
        p(`- ${k}: \`${v}\``);
      }
    }
    p('');
  }
  p('### Cards');
  p('');
  for (const [variant, def] of Object.entries(c.cards)) {
    p(`**${variant}:**`);
    for (const [k, v] of Object.entries(def)) {
      p(`- ${k}: \`${v}\``);
    }
    p('');
  }
  p('### Tags');
  p('');
  for (const [k, v] of Object.entries(c.tags)) {
    p(`- ${k}: \`${v}\``);
  }
  p('');

  // 5. Layout
  p('## 5. Layout');
  p('');
  p(`**Base unit:** ${brand.layout.base_unit}px`);
  p('');
  p(`**Max width:** ${brand.layout.max_width}px`);
  p('');
  p(`**Density:** ${brand.layout.density}`);
  p('');
  p('### Spacing Scale');
  p('');
  p('| Token | Value |');
  p('|-------|-------|');
  for (const [k, v] of Object.entries(brand.layout.spacing)) {
    p(`| \`spacing.${k}\` | ${v}px |`);
  }
  p('');
  if (brand.layout.semantic_spacing) {
    p('### Semantic Spacing');
    p('');
    p('| Purpose | Value |');
    p('|---------|-------|');
    for (const [k, v] of Object.entries(brand.layout.semantic_spacing)) {
      p(`| ${k.replace(/_/g, ' ')} | ${v}px |`);
    }
    p('');
  }
  p('### Border Radii');
  p('');
  p('| Token | Value |');
  p('|-------|-------|');
  for (const [k, v] of Object.entries(brand.layout.radii)) {
    p(`| \`radius.${k}\` | ${v}px |`);
  }
  p('');
  if (brand.layout.named_radii) {
    p('### Named Radii (per component)');
    p('');
    p('| Component | Radius |');
    p('|-----------|--------|');
    for (const [k, v] of Object.entries(brand.layout.named_radii)) {
      p(`| \`radius.${k}\` | ${v}px |`);
    }
    p('');
  }

  // 6. Depth
  p('## 6. Depth & Elevation');
  p('');
  p('### Shadows');
  p('');
  p('| Token | Value |');
  p('|-------|-------|');
  for (const [k, v] of Object.entries(brand.depth.shadows)) {
    p(`| \`shadow.${k}\` | \`${v}\` |`);
  }
  p('');
  if (brand.depth.notes) p(`> ${brand.depth.notes}`);
  p('');

  // 7. Guidelines
  p(`## 7. Do's and Don'ts`);
  p('');
  p('### Do');
  p('');
  for (const item of brand.guidelines.do) p(`- ${item}`);
  p('');
  p(`### Don't`);
  p('');
  for (const item of brand.guidelines.dont) p(`- ${item}`);
  p('');

  // 8. Responsive
  p('## 8. Responsive Behavior');
  p('');
  p('| Breakpoint | Width |');
  p('|------------|-------|');
  for (const [k, v] of Object.entries(brand.responsive.breakpoints)) {
    p(`| ${k} | ${v}px |`);
  }
  p('');
  if (brand.responsive.notes) {
    p(`> ${brand.responsive.notes}`);
    p('');
  }

  // 9. Agent guide
  p('## 9. Agent Quick Reference');
  p('');
  p('| Token | Value |');
  p('|-------|-------|');
  for (const [k, v] of Object.entries(brand.agent.quick_reference)) {
    p(`| ${k} | \`${v}\` |`);
  }
  p('');
  p('### Ready-to-Use Prompts');
  p('');
  for (const prompt of brand.agent.prompts) p(`- ${prompt}`);
  p('');

  // 10. Voice
  p('## 10. Voice & Tone');
  p('');
  p(`**Personality:** ${brand.voice.personality.join(', ')}`);
  p('');
  const ts = brand.voice.tone_spectrum;
  p(`**Tone spectrum:** Formal ${ts.formal}/10 · Playful ${ts.playful}/10 · Technical ${ts.technical}/10 · Emotional ${ts.emotional}/10`);
  p('');
  p(`**CTA style:** ${brand.voice.microcopy.cta_style}`);
  p('');
  p(`**Error style:** ${brand.voice.microcopy.error_style}`);
  p('');
  p(`**Avoid:** ${brand.voice.avoid.join(', ')}`);
  p('');

  // 11. Narrative
  p('## 11. Brand Narrative');
  p('');
  p(`**What we are:** ${brand.narrative.what_we_are}`);
  p('');
  p(`**What we reject:** ${brand.narrative.what_we_reject}`);
  p('');
  p(`**Core belief:** ${brand.narrative.belief}`);
  p('');

  // 12. Principles
  p('## 12. Principles');
  p('');
  for (const pr of brand.principles) {
    p(`- **${pr.name}:** ${pr.description}`);
  }
  p('');

  p('---');
  p('');
  p('*Generated from `brand.yaml` by `build.js`. Edit the yaml, not this file.*');
  p('');

  return lines.join('\n');
}

// ─── Emit: tokens.css ─────────────────────────────────────────────────────────

function emitTokensCss(brand) {
  const lines = [];
  const p = (s = '') => lines.push(s);

  p('/**');
  p(` * tokens.css — ${brand.meta.name} design tokens`);
  p(' * CSS custom properties. Drop-in for any framework.');
  p(' * Generated from brand.yaml — do not edit directly.');
  p(' */');
  p('');
  p(':root {');

  // Colors
  p('  /* ─── Colors ───────────────────────────────────────────────────────── */');
  for (const group of ['brand', 'accent', 'neutrals', 'semantic']) {
    if (!brand.colors[group]) continue;
    p(`  /* ${group} */`);
    for (const [name, def] of Object.entries(brand.colors[group])) {
      p(`  --color-${group}-${name}: ${def.hex};`);
    }
  }
  p('');

  // Surfaces
  if (brand.surfaces) {
    p('  /* ─── Surfaces ─────────────────────────────────────────────────────── */');
    for (const [name, def] of Object.entries(brand.surfaces)) {
      p(`  --surface-${name}: ${def.value};`);
    }
    p('');
  }

  // Typography — fonts
  p('  /* ─── Typography ───────────────────────────────────────────────────── */');
  for (const [role, f] of Object.entries(brand.typography.fonts)) {
    const fallback = role === 'display' ? "'Georgia', serif" : "'Helvetica Neue', system-ui, sans-serif";
    p(`  --font-${role}: '${f.family}', ${fallback};`);
  }
  p('');

  // Type scale
  for (const s of brand.typography.scale) {
    p(`  --text-${s.name}: ${s.size}px;`);
    p(`  --leading-${s.name}: ${s.line_height};`);
    p(`  --weight-${s.name}: ${s.weight};`);
  }
  p('');

  // Weights
  if (brand.typography.weights) {
    for (const [k, v] of Object.entries(brand.typography.weights)) {
      p(`  --weight-${k}: ${v};`);
    }
    p('');
  }

  // Letter spacing
  if (brand.typography.letter_spacing) {
    for (const [k, v] of Object.entries(brand.typography.letter_spacing)) {
      p(`  --tracking-${k}: ${v};`);
    }
    p('');
  }

  // Spacing
  p('  /* ─── Spacing ──────────────────────────────────────────────────────── */');
  for (const [k, v] of Object.entries(brand.layout.spacing)) {
    p(`  --spacing-${k}: ${v}px;`);
  }
  p('');
  if (brand.layout.semantic_spacing) {
    for (const [k, v] of Object.entries(brand.layout.semantic_spacing)) {
      p(`  --${k.replace(/_/g, '-')}: ${v}px;`);
    }
    p('');
  }

  // Radii
  p('  /* ─── Radii ────────────────────────────────────────────────────────── */');
  for (const [k, v] of Object.entries(brand.layout.radii)) {
    p(`  --radius-${k}: ${v === 0 ? '0' : v + 'px'};`);
  }
  if (brand.layout.named_radii) {
    p('');
    for (const [k, v] of Object.entries(brand.layout.named_radii)) {
      p(`  --radius-${k}: ${v}px;`);
    }
  }
  p('');

  // Shadows
  p('  /* ─── Shadows ──────────────────────────────────────────────────────── */');
  for (const [k, v] of Object.entries(brand.depth.shadows)) {
    p(`  --shadow-${k}: ${v};`);
  }
  p('');

  // Breakpoints (for use in container queries / JS)
  p('  /* ─── Breakpoints ──────────────────────────────────────────────────── */');
  for (const [k, v] of Object.entries(brand.responsive.breakpoints)) {
    p(`  --breakpoint-${k}: ${v}px;`);
  }
  p('');

  // Layout
  p('  /* ─── Layout ───────────────────────────────────────────────────────── */');
  p(`  --max-width: ${brand.layout.max_width}px;`);
  p(`  --base-unit: ${brand.layout.base_unit}px;`);

  p('}');
  p('');

  // Selection
  if (brand.colors.selection) {
    p(`::selection { color: ${brand.colors.selection.text}; background: ${brand.colors.selection.background}; }`);
    p('');
  }

  return lines.join('\n');
}

// ─── Emit: tailwind.css (Tailwind v4 @theme) ──────────────────────────────────

function emitTailwindCss(brand) {
  const lines = [];
  const p = (s = '') => lines.push(s);

  p('/**');
  p(` * tailwind.css — ${brand.meta.name} Tailwind v4 theme`);
  p(' * Drop into your Tailwind v4 project as the theme block.');
  p(' * Generated from brand.yaml — do not edit directly.');
  p(' */');
  p('');
  p('@theme {');

  // Colors
  p('  /* Colors */');
  for (const group of ['brand', 'accent', 'neutrals', 'semantic']) {
    if (!brand.colors[group]) continue;
    for (const [name, def] of Object.entries(brand.colors[group])) {
      p(`  --color-${group}-${name}: ${def.hex};`);
    }
  }
  p('');

  // Surfaces (also as colors so utilities like bg-surface-card work)
  if (brand.surfaces) {
    p('  /* Surfaces */');
    for (const [name, def] of Object.entries(brand.surfaces)) {
      p(`  --color-surface-${name}: ${def.value};`);
    }
    p('');
  }

  // Fonts
  p('  /* Typography — Fonts */');
  for (const [role, f] of Object.entries(brand.typography.fonts)) {
    const fallback = role === 'display' ? "'Georgia', serif" : "'Helvetica Neue', system-ui, sans-serif";
    p(`  --font-${role}: '${f.family}', ${fallback};`);
  }
  p('');

  // Type scale
  p('  /* Typography — Scale */');
  for (const s of brand.typography.scale) {
    p(`  --text-${s.name}: ${s.size}px;`);
    p(`  --leading-${s.name}: ${s.line_height};`);
  }
  p('');

  // Weights
  if (brand.typography.weights) {
    p('  /* Typography — Weights */');
    for (const [k, v] of Object.entries(brand.typography.weights)) {
      p(`  --font-weight-${k}: ${v};`);
    }
    p('');
  }

  // Tracking
  if (brand.typography.letter_spacing) {
    p('  /* Typography — Tracking */');
    for (const [k, v] of Object.entries(brand.typography.letter_spacing)) {
      p(`  --tracking-${k}: ${v};`);
    }
    p('');
  }

  // Spacing
  p('  /* Spacing */');
  for (const [k, v] of Object.entries(brand.layout.spacing)) {
    p(`  --spacing-${k}: ${v}px;`);
  }
  p('');

  // Radii
  p('  /* Border Radius */');
  for (const [k, v] of Object.entries(brand.layout.radii)) {
    p(`  --radius-${k}: ${v === 0 ? '0' : v + 'px'};`);
  }
  if (brand.layout.named_radii) {
    for (const [k, v] of Object.entries(brand.layout.named_radii)) {
      p(`  --radius-${k}: ${v}px;`);
    }
  }
  p('');

  // Shadows
  p('  /* Shadows */');
  for (const [k, v] of Object.entries(brand.depth.shadows)) {
    p(`  --shadow-${k}: ${v};`);
  }
  p('');

  // Breakpoints
  p('  /* Breakpoints */');
  for (const [k, v] of Object.entries(brand.responsive.breakpoints)) {
    p(`  --breakpoint-${k}: ${v}px;`);
  }

  p('}');
  p('');

  return lines.join('\n');
}

// ─── Emit: tokens.json (W3C Design Tokens spec) ───────────────────────────────

function emitTokensJson(brand) {
  const out = {
    $schema: 'https://schemas.dtcg.org/tokens/v1.0/',
    $description: `${brand.meta.name} design tokens — generated from brand.yaml`,
    color: {},
    surface: {},
    font: {},
    text: {},
    leading: {},
    weight: {},
    tracking: {},
    spacing: {},
    radius: {},
    shadow: {},
    breakpoint: {},
  };

  // Colors
  for (const group of ['brand', 'accent', 'neutrals', 'semantic']) {
    if (!brand.colors[group]) continue;
    out.color[group] = {};
    for (const [name, def] of Object.entries(brand.colors[group])) {
      out.color[group][name] = {
        $value: def.hex,
        $type: 'color',
        $description: def.role,
      };
    }
  }
  if (brand.colors.selection) {
    out.color.selection = {
      text: { $value: brand.colors.selection.text, $type: 'color', $description: 'Text selection foreground' },
      background: { $value: brand.colors.selection.background, $type: 'color', $description: 'Text selection background' },
    };
  }

  // Surfaces
  for (const [name, def] of Object.entries(brand.surfaces || {})) {
    out.surface[name] = {
      $value: def.value,
      $type: 'color',
      $description: def.role,
    };
  }

  // Fonts
  for (const [role, f] of Object.entries(brand.typography.fonts)) {
    out.font[role] = {
      $value: f.family,
      $type: 'fontFamily',
      $description: f.role,
    };
  }

  // Text scale
  for (const s of brand.typography.scale) {
    out.text[s.name] = {
      $value: `${s.size}px`,
      $type: 'dimension',
      $description: s.use,
    };
    out.leading[s.name] = {
      $value: s.line_height,
      $type: 'number',
    };
  }

  // Weights
  for (const [k, v] of Object.entries(brand.typography.weights || {})) {
    out.weight[k] = { $value: v, $type: 'fontWeight' };
  }

  // Tracking
  for (const [k, v] of Object.entries(brand.typography.letter_spacing || {})) {
    out.tracking[k] = { $value: v, $type: 'dimension' };
  }

  // Spacing
  for (const [k, v] of Object.entries(brand.layout.spacing || {})) {
    out.spacing[k] = { $value: `${v}px`, $type: 'dimension' };
  }
  for (const [k, v] of Object.entries(brand.layout.semantic_spacing || {})) {
    out.spacing[k] = { $value: `${v}px`, $type: 'dimension' };
  }

  // Radii
  for (const [k, v] of Object.entries(brand.layout.radii || {})) {
    out.radius[k] = { $value: v === 0 ? '0' : `${v}px`, $type: 'dimension' };
  }
  for (const [k, v] of Object.entries(brand.layout.named_radii || {})) {
    out.radius[k] = { $value: `${v}px`, $type: 'dimension' };
  }

  // Shadows
  for (const [k, v] of Object.entries(brand.depth.shadows || {})) {
    out.shadow[k] = { $value: v, $type: 'shadow' };
  }

  // Breakpoints
  for (const [k, v] of Object.entries(brand.responsive.breakpoints || {})) {
    out.breakpoint[k] = { $value: `${v}px`, $type: 'dimension' };
  }

  return JSON.stringify(out, null, 2) + '\n';
}

// ─── Color panel HTML (injected into /color/) ────────────────────────────────
// Generated from yaml so swatches stay in sync with brand.yaml.

function generateColorPanel(brand) {
  const groups = ['brand', 'accent', 'neutrals', 'semantic'];
  const groupLabels = {
    brand: 'Brand',
    accent: 'Accent',
    neutrals: 'Neutrals',
    semantic: 'Semantic',
  };

  const sections = groups.map(group => {
    if (!brand.colors[group]) return '';
    const swatches = Object.entries(brand.colors[group]).map(([name, def]) => {
      const isLight = (() => {
        const r = parseInt(def.hex.slice(1, 3), 16);
        const g = parseInt(def.hex.slice(3, 5), 16);
        const b = parseInt(def.hex.slice(5, 7), 16);
        return (r * 299 + g * 587 + b * 114) / 1000 > 140;
      })();
      const textColor = isLight ? '#191412' : '#FFFFFF';
      const displayName = name.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
      return `      <div class="tw-swatch">
        <div class="tw-swatch-color" style="background:${def.hex};color:${textColor}">
          <span class="tw-swatch-hex">${def.hex.toUpperCase()}</span>
        </div>
        <div class="tw-swatch-meta">
          <strong class="tw-swatch-name">${displayName}</strong>
          <code class="tw-swatch-token">--color-${group}-${name}</code>
          <p class="tw-swatch-role">${def.role}</p>
        </div>
      </div>`;
    }).join('\n');

    return `  <section class="tw-color-group">
    <h3 class="tw-color-group-label">${groupLabels[group]}</h3>
    <div class="tw-color-grid">
${swatches}
    </div>
  </section>`;
  }).filter(Boolean).join('\n\n');

  return `<!-- Toldwell color panel — generated from brand.yaml -->
<aside id="tw-color-panel">
  <header class="tw-color-panel-head">
    <h2>Color Palette</h2>
    <p>The Toldwell palette is intentionally restrained. Warm dark tones anchored by a distinctive gold accent, structured into four roles: brand, accent, neutrals, and semantic. Every color reads to its purpose.</p>
  </header>

${sections}

  <footer class="tw-color-panel-foot">
    <p>All colors are exposed as CSS variables in <a href="/tokens.css"><code>tokens.css</code></a>, Tailwind v4 theme in <a href="/tailwind.css"><code>tailwind.css</code></a>, and W3C Design Tokens spec in <a href="/tokens.json"><code>tokens.json</code></a>.</p>
  </footer>
</aside>
`;
}

// ─── Site build: copy site/template/* → site/docs/* with token injection ──────
//
// We don't blow away the docs folder entirely (must preserve CNAME + generated
// design files dropped there). We copy the template tree, and inject a tokens
// CSS link into every HTML file's <head> so site styles can reference the
// brand tokens via CSS custom properties.

const TOKENS_LINK = '<link rel="stylesheet" href="/tokens.css">';
const OVERRIDES_LINK = '<link rel="stylesheet" href="/site-overrides.css">';

function transformHtml(filePath, buf, brand) {
  let html = buf.toString();

  // Strip Framer's hydration JS bundles + module preloads. These scripts
  // re-fetch the original Cipherly content from Framer's CDN at runtime and
  // overwrite our static Toldwell HTML in the DOM. Without them, the static
  // HTML renders as-is. Also drop the analytics beacon phoning home.
  html = html.replace(/<script[^>]*src="https:\/\/framerusercontent\.com\/sites\/[^"]*"[^>]*><\/script>/g, '');
  html = html.replace(/<script[^>]*src="https:\/\/events\.framer\.com\/script"[^>]*><\/script>/g, '');
  html = html.replace(/<script[^>]*src="https:\/\/app\.framerstatic\.com\/[^"]*\.mjs"[^>]*><\/script>/g, '');
  // <link rel="modulepreload"> tags pointing at Framer chunks
  html = html.replace(/<link[^>]*rel="modulepreload"[^>]*href="https:\/\/framerusercontent\.com\/sites\/[^"]*"[^>]*\/?>/g, '');
  html = html.replace(/<link[^>]*rel="modulepreload"[^>]*href="https:\/\/app\.framerstatic\.com\/[^"]*"[^>]*\/?>/g, '');
  // Also strip framer-hydrate-v2 attribute (the JS won't run anyway, but
  // remove the trigger so nothing else attempts hydration)
  html = html.replace(/data-framer-hydrate-v2="[^"]*"/g, '');
  // Drop the framer search index meta tag (points to Cipherly's content)
  html = html.replace(/<meta[^>]*name="framer-search-index"[^>]*\/?>/g, '');

  // Insert tokens.css link if not present
  if (!html.includes('href="/tokens.css"')) {
    if (html.includes('</head>')) {
      html = html.replace('</head>', `  ${TOKENS_LINK}\n</head>`);
    }
  }
  // Insert site-overrides.css link if not present (after tokens.css)
  if (!html.includes('href="/site-overrides.css"')) {
    if (html.includes('</head>')) {
      html = html.replace('</head>', `  ${OVERRIDES_LINK}\n</head>`);
    }
  }
  // Page-specific injections
  if (filePath.endsWith('/color/index.html') || filePath.endsWith('\\color\\index.html')) {
    if (!html.includes('id="tw-color-panel"')) {
      const panel = generateColorPanel(brand);
      html = html.replace('</body>', `${panel}\n</body>`);
    }
  }
  return html;
}

function buildSite(brand) {
  if (!fs.existsSync(TEMPLATE_DIR)) {
    console.log('  (no site/template/ — skipping site build)');
    return;
  }

  // Preserve CNAME if present
  const cnamePath = path.join(DOCS_DIR, 'CNAME');
  let cname = null;
  if (fs.existsSync(cnamePath)) {
    cname = fs.readFileSync(cnamePath);
  }

  // Wipe docs/ (will be regenerated). Keep the dir itself.
  ensureDir(DOCS_DIR);
  rmDirContents(DOCS_DIR);

  // Copy template → docs with HTML transform
  copyDir(TEMPLATE_DIR, DOCS_DIR, (filePath, buf) => {
    if (filePath.endsWith('.html')) return transformHtml(filePath, buf, brand);
    return buf;
  });

  // Restore CNAME
  if (cname) fs.writeFileSync(cnamePath, cname);
  else fs.writeFileSync(cnamePath, 'brand.toldwell.com\n');
}

// Drop the design files (and the hand-edited overrides) into docs/ so they're
// served by Pages alongside the site.
function copyDesignFilesToSite() {
  ensureDir(DOCS_DIR);
  for (const f of [DESIGN_MD, TOKENS_CSS, TAILWIND_CSS, TOKENS_JSON, OVERRIDES_CSS]) {
    if (fs.existsSync(f)) {
      fs.copyFileSync(f, path.join(DOCS_DIR, path.basename(f)));
    }
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────

function main() {
  console.log('Toldwell brand build');
  console.log('────────────────────');
  console.log('Loading brand.yaml...');
  const brand = loadBrand();

  console.log('Emitting design files at repo root:');

  fs.writeFileSync(DESIGN_MD, emitDesignMd(brand));
  console.log('  ✓ DESIGN.md');

  fs.writeFileSync(TOKENS_CSS, emitTokensCss(brand));
  console.log('  ✓ tokens.css');

  fs.writeFileSync(TAILWIND_CSS, emitTailwindCss(brand));
  console.log('  ✓ tailwind.css');

  fs.writeFileSync(TOKENS_JSON, emitTokensJson(brand));
  console.log('  ✓ tokens.json');

  console.log('Building site (site/template → docs/)...');
  buildSite(brand);
  copyDesignFilesToSite();
  console.log('  ✓ docs/');

  console.log('');
  console.log('Done.');
}

main();
