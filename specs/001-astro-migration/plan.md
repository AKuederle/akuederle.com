# Implementation Plan: Migrate Blog to Astro with GitHub Actions Deployment

**Branch**: `001-astro-migration` | **Date**: 2026-02-19 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/001-astro-migration/spec.md`

## Summary

Migrate a broken Jekyll blog (akuederle.com) to Astro with GitHub Actions deployment. The site has ~20 Markdown content pages across two collections (posts and quicktips), existing SASS styling, and a custom domain. Content will move into Astro content collections, existing SASS will be imported with minimal changes, old Jekyll permalink URLs will redirect to new nested Astro paths, and a GitHub Actions workflow will deploy via `actions/deploy-pages`.

## Technical Context

**Language/Version**: TypeScript/JavaScript (Node.js 18+, Astro 5+)
**Primary Dependencies**: astro, @astrojs/sitemap, sass
**Storage**: Markdown files (static site, no database)
**Testing**: Manual verification (build succeeds, pages render, redirects work)
**Target Platform**: GitHub Pages (static hosting)
**Project Type**: Single static site
**Performance Goals**: Homepage loads within 3 seconds, build completes within 5 minutes
**Constraints**: Static output only (no SSR), GitHub Pages hosting limitations (no server-side redirects)
**Scale/Scope**: ~20 content pages, ~15 source files, 3 page types (home, listing, post)

## Constitution Check

*No constitution.md found. Gate skipped.*

## Project Structure

### Documentation (this feature)

```text
specs/001-astro-migration/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
└── tasks.md             # Phase 2 output (/speckit.tasks)
```

### Source Code (repository root)

```text
public/
├── CNAME                        # Custom domain: akuederle.com
└── images/                      # Static images (moved from root images/)
    └── background/
        └── straws.png

src/
├── content/
│   ├── posts/                   # Blog posts (.md, migrated from posts/_posts/)
│   └── quicktips/               # Quick tips (.md, migrated from quicktips/_posts/)
├── content.config.ts            # Zod schemas for both collections
├── layouts/
│   ├── Base.astro               # Root HTML shell (head, header, footer)
│   └── Post.astro               # Post/quicktip detail layout
├── pages/
│   ├── index.astro              # Homepage with post + quicktip listings
│   ├── archive.astro            # Archive page
│   ├── about.astro              # About page
│   ├── posts/
│   │   └── [...slug].astro      # Dynamic post routes
│   └── quicktips/
│       ├── index.astro          # Quicktips listing page
│       └── [...slug].astro      # Dynamic quicktip routes
├── components/
│   ├── Header.astro             # Site header + nav (from _includes/header.html)
│   └── Footer.astro             # Site footer (from _includes/footer.html)
└── styles/
    ├── main.sass                # Entry point (from css/main.sass)
    ├── _vars.sass               # Variables (from _sass/vars.sass)
    ├── _glob.sass               # Global styles
    ├── _header.sass             # Header styles
    ├── _content.sass            # Content wrapper
    ├── _post.sass               # Post styles
    ├── _index.sass              # Homepage styles
    ├── _archive.sass            # Archive page
    ├── _footer.sass             # Footer styles
    ├── _quicktips.sass          # Quicktips listing
    └── _syntax-highlighting.scss # Code highlighting (kept for reference/fallback)

astro.config.mjs                 # Site URL, redirects, sitemap, markdown config
package.json                     # Dependencies
tsconfig.json                    # TypeScript config (Astro default)

.github/
└── workflows/
    └── deploy.yml               # GitHub Actions: build + deploy to Pages
```

**Structure Decision**: Single Astro project. Standard Astro file-based routing with content collections. The Jekyll `_layouts/`, `_includes/`, `_sass/`, `posts/_posts/`, `quicktips/_posts/`, and config files will be replaced by the Astro equivalents above. Jekyll files should be removed after migration is verified.

### Migration File Mapping

| Jekyll Source                  | Astro Target                          |
| ------------------------------ | ------------------------------------- |
| `_layouts/default.html`        | `src/layouts/Base.astro`              |
| `_layouts/post.html`           | `src/layouts/Post.astro`              |
| `_layouts/page.html`           | (merged into Base.astro)              |
| `_includes/header.html`        | `src/components/Header.astro`         |
| `_includes/footer.html`        | `src/components/Footer.astro`         |
| `_includes/head.html`          | (merged into Base.astro `<head>`)     |
| `_includes/comments.html`      | (dropped - Disqus not migrated)       |
| `posts/_posts/*.md`            | `src/content/posts/*.md`              |
| `quicktips/_posts/*.md`        | `src/content/quicktips/*.md`          |
| `css/main.sass`                | `src/styles/main.sass`               |
| `_sass/*.sass`                 | `src/styles/_*.sass`                  |
| `_sass/_syntax-highlighting.scss` | `src/styles/_syntax-highlighting.scss` |
| `js/functions.js`              | Inline `<script>` in Header.astro     |
| `js/jquery-2.1.1.min.js`       | (dropped - replaced by vanilla JS)    |
| `images/`                      | `public/images/`                      |
| `CNAME`                        | `public/CNAME`                        |
| `index.html`                   | `src/pages/index.astro`               |
| `archive.html`                 | `src/pages/archive.astro`             |
| `quicktips.html`               | `src/pages/quicktips/index.astro`     |
| `about.md`                     | `src/pages/about.astro`               |
| `_config.yml`                  | `astro.config.mjs`                    |
| `Gemfile` / `Gemfile.lock`     | `package.json` / `package-lock.json`  |

### Redirect Configuration

All redirects defined in `astro.config.mjs`. Each post's `permalink` front matter value maps to a meta-refresh redirect:

```javascript
// Example (actual values derived from all post permalink fields)
redirects: {
  '/scientific-python-now-2': '/posts/scientific-python-now-2/',
  '/stop-using-numpy-loadtxt': '/quicktips/stop-using-numpy-loadtxt/',
  // ... one entry per content page
}
```

### Key Technical Decisions

1. **Shiki for syntax highlighting** instead of Rouge CSS. Use a theme that approximates the existing color scheme. The old `_syntax-highlighting.scss` can be kept as reference but Shiki's inline styles will take precedence.

2. **Vanilla JS mobile menu** in a `<script>` tag within Header.astro, replacing jQuery. Same behavior: toggle visibility on hamburger click at <650px breakpoint.

3. **SASS imported globally** in Base.astro layout via `import '../styles/main.sass'`. Astro processes SASS natively with the `sass` package installed.

4. **Front matter normalization**: Existing posts keep their front matter mostly as-is. The Zod schema handles coercion (dates, tags). The `permalink` field is preserved for redirect config but Astro uses filename-based slugs for routing.

5. **Static output only** (`output: 'static'`). No SSR adapter needed. Redirects use meta-refresh HTML files.

6. **Google Analytics**: The old UA tracking code (UA-61635452-1) from `_includes/head.html` should be evaluated - it may be migrated or dropped depending on whether it's still active.
