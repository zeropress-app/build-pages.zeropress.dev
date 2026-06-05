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

## Internal Links

Write links to other source pages as source-relative `.md` links:

```md
[Getting Started](../getting-started/index.md)
[CLI Reference](../reference/cli/index.md)
```

This keeps links usable in GitHub repository browsing and in editors that follow Markdown links. During the build, Build Pages rewrites discovered source-relative `.md` links to generated site URLs.

Config `markdown.link_output` controls the generated link shape:

- `clean`: `../reference/cli/index.md` -> `/reference/cli/`
- `html`: `../reference/cli/index.md` -> `/reference/cli/index.html`

External URLs, root-relative URLs, anchors, and non-Markdown assets are not rewritten.

## Markdown Features

Build Pages supports common GitHub-flavored Markdown features such as tables, task lists, strikethrough, fenced code language classes, Mermaid fences, and GitHub-style alerts.

See [Markdown Feature Examples](features/index.md) for a rendered sample page that uses these features together.
