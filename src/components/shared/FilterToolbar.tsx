import React, { useState } from "react"
import { Link } from "react-router-dom"
import { Search, X, ChevronDown, Check, Plus, RotateCcw, Download } from "lucide-react"
import { cn } from "@/lib/utils"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

export interface FilterToolbarProps {
  /** If true, pins below navbar when scrolling inside page container */
  sticky?: boolean
  className?: string
  containerClassName?: string
  children: React.ReactNode
  /** Sticky offset from top, defaults to 'top-14' (56px) beneath fixed Navbar */
  topOffset?: string
}

/**
 * Universal FilterToolbar Container
 * Implements a unified segmented control bar with vertical dividers,
 * subtle rounded-md corners (slightly curved after square), and transparent frosted glassmorphism.
 */
export function FilterToolbar({
  sticky = true,
  className,
  containerClassName,
  topOffset = "top-14",
  children,
}: FilterToolbarProps) {
  return (
    <div
      className={cn(
        "w-full transition-all duration-200",
        sticky && cn("sticky z-20 pb-2", topOffset),
        className
      )}
    >
      <div
        className={cn(
          "flex flex-wrap items-stretch justify-between rounded-md border border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-2xs transition-all overflow-hidden divide-y sm:divide-y-0 sm:divide-x divide-border/40",
          containerClassName
        )}
      >
        {children}
      </div>
    </div>
  )
}

/** Left/center group of segmented filter controls (search, selects, toggles, tabs) */
export function FilterGroup({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn("flex flex-wrap items-stretch flex-1 min-w-0 divide-x divide-border/40 bg-transparent", className)}>
      {children}
    </div>
  )
}

