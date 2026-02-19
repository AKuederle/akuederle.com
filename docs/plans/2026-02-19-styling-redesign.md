# Styling Redesign Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace SASS with Tailwind v4 + CSS custom properties for a minimal, readable blog with Geist fonts, orange accent, dark/light mode, and accessibility.

**Architecture:** Tailwind v4 via `@tailwindcss/vite` Vite plugin. Theme defined with CSS custom properties in a single `global.css` using `@theme`. Dark mode via `prefers-color-scheme` media query. Shiki dual themes for syntax highlighting. Geist fonts via fontsource.

**Tech Stack:** Tailwind CSS v4, @tailwindcss/vite, @fontsource-variable/geist, @fontsource-variable/geist-mono, Astro Shiki dual themes

---

### Task 1: Install dependencies and remove SASS

**Files:**
- Modify: `package.json`
- Modify: `astro.config.mjs`

**Step 1: Install Tailwind v4 and font packages, remove sass**

Run:
```bash
bun add tailwindcss @tailwindcss/vite @fontsource-variable/geist @fontsource-variable/geist-mono
bun remove sass
```

**Step 2: Add Tailwind vite plugin and update Shiki config in astro.config.mjs**

```javascript
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://akuederle.com',
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
  markdown: {
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
    },
  },
  redirects: {
    // ... keep all existing redirects unchanged
  },
});
```

Note: Change `theme:` (singular) to `themes:` (object with light/dark keys).

**Step 3: Commit**

```bash
git add package.json bun.lock astro.config.mjs
git commit -m "chore: replace sass with tailwind v4, add geist fonts"
```

---

### Task 2: Create global.css with theme and Tailwind setup

**Files:**
- Create: `src/styles/global.css`

**Step 1: Create the Tailwind CSS entry file with theme variables**

```css
@import "tailwindcss";
@import "@fontsource-variable/geist";
@import "@fontsource-variable/geist-mono";

@theme {
  --font-body: "Geist Variable", system-ui, sans-serif;
  --font-mono: "Geist Mono Variable", ui-monospace, "Cascadia Code", "Source Code Pro", Menlo, Consolas, monospace;

  --color-bg: #fafafa;
  --color-surface: #ffffff;
  --color-text: #1a1a1a;
  --color-text-muted: #6b6b6b;
  --color-accent: #DD7B0F;
  --color-accent-hover: #c46d0d;
  --color-border: #e5e5e5;
  --color-code-bg: #f0f0f0;
}

@layer base {
  :root {
    color-scheme: light dark;
  }

  @media (prefers-color-scheme: dark) {
    :root {
      --color-bg: #141414;
      --color-surface: #1a1a1a;
      --color-text: #e0e0e0;
      --color-text-muted: #9a9a9a;
      --color-accent: #e8922a;
      --color-accent-hover: #f0a040;
      --color-border: #2a2a2a;
      --color-code-bg: #1e1e1e;
    }
  }

  html {
    font-family: var(--font-body);
    background-color: var(--color-bg);
    color: var(--color-text);
  }

  /* Shiki dual theme support */
  @media (prefers-color-scheme: dark) {
    .astro-code,
    .astro-code span {
      color: var(--shiki-dark) !important;
      background-color: var(--shiki-dark-bg) !important;
      font-style: var(--shiki-dark-font-style) !important;
      font-weight: var(--shiki-dark-font-weight) !important;
    }
  }

  /* Accessible focus styles */
  :focus-visible {
    outline: 2px solid var(--color-accent);
    outline-offset: 2px;
  }

  /* Respect reduced motion */
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      transition-duration: 0.01ms !important;
      animation-duration: 0.01ms !important;
    }
  }

  /* Skip to content link */
  .skip-link {
    position: absolute;
    top: -100%;
    left: 50%;
    transform: translateX(-50%);
    z-index: 100;
    padding: 0.5rem 1rem;
    background: var(--color-accent);
    color: white;
    font-family: var(--font-mono);
    text-decoration: none;
  }

  .skip-link:focus {
    top: 0.5rem;
  }
}
```

**Step 2: Commit**

```bash
git add src/styles/global.css
git commit -m "feat: add tailwind v4 global.css with theme variables and dark mode"
```

