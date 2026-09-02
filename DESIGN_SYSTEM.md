# Design System — Mira Dashboard

> **Version:** 0.0.1
> **Stack:** Tailwind CSS 4 · shadcn/ui (radix-nova) · oklch Colors · Geist Font

---

## 1. Color System

Colors use the **oklch** color space for perceptual uniformity. All tokens defined in `src/index.css`.

### 1.1 Core Colors

| Token | Light Mode | Dark Mode | Usage |
|-------|-----------|-----------|-------|
| `--primary` | `oklch(0.588 0.158 241.966)` | same | Primary actions, links, focus rings |
| `--primary-foreground` | `oklch(0.985 0 0)` | `oklch(1 0 0)` | Text on primary |
| `--secondary` | `oklch(0.967 0.007 247.896)` | `oklch(0.208 0.042 265.755)` | Secondary buttons, badges |
| `--secondary-foreground` | `#161C24` | `oklch(0.985 0 0)` | Text on secondary |
| `--accent` | `oklch(0.645 0.246 34.003)` | same | Accent highlights, alerts |
| `--accent-foreground` | `oklch(1 0 0)` | same | Text on accent |
| `--destructive` | `oklch(0.577 0.245 27.325)` | `oklch(0.704 0.191 22.216)` | Error states, delete actions |
| `--background` | `oklch(1 0 0)` | `#161C24` | Page background |
| `--foreground` | `#161C24` | `oklch(0.985 0 0)` | Primary text |
| `--card` | `oklch(1 0 0)` | `oklch(0.141 0.044 263.951)` | Card backgrounds |
| `--card-foreground` | `#161C24` | `oklch(0.985 0 0)` | Text on cards |
| `--popover` | `oklch(1 0 0)` | `oklch(0.141 0.044 263.951)` | Popover backgrounds |
| `--popover-foreground` | `#161C24` | `oklch(0.985 0 0)` | Text on popovers |
| `--muted` | `oklch(0.967 0.003 264.542)` | `oklch(0.208 0.042 265.755)` | Muted backgrounds |
| `--muted-foreground` | `oklch(0.551 0.027 264.364)` | `oklch(0.708 0 0)` | Subdued text |
| `--border` | `oklch(0.92 0.004 286.32)` | `oklch(1 0 0 / 10%)` | Default borders |
| `--input` | `oklch(0.92 0.004 286.32)` | `oklch(1 0 0 / 15%)` | Input borders |
| `--ring` | `oklch(0.588 0.158 241.966)` | same | Focus rings |

### 1.2 Chart Colors

| Token | Value | Usage |
|-------|-------|-------|
| `--chart-1` | `oklch(0.588 0.158 241.966)` | Blue |
| `--chart-2` | `oklch(0.645 0.246 34.003)` | Orange |
| `--chart-3` | `oklch(0.187 0.038 274.5)` | Dark blue |
| `--chart-4` | `oklch(0.842 0.132 215.155)` | Light blue |
| `--chart-5` | `oklch(0.627 0.194 256.79)` | Violet |

### 1.3 Sidebar Colors

| Token | Light | Dark |
|-------|-------|------|
| `--sidebar` | `oklch(0.985 0 0)` | `oklch(0.141 0.044 263.951)` |
| `--sidebar-foreground` | `#161C24` | `oklch(0.985 0 0)` |
| `--sidebar-primary` | `oklch(0.588 0.158 241.966)` | same |
| `--sidebar-accent` | `oklch(0.967 0.007 247.896)` | `oklch(0.208 0.042 265.755)` |
| `--sidebar-border` | `oklch(0.92 0.004 286.32)` | `oklch(1 0 0 / 10%)` |

---

## 2. Typography

| Token | Value | Usage |
|-------|-------|-------|
| `--font-sans` | `'Geist Variable', sans-serif` | Body text, UI elements |
| `--font-mono` | `'Geist Mono', monospace` | Code blocks |

| Class | Size | Usage |
|-------|------|-------|
| `text-xs` | `0.75rem` | Captions, labels |
| `text-sm` | `0.875rem` | Small text |
| `text-base` | `1rem` | Body text |
| `text-lg` | `1.125rem` | Headings |
| `text-xl` | `1.25rem` | Section headings |
| `text-2xl` | `1.5rem` | Page titles |

