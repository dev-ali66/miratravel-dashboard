/* =====================================================
   LOCATION — SHARED PREVIEW PRIMITIVES
   Small presentational helpers reused across preview
   sections (StatItem: Statistics; InfoItem: Travel
   Information; CultureRow: Climate/Culture).
===================================================== */

import type { ElementType } from "react"
export { DynamicStyledPreview, DynamicStyledText } from "@/components/shared/DynamicStyledPreview"

type StatItemProps = {
  icon: ElementType
  label: string
  value: string
}

export function StatItem({ icon: Icon, label, value }: StatItemProps) {
  return (
    <div className="border-r border-b border-border/60 p-6 last:border-r-0 md:p-10">
      <Icon className="h-5 w-5 text-muted-foreground" />

      <p className="mt-8 text-[9px] font-semibold tracking-[0.2em] text-muted-foreground">
        {label}
      </p>

      <p className="mt-2 text-xl font-light text-foreground">{value}</p>
    </div>
  )
}

/* =========================================================================
   INFO ITEM
========================================================================= */

type InfoItemProps = {
  icon: ElementType
  label: string
  value: string
  description?: string
}

export function InfoItem({
  icon: Icon,
  label,
  value,
  description,
}: InfoItemProps) {
  return (
    <div className="bg-card text-card-foreground border border-border/60 p-7 md:p-10">
      <Icon className="h-5 w-5 text-muted-foreground" />

      <p className="mt-8 text-[9px] font-semibold tracking-[0.2em] text-muted-foreground">
        {label}
      </p>

      <p className="mt-3 text-lg font-light text-foreground">{value}</p>

      {description && (
        <p className="mt-3 text-xs leading-6 text-muted-foreground">{description}</p>
      )}
    </div>
  )
}

/* =========================================================================
   CULTURE ROW
========================================================================= */

type CultureRowProps = {
  icon: ElementType
  label: string
  values: string[]
  iconColor?: string
  labelColor?: string
  valueColor?: string
}

export function CultureRow({
  icon: Icon,
  label,
  values,
  iconColor,
  labelColor,
  valueColor,
}: CultureRowProps) {
  if (!values.length) {
    return null
  }

  return (
    <div className="flex gap-4">
      <Icon className="mt-0.5 h-4 w-4 shrink-0" style={{ color: iconColor }} />

      <div>
        <p className="text-[9px]" style={{ color: labelColor }}>
          {label}
        </p>

        <p className="mt-2 text-sm leading-6" style={{ color: valueColor }}>
          {values.join(" · ")}
        </p>
      </div>
    </div>
  )
}
