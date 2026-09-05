/* =====================================================
   FAQ — PREVIEW SECTION
   Auto-migrated from the legacy LocationPreview.tsx monolith.===================================================== */

import type { LocationData, FAQItem } from "../../locationTypes"
import { getLocationBasics, FALLBACK_IMAGE } from "../../shared/previewBasics"
import { UniversalMultimediaPreview } from "../../../CMS/Home/shared/preview/UniversalMultimediaPreview"
import { fieldCssStyle } from "../../../CMS/shared/fieldStyle"
import { ChevronDown } from "lucide-react"
import { useState } from "react"

export type LocationFaqProps = {
  draft: LocationData | null
}

export function LocationFaqPreview({ draft }: LocationFaqProps) {
  const { data } = getLocationBasics(draft)

  const faqSection = data.faq_section ?? {}
  const faq = Array.isArray(faqSection.questions) ? faqSection.questions : []

  const [openFaq, setOpenFaq] = useState<number | null>(0)

  const activeFaq =
    faq.length > 0 && openFaq !== null && openFaq < faq.length
      ? openFaq
      : faq.length > 0
        ? 0
        : null

  const background = (faqSection as any)?.backgroundMultimedia

  return (
    <>
      {faq.length > 0 && (
        <section className="relative overflow-hidden text-white">
          <UniversalMultimediaPreview
            multimedia={background}
            fallbackColor="#171717"
            mode="background"
            className="h-full w-full object-cover"
            containerClassName="absolute inset-0 z-0 pointer-events-none"
          />
          <div className="relative z-10 mx-auto max-w-350 px-6 py-16 md:px-10 md:py-24">
            <div className="grid grid-cols-1 gap-12 md:grid-cols-[0.7fr_1.3fr]">
              <div>
                {(faqSection.imageMultimedia || faqSection.image) && (
                  <div className="mb-8 overflow-hidden rounded-2xl">
                    {faqSection.imageMultimedia ? (
                      <UniversalMultimediaPreview
                        multimedia={faqSection.imageMultimedia}
                        fallbackImageSrc={faqSection.image || FALLBACK_IMAGE}
                        fallbackAlt={faqSection.title || "FAQ"}
                        className="h-62.5 w-full object-cover md:h-75"
                      />
                    ) : (
                      <img
                        src={faqSection.image}
                        alt={faqSection.title || "FAQ"}
                        className="h-62.5 w-full object-cover md:h-75"
                        onError={(e) => {
                          e.currentTarget.src = FALLBACK_IMAGE
                        }}
                      />
                    )}
                  </div>
                )}

                <p className="text-[10px] tracking-[0.25em] text-white/35">
                  FREQUENTLY ASKED QUESTIONS
                </p>

                <h2
                  className="mt-5 text-4xl font-light md:text-6xl"
                  style={fieldCssStyle((faqSection as any).titleStyle)}
                >
                  {faqSection.title || (
                    <>
                      Questions,
                      <br />
                      answered.
                    </>
                  )}
                </h2>
              </div>

              <div>
                {faq.map((item: FAQItem, index: number) => {
                  const isOpen = activeFaq === index

                  return (
                    <div
                      key={item.id ?? item.question ?? index}
                      className="border-t border-white/10"
                    >
                      <button
                        type="button"
                        onClick={() => setOpenFaq(isOpen ? null : index)}
                        className="flex w-full items-center justify-between gap-5 py-6 text-left"
                      >
                        <span
                          className="text-lg font-light"
                          style={fieldCssStyle((item as any).questionStyle)}
                        >
                          {item.question}
                        </span>

                        <ChevronDown
                          className={`h-5 w-5 shrink-0 text-white/40 transition-transform ${
                            isOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      {isOpen && (
                        <p
                          className="max-w-2xl pb-6 text-sm leading-7 text-white/45"
                          style={fieldCssStyle((item as any).answerStyle)}
                        >
                          {item.answer}
                        </p>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  )
}
