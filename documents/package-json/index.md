# package.json Script

Use a package script when your project already has a Node.js toolchain.

This is the most reproducible way to run Build Pages outside GitHub Actions because the package version is recorded in `package-lock.json`.

## Install

```bash
npm install --save-dev @zeropress/build-pages
```

## Add A Build Script

```json
{
  "scripts": {
    "build": "zeropress-build-pages --source ./docs --destination ./_site"
  }
}
```

Then run:

```bash
npm run build
```

## Separate Public Files

If Markdown source files and public assets are separate, add `--public-dir`.

```json
{
  "scripts": {
    "build": "zeropress-build-pages --source ./docs --public-dir ./public --destination ./_site"
  }
}
```

The source directory contains Markdown pages and optional `.zeropress/config.json`. The public directory is copied to the generated output root.

## Custom Theme

```json
{
  "scripts": {
    "build": "zeropress-build-pages --source ./docs --public-dir ./public --destination ./_site --theme-path ./theme-docs"
  }
}
```

`--theme-path` takes precedence over bundled `--theme`.

## Add Post-build Search

For Pagefind, keep the ZeroPress build as the first step and run Pagefind afterward.

```json
{
  "scripts": {
    "build": "npm run build:zeropress && npm run build:search",
    "build:zeropress": "zeropress-build-pages --source ./docs --public-dir ./public --destination ./_site",
    "build:search": "pagefind --site ./_site --output-subdir _zeropress/pagefind && cp ./_site/_zeropress/search_pagefind.js ./_site/_zeropress/search.js && rm ./_site/_zeropress/search.json"
  }
}
```
