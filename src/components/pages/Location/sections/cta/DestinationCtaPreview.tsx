import { DynamicStyledPreview } from "@/components/shared/DynamicStyledPreview"
import { UniversalMultimediaPreview } from "@/components/pages/CMS/Home/shared/preview/UniversalMultimediaPreview"
import type { LocationPreviewSectionProps } from "../../config/locationSections"

export function DestinationCtaPreview({ draft }: LocationPreviewSectionProps) {
  const ctaData =
    draft?.cta ||
    (draft as any)?.data?.cta ||
    (draft as any)?.destinationCta ||
    (draft as any)?.data?.destinationCta || {
      title: {
        value: "Didn't find your perfect journey?",
        textColor: "#182d09",
        textOpacity: 1,
        backgroundColor: null,
        backgroundOpacity: 1,
      },
      description: {
        value:
          "Our collection is carefully designed but every travel is different.\nIf you'd like something more personal, we'd love to create it together.",
        textColor: "#565e69",
        textOpacity: 1,
        backgroundColor: null,
        backgroundOpacity: 1,
      },
      buttonText: "Plan a tailor-made journey",
      buttonUrl: "/contact",
      image: "/images/cta.png",
      imageMultimedia: null,
      backgroundMultimedia: null,
    }

  const btnLabel =
    ctaData.button?.label || ctaData.buttonText || "Plan a tailor-made journey"
  const btnUrl = ctaData.button?.url || ctaData.buttonUrl || "/contact"

  const motifMedia =
    ctaData.imageMultimedia ||
    (ctaData.image
      ? {
          show: "image",
          image: {
            url: ctaData.image,
            alt: "Decorative CTA Motif",
            opacity: 100,
            overlayColor: "#000000",
            overlayOpacity: 0,
            width: "100%",
            height: "100%",
            aspectRatio: "auto",
            fit: "contain",
          },
        }
      : null)

  // Split multi-line descriptions into individual paragraphs
  const rawDescValue =
    typeof ctaData.description === "object"
      ? ctaData.description?.value || ""
      : ctaData.description || ""
  const descLines = String(rawDescValue)
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)

  return (
    <section
      data-section="cta"
      id="destination-cta"
      className="relative w-full overflow-hidden bg-background pt-[60px] @xs:pt-[70px] @sm:pt-[80px] @md:pt-[95px] @lg:pt-[110px] @lgx:pt-[115px] @xlg:pt-[120px] @mid:pt-[135px] @xl:pt-[145px] pb-[60px] @xs:pb-[70px] @sm:pb-[80px] @md:pb-[95px] @lg:pb-[110px] @lgx:pb-[115px] @xlg:pb-[120px] @mid:pb-[135px] @xl:pb-[145px]"
    >
      <div
        className="relative z-10 w-full scroll-mt-24 container mx-auto px-4 @lg:px-0"
        style={{ perspective: "1200px", overflowX: "clip" }}
      >
        <div className="w-full">
          {/* Rounded Card Container */}
          <div className="relative mx-auto flex w-full max-w-[1520px] min-h-[380px] @xl:h-[458px] flex-col justify-center items-start overflow-hidden rounded-[24px] @md:rounded-[50px] @lg:rounded-[70px] @xl:rounded-[90px] bg-neutral-200/50 dark:bg-neutral-800/40 border border-border/40 shadow-xs">
            {/* Background Media inside Card */}
            <UniversalMultimediaPreview
              multimedia={ctaData.backgroundMultimedia}
              fallbackColor="transparent"
              mode="background"
            />

            {/* Left Content Area */}
            <div className="relative z-10 flex flex-col items-start justify-center gap-8 @sm:gap-10 @md:gap-12 @lg:gap-14 @xl:gap-16 px-6 py-10 @xs:px-8 @xs:py-12 @sm:px-12 @sm:py-14 @md:px-16 @md:py-16 @lg:px-20 @lg:py-20 @xl:px-[142px] @xl:py-[96px]">
              {/* Title & Description Group */}
              <div className="flex flex-col items-start justify-start gap-4 @sm:gap-5 @md:gap-6">
                <DynamicStyledPreview
                  as="h2"
                  field={ctaData.title}
                  fallback="Didn't find your perfect journey?"
                  fallbackColor="#182d09"
                  className="font-heading text-[30px] leading-[38px] @md:text-[42px] @md:leading-[52px] @lg:text-[46px] @lg:leading-[56px] @xl:text-[50px] @xl:leading-[60px] font-semibold tracking-[2px] text-primary max-w-[882px]"
                />

                <div className="flex flex-col items-start justify-start gap-1 @sm:gap-1.5 text-subtitle text-sm @md:text-[15px] @xl:text-base font-normal leading-5 @md:leading-[22px] @xl:leading-6 tracking-[1px]">
                  {descLines.length > 0 ? (
                    descLines.map((line, idx) => (
                      <p key={idx} style={{ color: "#565e69" }}>
                        {line}
                      </p>
                    ))
                  ) : (
                    <>
                      <p style={{ color: "#565e69" }}>
                        Our collection is carefully designed but every travel is
                        different.
                      </p>
                      <p style={{ color: "#565e69" }}>
                        If you'd like something more personal, we'd love to
                        create it together.
                      </p>
                    </>
                  )}
                </div>
              </div>

              {/* Action Button */}
              <div>
                <a
                  href={btnUrl}
                  className="group relative inline-flex w-auto min-w-[236px] @md:h-[56px] h-[52px] px-3 @md:px-[17px] @md:py-[10px] py-2 justify-center items-center rounded-[2px] bg-[#af6348] text-white text-sm @md:text-base font-semibold leading-5 overflow-hidden transition-all duration-200 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#6c2813] whitespace-nowrap shadow-sm hover:shadow-md hover:bg-[#974d35]"
                >
                  <span className="relative z-10 whitespace-nowrap">
                    {btnLabel}
                  </span>
                </a>
              </div>
            </div>

            {/* Right Decorative Floating Motif */}
            <div className="pointer-events-none absolute right-[-80px] @md:right-[-130px] @lg:right-[-140px] @xl:right-[-142px] top-[-100px] @sm:top-[-150px] @md:top-[-200px] @xl:top-[-260px] w-[500px] @sm:w-[650px] @md:w-[780px] @lg:w-[880px] @xl:w-[947px] h-[516px] @sm:h-[671px] @md:h-[805px] @lg:h-[908px] @xl:h-[978px] opacity-40 z-0">
              {motifMedia ? (
                <img
                  src={
                    motifMedia?.image?.url ||
                    motifMedia?.url ||
                    "/images/cta.png"
                  }
                  alt=""
                  aria-hidden="true"
                  className="w-full h-full object-contain object-right"
                />
              ) : (
                <img
                  src="/images/cta.png"
                  alt=""
                  aria-hidden="true"
                  className="w-full h-full object-contain object-right"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
