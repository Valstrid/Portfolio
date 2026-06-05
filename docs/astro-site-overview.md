# Astro Site Overview

## Project Setup

- **Framework**: Astro 4.15.x (static output)
- **Node**: 20+
- **Deploy target**: GitHub Pages — `site: 'https://valstrid.github.io'`
- **TypeScript**: strict mode (`astro/tsconfigs/strict`)
- **Dependencies**: only `astro` — no UI framework, no component library

### Commands

| Command | What it does |
|---|---|
| `npm run dev` | Start dev server at `localhost:4321` |
| `npm run build` | Build to `dist/` |
| `npm run preview` | Preview the build locally |

---

## File Structure

```
src/
  components/
    CaseStudies.astro   — Project grid (4 hardcoded projects)
    FAQ.astro           — Process steps + FAQ accordion
    Footer.astro        — Booking widget + footer links
    Hero.astro          — Hero headline, CTAs, stats
    Navbar.astro        — UNUSED legacy navbar (do not import)
    Services.astro      — 3-service grid with gradient visuals
    Sidebar.astro       — Fixed sidebar with clients + nav panels
    Testimonials.astro  — 6 testimonials in a 3-col grid
    ValueProps.astro    — UNUSED section (do not import)
  layouts/
    Layout.astro        — Root layout: page loader, mobile header,
                          mobile overlay, sidebar, site-grid wrapper,
                          reveal-animation IntersectionObserver JS
  pages/
    index.astro         — Single page, imports all section components
  styles/
    global.css          — All design tokens, reset, layout, typography,
                          reveal animations, responsive breakpoints
public/
  favicon.ico
  favicon.svg
docs/                   — This folder
```

---

## Page Composition

`index.astro` renders in this order inside `<Layout>`:

1. `Hero` — above the fold
2. `CaseStudies` — `id="work"` triggers sidebar panel switch
3. `Services`
4. `Testimonials`
5. `FAQ` — process steps + accordion
6. `Footer` — booking widget + contact/links

---

## Adding or Editing Projects

All project data is **hardcoded** in the frontmatter of `CaseStudies.astro`.
To add a project, add an entry to the `projects` array at the top of that file:

```js
{
  title: 'Project Name',
  category: 'Brand / Web',
  year: '2024',
  role: 'Design & Development',
  desc: 'Short description of the project and outcome.',
  accent: '#c9f31d',    // thumbnail accent color
  lines: [             // decorative line positions in thumbnail
    { x1: 10, y1: 10, x2: 90, y2: 10 },
  ],
}
```

The thumbnail is currently a CSS gradient — replace with a real `<img>` once
assets are available. See `animation-and-interaction-plan.md` for image
optimization guidance.

---

## Adding or Editing Testimonials

Data is hardcoded in `Testimonials.astro` frontmatter — edit the `testimonials`
array there. Each item has: `name`, `role`, `company`, `text`, and optionally
`featured: true` to highlight it.

---

## Adding or Editing FAQ Items

Data is hardcoded in `FAQ.astro` frontmatter. Edit the `categories` array —
each category has a `label` and an `items` array of `{ q, a }` objects.

---

## Sidebar Behavior

- **Desktop (>960px)**: `position: fixed`, 288px wide on the left.
  `main` content has `margin-left: 288px` via `.site-grid`.
- **Mobile (<=960px)**: sidebar becomes a drawer, hidden off-screen with
  `transform: translateX(-100%)`. Shown via `.mobile-open` class.
  Mobile header visible with hamburger trigger.
- **Panel switching**: JavaScript in `Sidebar.astro` watches
  `#work` section via `IntersectionObserver`. When `#work` scrolls out
  of view upward, sidebar switches from client-list panel to nav-links panel
  by toggling `.nav-mode` on `.sidebar-switch`.

---

## Reusable Classes (global.css)

| Class | Purpose |
|---|---|
| `.headline` | Serif display headline (clamp 32–56px) |
| `.display` | Larger serif display (clamp 40–72px) |
| `.body-lg` | Large body copy (clamp 15–18px) |
| `.body-sm` | Small body copy (14px) |
| `.section-label` | Uppercase eyebrow label |
| `.btn` `.btn-primary` `.btn-ghost` | Button variants |
| `.tag` | Pill tag for categories/tech labels |
| `.card` | Card container with border + bg |
| `.reveal` | Scroll-reveal base (opacity 0 → 1) |
| `.reveal-delay-1` to `-5` | Staggered reveal delays |
| `.divider` | 1px horizontal rule |
| `.link-underline` | Animated underline on hover |

---

## How the Build Works

Astro compiles to static HTML+CSS+JS in `dist/`. Key behaviors:

- **Scoped CSS**: `<style>` blocks in `.astro` files get `[data-astro-cid-*]`
  attribute selectors added automatically. This means CSS in a `<style>` block
  does NOT apply to elements created dynamically in JavaScript.
  **Fix**: Use `<style is:global>` for any CSS targeting JS-created elements.
  This is already done in `Footer.astro` for the booking widget.
- **Inline stylesheets**: `inlineStylesheets: 'auto'` means small CSS files are
  inlined for performance.
- **HTML compression**: `compressHTML: true` strips whitespace from output.
