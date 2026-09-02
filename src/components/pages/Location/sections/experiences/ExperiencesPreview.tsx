/* =====================================================
   EXPERIENCES — PREVIEW SECTION
   Auto-migrated from the legacy LocationPreview.tsx monolith.===================================================== */

import type { LocationData } from "../../locationTypes"
import {
    getLocationBasics,
    FALLBACK_IMAGE,
    FALLBACK_TEXT,
} from "../../shared/previewBasics"
import { ArrowRight, MapPin } from "lucide-react"
import { useState } from "react"

export type ExperiencesPreviewProps = {
    draft: LocationData | null
}

export function ExperiencesPreview({ draft }: ExperiencesPreviewProps) {
    const { data, name } = getLocationBasics(draft)
    const experiences = data.experiences ?? {}
    const experienceCards = Array.isArray(experiences.cards) ? experiences.cards : []
    const featuredExperience = experiences.featured_experience ?? {}
    const seasonInfo = experiences.seasonInfo ?? experiences.footer?.note ?? ""
    const seasonLocation = experiences.seasonLocation ?? experiences.footer?.region ?? ""

    const [showAll, setShowAll] = useState(false)
    const visibleCards = showAll ? experienceCards : experienceCards.slice(0, 3)

    return (
        <section className="w-full bg-[#F1EEE5] xl:py-12 lgx:py-10 md:py-8 py-6">
            <div className="container mx-auto px-6">
                <div className="mx-auto flex w-full flex-col items-center">
                    {/* Header */}
                    <div className="flex w-full flex-col items-start self-stretch xl:gap-4 md:gap-3.5 gap-2.5">
                        <div className="self-stretch flex flex-col items-start">
                            <span className="text-[#C8956C] font-nunito-sans font-semibold text-sm md:text-[15px] xl:text-base xl:leading-4 leading-3 md:leading-3.5 tracking-[1.5px] md:tracking-[2px] xl:tracking-[2.64px] uppercase">
                                {experiences.location || name.toUpperCase()}
                            </span>
                        </div>

                        <div className="flex w-full flex-col items-start justify-between gap-4 lg:flex-row lg:items-end">
                            <h2 className="font-roboto-serif text-4xl md:text-6xl font-light text-[#1A2E2A]">
                                {experiences.title || "Experiences"}
                            </h2>

                            <p className="w-full text-sm md:text-[15px] xl:text-base font-normal xl:leading-[26px] md:leading-[22px] leading-[18px] text-[#6B7C6E] lg:w-[384px] lg:max-w-[384px]">
                                {experiences.description || FALLBACK_TEXT}
                            </p>
                        </div>

                        <div className="w-full self-stretch pt-6 md:pt-8 xl:pt-10">
                            <div className="h-px w-full bg-[rgba(26_46_42/12%)]" />
                        </div>
                    </div>

                    {/* Featured Experience Banner */}
                    {featuredExperience.image && (
                        <div className="w-full mt-6 sm:mt-8">
                            <div className="group relative flex min-h-[340px] md:min-h-[380px] lg:h-[400px] xl:h-[460px] w-full flex-col justify-end items-start overflow-hidden rounded-[8px] p-6 md:p-8 lgx:p-10 xl:p-12 bg-black text-white">
                                <img
                                    src={featuredExperience.image}
                                    alt={featuredExperience.title || "Featured Experience"}
                                    className="absolute inset-0 h-full w-full object-cover object-center"
                                    onError={(e) => {
                                        e.currentTarget.src = FALLBACK_IMAGE
                                    }}
                                />

                                <div className="absolute inset-0 bg-gradient-to-t from-[#0d221e]/85 via-[#1A2E2A]/40 to-transparent" aria-hidden="true" />

                                <div className="relative z-10 flex w-full max-w-[1088px] flex-col items-start">
                                    <div className="flex flex-wrap items-center gap-3 pb-3 sm:pb-4 text-[10px] font-semibold uppercase text-[#F5F0E8]">
                                        {featuredExperience.category && (
                                            <div className="inline-flex items-center rounded-full bg-[#1A4A40] xl:px-3 md:px-2.5 px-2 xl:py-1 lg:py-0.75 py-0.5">
                                                <span className="xl:text-[12px] md:text-[11px] text-[10px] font-semibold uppercase xl:leading-4 md:leading-3.5 leading-3 xl:tracking-[1.2px] md:tracking-[1px] tracking-[0.8px] text-[#F5F0E8]">{featuredExperience.category}</span>
                                            </div>
                                        )}

                                        {featuredExperience.duration && (
                                            <span className="font-nunito-sans xl:text-[12px] md:text-[11px] text-[10px] font-normal text-[#C8B89A]">{featuredExperience.duration}</span>
                                        )}
                                    </div>

                                    <h3 className="mt-3 text-3xl font-light md:text-5xl">{featuredExperience.title || "Featured Experience"}</h3>

                                    <p className="mt-3 w-full max-w-[576px] text-sm text-[#C8B89A]">{featuredExperience.subtitle || ""}</p>

                                    <div className="inline-flex items-center gap-2 mt-4 group/btn cursor-pointer transition-opacity duration-300 hover:opacity-90">
                                        <span className="text-center font-nunito-sans text-sm font-semibold leading-5 tracking-[0.35px] text-white">{featuredExperience.action_text || 'Meer info'}</span>
                                        <div className="relative flex h-4 w-4 shrink-0 items-center justify-center transition-transform duration-300 ease-out group-hover/btn:translate-x-1.5">
                                            <ArrowRight className="h-3 w-3 text-white" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Experience Cards Grid */}
                    {experienceCards.length > 0 && (
                        <div className="w-full pt-6 md:pt-8 lgx:pt-10 xl:pt-12">
                            <div className="grid w-full grid-cols-1 md:grid-cols-2 lgx:grid-cols-3 md:gap-8 lg:gap-4 gap-4 lgx:gap-6 xl:gap-8 justify-items-center">
                                {visibleCards.map((card: any, idx: number) => (
                                    <div key={card.id ?? card.title ?? idx} className="group relative flex w-full max-w-[536px] cursor-pointer flex-col items-start overflow-hidden rounded-[14px] bg-[#F1EEE5] border-[1px] border-[rgba(26_46_42/_12%)]">
                                        <div className="relative h-[240px] w-full overflow-hidden bg-[#FAF7F2]">
                                            <img src={card.image || FALLBACK_IMAGE} alt={card.title || 'Experience'} className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105" onError={(e) => { e.currentTarget.src = FALLBACK_IMAGE }} />
                                            {card.badge && (
                                                <div style={{ backgroundColor: card.badgeBg || '#2C5F8A' }} className="absolute left-3 top-3 z-20 inline-flex items-center rounded-full px-2.5 py-1 shadow-sm">
                                                    <span className="text-xs font-semibold uppercase leading-4 tracking-wider text-stone-100">{card.badge}</span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex w-full flex-col items-start gap-[11px] md:p-5 p-4">
                                            <div className="flex w-full items-start justify-between gap-2">
                                                <h4 className="font-roboto-serif xl:text-[20px] md:text-[18px] text-base font-medium text-primary transition-colors duration-300 group-hover:text-black">{card.title}</h4>
                                                {card.price && <div className="pt-1 shrink-0 text-[#C8956C]">{card.price}</div>}
                                            </div>

                                            {card.subtitle && <p className="text-[12px] font-normal leading-4 tracking-[0.3px] text-[#6B7C6E]">{card.subtitle}</p>}

                                            {card.description && <p className="pt-1 text-[12.5px] font-normal leading-6 text-[rgba(26,46,42,0.80)]">{card.description}</p>}

                                            <div className="flex w-full items-center justify-between border-t border-[rgba(26,46,42,0.12)] pt-3">
                                                <span className="text-[12px] font-normal leading-4 text-[#6B7C6E]">{card.price}</span>
                                                <button type="button" className="inline-flex items-center gap-1 text-[#C8956C] font-semibold text-xs">
                                                    <span>{card.action_text || 'MORE INFO'}</span>
                                                    <ArrowRight className="h-3 w-3" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {experienceCards.length > 3 && (
                                <div className="xl:mt-8 mt-5 md:mt-7 xl:mb-12 md:mb-10 mb-8 flex w-full justify-center">
                                    <button onClick={() => setShowAll((s) => !s)} type="button" className="group relative flex h-[46px] md:h-[50px] xl:h-[54px] bg-gradient-to-r from-[#8C4730] to-[#6B3B2A] items-center justify-center gap-2 overflow-hidden rounded-[2px] border border-white/30 px-4 py-2 text-sm font-semibold w-[210px] text-white">
                                        <span className="relative z-10">{showAll ? 'Show Less' : experiences.load_more_button || 'Load More'}</span>
                                    </button>
                                </div>
                            )}

                            {/* Bottom Season Information Bar */}
                            {(seasonInfo || seasonLocation) && (
                                <div className="xl:pt-8 md:pt-7 pt-5 flex w-full flex-col items-start justify-between gap-4 border-t border-[rgba(26,46,42,0.12)] text-sm text-[#6B7C6E] sm:flex-row sm:items-center">
                                    <p className="text-[13px] md:text-sm leading-[19.5px] text-[#6B7C6E] max-w-[448px]">{seasonInfo}</p>

                                    {seasonLocation && (
                                        <div className="inline-flex items-center gap-1.5 text-xs font-semibold leading-4 text-[#C8956C]">
                                            <MapPin className="h-3 w-3" />
                                            <span>{seasonLocation}</span>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </section>
    )
}
