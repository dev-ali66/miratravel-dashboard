import React from "react"
import { cn } from "@/lib/utils"

export interface CompactStatCardProps {
  label: string
  value: React.ReactNode
  subtext?: string
  icon: React.ComponentType<{ className?: string }>
  iconColor?: string
  className?: string
}

/**
 * Sleek, uniform, compact KPI metric card designed to sit within the 70% right-hand side of PageHeader
 */
export function CompactStatCard({
  label,
  value,
  subtext,
  icon: Icon,
  iconColor = "text-primary",
  className,
}: CompactStatCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border/60 bg-card/60 backdrop-blur-xl p-2.5 sm:p-3 shadow-xs flex flex-col justify-between h-[70px] sm:h-[74px] transition-all hover:border-border/90 hover:bg-card/80 min-w-0",
        className
      )}
    >
      <div className="flex items-center justify-between gap-1.5 min-w-0">
        <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-muted-foreground truncate">
          {label}
        </span>
        <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-muted/40">
          <Icon className={cn("h-3 w-3", iconColor)} />
        </div>
      </div>
      <div className="text-sm sm:text-base md:text-lg font-bold tracking-tight text-foreground truncate leading-tight">
        {value}
      </div>
      {subtext && (
        <p className="text-[10px] text-muted-foreground truncate leading-none">
          {subtext}
        </p>
      )}
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
        <div className="flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20 shadow-xs">
          {IconOrNode}
        </div>
      )
    }

    // If it's a component reference like a LucideIcon
    const IconComponent = IconOrNode as React.ComponentType<{ className?: string }>
    return (
      <div className="flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20 shadow-xs">
        <IconComponent className="h-5 w-5 sm:h-5.5 sm:w-5.5" />
      </div>
    )
  }

  return (
    <div
      className={cn(
        "flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2 pb-2",
        className
      )}
    >
      {/* Left: 30% Width (Icon, Title & Subtitle) */}
      <div
        className={cn(
          "flex items-start gap-3.5",
          stats ? "w-full lg:w-[30%] shrink-0" : "shrink-0"
        )}
      >
        {renderIcon()}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#182D09] dark:text-white leading-tight">
              {title}
            </h1>
            {badge && <div className="shrink-0">{badge}</div>}
          </div>
          {subtitle && (
            <p className="text-xs text-[#565E69] dark:text-[#94A3B8] mt-1 leading-normal line-clamp-2">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Right: 70% Width (KPI / Statistics Grid) */}
      {stats && (
        <div className="w-full lg:flex-1 lg:max-w-[70%] min-w-0">
          {stats}
        </div>
      )}

      {/* Optional Actions Container */}
      {actions && (
        <div className="flex flex-wrap items-center gap-2.5 shrink-0 self-start sm:self-auto">
          {actions}
        </div>
      )}
    </div>
  )
}

export default PageHeader
