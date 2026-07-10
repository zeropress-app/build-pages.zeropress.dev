# Action Inputs

Action inputs configure the `zeropress-app/zeropress-build-pages@v0` GitHub Action.
Use them to select the Markdown source directory, public asset directory, output directory, theme, and optional build behavior in workflow YAML.

```yaml
- name: Build ZeroPress Pages
  uses: zeropress-app/zeropress-build-pages@v0
  with:
    source: ./docs
    public-dir: ./public
    destination: ./_site
```

## Inputs

### `source`

Markdown source directory.

Default:

```txt
./docs
```

This directory contains Markdown pages and optional `.zeropress/config.json`.

### `public-dir`

Public passthrough directory.

Default: same as `source`.

If set explicitly, the directory must exist.

```yaml
with:
  source: ./docs
  public-dir: ./public
  destination: ./_site
```

### `destination`

Generated static output directory.

Default:

```txt
./_site
```

For a supported origin-root GitHub Pages site, this directory is passed to `actions/upload-pages-artifact`.

### `theme`

Bundled theme name.

Default:

```txt
docs
```

Available bundled theme values:

| Value | Meaning |
| --- | --- |
| `docs` | Default bundled documentation theme. Alias for `docs1`. |
| `docs1` | Top-navigation theme for small docs sites, package manuals, and compact reference pages. |
| `docs2` | Sidebar theme for larger docs sites with command palette search, page TOC, and collection-based previous/next navigation. |

### `theme-path`

Custom local ZeroPress theme directory.

```yaml
with:
  theme-path: ./theme-docs
```

`theme-path` takes precedence over `theme`. Custom themes must follow the ZeroPress theme contract; see [Theme Authoring](https://zeropress.dev/theme-authoring/).

### `config`

Config file path.

Default:

```txt
<source>/.zeropress/config.json
```

### `site-url`

Origin-root canonical HTTP(S) URL override.

Use this when the deployment URL should override the config file. The URL must not contain a path, query, or fragment. Omit this input when the deployment URL is not known. Base paths and subdirectory hosting are not supported.

### `skip-untitled-markdown`

Skips Markdown files without a title instead of failing.

Default:

```txt
false
```

### `skip-link-check`

Skips internal link checking after build.

Default:

```txt
false
```

Broken internal links are reported as warnings and do not fail the build.

### `copy-markdown-source`

Copies original Markdown files to the generated output.

Default:

```txt
true
```

Set to `false` when original Markdown source should not be published.

```yaml
with:
  copy-markdown-source: false
```

When false, public passthrough `.md` files are also skipped.
