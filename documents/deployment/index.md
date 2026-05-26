---
title: Deployment
description: Deploy generated Build Pages output to static hosting providers.
status: published
meta:
  category: Guides
  chapter: Hosting
  prev_url: /package-json/
  prev_label: package.json
  next_url: /dogfooding/
  next_label: Dogfooding
---

# Deployment

Build Pages writes plain static files to the destination directory. Deploy that directory with your hosting provider.

## Provider Shape

Most providers need two values:

- Build command: `npx --yes @zeropress/build-pages --source ./docs --destination ./_site`
- Output directory: `_site`

If your public assets live outside the source directory:

```bash
npx --yes @zeropress/build-pages \
  --source ./docs \
  --public-dir ./public \
  --destination ./_site
```

## Provider Examples

- GitHub Pages: use the ZeroPress action, then upload `_site`.
- Vercel: use the `Other` framework preset and `_site` output directory.
- Cloudflare Pages: set the build command and output directory in project settings.
- Netlify: set the build command and publish directory.
