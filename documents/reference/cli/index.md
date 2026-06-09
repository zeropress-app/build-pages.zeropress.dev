# CLI

Use the CLI directly when you want a local or provider-specific build command.

## npx

```bash
npx @zeropress/build-pages --source ./docs --destination ./_site
```

Use `npx` when the project does not need a `package.json`.

## Separate Public Directory

For separated assets:

```bash
npx @zeropress/build-pages \
  --source ./docs \
  --public-dir ./public \
  --destination ./_site
```

The source directory is for Markdown and Build Pages config. The public directory is copied to the output root.

## Custom Theme

```bash
npx @zeropress/build-pages \
  --source ./docs \
  --destination ./_site \
  --theme-path ./theme-docs
```

`--theme-path` takes precedence over bundled themes. Custom themes must follow the ZeroPress theme contract; see [Theme Authoring](https://zeropress.dev/theme-authoring/).

## Bundled Themes

Use `--theme` when you want one of the bundled documentation themes.

| Value | Meaning |
| --- | --- |
| `docs` | Default bundled documentation theme. Alias for `docs1`. |
| `docs1` | Top-navigation theme for small docs sites, package manuals, and compact reference pages. |
| `docs2` | Sidebar theme for larger docs sites with command palette search, page TOC, and collection-based previous/next navigation. |

```bash
npx @zeropress/build-pages \
  --source ./docs \
  --destination ./_site \
  --theme docs2
```

## Required Paths

`--source` must point to a directory. If `--public-dir` is provided, it must also point to an existing directory.

`--destination` is created or overwritten by the build. If the destination path is a file, the command fails.

## Useful Local Checks

Run a build, then inspect the generated output:

```bash
npx @zeropress/build-pages --source ./docs --destination ./_site
```

```bash
find ./_site -maxdepth 2 -type f
```

For a local preview, use any static file server:

```bash
npx serve ./_site
```

See [CLI Options](./cli-options.md) for the full command reference.
