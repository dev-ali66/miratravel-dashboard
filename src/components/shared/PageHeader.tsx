import React from "react"
import { cn } from "@/lib/utils"

export interface CompactStatCardProps {
  label: string
  value: React.ReactNode
  subtext?: string
  icon: React.ComponentType<{ className?: string }>
  iconColor?: string
  className?: string
  onClick?: () => void
}

/**
 * Sleek, uniform, compact KPI metric card designed to sit within the 70% right-hand side of PageHeader
 * Fixed h-14 (56px) height matching the Navbar height
 */
export function CompactStatCard({
  label,
  value,
  subtext,
  icon: Icon,
  iconColor = "text-primary",
  className,
  onClick,
}: CompactStatCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "rounded-md border border-border/60 bg-card/60 backdrop-blur-xl px-2.5 py-1.5 sm:px-3 sm:py-2 shadow-xs flex flex-col justify-between h-14 transition-all hover:border-border/90 hover:bg-card/80 min-w-0 select-none",
        onClick && "cursor-pointer hover:border-primary/50 hover:shadow-sm active:scale-[0.99]",
        className
      )}
    >
      <div className="flex items-center justify-between gap-1.5 min-w-0">
        <span className="text-[10px] sm:text-[10.5px] font-semibold uppercase tracking-wider text-muted-foreground truncate leading-none">
          {label}
        </span>
        <div className="flex h-4 w-4 sm:h-4.5 sm:w-4.5 shrink-0 items-center justify-center rounded-xs bg-muted/40">
          <Icon className={cn("h-2.5 w-2.5 sm:h-3 sm:w-3", iconColor)} />
        </div>
      </div>
      <div className="min-w-0">
        <div className="text-sm sm:text-base font-bold tracking-tight text-foreground truncate leading-tight">
          {value}
        </div>
        {subtext && (
          <p className="text-[9px] sm:text-[9.5px] text-muted-foreground truncate leading-none mt-0.5 font-medium">
            {subtext}
          </p>
        )}
      </div>
    </div>
  )
}

export interface PageHeaderProps {
  /** Lucide icon component, React component, or custom icon element */
  icon?: React.ComponentType<{ className?: string }> | React.ReactNode
  /** Page title heading */
  title: React.ReactNode
  /** Subtitle or description underneath the title */
  subtitle?: React.ReactNode
  /** Optional badge or status pill next to title */
  badge?: React.ReactNode
  /** Right-hand side statistics / KPI cards (approx 70% width) */
  stats?: React.ReactNode
  /** Right-hand side action buttons (e.g. Create, Export, Refresh) */
  actions?: React.ReactNode
  /** Optional additional wrapper CSS classes */
  className?: string
}

/**
 * Universal PageHeader Component for MIRA Dashboard
 *
 * Implements a single source of truth across all route views:
 * - Height: Exactly h-14 (56px) on desktop, matching the Navbar's h-14 height
 * - Left 30%: Icon Badge + Title + Subtitle
 * - Right 70%: Compact 4-Card Statistics Panel
 */
export function PageHeader({
  icon: IconOrNode,
  title,
  subtitle,
  badge,
  stats,
  actions,
  className,
}: PageHeaderProps) {
  const renderIcon = () => {
    if (!IconOrNode) return null

    // If it's already a valid React element
    if (React.isValidElement(IconOrNode)) {
      return (
        <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary border border-primary/20 shadow-xs">
          {IconOrNode}
        </div>
      )
    }

    // If it's a component reference like a LucideIcon
    const IconComponent = IconOrNode as React.ComponentType<{ className?: string }>
    return (
      <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary border border-primary/20 shadow-xs">
        <IconComponent className="h-4.5 w-4.5 sm:h-5 sm:w-5" />
      </div>
    )
  }

  return (
    <div
      className={cn(
        "flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2 h-auto lg:h-14 lg:min-h-14 mb-2 sm:mb-2.5",
        className
      )}
    >
      {/* Left: 30% Width (Icon, Title & Subtitle) */}
      <div
        className={cn(
          "flex items-center gap-2.5 sm:gap-3.5 h-full",
          stats ? "w-full lg:w-[30%] shrink-0" : "shrink-0"
        )}
      >
        {renderIcon()}
        <div className="min-w-0 flex-1 flex flex-col justify-center">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-base sm:text-lg md:text-xl font-bold tracking-tight text-[#182D09] dark:text-white leading-tight truncate">
              {title}
            </h1>
            {badge && <div className="shrink-0">{badge}</div>}
          </div>
          {subtitle && (
            <p className="text-[11px] sm:text-xs text-[#565E69] dark:text-[#94A3B8] mt-0.5 leading-none truncate">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Right: 70% Width (KPI / Statistics Grid) */}
      {stats && (
        <div className="w-full lg:flex-1 lg:max-w-[70%] min-w-0 h-full flex items-center">
          {stats}
        </div>
      )}

      {/* Optional Actions Container */}
      {actions && (
        <div className="flex flex-wrap items-center gap-2 shrink-0 h-full self-start sm:self-auto">
          {actions}
        </div>
      )}
    </div>
  )
}

export default PageHeader
