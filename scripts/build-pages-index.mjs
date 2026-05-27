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
let groupOrder = 0;

for (const [menuKey, menu] of Object.entries(menus)) {
  if (!menu || !Array.isArray(menu.items)) continue;
  const menuLabel = menu.name || menuKey;

  for (const item of menu.items) {
    if (!item) continue;
    if (Array.isArray(item.children) && item.children.length > 0) {
      const key = item.meta?.group_id || slugify(item.title) || menuKey;
      const label = item.title || menuLabel;
      const order = groupOrder++;
      mapItemUrl(item, { key, label, order });
      for (const child of item.children) {
        mapItemTree(child, { key, label, order });
      }
      continue;
    }

    mapItemUrl(item, { key: menuKey, label: menuLabel, order: groupOrder });
  }
}

function mapItemTree(item, group) {
  if (!item) return;
  mapItemUrl(item, group);
  if (Array.isArray(item.children)) {
    for (const child of item.children) mapItemTree(child, group);
  }
}

function mapItemUrl(item, group) {
  if (!item || !item.url) return;
  if (/^https?:/i.test(item.url)) return;
  const normalized = normalizeUrl(item.url);
  if (!urlToGroup.has(normalized)) urlToGroup.set(normalized, group);
}

function slugify(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
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
      group_order: group?.order ?? null,
    };
  });

mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, JSON.stringify({ version: 1, generated_at: new Date().toISOString(), pages: entries }, null, 2));
console.log(`Wrote ${entries.length} entries to ${outPath}`);
