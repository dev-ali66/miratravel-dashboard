/* =====================================================
   ACCOMMODATION — PREVIEW SECTION
   Auto-created from frontend layout for CMS preview.
===================================================== */

import type { LocationData } from "../../locationTypes"
import { FALLBACK_TEXT, FALLBACK_IMAGE, getLocationBasics } from "../../shared/previewBasics"
// MapPin intentionally unused in preview — removed import

export type AccommodationStaysPreviewProps = {
    draft: LocationData | null
}

export function AccommodationStaysPreview({ draft }: AccommodationStaysPreviewProps) {
    const { data } = getLocationBasics(draft)
    const accommodation = data.accommodation_stays ?? {}
    const badge = accommodation.badge ?? ""
    const title = accommodation.title ?? "Your Accommodation Journey"
    const description = accommodation.description ?? FALLBACK_TEXT
    const stays = Array.isArray(accommodation.stays) ? accommodation.stays : []

    if (stays.length === 0 && !title && !description && !badge) return null

    return (
        <section className="w-full xl:pt-12 lgx:pt-10 md:pt-8 pt-6 bg-white">
            <div className="container mx-auto px-6">
                <div className="flex flex-col gap-8 md:gap-12 max-w-[1216px] mr-auto">
                    {(badge || title || description) && (
                        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 md:gap-6 pb-6 md:pb-8">
                            <div className="flex flex-col xl:gap-4 lg:gap-3 gap-2.5 max-w-[515px]">
                                {badge && (
                                    <span className="text-gradient-2 text-sm md:text-[15px] xl:text-base font-semibold uppercase tracking-[2.8px] md:tracking-[3px] xl:tracking-[3.3px]">
                                        {badge}
                                    </span>
                                )}
                                {title && (
                                    <h2 className="text-para text-[30px] md:text-[36px] lgx:text-[40px] xl:text-[46px] font-medium font-roboto-serif">
                                        {title}
                                    </h2>
                                )}
                            </div>

                            {description && (
                                <p className="text-text-secondary text-sm md:text-[15px] xl:text-base font-normal max-w-[515px]">
                                    {description}
                                </p>
                            )}
                        </div>
                    )}

                    <div className="flex flex-col gap-6 lgx:gap-7 xl:gap-8">
                        {stays.map((stay: any, idx: number) => {
                            const stepLabel = stay.step || (stay.day ? `DAY ${stay.day}` : `0${idx + 1}`)
                            const durationLabel = stay.duration || (stay.nights ? `${stay.nights} ${typeof stay.nights === 'number' && stay.nights === 1 ? 'NIGHT' : 'NIGHTS'}` : '')
                            const locationTitle = stay.city || stay.location || ''
                            const staySubtitle = stay.subtitle || stay.stayType || ''
                            const confirmedText = stay.confirmedBy ? `Confirmed by ${stay.confirmedBy}` : (stay.confirmationBadge || '')

                            return (
                                <div key={stay.id ?? idx} className="w-full overflow-hidden border border-[#E8E8E8] bg-white grid grid-cols-1 lg:grid-cols-12">
                                    <div className="relative w-full min-h-[260px] sm:min-h-[300px] lg:min-h-[360px] lg:col-span-5 overflow-hidden">
                                        <img
                                            src={stay.image || FALLBACK_IMAGE}
                                            alt={locationTitle}
                                            className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                                        />
                                    </div>

                                    <div className="p-6 md:p-8 lgx:p-10 xl:p-12 lg:col-span-7 flex flex-col justify-between gap-6 bg-white">
                                        <div className="flex flex-col gap-3">
                                            <div className="flex items-center gap-4 text-[#A8825A] text-xs md:text-sm uppercase">
                                                <span className="text-[#7A7266]">{stepLabel}</span>
                                                {durationLabel && <span>{durationLabel}</span>}
                                            </div>

                                            <div>
                                                <h3 className="text-[#1A1814] text-2xl md:text-[26px] font-medium font-roboto-serif">{locationTitle}</h3>
                                                {staySubtitle && (
                                                    <span className="text-[#A8825A] text-xs md:text-sm font-medium uppercase block mt-2">{staySubtitle}</span>
                                                )}
                                            </div>

                                            <p className="text-[#7A7266] text-sm md:text-[15px] font-normal mt-4">{stay.description}</p>
                                        </div>

                                        <div className="pt-6 border-t border-[rgba(26,24,20,0.12)] flex items-center gap-2 text-gradient-2 text-xs md:text-sm font-medium uppercase">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0">
                                                <g clipPath="url(#clip_pin_icon)">
                                                    <path d="M8 9C9.65685 9 11 7.65685 11 6C11 4.34315 9.65685 3 8 3C6.34315 3 5 4.34315 5 6C5 7.65685 6.34315 9 8 9Z" stroke="#AF6348" strokeWidth="1.2" strokeLinecap="round" />
                                                    <path d="M8 1C5.2 1 3 3.2 3 6C3 10 8 15 8 15C8 15 13 10 13 6C13 3.2 10.8 1 8 1Z" stroke="#AF6348" strokeWidth="1.2" strokeLinecap="round" />
                                                </g>
                                                <defs>
                                                    <clipPath id="clip_pin_icon">
                                                        <rect width="16" height="16" fill="white" />
                                                    </clipPath>
                                                </defs>
                                            </svg>
                                            <span>{confirmedText}</span>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default AccommodationStaysPreview
