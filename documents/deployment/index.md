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

## GitHub Pages

Use the [GitHub Action](/github-action/) and upload `_site` with `actions/upload-pages-artifact`.

```yaml
- name: Build ZeroPress Pages
  uses: zeropress-app/zeropress-build-pages@v0
  with:
    source: ./docs
    destination: ./_site
```

## Vercel

Use the `Other` framework preset.

| Setting | Value |
| --- | --- |
| Framework Preset | `Other` |
| Build Command | `npx --yes @zeropress/build-pages --source ./docs --destination ./_site` |
| Output Directory | `_site` |

If you use a separated public directory:

```bash
npx --yes @zeropress/build-pages --source ./docs --public-dir ./public --destination ./_site
```

## Cloudflare Pages

Use the same shape in Cloudflare Pages project settings.

| Setting | Value |
| --- | --- |
| Build command | `npx --yes @zeropress/build-pages --source ./docs --destination ./_site` |
| Build output directory | `_site` |
| Root directory | repository root, unless your site lives in a subdirectory |

For projects with `package.json`, set the build command to:

```bash
npm run build
```

and put the Build Pages command in the package script.

## Netlify

Use `_site` as the publish directory.

```toml
[build]
  command = "npx --yes @zeropress/build-pages --source ./docs --destination ./_site"
  publish = "_site"
```

## Static Host Checklist

- The deployed directory is the Build Pages destination.
- The destination contains `index.html`.
- `sitemap.xml` and fallback `robots.txt` are generated unless public files override them.
- If Pagefind is used, run Pagefind before uploading the final output.