| Class | Weight | Usage |
|-------|--------|-------|
| `font-normal` | 400 | Body text |
| `font-medium` | 500 | Buttons, labels |
| `font-semibold` | 600 | Headings |
| `font-bold` | 700 | Strong emphasis |

---

## 3. Border Radius

Base radius: `0.625rem`

| Token | Value | Usage |
|-------|-------|-------|
| `--radius-sm` | `0.375rem` | Badges, tags |
| `--radius-md` | `0.5rem` | Inputs, buttons |
| `--radius-lg` | `0.625rem` | Default |
| `--radius-xl` | `0.875rem` | Cards |
| `--radius-2xl` | `1.125rem` | Modals |

---

## 4. Spacing

| Class | Value | Usage |
|-------|-------|-------|
| `p-1` / `m-1` | `0.25rem` | Tight spacing |
| `p-2` / `m-2` | `0.5rem` | Compact spacing |
| `p-3` / `m-3` | `0.75rem` | Component padding |
| `p-4` / `m-4` | `1rem` | Standard spacing |
| `p-6` / `m-6` | `1.5rem` | Large spacing |
| `p-8` / `m-8` | `2rem` | Section spacing |

---

## 5. Theme System

| Theme | Description |
|-------|-------------|
| `light` | White backgrounds |
| `dark` | Navy (`#161C24`) backgrounds |
| `system` | Follows OS preference |

```tsx
import { useTheme } from "@/components/theme-provider"

const { theme, setTheme } = useTheme()
setTheme("dark")
```

- Press `d` to toggle dark/light
- Theme persists to `localStorage`
- Syncs across tabs via `StorageEvent`

---

## 6. Icons

**Lucide React** — consistent icon set.

```tsx
import { Settings, User, Moon, Sun } from "lucide-react"

// Sizing
<Settings className="size-4" />  {/* 16px */}
<Settings className="size-5" />  {/* 20px */}
<Settings className="size-6" />  {/* 24px */}
```

---

## 7. Animations

**tw-animate-css** provides utility classes:

```tsx
<div className="animate-fade-in">Content</div>
```

**Lenis smooth scrolling** (CSS ready):

```css
.lenis.lenis-smooth { scroll-behavior: auto !important; }
.lenis.lenis-stopped { overflow: hidden; }
```

---

## 8. Available Components

### Button

```tsx
import { Button } from "@/components/ui/button"

// Variants
<Button variant="default">Save</Button>
<Button variant="outline">Cancel</Button>
<Button variant="secondary">Back</Button>
<Button variant="ghost">Close</Button>
<Button variant="destructive">Delete</Button>
<Button variant="link">Learn more</Button>

// Sizes
<Button size="xs">Extra Small</Button>
<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>

// Icon buttons
<Button size="icon"><PlusIcon /></Button>

// Polymorphic
<Button asChild><a href="/link">Link</a></Button>
```

### Adding More Components

Use `npx shadcn@latest add <component>` to install. See `AGENTS.md` for the full workflow. Components install to `src/components/ui/`.

---

## 9. Quick Reference

```tsx
// Card
<div className="rounded-xl border border-border bg-card p-6 shadow-sm">
  <h3 className="text-lg font-semibold text-card-foreground">Title</h3>
  <p className="text-sm text-muted-foreground">Description</p>
</div>

// Input
<input className="h-8 rounded-lg border border-input bg-background px-3 text-sm 
  placeholder:text-muted-foreground focus-visible:border-ring 
  focus-visible:ring-3 focus-visible:ring-ring/50" />

// Badge
<span className="inline-flex items-center rounded-full bg-secondary px-2.5 py-0.5 
  text-xs font-medium text-secondary-foreground">
  Label
</span>

// Separator
<div className="h-px bg-border" />

// Avatar placeholder
<div className="size-10 rounded-full bg-muted flex items-center justify-center 
  text-muted-foreground">
  <User className="size-5" />
</div>
```

---

*Last updated: June 2026*
