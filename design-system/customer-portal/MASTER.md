# Design System Master File

> **LOGIC:** When building a specific page, first check `design-system/pages/[page-name].md`.
> If that file exists, its rules **override** this Master file.
> If not, strictly follow the rules below.

---

**Project:** customer-portal
**Generated:** 2026-10-09 03:32:40
**Category:** Home Decoration & Interior Design
**Revision:** Option (b), approved 2026-10-09: generator palette with warm neutrals fixed, Fraunces + Inter, storefront layout instead of storytelling.

---

## Global Rules

### Color Palette

| Role | Hex | CSS Variable |
|------|-----|--------------|
| Primary | `#78716C` | `--color-primary` |
| On Primary | `#FFFFFF` | `--color-on-primary` |
| Secondary | `#A8A29E` | `--color-secondary` |
| On Secondary | `#000000` | `--color-on-secondary` |
| Accent/CTA | `#D97706` | `--color-accent` |
| On Accent/CTA | `#000000` | `--color-on-accent` |
| Background | `#FAF5F2` | `--color-background` |
| Foreground | `#1C1917` | `--color-foreground` |
| Card | `#FFFFFF` | `--color-card` |
| Card Foreground | `#1C1917` | `--color-card-foreground` |
| Muted | `#F5F0EC` | `--color-muted` |
| Muted Foreground | `#57534E` | `--color-muted-foreground` |
| Border | `#E7E1DC` | `--color-border` |
| Success (in stock) | `#15803D` | `--color-success` |
| Destructive | `#DC2626` | `--color-destructive` |
| On Destructive | `#FFFFFF` | `--color-on-destructive` |
| Ring | `#78716C` | `--color-ring` |

**Color Notes:** Interior warm grey + gold accent. All neutrals are warm stone (no cool slate).

**shadcn mapping** (`src/app/globals.css`): `--primary` = stone `#78716C` (secondary UI, rings, accents in headings; not for body text, it's ~4.5:1 on background). Amber lives in a separate `--cta` token (`bg-cta` / Button `variant="cta"`) for the conversion actions only: Shop, Add to cart, Checkout. shadcn's `--accent` stays a soft warm neutral (`#F0E9E3`) because shadcn uses it for hover backgrounds. Dark mode: background `#1C1917`, card `#292524`, CTA `#F59E0B`, success `#4ADE80`.

### Typography

- **Heading Font:** Fraunces (`font-heading`; applied to h1–h3 globally). Semibold for titles, italic regular for accent phrases.
- **Body Font:** Inter (`font-sans`)
- **Mood:** warm, editorial, home & interiors
- **Loading:** `next/font/google` in `src/app/layout.tsx` (CSS variables `--font-fraunces`, `--font-inter`); no CSS `@import`.

### Spacing Variables

| Token | Value | Usage |
|-------|-------|-------|
| `--space-xs` | `4px` / `0.25rem` | Tight gaps |
| `--space-sm` | `8px` / `0.5rem` | Icon gaps, inline spacing |
| `--space-md` | `16px` / `1rem` | Standard padding |
| `--space-lg` | `24px` / `1.5rem` | Section padding |
| `--space-xl` | `32px` / `2rem` | Large gaps |
| `--space-2xl` | `48px` / `3rem` | Section margins |
| `--space-3xl` | `64px` / `4rem` | Hero padding |

### Shadow Depths

| Level | Value | Usage |
|-------|-------|-------|
| `--shadow-sm` | `0 1px 2px rgba(0,0,0,0.05)` | Subtle lift |
| `--shadow-md` | `0 4px 6px rgba(0,0,0,0.1)` | Cards, buttons |
| `--shadow-lg` | `0 10px 15px rgba(0,0,0,0.1)` | Modals, dropdowns |
| `--shadow-xl` | `0 20px 25px rgba(0,0,0,0.15)` | Hero images, featured cards |

---

## Component Specs

### Buttons

Use shadcn `<Button>`: `variant="cta"` for conversion actions, `default`/`outline` for everything else. The CSS below is the generator's reference spec.

```css
/* Primary Button */
.btn-primary {
  background: #D97706;
  color: #000000;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  transition: all 200ms ease;
  cursor: pointer;
}

.btn-primary:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

/* Secondary Button */
.btn-secondary {
  background: transparent;
  color: #0F172A;
  border: 2px solid #78716C;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  transition: all 200ms ease;
  cursor: pointer;
}
```

### Cards

```css
.card {
  background: #FAF5F2;
  border-radius: 12px;
  padding: 24px;
  box-shadow: var(--shadow-md);
  transition: all 200ms ease;
  cursor: pointer;
}

.card:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
}
```

### Inputs

```css
.input {
  padding: 12px 16px;
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 200ms ease;
}

.input:focus {
  border-color: #78716C;
  outline: none;
  box-shadow: 0 0 0 3px #78716C20;
}
```

### Modals

```css
.modal-overlay {
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
}

.modal {
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: var(--shadow-xl);
  max-width: 500px;
  width: 90%;
}
```

---

## Style Guidelines

**Style:** Minimalism & Swiss Style

**Keywords:** Clean, simple, spacious, functional, white space, high contrast, geometric, sans-serif, grid-based, essential

**Best For:** Enterprise apps, dashboards, documentation sites, SaaS platforms, professional tools

**Key Effects:** Subtle hover (200-250ms), smooth transitions, sharp shadows if any, clear type hierarchy, fast loading

### Page Pattern

**Pattern Name:** Storefront (replaces the generator's "Scroll-Triggered Storytelling", which suits SaaS landing pages, not shopping)

- **Section Order:** Announcement bar > Hero (eyebrow, serif headline, one CTA) > Value props > Footer. Listing: title, filters, product grid.
- **CTA Placement:** One amber CTA per view (hero, product card, cart footer).
- **Motion:** Short entrance fades only; framer-motion respects `prefers-reduced-motion` via `MotionConfig` in `src/app/providers.tsx`. Hover = shadow or image zoom inside a clipped frame, never scaling the card itself.

---

## Anti-Patterns (Do NOT Use)

- ❌ Excessive decoration

### Additional Forbidden Patterns

- ❌ **Emojis as icons** — Use SVG icons (Heroicons, Lucide, Simple Icons)
- ❌ **Missing cursor:pointer** — All clickable elements must have cursor:pointer
- ❌ **Layout-shifting hovers** — Avoid scale transforms that shift layout
- ❌ **Low contrast text** — Maintain 4.5:1 minimum contrast ratio
- ❌ **Instant state changes** — Always use transitions (150-300ms)
- ❌ **Invisible focus states** — Focus states must be visible for a11y

---

## Pre-Delivery Checklist

Before delivering any UI code, verify:

- [ ] No emojis used as icons (use SVG instead)
- [ ] All icons from consistent icon set (Heroicons/Lucide)
- [ ] `cursor-pointer` on all clickable elements
- [ ] Hover states with smooth transitions (150-300ms)
- [ ] Light mode: text contrast 4.5:1 minimum
- [ ] Focus states visible for keyboard navigation
- [ ] `prefers-reduced-motion` respected
- [ ] Responsive: 375px, 768px, 1024px, 1440px
- [ ] No content hidden behind fixed navbars
- [ ] No horizontal scroll on mobile
