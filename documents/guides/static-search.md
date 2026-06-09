# Static Search

When the selected theme supports search and `site.search` is enabled, Build Pages output includes native search artifacts.

```txt
_site/_zeropress/search.js
_site/_zeropress/search.json
_site/_zeropress/search_pagefind.js
```

## Generated Artifacts

- `/_zeropress/search.js`: the default native search adapter. Themes import this file and call its `search()` method.
- `/_zeropress/search.json`: the native search index used by `search.js`.
- `/_zeropress/search_pagefind.js`: a Pagefind-compatible adapter. It is generated so advanced users can swap the adapter without changing theme UI code.

Themes should import `/_zeropress/search.js` and keep the search UI separate from the search engine. This lets the same theme work with native ZeroPress search or a postbuild Pagefind index.

## Native Search API

`search.js` exports `preload()` and `search(query, options)`.

```js
const searchApi = await import('/_zeropress/search.js');

const result = await searchApi.search('deployment');
```

The result uses a Pagefind-like shape:

```js
{
  results: [
    {
      id: 'page:getting-started',
      score: 12.4,
      data: async () => ({
        url: '/getting-started/',
        excerpt: 'Build your first Markdown-source site.',
        plain_excerpt: 'Build your first Markdown-source site.',
        meta: {
          title: 'Getting Started',
          type: 'page',
          published_at_iso: '',
          updated_at_iso: '2026-06-01T00:00:00Z',
          categories: [],
          tags: []
        },
        sub_results: []
      })
    }
  ]
}
```

Use `result.data()` to load the display data for each hit:

```js
const searchApi = await import('/_zeropress/search.js');
const searchResult = await searchApi.search('config');

for (const hit of searchResult.results) {
  const data = await hit.data();
  console.log(data.meta.title, data.url, data.excerpt);
}
```

The second parameter accepts options. The native adapter currently supports `limit`.

```js
const searchApi = await import('/_zeropress/search.js');

const searchResult = await searchApi.search('github action', {
  limit: 5
});
```

If `limit` is omitted, the native adapter returns up to its default result count.

## Pagefind Adapter

For Pagefind, run it after the ZeroPress build, then replace the native adapter:

```bash
npx --yes pagefind@1.5.2 --site ./_site --output-subdir _zeropress/pagefind

cp ./_site/_zeropress/search_pagefind.js ./_site/_zeropress/search.js
rm ./_site/_zeropress/search.json
```

The `rm` step removes the unused native index. It is not required for Pagefind to work.
