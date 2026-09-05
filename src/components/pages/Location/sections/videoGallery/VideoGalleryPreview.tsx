/* =====================================================
   VIDEOGALLERY — PREVIEW SECTION
   Auto-migrated from the legacy LocationPreview.tsx monolith.===================================================== */

import type { LocationData } from "../../locationTypes"
import { getLocationBasics, FALLBACK_IMAGE } from "../../shared/previewBasics"
import { UniversalMultimediaPreview } from "../../../CMS/Home/shared/preview/UniversalMultimediaPreview"
import { ArrowRight } from "lucide-react"

export type VideoGalleryPreviewProps = {
  draft: LocationData | null
}

export function VideoGalleryPreview({ draft }: VideoGalleryPreviewProps) {
  const { data, name } = getLocationBasics(draft)

  const videoGallery = data.videoGalary ?? {}
  const background = (videoGallery as any)?.backgroundMultimedia

  return (
    <>
      {videoGallery.url && (
        <section className="relative overflow-hidden px-6 py-16 text-white md:px-10 md:py-24">
          <UniversalMultimediaPreview
            multimedia={background}
            fallbackColor="#000000"
            mode="background"
            className="h-full w-full object-cover"
            containerClassName="absolute inset-0 z-0 pointer-events-none"
          />
          <div className="relative z-10 mx-auto max-w-[1400px]">
            <p className="text-[10px] tracking-[0.25em] text-white/40">VIDEO</p>

            <h2 className="mt-4 text-4xl font-light md:text-6xl">
              Discover {name}
            </h2>

            <div className="relative mt-10 overflow-hidden rounded-2xl">
              {videoGallery.multimedia ? (
                <UniversalMultimediaPreview
                  multimedia={videoGallery.multimedia}
                  fallbackImageSrc={videoGallery.thumbnail || FALLBACK_IMAGE}
                  fallbackVideoSrc={videoGallery.url}
                  fallbackAlt={videoGallery.alt || `${name} travel video`}
                  mode="background"
                  className="h-[350px] w-full object-cover opacity-70 md:h-[600px]"
                />
              ) : (
                <img
                  src={videoGallery.thumbnail || FALLBACK_IMAGE}
                  alt={videoGallery.alt || `${name} travel video`}
                  className="h-[350px] w-full object-cover opacity-70 md:h-[600px]"
                  onError={(e) => {
                    e.currentTarget.src = FALLBACK_IMAGE
                  }}
                />
              )}

              <div className="absolute inset-0 flex items-center justify-center">
                <a
                  href={videoGallery.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 rounded-full bg-white px-6 py-4 text-xs font-medium text-black transition hover:bg-white/80"
                >
                  WATCH VIDEO
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  )
}
