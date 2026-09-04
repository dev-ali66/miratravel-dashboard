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
        : [
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer vitae justo nec erat commodo volutpat.",
            "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.",
        ]

    const imageSrc = essence.imageSrc || FALLBACK_IMAGE
    const imageAlt = essence.imageAlt || `${name} landscape`

    const labelStyle = style.label ?? {}
    const titleStyle = style.title ?? {}
    const paragraphStyle = style.paragraph ?? {}
    const quoteStyle = style.quote ?? {}
    const statBadgeStyle = style.statBadge ?? {}

    return (
        <section
            className="w-full pb-12 md:pb-16 xl:pb-20"
            style={{
                backgroundColor:
                    style.sectionBackgroundColor || undefined,
            }}
        >
            <div className="container mx-auto px-6 md:px-10">
                <div className="flex w-full flex-col items-start gap-12 md:gap-16 xl:gap-16.75">
                    <div className="grid w-full grid-cols-1 items-center gap-10 md:gap-12 lg:grid-cols-2 lg:gap-10 xl:gap-16">
                        <div className="flex w-full flex-col items-start">
                            <span
                                className="text-xs font-normal uppercase leading-3 tracking-[3px] md:text-[15px] md:leading-3.5 xl:text-base xl:leading-4 xl:tracking-[4.2px]"
                                style={{
                                    color:
                                        labelStyle.textColor ||
                                        "var(--accent)",
                                    fontSize:
                                        labelStyle.fontSize || undefined,
                                }}
                            >
                                {essence.label ||
                                    `THE ESSENCE OF ${name.toUpperCase()}`}
                            </span>

                            <h2
                                className="mt-4 w-full font-heading text-[28px] font-semibold leading-8.5 md:mt-5 md:text-[36px] md:leading-12 lg:text-[40px] lg:leading-13.5 xl:mt-6 xl:text-[44px] xl:leading-16"
                                style={{
                                    color:
                                        titleStyle.textColor ||
                                        "var(--primary)",
                                    fontSize:
                                        titleStyle.fontSize || undefined,
                                }}
                            >
                                {essence.title ||
                                    "Lorem ipsum dolor sit amet"}
                            </h2>

                            <div className="mt-6 flex w-full flex-col items-start gap-3.5 md:mt-7 md:gap-4 xl:mt-7.5 xl:gap-5">
                                {paragraphs.map((paragraph, index) => (
                                    <p
                                        key={`${paragraph}-${index}`}
                                        className="w-full text-justify text-[14px] font-normal leading-6 tracking-wide md:text-[15px] md:leading-6.5 xl:text-base xl:leading-7"
                                        style={{
                                            color:
                                                paragraphStyle.textColor ||
                                                "#4b5563",
                                            fontSize:
                                                paragraphStyle.fontSize ||
                                                undefined,
                                        }}
                                    >
                                        {paragraph}
                                    </p>
                                ))}
                            </div>

                            <div className="mt-8 w-full border-t border-neutral-900/10 pt-6">
                                <blockquote
                                    className="w-full text-[18px] font-normal italic leading-8"
                                    style={{
                                        color:
                                            quoteStyle.textColor ||
                                            "#57534e",
                                        fontSize:
                                            quoteStyle.fontSize || undefined,
                                    }}
                                >
                                    &ldquo;
                                    {essence.quote ||
                                        "Lorem ipsum dolor sit amet, consectetur adipiscing elit."}
                                    &rdquo;
                                </blockquote>
                            </div>
                        </div>

                        <div className="relative mb-4 flex w-full justify-center self-stretch sm:mb-6 lg:mb-0 lg:justify-end">
                            <div className="relative h-90 w-full max-w-85 md:h-120 md:max-w-120 lg:h-115 lg:max-w-full xl:h-150 xl:max-w-155 2xl:h-165 2xl:max-w-175">
                                <img
                                    src={imageSrc}
                                    alt={imageAlt}
                                    className="size-full rounded-xs object-cover object-center"
                                    onError={(event) => {
                                        event.currentTarget.src = FALLBACK_IMAGE
                                    }}
                                />

                                {essence.statValue && (
                                    <div
                                        className="absolute -bottom-5 -left-3 flex w-49 flex-col items-start bg-accent-muted px-5 py-4 sm:-bottom-6 sm:-left-4 md:-left-5 md:px-6 md:py-4.5 xl:-left-6 xl:px-7 xl:py-5"
                                        style={{
                                            backgroundColor:
                                                statBadgeStyle.backgroundColor ||
                                                "var(--accent-muted)",
                                            color:
                                                statBadgeStyle.textColor ||
                                                "#f5f5f5",
                                        }}
                                    >
                                        <span className="font-heading text-[24px] font-medium leading-7 md:text-[26px] md:leading-8 xl:text-[30px] xl:leading-9">
                                            {essence.statValue}
                                        </span>
                                        {essence.statLabel && (
                                            <span className="pt-0.5 text-[13px] font-normal leading-4 opacity-75 md:text-[13.5px] md:leading-4.5 xl:text-sm xl:leading-5">
                                                {essence.statLabel}
                                            </span>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    )
}
