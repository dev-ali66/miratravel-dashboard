/* =====================================================
   STATISTICS — PREVIEW SECTION
   Auto-migrated from the legacy LocationPreview.tsx monolith.===================================================== */

import type { LocationData } from "../../locationTypes"
import { getLocationBasics } from "../../shared/previewBasics"
import { motion } from "framer-motion"
import { UniversalMultimediaPreview } from "../../../CMS/Home/shared/preview/UniversalMultimediaPreview"
import { fieldCssStyle } from "../../../CMS/shared/fieldStyle"

export type StatisticsPreviewProps = {
  draft: LocationData | null
}

export function StatisticsPreview({ draft }: StatisticsPreviewProps) {
  const { data } = getLocationBasics(draft)
  const statistics = data.statistics ?? {}
  const style = statistics.style ?? {}
  const facts =
    Array.isArray(statistics.facts) && statistics.facts.length > 0
      ? statistics.facts
      : [
          {
            label: "Highest Peak",
            value: "2,694 m",
            description: "Jezerca, Accursed Mountains",
          },
          {
            label: "Area Covered",
            value: "6,680 km²",
            description: "Shkodër & Kukës counties",
          },
          {
            label: "Language",
            value: "Gheg Albanian",
            description: "Italian among younger locals",
          },
          {
            label: "Best Access",
            value: "Shkodër",
            description: "3 hrs north of Tirana",
          },
          {
            label: "Trek Season",
            value: "May - Oct",
            description: "Peak window: Jul-Sep",
          },
          {
            label: "Currency",
            value: "Albanian Lek",
            description: "Cash only in mountains",
          },
        ]

  const background = (statistics as any)?.backgroundMultimedia

  return (
    <section className="relative w-full overflow-hidden py-12 md:py-16 xl:py-20">
      <UniversalMultimediaPreview
        multimedia={background}
        fallbackColor={style.backgroundColor || "#ffffff"}
        mode="background"
        className="h-full w-full object-cover"
        containerClassName="absolute inset-0 z-0 pointer-events-none"
      />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.95, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="lgx:grid-cols-6 relative z-10 mx-auto grid w-full max-w-350 grid-cols-2 items-stretch gap-6 border-l pl-10 md:grid-cols-3 md:gap-6 lg:gap-4 xl:gap-6"
        style={{ borderColor: style.borderColor || "rgba(26,21,16,0.12)" }}
      >
        {facts.map((fact: any, index: number) => {
          const hasMedia = !!(fact.media || fact.image || fact.icon)

          return (
            <div
              key={`${fact.label}-${index}`}
              className="flex h-full min-h-[100px] min-w-0 items-stretch gap-3.5 sm:gap-4"
            >
              {hasMedia && (
                <div className="flex w-12 shrink-0 items-center justify-center self-stretch overflow-hidden rounded-lg bg-black/5 sm:w-14 dark:bg-white/5">
                  <UniversalMultimediaPreview
                    multimedia={fact.media}
                    fallbackImageSrc={fact.image || fact.icon}
                    className="h-full w-full object-cover"
                    containerClassName="h-full w-full flex items-center justify-center"
                  />
                </div>
              )}
              <div className="flex min-w-0 flex-1 flex-col justify-between gap-1.5 sm:gap-2">
                <div>
                  <span
                    className="block text-xs font-normal tracking-[3px] uppercase"
                    style={{
                      color: style.labelTextColor || "var(--accent)",
                      ...fieldCssStyle(fact.labelStyle),
                    }}
                  >
                    {fact.label || "FACT"}
                  </span>
                  <strong
                    className="font-heading block text-2xl font-semibold"
                    style={{
                      color: style.valueTextColor || "var(--primary)",
                      ...fieldCssStyle(fact.valueStyle),
                    }}
                  >
                    {fact.value || "Lorem ipsum"}
                  </strong>
                </div>
                <p
                  className="text-sm leading-6"
                  style={{
                    color: style.descriptionTextColor || "#737373",
                    ...fieldCssStyle(fact.descriptionStyle),
                  }}
                >
                  {fact.description || "Lorem ipsum dolor sit amet."}
                </p>
              </div>
            </div>
          )
        })}
      </motion.div>
    </section>
  )
}
