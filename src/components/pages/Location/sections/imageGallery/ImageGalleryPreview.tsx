/* =====================================================
   IMAGEGALLERY — PREVIEW SECTION
   Auto-migrated from the legacy LocationPreview.tsx monolith.===================================================== */

import type { LocationData } from "../../locationTypes"
import { getLocationBasics, FALLBACK_IMAGE } from "../../shared/previewBasics"
import { Star } from "lucide-react"

export type ImageGalleryPreviewProps = {
    draft: LocationData | null
}

export function ImageGalleryPreview({
    draft,
}: ImageGalleryPreviewProps) {
    const { data, name } = getLocationBasics(draft)


    const gallery =
        Array.isArray(
            data.imageGalary
        )
            ? data.imageGalary
            : []



    return (
        <>

            {gallery.length > 0 && (
                <section className="mx-auto max-w-[1400px] px-6 py-16 md:px-10 md:py-24">

                    <div className="mb-10 flex items-end justify-between">

                        <div>

                            <p className="text-[10px] tracking-[0.25em] text-neutral-400">
                                GALLERY
                            </p>

                            <h2 className="mt-3 text-4xl font-light md:text-6xl">
                                {name} in focus
                            </h2>

                        </div>

                        <Star className="hidden h-5 w-5 text-neutral-300 md:block" />

                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

                        {gallery.map(
                            (
                                item: any,
                                index: number
                            ) => (
                                <div
                                    key={
                                        item.url ??
                                        item.alt ??
                                        index
                                    }
                                    className={`overflow-hidden rounded-2xl ${
                                        index === 1
                                            ? "md:mt-12"
                                            : ""
                                    }`}
                                >

                                    <img
                                        src={
                                            item.url ||
                                            FALLBACK_IMAGE
                                        }
                                        alt={
                                            item.alt ||
                                            name
                                        }
                                        className="h-[300px] w-full object-cover transition duration-700 hover:scale-105 md:h-[420px]"
                                        onError={(e) => {
                                            e.currentTarget.src =
                                                FALLBACK_IMAGE
                                        }}
                                    />

                                </div>
                            )
                        )}

                    </div>
                </section>
            )}

        </>
    )
}
