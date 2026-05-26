---
title: Dogfooding
description: See how this site uses Build Pages in practice.
status: published
meta:
  category: Guides
  chapter: Real project
  prev_url: /deployment/
  prev_label: Deployment
  next_url: /reference/
  next_label: Reference Hub
---

# Dogfooding

This site is itself a Build Pages project.

## Project Shape

```txt
documents/
  .zeropress/config.json
  index.md
  ...
public/
  favicon.svg
  sitemap.xsl
theme-docs2/
  theme/
```

The local build script calls the local Build Pages CLI with:

```bash
--source ./documents
--public-dir ./public
--destination ./_site
--theme-path ./theme-docs2/theme
```

## Why This Site Exists

The goal is to show Build Pages as a complete product: authoring, configuration, build command, deployment, and search behavior without requiring readers to understand lower-level ZeroPress contracts.
