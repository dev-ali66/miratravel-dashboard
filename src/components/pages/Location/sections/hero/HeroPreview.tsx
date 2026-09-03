/* =====================================================
   HERO — PREVIEW SECTION
   Auto-migrated from the legacy LocationPreview.tsx monolith.===================================================== */

import type { LocationData } from "../../locationTypes"
import { getLocationBasics, FALLBACK_IMAGE } from "../../shared/previewBasics"
import { ArrowDownRight } from "lucide-react"

export type HeroPreviewProps = {
    draft: LocationData | null
}

export function HeroPreview({
    draft,
}: HeroPreviewProps) {
    const { data, name, description } = getLocationBasics(draft)

    const hero = data.hero ?? {}

    const heroTitle = hero.title || `Discover ${name}`
    const heroDescription = hero.description || description
    const heroBreadcrumb = hero.breadcrumb || `DESTINATIONS / ${name.toUpperCase()}`
    const heroImage = hero.background_image || FALLBACK_IMAGE
    const videoUrl = hero.video || ""
    const shouldShowVideo = Boolean(hero.showVideo && videoUrl)
    const heroButton = hero.button ?? {}

    return (
        <section className="relative flex w-full items-center overflow-hidden bg-black text-white md:h-[720px] lg:h-[740px] xl:h-[768px]">
            {shouldShowVideo ? (
                <video
                    className="absolute inset-0 h-full w-full object-cover"
                    src={videoUrl}
                    poster={heroImage}
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="metadata"
                />
            ) : (
                <img
                    src={heroImage}
                    alt={name}
                    className="absolute inset-0 h-full w-full object-cover"
                    onError={(e) => {
                        e.currentTarget.src = FALLBACK_IMAGE
                    }}
                />
            )}

            <div
                className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"
                aria-hidden="true"
            />

            <div className="relative z-10 mx-auto flex h-full w-full flex-col justify-end px-5 pb-9 sm:px-8 sm:pb-12 md:px-14 md:pb-16 xl:pl-[136px] xl:pr-[136px] lg:pl-[96px] lg:pr-[96px]">
                <div className="flex w-full max-w-[880px] flex-col items-start">
                    {heroBreadcrumb && (
                        <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/75 sm:text-xs md:text-[15px]">
                            {heroBreadcrumb}
                        </p>
                    )}

                    {heroTitle && (
                        <h1 className="mb-4 max-w-5xl font-serif text-[42px] font-medium leading-[0.95] tracking-[-0.04em] text-white sm:text-[50px] md:text-[58px] lg:text-[66px] xl:text-[72px]">
                            {heroTitle}
                        </h1>
                    )}

                    {heroDescription && (
                        <p className="max-w-[760px] text-sm font-normal leading-[1.8] text-white/75 sm:text-base md:text-[17px]">
                            {heroDescription}
                        </p>
                    )}

                    {heroButton.name && (
                        <button className="mt-8 inline-flex items-center gap-3 self-start rounded-full border border-white/30 px-5 py-3 text-[10px] font-medium uppercase tracking-[0.2em] text-white transition hover:bg-white hover:text-black">
                            {heroButton.name}
                            <ArrowDownRight className="h-4 w-4" />
                        </button>
                    )}
                </div>
            </div>
        </section>
    )
}
