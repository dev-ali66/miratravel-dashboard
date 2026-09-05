import { useCmsDraft } from "../shared/CmsDraftContext"
import type { CtaPageData } from "./ctaTypes"
import { UniversalMultimediaPreview } from "../Home/shared/preview/UniversalMultimediaPreview"

const PLACEHOLDER_DATA = {
  eyebrow: "YOUR EYEBROW",
  titleLine1: "Your CTA",
  titleHighlight: "headline goes here",
  description: "Add a short description for your call-to-action section.",
  bgColor: "#E9E7DE",
  image:
    "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1200&q=80",
  imageAlt: "CTA placeholder image",
  buttonLabel: "Get Started",
  buttonUrl: "#",
}

export const CtaPreview = () => {
  const page = useCmsDraft<CtaPageData>()

  const d = page?.data

  const eyebrow = d?.eyebrow || PLACEHOLDER_DATA.eyebrow
  const titleLine1 = d?.titleLine1 || PLACEHOLDER_DATA.titleLine1
  const titleHighlight = d?.titleHighlight || PLACEHOLDER_DATA.titleHighlight
  const description = d?.description || PLACEHOLDER_DATA.description

  const bgColor = d?.bgColor || PLACEHOLDER_DATA.bgColor

  const image = d?.bgImage?.ctaLeftImage || PLACEHOLDER_DATA.image

  const imageAlt = d?.bgImage?.alt || PLACEHOLDER_DATA.imageAlt
  const backgroundMultimedia = d?.backgroundMultimedia
  const rightMultimedia = d?.rightMultimedia

  const buttons =
    d?.buttons && d.buttons.length > 0
      ? d.buttons
      : [
          {
            label: PLACEHOLDER_DATA.buttonLabel,
            url: PLACEHOLDER_DATA.buttonUrl,
            style: "primary",
          },
        ]

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{
        backgroundColor: bgColor,
      }}
    >
      {backgroundMultimedia && (
        <UniversalMultimediaPreview
          multimedia={backgroundMultimedia}
          mode="background"
          className="absolute inset-0"
          containerClassName="absolute inset-0"
        />
      )}
      <div className="grid min-h-[310px] grid-cols-1 md:grid-cols-2">
        {/* Left Content */}
        <div className="flex items-center px-8 py-10 md:px-12 lg:px-16">
          <div className="relative z-10 max-w-[470px]">
            {/* Eyebrow */}
            <div
              className="mb-3 text-[10px] font-semibold tracking-[0.15em] uppercase"
              style={{
                color: (d as any)?.eyebrowStyle?.textColor ?? "#173512",
              }}
            >
              {eyebrow}
            </div>

            {/* Title */}
            <h2
              className="font-serif text-[28px] leading-[1.05] font-bold tracking-[-0.5px] md:text-[32px] lg:text-[34px]"
              style={{
                color: (d as any)?.titleLine1Style?.textColor ?? "#173512",
              }}
            >
              <span>{titleLine1}</span>{" "}
              <span
                style={{
                  color:
                    (d as any)?.titleHighlightStyle?.textColor ?? "#C46F4A",
                }}
              >
                {titleHighlight}
              </span>
            </h2>

            {/* Description */}
            <p
              className="mt-5 max-w-[390px] text-[11px] leading-[1.5]"
              style={{
                color: (d as any)?.descriptionStyle?.textColor ?? "#30332D",
              }}
            >
              {description}
            </p>

            {/* Buttons */}
            {buttons.length > 0 && (
              <div className="mt-7 flex flex-wrap gap-3">
                {buttons.map((btn, index) => {
                  const isPrimary = btn.style === "primary"

                  return (
                    <a
                      key={`${btn.label}-${index}`}
                      href={btn.url || "#"}
                      className="inline-flex min-h-[32px] items-center justify-center px-8 text-[10px] font-semibold transition-colors"
                      style={{
                        backgroundColor:
                          (btn as any).backgroundColor ??
                          (isPrimary ? "#173512" : "transparent"),
                        color:
                          (btn as any).textColor ??
                          (isPrimary ? "#FFFFFF" : "#173512"),
                        border: isPrimary ? "none" : "1px solid #173512",
                      }}
                    >
                      {btn.label || "Button"}
                    </a>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Image */}
        <div className="relative min-h-[260px] md:min-h-[310px]">
          {rightMultimedia ? (
            <UniversalMultimediaPreview
              multimedia={rightMultimedia}
              mode="background"
              className="absolute inset-0"
              containerClassName="absolute inset-0"
            />
          ) : (
            <img
              src={image}
              alt={imageAlt}
              className="absolute inset-0 h-full w-full object-cover"
            />
          )}
        </div>
      </div>
    </section>
  )
}
