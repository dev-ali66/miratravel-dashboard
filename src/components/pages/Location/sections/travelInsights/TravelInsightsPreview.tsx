/* =====================================================
   TRAVELINSIGHTS — PREVIEW SECTION
   Auto-migrated from the legacy LocationPreview.tsx monolith.===================================================== */

import type { LocationData, GuideArticle } from "../../locationTypes"
import { getLocationBasics, FALLBACK_IMAGE } from "../../shared/previewBasics"
import { ArrowRight } from "lucide-react"

export type TravelInsightsPreviewProps = {
    draft: LocationData | null
}

export function TravelInsightsPreview({
    draft,
}: TravelInsightsPreviewProps) {
    const { data } = getLocationBasics(draft)

    const travelInsights = data.travel_insights ?? {}
    const insightArticles = Array.isArray(travelInsights.articles)
        ? travelInsights.articles
        : []

    if (insightArticles.length === 0) return null

    return (
        <section className="w-full bg-primary py-12 sm:py-16 md:py-20 lg:py-24 xlg:py-28 xl:py-[112px]">
            <div className="container mx-auto">
                <div className="mx-auto flex w-full max-w-[1520px] flex-col items-start justify-start px-4 sm:px-6 md:px-6 lg:px-6 xl:px-6">
                    <div className="inline-flex items-center gap-3">
                        <div className="h-px w-6 md:w-8 bg-[#c8956c]" />
                        <span className="text-xs tracking-[0.25em] text-[#c8956c]">
                            {travelInsights.sub_heading || 'TRAVEL INSIGHTS'}
                        </span>
                    </div>

                    <div className="mt-4 md:mt-6 flex w-full flex-col-reverse lg:flex-row items-center lg:items-start justify-between gap-10 sm:gap-12 md:gap-14 lg:gap-12 xlg:gap-16 xl:gap-20">
                        <div className="flex w-full flex-1 max-w-[640px] xl:max-w-[660px] flex-col items-start justify-start">
                            <h2 className="font-roboto text-[22px] sm:text-[26px] md:text-[28px] lg:text-[30px] xl:text-[32px] font-medium text-white max-w-[560px] whitespace-pre-line">
                                {travelInsights.title || 'Everything you need to know before you go'}
                            </h2>

                            <div className="flex w-full flex-col mt-6">
                                {insightArticles.map((article: GuideArticle, idx: number) => {
                                    const categoryLabel = article.category || (article.description ? article.title : 'Guide')
                                    const headline = article.description || article.title
                                    const itemKey = article.id || article.number || `article-${idx}`

                                    return (
                                        <div key={itemKey} className="group relative flex w-full items-start justify-between gap-4 md:gap-6 overflow-hidden border-b border-white/10 py-4 sm:py-5 first:pt-6 transition-colors duration-300 hover:border-white/25">
                                            <span className="relative z-10 shrink-0 text-sm sm:text-base font-medium text-[#c8956c]">
                                                {article.number || String(idx + 1).padStart(2, '0')}
                                            </span>

                                            <div className="relative z-10 flex flex-1 flex-col items-start justify-start gap-2 md:gap-3">
                                                <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#EAD9C9]">{categoryLabel}</span>
                                                <p className="text-xs md:text-sm font-normal leading-5 sm:leading-6 text-[#F5F1E8] line-clamp-2">{headline}</p>
                                            </div>

                                            {article.thumbnail && (
                                                <img src={article.thumbnail} alt={headline} className="h-16 w-20 shrink-0 rounded-xl object-cover md:h-20 md:w-24" onError={(e) => { e.currentTarget.src = FALLBACK_IMAGE }} />
                                            )}

                                            <ArrowRight className="h-4 w-4 shrink-0 text-white/70 transition-transform group-hover:translate-x-1 md:h-5 md:w-5" />
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                        {travelInsights.main_image && (
                            <div className="relative flex w-full justify-center lg:justify-end lg:w-auto shrink-0">
                                <div className="group relative md:w-[500px] lg:w-[440px] xlg:w-[530px] xl:w-[671px] h-[340px] xs:h-[380px] sm:h-[440px] md:h-[500px] lg:h-[440px] xlg:h-[530px] xl:h-[671px] max-w-full overflow-hidden rounded-2xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)]">
                                    <img src={travelInsights.main_image} alt={travelInsights.title || 'Featured Local Guide Article'} className="absolute inset-0 h-full w-full object-cover" onError={(e) => { e.currentTarget.src = FALLBACK_IMAGE }} />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" aria-hidden="true" />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    )
}
