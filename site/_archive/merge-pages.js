#!/usr/bin/env node
/**
 * Merges the multi-page Cipherly template into a single scrollable page.
 * Non-destructive — outputs to template/onepage.html
 *
 * Strategy:
 * 1. Take introduction/index.html as base (has sidebar + layout)
 * 2. Extract content area from each page
 * 3. Stack them vertically in one Content div
 * 4. Update sidebar links to #anchors
 */

const fs = require('fs');
const path = require('path');

const TEMPLATE = path.join(__dirname, 'template');
const PAGES = ['introduction', 'strategy', 'logo', 'typography', 'color', 'images', 'icons', 'resources'];

// Color/font swaps (Cipherly → Toldwell)
const SWAPS = [
  ['rgb(0, 64, 255)', 'rgb(243, 204, 146)'],
  ['rgba(0, 64, 255, .2)', 'rgba(243, 204, 146, .2)'],
  ['rgba(0, 64, 255, .07)', 'rgba(243, 204, 146, .07)'],
  ['rgb(38, 38, 38)', 'rgb(25, 20, 18)'],
  ['rgb(248, 248, 248)', 'rgb(242, 242, 242)'],
  ['Plus Jakarta Sans', 'Red Hat Display'],
  // Fix Google Fonts URL
  ['fonts.googleapis.com/css2?family=Plus+Jakarta+Sans', 'fonts.googleapis.com/css2?family=Red+Hat+Display'],
];

function applySwaps(html) {
  let result = html;
  for (const [from, to] of SWAPS) {
    result = result.split(from).join(to);
  }
  return result;
}

// Extract the Content div's innerHTML from a page
function extractContent(html) {
  // Find data-framer-name="Content" — the main content wrapper
  const marker = 'data-framer-name="Content" name="Content"';
  const idx = html.indexOf(marker);
  if (idx === -1) {
    // Try alternate marker
    const alt = 'data-framer-name="Content"';
    const idx2 = html.indexOf(alt);
    if (idx2 === -1) return null;
    return extractDivFrom(html, idx2);
  }
  return extractDivFrom(html, idx);
}

// Extract a complete <div ...> ... </div> starting from a position inside the opening tag
function extractDivFrom(html, posInTag) {
  // Find the opening < before this position
  let start = posInTag;
  while (start > 0 && html[start] !== '<') start--;

  // Now find matching closing </div> by counting depth
  let depth = 0;
  let i = start;
  while (i < html.length) {
    if (html.substr(i, 4) === '<div') {
      depth++;
      i += 4;
    } else if (html.substr(i, 6) === '</div>') {
      depth--;
      if (depth === 0) {
        return html.substring(start, i + 6);
      }
      i += 6;
    } else {
      i++;
    }
  }
  return null;
}

// Extract sidebar/navigation from the base page
function extractNavigation(html) {
  const marker = 'data-framer-name="Navigation &amp; Footer"';
  const idx = html.indexOf(marker);
  if (idx === -1) return null;
  return extractDivFrom(html, idx);
}

function main() {
  console.log('Reading pages...');

  // Read base page
  let basePath = path.join(TEMPLATE, 'introduction', 'index.html');
  // Use the original (unswapped) from backup if available
  const origPath = path.join(__dirname, 'template-original', 'introduction', 'index.html');
  if (fs.existsSync(origPath)) basePath = origPath;
  
  let base = fs.readFileSync(basePath, 'utf8');

  // Extract content from each page
  const contents = [];
  for (const page of PAGES) {
    let pagePath = path.join(__dirname, 'template-original', page, 'index.html');
    if (!fs.existsSync(pagePath)) {
      pagePath = path.join(TEMPLATE, page, 'index.html');
    }
    if (!fs.existsSync(pagePath)) {
      console.log(`  Skipping ${page} (not found)`);
      continue;
    }

    const html = fs.readFileSync(pagePath, 'utf8');
    const content = extractContent(html);
    if (content) {
      console.log(`  Extracted: ${page} (${(content.length / 1024).toFixed(0)}KB)`);
      // Wrap in a section div with an anchor ID
      contents.push(`<div id="section-${page}" style="scroll-margin-top: 0px;">${content}</div>`);
    } else {
      console.log(`  WARNING: Could not extract content from ${page}`);
    }
  }

  console.log(`\nMerged ${contents.length} sections`);

  // In the base page, replace the Content div with all combined contents
  const baseContent = extractContent(base);
  if (!baseContent) {
    console.error('ERROR: Could not find Content div in base page');
    process.exit(1);
  }

  // Create replacement — same outer div wrapper but with all contents stacked
  const contentMarker = 'data-framer-name="Content" name="Content"';
  const contentIdx = base.indexOf(contentMarker);
  let outerStart = contentIdx;
  while (outerStart > 0 && base[outerStart] !== '<') outerStart--;

  // Get the opening tag
  const tagEnd = base.indexOf('>', contentIdx) + 1;
  const openingTag = base.substring(outerStart, tagEnd);

  // Replace original content div with merged version
  const mergedContent = openingTag + contents.join('\n') + '</div>';
  const merged = base.substring(0, outerStart) + mergedContent + base.substring(outerStart + baseContent.length);

  // Apply color/font swaps
  console.log('Applying brand swaps...');
  let final = applySwaps(merged);

  // Update sidebar links: ./introduction → #section-introduction, etc.
  for (const page of PAGES) {
    // Various link formats Framer might use
    final = final.split(`href="./${page}"`).join(`href="#section-${page}"`);
    final = final.split(`href="/${page}"`).join(`href="#section-${page}"`);
    final = final.split(`href="../${page}"`).join(`href="#section-${page}"`);
    final = final.split(`href="./${page}#`).join(`href="#section-${page}-`);
  }
  // Home link
  final = final.split('href="./"').join('href="#section-introduction"');
  final = final.split('href="/"').join('href="#section-introduction"');

  // Add smooth scrolling
  final = final.replace('<html', '<html style="scroll-behavior:smooth"');

  // Write output
  const outPath = path.join(TEMPLATE, 'onepage.html');
  fs.writeFileSync(outPath, final);
  console.log(`\nOutput: ${outPath} (${(final.length / 1024).toFixed(0)}KB)`);
  console.log('Done.');
}

main();
