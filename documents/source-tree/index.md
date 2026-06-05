# Source Tree

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

## Output Directory

The destination directory receives generated HTML, theme assets, copied public files, and ZeroPress special files such as `sitemap.xml`.
