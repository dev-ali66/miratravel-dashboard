/* =====================================================
   STATISTICS — PREVIEW SECTION
   Auto-migrated from the legacy LocationPreview.tsx monolith.===================================================== */

import type { LocationData } from "../../locationTypes"
import { getLocationBasics } from "../../shared/previewBasics"
import { motion } from "framer-motion"

export type StatisticsPreviewProps = {
    draft: LocationData | null
}

export function StatisticsPreview({
    draft,
}: StatisticsPreviewProps) {
    const { data } = getLocationBasics(draft)
    const statistics = data.statistics ?? {}
    const style = statistics.style ?? {}
    const facts = Array.isArray(statistics.facts) && statistics.facts.length > 0
        ? statistics.facts
        : [
            { label: "Highest Peak", value: "2,694 m", description: "Jezerca, Accursed Mountains" },
            { label: "Area Covered", value: "6,680 km²", description: "Shkodër & Kukës counties" },
            { label: "Language", value: "Gheg Albanian", description: "Italian among younger locals" },
            { label: "Best Access", value: "Shkodër", description: "3 hrs north of Tirana" },
            { label: "Trek Season", value: "May - Oct", description: "Peak window: Jul-Sep" },
            { label: "Currency", value: "Albanian Lek", description: "Cash only in mountains" },
        ]

    return (
        <section
            className="w-full"
            style={{ backgroundColor: style.backgroundColor || "#ffffff" }}
        >
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.95, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="mx-auto grid w-full max-w-350 grid-cols-2 gap-6 border-l pl-10 md:grid-cols-3 md:gap-6 lgx:grid-cols-6 lg:gap-4 xl:gap-6"
                style={{ borderColor: style.borderColor || "rgba(26,21,16,0.12)" }}
            >
                {facts.map((fact, index) => (
                    <div key={`${fact.label}-${index}`} className="flex min-w-0 flex-col gap-2">
                        <span
                            className="text-xs font-normal uppercase tracking-[3px]"
                            style={{ color: style.labelTextColor || "var(--accent)" }}
                        >
                            {fact.label || "FACT"}
                        </span>
                        <strong
                            className="font-heading text-2xl font-semibold"
                            style={{ color: style.valueTextColor || "var(--primary)" }}
                        >
                            {fact.value || "Lorem ipsum"}
                        </strong>
                        <p
                            className="text-sm leading-6"
                            style={{ color: style.descriptionTextColor || "#737373" }}
                        >
                            {fact.description || "Lorem ipsum dolor sit amet."}
                        </p>
                    </div>
                ))}
            </motion.div>
        </section>
    )
}
