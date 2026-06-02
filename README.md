# Valstrid — Portfolio Website

A dark-mode portfolio site for **Valstrid**, a web & brand designer. Built with Astro 4, structured as a faithful replica of [ayushwanjari.com](https://www.ayushwanjari.com/) adapted to dark mode with custom content.

**Repository:** [github.com/Valstrid/Portfolio](https://github.com/Valstrid/Portfolio)

---

## Table of Contents

1. [Overview](#overview)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [Layout Architecture](#layout-architecture)
5. [Component Reference](#component-reference)
6. [Design System](#design-system)
7. [Sidebar Behavior](#sidebar-behavior)
8. [Animations & Interactions](#animations--interactions)
9. [Development Commands](#development-commands)
10. [Deployment](#deployment)
11. [Content Guide — What to Change](#content-guide--what-to-change)

---

## Overview

The site is a single-page portfolio with a **split layout**:

- **Left sidebar** — Fixed panel, 288px wide. Shows a client list with hover-reveal testimonials through the Hero and Case Studies sections; switches to section navigation links once the user finishes scrolling past Case Studies.
- **Right main content** — Full scrollable area with six sections stacked vertically: Hero, Case Studies, Services, Testimonials, FAQ + Process, and Contact/Footer.

The design is dark-mode only, using a lime-green accent (`#c9f31d`) and serif/sans font pairing.

---

## Tech Stack

| Tool | Version | Purpose |
|------|---------|---------|
| [Astro](https://astro.build) | 4.15.x | Static site generator (Node 20 compatible) |
| TypeScript | Built-in | Type checking in `.astro` frontmatter |
| Google Fonts | — | DM Serif Display + Inter Variable |
| Vanilla JS | ES2020 | IntersectionObserver, accordion, mobile menu |
| CSS Custom Properties | — | Full design token system |

> **Node version:** The project uses Astro **4.x**, not 5 or 6. Astro 5+ requires Node 22; the current environment runs Node 20. Do not upgrade Astro without first upgrading Node.

---

## Project Structure

```
/tmp/portfolio/              ← working directory (not /workspace — permission issue)
├── public/
│   └── favicon.ico          ← site favicon
├── src/
│   ├── layouts/
│   │   └── Layout.astro     ← HTML shell: page loader, mobile header, site-grid wrapper
│   ├── pages/
│   │   └── index.astro      ← Single page: imports and orders all section components
│   ├── components/
│   │   ├── Sidebar.astro    ← Fixed left panel with client accordion + section nav
│   │   ├── Hero.astro       ← Top hero: headline, description, CTAs, stats row
│   │   ├── CaseStudies.astro  ← 2-col grid of project cards with gradient thumbnails
│   │   ├── Services.astro   ← 3-col service cards with gradient visual areas
│   │   ├── Testimonials.astro ← 3-col testimonial card grid
│   │   ├── FAQ.astro        ← Process steps (tilted cards) + 2-col accordion FAQ
│   │   ├── Footer.astro     ← Contact CTA with cal.com widget + copyright footer
│   │   ├── Navbar.astro     ← (Unused — superseded by Sidebar)
│   │   ├── ValueProps.astro ← (Unused — superseded by Hero stats)
│   │   └── Process.astro    ← (Unused — process cards merged into FAQ.astro)
│   └── styles/
│       └── global.css       ← All global CSS: tokens, layout, typography, utilities
├── astro.config.mjs         ← Astro config: site URL, HTML compression
├── package.json             ← Dependencies (astro@^4.15.0 only)
└── tsconfig.json            ← TypeScript config
```

---

## Layout Architecture

### Desktop (≥ 961px)

```
┌─────────────────┬───────────────────────────────────────┐
│  SIDEBAR        │  MAIN CONTENT (scrollable)             │
│  position:fixed │                                        │
│  width: 288px   │  Hero                                  │
│  height: 100vh  │  Case Studies                          │
│  z-index: 50    │  Services                              │
│                 │  Testimonials                          │
│  [clients OR    │  FAQ + Process                         │
│   nav links]    │  Contact / Footer                      │
│                 │                                        │
└─────────────────┴───────────────────────────────────────┘
```

- `.site-grid` has `margin-left: var(--sidebar-w)` (288px) to push content right.
- The sidebar is `position: fixed` — NOT `sticky`. `sticky` was broken because `html` and `body` have `overflow-x: hidden`, which per CSS spec creates a scroll container that traps sticky elements.

### Mobile (≤ 960px)

- A fixed **mobile header** (56px tall) shows the Valstrid wordmark and a hamburger button.
- `.site-grid` has `margin-left: 0; padding-top: 56px`.
- The sidebar becomes a **slide-in drawer**: `transform: translateX(-100%)` by default, `translateX(0)` when `.mobile-open` is added via JS.
- A dark overlay (`#mobile-overlay`, z-index 99) covers content when the drawer is open.
- The hamburger animates to an X when active.

---

## Component Reference

### `Layout.astro`
The HTML shell. Contains:
- `<head>` with meta tags, favicon, Google Fonts preconnect
- Page loader (`#page-loader`) with wordmark + progress bar animation
- Fixed mobile header with hamburger
- `#mobile-overlay` for drawer backdrop
- `.site-grid` wrapper → `<Sidebar />` + `.site-main` (slot)
- Global `<script>` for: page loader hide, scroll-reveal IntersectionObserver, mobile menu open/close

### `Sidebar.astro`
The most complex component. Two-panel system inside a fixed left column.

**Always visible:**
- `V` mark logo + `Valstrid` wordmark
- `Available` pulse badge
- Tagline text
- `Book a call` CTA button (bottom)

**Panel A — Client list** (visible until the Case Studies section has fully scrolled past):
- 8 clients listed by company name
- Hovering (or focusing) a client reveals their testimonial quote + author via CSS `:hover` / `:focus-within` using `max-height` transition — no JS click required
- The arrow icon fades in on hover

**Panel B — Section navigation** (visible when scrolled past Case Studies):
- Links: Latest projects / Services / Testimonials / FAQ / Contact
- Each link has a short horizontal line that extends and turns accent-green when active
- Active link is tracked via a second IntersectionObserver watching all section IDs

**Panel switching:** Both panels use `position: absolute; inset: 0` inside `.sidebar-switch { position: relative; flex: 1; overflow: hidden }`. Controlled via `.sidebar.nav-mode` class toggled by an IntersectionObserver on `#work`.

### `Hero.astro`
Compact section at the top of the main content. Contains:
- Small label row (`Valstrid — Web & Brand Design`)
- Large serif headline with italic accent word
- Description paragraph
- Two CTAs: "Book an intro call" (primary) + "View work" (ghost)
- Stats row: 40+ Projects / 4 yrs / 28d avg / 100% satisfaction

### `CaseStudies.astro` (`#work`)
2-column grid of 4 project cards. Each card:
- Gradient thumbnail (no real images — uses CSS `linear-gradient` with project-specific colors)
- Play button overlay on hover
- Tags, year, title, description, "View case study →" link

**Projects:** Arconic Capital, Build Club, Preve Health, Vale

### `Services.astro` (`#services`)
3-column grid of service cards. Each card:
- Gradient visual area at top with SVG icon (color varies per service)
- Title, description, deliverables checklist

**Services:** Website Design & Build, Brand & Visual Identity, Framer Development

### `Testimonials.astro` (`#testimonials`)
3-column grid of 6 testimonial cards. Each card:
- Serif `"` quote mark (accent color, low opacity)
- Quote text
- Avatar circle (initials, dark color per person), name, title, company

### `FAQ.astro` (`#faq`)
Two sub-sections in a single `<section id="faq">`:

1. **Process cards** (top): 3 cards with slight CSS `rotate()` transforms, like physical cards on a table. Cards flatten and lift on hover. Steps: `01 Intro call`, `02 Sprint planning`, `03 Design, build & launch`.

2. **FAQ accordion** (bottom): 2-column layout. Left column: "Work & process" (6 items). Right column: "Design & Framer" (6 items). Click to expand/collapse. Only one item open at a time.

### `Footer.astro` (`#contact`)
Two parts in one component:

1. **Contact section**: Headline, description, "Book an intro call" CTA + email link. Mock cal.com widget (CSS-built calendar with highlighted available dates).

2. **Footer bar**: Valstrid wordmark + tagline, social links (Twitter, LinkedIn, Dribbble), copyright year.

---

## Design System

All design tokens are CSS custom properties in `src/styles/global.css`.

### Colors

| Token | Value | Usage |
|-------|-------|-------|
| `--bg` | `#080808` | Page background |
| `--bg-2` | `#0f0f0f` | Elevated surfaces |
| `--bg-3` | `#181818` | Hover states |
| `--border` | `#1e1e1e` | Default borders |
| `--border-2` | `#2a2a2a` | Stronger borders / hover |
| `--text` | `#f0f0f0` | Primary text |
| `--text-2` | `#888888` | Secondary / muted text |
| `--text-3` | `#444444` | Disabled / placeholder |
| `--accent` | `#c9f31d` | Lime green — CTAs, highlights |
| `--accent-2` | `#a8d418` | Accent hover state |
| `--card-bg` | `#0d0d0d` | Card backgrounds |

### Typography

| Token | Value |
|-------|-------|
| `--font-serif` | `DM Serif Display, Georgia, serif` |
| `--font-sans` | `Inter, system-ui, -apple-system, sans-serif` |

Key classes: `.display` (72px), `.headline` (56px), `.body-lg`, `.body-sm`, `.section-label`.

### Spacing

| Token | Value | Usage |
|-------|-------|-------|
| `--sidebar-w` | `288px` | Sidebar width |
| `--section-py` | `clamp(64px, 8vw, 112px)` | Section vertical padding |
| `--section-px` | `clamp(28px, 4vw, 64px)` | Section horizontal padding |

### Background

The dot pattern is a pure-CSS `radial-gradient` applied via `body::before`:
```css
background-image: radial-gradient(circle, rgba(255,255,255,0.055) 1px, transparent 1px);
background-size: 28px 28px;
```

---

## Sidebar Behavior

The sidebar has two states controlled by a CSS class on `<aside id="sidebar">`:

```
Default (no class)   → shows client list    (Hero/Case Studies are in view)
.nav-mode            → shows section nav    (Case Studies has scrolled out above viewport)
```

**Trigger:** `IntersectionObserver` on `#work` with `threshold: 0.05`. The sidebar switches to navigation only when the Case Studies section is no longer intersecting and its bottom edge has passed above the viewport.

**Panel transition:** CSS `opacity` + `transform: translateY` with `0.38s` duration. The hidden panel has `pointer-events: none` to prevent interaction.

**Active nav link:** A second observer watches sections `#work`, `#services`, `#testimonials`, `#faq`, `#contact` with `rootMargin: '-15% 0px -60% 0px'` (activates when a section is in the middle 25% of the viewport). The `.active` class on a link extends its line indicator and turns it accent-green.

**Client hover:** Pure CSS — `.client-item:hover .client-body` and `:focus-within` trigger `max-height: 220px; opacity: 1` via transition. No JavaScript click handler needed.

---

## Animations & Interactions

### Page Loader
Displays on initial page load. Shows `Valstrid` wordmark (slide-up animation) + progress bar (fills over 1.2s). Fades out after `window.load` + 1.4s timeout via `.loaded` class.

### Scroll Reveal
All `.reveal` elements animate in when they enter the viewport. Uses a global `IntersectionObserver` in `Layout.astro` with `threshold: 0.08`. Once visible, the element is unobserved (animation fires only once). Delay classes: `.reveal-delay-1` through `.reveal-delay-5` (0.08s increments).

### Button Hover
- **Primary (accent):** `translateY(-1px)` + green glow shadow
- **Ghost:** `translateY(-1px)` + lighter border
- **Arrow icon:** `translate(3px, -3px)` on parent hover
- Active (click): `scale(0.97)` on all buttons

### Case Study Cards
Hover: `translateY(-3px)` + stronger border + play button overlay fades/scales in.

### Process Cards
Default: CSS `rotate()` + `translateY()` per card (slightly tilted). Hover: `rotate(0deg) translateY(-8px)` + lifted shadow + `z-index: 10`.

### FAQ Accordion
Click trigger: `max-height` transition on answer panel. Icon button rotates/fills accent on open. Only one item open at a time per column (all items in `.faq-trigger` close on any click).

---

## Development Commands

```bash
# Install dependencies
npm install

# Start dev server (localhost:4321)
npm run dev

# Build for production (output to ./dist/)
npm run build

# Preview production build locally
npm run preview
```

> Working directory for this project is `/tmp/portfolio` (not `/workspace` — that directory is owned by root and has no write access for the `node` user).

---

## Deployment

The project is connected to GitHub at:
**[github.com/Valstrid/Portfolio](https://github.com/Valstrid/Portfolio)**

To push changes:
```bash
cd /tmp/portfolio
git add <files>
git commit -m "description"
git push origin main
```

Git is configured with:
- `user.email = hello@valstrid.com`
- `user.name = Valstrid`
- Remote: `https://ghp_...@github.com/Valstrid/Portfolio.git`

`astro.config.mjs` has `site: 'https://valstrid.github.io'` set for potential GitHub Pages deployment. To deploy via GitHub Pages, add `base` config if needed and push the `dist/` output or configure a GitHub Actions workflow.

---

## Content Guide — What to Change

### Personal Info
All personal copy lives inside individual components, not a central data file. Key locations:

| What | File | What to look for |
|------|------|-----------------|
| Hero headline & description | `src/components/Hero.astro` | `<h1>` and `<p class="hero-desc">` |
| Stats (40+, 4yrs, 28d, 100%) | `src/components/Hero.astro` | `.stat-number` spans |
| Client names & testimonials | `src/components/Sidebar.astro` | `const clients = [...]` array |
| Case study projects | `src/components/CaseStudies.astro` | `const projects = [...]` array |
| Service cards | `src/components/Services.astro` | `const services = [...]` array |
| Testimonial cards | `src/components/Testimonials.astro` | `const testimonials = [...]` array |
| Process steps | `src/components/FAQ.astro` | `const steps = [...]` at top |
| FAQ questions | `src/components/FAQ.astro` | `const categories = [...]` array |
| Contact email | `src/components/Footer.astro` | `href="mailto:..."` links |
| Social links | `src/components/Footer.astro` | `const socials = [...]` array |
| Page title / meta description | `src/layouts/Layout.astro` | `Props` defaults |

### Adding a Real Cal.com Widget
The cal.com booking widget in `Footer.astro` is currently a CSS mock (calendar grid with highlighted available dates). To replace it with the real embed:
1. Get the embed script/iframe from cal.com dashboard
2. Replace the `<div class="cal-placeholder">` block in `Footer.astro` with the real embed code
3. Remove the related `.cal-*` CSS styles below it

### Adding Real Project Images/Videos
Case study thumbnails are CSS `linear-gradient` backgrounds. To use real images:
1. Add image files to `public/images/`
2. In `CaseStudies.astro`, replace the `.cs-thumb` gradient approach with `<img>` or CSS `background-image: url(...)`

### Accent Color
Change `--accent` in `src/styles/global.css` `:root` block. Also update `--accent-2` (hover state). The `::selection` color at the bottom of the file uses `var(--accent)` automatically.

### Fonts
Currently: `DM Serif Display` (serif) + `Inter` (sans). The `@import` is at the top of `src/styles/global.css`. Replace the Google Fonts URL and update `--font-serif` / `--font-sans` tokens.
