/* =====================================================
   GEOGRAPHY — PREVIEW SECTION
   Auto-migrated from the legacy LocationPreview.tsx monolith.===================================================== */

import type { LocationData } from "../../locationTypes"
import { getLocationBasics } from "../../shared/previewBasics"
import MapLibrePreview from "../../../../ui/MapLibrePreview"

export type GeographyPreviewProps = {
    draft: LocationData | null
}

export function GeographyPreview({
    draft,
}: GeographyPreviewProps) {
    const { data, name } = getLocationBasics(draft)

    const geography =
        data.geography ?? {}

    const highestPoint =
        geography.highestPoint ?? {}
    const majorLandscapes = Array.isArray(geography.majorLandscapes)
        ? geography.majorLandscapes
        : []

    return (
        <>

            <section className="bg-[#171717] px-6 py-16 text-white md:px-10 md:py-24">

                <div className="mx-auto max-w-[1400px]">

                    <p className="text-[10px] tracking-[0.25em] text-white/40">
                        GEOGRAPHY
                    </p>

                    <div className="mt-8 grid grid-cols-1 gap-10 md:grid-cols-[0.8fr_1.2fr]">

                        <div>

                            <h2 className="text-3xl font-light leading-tight md:text-5xl">
                                Explore the landscapes surrounding{" "}
                                {name}.
                            </h2>

                            {highestPoint.name && (
                                <div className="mt-8">

                                    <p className="text-[9px] tracking-[0.2em] text-white/30">
                                        HIGHEST POINT
                                    </p>

                                    <p className="mt-2 text-lg text-white/80">
                                        {highestPoint.name}
                                        {highestPoint.elevation != null &&
                                            ` · ${highestPoint.elevation} ${highestPoint.unit || "m"}`}
                                    </p>

                                </div>
                            )}

                            {majorLandscapes.length > 0 && (
                                <div className="mt-8">
                                    <p className="text-[9px] tracking-[0.2em] text-white/30">
                                        MAJOR LANDSCAPES
                                    </p>

                                    <div className="mt-3 flex flex-wrap gap-2">
                                        {majorLandscapes.map((landscape) => (
                                            <span
                                                key={landscape}
                                                className="rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-sm text-white/70"
                                            >
                                                {landscape}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                        </div>

                        <div className="mt-8 md:mt-0">
                            <MapLibrePreview
                                latitude={draft?.geoData?.latitude ?? 0}
                                longitude={draft?.geoData?.longitude ?? 0}
                                zoom={draft?.geoData?.mapZoom ?? 8}
                                className="w-full h-[360px] rounded-md"
                            />
                        </div>

                    </div>
                </div>
            </section>

        </>
    )
}
