/* =====================================================
   TRAVELINSIGHTS — PREVIEW SECTION
   Auto-migrated from the legacy LocationPreview.tsx monolith.===================================================== */

import type { LocationData, GuideArticle } from "../../locationTypes"
import { getLocationBasics, FALLBACK_IMAGE } from "../../shared/previewBasics"
import { ArrowRight } from "lucide-react"
import { UniversalMultimediaPreview } from "../../../CMS/Home/shared/preview/UniversalMultimediaPreview"
import { fieldCssStyle } from "../../../CMS/shared/fieldStyle"

const DEFAULT_ARTICLES: GuideArticle[] = [
  {
    id: "1",
    number: "01",
    category: "CULTURE & TRADITION",
    title: "Mountain Hospitality and The Code of Besa",
    description:
      "Understanding the ancient Albanian customs and warm guest culture of the high valleys.",
    href: "#",
    buttons: [
      {
        label: "Read More",
        url: "#",
        style: "primary",
      },
    ],
    thumbnail:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "2",
    number: "02",
    category: "TREKKING GUIDE",
    title: "Essential Gear for the Accursed Mountains",
    description:
      "Pack list, navigation advice, and seasonal tips for walking between remote villages.",
    href: "#",
    buttons: [
      {
        label: "View Guide",
        url: "#",
        style: "primary",
      },
    ],
    thumbnail:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "3",
    number: "03",
    category: "GASTRONOMY",
    title: "Flia, Fresh Trout, and Mountain Cheeses",
    description:
      "What to eat in northern guesthouses and the rich seasonal food heritage.",
    href: "#",
    buttons: [
      {
        label: "Explore Food",
        url: "#",
        style: "primary",
      },
    ],
    thumbnail:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80",
  },
]

const DEFAULT_MAIN_IMAGE =
  "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80"

export type TravelInsightsPreviewProps = {
  draft: LocationData | null
}

