# Static Search

When the selected theme supports search and `site.search` is enabled, Build Pages output includes native search artifacts.

```txt
_site/_zeropress/search.js
_site/_zeropress/search.json
_site/_zeropress/search_pagefind.js
```

Themes should import `/_zeropress/search.js` and keep the search UI separate from the search engine.

## Pagefind Adapter

For Pagefind, run it after the ZeroPress build, then replace the native adapter:

```bash
npx pagefind@1.4.0 \
  --site ./_site \
  --output-subdir _zeropress/pagefind

cp ./_site/_zeropress/search_pagefind.js ./_site/_zeropress/search.js
rm ./_site/_zeropress/search.json
```

The `rm` step removes the unused native index. It is not required for Pagefind to work.
