# Feature Specification: Migrate Blog to Astro with GitHub Actions Deployment

**Feature Branch**: `001-astro-migration`
**Created**: 2026-02-19
**Status**: Draft
**Input**: User description: "The blog is broken at the moment. Migrate it to astro and to the new ci gh pages deploy approach"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Blog Is Accessible Again (Priority: P1)

A visitor navigates to akuederle.com and sees the blog homepage with a listing of posts and quick tips, just as it appeared before. All existing content is preserved and readable. The site is no longer broken.

**Why this priority**: The blog is currently broken and inaccessible. Restoring public access to the content is the primary goal.

**Independent Test**: Visit akuederle.com and verify the homepage loads, navigation works, and all 20 existing content pages (10 posts + 10 quick tips) render correctly with proper formatting and syntax highlighting.

**Acceptance Scenarios**:

1. **Given** the site is deployed, **When** a visitor navigates to akuederle.com, **Then** the homepage loads showing a listing of blog posts and quick tips
2. **Given** the site is deployed, **When** a visitor clicks on any post or quick tip, **Then** the full content renders with correct formatting, code blocks, and syntax highlighting
3. **Given** the site is deployed, **When** a visitor navigates to a previously bookmarked old Jekyll URL, **Then** they are redirected to the corresponding new Astro URL

---

### User Story 2 - Automated Deployment via GitHub Actions (Priority: P2)

When changes are pushed to the main branch, a GitHub Actions workflow automatically builds the Astro site and deploys it to GitHub Pages. No manual build or deploy step is required.

**Why this priority**: The old implicit GitHub Pages Jekyll build is no longer reliable (the blog is broken). A CI-based deployment ensures reproducible, automated builds going forward.

**Independent Test**: Push a minor content change to the main branch and verify that GitHub Actions triggers a workflow that successfully builds and deploys the updated site to GitHub Pages within minutes.

**Acceptance Scenarios**:

1. **Given** a commit is pushed to the main branch, **When** GitHub Actions runs, **Then** the site is built and deployed to GitHub Pages automatically
2. **Given** a deployment is triggered, **When** the build completes, **Then** the site is served at akuederle.com via the custom domain
3. **Given** a build fails, **When** the workflow completes, **Then** the failure is visible in the GitHub Actions UI with clear error output

---

### User Story 3 - Visual Parity with Existing Design (Priority: P2)

The migrated site retains the same visual appearance as the original Jekyll blog: same layout structure, typography, color scheme, responsive behavior at 650px, and mobile menu. Visitors should not notice a difference.

**Why this priority**: The site owner wants a migration, not a redesign. Preserving the existing look and feel avoids surprising returning visitors and keeps the scope manageable.

**Independent Test**: Compare screenshots of the original site (via Wayback Machine or local Jekyll build) against the new Astro site across desktop and mobile viewports. The visual appearance should be substantially identical.

**Acceptance Scenarios**:

1. **Given** the Astro site is deployed, **When** viewed on a desktop browser (>650px), **Then** the layout, header, footer, content area, and typography match the original design
2. **Given** the Astro site is deployed, **When** viewed on a mobile browser (<=650px), **Then** the responsive layout and mobile menu behave as before
3. **Given** the Astro site is deployed, **When** viewing a post with code blocks, **Then** syntax highlighting renders correctly with proper coloring

---

### Edge Cases

- Old Jekyll URL paths must redirect to new Astro-idiomatic paths via hard-coded redirect rules for all 20 existing content pages.
- What happens if a post contains embedded HTML within Markdown? The Markdown processing must handle mixed HTML/Markdown content as Jekyll/Kramdown did.
- How does the site handle posts with special date formats in filenames (e.g., `06-07-215` which appears to be a typo for 2015)?
- What happens to the sitemap generation (previously handled by jekyll-sitemap)?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The site MUST render all 10 existing blog posts as individual pages with full content
- **FR-002**: The site MUST render all 10 existing quick tips as individual pages with full content
- **FR-003**: The homepage MUST display listings of both posts and quick tips
- **FR-004**: The site MUST use Astro-idiomatic flat URL paths (e.g., `/posts/scientific-python-now-2/` instead of `/posts/2015/06/01/scientific-python-now-2/`) and provide hard-coded redirects from all old Jekyll URL paths to the new paths
- **FR-005**: The site MUST support Markdown content with embedded HTML, code blocks, and syntax highlighting
- **FR-006**: The site MUST be served at the custom domain akuederle.com
- **FR-007**: The site MUST include a sitemap for search engine discovery
- **FR-008**: The site MUST be built and deployed automatically via a GitHub Actions workflow on push to the main branch
- **FR-009**: The GitHub Actions workflow MUST use the modern artifact-based GitHub Pages deployment approach (not the legacy branch-based deployment)
- **FR-010**: The site MUST preserve existing front matter metadata (title, date, tags, description) and use it appropriately in page rendering
- **FR-011**: The site MUST maintain a responsive layout with behavior equivalent to the current 650px breakpoint design
- **FR-012**: The site MUST preserve the existing visual design (header, footer, content layout, typography, color scheme)

### Key Entities

- **Post**: A full blog article with title, date, tags, optional description, and Markdown body content. Belongs to the "posts" collection.
- **Quick Tip**: A short tip/snippet with the same metadata structure as a Post. Belongs to the "quicktips" collection.
- **Tag**: A categorization label (Python, Numpy, Matplotlib, etc.) associated with posts and quick tips.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: All 20 existing content pages (10 posts + 10 quick tips) are accessible and render correctly on the migrated site
- **SC-002**: The site loads and displays the homepage within 3 seconds on a standard broadband connection
- **SC-003**: Pushing a change to the main branch triggers an automated build and deployment that completes within 5 minutes
- **SC-004**: The site is accessible at akuederle.com with valid HTTPS
- **SC-005**: No previously indexed URLs return 404 errors (either preserved or redirected)
- **SC-006**: The site passes basic accessibility checks (valid HTML structure, semantic headings)
- **SC-007**: The site renders correctly on current versions of Chrome, Firefox, and Safari at both desktop and mobile viewport sizes

## Clarifications

### Session 2026-02-19

- Q: Should the site preserve exact Jekyll URL paths or use Astro-idiomatic flat paths with redirects? → A: Use Astro-idiomatic flat paths with hard-coded redirects from all old Jekyll URLs.

## Assumptions

- The existing visual design (SASS/CSS) can be reused with minimal modifications, as Astro supports SASS natively.
- The "broken" blog is due to GitHub Pages' Jekyll build environment changes, not content issues. Content itself is intact and valid.
- The main branch for deployment will be `master` (matching the current default branch) or can be renamed to `main` if preferred.
- The jQuery dependency for the mobile menu toggle can be replaced with vanilla JavaScript during migration.
- No new content will be added as part of this migration; the scope is limited to porting existing content and infrastructure.
- The site does not require comments functionality (the comments.sass file exists but no commenting system appears to be active).