export function TravelInsightsPreview({ draft }: TravelInsightsPreviewProps) {
  const { data } = getLocationBasics(draft)

  const travelInsights = data.travel_insights ?? {}
  const insightArticles =
    Array.isArray(travelInsights.articles) && travelInsights.articles.length > 0
      ? travelInsights.articles
      : DEFAULT_ARTICLES

  const background = (travelInsights as any)?.backgroundMultimedia
  const mainImage =
    travelInsights.mainImageMultimedia ||
    travelInsights.main_image ||
    DEFAULT_MAIN_IMAGE

  return (
    <section className="xlg:py-28 relative w-full overflow-hidden py-12 sm:py-16 md:py-20 lg:py-24 xl:py-[112px]">
      <UniversalMultimediaPreview
        multimedia={background}
        fallbackColor="#242220"
        mode="background"
        className="h-full w-full object-cover"
        containerClassName="absolute inset-0 z-0 pointer-events-none"
      />
      <div className="relative z-10 container mx-auto">
        <div className="mx-auto flex w-full max-w-[1520px] flex-col items-start justify-start px-4 sm:px-6 md:px-6 lg:px-6 xl:px-6">
          <div className="inline-flex items-center gap-3">
            <div className="h-px w-6 bg-[#c8956c] md:w-8" />
            <span
              className="text-xs tracking-[0.25em] text-[#c8956c]"
              style={fieldCssStyle((travelInsights as any).subHeadingStyle)}
            >
              {travelInsights.sub_heading || "TRAVEL INSIGHTS"}
            </span>
          </div>

          <div className="xlg:gap-16 mt-4 flex w-full flex-col-reverse items-center justify-between gap-10 sm:gap-12 md:mt-6 md:gap-14 lg:flex-row lg:items-start lg:gap-12 xl:gap-20">
            <div className="flex w-full max-w-[640px] flex-1 flex-col items-start justify-start xl:max-w-[660px]">
              <h2
                className="font-roboto max-w-[560px] text-[22px] font-medium whitespace-pre-line text-white sm:text-[26px] md:text-[28px] lg:text-[30px] xl:text-[32px]"
                style={fieldCssStyle((travelInsights as any).titleStyle)}
              >
                {travelInsights.title ||
                  "Everything you need to know before you go"}
              </h2>

              <div className="mt-6 flex w-full flex-col">
                {insightArticles.map((article: GuideArticle, idx: number) => {
                  const categoryLabel =
                    article.category ||
                    (article.description ? article.title : "Guide")
                  const headline = article.description || article.title
                  const itemKey =
                    article.id || article.number || `article-${idx}`
                  const buttons =
                    article.buttons && article.buttons.length > 0
                      ? article.buttons
                      : article.button
                        ? [article.button]
                        : []

                  return (
                    <div
                      key={itemKey}
                      className="group relative flex w-full items-start justify-between gap-4 overflow-hidden border-b border-white/10 py-4 transition-colors duration-300 first:pt-6 hover:border-white/25 sm:py-5 md:gap-6"
                    >
                      <span
                        className="relative z-10 shrink-0 text-sm font-medium text-[#c8956c] sm:text-base"
                        style={fieldCssStyle(article.numberStyle)}
                      >
                        {article.number || String(idx + 1).padStart(2, "0")}
                      </span>

                      <div className="relative z-10 flex flex-1 flex-col items-start justify-start gap-2 md:gap-3">
                        <span
                          className="text-xs font-semibold tracking-wider text-[#EAD9C9] uppercase sm:text-sm"
                          style={fieldCssStyle(article.categoryStyle)}
                        >
                          {categoryLabel}
                        </span>
                        <p
                          className="line-clamp-2 text-xs leading-5 font-normal text-[#F5F1E8] sm:leading-6 md:text-sm"
                          style={fieldCssStyle(
                            article.descriptionStyle || article.titleStyle
                          )}
                        >
                          {headline}
                        </p>

                        {buttons.length > 0 && (
                          <div className="mt-2 flex flex-wrap items-center gap-2">
                            {buttons.map((btn: any, bIdx: number) => {
                              const isPrimary = btn.style !== "outline"
                              return (
                                <a
                                  key={bIdx}
                                  href={btn.url || "#"}
                                  className={`inline-flex min-h-[32px] items-center justify-center rounded-full px-4 py-1.5 text-[10px] font-semibold tracking-[0.08em] uppercase transition-opacity hover:opacity-85 ${
                                    isPrimary
                                      ? "bg-[#c8956c] text-[#1A2E2A]"
                                      : "border border-[#c8956c] text-[#c8956c]"
                                  }`}
                                  style={{
                                    backgroundColor: isPrimary
                                      ? btn.backgroundColor || undefined
                                      : "transparent",
                                    color: btn.textColor || undefined,
                                    borderColor: !isPrimary
                                      ? btn.backgroundColor || undefined
                                      : undefined,
                                  }}
                                >
                                  {btn.label || "Read More"}
                                </a>
                              )
                            })}
                          </div>
                        )}
                      </div>

                      {(article.thumbnailMultimedia || article.thumbnail) && (
                        <div className="shrink-0 overflow-hidden rounded-xl">
                          <UniversalMultimediaPreview
                            multimedia={article.thumbnailMultimedia}
                            fallbackImageSrc={
                              article.thumbnail || FALLBACK_IMAGE
                            }
                            fallbackAlt={headline}
                            className="h-16 w-20 shrink-0 rounded-xl object-cover md:h-20 md:w-24"
                            containerClassName="h-16 w-20 shrink-0 overflow-hidden rounded-xl md:h-20 md:w-24"
                          />
                        </div>
                      )}

                      <ArrowRight className="h-4 w-4 shrink-0 text-white/70 transition-transform group-hover:translate-x-1 md:h-5 md:w-5" />
                    </div>
                  )
                })}
              </div>
            </div>

            {mainImage && (
              <div className="relative flex w-full shrink-0 justify-center lg:w-auto lg:justify-end">
                <div className="group xlg:w-[530px] xs:h-[380px] xlg:h-[530px] relative h-[340px] max-w-full overflow-hidden rounded-2xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] sm:h-[440px] md:h-[500px] md:w-[500px] lg:h-[440px] lg:w-[440px] xl:h-[671px] xl:w-[671px]">
                  {travelInsights.mainImageMultimedia ? (
                    <UniversalMultimediaPreview
                      multimedia={travelInsights.mainImageMultimedia}
                      fallbackImageSrc={
                        travelInsights.main_image || DEFAULT_MAIN_IMAGE
                      }
                      fallbackAlt={
                        travelInsights.title || "Featured Local Guide Article"
                      }
                      className="absolute inset-0 h-full w-full object-cover"
                      mode="background"
                      containerClassName="absolute inset-0"
                    />
                  ) : (
                    <img
                      src={travelInsights.main_image || DEFAULT_MAIN_IMAGE}
                      alt={
                        travelInsights.title || "Featured Local Guide Article"
                      }
                      className="absolute inset-0 h-full w-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = FALLBACK_IMAGE
                      }}
                    />
                  )}
                  <div
                    className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"
                    aria-hidden="true"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
