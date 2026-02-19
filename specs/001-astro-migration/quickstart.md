# Quickstart: Astro Migration

**Branch**: `001-astro-migration`

## Prerequisites

- Node.js 18+ (LTS recommended)
- npm or pnpm

## Setup

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview
```

## Project Structure

```
├── public/
│   ├── CNAME                    # Custom domain: akuederle.com
│   └── images/                  # Static images (moved from root)
├── src/
│   ├── content/
│   │   ├── posts/               # Blog posts (.md files)
│   │   └── quicktips/           # Quick tips (.md files)
│   ├── content.config.ts        # Collection schemas
│   ├── layouts/
│   │   ├── Base.astro           # Root HTML layout (replaces default.html)
│   │   └── Post.astro           # Post layout (replaces post.html)
│   ├── pages/
│   │   ├── index.astro          # Homepage
│   │   ├── archive.astro        # Archive page
│   │   ├── about.astro          # About page
│   │   ├── posts/
│   │   │   └── [...slug].astro  # Dynamic post routes
│   │   └── quicktips/
│   │       ├── index.astro      # Quicktips listing
│   │       └── [...slug].astro  # Dynamic quicktip routes
│   ├── components/
│   │   ├── Header.astro         # Site header + navigation
│   │   └── Footer.astro         # Site footer
│   └── styles/
│       └── main.sass            # Global styles (migrated from _sass/)
├── astro.config.mjs             # Astro config (site, redirects, sitemap)
├── package.json
└── .github/
    └── workflows/
        └── deploy.yml           # GitHub Actions deployment
```

## Key Configuration

- `astro.config.mjs`: Site URL, redirects from old Jekyll paths, sitemap integration
- `src/content.config.ts`: Zod schemas for posts and quicktips collections
- `.github/workflows/deploy.yml`: Build + deploy to GitHub Pages

## Deployment

Automatic on push to master via GitHub Actions. Manual trigger also available via workflow_dispatch.
