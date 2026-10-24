import { UniversalMultimediaPreview } from "@/components/pages/CMS/shared/UniversalMultimediaPreview"
import { DynamicStyledTextPreview } from "@/components/pages/CMS/shared/DynamicStyledTextPreview"
import { ArrowRight, MessageSquare } from "lucide-react"
import type { ExperiencePreviewSectionProps } from "../../config/experienceSections"

export function EnquiryCtaPreview({ draft }: ExperiencePreviewSectionProps) {
  const cta = draft?.enquiryCta

  if (!cta) return null

  return (
    <section
      data-section="enquiry-cta"
      className="relative w-full py-20 px-6 md:px-12 lg:px-20 overflow-hidden bg-brand-primary text-white text-center"
    >
      {cta.backgroundMultimedia && (
        <UniversalMultimediaPreview
          multimedia={cta.backgroundMultimedia}
          mode="background"
          overlayClassName="bg-black/60"
        />
      )}

      <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center gap-6">
        {cta.badgeText && (
          <span className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-[2px] text-accent-muted backdrop-blur-xs">
            {cta.badgeText}
          </span>
        )}

        <DynamicStyledTextPreview
          as="h2"
          data={cta.title}
          className="font-serif text-3xl md:text-5xl font-light text-white leading-tight"
        />

        <DynamicStyledTextPreview
          as="p"
          data={cta.subtitle}
          className="text-base md:text-lg text-white/80 max-w-2xl font-light leading-relaxed"
        />

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mt-2">
          {cta.primaryButtonText && (
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full bg-accent-muted px-8 py-3.5 text-xs font-semibold tracking-wider uppercase text-neutral-900 hover:bg-accent-warm transition-all shadow-lg"
            >
              <span>{cta.primaryButtonText}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          )}

          {cta.secondaryButtonText && (
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-7 py-3.5 text-xs font-semibold tracking-wider uppercase text-white hover:bg-white/20 transition-all backdrop-blur-xs"
            >
              <MessageSquare className="h-4 w-4" />
              <span>{cta.secondaryButtonText}</span>
            </button>
          )}
        </div>

        {cta.note?.value && (
          <DynamicStyledTextPreview
            as="p"
            data={cta.note}
            className="text-xs text-white/60 tracking-wide mt-2"
          />
        )}
      </div>
    </section>
  )
}

export default EnquiryCtaPreview
