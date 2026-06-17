# Themes

A theme controls how Build Pages output looks and behaves.

Build Pages discovers Markdown, reads optional site config, prepares ZeroPress build data, and passes that data to a ZeroPress theme. The theme provides layouts, partials, CSS, JavaScript, navigation markup, search UI, and other presentation details.

```txt
Markdown documents + Build Pages config + ZeroPress theme
  -> static HTML output
```

## Bundled Themes

Use `--theme` to select a bundled theme.

```bash
npx --yes @zeropress/build-pages \
  --source ./docs \
  --destination ./_site \
  --theme docs2
```

Allowed bundled theme values:

- `docs`
- `docs1`
- `docs2`

`docs` is the default bundled value and currently aliases `docs1`.

For rendered previews, example repositories, and theme source links, see <a href="https://zeropress.page/" target="_blank">zeropress.page</a>.

Bundled theme source files are published in the [`themes` directory](https://github.com/zeropress-app/zeropress-build-pages/tree/main/themes).

## Custom Themes

Use `--theme-path` when your project has a local theme directory.

```bash
npx --yes @zeropress/build-pages \
  --source ./docs \
  --destination ./_site \
  --theme-path ./theme-docs
```

`--theme-path` takes precedence over `--theme`.

## Create A Theme

Use `@zeropress/create-theme` when you want to scaffold a standalone theme project.

```bash
npx @zeropress/create-theme --name my-docs-theme --template docs
```

The generated theme can be edited locally and passed to Build Pages with `--theme-path`.

## Theme Contract

Build Pages themes are regular ZeroPress themes. They use the same `theme.json`, template syntax, partials, and asset rules as other ZeroPress themes.

For the full authoring guide, see [ZeroPress Theme Authoring](https://zeropress.dev/theme-authoring/).
