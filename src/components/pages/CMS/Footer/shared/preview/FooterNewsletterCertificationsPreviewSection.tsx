import { ArrowRight } from "lucide-react"
import { UniversalMultimediaPreview } from "../../../Home/shared/preview/UniversalMultimediaPreview"
import type { FooterPreviewSectionProps } from "./sectionTypes"

export const FooterNewsletterCertificationsPreviewSection = ({
  context,
}: FooterPreviewSectionProps) => {
  const { theme, content } = context

  const newsletter = content.newsletter ?? {
    text: "Stay up to date:",
    linkText: "Subscribe to the Newsletter",
    url: "/newsletter",
  }

  const certifications = content.certifications ?? []

  const text = newsletter.text || "Stay up to date:"
  const linkText = newsletter.linkText || "Subscribe to the Newsletter"

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
              href={newsletter.url || "#"}
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
              {certifications.map((certification, index) => (
                <a
                  key={index}
                  href={certification.url || "#"}
                  target={certification.url ? "_blank" : undefined}
                  rel={certification.url ? "noreferrer" : undefined}
                  className="block transition-opacity duration-300 hover:opacity-100 opacity-90"
                  title={certification.name ?? ""}
                >
                  {certification.image ? (
                    <UniversalMultimediaPreview
                      multimedia={{
                        type: "image",
                        url: certification.image,
                        alt: certification.alt ?? certification.name ?? "",
                      }}
                      fallbackAlt={certification.alt ?? certification.name ?? ""}
                      className="xl:h-8 md:h-7 h-6 w-auto object-contain"
                      containerClassName="xl:h-8 md:h-7 h-6 w-auto"
                    />
                  ) : certification.name ? (
                    <span
                      className="text-xs"
                      style={{
                        color: theme.mutedTextColor,
                      }}
                    >
                      {certification.name}
                    </span>
                  ) : null}
                </a>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
