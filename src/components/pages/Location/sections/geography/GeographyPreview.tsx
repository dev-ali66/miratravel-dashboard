/* =====================================================
   GEOGRAPHY — PREVIEW SECTION
   Auto-migrated from the legacy LocationPreview.tsx monolith.===================================================== */

import type { LocationData } from "../../locationTypes"
import { getLocationBasics } from "../../shared/previewBasics"
import MapLibrePreview from "../../../../ui/MapLibrePreview"
import { UniversalMultimediaPreview } from "../../../CMS/Home/shared/preview/UniversalMultimediaPreview"

export type GeographyPreviewProps = {
  draft: LocationData | null
}

export function GeographyPreview({ draft }: GeographyPreviewProps) {
  const { data, name } = getLocationBasics(draft)

  const geography = data.geography ?? {}

  const highestPoint = geography.highestPoint ?? {}
  const majorLandscapes = Array.isArray(geography.majorLandscapes)
    ? geography.majorLandscapes
    : []
  const background = (geography as any)?.backgroundMultimedia

  return (
    <>
      <section className="relative overflow-hidden px-6 py-16 text-white md:px-10 md:py-24">
        <UniversalMultimediaPreview
          multimedia={background}
          fallbackColor="#171717"
          mode="background"
          className="h-full w-full object-cover"
          containerClassName="absolute inset-0 z-0 pointer-events-none"
        />
        <div className="relative z-10 mx-auto max-w-[1400px]">
          <p className="text-[10px] tracking-[0.25em] text-white/40">
            GEOGRAPHY
          </p>

          <div className="mt-8 grid grid-cols-1 gap-10 md:grid-cols-[0.8fr_1.2fr]">
            <div>
              <h2 className="text-3xl leading-tight font-light md:text-5xl">
                Explore the landscapes surrounding {name}.
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
                latitude={
                  draft?.geoData?.latitude && draft.geoData.latitude !== 0
                    ? draft.geoData.latitude
                    : 23.685
                }
                longitude={
                  draft?.geoData?.longitude && draft.geoData.longitude !== 0
                    ? draft.geoData.longitude
                    : 90.3563
                }
                zoom={draft?.geoData?.mapZoom || 7}
                className="h-[360px] w-full rounded-md"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
