# Design System Notes

## Color Tokens

All tokens are defined as CSS custom properties in `src/styles/global.css`.

| Token | Value | Usage |
|---|---|---|
| `--bg` | `#080808` | Page background |
| `--bg-2` | `#0f0f0f` | Slightly lighter bg (sidebar, inputs) |
| `--bg-3` | `#181818` | Surface / hover state bg |
| `--border` | `#1e1e1e` | Default border color |
| `--border-2` | `#2a2a2a` | Slightly lighter border, hover borders |
| `--text` | `#f0f0f0` | Primary text |
| `--text-2` | `#888888` | Secondary / muted text |
| `--text-3` | `#444444` | Disabled / decorative text |
| `--accent` | `#c9f31d` | Primary brand accent (lime-green) |
| `--accent-2` | `#a8d418` | Darker accent for pressed states |
| `--card-bg` | `#0d0d0d` | Card backgrounds |

### Accent on dark backgrounds
`--accent` (`#c9f31d`) against `--bg` (`#080808`) passes WCAG AA for large text
(contrast ratio ~9.6:1). Use it only for decorative accents, icons, and large
type — not for small body text.

---

## Typography

### Fonts
- **Sans-serif**: Inter (300, 400, 500, 600, 700, 800) — loaded from Google Fonts
- **Serif/display**: DM Serif Display (regular + italic) — loaded from Google Fonts

### Type Scale

| Class | Font | Size | Weight | Usage |
|---|---|---|---|---|
| `.display` | Serif | clamp(40–72px) | 400 | Hero headline |
| `.headline` | Serif | clamp(32–56px) | 400 | Section headings |
| `.section-label` | Sans | 11px | 600 | Uppercase eyebrow labels |
| `.body-lg` | Sans | clamp(15–18px) | 400 | Lead paragraph copy |
| `.body-sm` | Sans | 14px | 400 | Supporting body copy |

### Font vars
```css
--font-sans:  'Inter', system-ui, -apple-system, sans-serif;
--font-serif: 'DM Serif Display', Georgia, serif;
```

---

## Spacing & Layout

### Structural variables
```css
--sidebar-w:  288px;           /* fixed sidebar width */
--section-py: clamp(64px, 8vw, 112px);  /* section vertical padding */
--section-px: clamp(28px, 4vw, 64px);   /* section horizontal padding */
```

### Layout model
- Sidebar is `position: fixed; left: 0; top: 0; width: var(--sidebar-w)`
- Main content: `.site-grid { margin-left: var(--sidebar-w) }`
- No global max-width container — sections fill the remaining column
- **Note**: A `--content-max: 1200px` container class should be added to
  prevent ultra-wide line lengths on >1440px monitors. See Step 3 in the
  improvement plan.

### Breakpoints
| Name | Value | Behavior |
|---|---|---|
| Mobile | `<=960px` | Sidebar becomes drawer, mobile header shows |
| Narrow mobile | `<=768px` | FAQ 2-col → 1-col |
| Very narrow | `<=640px` | Process cards stack vertically |

---

## Border Radius

```css
--radius-sm:   6px;
--radius-md:   12px;
--radius-lg:   16px;
--radius-xl:   24px;
--radius-pill: 999px;
```

---

## Shadows

```css
--shadow-sm:  0 2px 8px rgba(0,0,0,0.4);
--shadow-md:  0 8px 32px rgba(0,0,0,0.5);
--shadow-lg:  0 24px 64px rgba(0,0,0,0.6);
```

---

## Easing Functions

```css
--ease-out:    cubic-bezier(0.22, 1, 0.36, 1);    /* default deceleration */
--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1); /* overshoot/bouncy */
--ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);    /* symmetric in-out */
```

---

## Component Patterns

### Buttons
Three variants: `.btn-primary` (accent fill), `.btn-ghost` (outlined).
All use `.btn` base class for shared behavior (padding, border-radius, transitions).

```html
<a href="#" class="btn btn-primary">
  Get started
  <svg class="arrow-icon">...</svg>
</a>
<a href="#" class="btn btn-ghost">View work</a>
```

### Tags
```html
<span class="tag">Framer</span>
```

### Cards
```html
<div class="card">...</div>
```

### Reveal animations
Add `.reveal` to any element. The IntersectionObserver in `Layout.astro`
adds `.visible` when the element enters the viewport. For staggered effects,
add `.reveal-delay-1` through `.reveal-delay-5`.

```html
<div class="reveal reveal-delay-2">...</div>
```

---

## Dot-Grid Background

Applied via `body::before` in `global.css` — a `radial-gradient` dot pattern
at 28px spacing, `pointer-events: none`, `z-index: 0`. This is decorative only.

---

## Page Loader

`#page-loader` is a fixed overlay with `.loaded` class toggled by JS in
`Layout.astro` on the `DOMContentLoaded` event (with a brief delay).
Contains `.loader-wordmark` (name) and `.loader-bar-fill` (progress bar).

---

## Scrollbar

Custom thin scrollbar via `::-webkit-scrollbar` rules — 4px width,
transparent track, `--border-2` colored thumb.
