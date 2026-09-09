/* =====================================================
   SIGNATURE EXPERIENCES — PREVIEW SECTION
   Matches frontend country details SignatureExperiences
   component 1:1.
   Includes Header row (Label, Title, Description),
   Numbered List (01, 02, 03...) with border divider,
   customizable fonts/colors via fieldCssStyle, and
   background multimedia support.
===================================================== */

import type { LocationData, SignatureExperienceItem } from "../../locationTypes"
import { getLocationBasics, FALLBACK_TEXT } from "../../shared/previewBasics"
import { UniversalMultimediaPreview } from "../../../CMS/Home/shared/preview/UniversalMultimediaPreview"
import { fieldCssStyle } from "../../../CMS/shared/fieldStyle"
import { ArrowRight } from "lucide-react"

export type SignatureExperiencesPreviewProps = {
  draft: LocationData | null
}

export function SignatureExperiencesPreview({
  draft,
}: SignatureExperiencesPreviewProps) {
  const { data } = getLocationBasics(draft)
  const section =
    data.signature_experiences ?? data.signatureExperiences ?? {
      label: "Signature Experiences",
      title: "Signature Experiences",
      description: "",
      experiences: [],
    }

  const items: SignatureExperienceItem[] = Array.isArray(section.experiences)
    ? section.experiences
    : []

  const background = (section as any)?.backgroundMultimedia

  return (
    <section className="relative w-full overflow-hidden py-10 md:py-16 xl:py-20">
      <UniversalMultimediaPreview
        multimedia={background}
        fallbackColor="#FCFBF9"
        mode="background"
        className="h-full w-full object-cover"
        containerClassName="absolute inset-0 z-0 pointer-events-none"
      />

      <div className="relative z-10 container mx-auto px-6">
        <div className="mx-auto flex w-full flex-col items-start justify-start">
          {/* Header Row: Label + Title on Left, Description on Right */}
          <div className="flex w-full flex-col items-start justify-between gap-6 border-b border-[rgba(26,46,42,0.12)] pb-8 lg:flex-row lg:items-end">
            <div className="flex max-w-[620px] flex-col items-start gap-2.5">
              {section.label && (
                <span
                  className="font-nunito-sans text-xs font-semibold tracking-[2px] text-[#C8956C] uppercase md:text-sm md:tracking-[3px]"
                  style={fieldCssStyle((section as any).labelStyle)}
                >
                  {section.label}
                </span>
              )}

              <h2
                className="font-roboto-serif text-3xl font-light text-[#1A2E2A] md:text-4xl lg:text-5xl"
                style={fieldCssStyle((section as any).titleStyle)}
              >
                {section.title || "Signature Experiences"}
              </h2>
            </div>

            {section.description && (
              <p
                className="w-full text-sm leading-relaxed text-[#6B7C6E] md:text-[15px] lg:max-w-[540px] xl:text-base"
                style={fieldCssStyle((section as any).descriptionStyle)}
              >
                {section.description || FALLBACK_TEXT}
              </p>
            )}
          </div>

          {/* Numbered Experiences List */}
          {items.length > 0 && (
            <ol className="mt-8 flex w-full flex-col md:mt-12 md:pl-4 lg:mt-16">
              {items.map((exp, idx) => {
                const num = exp.number || String(idx + 1).padStart(2, "0")
                const href = exp.href || "#"
                const linkText = exp.linkText || "Explore this experience"
                const customButtons: any[] = Array.isArray((exp as any).buttons)
                  ? (exp as any).buttons
                  : (exp as any).button?.label
                    ? [
                        {
                          label: (exp as any).button.label,
                          url: (exp as any).button.url || "#",
                          style: (exp as any).button.style || "primary",
                          backgroundColor:
                            (exp as any).button.backgroundColor || "transparent",
                          textColor:
                            (exp as any).button.textColor || "#C8956C",
                        },
                      ]
                    : []

                return (
                  <li
                    key={exp.id || idx}
                    className="group/item flex w-full flex-col border-b border-[rgba(26,46,42,0.08)] transition-colors duration-300 last:border-b-0 lg:flex-row"
                  >
                    {/* Number Column */}
                    <div className="flex w-16 shrink-0 items-start justify-start py-6 pr-6 border-b border-[rgba(26,46,42,0.08)] md:w-20 md:pr-8 md:py-8 lg:border-b-0 lg:border-r">
                      <span
                        className="font-roboto-serif text-2xl font-light text-[#1A2E2A] transition-colors duration-300 md:text-3xl lg:text-4xl"
                        style={fieldCssStyle((exp as any).numberStyle)}
                      >
                        {num}
                      </span>
                    </div>

                    {/* Content Column */}
                    <div className="flex flex-1 flex-col items-start justify-center py-6 pl-0 md:py-8 lg:pl-8">
                      <h3
                        className="font-roboto-serif text-lg font-medium text-[#1A2E2A] transition-colors duration-300 group-hover/item:text-[#8C4730] md:text-xl lg:text-2xl"
                        style={fieldCssStyle((exp as any).titleStyle)}
                      >
                        {exp.title || `Experience ${num}`}
                      </h3>

                      {exp.description && (
                        <p
                          className="mt-2 text-sm leading-relaxed text-[#6B7C6E] md:text-[15px] lg:text-base"
                          style={fieldCssStyle((exp as any).descriptionStyle)}
                        >
                          {exp.description}
                        </p>
                      )}

                      {/* Custom Buttons / Link */}
                      {customButtons.length > 0 ? (
                        <div className="mt-4 flex flex-row flex-wrap items-center gap-3">
                          {customButtons.map((btn: any, bIdx: number) => {
                            const isPrimary =
                              !btn.style || btn.style === "primary"
                            const defaultBg = isPrimary
                              ? btn.backgroundColor || "transparent"
                              : "transparent"
                            const defaultText = btn.textColor || "#C8956C"
                            const defaultBorder = isPrimary
                              ? "none"
                              : "1px solid #C8956C"

                            return (
                              <a
                                key={`${btn.label || "btn"}-${bIdx}`}
                                href={btn.url || "#"}
                                onClick={(e) => {
                                  if (!btn.url || btn.url === "#") {
                                    e.preventDefault()
                                  }
                                }}
                                className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold tracking-wider uppercase transition hover:opacity-80"
                                style={{
                                  backgroundColor:
                                    btn.backgroundColor || defaultBg,
                                  color: defaultText,
                                  border: btn.backgroundColor
                                    ? "none"
                                    : defaultBorder,
                                }}
                              >
                                <span>{btn.label || linkText}</span>
                                <ArrowRight className="h-3 w-3 transition-transform duration-200 group-hover/item:translate-x-1" />
                              </a>
                            )
                          })}
                        </div>
                      ) : (
                        <a
                          href={href}
                          onClick={(e) => {
                            if (!href || href === "#") {
                              e.preventDefault()
                            }
                          }}
                          className="group/link mt-4 inline-flex items-center gap-2 text-xs font-semibold tracking-wider text-[#C8956C] uppercase transition-colors duration-200 hover:text-[#8C4730] group-hover/item:text-[#8C4730] md:text-[13px]"
                        >
                          <span>{linkText}</span>
                          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover/link:translate-x-1.5" />
                        </a>
                      )}
                    </div>
                  </li>
                )
              })}
            </ol>
          )}
        </div>
      </div>
    </section>
  )
}
