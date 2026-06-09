# Getting Started

Create a Markdown source directory, run Build Pages, and deploy the generated static output.

Build Pages does not require a framework project. You can start with a directory of Markdown files and add config, public assets, or a custom theme only when you need them.

## 1. Create A Source Directory

```txt
docs/
  index.md
```

Create `docs/index.md`:

```md
# My Docs

Welcome to the project documentation.
```

## 2. Build The Site

```bash
npx @zeropress/build-pages --source ./docs --destination ./_site
```

The command:

- discovers Markdown pages under `docs/`
- prepares internal ZeroPress build data
- copies public files
- runs the bundled docs theme
- writes static output to `_site/`

The generated `_site/` directory is the directory you deploy.

Preview the generated site locally with `serve`:

```bash
npx serve _site
```

Open the local URL printed by `serve` to inspect the generated HTML before deploying.

## 3. Add Site Config

Optional site configuration lives under the source directory.

```txt
docs/
  .zeropress/
    config.json
  index.md
```

Example `docs/.zeropress/config.json`:

```json
{
  "$schema": "https://schemas.zeropress.dev/build-pages-config/v0.1/schema.json",
  "version": "0.1",
  "site": {
    "title": "My Docs",
    "description": "Project documentation.",
    "url": "https://example.com",
    "footer": {
      "copyright_text": "© 2026 My Company",
      "attribution": true
    }
  },
  "front_page": {
    "type": "markdown",
    "file": "index.md"
  }
}
```

Use config when you want to set site metadata, menus, footer text, search behavior, or a custom front page source. See [Configuration](../reference/config/index.md) for the full config reference.

## 4. Add Public Files

By default, the source directory is also used as the public passthrough root. For larger projects, keep public files in a separate directory:

```txt
docs/
  index.md
public/
  favicon.svg
  robots.txt
  sitemap.xsl
  images/
```

```bash
npx @zeropress/build-pages --source ./docs --public-dir ./public --destination ./_site
```

See [Generated Files: Public Files](../reference/project-structure/build-output.md#public-files) for public directory behavior and ignored paths.

## 5. Deploy

Deploy the generated `_site/` directory with your static hosting provider.

- For GitHub Pages, Vercel, Cloudflare Pages, Netlify, and provider settings, read [Deployment](../guides/deployment.md).
- For a Node project with `npm install` and `npm run build`, read [Package Manifest](../reference/package-manifest/index.md).
