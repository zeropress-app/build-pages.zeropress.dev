---
title: CLI
description: Run Build Pages from npx or an installed package script.
status: published
meta:
  category: Guides
  chapter: Local build
  prev_url: /github-action/
  prev_label: GitHub Action
  next_url: /package-json/
  next_label: package.json
---

# CLI

Use the CLI directly when you want a local or provider-specific build command.

```bash
npx @zeropress/build-pages --source ./docs --destination ./_site
```

For separated assets:

```bash
npx @zeropress/build-pages \
  --source ./docs \
  --public-dir ./public \
  --destination ./_site
```

## Custom Theme

```bash
npx @zeropress/build-pages \
  --source ./docs \
  --destination ./_site \
  --theme-path ./theme-docs
```

See [CLI Options](/reference/cli/) for the full command reference.
