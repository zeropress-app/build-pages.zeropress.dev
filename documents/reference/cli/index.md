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

## Core Options

- `--source <dir>`: Markdown source directory.
- `--public-dir <dir>`: public passthrough directory.
- `--destination <dir>`: generated output directory.
- `--theme <name>`: bundled theme name.
- `--theme-path <dir>`: custom local theme directory.
- `--config <path>`: config file path.
- `--site-url <url>`: canonical site URL override.

## Behavior Options

- `--skip-untitled-markdown`: skip Markdown without a title.
- `--skip-link-check`: skip post-build internal link checking.
- `--no-copy-markdown-source`: do not copy original Markdown files to output.

Run `zeropress-build-pages --help` for the current command help.
