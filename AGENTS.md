# Agents — Mira Dashboard

> **Purpose:** Main entry point for AI assistants. Connects to the project and guides workflows.
> **Last updated:** June 2026

---

## 1. Project Overview

Mira Dashboard is a modern admin/dashboard web application built with React 19, Vite 8, TypeScript 6, Tailwind CSS 4, and shadcn/ui (radix-nova style).

When working on this project, follow the rules in these documentation files:

| File | Purpose |
|------|---------|
| **AGENTS.md** | You are here — AI workflows and commands |
| **AI_INSTRUCTIONS.md** | Code style, imports, and AI rules |
| **COMPONENT_RULES.md** | Component architecture and patterns |
| **DESIGN_SYSTEM.md** | Colors, typography, spacing, components |
| **PRD.md** | Project requirements and architecture |

---

## 2. Agent Roles

| Agent | Purpose | When to Use |
|-------|---------|-------------|
| **File Picker** | Find files by fuzzy match | Discovering related files, finding configs |
| **Code Searcher** | Search code patterns via ripgrep | Finding usages, locating constants, imports |
| **Researcher** | Web/docs research | Best practices, library docs, comparisons |
| **Basher** | Run terminal commands | Build, lint, test, install packages |
| **Browser Use** | Chrome DevTools automation | Verify UI renders, test interactions, check console |
| **Code Reviewer** | Review changes | After implementing features, before commits |
| **Thinker** | Deep reasoning | Complex architectural problems, trade-off analysis |

---

## 3. Project Workflows

### 3.1 Add shadcn/ui Component

```
1. Basher: npx shadcn@latest add <component>
2. File Picker: Verify file created in src/components/ui/
3. Read button.tsx for pattern reference
4. Customize component as needed
5. Basher: npm run typecheck
```

### 3.2 Implement New Feature

```
1. File Picker + Code Searcher: Find related files
2. Researcher: Look up relevant docs if needed
3. Implement component/hooks/utils
4. Basher: npm run typecheck && npm run lint
5. Code Reviewer: Review changes
```

### 3.3 Fix Bug

```
1. Code Searcher: Find bug location
2. File Picker: Find related test/config files
3. Implement fix
4. Basher: npm run typecheck
5. Code Reviewer: Verify fix
```

### 3.4 Update Documentation

```
1. File Picker: Find related docs (DESIGN_SYSTEM.md, COMPONENT_RULES.md, etc.)
2. Read existing content
3. Update or create documentation
4. Code Reviewer: Review accuracy
```

### 3.5 Refactor Code

```
1. Code Searcher: Find all usages of target
2. File Picker: Find related files
3. Implement refactoring
4. Basher: npm run typecheck
5. Code Reviewer: Review changes
```

---

## 4. Available Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Type-check + production build |
| `npm run typecheck` | Type-check only |
| `npm run lint` | Run ESLint |
| `npm run format` | Format with Prettier |
| `npm run preview` | Preview production build |

---

## 5. Parallel Execution

Run independent agents simultaneously for speed:

```tsx
// ✅ Good: Parallel context gathering
spawn_agents([
  { agent_type: "file-picker", prompt: "Find auth components" },
  { agent_type: "code-searcher", searchQueries: [...] },
  { agent_type: "researcher-docs", prompt: "Radix UI docs" }
])

// ✅ Good: Parallel validation
spawn_agents([
  { agent_type: "basher", command: "npm run typecheck" },
  { agent_type: "basher", command: "npm run lint" }
])
```

Sequential only when there are dependencies:

```
// ✅ Good: Sequential with dependency
1. Basher: npm install package-x
2. Basher: npm run build (depends on install)
```

---

## 6. Quick Start

When starting work on this project:

1. **Read `AI_INSTRUCTIONS.md`** for code style and rules
2. **Read `COMPONENT_RULES.md`** when building components
3. **Read `DESIGN_SYSTEM.md`** for design tokens and patterns
4. **Run `npm run typecheck`** to verify changes
5. **Run `npm run lint`** to check code quality

---

## Home Hero media convention

When working on the CMS Home page's Hero section, follow this convention so agents and codegen stay consistent:

- **Fields on a section**: use the existing `bgImages` (first image at `bgImages[0]`) for the Background Image and `bgVideos[0].url` for the Video. Add an optional `showVideo?: boolean` flag on the section to toggle video mode.
- **No separate poster field**: do not add or use a dedicated `video.poster` field — the Background Image (`bgImages[0].url`) is the poster when `showVideo` is enabled.
- **Section identifier**: add an optional `pageComponent?: string` on the section object to indicate which frontend page/component renders it (for example `pageComponent: "Hero"`). Agents should set or read this field when mapping CMS sections to page components.
- **Rendering rules**:
  - If `showVideo === true` and `bgVideos[0].url` exists, render the `<video>` element using `bgVideos[0].url` and pass `bgImages[0].url` to the video's `poster` attribute.
  - If `showVideo === false` or no video URL is present, do not render the `<video>` element; render only the background image.

This keeps the media model simple and predictable for both agents and engineers.

---

*Last updated: June 2026*