---

### Task 3: Restyle Base.astro layout

**Files:**
- Modify: `src/layouts/Base.astro`

**Step 1: Replace Base.astro with Tailwind classes and new imports**

```astro
---
import '../styles/global.css';
import Header from '../components/Header.astro';
import Footer from '../components/Footer.astro';

interface Props {
  title?: string;
  description?: string;
}

const { title, description } = Astro.props;
const siteTitle = 'Arne Küderle';
const siteDescription = 'A small blog/notebook, where I write about computer related stuff I learn.';
const pageTitle = title ? title : siteTitle;
const pageDescription = description ? description : siteDescription;
---

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{pageTitle}</title>
  <meta name="description" content={pageDescription}>
  <link rel="sitemap" href="/sitemap-index.xml" />
</head>
<body class="bg-(--color-bg) text-(--color-text) min-h-screen flex flex-col">
  <a href="#main-content" class="skip-link">Skip to content</a>
  <Header />
  <main id="main-content" class="flex-1 w-full max-w-[750px] mx-auto px-5 py-8 md:px-0">
    <slot />
  </main>
  <Footer />
</body>
</html>
```

Key changes: import `global.css` instead of `main.sass`, add `lang="en"`, add skip-to-content link, flex column layout, 750px content width, proper padding.

**Step 2: Commit**

```bash
git add src/layouts/Base.astro
git commit -m "feat: restyle Base layout with tailwind, add skip-link and lang attr"
```

---

### Task 4: Restyle Header.astro

**Files:**
- Modify: `src/components/Header.astro`

**Step 1: Replace Header.astro with minimal Tailwind header**

```astro
<header class="w-full max-w-[750px] mx-auto px-5 md:px-0 pt-8 pb-4">
  <nav class="flex items-center justify-between" aria-label="Main navigation">
    <a href="/" class="font-(family-name:--font-mono) text-xl font-bold text-(--color-text) hover:text-(--color-accent) no-underline transition-colors">
      Arne Küderle
    </a>
    <button
      id="menu-toggle"
      class="md:hidden text-(--color-text-muted) hover:text-(--color-accent) transition-colors"
      aria-expanded="false"
      aria-controls="nav-links"
      aria-label="Toggle navigation menu"
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="3" y1="6" x2="21" y2="6" />
        <line x1="3" y1="12" x2="21" y2="12" />
        <line x1="3" y1="18" x2="21" y2="18" />
      </svg>
    </button>
    <ul id="nav-links" class="hidden md:flex gap-6 list-none m-0 p-0 font-(family-name:--font-mono) text-sm">
      <li><a href="/archive" class="text-(--color-text-muted) hover:text-(--color-accent) no-underline transition-colors">Archive</a></li>
      <li><a href="/quicktips" class="text-(--color-text-muted) hover:text-(--color-accent) no-underline transition-colors">Quicktips</a></li>
      <li><a href="/about" class="text-(--color-text-muted) hover:text-(--color-accent) no-underline transition-colors">About</a></li>
    </ul>
  </nav>
  <!-- Mobile menu -->
  <ul id="mobile-nav" class="hidden flex-col gap-4 pt-4 list-none m-0 p-0 font-(family-name:--font-mono) text-base md:hidden">
    <li><a href="/archive" class="text-(--color-text-muted) hover:text-(--color-accent) no-underline transition-colors">Archive</a></li>
    <li><a href="/quicktips" class="text-(--color-text-muted) hover:text-(--color-accent) no-underline transition-colors">Quicktips</a></li>
    <li><a href="/about" class="text-(--color-text-muted) hover:text-(--color-accent) no-underline transition-colors">About</a></li>
  </ul>
</header>

<script>
  function setupMenu() {
    const toggle = document.getElementById('menu-toggle');
    const mobileNav = document.getElementById('mobile-nav');
    if (!toggle || !mobileNav) return;

    toggle.addEventListener('click', () => {
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!expanded));
      mobileNav.classList.toggle('hidden');
      mobileNav.classList.toggle('flex');
    });
  }

  setupMenu();
  document.addEventListener('astro:after-swap', setupMenu);
</script>
```

