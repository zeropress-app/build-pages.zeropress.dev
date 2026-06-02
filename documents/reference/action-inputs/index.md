# Action Inputs

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

For GitHub Pages, this directory is passed to `actions/upload-pages-artifact`.

### `theme`

Bundled theme name.

Default:

```txt
docs
```

`docs1` is an alias for `docs`.

### `theme-path`

Custom local ZeroPress theme directory.

```yaml
with:
  theme-path: ./theme-docs
```

`theme-path` takes precedence over `theme`.

### `config`

Config file path.

Default:

```txt
<source>/.zeropress/config.json
```

### `site-url`

Canonical site URL override.

Use this when the deployment URL should override the config file.

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