/** Right-side container for segmented actions (create button, export, refresh, etc.) */
export function FilterActions({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn("flex items-stretch shrink-0 divide-x divide-border/40 ml-auto border-t sm:border-t-0 sm:border-l border-border/40 bg-transparent", className)}>
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
 * Standardized FilterSearch Input Segment
 * Seamless borderless slot with magnifying glass icon, transparent input, and clear button.
 */
export function FilterSearch({
  value,
  onChange,
  placeholder = "Search...",
  className,
  width = "flex-1 min-w-[170px] sm:min-w-[220px]",
  autoFocus = false,
}: FilterSearchProps) {
  return (
    <div className={cn("relative flex items-center h-10 px-3.5", width, className)}>
      <Search className="pointer-events-none h-4 w-4 shrink-0 text-muted-foreground mr-2.5" />
      <input
        type="text"
        autoFocus={autoFocus}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-full w-full bg-transparent border-0 text-xs text-foreground placeholder:text-muted-foreground/75 outline-none focus:outline-none focus:ring-0 select-text"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="rounded-full p-1 text-muted-foreground hover:bg-muted/70 hover:text-foreground transition-colors cursor-pointer shrink-0 ml-1"
          title="Clear search"
        >
          <X className="h-3.5 w-3.5" />
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
 * Universal Segmented FilterSelect Dropdown
 * Borderless slot with leading icon, center label, and right chevron.
 */
export function FilterSelect({
  value,
  onChange,
  options,
  placeholder = "Select...",
  icon: Icon,
  className,
  triggerClassName,
  width = "min-w-[110px] max-w-[170px]",
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
    <div className={cn("relative shrink-0 flex items-center h-10", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className={cn(
              "h-full inline-flex items-center justify-between gap-2 px-3.5 text-xs font-medium transition-all cursor-pointer outline-none select-none hover:bg-muted/30 whitespace-nowrap",
              width,
              isFiltered
                ? "bg-primary/10 text-primary font-semibold"
                : "text-muted-foreground hover:text-foreground",
              triggerClassName
            )}
          >
            <div className="flex items-center gap-2 truncate">
              {Icon && (
                <Icon
                  className={cn(
                    "h-3.5 w-3.5 shrink-0",
                    isFiltered ? "text-primary" : "text-muted-foreground"
                  )}
                />
              )}
              <span className="truncate">{displayLabel}</span>
            </div>
            <ChevronDown
              className={cn(
                "h-3 w-3 shrink-0 text-muted-foreground transition-transform duration-200 ml-1.5",
                open && "rotate-180"
              )}
            />
          </button>
        </PopoverTrigger>

        <PopoverContent
          align="start"
          sideOffset={6}
          className="z-50 min-w-[170px] max-h-72 overflow-y-auto rounded-md border border-border/70 bg-popover/95 p-1 backdrop-blur-xl shadow-xl text-xs custom-scrollbar"
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
                    <span className="rounded-sm bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground font-normal">
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
 * FilterToggle Segmented Slot for boolean filters (e.g. Featured, Active, Verified)
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
        "h-10 inline-flex items-center gap-1.5 px-3.5 text-xs font-medium transition-all cursor-pointer shrink-0 select-none hover:bg-muted/30 whitespace-nowrap",
        active
          ? "bg-primary/10 text-primary font-semibold"
          : "text-muted-foreground hover:text-foreground",
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
 * Full-height (h-10) seamless segmented slots with divider lines,
 * subtle active background tint, bottom indicator line, and elegant typography.
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
        "inline-flex items-center h-10 shrink-0 divide-x divide-border/40 overflow-x-auto scrollbar-none",
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
              "relative h-10 inline-flex items-center gap-2 px-3.5 text-xs font-medium transition-all duration-150 cursor-pointer select-none whitespace-nowrap outline-none",
              isActive
                ? "bg-primary/8 text-primary font-semibold dark:bg-primary/15 after:absolute after:bottom-0 after:left-2 after:right-2 after:h-[2px] after:bg-primary after:rounded-full"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
            )}
          >
            {Icon && (
              <Icon
                className={cn(
                  "h-3.5 w-3.5 shrink-0 transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              />
            )}
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className={cn(
                  "ml-1 inline-flex items-center justify-center px-1.5 py-0.5 rounded-full text-[10px] font-bold leading-none min-w-[18px]",
                  isActive
                    ? "bg-primary/20 text-primary"
                    : "bg-muted text-muted-foreground"
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
  label?: string
  icon?: React.ComponentType<{ className?: string }>
  className?: string
  disabled?: boolean
}

/**
 * Segmented Action Button (e.g. "Create +", "Add New User", "Save")
 * Styled with brand greenish typography matching theme as requested.
 */
export function FilterCreateButton({
  to,
  onClick,
  label = "Create",
  icon: Icon = Plus,
  className,
  disabled,
}: FilterCreateButtonProps) {
  const commonClasses = cn(
    "h-10 inline-flex items-center justify-center gap-1.5 px-4 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 hover:bg-emerald-500/10 transition-all cursor-pointer shrink-0 whitespace-nowrap select-none",
    disabled && "opacity-50 pointer-events-none cursor-not-allowed",
    className
  )

  if (to) {
    return (
      <Link to={to} className={commonClasses}>
        <span>{label}</span>
        <Icon className="h-3.5 w-3.5 shrink-0" />
      </Link>
    )
  }

  return (
    <button type="button" onClick={onClick} disabled={disabled} className={commonClasses}>
      <span>{label}</span>
      <Icon className="h-3.5 w-3.5 shrink-0" />
    </button>
  )
}

export interface FilterExportButtonProps {
  onClick?: () => void
  label?: string
  icon?: React.ComponentType<{ className?: string }>
  disabled?: boolean
  className?: string
}

/**
 * Segmented Export / Download CSV Button
 * No separate floating border, fits directly into the segmented pill-bar.
 */
export function FilterExportButton({
  onClick,
  label = "Export CSV",
  icon: Icon = Download,
  disabled = false,
  className,
}: FilterExportButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "h-10 inline-flex items-center justify-center gap-1.5 px-3.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-all cursor-pointer shrink-0 whitespace-nowrap select-none disabled:opacity-50 disabled:cursor-not-allowed",
        className
      )}
    >
      {Icon && <Icon className="h-3.5 w-3.5 shrink-0" />}
      <span>{label}</span>
    </button>
  )
}

export interface FilterSegmentButtonProps {
  onClick?: () => void
  label?: React.ReactNode
  icon?: React.ComponentType<{ className?: string }>
  children?: React.ReactNode
  active?: boolean
  disabled?: boolean
  className?: string
  title?: string
}

/**
 * Generic Segmented Button
 * Seamless borderless slot inside toolbar with hover state.
 */
export function FilterSegmentButton({
  onClick,
  label,
  icon: Icon,
  children,
  active = false,
  disabled = false,
  className,
  title,
}: FilterSegmentButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={cn(
        "h-10 inline-flex items-center justify-center gap-1.5 px-3.5 text-xs font-medium transition-all cursor-pointer shrink-0 whitespace-nowrap select-none disabled:opacity-50 disabled:cursor-not-allowed",
        active
          ? "bg-primary/10 text-primary font-semibold"
          : "text-muted-foreground hover:text-foreground hover:bg-muted/30",
        className
      )}
    >
      {Icon && <Icon className="h-3.5 w-3.5 shrink-0" />}
      {label && <span>{label}</span>}
      {children}
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
 * Circular Refresh / Reset Segment
 * Matches the '↻' circular arrow button at the far right of the reference image.
 */
export function FilterResetButton({
  onClick,
  label,
  title = "Refresh",
  className,
}: FilterResetButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={cn(
        "h-10 w-10 inline-flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-all cursor-pointer shrink-0",
        className
      )}
    >
      <RotateCcw className="h-4 w-4 shrink-0 transition-transform active:-rotate-90 hover:-rotate-45" />
      {label && <span className="text-xs ml-1.5">{label}</span>}
    </button>
  )
}
