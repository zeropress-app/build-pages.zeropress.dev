# Troubleshooting

This page collects common Build Pages failure modes.

## Missing Source Directory

Make sure the directory passed to `--source` exists and is a directory.

```bash
zeropress-build-pages --source ./docs --destination ./_site
```

## Missing Public Directory

If `--public-dir` is set explicitly, it must exist and be a directory.

```bash
zeropress-build-pages --source ./docs --public-dir ./public --destination ./_site
```

## Missing Theme Path

If you use `--theme-path`, it must point to a valid ZeroPress theme directory.

```bash
zeropress-build-pages --source ./docs --destination ./_site --theme-path ./theme
```

## Untitled Markdown

Add front matter `title` or a Markdown H1. If the file should not become a page, use `--skip-untitled-markdown`.
