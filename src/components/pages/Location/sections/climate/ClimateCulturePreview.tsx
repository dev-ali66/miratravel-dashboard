/* =====================================================
   CLIMATECULTURE — PREVIEW SECTION
   Auto-migrated from the legacy LocationPreview.tsx monolith.
   Renders BOTH the Climate and Culture data (visually one combined block in the original design). Registered under the "climate" key; the "culture" section key intentionally has no separate preview to avoid rendering this block twice — see config/locationSections.ts.
===================================================== */

import type { LocationData } from "../../locationTypes"
import { getLocationBasics, FALLBACK_TEXT } from "../../shared/previewBasics"
import { Mountain } from "lucide-react"

export type ClimateCulturePreviewProps = {
    draft: LocationData | null
}

export function ClimateCulturePreview({
    draft,
}: ClimateCulturePreviewProps) {
    const { data } = getLocationBasics(draft)


    const climate =
        data.climate ?? {}

    const climateTypes =
        Array.isArray(
            climate.types
        )
            ? climate.types
            : []

    return (
        <>

            <section className="bg-[#e9e7df]">

                <div className="mx-auto max-w-350 px-6 py-16 md:px-10 md:py-24">

                    <div className="grid grid-cols-1 gap-5">

                        <div className="rounded-2xl bg-white p-7 md:p-10">

                            <Mountain className="h-6 w-6 text-neutral-400" />

                            <p className="mt-8 text-[10px] tracking-[0.25em] text-neutral-400">
                                CLIMATE
                            </p>

                            <h3 className="mt-3 text-3xl font-light">
                                {climateTypes.join(
                                    " & "
                                ) ||
                                    "Climate"}
                            </h3>

                            <p className="mt-5 text-sm leading-7 text-neutral-500">
                                {
                                    climate.description ||
                                    FALLBACK_TEXT
                                }
                            </p>

                            {climateTypes.length > 0 && (
                                <div className="mt-8 flex flex-wrap gap-2">

                                    {climateTypes.map(
                                        (
                                            type: string
                                        ) => (
                                            <span
                                                key={type}
                                                className="rounded-full border border-neutral-200 px-4 py-2 text-[10px]"
                                            >
                                                {type}
                                            </span>
                                        )
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
