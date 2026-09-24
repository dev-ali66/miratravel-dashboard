import { DynamicStyledTextPreview } from "@/components/pages/CMS/shared/DynamicStyledTextPreview"
import { UniversalMultimediaPreview } from "@/components/pages/CMS/shared/UniversalMultimediaPreview"
import { DynamicCmsButtonPreview } from "@/components/pages/CMS/shared/DynamicCmsButtonPreview"
import { emptyFaqCta } from "../../config/emptyFaqPayload"

export interface FaqCtaPreviewProps {
  section?: any
}

export function FaqCtaPreview({ section }: FaqCtaPreviewProps) {
  const cta = section || emptyFaqCta

  const backgroundMultimedia = cta.backgroundMultimedia || emptyFaqCta.backgroundMultimedia
  const rightSideMultimedia = cta.rightSideMultimedia || cta.imageMultimedia || emptyFaqCta.rightSideMultimedia
  const buttons = Array.isArray(cta.buttons) && cta.buttons.length > 0 ? cta.buttons : emptyFaqCta.buttons

  return (
    <section className="w-full pb-16 md:pb-24 xl:pb-32 overflow-hidden bg-background relative">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 xl:px-12">
        <div className="group relative w-full overflow-hidden rounded-[16px] bg-[#101912] text-neutral-100 flex flex-col lg:flex-row items-stretch shadow-md">
          {/* Optional Background Media overlay inside card */}
          {backgroundMultimedia && backgroundMultimedia.show !== "color" && (
            <UniversalMultimediaPreview
              multimedia={backgroundMultimedia}
              mode="background"
              fallbackAlt="CTA background"
              className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            />
          )}

          {/* Left Column: Visual Side Image */}
          <div className="relative w-full lg:w-[42%] xl:w-[38%] min-h-[300px] md:min-h-[360px] xlg:min-h-105 xl:min-h-[462px] overflow-hidden z-10">
            <UniversalMultimediaPreview
              multimedia={rightSideMultimedia}
              fallbackAlt="A personal note from Mira travel specialists"
              mode="inline"
              className="w-full h-full min-h-[300px] md:min-h-[360px] xlg:min-h-105 xl:min-h-[462px] object-cover object-center"
            />
            {/* Subtle Gradient Overlays for Cinematic Depth */}
            <div
              className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-black/25 via-black/5 to-transparent pointer-events-none z-10"
              aria-hidden="true"
            />
          </div>

          {/* Right Column: Note Content & Action */}
          <div className="flex-1 flex flex-col justify-center items-start xl:px-[74.77px] xlg:px-17 md:px-8 px-4 py-6 md:py-8 xlg:py-14 xl:py-[67.97px] z-10">
            {/* Eyebrow with Brand Sparkle Motif */}
            {cta.eyebrow && (
              <div className="flex items-center gap-2 mb-3 md:mb-4">
                <span className="flex items-center justify-center text-accent" aria-hidden="true">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="13"
                    height="21"
                    viewBox="0 0 13 21"
                    fill="none"
                    className="w-2.5 h-4 md:w-3 md:h-5 shrink-0"
                  >
                    <path
                      d="M6.5 0C6.5 6 9.5 10.5 13 10.5C9.5 10.5 6.5 15 6.5 21C6.5 15 3.5 10.5 0 10.5C3.5 10.5 6.5 6 6.5 0Z"
                      fill="currentColor"
                    />
                  </svg>
                </span>

                <DynamicStyledTextPreview
                  as="span"
                  data={cta.eyebrow}
                  className="text-accent text-sm md:text-[15px] xl:text-[17.843px] font-semibold uppercase tracking-[2.141px] leading-4 md:leading-[23px] xl:leading-[26.764px]"
                />
              </div>
            )}

            {/* Note Title if provided */}
            {cta.title && (
              <DynamicStyledTextPreview
                as="h3"
                data={cta.title}
                className="text-neutral-100 font-heading text-xl md:text-2xl font-semibold mb-2"
              />
            )}

            {/* Note Description */}
            {cta.description && (
              <DynamicStyledTextPreview
                as="p"
                data={cta.description}
                className="text-neutral-100 text-base md:text-lg xlg:text-xl xl:text-[21px] font-normal leading-6 md:leading-7 xl:leading-8 tracking-[1.72px] max-w-[837px] mt-2 md:mt-3 mb-6 md:mb-8 xl:mb-10"
              />
            )}

            {/* CTA Buttons */}
            {buttons && buttons.length > 0 ? (
              <DynamicCmsButtonPreview
                buttons={buttons}
                defaultVariant="primary"
                buttonClassName="bg-accent text-accent-foreground hover:opacity-90 rounded-full px-6 py-3.5"
              />
            ) : cta.ctaLabel ? (
              <div>
                <a
                  href={cta.ctaHref || "/contact-us"}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-accent text-accent-foreground text-sm md:text-base font-medium transition-transform hover:scale-[1.02] shadow-sm"
                >
                  <span>{cta.ctaLabel}</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="size-4 sm:size-[17px] md:size-[18px]"
                    aria-hidden="true"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  )
}

export default FaqCtaPreview
