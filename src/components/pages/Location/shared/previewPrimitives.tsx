/* =====================================================
   LOCATION — SHARED PREVIEW PRIMITIVES
   Small presentational helpers reused across preview
   sections (StatItem: Statistics; InfoItem: Travel
   Information; CultureRow: Climate/Culture).
===================================================== */

import type { ElementType } from "react"

type StatItemProps = {
    icon: ElementType
    label: string
    value: string
}

export function StatItem({
    icon: Icon,
    label,
    value,
}: StatItemProps) {
    return (
        <div className="border-b border-r border-neutral-200 p-6 last:border-r-0 md:p-10">

            <Icon className="h-5 w-5 text-neutral-400" />

            <p className="mt-8 text-[9px] font-semibold tracking-[0.2em] text-neutral-400">
                {label}
            </p>

            <p className="mt-2 text-xl font-light">
                {value}
            </p>

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
        <div className="bg-white p-7 md:p-10">

            <Icon className="h-5 w-5 text-neutral-400" />

            <p className="mt-8 text-[9px] font-semibold tracking-[0.2em] text-neutral-400">
                {label}
            </p>

            <p className="mt-3 text-lg font-light text-neutral-800">
                {value}
            </p>

            {description && (
                <p className="mt-3 text-xs leading-6 text-neutral-400">
                    {description}
                </p>
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