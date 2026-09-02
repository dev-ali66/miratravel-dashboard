/* =====================================================
   ESSENCE — PREVIEW SECTION
   Visually mirrors the real frontend `<Essence />`
   component's layout (eyebrow label, heading, paragraphs,
   bordered quote, image with a stat badge overlay), built
   with plain markup for the admin preview, with every
   color / font size / image driven by `data.essence`.
===================================================== */

import type { LocationData } from "../../locationTypes"
import { getLocationBasics, FALLBACK_IMAGE } from "../../shared/previewBasics"

export type EssencePreviewProps = {
    draft: LocationData | null
}

export function EssencePreview({ draft }: EssencePreviewProps) {
    const { data, name } = getLocationBasics(draft)

    const essence = data.essence ?? {}
    const style = essence.style ?? {}

    const paragraphs = Array.isArray(essence.paragraphs)
        ? essence.paragraphs
        : []

    const imageSrc = essence.imageSrc || FALLBACK_IMAGE
    const imageAlt = essence.imageAlt || `${name} landscape`

    const labelStyle = style.label ?? {}
    const titleStyle = style.title ?? {}
    const paragraphStyle = style.paragraph ?? {}
    const quoteStyle = style.quote ?? {}
    const statBadgeStyle = style.statBadge ?? {}

    return (
        <>
            <section
                className="w-full px-6 py-16 md:px-10 md:py-24"
                style={{
                    backgroundColor:
                        style.sectionBackgroundColor ||
                        undefined,
                }}
            >
                <div className="mx-auto grid max-w-[1400px] grid-cols-1 items-center gap-10 md:gap-12 lg:grid-cols-2 lg:gap-16">
                    {/* ============================
                        TEXT COLUMN
                    ============================ */}
                    <div className="flex w-full flex-col items-start">
                        <span
                            className="text-xs font-normal uppercase leading-4 tracking-[3px]"
                            style={{
                                color:
                                    labelStyle.textColor ||
                                    "#b45309",
                                fontSize:
                                    labelStyle.fontSize ||
                                    undefined,
                            }}
                        >
                            {essence.label ||
                                `THE ESSENCE OF ${name.toUpperCase()}`}
                        </span>

                        <h2
                            className="mt-4 w-full font-medium leading-[1.15] tracking-tight"
                            style={{
                                color:
                                    titleStyle.textColor ||
                                    "#1a2e05",
                                fontSize:
                                    titleStyle.fontSize ||
                                    "40px",
                            }}
                        >
                            {essence.title || name}
                        </h2>

                        <div className="mt-6 flex w-full flex-col items-start gap-4">
                            {paragraphs.map(
                                (paragraph, index) => (
                                    <p
                                        key={index}
                                        className="w-full text-justify font-normal leading-7 tracking-[0.5px]"
                                        style={{
                                            color:
                                                paragraphStyle.textColor ||
                                                "#4b5563",
                                            fontSize:
                                                paragraphStyle.fontSize ||
                                                "14px",
                                        }}
                                    >
                                        {paragraph}
                                    </p>
                                )
                            )}
                        </div>

                        {essence.quote && (
                            <div className="mt-8 w-full border-t border-neutral-900/10 pt-6">
                                <blockquote
                                    className="w-full font-normal italic leading-8"
                                    style={{
                                        color:
                                            quoteStyle.textColor ||
                                            "#57534e",
                                        fontSize:
                                            quoteStyle.fontSize ||
                                            "18px",
                                    }}
                                >
                                    &ldquo;{essence.quote}
                                    &rdquo;
                                </blockquote>
                            </div>
                        )}
                    </div>

                    {/* ============================
                        IMAGE COLUMN
                    ============================ */}
                    <div className="relative flex w-full justify-center lg:justify-end">
                        <div className="relative h-[425px] w-full max-w-[536px] overflow-hidden rounded-none md:h-[560px]">
                            <img
                                src={imageSrc}
                                alt={imageAlt}
                                className="h-full w-full object-cover object-center"
                                onError={(e) => {
                                    e.currentTarget.src =
                                        FALLBACK_IMAGE
                                }}
                            />

                            <div
                                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent"
                                aria-hidden="true"
                            />

                            {essence.statValue && (
                                <div
                                    className="absolute bottom-6 left-6 rounded-xl px-5 py-4 shadow-lg"
                                    style={{
                                        backgroundColor:
                                            statBadgeStyle.backgroundColor ||
                                            "#ffffff",
                                        color:
                                            statBadgeStyle.textColor ||
                                            "#1a2e05",
                                    }}
                                >
                                    <p className="text-2xl font-semibold leading-none">
                                        {essence.statValue}
                                    </p>

                                    {essence.statLabel && (
                                        <p className="mt-1 text-[11px] leading-tight opacity-80">
                                            {essence.statLabel}
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
