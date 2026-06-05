# Animation & Interaction Plan

## Current State

### Scroll Reveals
- `.reveal` class on elements — `opacity: 0; transform: translateY(24px)`
- IntersectionObserver in `Layout.astro` adds `.visible` → fades in with 0.7s ease-out
- Delay utilities `.reveal-delay-1` through `.reveal-delay-5` (8ms steps)
- Most section headers and cards already use `.reveal` with delays

### Hover States
- **Buttons**: `transform: translateY(-1px)` + box-shadow + arrow icon translate
- **Cards** (CaseStudies): lift + border-color change on hover
- **Process cards** (FAQ): rotate-to-flat + lift on hover
- **FAQ accordion**: icon rotates from + to × on expand

### Page Loader
- Name reveals with `translateY(110%) → 0` animation
- Progress bar fills via `width: 0 → 100%` animation
- Loader fades out with `opacity: 0; visibility: hidden` on `.loaded`

### Sidebar Panel Transition
- `.sidebar-switch` uses CSS `transition: transform` for panel slide
- Client list slides left, nav list slides in from right when `.nav-mode` is applied

---

## Planned Improvements

### 1. Prefers-Reduced-Motion Support

Add to `global.css`:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
  .reveal {
    opacity: 1;
    transform: none;
  }
}
```

This ensures all CSS animations/transitions are bypassed for users who have
requested reduced motion in their OS settings.

### 2. Mobile Menu Animation

Current state: sidebar slides in via `transform: translateX(-100%) → 0`.
Planned improvements:
- Hamburger lines animate to X shape (already implemented in CSS)
- Overlay fades in (`opacity: 0 → 0.75`)
- Nav links stagger-reveal on menu open (add `.reveal` logic to sidebar links
  when `.mobile-open` is applied)
- Escape key closes menu (add keydown listener in `Layout.astro`)
- Outside click on overlay closes menu (already implemented)

### 3. View Transitions (Astro native)

Astro 4.x ships built-in View Transitions via `<ViewTransitions />` component.

To enable:
```astro
---
import { ViewTransitions } from 'astro:transitions';
---
<head>
  <ViewTransitions />
</head>
```

This adds smooth cross-page fade transitions. Since this is currently a single-
page site, this is most useful if additional pages are added (e.g. individual
case study pages). Hold off until multi-page navigation exists.

### 4. Booking Widget Step Transitions

Current state: steps switch instantly via `.is-active` class toggle.
Planned: add a short `opacity` + `transform` transition between steps.

```css
.bw-step {
  transition: opacity 0.3s var(--ease-out), transform 0.3s var(--ease-out);
}
.bw-step:not(.is-active) {
  opacity: 0;
  transform: translateY(8px);
  pointer-events: none;
  position: absolute;
}
.bw-step.is-active {
  opacity: 1;
  transform: translateY(0);
}
```

Note: this requires `.booking-widget` to be `position: relative` and the
inactive steps to be `position: absolute` to prevent layout shifts.

### 5. Cursor / Magnetic Effects (Optional)

Consider a subtle custom cursor dot for desktop. Only add if it enhances the
premium feel — skip if it feels gimmicky. Use a 12px accent-colored circle
that follows cursor with 100ms lerp delay.

Implementation pattern (vanilla JS):
```js
const dot = document.createElement('div');
dot.classList.add('cursor-dot');
document.body.append(dot);
let mx = 0, my = 0, cx = 0, cy = 0;
document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
function loop() {
  cx += (mx - cx) * 0.15;
  cy += (my - cy) * 0.15;
  dot.style.transform = `translate(${cx}px, ${cy}px)`;
  requestAnimationFrame(loop);
}
loop();
```

Hide on touch devices: `@media (pointer: coarse) { .cursor-dot { display: none; } }`

---

## Scroll Reveal Strategy

Current reveals are applied manually per-component. They work but the timing
delays (`.reveal-delay-1` etc.) don't account for viewport visibility — all
delays run from when the element enters the viewport, not from page load.

This is the correct behavior. Keep the current approach.

For new sections, the pattern is:
1. Add `class="reveal"` to the section header
2. Add `class="reveal reveal-delay-N"` to grid items (stagger 1-through-5)
3. Never use `.reveal` on elements that are above the fold — they would flash
   invisible before JS runs

---

## Performance Notes

- Google Fonts are loaded with `display=swap` which prevents FOIT
- The page loader hides the initial paint flash for slower connections
- `compressHTML: true` and `inlineStylesheets: 'auto'` in `astro.config.mjs`
  handle basic output optimization
- Images: currently all thumbnails are CSS gradients. When real images are
  added, use Astro's `<Image>` component (`astro:assets`) for automatic
  WebP conversion and lazy loading:

```astro
---
import { Image } from 'astro:assets';
import projectImg from '../assets/project-name.jpg';
---
<Image src={projectImg} alt="Project name" width={800} height={500} />
```

---

## QA Breakpoints

Test at these viewport widths after any layout changes:

| Width | Device target |
|---|---|
| 320px | Smallest Android |
| 360px | Common Android |
| 390px | iPhone 14 |
| 430px | iPhone 14 Plus |
| 768px | iPad portrait |
| 1024px | iPad landscape / small laptop |
| 1440px | Standard desktop |
| 1728px | Large desktop |
| 1920px | Full HD monitor |

Key things to verify at each breakpoint:
- No horizontal scroll (check `overflow-x`)
- Sidebar/drawer behavior correct
- Typography scales naturally with `clamp()`
- Booking widget fits within its column
- Cards don't overflow or collapse
- Touch targets >= 44px on mobile
