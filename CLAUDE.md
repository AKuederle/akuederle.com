# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal blog/notebook at akuederle.com, built with Astro and deployed to GitHub Pages via GitHub Actions. Content covers scientific Python, Linux, and automation topics. The site is no longer actively updated.

## Build Commands

```bash
# Install dependencies
npm install

# Serve locally with live reload
npm run dev

# Build static site (output to dist/)
npm run build

# Preview production build locally
npm run preview
```

## Architecture

- **Astro 5+ static site** with Shiki syntax highlighting and Markdown content
- **Two content collections:** `src/content/posts/` (full articles) and `src/content/quicktips/` (short tips/snippets), defined in `src/content.config.ts`
- **Layout hierarchy:** `src/layouts/Base.astro` wraps `Post.astro`
- **Components:** `src/components/Header.astro` (nav + mobile menu), `src/components/Footer.astro`
- **SASS pipeline:** `src/styles/main.sass` imports all partials from `src/styles/`
- **Responsive breakpoint** at 650px with vanilla JS mobile menu toggle in Header.astro
- **Config:** `astro.config.mjs` defines site URL, redirects, sitemap integration, and Shiki theme
- **Domain:** `public/CNAME` points to `akuederle.com`
- **Deployment:** GitHub Actions workflow (`.github/workflows/deploy.yml`) builds and deploys on push to master
- **Redirects:** Old Jekyll permalink URLs redirect to new `/posts/{slug}/` and `/quicktips/{slug}/` paths via meta-refresh HTML

## Content Conventions

- Posts use YAML front matter with `title`, `date` (YYYY-MM-DD), `tags` (space-separated string), `permalink`, and optional `description`
- Tags are used for categorization (Python, Numpy, Matplotlib, etc.)
- Images stored in `public/images/` directory, referenced from posts as `/images/...`
