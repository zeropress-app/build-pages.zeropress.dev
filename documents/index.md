# ZeroPress Build Pages

ZeroPress Build Pages turns a Markdown source directory, optional public assets, and a ZeroPress theme into static HTML output.

It is designed for documentation sites, project guides, and lightweight content sites that should deploy cleanly to GitHub Pages, Cloudflare Pages, Netlify, Vercel, or any static host.

## Start Here

- [Getting Started](/getting-started/): build your first Markdown-source site.
- [Source Tree](/source-tree/): understand the source, public, theme, and output directories.
- [Markdown Pages](/markdown/): learn how Markdown files become generated routes.
- [GitHub Action](/github-action/): use the hosted action in CI.
- [CLI](/cli/): run the package directly with `npx` or a local dependency.

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

- [CLI Options](/reference/cli/)
- [Action Inputs](/reference/action-inputs/)
- [Build Pages Config](/reference/config/)
- [Generated Files](/reference/generated-files/)
- [Static Search](/static-search/)
- [Troubleshooting](/troubleshooting/)
