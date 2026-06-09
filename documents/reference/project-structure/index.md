# Project Structure

Build Pages separates authoring files from generated output.

```txt
docs/
  index.md
  guide.md
  .zeropress/
    config.json

public/
  favicon.svg
  robots.txt

_site/
  generated output
```

## Source Directory

The source directory contains Markdown pages and optional `.zeropress/config.json`.

```bash
zeropress-build-pages --source ./docs --destination ./_site
```

## Public Directory

The public directory contains site-owned files copied to the output root.

```bash
zeropress-build-pages --source ./docs --public-dir ./public --destination ./_site
```

If `--public-dir` is omitted, the source directory is also used as the public passthrough root.

Markdown pages can link to public assets with source-relative file paths:

```md
![Logo](../public/logo.svg)
```

When that file exists under `public-dir`, Build Pages rewrites the generated HTML to the output-root URL, such as `/logo.svg`. This keeps links usable in repository browsing and editors without leaking the source tree layout into the deployed site.

Root-level public files named `favicon.ico`, `favicon.svg`, `favicon.png`, and `apple-touch-icon.png` are copied to the destination and auto-injected into generated HTML `<head>` output.

Root-level public `robots.txt` is copied as-is and prevents fallback `robots.txt` generation.

Root-level public `sitemap.xsl` is copied to the destination. When ZeroPress generates `sitemap.xml`, it auto-discovers that file and adds an XML stylesheet processing instruction for `/sitemap.xsl`.

If `public-dir` is inside `source`, Build Pages excludes that public subtree from Markdown page discovery.

## Ignored Paths

Ignored while copying public passthrough files and discovering Markdown pages:

- hidden paths such as `.git`, `.env`, and `.zeropress`
- `node_modules`
- `Thumbs.db`
- `*.key`
- `*.pem`
- symlinks

Additional Markdown discovery ignores:

- path segments starting with `_`
- path segments starting with `#`
- path segments ending with `~`
- path segments equal to `vendor`

## Output Directory

The destination directory receives generated HTML, theme assets, copied public files, and ZeroPress special files. `sitemap.xml` is generated when `site.url` is configured.
