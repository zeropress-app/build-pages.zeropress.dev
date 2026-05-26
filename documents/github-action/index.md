---
title: GitHub Action
description: Build a ZeroPress site in GitHub Actions.
status: published
meta:
  category: Guides
  chapter: CI
  prev_url: /markdown/
  prev_label: Markdown Pages
  next_url: /cli/
  next_label: CLI
---

# GitHub Action

Use the GitHub Action when your site should build in a repository workflow.

```yaml
- name: Build ZeroPress Pages
  uses: zeropress-app/zeropress-build-pages@v0
  with:
    source: ./docs
    destination: ./_site
```

The action builds static files only. Uploading and deploying are handled by your hosting provider's own action or CLI.

## Common Inputs

- `source`: Markdown source directory. Default: `./docs`.
- `public-dir`: public passthrough directory. Default: same as `source`.
- `destination`: generated output directory. Default: `./_site`.
- `theme`: bundled theme name. Default: `docs`.
- `theme-path`: custom local theme directory.

See [Action Inputs](/reference/action-inputs/) for the full list.
