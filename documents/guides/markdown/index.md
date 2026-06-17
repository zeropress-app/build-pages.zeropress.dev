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
updated_at: none
featured_image: /images/share.png
meta:
  category: Guides
data:
  stack:
    - Markdown
    - ZeroPress
---
```

Front matter must use plain YAML with `---` delimiters. JavaScript front matter, language-specific delimiters, YAML custom tags, anchors, aliases, and block scalars are not supported.

Supported fields:

| Field | Purpose |
| --- | --- |
| `title` | Page title. Takes priority over the first Markdown H1. |
| `description` | Page excerpt and generated description metadata. |
| `path` | Generated route path. Example: `guides/install` becomes `/guides/install`. |
| `status` | Publishing state. Allowed values: `published`, `draft`. |
| `discoverability` | Automatic exposure policy. Allowed values: `default`, `noindex`, `delist`. |
| `updated_at` | Page update timestamp policy or value. Allowed values: `none`, `git`, or an ISO datetime string. |
| `featured_image` | Optional share image for generated Open Graph metadata. |
| `meta` | Optional scalar/null metadata copied to the generated page. |
| `data` | Optional structured JSON-style data for theme-facing lists, facts, galleries, timelines, or swatches. |

If `title` is omitted, Build Pages uses the first Markdown H1. Without a title from either source, the build fails unless `--skip-untitled-markdown` is enabled.

If `path` is omitted, Build Pages derives the route from the source file path. For example, `guides/install.md` becomes `/guides/install`, and `guides/install/index.md` becomes `/guides/install/`. A custom `path` must be a safe generated route path without a leading slash, trailing slash, query, hash, or `..` segment.

If `status` is omitted, the page is treated as `published`. `status: draft` skips the page and no HTML route is generated.

`discoverability` applies after a page route is generated:

- `default`: no special handling.
- `noindex`: generate the page and add HTML robots `noindex`.
- `delist`: generate the page, add HTML robots `noindex`, and exclude it from automatic discovery outputs such as sitemap and native search.

`updated_at` overrides config `markdown.updated_at` for a single page. Invalid strings warn and are ignored for that page.

`featured_image` is optional share-image metadata for generated Open Graph output. It accepts an absolute `https://` or `http://` URL, a root-relative public URL such as `/images/share.png`, or a source-relative path to an existing file inside `public-dir`. Root-relative and source-relative values require `site.url` so Build Pages can generate an absolute image URL. Invalid values warn and are omitted for that page.

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

Raw HTML links may use `target="_blank"` for new-window links. Build Pages keeps `_blank`, removes other `target` values, and ensures `_blank` links include `rel="noopener noreferrer"`. Safe `rel` tokens such as `nofollow`, `ugc`, `sponsored`, and `external` are preserved.

## Markdown Features

Build Pages supports common GitHub-flavored Markdown features such as tables, task lists, strikethrough, fenced code language classes, Mermaid fences, GitHub-style alerts, and safe raw HTML media blocks.

See [Markdown Feature Examples](./examples.md) for a rendered sample page that uses these features together.
