---
updated_at: none
---

# Build Markdown docs into static sites

ZeroPress Build Pages turns a Markdown source directory, optional public assets, and a ZeroPress theme into static HTML output.

Use it for documentation sites, project guides, and lightweight content sites that should deploy cleanly to GitHub Pages, Cloudflare Pages, Netlify, Vercel, or any static host.

## Common Workflows

Most projects use one of these entry points:

Use the direct `npx` command when you want the shortest local build or provider build command:

```bash
npx --yes @zeropress/build-pages --source ./docs --destination ./_site
```

Use the hosted GitHub Action when GitHub Pages should build and deploy the site from CI:

```yaml
- name: Build ZeroPress Pages
  uses: zeropress-app/zeropress-build-pages@v0
  with:
    source: ./docs
    destination: ./_site
```

Use a Node project when you want the Build Pages package recorded in `package-lock.json` and reused through `npm run build`:

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

See [package.json Script](package-json/index.md) for public assets, custom themes, and Pagefind postbuild examples.