Key changes: proper ARIA attributes, accessible hamburger button, simple show/hide mobile menu, Geist Mono font for all nav text.

**Step 2: Commit**

```bash
git add src/components/Header.astro
git commit -m "feat: restyle header with tailwind, add accessible mobile menu"
```

---

### Task 5: Restyle Footer.astro

**Files:**
- Modify: `src/components/Footer.astro`

**Step 1: Replace Footer.astro with minimal Tailwind footer**

```astro
<footer class="w-full max-w-[750px] mx-auto px-5 md:px-0 py-8 border-t border-(--color-border)">
  <div class="flex items-center justify-between font-(family-name:--font-mono) text-sm text-(--color-text-muted)">
    <div class="flex gap-4">
      <a href="https://github.com/AKuederle" class="text-(--color-text-muted) hover:text-(--color-accent) transition-colors" aria-label="GitHub">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
        </svg>
      </a>
      <a href="mailto:a.kuederle@gmail.com" class="text-(--color-text-muted) hover:text-(--color-accent) transition-colors" aria-label="Email">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="2" y="4" width="20" height="16" rx="2" />
          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
        </svg>
      </a>
    </div>
    <span>&copy; 2015-2026 Arne Küderle</span>
  </div>
</footer>
```

Key changes: simple flex layout, proper aria-labels on icon links, updated copyright year.

**Step 2: Commit**

```bash
git add src/components/Footer.astro
git commit -m "feat: restyle footer with tailwind, add aria-labels"
```

---

### Task 6: Restyle Post.astro layout

**Files:**
- Modify: `src/layouts/Post.astro`

**Step 1: Replace Post.astro with Tailwind classes and prose-like styling**

```astro
---
import Base from './Base.astro';

interface Props {
  title: string;
  date: Date;
  tags?: string;
  description?: string;
}

const { title, date, tags, description } = Astro.props;

const formattedDate = date.toLocaleDateString('en-US', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
});

const tagList = tags ? tags.split(' ').filter(Boolean) : [];
---

<Base title={title} description={description}>
  <article>
    <header class="mb-8">
      <p class="font-(family-name:--font-mono) text-sm text-(--color-text-muted) mb-2">{formattedDate}</p>
      <h1 class="font-(family-name:--font-mono) text-2xl md:text-3xl font-bold leading-tight">{title}</h1>
      {tagList.length > 0 && (
        <div class="flex gap-2 mt-3 font-(family-name:--font-mono) text-xs text-(--color-text-muted)">
          {tagList.map((tag) => (
            <span>{tag}</span>
          ))}
        </div>
      )}
    </header>
    <div class="post-content">
      <slot />
    </div>
  </article>
</Base>
```

**Step 2: Commit**

```bash
git add src/layouts/Post.astro
git commit -m "feat: restyle post layout with tailwind"
```

---

### Task 7: Add post-content prose styles to global.css

**Files:**
- Modify: `src/styles/global.css`

**Step 1: Append post-content styles after the `@layer base` block**

Add this at the end of `global.css`:

```css
@layer base {
  /* ... existing base styles ... */

  /* Post content prose styles */
  .post-content {
    font-size: 1.125rem;
    line-height: 1.8;
  }

  .post-content h2,
  .post-content h3,
  .post-content h4 {
    font-family: var(--font-mono);
    font-weight: 700;
    margin-top: 2em;
    margin-bottom: 0.5em;
  }

  .post-content h2 { font-size: 1.5rem; }
  .post-content h3 { font-size: 1.25rem; }
  .post-content h4 { font-size: 1.125rem; }

  .post-content p {
    margin-bottom: 1.25em;
  }

  .post-content a {
    color: var(--color-accent);
    text-decoration: underline;
    text-underline-offset: 2px;
  }

  .post-content a:hover {
    color: var(--color-accent-hover);
  }

  .post-content ul,
  .post-content ol {
    margin-bottom: 1.25em;
    padding-left: 1.5em;
  }

  .post-content li {
    margin-bottom: 0.25em;
  }

  .post-content blockquote {
    border-left: 3px solid var(--color-accent);
    padding-left: 1em;
    color: var(--color-text-muted);
    margin: 1.5em 0;
  }

  /* Code blocks break out wider */
  .post-content pre {
    font-family: var(--font-mono);
    font-size: 0.875rem;
    line-height: 1.6;
    padding: 1rem 1.25rem;
    border-radius: 0.375rem;
    overflow-x: auto;
    margin: 1.5em -132px;
    max-width: calc(100% + 264px);
  }

  @media (max-width: 1080px) {
    .post-content pre {
      margin-left: 0;
      margin-right: 0;
      max-width: 100%;
      border-radius: 0;
    }
  }

  .post-content :not(pre) > code {
    font-family: var(--font-mono);
    font-size: 0.875em;
    background: var(--color-code-bg);
    padding: 0.125em 0.375em;
    border-radius: 0.25rem;
  }

  /* Images break out wider */
  .post-content img {
    max-width: min(1015px, calc(100vw - 2.5rem));
    margin: 1.5em auto;
    display: block;
    position: relative;
    left: 50%;
    transform: translateX(-50%);
  }
}
```

