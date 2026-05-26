---
title: package.json Script
description: Use Build Pages as a project dependency and build script.
status: published
meta:
  category: Guides
  chapter: Package workflow
  prev_url: /cli/
  prev_label: CLI
  next_url: /deployment/
  next_label: Deployment
---

# package.json Script

Use a package script when your project already has a Node.js toolchain.

```bash
npm install --save-dev @zeropress/build-pages
```

```json
{
  "scripts": {
    "build": "zeropress-build-pages --source ./docs --destination ./_site"
  }
}
```

Then run:

```bash
npm run build
```

This approach works well for Vercel, Netlify, Cloudflare Pages, and any environment that expects a build command plus output directory.
