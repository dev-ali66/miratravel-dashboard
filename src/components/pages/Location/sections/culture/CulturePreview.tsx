/* =====================================================
   CULTURE — PREVIEW SECTION
   Standalone culture preview. Climate is rendered by the
   separate climate section so the two blocks are not duplicated.
===================================================== */

import { CalendarDays, Globe2, Languages, Utensils } from "lucide-react"
import type { LocationData } from "../../locationTypes"
import { getLocationBasics, FALLBACK_TEXT } from "../../shared/previewBasics"
import { CultureRow } from "../../shared/previewPrimitives"

export type CulturePreviewProps = {
    draft: LocationData | null
}

export function CulturePreview({ draft }: CulturePreviewProps) {
    const { data } = getLocationBasics(draft)
    const culture = data.culture ?? {}
    const style = culture.style ?? {}
    const cuisine = Array.isArray(culture.cuisine) && culture.cuisine.length > 0 ? culture.cuisine : ["Traditional cuisine"]
    const languages = Array.isArray(culture.majorLanguages) && culture.majorLanguages.length > 0 ? culture.majorLanguages : ["Local language"]
    const religions = Array.isArray(culture.majorReligions) && culture.majorReligions.length > 0 ? culture.majorReligions : ["Local traditions"]
    const festivals = Array.isArray(culture.famousFestivals) && culture.famousFestivals.length > 0 ? culture.famousFestivals : ["Seasonal celebrations"]

    return (
        <section className="text-white" style={{ backgroundColor: style.backgroundColor || "#171717" }}>
            <div className="mx-auto max-w-1400 px-6 py-16 md:px-10 md:py-24">
                <div className="rounded-2xl bg-[#171717]">
                    <Globe2 className="h-6 w-6" style={{ color: style.iconColor || "#666666" }} />
                    <p className="mt-8 text-[10px] tracking-[0.25em]" style={{ color: style.labelTextColor || "#666666" }}>CULTURE</p>
                    <h2 className="mt-3 text-3xl font-light" style={{ color: style.titleTextColor || "#FFFFFF" }}>Culture &amp; heritage</h2>
                    <p className="mt-5 max-w-3xl text-sm leading-7" style={{ color: style.descriptionTextColor || "#8C8C8C" }}>
                        {culture.description || FALLBACK_TEXT}
                    </p>
                    <div className="mt-8 grid gap-6 md:grid-cols-2">
                        <CultureRow icon={Utensils} label="CUISINE" values={cuisine} iconColor={style.iconColor || "#666666"} labelColor={style.labelTextColor || "#666666"} valueColor={style.valueTextColor || "#B3B3B3"} />
                        <CultureRow icon={Languages} label="LANGUAGES" values={languages} iconColor={style.iconColor || "#666666"} labelColor={style.labelTextColor || "#666666"} valueColor={style.valueTextColor || "#B3B3B3"} />
                        <CultureRow icon={Globe2} label="RELIGIONS" values={religions} iconColor={style.iconColor || "#666666"} labelColor={style.labelTextColor || "#666666"} valueColor={style.valueTextColor || "#B3B3B3"} />
                        <CultureRow icon={CalendarDays} label="FESTIVALS" values={festivals} iconColor={style.iconColor || "#666666"} labelColor={style.labelTextColor || "#666666"} valueColor={style.valueTextColor || "#B3B3B3"} />
                    </div>
                </div>
            </div>
        </section>
    )
}

export default CulturePreview
