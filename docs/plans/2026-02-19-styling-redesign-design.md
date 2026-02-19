# Styling Redesign: Minimal Readable Blog

## Summary

Replace the current SASS-based styling with Tailwind CSS v4 and CSS custom properties. The design is minimal, readable, with orange accent color, dark/light mode support, and strong accessibility.

## Typography

- **Headings / Nav / Tags / Meta**: Geist Mono (Google Fonts)
- **Body text**: Geist (Vercel's sans-serif, Google Fonts)
- **Code blocks**: Geist Mono
- Off-black text colors (dark grays, not pure black/white)

## Color System (CSS Custom Properties)

Light mode (default):
- `--color-bg`: #fafafa
- `--color-text`: #1a1a1a
- `--color-text-muted`: #6b6b6b
- `--color-accent`: #DD7B0F
- `--color-accent-hover`: #c46d0d
- `--color-border`: #e5e5e5
- `--color-code-bg`: #f0f0f0
- `--color-surface`: #ffffff

Dark mode (via prefers-color-scheme):
- `--color-bg`: #141414
- `--color-text`: #e0e0e0
- `--color-text-muted`: #9a9a9a
- `--color-accent`: #e8922a
- `--color-accent-hover`: #f0a040
- `--color-border`: #2a2a2a
- `--color-code-bg`: #1e1e1e
- `--color-surface`: #1a1a1a

## Layout

- Text column: ~750px max-width, centered
- Code blocks + images: break out to ~1015px max-width
- Header/Footer: within text column width
- Mobile: fluid, no breakout, comfortable padding (16-20px)
- Responsive breakpoint: ~768px

## Tech Stack Change

- Remove: All SASS files (`src/styles/`), `sass` npm dependency
- Add: Tailwind CSS v4 (`@tailwindcss/vite`), `@fontsource-variable/geist`, `@fontsource-variable/geist-mono`
- Styling approach: Tailwind utility classes in components + CSS custom properties for theme
- Tailwind v4 config: CSS-first with `@theme` directive (no tailwind.config.js)

## Component Changes

### Base.astro
- Import Tailwind CSS entry file instead of main.sass
- Add `lang="en"` to `<html>`
- Add dark mode class toggle based on `prefers-color-scheme`
- Set font imports

### Header.astro
- Flat layout: site name left, nav links right
- Geist Mono for all text
- Simple mobile menu (hamburger icon, minimal JS)
- Orange accent on hover/active states

### Footer.astro
- Minimal: social icon links + copyright
- Geist Mono for text
- Subtle, not visually heavy

### Post.astro
- Date in Geist Mono, muted color
- Title in Geist Mono, large
- Tags as simple inline text (no pill borders)
- Article body in Geist, comfortable line-height (~1.7)

### Index/Archive/Quicktips pages
- Clean post lists: date + title on each row
- Orange accent on hover
- No background color changes on hover

## Code Blocks

- Astro Shiki with dual themes: `github-light` (light) / `github-dark` (dark)
- Configured via `astro.config.mjs` using `shikiConfig.themes`
- Code blocks break out wider than text column
- Geist Mono font applied to `<pre>` / `<code>`

## Accessibility

- `prefers-color-scheme: dark` media query (OS setting respected)
- `prefers-reduced-motion: reduce` to disable transitions
- `focus-visible` outlines using orange accent
- WCAG AA contrast minimum (AAA target on body text)
- Semantic HTML throughout
- `lang="en"` on `<html>`
- Skip-to-content link (hidden, visible on focus)

## Files to Create/Modify

### New
- `src/styles/global.css` — Tailwind v4 entry with `@theme` and CSS custom properties

### Modify
- `astro.config.mjs` — add Tailwind vite plugin, update shiki dual theme config
- `src/layouts/Base.astro` — new imports, lang attr, restructure
- `src/layouts/Post.astro` — Tailwind classes
- `src/components/Header.astro` — full restyle with Tailwind
- `src/components/Footer.astro` — full restyle with Tailwind
- `src/pages/index.astro` — Tailwind classes for post list
- `src/pages/archive.astro` — Tailwind classes
- `src/pages/quicktips/index.astro` — Tailwind classes
- `src/pages/about.astro` — Tailwind classes
- `package.json` — add tailwindcss, @tailwindcss/vite, font packages; remove sass

### Delete
- `src/styles/main.sass` and all `_*.sass` / `_*.scss` partials
- `public/images/background/` (texture image)
