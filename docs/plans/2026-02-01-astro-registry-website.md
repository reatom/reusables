# Astro Website for @reatom/reusables Registry

## Overview

Astro website for @reatom/reusables - a standalone GitHub Pages site showcasing the jsrepo registry of reatom state management extensions. Shadcn-like browsing experience for docs, examples, and install commands. Reatom-branded design (purple accent #6361a1, dark theme matching reatom.dev color palette). Deployed via default GitHub Pages at reatom.github.io/reusables.

## Context

- **Files involved:**
  - `astro.config.mjs` (site URL, base path, shiki config)
  - `src/styles/global.css` (reatom brand colors, typography)
  - `src/layouts/BaseLayout.astro` (shared HTML shell)
  - `src/lib/registry.ts` (build-time data layer for registry.json + markdown docs)
  - `src/components/Header.astro`, `Footer.astro`, `ReusableCard.astro`, `TypeBadge.astro`, `CopyButton.astro`
  - `src/pages/index.astro` (homepage with registry grid)
  - `src/pages/[name].astro` (individual reusable detail pages)
  - `public/favicon.svg` (reatom branding)
  - `.github/workflows/ci.yml` (add GitHub Pages deploy step)
- **Related patterns:** existing `registry.json` structure, co-located `.md`/`.example.ts`/`.ts` files in `src/reusables/`, reatom.dev color scheme from `../reatom/docs/src/styles/custom.css`
- **Dependencies:** none beyond Astro built-ins (shiki syntax highlighting is included)

## Approach

- **Testing approach**: Regular (code first, manual verification)
- Complete each task fully before moving to the next
- No external CSS frameworks - plain CSS with custom properties for theming
- Static site generation (SSG) with `base: '/reusables'` for GitHub Pages
- Read `registry.json` and file system at build time to generate pages
- Reference `../reatom/docs` for brand colors but keep this site standalone

## Tasks

### Task 1: Project setup, global styles, and base layout

**Files:**

- Modify: `astro.config.mjs`
- Create: `src/styles/global.css`
- Create: `src/layouts/BaseLayout.astro`
- Create: `public/favicon.svg`

**Steps:**

- [ ] Configure `astro.config.mjs`: set site to `https://reatom.github.io`, base to `/reusables`, configure shiki with dark theme for syntax highlighting
- [ ] Create `global.css` with CSS custom properties from reatom branding: dark bg (`#0a0a0f`), accent (`#6361a1`, `#bca4e0`), grays from reatom.dev palette, Inter font, code block styling, responsive utilities
- [ ] Create `BaseLayout.astro` with HTML head (meta, Inter font import, global styles, favicon), body wrapper with slot
- [ ] Add reatom-style SVG favicon
- [ ] Verify: run `pnpm dev` and confirm dev server starts with the layout rendering

### Task 2: Registry data layer

**Files:**

- Create: `src/lib/registry.ts`

**Steps:**

- [ ] Create `registry.ts` that imports `registry.json` and reads co-located files at build time
- [ ] Export typed helpers: `getAllReusables()` (returns all registry items with parsed metadata), `getReusableByName(name)` (single item lookup), `getReusableDoc(name)` (reads the `.md` file content), `getReusableExample(name)` (reads `.example.ts`/`.tsx` content), `getReusableSource(name)` (reads main `.ts` source)
- [ ] Export TypeScript types for registry item shape
- [ ] Add grouping by type: extension, factory, utility, integration
- [ ] Verify: create a temporary test page that dumps JSON of all reusables to confirm data layer works

### Task 3: Shared UI components

**Files:**

- Create: `src/components/Header.astro`
- Create: `src/components/Footer.astro`
- Create: `src/components/TypeBadge.astro`
- Create: `src/components/CopyButton.astro`
- Create: `src/components/ReusableCard.astro`

**Steps:**

- [ ] Create `Header.astro` with site title "@reatom/reusables", tagline "jsrepo registry", link to GitHub repo, link to reatom.dev docs
- [ ] Create `TypeBadge.astro` rendering colored badges per type (extension=blue, factory=green, utility=amber, integration=purple)
- [ ] Create `CopyButton.astro` with inline client-side JS for clipboard copy (for install commands)
- [ ] Create `ReusableCard.astro` showing: name, type badge, brief description (first line of doc), link to detail page
- [ ] Create `Footer.astro` with links to GitHub, reatom.dev, MIT license
- [ ] Verify: components render correctly when used in a test page

### Task 4: Homepage

**Files:**

- Create: `src/pages/index.astro`

**Steps:**

- [ ] Create `index.astro` with `BaseLayout` wrapping Header + content + Footer
- [ ] Hero section: title, short description of the registry, global install command (`pnpm dlx jsrepo add github/reatom/reusables`) with copy button
- [ ] Registry grid: list all reusables as `ReusableCard` components, grouped by type with section headings
- [ ] Style grid responsively: 1 col mobile, 2 col tablet, 3 col desktop
- [ ] Verify: run `pnpm dev`, confirm homepage shows all 7 reusables grouped by type

### Task 5: Individual reusable detail pages

**Files:**

- Create: `src/pages/[name].astro`

**Steps:**

- [ ] Create `[name].astro` with `getStaticPaths()` generating a page per registry item
- [ ] Page content: name + type badge, install command with copy button (`pnpm dlx jsrepo add github/reatom/reusables [name]`), rendered markdown documentation, example code with syntax highlighting, source code (collapsible `<details>` element), dependency info (devDependencies, registryDependencies as links to other reusable pages)
- [ ] Use Astro's built-in markdown rendering for doc content
- [ ] Render example and source code blocks with shiki highlighting
- [ ] Verify: navigate to each of the 7 reusable pages, confirm content renders

### Task 6: GitHub Pages deployment and build verification

**Files:**

- Modify: `.github/workflows/ci.yml` (add deploy job)

**Steps:**

- [ ] Add GitHub Pages deployment step to `ci.yml`: build astro site, deploy `dist/` to GitHub Pages using `actions/deploy-pages`
- [ ] Run `pnpm build` locally and verify static site builds with no errors
- [ ] Run `pnpm preview` and verify the built site works (check base path `/reusables` is correct)
- [ ] Spot-check all pages: homepage grid, each reusable detail page, install commands, code blocks

## Verification

- [ ] manual test: browse homepage, click each reusable card, verify docs render on detail page
- [ ] manual test: copy install command via copy button, verify clipboard content
- [ ] manual test: check responsive layout at mobile/tablet/desktop widths
- [ ] run build: `pnpm build` - must succeed with no errors
- [ ] run preview: `pnpm preview` - verify site works with `/reusables` base path

## Wrap-up

- [ ] move this plan to `docs/plans/completed/`
