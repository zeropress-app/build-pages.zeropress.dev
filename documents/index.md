---
updated_at: none
---

# Build Markdown docs into static sites

ZeroPress Build Pages turns a Markdown source directory, optional public assets, and a ZeroPress theme into static HTML output.

Use it for documentation sites, project guides, and lightweight content sites that should deploy cleanly to GitHub Pages, Cloudflare Pages, Netlify, Vercel, or any static host.

## Start Here

- [Getting Started](getting-started/index.md): build your first Markdown-source site.
- [Source Tree](source-tree/index.md): understand the source, public, theme, and output directories.
- [Markdown Pages](markdown/index.md): learn how Markdown files become generated routes.
- [GitHub Action](github-action/index.md): use the hosted action in CI.
- [CLI](cli/index.md): run the package directly with `npx` or a local dependency.

## Common Workflows

Most projects use one of these entry points:

```bash
npx @zeropress/build-pages --source ./docs --destination ./_site
```

```yaml
- name: Build ZeroPress Pages
  uses: zeropress-app/zeropress-build-pages@v0
  with:
    source: ./docs
    destination: ./_site
```

## Reference

- [CLI Options](reference/cli/index.md)
- [Action Inputs](reference/action-inputs/index.md)
- [Build Pages Config](reference/config/index.md)
- [Generated Files](reference/generated-files/index.md)
- [Static Search](static-search/index.md)
- [Troubleshooting](troubleshooting/index.md)
