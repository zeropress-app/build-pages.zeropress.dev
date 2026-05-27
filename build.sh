#!/usr/bin/env sh
set -eu

# Public build script for local builds and static hosting providers.
# Use this as the build command on Vercel, Cloudflare Pages, or Netlify:
#   bash ./build.sh
# The generated deployable site is written to ./_site.

SCRIPT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
SITE_DIR="$SCRIPT_DIR/_site"

npx --yes @zeropress/build-pages@0.6.3 \
  --source "$SCRIPT_DIR/documents" \
  --destination "$SITE_DIR" \
  --public-dir "$SCRIPT_DIR/public" \
  --theme-path "$SCRIPT_DIR/theme-docs2/theme"

node "$SCRIPT_DIR/scripts/build-pages-index.mjs"

npx --yes pagefind@1.4.0 \
  --site "$SITE_DIR" \
  --output-subdir _zeropress/pagefind

cp "$SITE_DIR/_zeropress/search_pagefind.js" "$SITE_DIR/_zeropress/search.js"
rm "$SITE_DIR/_zeropress/search.json"
