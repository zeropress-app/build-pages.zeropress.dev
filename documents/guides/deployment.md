# Deployment

Build Pages writes plain static files to the destination directory. Deploy that directory with your hosting provider.

## Provider Shape

Most providers need two values:

- Build command: `npx --yes @zeropress/build-pages --source ./docs --public-dir ./public --destination ./_site`
- Output directory: `_site`

```bash
npx --yes @zeropress/build-pages --source ./docs --public-dir ./public --destination ./_site
```

Adjust `--source` and `--public-dir` to match your repository. If public assets live inside the source directory, omit `--public-dir`.

## GitHub Pages

Use the [GitHub Action](../reference/github-action/index.md) and upload `_site` with `actions/upload-pages-artifact`.

```yaml
- name: Build ZeroPress Pages
  uses: zeropress-app/zeropress-build-pages@v0
  with:
    source: ./docs
    destination: ./_site
```

The bundled Action is the recommended GitHub Pages path. If you prefer a plain npm command inside your own workflow, run Build Pages directly:

```yaml
- name: Build ZeroPress Pages
  run: npx --yes @zeropress/build-pages --source ./docs --public-dir ./public --destination ./_site
```

See [GitHub Action](../reference/github-action/index.md) for full workflow examples.

## Vercel

Use the `Other` framework preset.

| Setting | Value |
| --- | --- |
| Application Preset (Framework Preset) | `Other` |
| Build Command | `npx --yes @zeropress/build-pages --source ./docs --public-dir ./public --destination ./_site` |
| Output Directory | `_site` |

If your project does not have a separate public asset directory, use:

```bash
npx --yes @zeropress/build-pages --source ./docs --destination ./_site
```

Vercel does not resolve every extensionless HTML path the same way as GitHub Pages, Cloudflare Pages, or Netlify. Add a `vercel.json` file at the Vercel project root and commit it:

```json
{
  "cleanUrls": true
}
```

This tells Vercel to serve generated files such as `foo/bar.html` when a visitor opens `/foo/bar`. See the [`zeropress.dev` vercel.json](https://github.com/zeropress-app/zeropress.dev/blob/main/vercel.json) for a minimal working example.

For a production-style preview site that also sets the build command, output directory, ignored rebuild rule, and `cleanUrls`, see the [`plain.zeropress.page` vercel.json](https://github.com/zeropress-app/zeropress.page/blob/main/preview/plain.zeropress.page/vercel.json).

If you do not want to add provider config, use explicit HTML links instead. Set this in your Build Pages source config at `<source>/.zeropress/config.json`:

```json
{
  "markdown": {
    "link_output": "html"
  }
}
```

This changes rewritten source-relative `.md` links from clean URLs to explicit `.html` URLs. It does not change generated output file paths, root-relative links, external links, or public asset URLs. See [Configuration: Markdown](../reference/config/index.md#markdown) for the detailed `link_output` rules.

## Cloudflare Pages

Use the same shape in Cloudflare Pages project settings.

| Setting | Value |
| --- | --- |
| Framework preset | `None` |
| Build command | `npx --yes @zeropress/build-pages --source ./docs --public-dir ./public --destination ./_site` |
| Build output directory | `_site` |

## Netlify

Build settings:

| Setting | Value |
| --- | --- |
| Build command | `npx --yes @zeropress/build-pages --source ./docs --public-dir ./public --destination ./_site` |
| Publish directory | `_site` |

## Optional Postbuild Steps

Build Pages writes static files first. Optional tools can run after the Build Pages command and before the final upload.

If you want to use Pagefind instead of native ZeroPress search, run Pagefind after the Build Pages command. See [Static Search](../guides/static-search.md) for the adapter and copy commands.

If you want to format generated HTML before deployment, run Prettier after the Build Pages command:

```bash
npx --yes prettier@3.8.3 --ignore-path /dev/null --write "./_site/**/*.html"
```

For deployment convenience, you can also keep the Build Pages command in a tracked shell script such as [`build.sh`](https://github.com/zeropress-app/build-pages.zeropress.dev/blob/main/build.sh), then use the same script locally and in provider build settings.

## Static Host Checklist

- The deployed directory is the Build Pages destination.
- The destination contains `index.html`.
- `sitemap.xml` is generated when `site.url` is configured.
- fallback `robots.txt` is generated unless a public `robots.txt` overrides it.
- If postbuild tools are used, run them before uploading the final output.
