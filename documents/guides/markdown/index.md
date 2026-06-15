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

`markdown.link_output` only controls source-relative `.md` page links. External URLs, root-relative URLs, and anchors are not rewritten.

## Public Asset Links

When Markdown links to an existing file inside `public-dir`, Build Pages rewrites the source-relative file path to the deployed public URL.

```md
![ZeroPress favicon](../../../public/favicon.png)
```

If `public-dir` is `./public` and `public/favicon.png` exists, the generated page uses:

```html
<img src="/favicon.png" alt="ZeroPress favicon">
```

The number of `../` segments depends on where the Markdown file lives in the source tree, not on a fixed value. Write the link as the real relative path from the current file to the public asset; Build Pages resolves it against `public-dir` and rewrites it to the output-root URL.

This keeps image and asset paths understandable in GitHub or an editor while still publishing from the output root. The same rule applies to raw HTML attributes such as `src`, `href`, `poster`, and `srcset`. Missing files and files outside `public-dir` are left unchanged.

Markdown raw HTML may use safe native media elements such as `video`, `audio`, `source`, and `track`. Use source-relative public asset paths for site-owned media files.

## Markdown Features

Build Pages supports common GitHub-flavored Markdown features such as tables, task lists, strikethrough, fenced code language classes, Mermaid fences, GitHub-style alerts, and safe raw HTML media blocks.

See [Markdown Feature Examples](./examples.md) for a rendered sample page that uses these features together.
