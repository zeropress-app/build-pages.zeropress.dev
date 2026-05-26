---
title: Source Tree
description: Understand how source, public, theme, and output directories fit together.
status: published
meta:
  category: Foundations
  chapter: Project layout
  prev_url: /getting-started/
  prev_label: Getting Started
  next_url: /markdown/
  next_label: Markdown Pages
---

# Source Tree

Build Pages separates authoring files from generated output.

```txt
docs/
  index.md
  guide.md
  .zeropress/
    config.json

public/
  favicon.svg
  robots.txt

_site/
  generated output
```

## Source Directory

The source directory contains Markdown pages and optional `.zeropress/config.json`.

```bash
zeropress-build-pages --source ./docs --destination ./_site
```

## Public Directory

The public directory contains site-owned files copied to the output root.

```bash
zeropress-build-pages --source ./docs --public-dir ./public --destination ./_site
```

If `--public-dir` is omitted, the source directory is also used as the public passthrough root.

## Output Directory

The destination directory receives generated HTML, theme assets, copied public files, and ZeroPress special files such as `sitemap.xml`.
