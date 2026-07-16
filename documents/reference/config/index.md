# Configuration

Configuration is the optional `<source>/.zeropress/config.json` file used by Build Pages.
It controls site metadata, Markdown behavior, the front page, navigation menus, collections, and custom HTML.

## Example

You can also review this site's real [config.json](https://github.com/zeropress-app/build-pages.zeropress.dev/blob/main/documents/.zeropress/config.json) for a working Build Pages config.

```json
{
  "$schema": "https://schemas.zeropress.dev/build-pages-config/v1.0/schema.json",
  "version": "1.0",
  "site": {
    "title": "My Docs",
    "description": "Project documentation.",
    "url": "https://example.com",
    "locale": "en-US",
    "footer": {
      "copyright_text": "© 2026 My Company",
      "attribution": true
    }
  },
  "front_page": {
    "type": "markdown",
    "file": "index.md"
  },
  "menus": {
    "primary": {
      "name": "Primary",
      "items": [
        {
          "title": "Home",
          "url": "/"
        }
      ]
    }
  }
}
```

The source config directory is user-authored. Build Pages generated working files are written separately under `.zeropress-build-pages/`.

## Top-level Fields

- `$schema`: optional JSON Schema URI for editor support.
- `version`: Build Pages config contract version. The current value is `0.7`.
- `site`: user-facing site metadata.
- `markdown`: Markdown source processing options.
- `front_page`: source used for the site root.
- `menus`: navigation data for the selected theme.
- `collections`: group-level reading order generated from Markdown source paths.
- `custom_html`: trusted HTML snippets inserted into generated pages.

Unknown fields are rejected.

Build Pages Config, Preview Data, and Theme Runtime are independent contracts. Build Pages Config 1.0 generates Preview Data 0.7 for Theme Runtime 0.7; its version does not select or imply the version of either downstream contract.

Every config file that exists must declare `"version": "1.0"`; a missing, non-string, or other version is an error. When the implicit default config path does not exist, Build Pages still succeeds with its built-in defaults. A path supplied explicitly through `--config` must exist.

Earlier config versions are not accepted.

## `site`

```json
{
  "site": {
    "title": "My Docs",
    "description": "Project documentation.",
    "url": "https://example.com",
    "locale": "en-US",
    "logo": {
      "src": "/logo.svg",
      "alt": "My Docs"
    },
    "search": true,
    "expose_generator": true,
    "robots": {
      "allow_indexing": true
    },
    "footer": {
      "copyright_text": "My Docs",
      "attribution": true
    },
    "meta": {
      "github_url": "https://github.com/example/project"
    }
  }
}
```

Common fields:

- `title`: site name.
- `description`: optional site description used by front page title text.
- `url`: optional canonical HTTP(S) site origin, such as `https://example.com`. Credentials, paths, queries, fragments, and subdirectory hosting are not supported. A trailing root slash is accepted and the resolved config records `URL.origin`. Omit it or use an empty string while the deployment URL is unknown; without it, Build Pages does not generate `sitemap.xml`.
- `locale`: canonical BCP 47 document locale. Valid non-canonical input is canonicalized; invalid values are rejected.
- `logo`: optional theme-facing site logo.
- `search`: enables ZeroPress search artifacts when the theme supports search.
- `expose_generator`: controls `<meta name="generator" content="ZeroPress">`.
- `robots`: closed `{ "allow_indexing": boolean }` fallback `robots.txt` policy. Omission means indexing is allowed. Legacy `site.indexing` is not valid.
- `footer`: footer text and visible ZeroPress attribution preference.
- `meta`: scalar key-value data for the selected theme.

## `markdown`

```json
{
  "markdown": {
    "updated_at": "git",
    "link_output": "clean"
  }
}
```

`markdown.updated_at` controls optional page update metadata generated from Markdown source files:

- `none`: do not generate update metadata. This is the default.
- `git`: read the latest Git commit date for each Markdown file.

When enabled, Build Pages adds `page.updated_at_iso`. Build-core formats that timestamp as `page.updated_at` for themes.

Use front matter to override one page:

```md
---
updated_at: none
---
```

Build Pages reads plain YAML front matter delimited by `---`. JavaScript front matter, language-specific delimiters, YAML custom tags, anchors, aliases, and block scalars are not supported.

Front matter `updated_at` also accepts `git` or a valid ISO datetime string. Invalid strings are ignored for that page with a warning.

Recommended ISO datetime values include an explicit timezone:

```md
---
updated_at: "2026-06-08T21:20:05Z"
---
```

```md
---
updated_at: "2026-06-09T06:20:05+09:00"
---
```

`Z` means UTC. A numeric offset such as `+09:00` records the source timestamp's local offset. Avoid timezone-less values such as `2026-06-09T06:20:05`, because they may be interpreted differently by different build environments.

Date-only values such as `2026-06-09` are not accepted for `updated_at`.

For working examples, see this site's [home page source](https://github.com/zeropress-app/build-pages.zeropress.dev/blob/main/documents/index.md?plain=1) and [license page source](https://github.com/zeropress-app/build-pages.zeropress.dev/blob/main/documents/license/index.md?plain=1).

For accurate file history in GitHub Actions, configure `actions/checkout` with `fetch-depth: 0`.

Front matter `featured_image` provides optional share-image metadata for a page:

```md
---
featured_image: /images/share.png
---
```

Absolute `https://` or `http://` URLs are passed through. Root-relative public URLs and source-relative paths to existing files inside `public-dir` are converted to absolute URLs with `site.url`. If Build Pages cannot safely resolve the value, it prints a warning and omits `featured_image` for that page.

