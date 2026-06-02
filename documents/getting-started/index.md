# Getting Started

Create a Markdown source directory, run Build Pages, and deploy the generated static output.

Build Pages does not require a framework project. A repository can start with only Markdown files.

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
      "copyright_text": "My Docs",
      "attribution": true
    }
  },
  "front_page": {
    "type": "markdown",
    "file": "index.md"
  }
}
```

Use config when you want to set site metadata, menus, footer text, search behavior, or a custom front page source.

## 4. Add Public Files

By default, the source directory is also used as the public passthrough root. For larger projects, keep public files in a separate directory:

```txt
docs/
  index.md
public/
  favicon.svg
  robots.txt
  images/
```

```bash
npx @zeropress/build-pages \
  --source ./docs \
  --public-dir ./public \
  --destination ./_site
```

`favicon.*`, `robots.txt`, and `sitemap.xsl` are discovered from the public directory.

## 5. Deploy

Deploy `_site/` with your host.

- GitHub Pages: use the [GitHub Action](/github-action/).
- Vercel, Cloudflare Pages, Netlify: set the build command and output directory in project settings.
- Local package workflow: use a [package.json script](/package-json/).

## Next Step

Read [Source Tree](/source-tree/) before adding assets, themes, or deployment settings.
