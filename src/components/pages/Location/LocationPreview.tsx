import { ArrowRight } from "lucide-react"

import { useLocationDraft } from "./shared/LocationDraftContext"
import { getLocationBasics } from "./shared/previewBasics"
import {
    locationSectionOrder,
    locationSectionRegistry,
} from "./config/locationSections"

/* =====================================================
   COMPONENT

   Thin shell only: all section-specific rendering lives in
   sections/<key>/<Name>Preview.tsx, ordered and looked up
   via config/locationSections.ts — the exact same order the
   Form uses, so the two can never drift apart.

   Sections registered with `preview: null` (basic-info,
   geo-data, seo, culture — see the registry) are skipped:
   they're either administrative-only or already rendered as
   part of another section's preview.
===================================================== */

export const LocationPreview = () => {
    const { draft } = useLocationDraft()

    const { name, data } = getLocationBasics(draft)
    const heroButton = data.hero?.button ?? {}

    return (
        <div className="w-full bg-[#f7f6f2] text-[#171717] text-sm md:text-base">
            {locationSectionOrder.map((key) => {
                const SectionPreview =
                    locationSectionRegistry[key].preview

                if (!SectionPreview) return null

                return (
                    <SectionPreview key={key} draft={draft} />
                )
            })}

            {/* =========================================================
                FOOTER CTA
                Layout chrome, not tied to a single data section —
                stays in the shell rather than the section loop.
            ========================================================= */}

            <section className="bg-black px-6 py-20 text-center text-white md:px-10 md:py-28">
                <p className="text-[10px] tracking-[0.3em] text-white/40">
                    READY TO EXPLORE?
                </p>

                <h2 className="mx-auto mt-5 max-w-4xl text-4xl font-light leading-tight md:text-7xl">
                    Your journey into{" "}
                    {name} starts here.
                </h2>

                {heroButton.name && (
                    <button className="mt-8 inline-flex items-center gap-3 rounded-full bg-white px-6 py-3 text-xs font-medium text-black transition hover:bg-white/80">
                        {heroButton.name}

                        <ArrowRight className="h-4 w-4" />
                    </button>
                )}
            </section>
        </div>
    )
}
