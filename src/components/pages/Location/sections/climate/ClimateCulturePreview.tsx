/* =====================================================
   CLIMATECULTURE — PREVIEW SECTION
   Auto-migrated from the legacy LocationPreview.tsx monolith.
   Renders BOTH the Climate and Culture data (visually one combined block in the original design). Registered under the "climate" key; the "culture" section key intentionally has no separate preview to avoid rendering this block twice — see config/locationSections.ts.
===================================================== */

import type { LocationData } from "../../locationTypes"
import { getLocationBasics, FALLBACK_TEXT } from "../../shared/previewBasics"
import { Globe2, Mountain, CalendarDays, Languages, Utensils } from "lucide-react"
import { CultureRow } from "../../shared/previewPrimitives"

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



    const culture =
        data.culture ?? {}

    const cuisine =
        Array.isArray(
            culture.cuisine
        )
            ? culture.cuisine
            : []

    const languages =
        Array.isArray(
            culture.majorLanguages
        )
            ? culture.majorLanguages
            : []

    const religions =
        Array.isArray(
            culture.majorReligions
        )
            ? culture.majorReligions
            : []

    const festivals =
        Array.isArray(
            culture.famousFestivals
        )
            ? culture.famousFestivals
            : []



    return (
        <>

            <section className="bg-[#e9e7df]">

                <div className="mx-auto max-w-[1400px] px-6 py-16 md:px-10 md:py-24">

                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                        {/* Climate */}

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

                        {/* Culture */}

                        <div className="rounded-2xl bg-[#171717] p-7 text-white md:p-10">

                            <Globe2 className="h-6 w-6 text-white/40" />

                            <p className="mt-8 text-[10px] tracking-[0.25em] text-white/40">
                                CULTURE
                            </p>

                            <h3 className="mt-3 text-3xl font-light">
                                Culture & heritage
                            </h3>

                            <p className="mt-5 text-sm leading-7 text-white/55">
                                {
                                    culture.description ||
                                    FALLBACK_TEXT
                                }
                            </p>

                            <div className="mt-8 space-y-6">

                                <CultureRow
                                    icon={Utensils}
                                    label="CUISINE"
                                    values={cuisine}
                                />

                                <CultureRow
                                    icon={Languages}
                                    label="LANGUAGES"
                                    values={languages}
                                />

                                <CultureRow
                                    icon={Globe2}
                                    label="RELIGIONS"
                                    values={religions}
                                />

                                <CultureRow
                                    icon={CalendarDays}
                                    label="FESTIVALS"
                                    values={festivals}
                                />

                            </div>

                        </div>

                    </div>

                </div>
            </section>

        </>
    )
}
