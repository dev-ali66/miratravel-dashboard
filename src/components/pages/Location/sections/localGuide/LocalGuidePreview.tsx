/* =====================================================
   LOCALGUIDE — PREVIEW SECTION
   Auto-migrated from the legacy LocationPreview.tsx monolith.===================================================== */

import type { LocationData, GuideArticle } from "../../locationTypes"
import { getLocationBasics, FALLBACK_IMAGE } from "../../shared/previewBasics"
import { ArrowRight } from "lucide-react"

export type LocalGuidePreviewProps = {
    draft: LocationData | null
}

export function LocalGuidePreview({
    draft,
}: LocalGuidePreviewProps) {
    const { data } = getLocationBasics(draft)

    const localGuide = data.local_guide ?? {}
    const localGuideArticles = Array.isArray(localGuide.articles)
        ? localGuide.articles
        : []

    return (
        <>
            {localGuideArticles.length > 0 && (
                <section className="bg-[#e9e7df]">
                    <div className="mx-auto max-w-[1400px] px-6 py-16 md:px-10 md:py-24">
                        <p className="text-[10px] tracking-[0.25em] text-neutral-400">
                            {localGuide.sub_heading || "LOCAL GUIDE ARTICLES"}
                        </p>

                        <div className="mt-5 flex flex-col justify-between gap-8 md:flex-row md:items-end">
                            <div>
                                <h2 className="text-4xl font-light md:text-6xl">
                                    {localGuide.title || "Everything you need to know"}
                                </h2>
                            </div>

                            {localGuide.main_image && (
                                <div className="hidden h-[180px] w-[300px] overflow-hidden rounded-2xl md:block">
                                    <img
                                        src={localGuide.main_image}
                                        alt={localGuide.title || "Local guide"}
                                        className="h-full w-full object-cover"
                                        onError={(e) => {
                                            e.currentTarget.src = FALLBACK_IMAGE
                                        }}
                                    />
                                </div>
                            )}
                        </div>

                        <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-4">
                            {localGuideArticles.map((article: GuideArticle, index: number) => (
                                <article
                                    key={article.id ?? article.title ?? index}
                                    className="group overflow-hidden rounded-2xl bg-white transition hover:-translate-y-1"
                                >
                                    {article.thumbnail && (
                                        <div className="h-[180px] overflow-hidden">
                                            <img
                                                src={article.thumbnail}
                                                alt={article.title || "Guide article"}
                                                className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                                                onError={(e) => {
                                                    e.currentTarget.src = FALLBACK_IMAGE
                                                }}
                                            />
                                        </div>
                                    )}

                                    <div className="p-6">
                                        <span className="text-[9px] tracking-[0.2em] text-neutral-400">
                                            {article.category || "GUIDE"}
                                        </span>

                                        <h3 className="mt-8 text-xl font-light leading-snug">
                                            {article.title || "Untitled article"}
                                        </h3>

                                        <div className="mt-8 flex items-center justify-between">
                                            <span className="text-[9px] text-neutral-400">
                                                ARTICLE
                                            </span>

                                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </>
    )
}
