---
title: Build Pages Config
description: Configure site metadata, menus, footer text, and custom HTML.
status: published
meta:
  category: Reference
  chapter: Configuration
  prev_url: /reference/action-inputs/
  prev_label: Action Inputs
  next_url: /reference/generated-files/
  next_label: Generated Files
---

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
