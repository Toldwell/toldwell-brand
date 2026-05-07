# Project Rules — toldwell-brand

These rules are non-negotiable for anyone (human or agent) working on this repo.

## 1. Swap-only mission

**The brand site is a Cipherly Framer rip. We swap content. We do not build.**

- Layout, components, structure, navigation, animations — **all stay Cipherly's**.
- We replace **text, images, logos, colors** in place. Nothing else.
- Find Cipherly's element, swap to Toldwell's equivalent. Done.

### What this means in practice

- ❌ Don't add new HTML sections, panels, components, or pages
- ❌ Don't write new CSS layouts, grids, or responsive behaviors
- ❌ Don't write JavaScript to add interactivity
- ❌ Don't "improve" or "modernize" the design
- ❌ Don't reinterpret a Cipherly element as something different

- ✅ Replace a Cipherly photo with a Toldwell photo
- ✅ Replace a Cipherly paragraph with a Toldwell paragraph
- ✅ Replace a Cipherly logo SVG with a Toldwell logo SVG
- ✅ Update color values to Toldwell's palette
- ✅ Update the favicon to Toldwell's

### When something looks broken on Toldwell's version but worked on Cipherly's

That means something we did broke a feature that was core to the original.
**Restore the original Cipherly behavior.** Do not replace it with our own
implementation.

Examples:
- Mobile menu doesn't open → the original used Framer JS we stripped. Either
  bring back the minimum needed Framer pieces or accept the limitation —
  **don't write a new menu**.
- Animation gone → same answer.
- Some interactive element not working → same.

### When in doubt

If you find yourself writing new markup, new CSS classes, new JS functions,
or new "panels" / "sections" / "components" — **stop and ask Will**.

## 2. The two YAML files

- `brand.yaml` = design system (tokens: colors, fonts, type scale, spacing,
  voice, principles). Drives `DESIGN.md` / `tokens.css` / `tailwind.css` /
  `tokens.json` for AI agents and tools.
- `content.yaml` = the swap map for the brand site. Per-page `from` →
  `to` text/image substitutions applied during build.

`brand.yaml` is the design source of truth. `content.yaml` is the swap recipe.
**Both are for substituting content — neither generates new content panels or
new layouts.**

## 3. Repo layout

```
toldwell-brand/
├── brand.yaml          ← design tokens (the system)
├── content.yaml        ← swap map (the human site copy/image map)
├── DESIGN.md           ← generated from brand.yaml
├── tokens.css          ← generated from brand.yaml
├── tailwind.css        ← generated from brand.yaml
├── tokens.json         ← generated from brand.yaml
├── site-overrides.css  ← MINIMAL hand-edited CSS for things sed/yaml
│                          can't fix (e.g. logo overlay, hide Framer badge)
├── docs/               ← generated output served by GitHub Pages
└── site/
    ├── template/       ← editable Cipherly rip — STAY IN THIS LANE
    └── _archive/       ← failed past experiments
```

## 4. Allowed edits to templates

You may directly edit `site/template/*` only when:
- Replacing a Cipherly asset URL with a Toldwell asset URL (use `content.yaml.images.swaps` instead when possible)
- Adding a new Toldwell SVG/photo file alongside the existing assets
- Updating a static value the swap map can't address cleanly

You may **NOT** edit `site/template/*` to:
- Add new HTML elements that weren't in Cipherly's original
- Change the structure of existing elements
- Inject JavaScript or CSS that Cipherly didn't have

## 5. site-overrides.css scope

Only patches that the swap mechanism cannot reach:
- Hide the Framer badge
- Overlay the Toldwell wordmark on top of the existing header logo SVG
- Hide unused social links

If a styling change is needed that's not one of these, that's a sign you
should be editing tokens or content, not adding overrides.

---

If a request feels like it needs new components, new layouts, or new behavior:
**re-read this file**, then ask before doing anything.
