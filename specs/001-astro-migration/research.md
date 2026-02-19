# Research: Astro Migration

**Date**: 2026-02-19
**Branch**: `001-astro-migration`

## R1: Current Jekyll URL Structure

**Decision**: Old URLs are flat slugs from front matter `permalink` field (e.g., `/scientific-python-now-2`, `/stop-using-numpy-loadtxt`). No date segments exist in the current URLs.

**Rationale**: Each post explicitly defines a `permalink:` in its YAML front matter. There is no global permalink pattern in `_config.yml`. Collections are accessed via `site.categories["posts"]` and `site.categories["quicktips"]`.

**Implications for migration**: Redirects map from flat root-level slugs (e.g., `/scientific-python-now-2`) to nested Astro paths (e.g., `/posts/scientific-python-now-2/`).

## R2: Astro Content Collections

**Decision**: Use Astro 5+ content collections with glob loaders and Zod schemas.

**Rationale**: The loader-based API is the current Astro standard. Content can live in any directory (e.g., `src/content/posts/`, `src/content/quicktips/`).

**Schema approach**: Define schemas matching existing front matter: title (string), date (coerced Date), tags (space-separated string or array), description (optional string), permalink (string for redirect mapping).

## R3: Astro Redirects on Static GitHub Pages

**Decision**: Use Astro's built-in `redirects` config in `astro.config.mjs`.

**Rationale**: For static output, Astro generates HTML files with `<meta http-equiv="refresh">` at the old paths. GitHub Pages has no server-side redirect support, so this is the best available option. Old URLs will still resolve (no 404s), and the user is redirected client-side.

**Alternatives considered**: Manual HTML redirect pages (more work, same result), Cloudflare/Netlify (different hosting, out of scope).

## R4: SASS/CSS Reuse

**Decision**: Install `sass` npm package and import existing `.sass`/`.scss` files into Astro layouts.

**Rationale**: Astro supports SASS natively via Vite. The existing `_sass/` partials and `css/main.sass` can be imported directly with minimal path adjustments. The indented `.sass` syntax is supported alongside `.scss`.

**Key change**: Jekyll's `@import vars` becomes `@use 'vars'` or the files are restructured to import via Astro's `<style lang="sass">` or a global import.

## R5: GitHub Actions Deployment

**Decision**: Use `withastro/action@v5` for build + `actions/deploy-pages@v4` for deployment.

**Rationale**: This is the official Astro-recommended workflow. It handles package manager detection, build, and artifact upload automatically. Requires `pages: write` and `id-token: write` permissions.

**GitHub Pages settings**: Must be set to "GitHub Actions" as the source (not "Deploy from a branch").

## R6: Syntax Highlighting

**Decision**: Use Astro's built-in Shiki with a theme that approximates the existing Rouge color scheme.

**Rationale**: Shiki is built into Astro's Markdown pipeline. The existing Rouge theme uses CSS classes; Shiki uses inline styles. A visual approximation is acceptable - exact color matching per token is not required for visual parity.

## R7: Sitemap

**Decision**: Use `@astrojs/sitemap` integration.

**Rationale**: Direct replacement for `jekyll-sitemap`. Requires `site` in `astro.config.mjs` to be set.

## R8: Mobile Menu

**Decision**: Replace jQuery-based mobile menu with vanilla JavaScript.

**Rationale**: The current menu is simple (toggle visibility on hamburger click, media query at 650px). This doesn't need jQuery. Astro encourages minimal client-side JS.

## R9: CNAME / Custom Domain

**Decision**: Place `CNAME` file in `public/` directory.

**Rationale**: Astro's `public/` directory is copied verbatim to the build output root, equivalent to Jekyll's repo root behavior.

## R10: Front Matter Format

**Decision**: Normalize Jekyll front matter for Astro content collections.

**Rationale**: Current posts use non-standard date formats (`01.06.2015`, `26.5.2015`), space-separated tags (not YAML arrays), and a `comments: True` field. The Astro schema will coerce dates and parse tags. The `permalink` field will be preserved for redirect mapping but won't drive URL generation - Astro will use the file slug.

**Key transformations needed**:
- `tags: Python Numpy` → tags remain as-is in front matter, parsed by schema as a string then split
- `date: 01.06.2015` → coerced to Date object by Zod
- `permalink: scientific-python-now-2` → used only for redirect config generation
- `comments: True` → ignored (Disqus not being migrated per assumptions)
