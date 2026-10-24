import { UniversalMultimediaPreview } from "@/components/pages/CMS/shared/UniversalMultimediaPreview"
import { DynamicStyledTextPreview } from "@/components/pages/CMS/shared/DynamicStyledTextPreview"
import { CheckCircle2 } from "lucide-react"
import type { ExperiencePreviewSectionProps } from "../../config/experienceSections"

export function MiraTouchPreview({ draft }: ExperiencePreviewSectionProps) {
  const touch = draft?.miraTouch

  if (!touch) return null

  const items = Array.isArray(touch.items) ? touch.items : []

  return (
    <section
      data-section="mira-touch"
      className="relative w-full py-16 md:py-24 px-6 md:px-12 lg:px-20 bg-brand-primary text-white overflow-hidden"
    >
      <div className="relative z-10 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 flex flex-col gap-6">
          <DynamicStyledTextPreview
            as="span"
            data={touch.label}
            className="text-xs md:text-sm font-semibold uppercase tracking-[2.5px] text-accent-muted"
          />

          <DynamicStyledTextPreview
            as="h2"
            data={touch.title}
            className="font-serif text-3xl md:text-4xl lg:text-5xl font-light text-white leading-tight"
          />

          <DynamicStyledTextPreview
            as="p"
            data={touch.description}
            className="text-base text-white/80 leading-relaxed font-light"
          />

          {items.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
              {items.map((it, idx) => (
                <div key={idx} className="flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs">
                  <CheckCircle2 className="h-4 w-4 text-accent-muted shrink-0 mt-0.5" />
                  <div className="flex flex-col gap-1">
                    <DynamicStyledTextPreview
                      as="h4"
                      data={it.title}
                      className="text-sm font-semibold text-white"
                    />
                    <DynamicStyledTextPreview
                      as="p"
                      data={it.description}
                      className="text-xs text-white/70 leading-relaxed"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="lg:col-span-5">
          {touch.imageMultimedia && (
            <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-4/5 border border-white/20">
              <UniversalMultimediaPreview
                multimedia={touch.imageMultimedia}
                mode="inline"
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default MiraTouchPreview
