# Tasks: Migrate Blog to Astro with GitHub Actions Deployment

**Input**: Design documents from `/specs/001-astro-migration/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md

**Tests**: Not requested - no test tasks included.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Initialize Astro project and create directory structure

- [x] T001 Initialize Astro project with `npm create astro@latest` at repo root, install dependencies (astro, @astrojs/sitemap, sass) in package.json
- [x] T002 Create Astro config with site URL, static output, and sitemap integration in astro.config.mjs
- [x] T003 Create directory structure: src/content/posts/, src/content/quicktips/, src/layouts/, src/pages/posts/, src/pages/quicktips/, src/components/, src/styles/

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Migrate content, styles, and create base layout components that ALL user stories depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T004 Define Zod schemas for posts and quicktips content collections (title, date, tags, description, permalink, layout, comments) in src/content.config.ts
- [x] T005 [P] Migrate all post Markdown files from posts/_posts/ to src/content/posts/ - rename files to slug format (remove DD-MM-YYYY prefix), keep front matter as-is
- [x] T006 [P] Migrate all quicktip Markdown files from quicktips/_posts/ to src/content/quicktips/ - rename files to slug format, keep front matter as-is
- [x] T007 [P] Migrate SASS files: copy css/main.sass to src/styles/main.sass and all _sass/*.sass/_sass/*.scss to src/styles/_*.sass/scss - update @import paths to use relative references
- [x] T008 [P] Move images/ directory to public/images/ and CNAME file to public/CNAME
- [x] T009 Create Base.astro layout in src/layouts/Base.astro - port _layouts/default.html and _includes/head.html (HTML shell with head, charset, viewport, title, global SASS import via `import '../styles/main.sass'`, slot for content)
- [x] T010 [P] Create Header.astro component in src/components/Header.astro - port _includes/header.html (site title, nav links: Archive, Quicktips, About, hamburger menu icon)
- [x] T011 [P] Create Footer.astro component in src/components/Footer.astro - port _includes/footer.html (social links: GitHub, Email, RSS with SVG icons, copyright)
- [x] T012 Create Post.astro layout in src/layouts/Post.astro - port _layouts/post.html (extends Base.astro, displays title, date, tags, article content)

**Checkpoint**: Foundation ready - all content migrated, layouts and components exist, styles imported. Run `npm run dev` to verify base structure loads.

---

## Phase 3: User Story 1 - Blog Is Accessible Again (Priority: P1) 🎯 MVP

**Goal**: All 20 content pages render correctly, homepage shows listings, navigation works, old URLs redirect to new paths

**Independent Test**: Run `npm run build` successfully, then `npm run preview` and verify: homepage lists posts and quicktips, clicking each one loads the full content with formatting and code blocks, old permalink URLs redirect to new paths

### Implementation for User Story 1

- [x] T013 [US1] Create homepage in src/pages/index.astro - query posts and quicktips collections, display listings with title, date, excerpt, and links (matching existing index.html layout)
- [x] T014 [P] [US1] Create dynamic post route in src/pages/posts/[...slug].astro - use getStaticPaths() from posts collection, render with Post.astro layout
- [x] T015 [P] [US1] Create dynamic quicktip route in src/pages/quicktips/[...slug].astro - use getStaticPaths() from quicktips collection, render with Post.astro layout
- [x] T016 [P] [US1] Create quicktips listing page in src/pages/quicktips/index.astro - query quicktips collection, display listing (port quicktips.html)
- [x] T017 [P] [US1] Create archive page in src/pages/archive.astro - query all posts and quicktips, display chronological listing (port archive.html)
- [x] T018 [P] [US1] Create about page in src/pages/about.astro - port about.md content using Base.astro layout
- [x] T019 [US1] Add hard-coded redirect entries in astro.config.mjs redirects config - one entry per content page mapping old Jekyll permalink to new Astro path (read permalink field from each migrated .md front matter)
- [x] T020 [US1] Verify build succeeds with `npm run build` - fix any content parsing errors, front matter schema mismatches, or broken image references

**Checkpoint**: Blog is fully functional locally. All 20 content pages render, homepage shows listings, old URLs redirect. This is the MVP.

---

## Phase 4: User Story 2 - Automated Deployment via GitHub Actions (Priority: P2)

**Goal**: Push to master triggers automatic build and deploy to GitHub Pages at akuederle.com

**Independent Test**: Push a commit to master and verify GitHub Actions workflow runs, builds successfully, and deploys to GitHub Pages. Site is accessible at akuederle.com.

### Implementation for User Story 2

- [x] T021 [US2] Create GitHub Actions workflow in .github/workflows/deploy.yml - use withastro/action@v5 for build + actions/deploy-pages@v4 for deploy, trigger on push to master, set permissions (contents: read, pages: write, id-token: write)
- [x] T022 [US2] Configure GitHub repository settings: set Pages source to "GitHub Actions" (not branch), verify custom domain akuederle.com is configured with HTTPS

**Checkpoint**: Deployment pipeline is operational. Pushing to master automatically deploys to akuederle.com.

---

## Phase 5: User Story 3 - Visual Parity with Existing Design (Priority: P2)

**Goal**: Migrated site visually matches the original Jekyll blog at desktop and mobile viewports

**Independent Test**: Compare Astro site against Wayback Machine snapshots or local Jekyll build screenshots. Check: header/footer layout, post typography, code block styling, responsive behavior at 650px, mobile menu toggle.

### Implementation for User Story 3

- [x] T023 [US3] Add vanilla JavaScript mobile menu toggle in src/components/Header.astro `<script>` tag - replicate jQuery functions.js behavior (matchMedia 650px, hamburger click toggles menu, mobile-menu/inline-menu class toggling)
- [x] T024 [US3] Adjust SASS files in src/styles/ for Astro compatibility - fix any broken @import/@use references, verify all partials load correctly, ensure background image path (images/background/straws.png) resolves from public/
- [x] T025 [US3] Configure Shiki syntax highlighting theme in astro.config.mjs markdown.shikiConfig - choose a theme that approximates the existing Rouge color scheme (e.g., github-light or a custom theme)
- [x] T026 [US3] Visual regression check: run dev server, compare homepage, a post with code blocks, quicktips listing, and about page at both >650px and <=650px viewports against original design

**Checkpoint**: Site is visually equivalent to original Jekyll blog across all viewports.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Cleanup and final verification

- [x] T027 [P] Remove all Jekyll files: _config.yml, Gemfile, Gemfile.lock, _layouts/, _includes/, _sass/, css/, js/, posts/, quicktips/, index.html, archive.html, quicktips.html, about.md, feed.xml (if exists)
- [x] T028 [P] Update CLAUDE.md to reflect new Astro project structure and build commands (npm run dev, npm run build, npm run preview)
- [x] T029 Run final full build and preview: `npm run build && npm run preview` - verify all pages, redirects, sitemap.xml, CNAME, and images work correctly

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **US1 (Phase 3)**: Depends on Foundational phase completion
- **US2 (Phase 4)**: Depends on US1 (need a working build to deploy)
- **US3 (Phase 5)**: Depends on Foundational (needs layouts/styles in place), can run in parallel with US1
- **Polish (Phase 6)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Depends on US1 producing a successful build - needs working site to deploy
- **User Story 3 (P2)**: Can start after Foundational (Phase 2) - Independent from US1/US2 (focuses on styling/interaction)

### Within Each User Story

- Pages with [P] markers can be built in parallel (different files)
- Redirects (T019) should come after pages exist (T013-T018)
- Build verification (T020) must be last in US1

### Parallel Opportunities

- T005, T006, T007, T008 can all run in parallel (different file sets)
- T010, T011 can run in parallel (different components)
- T014, T015, T016, T017, T018 can all run in parallel (different page files)
- US1 pages and US3 styling can be worked on in parallel by different agents
- T027, T028 can run in parallel (different files)

---

## Parallel Example: User Story 1

```bash
# Launch all page tasks for US1 together (after T013 homepage):
Task: "Create dynamic post route in src/pages/posts/[...slug].astro"
Task: "Create dynamic quicktip route in src/pages/quicktips/[...slug].astro"
Task: "Create quicktips listing page in src/pages/quicktips/index.astro"
Task: "Create archive page in src/pages/archive.astro"
Task: "Create about page in src/pages/about.astro"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: `npm run build && npm run preview` - all 20 pages render
5. Deploy manually or proceed to US2 for automation

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test: all content renders → MVP!
3. Add User Story 2 → Test: automatic deployment works
4. Add User Story 3 → Test: visual parity confirmed
5. Polish → Remove Jekyll files, update docs → Done

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Front matter: existing posts keep their format, Zod schema handles coercion
- Redirects: read each post's `permalink` field to build the redirect map in astro.config.mjs
