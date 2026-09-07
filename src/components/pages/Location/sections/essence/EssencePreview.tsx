/* =====================================================
   ESSENCE — PREVIEW SECTION
   Visually mirrors the real frontend `<Essence />`
   component's layout (eyebrow label, heading, paragraphs,
   bordered quote, image with a stat badge overlay), built
   with plain markup for the admin preview, with every
   color / font size / image driven by `data.essence`.
===================================================== */

import type { LocationData } from "../../locationTypes"
import { getLocationBasics, FALLBACK_IMAGE } from "../../shared/previewBasics"
import { UniversalMultimediaPreview } from "../../../CMS/Home/shared/preview/UniversalMultimediaPreview"
import { fieldCssStyle } from "../../../CMS/shared/fieldStyle"

export type EssencePreviewProps = {
  draft: LocationData | null
}

export function EssencePreview({ draft }: EssencePreviewProps) {
  const { data, name } = getLocationBasics(draft)

  const essence = data.essence ?? {}
  const style = essence.style ?? {}

  const paragraphs = Array.isArray(essence.paragraphs)
    ? essence.paragraphs
    : [
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer vitae justo nec erat commodo volutpat.",
        "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.",
      ]

  const imageSrc = essence.imageSrc || FALLBACK_IMAGE
  const imageAlt = essence.imageAlt || `${name} landscape`

  const labelStyle = style.label ?? {}
  const titleStyle = style.title ?? {}
  const paragraphStyle = style.paragraph ?? {}
  const quoteStyle = style.quote ?? {}
  const statBadgeStyle = style.statBadge ?? {}

  const background = (essence as any)?.backgroundMultimedia

  return (
    <section className="relative w-full overflow-hidden pb-12 md:pb-16 xl:pb-20">
      <UniversalMultimediaPreview
        multimedia={background}
        fallbackColor={style.sectionBackgroundColor || "#FAF7F2"}
        mode="background"
        className="h-full w-full object-cover"
        containerClassName="absolute inset-0 z-0 pointer-events-none"
      />
      <div className="relative z-10 container mx-auto px-5 sm:px-8 xl:px-12 2xl:px-16">
        <div className="flex w-full flex-col items-start gap-12 md:gap-16 xl:gap-16.75">
          <div className="flex w-full max-w-[1280px] mx-auto flex-col-reverse lg:flex-row lg:items-center items-start gap-10 md:gap-12 lg:gap-10 xl:gap-16">
            <div className="flex w-full flex-col items-start">
              <span
                className="justify-start font-normal uppercase text-sm md:text-[15px] xl:text-base xl:leading-4 md:leading-3.5 leading-3 tracking-[2px] md:tracking-[3.5px] xl:tracking-[4.2px]"
                style={{
                  color: labelStyle.textColor || "var(--accent)",
                  fontSize: labelStyle.fontSize || undefined,
                  ...fieldCssStyle((essence as any).labelStyle),
                }}
              >
                {essence.label || `THE ESSENCE OF ${name.toUpperCase()}`}
              </span>

              <h2
                className="w-full justify-start font-semibold font-heading text-[30px] md:text-[36px] lg:text-[40px] xl:text-[48px] leading-[40px] md:leading-[48px] lg:leading-[52px] xl:leading-[64px]"
                style={{
                  color: titleStyle.textColor || "var(--primary)",
                  fontSize: titleStyle.fontSize || undefined,
                  ...fieldCssStyle((essence as any).titleStyle),
                }}
              >
                {essence.title || "Lorem ipsum dolor sit amet"}
              </h2>

              <div className="mt-6 flex w-full flex-col items-start gap-3.5 md:mt-7 md:gap-4 xl:mt-7.5 xl:gap-5">
                {paragraphs.map((paragraph, index) => (
                  <p
                    key={`${paragraph}-${index}`}
                    className="w-full justify-start font-normal text-[14px] md:text-[15px] xl:text-base leading-6 md:leading-[26px] xl:leading-7 tracking-[1px] text-justify"
                    style={{
                      color: paragraphStyle.textColor || "#4b5563",
                      fontSize: paragraphStyle.fontSize || undefined,
                      ...fieldCssStyle(
                        (essence as any).paragraphStyles?.[index]
                      ),
                    }}
                  >
                    {paragraph}
                  </p>
                ))}
              </div>

              <div className="mt-8 w-full border-t border-neutral-900/10 pt-6">
                <blockquote
                  className="w-full justify-start font-normal italic text-[15px] md:text-[16px] lg:text-[18px] xl:text-[20px] leading-[22px] md:leading-[24px] lg:leading-[28px] xl:leading-[32px]"
                  style={{
                    color: quoteStyle.textColor || "#57534e",
                    fontSize: quoteStyle.fontSize || undefined,
                    ...fieldCssStyle((essence as any).quoteStyle),
                  }}
                >
                  &ldquo;
                  {essence.quote ||
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit."}
                  &rdquo;
                </blockquote>
              </div>
            </div>

            <div className="relative mb-4 flex w-full justify-center self-stretch sm:mb-6 lg:mb-0 lg:justify-end">
              <div className="relative w-full max-w-[340px] xs:max-w-[390px] sm:max-w-[450px] md:max-w-[490px] lg:max-w-full xl:max-w-[536px] 2xl:max-w-[620px] h-[425px] xs:h-[488px] sm:h-[562px] md:h-[612px] lg:h-[520px] xl:h-[640px] 2xl:h-[700px]">
                {essence.imageMultimedia ? (
                  <UniversalMultimediaPreview
                    multimedia={essence.imageMultimedia}
                    fallbackImageSrc={imageSrc}
                    fallbackAlt={imageAlt}
                    mode="inline"
                    className="size-full rounded-xs object-cover object-center"
                  />
                ) : (
                  <img
                    src={imageSrc}
                    alt={imageAlt}
                    className="size-full rounded-xs object-cover object-center"
                    onError={(event) => {
                      event.currentTarget.src = FALLBACK_IMAGE
                    }}
                  />
                )}

                {essence.statValue && (
                  <div
                    className="bg-accent-muted absolute -bottom-5 -left-3 flex w-49 flex-col items-start px-5 py-4 sm:-bottom-6 sm:-left-4 md:-left-5 md:px-6 md:py-4.5 xl:-left-6 xl:px-7 xl:py-5"
                    style={{
                      backgroundColor:
                        statBadgeStyle.backgroundColor || "var(--accent-muted)",
                      color: statBadgeStyle.textColor || "#f5f5f5",
                    }}
                  >
                    <span className="font-heading text-[24px] leading-7 font-medium md:text-[26px] md:leading-8 xl:text-[30px] xl:leading-9">
                      {essence.statValue}
                    </span>
                    {essence.statLabel && (
                      <span className="pt-0.5 text-[13px] leading-4 font-normal opacity-75 md:text-[13.5px] md:leading-4.5 xl:text-sm xl:leading-5">
                        {essence.statLabel}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
