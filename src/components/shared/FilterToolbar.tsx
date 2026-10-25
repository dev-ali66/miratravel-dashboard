import React, { useState } from "react"
import { Link } from "react-router-dom"
import { Search, X, ChevronDown, Check, Plus, RotateCcw } from "lucide-react"
import { cn } from "@/lib/utils"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

export interface FilterToolbarProps {
  /** If true, pins below navbar when scrolling inside page container */
  sticky?: boolean
  className?: string
  containerClassName?: string
  children: React.ReactNode
}

/**
 * Universal FilterToolbar Container
 * Standardizes search, filters, tabs, and action buttons across all Dashboard pages.
 * Default is non-sticky (sits cleanly beneath PageHeader in natural page flow).
 */
export function FilterToolbar({
  sticky = false,
  className,
  containerClassName,
  children,
}: FilterToolbarProps) {
  return (
    <div
      className={cn(
        "w-full transition-all duration-200",
        sticky && "sticky top-0 z-20 py-1 bg-background/80 backdrop-blur-md",
        className
      )}
    >
      <div
        className={cn(
          "flex flex-wrap items-center justify-between gap-1.5 sm:gap-2 rounded-xl border border-border/70 bg-card/60 p-1.5 sm:p-2 backdrop-blur-md shadow-2xs transition-all",
          containerClassName
        )}
      >
        {children}
      </div>
    </div>
  )
}

/** Left/center group of filter controls (search, selects, toggles) */
export function FilterGroup({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn("flex flex-wrap items-center gap-1.5 sm:gap-2 flex-1 min-w-0", className)}>
      {children}
    </div>
  )
}

/** Right-side container for actions (create button, export, refresh, etc.) */
export function FilterActions({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn("flex flex-wrap items-center gap-1.5 sm:gap-2 shrink-0 ml-auto", className)}>
      {children}
    </div>
  )
}

export interface FilterSearchProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  width?: string
  autoFocus?: boolean
}

/**
 * Standardized FilterSearch Input
 * Magnifying glass icon, clear button, compact uniform height.
 */
export function FilterSearch({
  value,
  onChange,
  placeholder = "Search...",
  className,
  width = "w-44 sm:w-56 shrink-0",
  autoFocus = false,
}: FilterSearchProps) {
  return (
    <div className={cn("relative", width, className)}>
      <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
      <input
        type="text"
        autoFocus={autoFocus}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          "h-8 sm:h-8.5 w-full rounded-lg border border-border/70 bg-background/60 dark:bg-background/40 pl-8 pr-7 text-xs text-foreground placeholder:text-muted-foreground outline-none transition-all",
          "focus:border-primary focus:ring-1 focus:ring-primary/40 focus:bg-background"
        )}
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
          title="Clear search"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </div>
  )
}

export interface FilterOption {
  label: string
  value: string
  count?: number
  icon?: React.ComponentType<{ className?: string }>
}

export interface FilterSelectProps {
  value: string
  onChange: (value: string) => void
  options: FilterOption[]
  placeholder?: string
  icon?: React.ComponentType<{ className?: string }>
  className?: string
  triggerClassName?: string
  width?: string
  allLabel?: string
  allValue?: string
}

/**
 * Universal Styled FilterSelect
 * Replaces crude native browser selects with sleek Popover-based dropdowns.
 */
export function FilterSelect({
  value,
  onChange,
  options,
  placeholder = "Select...",
  icon: Icon,
  className,
  triggerClassName,
  width = "min-w-[105px] max-w-[165px]",
  allLabel,
  allValue = "",
}: FilterSelectProps) {
  const [open, setOpen] = useState(false)

  const selectedOption = options.find((opt) => opt.value === value)
  const isFiltered = value !== "" && value !== "ALL" && value !== allValue
  const displayLabel = selectedOption
    ? selectedOption.label
    : allLabel || placeholder

  return (
    <div className={cn("relative shrink-0", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className={cn(
              "h-8 sm:h-8.5 inline-flex items-center justify-between gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-medium transition-all cursor-pointer outline-none select-none",
              width,
              isFiltered
                ? "border-primary/60 bg-primary/10 text-primary font-semibold shadow-2xs"
                : "border-border/70 bg-background/60 dark:bg-background/40 text-foreground hover:bg-muted/50 hover:border-border",
              triggerClassName
            )}
          >
            <div className="flex items-center gap-1.5 truncate">
              {Icon && <Icon className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />}
              <span className="truncate">{displayLabel}</span>
            </div>
            <ChevronDown
              className={cn(
                "h-3 w-3 shrink-0 text-muted-foreground transition-transform duration-200",
                open && "rotate-180"
              )}
            />
          </button>
        </PopoverTrigger>

        <PopoverContent
          align="start"
          sideOffset={5}
          className="z-50 min-w-[160px] max-h-72 overflow-y-auto rounded-xl border border-border bg-popover/95 p-1 backdrop-blur-xl shadow-xl text-xs custom-scrollbar"
        >
          {allLabel && (
            <button
              type="button"
              onClick={() => {
                onChange(allValue)
                setOpen(false)
              }}
              className={cn(
                "w-full flex items-center justify-between rounded-lg px-2.5 py-1.5 text-left font-medium transition-colors cursor-pointer",
                value === allValue || value === ""
                  ? "bg-primary/10 text-primary font-semibold"
                  : "text-foreground hover:bg-muted/70"
              )}
            >
              <span>{allLabel}</span>
              {(value === allValue || value === "") && (
                <Check className="h-3.5 w-3.5 text-primary shrink-0" />
              )}
            </button>
          )}

          {options.map((opt) => {
            const isSelected = opt.value === value
            const OptIcon = opt.icon
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value)
                  setOpen(false)
                }}
                className={cn(
                  "w-full flex items-center justify-between rounded-lg px-2.5 py-1.5 text-left font-medium transition-colors cursor-pointer",
                  isSelected
                    ? "bg-primary/10 text-primary font-semibold"
                    : "text-foreground hover:bg-muted/70"
                )}
              >
                <div className="flex items-center gap-2 truncate">
                  {OptIcon && <OptIcon className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />}
                  <span className="truncate">{opt.label}</span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  {opt.count !== undefined && (
                    <span className="rounded-md bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground font-normal">
                      {opt.count}
                    </span>
                  )}
                  {isSelected && <Check className="h-3.5 w-3.5 text-primary shrink-0" />}
                </div>
              </button>
            )
          })}
        </PopoverContent>
      </Popover>
    </div>
  )
}

