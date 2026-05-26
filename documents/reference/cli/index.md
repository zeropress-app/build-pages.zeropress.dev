---
title: CLI Options
description: Command-line options supported by zeropress-build-pages.
status: published
meta:
  category: Reference
  chapter: CLI
  prev_url: /reference/
  prev_label: Reference Hub
  next_url: /reference/action-inputs/
  next_label: Action Inputs
---

# CLI Options

```bash
zeropress-build-pages --source ./docs --destination ./_site
```

`--source` and `--destination` are required for CLI usage. Environment variables are not the public interface for Build Pages.

## Core Options

### `--source <dir>`

Dedicated source directory. This directory contains Markdown pages and optional source config files.

Default for GitHub Action usage is `./docs`; CLI users should pass it explicitly.

```bash
zeropress-build-pages --source ./docs --destination ./_site
```

The repository root is not accepted as `source`.

### `--public-dir <dir>`

Public passthrough directory. Files from this directory are copied to the output root.

```bash
zeropress-build-pages --source ./docs --public-dir ./public --destination ./_site
```

If omitted, `public-dir` defaults to `source`.

When set explicitly, `public-dir` must exist and must be a directory. It cannot be a file, symlink, current working directory, destination directory, selected theme directory, or Build Pages internal working directory.

### `--destination <dir>`

Generated static output directory.

```bash
zeropress-build-pages --source ./docs --destination ./_site
```

The destination is created when missing. If it already exists as a directory, Build Pages writes the generated output there. If it exists as a file, the build fails.

### `--theme <name>`

Bundled theme name.

```bash
zeropress-build-pages --source ./docs --destination ./_site --theme docs
```

The default bundled theme is `docs`. `docs1` is an alias for `docs`.

### `--theme-path <dir>`

Custom local ZeroPress theme directory.

```bash
zeropress-build-pages --source ./docs --destination ./_site --theme-path ./theme-docs
```

`--theme-path` takes precedence over `--theme`.

### `--config <path>`

Build Pages config file path.

```bash
zeropress-build-pages --source ./docs --destination ./_site --config ./docs/.zeropress/config.json
```

Default:

```txt
<source>/.zeropress/config.json
```

Missing config falls back to defaults. Malformed config fails with a friendly error.

### `--site-url <url>`

Canonical site URL override.

```bash
zeropress-build-pages --source ./docs --destination ./_site --site-url https://example.com
```

This overrides `site.url` from config for generated canonical URLs, sitemap URLs, and related metadata.

## Behavior Options

### `--skip-untitled-markdown`

Skip Markdown files that cannot produce a page title.

Without this option, a Markdown file without front matter `title`, ATX H1, or Setext H1 fails the build.

### `--skip-link-check`

Skip post-build internal link checking.

By default, Build Pages checks generated HTML for broken internal links after build. Broken links are reported as warnings and do not fail the build.

### `--no-copy-markdown-source`

Do not copy original Markdown files to the generated output.

Default behavior copies original Markdown files and exposes source Markdown links when the theme renders them.

When disabled:

- generated HTML pages still exist
- source `.md` files are not copied to output
- public passthrough `.md` files are also skipped
- bundled docs theme hides `View this page as Markdown` links

Run `zeropress-build-pages --help` for the current command help.
