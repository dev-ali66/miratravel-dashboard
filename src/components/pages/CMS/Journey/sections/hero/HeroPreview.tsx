import type { JourneyPreviewSectionProps } from "../../journeyTypes"
import { DynamicStyledTextPreview } from "@/components/pages/CMS/shared/DynamicStyledTextPreview"
import { UniversalMultimediaPreview } from "@/components/pages/CMS/shared/UniversalMultimediaPreview"
import { DynamicCmsButtonPreview } from "@/components/pages/CMS/shared/DynamicCmsButtonPreview"

export function HeroPreview({ draft }: JourneyPreviewSectionProps) {
  if (!draft) return null

  const hero = draft?.hero || draft?.data?.hero || {}
  const isCenter = Boolean(hero.isCenter)

  return (
    <section
      data-section="hero"
      className="relative flex min-h-[500px] md:min-h-[560px] lg:min-h-[640px] w-full items-end pb-12 pt-28 md:pb-16 lg:pb-20 overflow-hidden"
    >
      {/* Background Media (Color / Image / Video) */}
      <UniversalMultimediaPreview
        multimedia={hero.backgroundMultimedia}
        fallbackColor="#182D09"
        mode="background"
      />

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`flex flex-col ${
            isCenter ? "items-center text-center mx-auto" : "items-start text-left"
          } max-w-3xl`}
        >
          {/* Breadcrumb Tag */}
          {hero.breadcrumb && (
            <DynamicStyledTextPreview
              as="span"
              data={hero.breadcrumb}
              fallbackColor="#E5E7EB"
              className="mb-3 inline-block font-sans text-xs font-semibold uppercase tracking-widest"
            />
          )}

          {/* Hero Main Title */}
          <DynamicStyledTextPreview
            as="h1"
            data={hero.title}
            fallbackColor="#FFFFFF"
            className="mb-4 font-serif text-3xl font-bold leading-tight sm:text-4xl md:text-5xl lg:text-6xl text-white"
          />

          {/* Subtitle / Catchphrase */}
          {hero.subtitle && (
            <DynamicStyledTextPreview
              as="p"
              data={hero.subtitle}
              fallbackColor="#E5E7EB"
              className="mb-4 text-base font-medium sm:text-lg md:text-xl text-gray-200"
            />
          )}

          {/* Description */}
          {hero.description && (
            <DynamicStyledTextPreview
              as="div"
              data={hero.description}
              fallbackColor="#D1D5DB"
              className="mb-6 text-sm leading-relaxed text-gray-300 sm:text-base max-w-2xl"
            />
          )}

          {/* CTA Buttons */}
          {Array.isArray(hero.buttons) && hero.buttons.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-4">
              <DynamicCmsButtonPreview buttons={hero.buttons} />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default HeroPreview
