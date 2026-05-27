# Markdown Pages

Build Pages discovers `*.md` files under the source directory and turns published Markdown pages into generated routes.

## Page Title

A Markdown page must provide a title through front matter or a first H1.

```md
---
title: Install Guide
---

Body content...
```

or:

```md
# Install Guide

Body content...
```

Without a title, the build fails unless `--skip-untitled-markdown` is enabled.

## Front Matter

Supported front matter fields are optional.

```md
---
title: Install Guide
description: Build static docs from Markdown.
path: guides/install
status: published
discoverability: default
meta:
  category: Guides
data:
  stack:
    - Markdown
    - ZeroPress
---
```

If `status` is omitted, the page is treated as `published`.

## Markdown Features

Build Pages supports common GitHub-flavored Markdown features such as tables, task lists, strikethrough, fenced code language classes, Mermaid fences, and GitHub-style alerts.
