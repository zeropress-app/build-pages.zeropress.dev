# Build Pages Config

Build Pages config is optional. The default path is:

```txt
<source>/.zeropress/config.json
```

## Example

```json
{
  "$schema": "https://schemas.zeropress.dev/build-pages-config/v0.1/schema.json",
  "version": "0.1",
  "site": {
    "title": "My Docs",
    "description": "Project documentation.",
    "url": "https://example.com",
    "locale": "en-US",
    "footer": {
      "copyright_text": "My Docs",
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

The source config directory is user-authored. Build Pages generated working files are written separately under `.zeropress-build-page/`.

## Top-level Fields

- `$schema`: optional JSON Schema URI for editor support.
- `version`: Build Pages config version. Current value: `0.1`.
- `site`: user-facing site metadata.
- `front_page`: source used for the site root.
- `menus`: navigation data for the selected theme.
- `collections`: group-level reading order generated from Markdown source paths.
- `custom_html`: trusted HTML snippets inserted into generated pages.

Unknown fields are rejected.

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
    "indexing": true,
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
- `description`: site description used by generated metadata.
- `url`: canonical site URL.
- `locale`: generated document/feed locale.
- `logo`: optional theme-facing site logo.
- `search`: enables ZeroPress search artifacts when the theme supports search.
- `expose_generator`: controls `<meta name="generator" content="ZeroPress">`.
- `indexing`: controls fallback `robots.txt` when public `robots.txt` is not provided.
- `footer`: footer text and visible ZeroPress attribution preference.
- `meta`: scalar key-value data for the selected theme.

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
- `html`: use a trusted HTML source file under source `.zeropress/`.

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
          "url": "/",
          "target": "_self",
          "meta": {
            "icon": "home"
          },
          "children": []
        }
      ]
    }
  }
}
```

Menu item `meta` values are scalar values only. Themes can use them for icons, badges, accents, or other presentation hints.

## `collections`

```json
{
  "collections": {
    "foundations": {
      "title": "Foundations",
      "items": [
        "index.md",
        "getting-started/index.md",
        "source-tree/index.md",
        "markdown/index.md"
      ]
    },
    "guides": {
      "title": "Guides",
      "items": [
        "github-action/index.md",
        "cli/index.md",
        "package-json/index.md"
      ]
    }
  }
}
```

Build Pages collection items are source-root relative Markdown paths. They are resolved into preview-data collection references such as `{ "type": "page", "slug": "getting-started" }`.

Collections are independent reading groups. The last item in `collections.foundations` has no next cursor unless another item is listed in the same collection.

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

`custom_html` files are trusted HTML snippets. Keep them inside the source directory.

## Schema

The canonical schema is published at:

```txt
https://schemas.zeropress.dev/build-pages-config/v0.1/schema.json
```
