/**
 * swap-runtime.js — Toldwell content swap runtime
 *
 * The brand site is built on a Cipherly Framer template. The static HTML in
 * docs/ has all swaps applied at build time, but Framer's hydration bundle
 * (script_main.*.mjs) fetches Cipherly's content modules at runtime and
 * re-renders the page with Cipherly's data — clobbering our swaps.
 *
 * This script re-applies the swaps after hydration, then watches for any
 * subsequent React re-renders (e.g. on SPA navigation) and re-applies again.
 *
 * Loaded via <script defer src="/swap-runtime.js"></script> on every page,
 * after the swap rules are fetched as JSON from /swaps.json.
 */
(function () {
  'use strict';

  const SWAPS_URL = '/swaps.json';
  const SCAN_DEBOUNCE_MS = 50;

  // Determine current page key from URL path. Matches build.js logic:
  // parts[0] of the relative path after TEMPLATE_DIR. '/' → 'index'.
  function pageKey() {
    const path = location.pathname.replace(/\/$/, '');
    if (!path || path === '') return 'index';
    const parts = path.split('/').filter(Boolean);
    return parts[0] || 'index';
  }

  // Apply text swaps to a string. Each rule is { from, to }.
  // Mirrors applySwaps in build.js — plain string replace, all occurrences.
  function applySwapsToText(text, rules) {
    let out = text;
    for (const rule of rules) {
      if (!rule.from || rule.to === undefined) continue;
      // Match all occurrences using split/join (avoids regex escaping)
      if (out.indexOf(rule.from) !== -1) {
        out = out.split(rule.from).join(rule.to);
      }
    }
    return out;
  }

  // Walk all text nodes in the DOM and apply swaps. Skips <script>, <style>,
  // <noscript>, and elements marked with [data-skip-swap].
  function walkAndSwap(root, rules) {
    if (!root || !rules || rules.length === 0) return 0;
    const walker = document.createTreeWalker(
      root,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode(node) {
          const parent = node.parentNode;
          if (!parent) return NodeFilter.FILTER_REJECT;
          const tag = parent.nodeName;
          if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'NOSCRIPT') {
            return NodeFilter.FILTER_REJECT;
          }
          // Skip empty / whitespace-only text nodes
          if (!node.nodeValue || !node.nodeValue.trim()) {
            return NodeFilter.FILTER_REJECT;
          }
          return NodeFilter.FILTER_ACCEPT;
        },
      }
    );
    let count = 0;
    let node;
    while ((node = walker.nextNode())) {
      const original = node.nodeValue;
      const swapped = applySwapsToText(original, rules);
      if (swapped !== original) {
        node.nodeValue = swapped;
        count++;
      }
    }
    return count;
  }

  // Apply swaps to attribute values too (alt, title, aria-label, href).
  // Keeps the attribute swaps consistent with text swaps.
  function swapAttributes(root, rules) {
    if (!root || !rules || rules.length === 0) return 0;
    const ATTRS = ['alt', 'title', 'aria-label', 'href', 'src', 'placeholder'];
    let count = 0;
    const els = root.querySelectorAll('[' + ATTRS.join('],[') + ']');
    for (const el of els) {
      for (const attr of ATTRS) {
        if (!el.hasAttribute(attr)) continue;
        const original = el.getAttribute(attr);
        const swapped = applySwapsToText(original, rules);
        if (swapped !== original) {
          el.setAttribute(attr, swapped);
          count++;
        }
      }
    }
    return count;
  }

  // Swap <title> and selected <meta> content attributes — these get reset by
  // Framer hydration alongside the body, but our body walker doesn't reach
  // <head> (and shouldn't — most of <head> is structural).
  function swapHead(rules) {
    if (document.title) {
      const swapped = applySwapsToText(document.title, rules);
      if (swapped !== document.title) document.title = swapped;
    }
    const metas = document.querySelectorAll(
      'meta[name="description"], meta[property="og:title"], meta[property="og:description"], meta[property="og:image"], meta[name="twitter:title"], meta[name="twitter:description"], meta[name="twitter:image"]'
    );
    for (const m of metas) {
      const c = m.getAttribute('content');
      if (!c) continue;
      const swapped = applySwapsToText(c, rules);
      if (swapped !== c) m.setAttribute('content', swapped);
    }
  }

  // Combine global rules with per-page rules and image swaps for the current page.
  function rulesForCurrentPage(swaps) {
    const rules = [];
    if (Array.isArray(swaps.global)) rules.push(...swaps.global);
    const key = pageKey();
    if (swaps.pages && swaps.pages[key] && Array.isArray(swaps.pages[key].text)) {
      rules.push(...swaps.pages[key].text);
    }
    if (swaps.images && Array.isArray(swaps.images.swaps)) {
      rules.push(...swaps.images.swaps);
    }
    return rules;
  }

  let scanTimer = null;
  function scheduleScan(rules) {
    if (scanTimer) clearTimeout(scanTimer);
    scanTimer = setTimeout(() => {
      walkAndSwap(document.body, rules);
      swapAttributes(document.body, rules);
      swapHead(rules);
    }, SCAN_DEBOUNCE_MS);
  }

  async function init() {
    let swaps;
    try {
      const res = await fetch(SWAPS_URL, { cache: 'no-store' });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      swaps = await res.json();
    } catch (e) {
      console.warn('[swap-runtime] failed to load swaps.json:', e);
      return;
    }

    const rules = rulesForCurrentPage(swaps);
    if (!rules.length) return;

    // Initial pass — covers the static HTML state.
    walkAndSwap(document.body, rules);
    swapAttributes(document.body, rules);
    swapHead(rules);

    // Watch for hydration / re-renders. Every mutation triggers a debounced
    // re-scan. Cipherly's Framer hydration triggers a single bulk DOM swap
    // which we catch on the first mutation; subsequent SPA navigations do
    // the same.
    const observer = new MutationObserver(() => scheduleScan(rules));
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    // Belt-and-braces: run again after window load (after async font/image
    // loads) and once more after a 2s delay (in case hydration is slow).
    window.addEventListener('load', () => scheduleScan(rules));
    setTimeout(() => scheduleScan(rules), 2000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
