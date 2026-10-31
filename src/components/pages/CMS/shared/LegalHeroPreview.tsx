import { UniversalMultimediaPreview } from "@/components/pages/CMS/shared/UniversalMultimediaPreview"
import { DynamicStyledTextPreview } from "@/components/pages/CMS/shared/DynamicStyledTextPreview"
import { DynamicCmsButtonPreview } from "@/components/pages/CMS/shared/DynamicCmsButtonPreview"
import { cn } from "@/lib/utils"
import type { LegalHeroData } from "@/components/pages/CMS/shared/legalHeroDefaults"

export interface LegalHeroPreviewProps {
  hero: LegalHeroData
  lastUpdated?: string
  className?: string
}

export function LegalHeroPreview({ hero, lastUpdated, className }: LegalHeroPreviewProps) {
  const isCenter = Boolean(hero?.isCenter)
  const buttons = Array.isArray(hero?.buttons) ? hero.buttons : []
  const backgroundMultimedia = hero?.backgroundMultimedia

  return (
    <div className={cn("w-full overflow-hidden", className)}>
      <section
        className={cn(
          "relative flex min-h-[460px] @md:min-h-[540px] @lg:min-h-[620px] w-full items-center overflow-hidden bg-brand-primary text-white py-14 px-6 md:px-12",
          isCenter ? "justify-center text-center" : "justify-start text-left"
        )}
      >
        {/* Background Media (Image / Video / Color) with overlay */}
        <UniversalMultimediaPreview
          multimedia={backgroundMultimedia}
          mode="background"
          overlayClassName="bg-black/40"
        />

        {/* Hero Content Container */}
        <div
          className={cn(
            "relative z-10 flex h-full w-full items-center",
            isCenter && "justify-center"
          )}
        >
          <div
            className={cn(
              "flex w-full @xl:max-w-[1000px] flex-col",
              isCenter
                ? "items-center text-center mx-auto"
                : "items-start text-left"
            )}
          >
            {/* Breadcrumb / Category Tag */}
            {hero?.breadcrumb && (
              <DynamicStyledTextPreview
                as="span"
                data={hero.breadcrumb}
                className={cn(
                  "text-xs @md:text-[14px] @xl:text-base font-semibold uppercase leading-5 tracking-[2.4px] text-amber-400 mb-3 @md:mb-4 inline-flex items-center gap-2 rounded-full border border-surface-light/20 bg-surface-light/10 px-3.5 py-1",
                  isCenter && "text-center mx-auto"
                )}
              />
            )}

            {/* Hero Main Title */}
            <DynamicStyledTextPreview
              as="h1"
              data={hero?.title}
              className={cn(
                "font-heading font-semibold text-[32px] @md:text-[46px] @lg:text-[54px] @xl:text-[60px] leading-[40px] @md:leading-[58px] @lg:leading-[68px] @xl:leading-[74px] tracking-[0.94px] text-neutral-100 mb-4 @md:mb-5 capitalize max-w-[950px]",
                isCenter && "text-center mx-auto"
              )}
            />

            {/* Hero Subtitle */}
            {hero?.subtitle && (
              <DynamicStyledTextPreview
                as="h2"
                data={hero.subtitle}
                className={cn(
                  "text-[15px] @md:text-base @lg:text-[18px] leading-6 @md:leading-[26px] font-medium text-amber-200/90 mb-4 max-w-[850px]",
                  isCenter && "text-center mx-auto"
                )}
              />
            )}

            {/* Editorial Description with RichText Support */}
            {hero?.description && (
              <DynamicStyledTextPreview
                as="div"
                isRichText
                data={hero.description}
                className={cn(
                  "max-w-[800px] text-sm @md:text-base font-normal leading-relaxed text-neutral-200/90 mb-6",
                  isCenter && "text-center mx-auto"
                )}
              />
            )}

            {/* Reusable CTA Buttons List */}
            {buttons.length > 0 && (
              <div className="w-full @md:w-auto my-3">
                <DynamicCmsButtonPreview
                  data={buttons}
                  className={cn(
                    "w-full",
                    isCenter ? "justify-center" : "justify-start"
                  )}
                />
              </div>
            )}

            {/* Last Updated Badge */}
            {lastUpdated && (
              <div
                className={cn(
                  "text-xs text-neutral-300/80 pt-3 tracking-wide",
                  isCenter && "text-center mx-auto"
                )}
              >
                Last updated: {lastUpdated}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}

export default LegalHeroPreview
