#!/usr/bin/env node
// Generate _site/_zeropress/pages-index.json from preview-data.json + config.json menus.
// Used for: search result grouping, link hover previews, 404 search prefill.

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');
const previewPath = resolve(root, '.zeropress-build-page/preview-data.json');
const outPath = resolve(root, '_site/_zeropress/pages-index.json');

const preview = JSON.parse(readFileSync(previewPath, 'utf8'));
const pages = preview?.content?.pages ?? [];
const menus = preview?.menus ?? {};

// Build url -> group label map from menus.
const urlToGroup = new Map();
for (const [groupKey, group] of Object.entries(menus)) {
  if (!group || !Array.isArray(group.items)) continue;
  const label = group.name || groupKey;
  for (const item of group.items) {
    if (!item || !item.url) continue;
    if (/^https?:/i.test(item.url)) continue;
    const normalized = normalizeUrl(item.url);
    if (!urlToGroup.has(normalized)) urlToGroup.set(normalized, { key: groupKey, label });
  }
}

function normalizeUrl(u) {
  if (!u) return '/';
  let v = String(u).trim();
  if (!v.startsWith('/')) v = '/' + v;
  if (v.length > 1 && v.endsWith('/')) v = v.slice(0, -1);
  return v || '/';
}

function plainExcerpt(page) {
  if (page.excerpt) return page.excerpt;
  const html = page.content || '';
  // Strip code fences and HTML/Markdown lightly.
  const stripped = String(html)
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/[#*_>`~\-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return stripped.slice(0, 220);
}

function pageUrl(page) {
  if (page.path === 'index') return '/';
  // path like "cli/index" or "reference/cli/index" -> "/cli/" / "/reference/cli/"
  const cleaned = page.path.replace(/\/index$/, '/');
  return '/' + cleaned.replace(/^\/+/, '');
}

const entries = pages
  .filter((p) => p.status !== 'draft' && p.status !== 'private')
  .map((p) => {
    const url = pageUrl(p);
    const normalized = normalizeUrl(url);
    const group = urlToGroup.get(normalized) || null;
    return {
      url,
      title: p.title,
      excerpt: plainExcerpt(p),
      category: p.meta?.category ?? null,
      chapter: p.meta?.chapter ?? null,
      group_key: group?.key ?? null,
      group_label: group?.label ?? p.meta?.category ?? null,
    };
  });

mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, JSON.stringify({ version: 1, generated_at: new Date().toISOString(), pages: entries }, null, 2));
console.log(`Wrote ${entries.length} entries to ${outPath}`);
