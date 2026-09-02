# PRD — Mira Dashboard

> **Project:** `Mira_dashboard_react_js`
> **Version:** 0.0.1
> **Status:** Scaffolded — ready for feature development

---

## 1. Overview

Mira Dashboard is a modern admin/dashboard web application built with React 19, Vite 8, TypeScript 6, Tailwind CSS 4, and shadcn/ui (radix-nova style). The project provides a polished foundation with dark/light theme support, custom oklch color palette, smooth scrolling, and a component library ready for rapid feature development.

---

## 2. Tech Stack

| Layer | Technology | Version |
|-------|------------|---------|
| **Framework** | React | 19.2.6 |
| **Build Tool** | Vite | 8 |
| **Language** | TypeScript | ~6 |
| **Styling** | Tailwind CSS | 4 |
| **UI Library** | shadcn/ui (radix-nova) | 4.11.0 |
| **Primitives** | Radix UI | 1.5.0 |
| **Icons** | Lucide React | 1.17.0 |
| **Routing** | React Router DOM | ^7 |
| **Utilities** | clsx + tailwind-merge | 2.1.1 / 3.6.0 |
| **Variants** | class-variance-authority | 0.7.1 |
| **Animations** | tw-animate-css | 1.4.0 |
| **Font** | Geist Variable | 5.2.9 |

---

## 3. Project Structure

```
Mira_dashboard_react_js/
├── index.html                    # HTML entry point
├── package.json                  # Dependencies & scripts
├── vite.config.ts                # Vite config with @ alias
├── tsconfig.json                 # TS project references
├── tsconfig.app.json             # App TS config (strict mode)
├── tsconfig.node.json            # Node TS config
├── components.json               # shadcn/ui configuration
├── eslint.config.js              # ESLint flat config
├── .prettierrc                   # Prettier config
├── .prettierignore               # Prettier ignore
├── .gitignore                    # Git ignore
├── PRD.md                        # This document
└── src/
    ├── main.tsx                  # App entry point (ThemeProvider + StrictMode)
    ├── App.tsx                   # Root component (placeholder)
    ├── index.css                 # Global styles, theme variables, utilities
    ├── lib/
    │   └── utils.ts              # cn() helper (clsx + twMerge)
    └── components/
        ├── theme-provider.tsx    # Theme context (dark/light/system)
        └── ui/
            └── button.tsx        # Button component (shadcn)
```

---

## 4. Current Features

### 4.1 Theme System
- **Dark / Light / System** toggle via `ThemeProvider`
- Keyboard shortcut: press `d` to toggle theme
- Persists to `localStorage`
- Syncs across tabs via `StorageEvent`
- Respects `prefers-color-scheme` media query
- Smooth transition disable on theme change

### 4.2 Color Theme
Custom oklch-based color palette:

| Token | Light | Dark |
|-------|-------|------|
| `--primary` | `oklch(0.588 0.158 241.966)` (blue) | same |
| `--accent` | `oklch(0.645 0.246 34.003)` (orange) | same |
| `--destructive` | `oklch(0.577 0.245 27.325)` (red) | `oklch(0.704 0.191 22.216)` |
| `--background` | white | `#161C24` (dark navy) |
| `--foreground` | `#161C24` | white |
| `--card` | white | `oklch(0.141 0.044 263.951)` |

Sidebar, chart, muted, secondary, border, input, ring, and popover tokens also defined for both modes.

### 4.3 Typography
- **Sans:** Geist Variable (variable font)
- **Mono:** Geist Mono
- Applied globally via `@layer base`

### 4.4 Scrollbar
- Custom WebKit scrollbar: 4px width
- Primary-colored track, secondary thumb
- Stable scrollbar gutter on `html`

### 4.5 Smooth Scrolling
- Lenis smooth scrolling CSS variables ready
- Classes: `.lenis.lenis-smooth`, `.lenis.lenis-stopped`, `.lenis.lenis-scrolling`

### 4.6 Button Component
shadcn/ui `Button` with variants:
- `default`, `outline`, `secondary`, `ghost`, `destructive`, `link`
- Sizes: `default`, `xs`, `sm`, `lg`, `icon`, `icon-xs`, `icon-sm`, `icon-lg`
- Supports `asChild` via Radix `Slot`
- Focus-visible ring, active translate, disabled states

---

## 5. Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Type-check + production build |
| `npm run lint` | Run ESLint |
| `npm run format` | Format with Prettier |
| `npm run typecheck` | Type-check only |
| `npm run preview` | Preview production build |

---

## 6. Configuration

### 6.1 Path Aliases
- `@/` maps to `./src/` (configured in `vite.config.ts` and `tsconfig.json`)

### 6.2 ESLint
- Flat config format
- Plugins: react-hooks, react-refresh, typescript-eslint
- Ignores: `dist/`

### 6.3 Prettier
- No semicolons
- Double quotes
- 2-space indentation
- Trailing commas (ES5)
- Tailwind CSS class sorting plugin active

### 6.4 shadcn/ui
- Style: `radix-nova`
- RSC: `false` (client-only)
- TSX: `true`
- Icon library: `lucide`
- Base color: `neutral`
- CSS variables: enabled

---

## 7. Architecture Decisions

| Decision | Rationale |
|----------|-----------|
| React 19 | Latest concurrent features, server components ready |
| Vite 8 | Fast HMR, native ESM, Tailwind v4 plugin |
| Tailwind v4 | CSS-first config, `@theme inline` for design tokens |
| shadcn/ui (radix-nova) | Accessible, composable, copy-paste components |
| oklch colors | Perceptually uniform, wide gamut support |
| Geist font | Modern, readable, variable weight support |
| Lenis | Buttery smooth scroll (CSS layer ready, JS to be added) |
| React Router DOM | Client-side routing with nested routes and layouts |
| No state management lib | Keep it simple; add Zustand/Jotai when needed |

---

## 8. Environment Variables

No environment variables are currently required. As features are added, a `.env.example` should be created with:

```
# API
VITE_API_BASE_URL=
VITE_API_KEY=

# Auth
VITE_AUTH_PROVIDER=
```

---

## 9. Dependencies

### Production
| Package | Purpose |
|---------|---------|
| react, react-dom | UI framework |
| tailwindcss, @tailwindcss/vite | Styling |
| shadcn, radix-ui | Component library |
| lucide-react | Icons |
| class-variance-authority | Component variants |
| clsx, tailwind-merge | Class name utilities |
| tw-animate-css | Animation utilities |
| @fontsource-variable/geist | Geist font |
| react-router-dom | Client-side routing |

### Development
| Package | Purpose |
|---------|---------|
| typescript | Type checking |
| vite, @vitejs/plugin-react | Build tooling |
| eslint, typescript-eslint | Linting |
| prettier, prettier-plugin-tailwindcss | Code formatting |

---

*Document generated from project analysis. Update as features are implemented.*