export interface FilterToggleProps {
  active: boolean
  onToggle: () => void
  label: string
  icon?: React.ComponentType<{ className?: string }>
  className?: string
}

/**
 * FilterToggle Button for boolean filters (e.g. Featured, Active, Verified)
 */
export function FilterToggle({
  active,
  onToggle,
  label,
  icon: Icon,
  className,
}: FilterToggleProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        "h-8 sm:h-8.5 inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-medium transition-all cursor-pointer shrink-0 select-none",
        active
          ? "border-primary bg-primary/10 text-primary font-semibold shadow-2xs"
          : "border-border/70 bg-background/60 dark:bg-background/40 text-muted-foreground hover:text-foreground hover:bg-muted/50",
        className
      )}
    >
      {Icon && <Icon className="h-3.5 w-3.5 shrink-0" />}
      <span>{label}</span>
    </button>
  )
}

export interface FilterTabItem {
  key?: string
  id?: string
  label: string
  icon?: React.ComponentType<{ className?: string }>
  count?: number
}

export interface FilterTabsProps {
  tabs: FilterTabItem[]
  activeTab: string
  onChange: (key: string) => void
  className?: string
}

/**
 * FilterTabs Segmented Control
 * Used for route switching or primary mode selection (e.g. Roles vs Permissions)
 */
export function FilterTabs({
  tabs,
  activeTab,
  onChange,
  className,
}: FilterTabsProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-0.5 rounded-lg border border-border/70 bg-muted/20 p-0.5 backdrop-blur-xl shrink-0 overflow-x-auto",
        className
      )}
    >
      {tabs.map((tab) => {
        const tabKey = tab.key ?? tab.id ?? ""
        const Icon = tab.icon
        const isActive = activeTab === tabKey
        return (
          <button
            key={tabKey}
            type="button"
            onClick={() => onChange(tabKey)}
            className={cn(
              "flex items-center gap-1.5 rounded-md px-2.5 sm:px-3 py-1 text-xs font-medium transition-all cursor-pointer select-none whitespace-nowrap",
              isActive
                ? "bg-background text-foreground shadow-2xs font-semibold border border-border/60"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
            )}
          >
            {Icon && <Icon className="h-3.5 w-3.5 shrink-0" />}
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className={cn(
                  "rounded-full px-1.5 py-0.2 text-[10px]",
                  isActive ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                )}
              >
                {tab.count}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}

export interface FilterCreateButtonProps {
  to?: string
  onClick?: () => void
  label: string
  icon?: React.ComponentType<{ className?: string }>
  className?: string
}

/**
 * Universal Action Button for adding/creating records
 */
export function FilterCreateButton({
  to,
  onClick,
  label,
  icon: Icon = Plus,
  className,
}: FilterCreateButtonProps) {
  const commonClasses = cn(
    "h-8 sm:h-8.5 inline-flex items-center justify-center gap-1.5 rounded-lg bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground shadow-xs hover:bg-primary/90 hover:shadow transition-all cursor-pointer shrink-0 whitespace-nowrap",
    className
  )

  if (to) {
    return (
      <Link to={to} className={commonClasses}>
        <Icon className="h-3.5 w-3.5 shrink-0" />
        <span>{label}</span>
      </Link>
    )
  }

  return (
    <button type="button" onClick={onClick} className={commonClasses}>
      <Icon className="h-3.5 w-3.5 shrink-0" />
      <span>{label}</span>
    </button>
  )
}

export interface FilterResetButtonProps {
  onClick: () => void
  label?: string
  title?: string
  className?: string
}

/**
 * Reset / Clear all active filters
 */
export function FilterResetButton({
  onClick,
  label = "Reset",
  title = "Reset all filters",
  className,
}: FilterResetButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={cn(
        "h-8 sm:h-8.5 inline-flex items-center gap-1 rounded-lg border border-border/70 bg-background/60 dark:bg-background/40 px-2.5 py-1 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all cursor-pointer shrink-0",
        className
      )}
    >
      <RotateCcw className="h-3 w-3 shrink-0" />
      <span>{label}</span>
    </button>
  )
}
