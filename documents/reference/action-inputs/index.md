---
title: Action Inputs
description: GitHub Action inputs supported by zeropress-build-pages.
status: published
meta:
  category: Reference
  chapter: GitHub Action
  prev_url: /reference/cli/
  prev_label: CLI Options
  next_url: /reference/config/
  next_label: Build Pages Config
---

# Action Inputs

```yaml
- name: Build ZeroPress Pages
  uses: zeropress-app/zeropress-build-pages@v0
  with:
    source: ./docs
    public-dir: ./public
    destination: ./_site
```

## Inputs

- `source`: Markdown source directory.
- `public-dir`: public passthrough directory.
- `destination`: generated output directory.
- `theme`: bundled theme name.
- `theme-path`: custom local theme directory.
- `config`: config file path.
- `site-url`: canonical site URL override.
- `skip-untitled-markdown`: skip untitled Markdown pages.
- `skip-link-check`: skip internal link checking.
- `copy-markdown-source`: copy original Markdown files to output.

Broken internal links are reported as warnings and do not fail the build.
