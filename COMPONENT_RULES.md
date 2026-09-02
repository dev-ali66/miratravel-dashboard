# Component Rules — Mira Dashboard

> **Version:** 0.0.1
> **Stack:** React 19 · TypeScript 6 · shadcn/ui (radix-nova) · Tailwind CSS 4

---

## 1. File Structure

```
src/components/
├── ui/              # Reusable UI primitives (shadcn components)
├── layout/          # Layout components (Header, Sidebar)
├── forms/           # Form-specific components
└── features/        # Feature-specific components
```

| Type | File Naming | Example |
|------|-------------|---------|
| Components | `kebab-case.tsx` | `button.tsx`, `dropdown-menu.tsx` |
| Hooks | `use-kebab-case.ts` | `use-theme.ts` |
| Utils | `kebab-case.ts` | `format-date.ts` |
| Types | `kebab-case.ts` | `user.ts` |

---

## 2. Component Structure

### 2.1 File Order

```tsx
// 1. Imports
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

// 2. Types (always use interface for props)
interface ButtonProps extends React.ComponentProps<"button"> {
  variant?: "default" | "outline" | "ghost"
}

// 3. Variant definitions (CVA)
const buttonVariants = cva("base-styles", { variants: { ... } })

// 4. Component
export function Button({ variant, className, ...props }: ButtonProps) {
  return (
    <button className={cn(buttonVariants({ variant }), className)} {...props} />
  )
}
```

### 2.2 Props Rules

**Always use `interface` for props:**

```tsx
// ✅ Good
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  header?: React.ReactNode
}

// ❌ Bad
type CardProps = { children: React.ReactNode }
```

**Always merge className with `cn()`:**

```tsx
// ✅ Good
<div className={cn("base-styles", isActive && "active-styles", className)} />

// ❌ Bad
<div className={`base-styles ${isActive ? "active-styles" : ""}`} />
```

**Use `React.ReactNode` for children:**

```tsx
interface ModalProps {
  children: React.ReactNode  // ✅ Flexible
  children: JSX.Element      // ❌ Too restrictive
}
```

---

## 3. Composition Patterns

### 3.1 Polymorphic Components (asChild)

**Use Radix Slot for polymorphism:**

```tsx
import { Slot } from "radix-ui"

interface ButtonProps extends React.ComponentProps<"button"> {
  asChild?: boolean
}

export function Button({ asChild, className, ...props }: ButtonProps) {
  const Comp = asChild ? Slot.Root : "button"
  return <Comp className={cn("button-styles", className)} {...props} />
}

// Usage: Renders as <a> with button styles
<Button asChild>
  <a href="/somewhere">Link</a>
</Button>
```

### 3.2 Data Attributes (data-slot)

**Use `data-slot` for component identification and styling hooks:**

```tsx
export function Button({ variant, size, className, ...props }: ButtonProps) {
  return (
    <button
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  )
}
```

### 3.3 Compound Components

**Use compound components for related UI:**

```tsx
export const Card = {
  Root: CardRoot,
  Header: CardHeader,
  Content: CardContent,
  Footer: CardFooter,
}

// Usage
<Card.Root>
  <Card.Header>Title</Card.Header>
  <Card.Content>Content</Card.Content>
</Card.Root>
```

### 3.4 Forward Ref

**Use `forwardRef` for components needing ref access:**

```tsx
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, className, ...props }, ref) => {
    return (
      <div>
        {label && <label>{label}</label>}
        <input ref={ref} className={cn("input-styles", className)} {...props} />
      </div>
    )
  }
)
Input.displayName = "Input"
```

---

## 4. Accessibility Rules

### 4.1 Semantic HTML

```tsx
// ✅ Good
<nav aria-label="Main navigation">
  <ul>...</ul>
</nav>
<main>Content</main>

// ❌ Bad
<div class="nav">...</div>
```

### 4.2 ARIA Attributes

