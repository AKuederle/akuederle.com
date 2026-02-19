# Data Model: Astro Migration

**Date**: 2026-02-19
**Branch**: `001-astro-migration`

## Entities

### Post (Content Collection: `posts`)

| Field       | Type              | Required | Notes                                              |
| ----------- | ----------------- | -------- | -------------------------------------------------- |
| title       | string            | yes      | Display title                                      |
| date        | Date (coerced)    | yes      | Publish date, parsed from formats like `01.06.2015` |
| tags        | string            | no       | Space-separated tag list (e.g., `"Python Numpy"`)  |
| description | string            | no       | Short description for meta/previews                |
| permalink   | string            | yes      | Old Jekyll slug, used for redirect mapping         |
| layout      | string (ignored)  | no       | Jekyll layout field, not used in Astro             |
| comments    | boolean (ignored) | no       | Disqus flag, not migrated                          |

**Source**: `src/content/posts/*.md`
**URL pattern**: `/posts/{slug}/` where slug is derived from filename

### Quick Tip (Content Collection: `quicktips`)

Same schema as Post.

**Source**: `src/content/quicktips/*.md`
**URL pattern**: `/quicktips/{slug}/` where slug is derived from filename

### Redirect Mapping

Each post's `permalink` front matter value maps to a redirect:

| Old Path (Jekyll)           | New Path (Astro)                        |
| --------------------------- | --------------------------------------- |
| `/{permalink}`              | `/posts/{slug}/` or `/quicktips/{slug}/` |

Example: `/scientific-python-now-2` → `/posts/scientific-python-now-2/`

## Relationships

- Posts and Quick Tips share the same schema but belong to separate collections
- Tags are plain strings, not a separate entity - no tag archive pages exist
- No cross-references between posts
