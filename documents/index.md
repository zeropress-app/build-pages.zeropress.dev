---
updated_at: none
---

# Build Markdown docs into static sites

ZeroPress Build Pages turns a Markdown source directory, optional public assets, and a ZeroPress theme into static HTML output.

Use it for documentation sites, project guides, and lightweight content sites deployed at the origin root on GitHub Pages, Cloudflare Pages, Netlify, Vercel, or another static host. Subdirectory mount paths are not supported.

## How It Fits Together

Build Pages is the Markdown front end for the ZeroPress static build pipeline. You bring Markdown; Build Pages discovers pages, reads optional config, and hands prepared data to a ZeroPress theme that renders the final HTML.

```txt
Markdown documents + Build Pages config + ZeroPress theme
  -> static HTML output
```

You do not need a framework project to start. A single `index.md` is enough for a first build, and you add config, public assets, or a custom theme only when you need them. See [Getting Started](./getting-started/index.md) for the first build, or [Themes](./guides/themes.md) for how themes consume the build data.

## Common Workflows

Most projects use one of these entry points:

### Direct npx Command

Use this when you want the shortest local build or provider build command.

```bash
npx --yes @zeropress/build-pages --source ./docs --destination ./_site
```

### GitHub Action

Use this when an origin-root GitHub Pages site should build and deploy from CI. Supported Pages deployments use a custom domain or a user or organization site; Project Pages under `/<repository>/` are not supported.

```yaml
- name: Build ZeroPress Pages
  uses: zeropress-app/zeropress-build-pages@v0
  with:
    source: ./docs
    destination: ./_site
```

### package.json Script

Use this when you want the Build Pages package recorded in `package-lock.json` and reused through `npm run build`.

```bash
npm install --save-dev @zeropress/build-pages
```

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

See [Package Manifest](./reference/package-manifest/index.md) for public assets, custom themes, and Pagefind postbuild examples.