`markdown.link_output` controls how Build Pages rewrites source-relative links to discovered Markdown files:

- `clean`: use generated clean URLs. This is the default.
- `html`: use explicit HTML file URLs.

Examples:

| Source link | `clean` output | `html` output |
| --- | --- | --- |
| `../guide/index.md` | `/guide/` | `/guide/index.html` |
| `../spec/foo.md` | `/spec/foo` | `/spec/foo.html` |
| `../spec/foo.md#bar` | `/spec/foo#bar` | `/spec/foo.html#bar` |

`markdown.link_output` only controls source-relative `.md` page links. External URLs, root-relative URLs, and anchors are not rewritten by this setting.

Source-relative links to existing files under `public-dir` are handled separately and rewritten to output-root public URLs:

| Source link | Output |
| --- | --- |
| `../../../public/favicon.png` | `/favicon.png` |
| `../../../public/icons.svg#mark` | `/icons.svg#mark` |

The `../` depth shown here is illustrative. Use the real relative path from the current Markdown file to the public asset; the depth depends on where the file lives in the source tree.

Missing public files and files outside `public-dir` are left unchanged.

## `front_page`

```json
{
  "front_page": {
    "type": "markdown",
    "file": "index.md"
  }
}
```

Supported `type` values:

- `theme_index`: render the theme's `index.html`.
- `markdown`: use a Markdown source file as the front page.
- `html`: use a trusted HTML source file. It must live under the source `.zeropress/` directory.

If `front_page` is omitted, Build Pages uses `index.md` as the front page when that file exists in the source root. If `index.md` does not exist, Build Pages falls back to `theme_index`.

Generated Page references use the NFC-normalized effective route path, not the
leaf slug. A Markdown front page is therefore materialized as
`{ "type": "page", "page_path": "reference/guide" }`. The Page's own
`slug` is its leaf route slug, so identical leaf slugs are valid under different
effective paths; duplicate effective paths remain an error.

For raw HTML front pages:

```json
{
  "front_page": {
    "type": "html",
    "file": ".zeropress/index.html",
    "layout": false
  }
}
```

## `menus`

```json
{
  "menus": {
    "primary": {
      "name": "Primary",
      "items": [
        {
          "title": "Home",
          "url": "/"
        },
        {
          "title": "Guides",
          "url": "/guides/",
          "meta": {
            "accent": "green"
          },
          "children": [
            {
              "title": "Deployment",
              "url": "/guides/deployment"
            },
            {
              "title": "Themes",
              "url": "/guides/themes"
            }
          ]
        },
        {
          "title": "npm",
          "url": "https://www.npmjs.com/package/@zeropress/build-pages",
          "target": "_blank"
        }
      ]
    }
  }
}
```

Menu item `meta` values are scalar values only. Themes can use them for icons, badges, accents, or other presentation hints.

Menu `children` are nested menu items. The selected theme decides how many child levels it renders and how they appear. Use real generated URLs for menu items; if a page does not exist yet, leave it out of the menu instead of adding a placeholder URL.

Omitting `menus` materializes the built-in `primary` menu with Home. An explicit
`"menus": {}` opts out and materializes no menus. When a menu omits `name`, its
menu id is written as the resolved name. Menu URLs must be either safe
single-slash root-relative URLs or credential-free HTTP(S) URLs; query and
fragment are allowed, while bare/dot-relative paths, protocol-relative URLs,
dot segments, backslashes, whitespace/control characters, and malformed
percent escapes are rejected.

## `collections`

```json
{
  "collections": {
    "foundations": {
      "title": "Foundations",
      "items": [
        "index.md",
        "getting-started/index.md"
      ]
    },
    "guides": {
      "title": "Guides",
      "items": [
        "guides/deployment.md",
        "guides/themes.md",
        "guides/markdown/index.md"
      ]
    }
  }
}
```

Collections are independent reading groups. Build Pages collection items are source-root relative Markdown paths. In generated Preview Data, each Page item becomes `{ "type": "page", "path": "guides/deployment" }` using its effective route path, so Pages under different parents may share a leaf slug without ambiguity. Omitting `collections` and an explicit `{}` both materialize no collections; when a collection omits `title`, its collection id is written as the resolved title.

All configured source file paths are exact source-root relative paths. Build
Pages does not trim them, convert backslashes, or change extension case.
Leading/trailing whitespace, control characters, empty or dot segments,
parent traversal, query strings, and fragments are rejected.

## `custom_html`

```json
{
  "custom_html": {
    "head_end": {
      "file": ".zeropress/head-end.html"
    },
    "body_end": {
      "file": ".zeropress/body-end.html"
    }
  }
}
```

`custom_html` files are trusted HTML snippets. They must live under the source `.zeropress/` directory. Each file must contain non-whitespace content and may contain at most 65,536 Unicode code points.

The authoring config keeps the `{ "file": "..." }` reference shown above. Build Pages reads the file as UTF-8, preserves its raw whitespace, and materializes it in Preview Data as a direct string such as:

```json
{
  "custom_html": {
    "head_end": "<meta name=\"site-verification\" content=\"...\">"
  }
}
```

On theme-rendered pages, `head_end` is inserted before `</head>` and `body_end` before `</body>`. A configured target missing from the rendered document is a build error. Standalone HTML front pages are not modified by this injection pipeline.

## Schema

The canonical schema is published at:
[https://schemas.zeropress.dev/build-pages-config/v1.0/schema.json](https://schemas.zeropress.dev/build-pages-config/v1.0/schema.json)
