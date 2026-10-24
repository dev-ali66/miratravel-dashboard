import { DynamicStyledTextPreview } from "@/components/pages/CMS/shared/DynamicStyledTextPreview"
import type { ExperiencePreviewSectionProps } from "../../config/experienceSections"

export function HighlightsPreview({ draft }: ExperiencePreviewSectionProps) {
  const highlights = draft?.highlights

  if (!highlights || !Array.isArray(highlights.items) || highlights.items.length === 0) {
    return null
  }

  return (
    <section
      data-section="highlights"
      className="relative w-full py-16 md:py-20 px-6 md:px-12 lg:px-20 bg-surface-sand text-foreground"
    >
      <div className="max-w-6xl mx-auto flex flex-col gap-10">
        <div className="text-center max-w-2xl mx-auto">
          <DynamicStyledTextPreview
            as="span"
            data={highlights.label}
            className="text-xs md:text-sm font-semibold uppercase tracking-[2.5px] text-accent mb-2 block"
          />
          <DynamicStyledTextPreview
            as="h2"
            data={highlights.title}
            className="font-serif text-3xl md:text-4xl font-light text-brand-primary"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {highlights.items.map((item, index) => (
            <div
              key={item.id || index}
              className="flex flex-col bg-card text-card-foreground rounded-xl p-6 lg:p-7 shadow-xs border border-border/60 hover:shadow-md transition-shadow relative overflow-hidden"
            >
              <div className="text-[11px] font-bold uppercase tracking-wider text-accent mb-3">
                {item.badge || `Highlight 0${index + 1}`}
              </div>

              <DynamicStyledTextPreview
                as="h3"
                data={item.title}
                className="font-serif text-xl font-medium text-brand-primary mb-2.5 leading-snug"
              />

              <DynamicStyledTextPreview
                as="p"
                data={item.description}
                className="text-sm text-subtitle leading-relaxed"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HighlightsPreview
