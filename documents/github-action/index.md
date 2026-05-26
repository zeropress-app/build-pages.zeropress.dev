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

## Minimal Action Step

```yaml
- name: Build ZeroPress Pages
  uses: zeropress-app/zeropress-build-pages@v0
  with:
    source: ./docs
    destination: ./_site
```

The action builds static files only. Uploading and deploying are handled by your hosting provider's own action or CLI.

## Full GitHub Pages Workflow

```yaml
name: Build and Deploy Docs to GitHub Pages

on:
  push:
    branches: ["main"]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v6

      - name: Setup Pages
        uses: actions/configure-pages@v6

      - name: Build ZeroPress Pages
        uses: zeropress-app/zeropress-build-pages@v0
        with:
          source: ./docs
          destination: ./_site

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v5

  deploy:
    runs-on: ubuntu-latest
    needs: build
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v5
```

## Separate Public Directory

Use `public-dir` when assets live outside Markdown source files.

```yaml
- name: Build ZeroPress Pages
  uses: zeropress-app/zeropress-build-pages@v0
  with:
    source: ./docs
    public-dir: ./public
    destination: ./_site
```

## Custom Theme

Use `theme-path` for a local ZeroPress theme.

```yaml
- name: Build ZeroPress Pages
  uses: zeropress-app/zeropress-build-pages@v0
  with:
    source: ./docs
    public-dir: ./public
    destination: ./_site
    theme-path: ./theme-docs
```

`theme-path` takes precedence over the bundled `theme` input.

## Common Inputs

- `source`: Markdown source directory. Default: `./docs`.
- `public-dir`: public passthrough directory. Default: same as `source`.
- `destination`: generated output directory. Default: `./_site`.
- `theme`: bundled theme name. Default: `docs`.
- `theme-path`: custom local theme directory.

See [Action Inputs](/reference/action-inputs/) for the full list.

## Post-build Steps

Because Build Pages only writes static files, extra steps can run after the build and before upload.

```yaml
- name: Format generated HTML
  run: npx --yes prettier@3.8.3 --write "./_site/**/*.html"

- name: Build Pagefind index
  run: |
    npx --yes pagefind@1.4.0 \
      --site ./_site \
      --output-subdir _zeropress/pagefind
    cp ./_site/_zeropress/search_pagefind.js ./_site/_zeropress/search.js
    rm ./_site/_zeropress/search.json
```

Post-build tools are optional. Keep them after the Build Pages step and before the upload/deploy step.
