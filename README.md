# build-pages.zeropress.dev

This repository hosts [build-pages.zeropress.dev](https://build-pages.zeropress.dev/),
the product documentation site for `@zeropress/build-pages`.

The site explains how to turn a Markdown source directory into a static
ZeroPress site, how to configure Build Pages, and how to deploy the generated
output to static hosting providers.

The site is built and deployed with
[zeropress-app/zeropress-build-pages](https://github.com/zeropress-app/zeropress-build-pages).
It is maintained as a dogfooding site for Build Pages and the bundled `docs2`
theme.

## Local Build

With npm ZeroPress packages:

```bash
npx --yes @zeropress/build-pages --source ./documents --destination ./_site --public-dir ./public --theme docs2
```

For the same package-based build path used by static hosting providers:

```bash
bash ./build.sh
```

Both scripts write the deployable static site to `_site/`.
