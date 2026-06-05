# Deployment

Build Pages writes plain static files to the destination directory. Deploy that directory with your hosting provider.

## Provider Shape

Most providers need two values:

- Build command: `bash ./build.sh`
- Output directory: `_site`

This site uses a tracked `build.sh` so local builds and provider builds use the same command.

```bash
bash ./build.sh
```

The script runs Build Pages with pinned package versions, then builds the Pagefind index and swaps the search adapter before deployment.

## GitHub Pages

Use the [GitHub Action](../github-action/index.md) and upload `_site` with `actions/upload-pages-artifact`.

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
| Build Command | `bash ./build.sh` |
| Output Directory | `_site` |

For a project that does not use a script file, the equivalent direct command is:

```bash
npx --yes @zeropress/build-pages@0.6.3 --source ./docs --public-dir ./public --destination ./_site
```

Vercel does not resolve every extensionless HTML path the same way as GitHub Pages, Cloudflare Pages, or Netlify. The first recommendation is to enable Vercel clean URLs:

```json
{
  "cleanUrls": true
}
```

If you want provider-independent explicit HTML links instead, set Build Pages config:

```json
{
  "markdown": {
    "link_output": "html"
  }
}
```

This only changes rewritten Markdown links. It does not change generated output file paths.

## Cloudflare Pages

Use the same shape in Cloudflare Pages project settings.

| Setting | Value |
| --- | --- |
| Build command | `bash ./build.sh` |
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
  command = "bash ./build.sh"
  publish = "_site"
```

Equivalent UI settings:

| Setting | Value |
| --- | --- |
| Build command | `bash ./build.sh` |
| Publish directory | `_site` |

## Script Contents

A provider-friendly build script should stay independent from local package paths:

```sh
#!/usr/bin/env sh
set -eu

SCRIPT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
SITE_DIR="$SCRIPT_DIR/_site"

npx --yes @zeropress/build-pages@0.6.3 \
  --source "$SCRIPT_DIR/documents" \
  --destination "$SITE_DIR" \
  --public-dir "$SCRIPT_DIR/public" \
  --theme-path "$SCRIPT_DIR/theme-docs2/theme"

npx --yes pagefind@1.4.0 \
  --site "$SITE_DIR" \
  --output-subdir _zeropress/pagefind

cp "$SITE_DIR/_zeropress/search_pagefind.js" "$SITE_DIR/_zeropress/search.js"
rm "$SITE_DIR/_zeropress/search.json"
```

Use a separate maintainer-only script if you need to test unpublished local packages.

## Static Host Checklist

- The deployed directory is the Build Pages destination.
- The destination contains `index.html`.
- GitHub Pages, Cloudflare Pages, and Netlify work with the default `markdown.link_output: "clean"` links.
- `sitemap.xml` and fallback `robots.txt` are generated unless public files override them.
- If Pagefind is used, run Pagefind before uploading the final output.