Note: The breakout math for `pre` blocks: 750px text + 264px (132px each side) = ~1014px. On screens narrower than 1080px, code blocks go full-width within the text column.

**Step 2: Commit**

```bash
git add src/styles/global.css
git commit -m "feat: add post-content prose styles with code/image breakout"
```

---

### Task 8: Restyle index.astro (homepage post list)

**Files:**
- Modify: `src/pages/index.astro`

**Step 1: Replace with Tailwind classes**

```astro
---
import Base from '../layouts/Base.astro';
import { getCollection } from 'astro:content';

const posts = await getCollection('posts');
posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
---

<Base>
  <div class="flex flex-col gap-1">
    {posts.map((post) => (
      <a href={`/posts/${post.id}/`} class="group flex flex-col gap-0.5 py-3 no-underline border-b border-(--color-border) last:border-0">
        <span class="font-(family-name:--font-mono) text-xs text-(--color-text-muted)">
          {post.data.date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
        </span>
        <span class="font-(family-name:--font-mono) text-lg text-(--color-text) group-hover:text-(--color-accent) transition-colors">
          {post.data.title}
        </span>
      </a>
    ))}
  </div>
</Base>
```

**Step 2: Commit**

```bash
git add src/pages/index.astro
git commit -m "feat: restyle homepage post list with tailwind"
```

---

### Task 9: Restyle archive.astro

**Files:**
- Modify: `src/pages/archive.astro`

**Step 1: Replace with Tailwind classes**

```astro
---
import Base from '../layouts/Base.astro';
import { getCollection } from 'astro:content';

const posts = await getCollection('posts');
posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
---

<Base title="Archive">
  <h1 class="font-(family-name:--font-mono) text-2xl font-bold mb-6">Archive</h1>
  <div class="flex flex-col gap-1">
    {posts.map((post) => {
      const tagList = post.data.tags ? post.data.tags.split(' ').filter(Boolean) : [];
      return (
        <a href={`/posts/${post.id}/`} class="group flex items-baseline gap-4 py-2 no-underline border-b border-(--color-border) last:border-0">
          <span class="font-(family-name:--font-mono) text-xs text-(--color-text-muted) shrink-0">
            {post.data.date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
          </span>
          <span class="font-(family-name:--font-mono) text-base text-(--color-text) group-hover:text-(--color-accent) transition-colors">
            {post.data.title}
          </span>
          {tagList.length > 0 && (
            <span class="hidden md:inline font-(family-name:--font-mono) text-xs text-(--color-text-muted) ml-auto shrink-0">
              {tagList.join(' ')}
            </span>
          )}
        </a>
      );
    })}
  </div>
</Base>
```

**Step 2: Commit**

```bash
git add src/pages/archive.astro
git commit -m "feat: restyle archive page with tailwind"
```

---

### Task 10: Restyle quicktips/index.astro

**Files:**
- Modify: `src/pages/quicktips/index.astro`

**Step 1: Replace with Tailwind classes**

