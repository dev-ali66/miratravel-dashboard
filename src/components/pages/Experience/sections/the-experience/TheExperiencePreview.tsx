import { UniversalMultimediaPreview } from "@/components/pages/CMS/shared/UniversalMultimediaPreview"
import { DynamicStyledTextPreview } from "@/components/pages/CMS/shared/DynamicStyledTextPreview"
import { Quote } from "lucide-react"
import type { ExperiencePreviewSectionProps } from "../../config/experienceSections"

export function TheExperiencePreview({ draft }: ExperiencePreviewSectionProps) {
  const theExp = draft?.theExperience

  if (!theExp) return null

  return (
    <section
      data-section="the-experience"
      className="relative w-full py-16 md:py-24 px-6 md:px-12 lg:px-20 overflow-hidden bg-card text-foreground"
    >
      {/* Background Media */}
      {theExp.backgroundMultimedia && (
        <UniversalMultimediaPreview
          multimedia={theExp.backgroundMultimedia}
          mode="background"
        />
      )}

      <div className="relative z-10 max-w-6xl mx-auto flex flex-col gap-12">
        {/* Section Eyebrow & Title */}
        <div className="max-w-3xl">
          <DynamicStyledTextPreview
            as="span"
            data={theExp.label}
            className="text-xs md:text-sm font-semibold uppercase tracking-[2.5px] text-accent mb-2 block"
          />
          <DynamicStyledTextPreview
            as="h2"
            data={theExp.title}
            className="font-serif text-3xl md:text-4xl lg:text-5xl font-light text-brand-primary leading-tight mb-4"
          />
          <DynamicStyledTextPreview
            as="p"
            data={theExp.summary}
            className="text-base md:text-lg text-subtitle leading-relaxed font-light"
          />
        </div>

        {/* Narrative & Visual Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-7 flex flex-col gap-6">
            <DynamicStyledTextPreview
              as="div"
              isRichText
              data={theExp.narrative}
              className="prose prose-neutral max-w-none text-[15px] md:text-base leading-relaxed text-body"
            />

            {theExp.quote?.value && (
              <div className="relative pl-6 border-l-2 border-accent my-4 italic text-brand-primary text-lg font-serif">
                <Quote className="h-5 w-5 text-accent/40 absolute -top-2 left-0 -translate-x-1/2 bg-card" />
                <DynamicStyledTextPreview as="p" data={theExp.quote} />
              </div>
            )}
          </div>

          <div className="lg:col-span-5">
            {theExp.imageMultimedia && (
              <div className="relative rounded-2xl overflow-hidden shadow-xl aspect-4/5 border border-border/60 bg-muted">
                <UniversalMultimediaPreview
                  multimedia={theExp.imageMultimedia}
                  mode="inline"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default TheExperiencePreview
