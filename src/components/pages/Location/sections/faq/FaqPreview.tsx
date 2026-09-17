import { useState } from "react"
import { DynamicStyledTextPreview } from "@/components/pages/CMS/shared/DynamicStyledTextPreview"
import { UniversalMultimediaPreview } from "@/components/pages/CMS/Home/shared/preview/UniversalMultimediaPreview"
import type { LocationPreviewSectionProps } from "../../config/locationSections"
import type { FAQItemData } from "./FaqForm"
import { HelpCircle } from "lucide-react"

export function FaqPreview({ draft }: LocationPreviewSectionProps) {
  const faqData =
    draft?.faq ||
    (draft as any)?.data?.faq ||
    (draft as any)?.faqSection ||
    (draft as any)?.faq_section ||
    (draft as any)?.data?.faq_section || {
      title: null,
      imageMultimedia: null,
      backgroundMultimedia: null,
      items: [],
    }

  const items: FAQItemData[] = Array.isArray(faqData.items)
    ? faqData.items
    : Array.isArray(faqData.questions)
    ? faqData.questions
    : []

  const [openIndex, setOpenIndex] = useState<number | null>(
    items.length > 0 ? 0 : null
  )

  const toggleFaq = (idx: number) => {
    setOpenIndex((prev) => (prev === idx ? null : idx))
  }

  const activeItem = openIndex !== null && items[openIndex] ? items[openIndex] : null
  const activeItemMedia = activeItem?.multimedia || activeItem?.imageMultimedia

  const hasMediaContent = (media: any) => {
    if (!media) return false
    const show = media.show || "image"
    if (show === "image" && media.image?.url) return true
    if (show === "video" && media.video?.url) return true
    if (show === "color" && media.color?.color) return true
    return false
  }

  const featuredMedia = hasMediaContent(activeItemMedia)
    ? activeItemMedia
    : faqData.imageMultimedia

  return (
    <section
      data-section="faq"
      id="faq"
      className="relative w-full overflow-hidden bg-background xl:py-[80px] xlg:py-[76px] lg:py-[72px] md:py-[64px] py-[56px]"
    >
      {/* Background Media (Color / Image / Video) */}
      <UniversalMultimediaPreview
        multimedia={faqData.backgroundMultimedia}
        fallbackColor="transparent"
        mode="background"
      />

      <div
        className="relative z-10 w-full scroll-mt-24 container mx-auto px-4 lg:px-0"
        style={{ perspective: "1200px" }}
      >
        <div className="mx-auto flex w-full max-w-[1520px] flex-col items-center justify-start">
          {/* Main Heading Title */}
          <DynamicStyledTextPreview
            as="h2"
            data={faqData.title}
            fallbackColor="#182d09"
            className="text-center font-heading font-semibold text-[34px] md:text-[38px] md:leading-[48px] lg:text-[42px] lg:leading-[52px] xlg:text-[46px] xlg:leading-[58px] xl:text-5xl xl:leading-[64px] text-title"
          />

          {/* 2-Column Responsive Layout */}
          <div className="mt-10 md:mt-12 lg:mt-14 xl:mt-16 flex w-full flex-col lg:flex-row items-center lg:items-start justify-between gap-10 md:gap-12 lg:gap-[95px] xlg:gap-[105px] xl:gap-[115px]">
            {/* Left Column: Featured Visual / Square Media */}
            <div className="relative flex w-full justify-center lg:justify-start lg:w-auto shrink-0">
              <div className="relative flex-shrink-0 overflow-hidden w-[340px] md:w-[500px] lg:w-[460px] xlg:w-[520px] xl:w-[580px] h-[340px] md:h-[500px] lg:h-[460px] xlg:h-[520px] xl:h-[580px] max-w-full aspect-square shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] rounded-[2px] cursor-pointer bg-muted/30">
                <UniversalMultimediaPreview
                  multimedia={featuredMedia}
                  mode="inline"
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>
            </div>

            {/* Right Column: FAQ Accordions */}
            <div className="flex w-full flex-1 flex-col gap-3.5 md:gap-5 lg:gap-6 xlg:gap-7 xl:gap-8">
              {items.length === 0 ? (
                <div className="flex w-full flex-col items-center justify-center rounded-xl border border-dashed border-border/80 bg-muted/20 p-8 text-center">
                  <HelpCircle className="h-8 w-8 text-muted-foreground/60 mb-2" />
                  <p className="text-xs font-medium text-foreground">
                    No frequently asked questions added yet
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Add questions and answers in the FAQ form section.
                  </p>
                </div>
              ) : (
                items.map((q, idx) => {
                  const isOpen = openIndex === idx

                  return (
                    <div
                      key={`faq-item-${idx}`}
                      className={`md:rounded-[14px] rounded-[12px] xl:rounded-[16px] transition-all duration-300 overflow-hidden border border-border/40 ${
                        isOpen
                          ? "bg-accent/10 border-accent/30 shadow-xs"
                          : "bg-card/50 hover:bg-card/80"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => toggleFaq(idx)}
                        aria-expanded={isOpen}
                        className="group flex w-full cursor-pointer items-center justify-between gap-4 px-4 md:px-5 xl:px-6 py-3.5 md:py-4 xl:py-5 text-left outline-none focus-visible:ring-1 focus-visible:ring-primary"
                      >
                        <DynamicStyledTextPreview
                          as="span"
                          data={q.question}
                          fallbackColor="#182d09"
                          className="text-sm md:text-[15px] xl:text-base xl:leading-[30px] md:leading-[28px] leading-[26px] font-normal text-card-title transition-colors duration-200 group-hover:text-primary"
                        />

                        {/* Plus / Cross Animated SVG */}
                        <div className="relative size-6 shrink-0 flex items-center justify-center text-muted-foreground group-hover:text-primary transition-colors duration-200">
                          <svg
                            className="size-4.5 transition-transform duration-300"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                          >
                            <line x1="5" y1="12" x2="19" y2="12" />
                            <line
                              x1="12"
                              y1="5"
                              x2="12"
                              y2="19"
                              className={`transition-all duration-300 origin-center ${
                                isOpen
                                  ? "opacity-0 scale-y-0 rotate-90"
                                  : "opacity-100 scale-y-100 rotate-0"
                              }`}
                            />
                          </svg>
                        </div>
                      </button>

                      {/* Expandable Answer */}
                      {isOpen && (
                        <div className="overflow-hidden transition-all duration-300">
                          <div className="md:px-5 px-4 xl:px-6 pb-3.5 md:pb-4 xl:pb-5 pt-0">
                            <div className="h-px w-full bg-border/40 mb-3" />
                            <DynamicStyledTextPreview
                              as="p"
                              data={q.answer}
                              fallbackColor="#565e69"
                              className="font-inter text-xs md:text-[13px] xl:text-sm font-normal leading-5 md:leading-[22px] xl:leading-6 text-muted-foreground"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default FaqPreview

