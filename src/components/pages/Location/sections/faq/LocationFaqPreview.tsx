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
        <section className="relative w-full overflow-hidden bg-surface-light xl:py-[80px] lg:py-[76px] md:py-[72px] sm:py-[64px] py-[56px] text-[#111827]">
          <UniversalMultimediaPreview
            multimedia={background}
            fallbackColor="#F9FAFB"
            mode="background"
            className="h-full w-full object-cover"
            containerClassName="absolute inset-0 z-0 pointer-events-none"
          />
          <div className="relative z-10 container mx-auto px-5 sm:px-8 xl:px-12 2xl:px-16">
            <div className="mx-auto flex w-full max-w-[1520px] flex-col items-center justify-start">
              <h2
                className="text-center font-heading font-semibold text-[34px] md:text-[38px] md:leading-[48px] lg:text-[42px] lg:leading-[52px] xl:text-[46px] xl:leading-[58px] 2xl:text-5xl 2xl:leading-[64px] text-[#111827]"
                style={fieldCssStyle((faqSection as any).titleStyle)}
              >
                {faqSection.title || "Frequently Asked Questions"}
              </h2>

              <div className="mt-10 md:mt-12 lg:mt-14 xl:mt-16 flex w-full flex-col lg:flex-row items-center lg:items-start justify-between gap-10 md:gap-12 lg:gap-[95px] xl:gap-[105px] 2xl:gap-[115px]">
                <div className="relative flex w-full justify-center lg:justify-start lg:w-auto shrink-0">
                  {(faqSection.imageMultimedia || faqSection.image) && (
                    <div className="w-[340px] md:w-[500px] lg:w-[460px] xl:w-[520px] 2xl:w-[580px] h-[340px] md:h-[500px] lg:h-[460px] xl:h-[520px] 2xl:h-[580px] max-w-full aspect-square shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] rounded-[2px] cursor-pointer overflow-hidden">
                      {faqSection.imageMultimedia ? (
                        <UniversalMultimediaPreview
                          multimedia={faqSection.imageMultimedia}
                          fallbackImageSrc={faqSection.image || FALLBACK_IMAGE}
                          fallbackAlt={faqSection.title || "FAQ"}
                          mode="background"
                          className="absolute inset-0 size-full object-cover"
                          containerClassName="absolute inset-0 size-full"
                        />
                      ) : (
                        <img
                          src={faqSection.image}
                          alt={faqSection.title || "FAQ"}
                          className="absolute inset-0 size-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = FALLBACK_IMAGE
                          }}
                        />
                      )}
                    </div>
                  )}
                </div>

                <div className="flex w-full flex-1 flex-col gap-3.5 md:gap-5 lg:gap-6 xl:gap-7 2xl:gap-8">
                {faq.map((item: FAQItem, index: number) => {
                  const isOpen = activeFaq === index

                  return (
                    <div
                      key={item.id ?? item.question ?? index}
                      className="border-b border-border/10 last:border-b-0"
                    >
                      <button
                        type="button"
                        onClick={() => setOpenFaq(isOpen ? null : index)}
                        className="flex w-full items-center justify-between gap-5 py-4 md:py-5 lg:py-6 text-left outline-none"
                      >
                        <span
                          className="text-title font-medium text-[16px] md:text-[18px] lg:text-[20px] xl:text-[22px] 2xl:text-[24px] leading-6 md:leading-[28px] lg:leading-[32px] xl:leading-[36px] transition-colors duration-300"
                          style={fieldCssStyle((item as any).questionStyle)}
                        >
                          {item.question}
                        </span>

                        <div className={`flex items-center justify-center size-8 md:size-10 lg:size-12 shrink-0 rounded-full border border-border/10 transition-colors duration-300 ${isOpen ? "bg-primary border-primary text-white" : "text-primary"}`}>
                          <ChevronDown
                            className={`h-4 w-4 md:h-5 md:w-5 lg:h-6 lg:w-6 transition-transform duration-300 ${
                              isOpen ? "rotate-180" : ""
                            }`}
                          />
                        </div>
                      </button>

                      {isOpen && (
                        <div className="overflow-hidden pb-4 md:pb-5 lg:pb-6 pr-10 md:pr-14 lg:pr-16">
                          <p
                            className="text-subtitle font-normal text-sm md:text-[15px] xl:text-[16px] leading-6 md:leading-[26px] xl:leading-7"
                            style={fieldCssStyle((item as any).answerStyle)}
                          >
                            {item.answer}
                          </p>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </section>
      )}
    </>
  )
}
