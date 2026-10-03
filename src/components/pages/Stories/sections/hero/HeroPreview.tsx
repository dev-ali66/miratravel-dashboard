import { UniversalMultimediaPreview } from "@/components/pages/CMS/shared/UniversalMultimediaPreview";
import { DynamicStyledTextPreview } from "@/components/pages/CMS/shared/DynamicStyledTextPreview";
import { DynamicCmsButtonPreview } from "@/components/pages/CMS/shared/DynamicCmsButtonPreview";
import type { StoryPreviewProps } from "../../config/storySections";

export function HeroPreview({ story }: StoryPreviewProps) {
  const hero = story?.hero || {};
  const isCenter = hero.isCenter !== false;

  return (
    <section className="relative flex min-h-[500px] h-[560px] @xl:h-[725px] w-full items-center overflow-hidden bg-[#171717] text-white justify-center">
      {/* Background Media (Image / Video / Color) */}
      <UniversalMultimediaPreview
        multimedia={hero.backgroundMultimedia}
        mode="background"
        overlayClassName="bg-gradient-to-t from-black/80 via-black/35 to-transparent"
      />

      {/* Hero Content Container */}
      <div
        className={`relative z-10 mx-auto flex h-full w-full flex-col justify-center px-4 @md:px-12 @xl:px-[344px] py-12 ${
          isCenter ? "items-center text-center" : "items-start text-left"
        }`}
      >
        <div
          className={`flex w-full max-w-[880px] flex-col ${
            isCenter ? "items-center text-center" : "items-start text-left"
          }`}
        >
          {/* Breadcrumb / Navigation Tag */}
          <DynamicStyledTextPreview
            as="span"
            data={hero.breadcrumb}
            className="text-xs @md:text-[13px] font-semibold uppercase tracking-[2.5px] text-[#E5A84B] mb-2"
          />

          {/* Subtitle / Tagline */}
          <DynamicStyledTextPreview
            as="span"
            data={hero.subtitle}
            className="text-xs @md:text-[15px] @xl:text-base font-semibold uppercase leading-5 @xl:leading-6 tracking-[2px] mb-2 @xl:mb-3"
          />

          {/* Hero Main Title */}
          <DynamicStyledTextPreview
            as="h1"
            data={hero.title}
            className="font-heading font-semibold text-[32px] @sm:text-[44px] @xl:text-[64px] leading-[40px] @xl:leading-[72px] tracking-[0.905px] mb-3 @xl:mb-4"
          />

          {/* Hero Description */}
          <DynamicStyledTextPreview
            as="div"
            data={hero.description}
            className="text-[15px] @sm:text-base @xl:text-[20px] font-medium leading-[26px] @xl:leading-[32px] max-w-[640px]"
          />

          {/* CTA Buttons */}
          {Array.isArray(hero.buttons) && hero.buttons.length > 0 && (
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <DynamicCmsButtonPreview buttons={hero.buttons} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
