import { THEME_COLORS } from "@/config/theme"
import { useState } from "react"
import { DynamicStyledTextPreview } from "@/components/pages/CMS/shared/DynamicStyledTextPreview"
import { UniversalMultimediaPreview } from "@/components/pages/CMS/shared/UniversalMultimediaPreview"
import type { FAQItemData } from "./UniversalFaqForm"
import { HelpCircle, ChevronDown } from "lucide-react"

export interface UniversalFaqPreviewProps {
  draft?: any
  faqData?: any
  sectionKey?: string
}

export function UniversalFaqPreview({
  draft,
  faqData: directFaqData,
  sectionKey = "faq",
}: UniversalFaqPreviewProps) {
  const faqData =
    directFaqData ||
    draft?.[sectionKey] ||
    draft?.faq ||
    draft?.data?.[sectionKey] ||
    draft?.data?.faq ||
    draft?.faqSection ||
    draft?.faq_section ||
    draft?.data?.faq_section || {
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
      data-section={sectionKey}
      id={sectionKey}
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
            fallbackColor={THEME_COLORS.primary}
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
                <div className="flex w-full flex-col items-center justify-center rounded-md border border-dashed border-border/80 bg-muted/20 p-8 text-center">
                  <HelpCircle className="h-8 w-8 text-muted-foreground/60 mb-2" />
                  <p className="text-xs font-medium text-foreground">
                    No frequently asked questions added yet
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Add questions and answers in the FAQ form section.
                  </p>
                </div>
              ) : (
                items.map((item, idx) => {
                  const isOpen = openIndex === idx

                  return (
                    <div
                      key={`faq-item-${idx}`}
                      className="border-b border-[#222014]/10 pb-3 md:pb-4 transition-colors"
                    >
                      <button
                        type="button"
                        onClick={() => toggleFaq(idx)}
                        className="w-full text-left flex items-start justify-between gap-4 py-2 group cursor-pointer"
                      >
                        <div className="flex items-start gap-3">
                          <span className="font-mono text-xs font-semibold text-primary/70 mt-1">
                            {String(idx + 1).padStart(2, "0")}
                          </span>
                          <DynamicStyledTextPreview
                            as="h3"
                            data={item.question}
                            fallbackColor={THEME_COLORS.primary}
                            className="font-heading font-medium text-base md:text-lg lg:text-xl text-foreground group-hover:text-primary transition-colors text-left"
                          />
                        </div>
                        <span className="shrink-0 p-1 rounded-full text-muted-foreground group-hover:text-foreground transition-transform duration-300">
                          <ChevronDown
                            className={`h-4 w-4 transition-transform duration-300 ${
                              isOpen ? "rotate-180" : ""
                            }`}
                          />
                        </span>
                      </button>

                      {isOpen && (
                        <div className="pt-2 pb-3 pl-8 pr-4">
                          <DynamicStyledTextPreview
                            as="div"
                            data={item.answer}
                            fallbackColor={THEME_COLORS.muted}
                            isRichText={true}
                            className="text-xs md:text-sm leading-relaxed text-muted-foreground"
                          />
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

export default UniversalFaqPreview