```tsx
// Icon-only buttons need aria-label
<Button aria-label="Close dialog"><X /></Button>

// Toggle states
<button aria-expanded={isOpen} aria-haspopup="true">Menu</button>

// Loading states
<Button aria-busy={isLoading} disabled={isLoading}>
  {isLoading ? "Saving..." : "Save"}
</Button>
```

### 4.3 Focus Visible

**Always show focus indicators:**

```tsx
// ✅ Good
<button className="focus-visible:ring-2 focus-visible:ring-ring">Click</button>

// ❌ Bad
<button className="outline-none">Click</button>
```

---

## 5. Performance Rules

### 5.1 Avoid Inline Objects

```tsx
// ❌ Bad: New reference every render
<ListItem style={{ color: isActive ? "blue" : "gray" }}>

// ✅ Good: Use className
<ListItem className={cn("text-muted-foreground", isActive && "text-primary")}>
```

### 5.2 Memoization

```tsx
// Memoize expensive computations
const sortedItems = useMemo(
  () => [...items].sort((a, b) => a.name.localeCompare(b.name)),
  [items]
)

// Memoize callbacks passed to children
const handleSelect = useCallback((id: string) => {
  setSelectedId(id)
}, [])
```

### 5.3 List Keys

```tsx
// ✅ Good: Stable, unique ID
{items.map((item) => (
  <ListItem key={item.id} item={item} />
))}

// ❌ Bad: Index as key
{items.map((item, index) => (
  <ListItem key={index} item={item} />
))}
```

---

## 6. State Management

### 6.1 Local State

```tsx
const [isOpen, setIsOpen] = useState(false)
const [selectedId, setSelectedId] = useState<string | null>(null)
```

### 6.2 Derived State

**Compute during render, don't store:**

```tsx
// ✅ Good
const filteredItems = items.filter(item => 
  item.name.toLowerCase().includes(searchQuery.toLowerCase())
)

// ❌ Bad
const [filteredItems, setFilteredItems] = useState(items)
useEffect(() => {
  setFilteredItems(items.filter(...))
}, [items, searchQuery])
```

---

## 7. Error Handling

### 7.1 Loading States

**Always show loading states:**

```tsx
// Button loading
<Button disabled={isLoading}>
  {isLoading ? <Loader2 className="size-4 animate-spin" /> : "Save"}
</Button>

// Content loading
{isLoading ? <Skeleton className="h-4 w-[200px]" /> : <Content />}
```

### 7.2 Error States

```tsx
{error ? (
  <div className="text-destructive">
    <AlertCircle className="size-4" />
    <span>{error.message}</span>
  </div>
) : (
  <Content />
)}
```

---

## 8. Code Review Checklist

### Structure
- [ ] Correct directory (`ui/`, `layout/`, `forms/`, `features/`)
- [ ] `kebab-case.tsx` file naming
- [ ] Named exports
- [ ] No unused imports

### Props
- [ ] `interface` for props (not `type`)
- [ ] Extends HTML element props
- [ ] `className` prop supported and merged with `cn()`

### Styling
- [ ] Tailwind utilities used
- [ ] `cn()` for conditional classes
- [ ] CSS variables for dark mode
- [ ] Mobile-first responsive

### Accessibility
- [ ] Semantic HTML
- [ ] ARIA labels where needed
- [ ] Keyboard navigation works
- [ ] Focus visible indicators

### Performance
- [ ] No inline objects in render
- [ ] Expensive computations memoized
- [ ] Stable keys for lists

---

## 9. Anti-Patterns

```tsx
// ❌ Don't mutate state directly
state.items.push(newItem)
setState(state)

// ❌ Don't use inline styles for tokens
<div style={{ color: "#161C24" }}>

// ❌ Don't create components inside components
function Parent() {
  const Child = () => <div>...</div>  // Recreated every render
  return <Child />
}

// ❌ Don't forget cleanup
useEffect(() => {
  window.addEventListener("scroll", handler)
  // Missing cleanup!
}, [])
```

---

*Last updated: June 2026*
