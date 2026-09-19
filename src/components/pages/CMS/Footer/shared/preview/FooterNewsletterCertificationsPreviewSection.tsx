import { ArrowRight } from "lucide-react"
import { UniversalMultimediaPreview } from "../../../Home/shared/preview/UniversalMultimediaPreview"
import { getSafeString } from "../../../shared/FormControls"
import type { FooterPreviewSectionProps } from "./sectionTypes"

export const FooterNewsletterCertificationsPreviewSection = ({
  context,
}: FooterPreviewSectionProps) => {
  const { theme, content } = context

  const newsletter = content.newsletter ?? {}
  const certifications = content.certifications ?? []

  const text = getSafeString(newsletter.text, "Stay up to date:")
  const linkText = getSafeString(newsletter.linkText, "Subscribe to the Newsletter")
  const url = getSafeString(newsletter.url, "/newsletter")

  return (
    <div className="w-full my-8 lg:my-0">
      <div className="container px-4 lg:px-0 mx-auto">
        <div
          className="w-full py-5 border-t-2 border-b-2 flex flex-col md:flex-row items-center justify-between gap-5 md:gap-4"
          style={{
            borderColor: theme.borderColor || "rgba(255, 255, 255, 0.16)",
          }}
        >
          {/* Newsletter CTA */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-center md:text-left font-normal text-sm md:text-[15px] xl:text-base leading-5 md:leading-[22px] xl:leading-6">
            <span style={{ color: theme.mutedTextColor }}>{text}</span>

            <a
              href={url || "#"}
              className="group relative inline-flex items-center gap-1.5 font-medium transition-opacity duration-300 hover:opacity-90 focus-visible:outline-none"
              style={{
                color: theme.accentColor || "#C97B4A",
              }}
            >
              <span>{linkText}</span>

              <ArrowRight
                size={16}
                strokeWidth={2.2}
                className="transition-transform duration-200 group-hover:translate-x-1"
              />
            </a>
          </div>

          {/* Partner Certification Badges */}
          {certifications.length > 0 ? (
            <div className="flex flex-wrap items-center justify-center xl:gap-3 md:gap-2.5 gap-2">
              {certifications.map((certification, index) => {
                const name = getSafeString(certification.name)
                const alt = getSafeString(certification.alt) || name
                const certUrl = getSafeString(certification.url)
                const imgSrc = typeof certification.image === "object"
                  ? (certification.image as any)?.url || (certification.image as any)?.value
                  : certification.image

                return (
                  <a
                    key={index}
                    href={certUrl || "#"}
                    target={certUrl ? "_blank" : undefined}
                    rel={certUrl ? "noreferrer" : undefined}
                    className="block transition-opacity duration-300 hover:opacity-100 opacity-90"
                    title={name}
                  >
                    {imgSrc ? (
                      <UniversalMultimediaPreview
                        multimedia={{
                          type: "image",
                          url: imgSrc,
                          alt,
                        }}
                        fallbackAlt={alt}
                        className="xl:h-8 md:h-7 h-6 w-auto object-contain"
                        containerClassName="xl:h-8 md:h-7 h-6 w-auto"
                      />
                    ) : name ? (
                      <span
                        className="text-xs"
                        style={{
                          color: theme.mutedTextColor,
                        }}
                      >
                        {name}
                      </span>
                    ) : null}
                  </a>
                )
              })}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}