```astro
---
import Base from '../../layouts/Base.astro';
import { getCollection } from 'astro:content';

const tips = await getCollection('quicktips');
tips.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
---

<Base title="Quicktips">
  <h1 class="font-(family-name:--font-mono) text-2xl font-bold mb-6">Quicktips</h1>
  <div class="flex flex-col gap-1">
    {tips.map((tip) => {
      const tagList = tip.data.tags ? tip.data.tags.split(' ').filter(Boolean) : [];
      return (
        <a href={`/quicktips/${tip.id}/`} class="group flex items-baseline gap-4 py-2 no-underline border-b border-(--color-border) last:border-0">
          {tagList.length > 0 && (
            <span class="font-(family-name:--font-mono) text-xs text-(--color-text-muted) shrink-0">
              {tagList.join(' ')}
            </span>
          )}
          <span class="font-(family-name:--font-mono) text-base text-(--color-text) group-hover:text-(--color-accent) transition-colors">
            {tip.data.title}
          </span>
        </a>
      );
    })}
  </div>
</Base>
```

**Step 2: Commit**

```bash
git add src/pages/quicktips/index.astro
git commit -m "feat: restyle quicktips listing with tailwind"
```

---

### Task 11: Restyle about.astro

**Files:**
- Modify: `src/pages/about.astro`

**Step 1: Replace with Tailwind classes**

```astro
---
import Base from '../layouts/Base.astro';
---

<Base title="About">
  <h1 class="font-(family-name:--font-mono) text-2xl font-bold mb-6">Why this blog exists...</h1>
  <div class="post-content">
    <p>My name is Arne Küderle and I am about to finish my Master degree in Biomedical Engineering after a successful Bachelor degree in Biophysics. Coding or rather tech in general is a passion of mine for a few years now. However, you know that you can not remember all of the things. Therefore, I started writing some of it down. An why not make it public to everybody? - That's how this blog was born. But now, as I got experienced in programming, especially in a scientific environment, I realized a lot of shortcomings in how people work with code and that the general adoption of programming in many fields is lacking at best. Therefore, I want this blog to be a demonstration of how code can ease your life and how better code can make you a better researcher!</p>
    <p>The blog is divided in two section. First the regular, standard blog section with full length posts, and second the Quicktips, where I collect small tips and snippets of code, which are not worth a full length post. Content-wise I am going to write about what ever topic I'm working on at given time. Usually this is gonna be Windows or Linux related topics on the workflow side of things and Python on the coding site.</p>
    <p>Have fun reading! And feel free to contact me in any way!</p>
    <p>P.S.: I really enjoy teaching and helping others. So, if you have a project you are stuck with, or just need a little mentoring in any of the topics I write about, I would be happy to help you (If I can find the time of course)!</p>
  </div>
</Base>
```

**Step 2: Commit**

```bash
git add src/pages/about.astro
git commit -m "feat: restyle about page with tailwind"
```

---

### Task 12: Delete old SASS files and background image

**Files:**
- Delete: `src/styles/main.sass`
- Delete: `src/styles/_vars.sass`
- Delete: `src/styles/_glob.sass`
- Delete: `src/styles/_header.sass`
- Delete: `src/styles/_content.sass`
- Delete: `src/styles/_post.sass`
- Delete: `src/styles/_footer.sass`
- Delete: `src/styles/_index.sass`
- Delete: `src/styles/_archive.sass`
- Delete: `src/styles/_quicktips.sass`
- Delete: `src/styles/__syntax-highlighting.scss`
- Delete: `public/images/background/` (if exists)

**Step 1: Remove all old style files**

```bash
rm src/styles/main.sass src/styles/_*.sass src/styles/__syntax-highlighting.scss
rm -rf public/images/background/
```

**Step 2: Commit**

```bash
git add -A
git commit -m "chore: remove old SASS files and background image"
```

---

### Task 13: Build, preview, and visual test

**Step 1: Run build to verify no errors**

```bash
bun run build
```

Expected: Clean build with no errors.

**Step 2: Start preview and test with playwright-cli**

```bash
bun run preview &
```

Test pages:
- Homepage: post list renders, hover shows orange accent
- A post page: title, date, tags, code blocks, images
- Archive: date + title list
- Quicktips listing: tag + title list
- About page: prose text
- Test in dark mode context if possible

**Step 3: Final commit if any fixes needed, then push**

```bash
git push
```
