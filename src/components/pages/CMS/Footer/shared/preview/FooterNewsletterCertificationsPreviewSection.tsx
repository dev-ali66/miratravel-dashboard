import { ArrowRight } from "lucide-react"
import { UniversalMultimediaPreview } from "../../../Home/shared/preview/UniversalMultimediaPreview"

import type { FooterPreviewSectionProps } from "./sectionTypes"

export const FooterNewsletterCertificationsPreviewSection = ({
  context,
}: FooterPreviewSectionProps) => {
  const { theme, content } = context

  const newsletter = content.newsletter ?? {}
  const certifications = content.certifications ?? []

  if (!newsletter.text && !newsletter.linkText && certifications.length === 0) {
    return null
  }

  return (
    <div
      className="mt-10 flex flex-col gap-5 border-t pt-4 md:flex-row md:items-center md:justify-between"
      style={{
        borderColor: theme.borderColor,
      }}
    >
      {(newsletter.text || newsletter.linkText) && (
        <div className="flex items-center gap-2">
          {newsletter.text && (
            <span
              className="text-[10px]"
              style={{
                color: theme.mutedTextColor,
              }}
            >
              {newsletter.text}
            </span>
          )}

          {newsletter.linkText && (
            <a
              href={newsletter.url || "#"}
              className="group inline-flex items-center gap-1 text-[10px] transition-opacity hover:opacity-70"
              style={{
                color: theme.accentColor,
              }}
            >
              <span>{newsletter.linkText}</span>

              <ArrowRight
                size={11}
                strokeWidth={1.5}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </a>
          )}
        </div>
      )}

      {certifications.length > 0 && (
        <div className="flex items-center gap-4">
          {certifications.map((certification, index) => (
            <a
              key={index}
              href={certification.url || "#"}
              target={certification.url ? "_blank" : undefined}
              rel={certification.url ? "noreferrer" : undefined}
              className="block transition-opacity hover:opacity-70"
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
                  className="h-7 w-auto max-w-17.5 object-contain"
                  containerClassName="h-7 max-w-17.5"
                />
              ) : certification.name ? (
                <span
                  className="text-[9px]"
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
      )}
    </div>
  )
}
