import { motion } from "framer-motion"
import { DynamicStyledTextPreview } from "@/components/pages/CMS/shared/DynamicStyledTextPreview"
import { UniversalMultimediaPreview } from "@/components/pages/CMS/Home/shared/preview/UniversalMultimediaPreview"
import type { LocationPreviewSectionProps } from "../../config/locationSections"
import type { TravelInsightArticle } from "../../locationTypes"
import { BookOpen, ImageIcon } from "lucide-react"

export function TravelInsightsPreview({ draft }: LocationPreviewSectionProps) {
  const travelInsight =
    draft?.travelInsight ||
    (draft as any)?.data?.travelInsight ||
    (draft as any)?.travel_insights ||
    (draft as any)?.data?.travel_insights || {
      label: null,
      title: null,
      featuredMultimedia: null,
      backgroundMultimedia: null,
      articles: [],
    }

  const articles: TravelInsightArticle[] = Array.isArray(travelInsight.articles)
    ? travelInsight.articles
    : []

  const featuredImgUrl =
    travelInsight.featuredMultimedia?.image?.url ||
    travelInsight.featuredMultimedia?.imageData?.url ||
    (travelInsight.featuredMultimedia?.show === "image"
      ? travelInsight.featuredMultimedia?.image?.url || travelInsight.featuredMultimedia?.imageData?.url
      : "") ||
    (typeof travelInsight.featuredMultimedia === "string" ? travelInsight.featuredMultimedia : "") ||
    travelInsight.featuredImage ||
    ""

  const featuredImgAlt =
    travelInsight.featuredMultimedia?.image?.alt ||
    travelInsight.featuredMultimedia?.imageData?.alt ||
    travelInsight.featuredImageAlt ||
    "Featured Local Guide Article"

  return (
    <section
      data-section="travel-insights"
      className="relative w-full overflow-hidden bg-[#182d09] pt-[60px] @xs:pt-[70px] @sm:pt-[80px] @md:pt-[95px] @lg:pt-[110px] @lgx:pt-[115px] @xlg:pt-[120px] @mid:pt-[135px] @xl:pt-[145px] pb-[60px] @xs:pb-[70px] @sm:pb-[80px] @md:pb-[95px] @lg:pb-[110px] @lgx:pb-[115px] @xlg:pb-[120px] @mid:pb-[135px] @xl:pb-[145px]"
    >
      {/* Background Media (Color / Image / Video) */}
      <UniversalMultimediaPreview
        multimedia={travelInsight.backgroundMultimedia}
        fallbackColor="#182d09"
        mode="background"
      />

      <div
        id="guide-articles"
        className="relative z-10 w-full scroll-mt-24 container mx-auto px-4 @xs:px-5 @sm:px-6 @lg:px-8 @xl:px-0"
        style={{ perspective: "1200px" }}
      >
        <div className="w-full">
          <div className="mx-auto flex max-w-full @md:max-w-[720px] @lg:max-w-[944.6px] @lgx:max-w-[1028.8px] @xlg:max-w-[1169.1px] @mid:max-w-[1309.5px] @xl:max-w-[1520px] flex-col items-start justify-start">
            {/* Top Eyebrow Label with Accent Line */}
            <div className="inline-flex items-center gap-3">
              <div
                className="h-px w-6 @md:w-8 @lg:w-9 @xl:w-10 bg-accent shrink-0"
                style={{ backgroundColor: "#af6348" }}
              />
              <DynamicStyledTextPreview
                as="span"
                data={travelInsight.label}
                fallbackColor="#af6348"
                className="text-accent [text-shadow:-1px_-1px_0_#000,1px_-1px_0_#000,-1px_1px_0_#000,1px_1px_0_#000] text-[16px] @md:text-[20px] @lg:text-[21px] @lgx:text-[22px] @xlg:text-[23px] @mid:text-[23.5px] @xl:text-[24px] leading-[22px] @md:leading-[27px] @lg:leading-[28px] @lgx:leading-[29px] @xlg:leading-[30px] @mid:leading-[31px] @xl:leading-8 tracking-[0.9px] @md:tracking-[1.17px] @lg:tracking-[1.22px] @lgx:tracking-[1.28px] @xlg:tracking-[1.34px] @mid:tracking-[1.37px] @xl:tracking-[1.4px] font-medium uppercase"
              />
            </div>

            {/* Main 2-Column Content Layout */}
            <div className="mt-3 @md:mt-4 flex w-full flex-col-reverse @lg:flex-row items-start justify-between gap-9 @md:gap-14 @lg:gap-12 @lgx:gap-[54px] @xlg:gap-16 @mid:gap-[70px] @xl:gap-20">
              {/* Left Column: Title & Articles List */}
              <div className="flex w-full flex-1 max-w-[640px] @lg:max-w-[644px] @lgx:max-w-[648px] @xlg:max-w-[652px] @mid:max-w-[656px] @xl:max-w-[660px] flex-col items-start justify-start">
                {/* Section Title */}
                <DynamicStyledTextPreview
                  as="h3"
                  data={travelInsight.title}
                  fallbackColor="#e5e5e5"
                  className="text-2xl tracking-normal leading-8 @md:text-4xl @md:tracking-[0.5px] @md:leading-10 @lg:text-[36px] @lg:tracking-[1px] @lg:leading-[42px] @lgx:text-[38px] @lgx:leading-[44px] @xlg:text-[38px] @xlg:tracking-[1.5px] @xlg:leading-[46px] @mid:text-[40px] @mid:tracking-[2px] @mid:leading-[48px] @xl:text-[40px] @xl:tracking-[2px] @xl:leading-[48px] font-heading font-medium text-neutral-200"
                />

                {/* Articles List */}
                <div className="flex w-full flex-col mt-2">
                  {articles.length === 0 ? (
                    <div className="mt-6 flex w-full flex-col items-center justify-center rounded-xl border border-dashed border-neutral-700 bg-neutral-900/40 p-8 text-center backdrop-blur-sm">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-800 text-neutral-400 mb-2">
                        <BookOpen className="h-5 w-5 opacity-80" />
                      </div>
                      <p className="text-xs font-medium text-neutral-300">
                        No guide articles added yet
                      </p>
                      <p className="text-[11px] text-neutral-400 mt-0.5">
                        Add articles in the Travel Insights form section.
                      </p>
                    </div>
                  ) : (
                    articles.map((article, idx) => {
                      const itemKey = `article-${idx}`
                      const firstBtn = Array.isArray(article.buttons) && article.buttons.length > 0 ? article.buttons[0] : (article.button || null)
                      const itemHref = firstBtn?.url || article.href || "#"
                      const displayNum = String(idx + 1).padStart(2, "0")
                      const thumbUrl =
                        (article.thumbnailMultimedia as any)?.image?.url ||
                        (article.thumbnailMultimedia as any)?.imageData?.url ||
                        (typeof article.thumbnailMultimedia === "string"
                          ? article.thumbnailMultimedia
                          : "") ||
                        article.thumbnail ||
                        ""

                      return (
                        <div
                          key={itemKey}
                          className="group relative flex w-full items-start justify-between gap-3.5 @md:gap-6 overflow-hidden border-b border-neutral-100/10 py-4 @md:py-6 @xl:py-7 first:pt-6 first:@md:mt-8 first:@xl:mt-8 transition-colors duration-300 hover:border-neutral-100/25"
                        >
                          {/* Stretched link */}
                          <a
                            href={itemHref}
                            className="absolute inset-0 z-20 outline-none focus-visible:ring-1 focus-visible:ring-accent-muted"
                            aria-label={
                              typeof article.title === "object"
                                ? (article.title as any)?.value || "Article"
                                : article.title || "Article"
                            }
                          />

                          {/* Sliding accent panel */}
                          <span
                            aria-hidden="true"
                            className="absolute inset-y-0 left-0 w-full -translate-x-full bg-neutral-100/[0.04] transition-transform duration-700 delay-200 ease-out group-hover:translate-x-0"
                          />

                          {/* Number Indicator */}
                          <span
                            className="relative z-10 text-sm @md:text-[15px] @lg:text-[15.3px] @lgx:text-[15.4px] @xlg:text-[15.6px] @mid:text-[15.7px] @xl:text-base leading-3 @md:leading-[14.6px] @lg:leading-[14.6px] @lgx:leading-[14.8px] @xlg:leading-[15.1px] @mid:leading-[15.5px] @xl:leading-4 text-accent-muted transition-transform duration-300 group-hover:translate-x-1 font-mono"
                            style={{ color: "#af6348" }}
                          >
                            {displayNum}
                          </span>

                          {/* Content (Category & Title) */}
                          <div className="relative z-10 flex flex-1 flex-col items-start justify-start gap-2 @md:gap-3 transition-transform duration-300 group-hover:translate-x-1 min-w-0">
                            <DynamicStyledTextPreview
                              as="span"
                              data={article.category}
                              fallbackColor="#af6348"
                              className="text-sm @md:text-[15px] @lg:text-[15.3px] @lgx:text-[15.4px] @xlg:text-[15.6px] @mid:text-[15.7px] @xl:text-base leading-3 @md:leading-[14.6px] @lg:leading-[14.6px] @lgx:leading-[14.8px] @xlg:leading-[15.1px] @mid:leading-[15.5px] @xl:leading-4 uppercase tracking-[0.3px] text-accent font-heading font-medium"
                            />

                            <DynamicStyledTextPreview
                              as="p"
                              data={article.title}
                              fallbackColor="#d4d4d4"
                              className="text-xs @md:text-[13px] @lg:text-[13.3px] @lgx:text-[13.4px] @xlg:text-[13.6px] @mid:text-[13.7px] @xl:text-sm font-normal leading-4 @md:leading-[18px] @lg:leading-[18.6px] @lgx:leading-[18.8px] @xlg:leading-[19.1px] @mid:leading-[19.5px] @xl:leading-5 text-neutral-300 transition-colors duration-200 group-hover:text-neutral-100 line-clamp-2"
                            />
                          </div>

                          {/* Thumbnail Preview */}
                          <div className="relative z-10 size-10 @md:size-12 @lg:size-[50px] @lgx:size-[51px] @xlg:size-[52px] @mid:size-[54px] @xl:size-14 shrink-0 overflow-hidden rounded-xs bg-neutral-900/60 border border-neutral-700/40">
                            {thumbUrl ? (
                              <>
                                <img
                                  src={thumbUrl}
                                  alt=""
                                  loading="lazy"
                                  className="h-full w-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/15" />
                              </>
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-neutral-500">
                                <ImageIcon className="h-4 w-4 opacity-50" />
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    })
                  )}
                </div>
              </div>

              {/* Right Column: Featured Image / Media Card */}
              <div className="relative flex w-full flex-col items-center @lg:items-end justify-center @lg:justify-end @lg:w-auto shrink-0">
                {/* Section Description above Featured Image */}
                {travelInsight.description && (
                  <div className="w-full max-w-[300px] @md:max-w-[500px] @lg:max-w-[440px] @lgx:max-w-[474px] @xlg:max-w-[530px] @mid:max-w-[586px] @xl:max-w-[671px] mb-3">
                    <DynamicStyledTextPreview
                      as="p"
                      data={travelInsight.description}
                      fallbackColor="#d4d4d4"
                      className="text-xs @md:text-sm @xl:text-base font-normal leading-relaxed text-neutral-300 text-left @lg:text-right"
                    />
                  </div>
                )}

                <div className="relative flex-shrink-0 overflow-hidden w-[300px] @md:w-[500px] @lg:w-[440px] @lgx:w-[474px] @xlg:w-[530px] @mid:w-[586px] @xl:w-[671px] h-[300px] @md:h-[500px] @lg:h-[440px] @lgx:h-[474px] @xlg:h-[530px] @mid:h-[586px] @xl:h-[671px] max-w-full aspect-square cursor-pointer rounded-xs overflow-hidden group border border-neutral-800/60 bg-neutral-900/40">
                  {featuredImgUrl ? (
                    <div className="absolute inset-0 overflow-hidden">
                      <motion.img
                        src={featuredImgUrl}
                        alt={featuredImgAlt}
                        loading="lazy"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="h-full w-full object-cover object-center"
                      />
                      <div className="absolute inset-0 bg-black/10 transition-colors duration-300 group-hover:bg-black/0" />
                    </div>
                  ) : travelInsight.featuredMultimedia ? (
                    <UniversalMultimediaPreview
                      multimedia={travelInsight.featuredMultimedia}
                      fallbackColor="#182d09"
                      mode="inline"
                    />
                  ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center p-8 text-center text-neutral-400 bg-neutral-900/60">
                      <ImageIcon className="h-12 w-12 stroke-[1.5] text-neutral-500 mb-3" />
                      <p className="text-sm font-medium text-neutral-300">
                        Featured Guide Image
                      </p>
                      <p className="text-xs text-neutral-500 mt-1">
                        Upload or select a featured image in the form
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default TravelInsightsPreview
