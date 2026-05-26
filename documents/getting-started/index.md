---
title: Getting Started
description: Build your first ZeroPress Build Pages site from Markdown.
status: published
meta:
  category: Foundations
  chapter: Start
  prev_url: /
  prev_label: Home
  next_url: /source-tree/
  next_label: Source Tree
---

# Getting Started

Create a `docs/` directory with an `index.md` file, then run Build Pages with a destination directory.

```bash
npx @zeropress/build-pages --source ./docs --destination ./_site
```

The command discovers Markdown pages, prepares generated build data, copies public files, and writes a static site to `_site/`.

## Minimal Source

```txt
docs/
  index.md
```

```md
# My Docs

Welcome to the project documentation.
```

## Add Configuration

Optional site configuration lives under the source directory:

```txt
docs/
  .zeropress/
    config.json
  index.md
```

Use config when you want to set site metadata, menus, footer text, or a custom front page source.

## Next Step

Read [Source Tree](/source-tree/) before adding assets, themes, or deployment settings.
