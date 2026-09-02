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

    const heroTitle =
        hero.title ||
        `Discover ${name}`

    const heroDescription =
        hero.description ||
        description

    const heroBreadcrumb =
        hero.breadcrumb ||
        `DESTINATIONS / ${name.toUpperCase()}`

    const heroImage =
        hero.background_image ||
        FALLBACK_IMAGE

    const videoUrl = hero.video || ""
    const shouldShowVideo = Boolean(hero.showVideo && videoUrl)

    const heroButton =
        hero.button ?? {}



    return (
        <>

            <section className="relative flex min-h-[620px] items-end overflow-hidden bg-black text-white md:min-h-[720px]">

                {shouldShowVideo ? (
                    <video
                        src={videoUrl}
                        poster={heroImage}
                        autoPlay
                        loop
                        muted
                        playsInline
                        preload="metadata"
                        className="absolute inset-0 h-full w-full object-cover opacity-90"
                    />
                ) : (
                    <img
                        src={heroImage}
                        alt={name}
                        className="absolute inset-0 h-full w-full object-cover opacity-85"
                        onError={(e) => {
                            e.currentTarget.src =
                                FALLBACK_IMAGE
                        }}
                    />
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/10" />

                <div className="relative z-10 mx-auto w-full max-w-[1400px] px-6 pb-10 md:px-10 md:pb-16">

                    <p className="mb-5 text-[10px] font-medium tracking-[0.25em] text-white/70">
                        {heroBreadcrumb}
                    </p>

                    <h1 className="max-w-5xl text-5xl font-light leading-[0.95] tracking-[-0.04em] md:text-8xl lg:text-9xl">
                        {heroTitle}
                    </h1>

                    <div className="mt-8 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">

                        <p className="max-w-2xl text-sm leading-7 text-white/75 md:text-base">
                            {heroDescription}
                        </p>

                        {heroButton.name && (
                            <button className="flex shrink-0 items-center gap-3 self-start rounded-full border border-white/30 px-5 py-3 text-xs font-medium uppercase tracking-wider transition hover:bg-white hover:text-black">
                                {heroButton.name}

                                <ArrowDownRight className="h-4 w-4" />
                            </button>
                        )}
                    </div>
                </div>
            </section>

        </>
    )
}
