# AI Instructions — Mira Dashboard

> **Purpose:** Rules and guidelines for AI assistants working on this codebase.
> **Project:** Mira Dashboard (React 19 + Vite 8 + TypeScript 6 + Tailwind CSS 4 + shadcn/ui)

---

## 1. Tech Stack

| Layer | Technology | Notes |
|-------|-----------|-------|
| **Framework** | React 19 | Latest concurrent features |
| **Build Tool** | Vite 8 | Native ESM, fast HMR |
| **Language** | TypeScript ~6 | Strict mode, `verbatimModuleSyntax` enabled |
| **Styling** | Tailwind CSS 4 | CSS-first config, `@theme inline` |
| **UI Library** | shadcn/ui (radix-nova) | Copy-paste components, not installed via npm |
| **Primitives** | Radix UI | Accessible, composable |
| **Icons** | Lucide React | Consistent icon set |
| **Variants** | class-variance-authority | Component variant management |
| **Utilities** | clsx + tailwind-merge | Via `cn()` helper |

---

## 2. Code Style

- **No semicolons** — Prettier is configured without semicolons
- **Double quotes** — Use `"double quotes"` for strings
- **2-space indentation** — Consistent with existing code
- **Trailing commas** — ES5 style (trailing commas in objects/arrays)
- **TypeScript strict** — No `any` types, explicit return types for exported functions

---

## 3. Import Rules

> **Important:** `verbatimModuleSyntax` is enabled in `tsconfig.app.json`. All type-only imports **must** use `import type`.

```tsx
// ✅ Good
import * as React from "react"
import type { User } from "@/types/user"

// ❌ Bad
import React from "react"
import { User } from "@/types/user"  // when User is type-only
```

### Import Order

```tsx
// 1. React
import * as React from "react"

// 2. Third-party
import { cva } from "class-variance-authority"
import { Slot } from "radix-ui"
import { Loader2 } from "lucide-react"

// 3. Internal utilities
import { cn } from "@/lib/utils"

// 4. Internal components
import { Button } from "@/components/ui/button"

// 5. Types (must use import type)
import type { User } from "@/types/user"
```

---

## 4. Path Aliases

```tsx
// @/ maps to src/
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { User } from "@/types/user"
```

---

## 5. Styling Rules

1. **Use CSS variables** for colors — they handle dark mode automatically
2. **Use Tailwind utilities** — avoid custom CSS unless absolutely necessary
3. **Use `cn()`** for conditional classes — never template literals
4. **Mobile-first responsive** — use `md:`, `lg:` breakpoints
5. **Follow class order:** Layout → Box Model → Typography → Visual → Interactive → Responsive

```tsx
// ✅ Good
<div className={cn("base-styles", isActive && "active-styles", className)} />

// ❌ Bad
<div className={`base-styles ${isActive ? "active-styles" : ""}`} />
```

---

## 6. Component Rules

See `COMPONENT_RULES.md` for component architecture, patterns, and checklist.

---

## 7. What NOT to Do

- Don't use `type` for component props — use `interface`
- Don't use inline styles for design tokens — use Tailwind
- Don't use template literals for classes — use `cn()`
- Don't forget to accept `className` prop
- Don't use `any` type
- Don't use index as key for dynamic lists
- Don't forget cleanup in `useEffect`
- Don't create components inside components

See `COMPONENT_RULES.md` for code examples of anti-patterns.

---

## 8. References

- `AGENTS.md` — Workflows, commands, agent roles
- `COMPONENT_RULES.md` — Component architecture, patterns, and checklist
- `DESIGN_SYSTEM.md` — Colors, typography, spacing, available components
- `PRD.md` — Project requirements and architecture

---

*Last updated: June 2026*
