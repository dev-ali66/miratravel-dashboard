/* =====================================================
   ACCOMMODATION — PREVIEW SECTION
   Auto-created from frontend layout for CMS preview.
===================================================== */

import type { LocationData } from "../../locationTypes"
import {
  FALLBACK_TEXT,
  FALLBACK_IMAGE,
  getLocationBasics,
} from "../../shared/previewBasics"
import { UniversalMultimediaPreview } from "../../../CMS/Home/shared/preview/UniversalMultimediaPreview"
import { fieldCssStyle } from "../../../CMS/shared/fieldStyle"

export type AccommodationStaysPreviewProps = {
  draft: LocationData | null
}

export function AccommodationStaysPreview({
  draft,
}: AccommodationStaysPreviewProps) {
  const { data } = getLocationBasics(draft)
  const accommodation = data.accommodation_stays ?? {}
  const badge = accommodation.badge ?? ""
  const title = accommodation.title ?? "Your Accommodation Journey"
  const description = accommodation.description ?? FALLBACK_TEXT
  const stays = Array.isArray(accommodation.stays) ? accommodation.stays : []

  if (stays.length === 0 && !title && !description && !badge) return null

  const background = (accommodation as any)?.backgroundMultimedia

  return (
    <section
      className="lgx:pt-10 relative w-full overflow-hidden pt-6 pb-12 md:pt-8 md:pb-16 xl:pt-12 xl:pb-24"
      style={{ backgroundColor: background?.color || undefined }}
    >
      <UniversalMultimediaPreview
        multimedia={background}
        fallbackColor={background?.color || "#F7F6F2"}
        mode="background"
        className="h-full w-full object-cover"
        containerClassName="absolute inset-0 z-0 pointer-events-none"
      />
      <div className="relative z-10 container mx-auto px-6">
        <div className="mr-auto flex max-w-[1216px] flex-col gap-8 md:gap-12">
          {(badge || title || description) && (
            <div className="flex flex-col justify-between gap-4 pb-6 md:gap-6 md:pb-8 lg:flex-row lg:items-end">
              <div className="flex max-w-[515px] flex-col gap-2.5 lg:gap-3 xl:gap-4">
                {badge && (
                  <span
                    className="text-gradient-2 text-sm font-semibold tracking-[2.8px] uppercase md:text-[15px] md:tracking-[3px] xl:text-base xl:tracking-[3.3px]"
                    style={fieldCssStyle((accommodation as any).badgeStyle)}
                  >
                    {badge}
                  </span>
                )}
                {title && (
                  <h2
                    className="text-para lgx:text-[40px] font-roboto-serif text-[30px] font-medium md:text-[36px] xl:text-[46px]"
                    style={fieldCssStyle((accommodation as any).titleStyle)}
                  >
                    {title}
                  </h2>
                )}
              </div>

              {description && (
                <p
                  className="text-text-secondary max-w-[515px] text-sm font-normal md:text-[15px] xl:text-base"
                  style={fieldCssStyle((accommodation as any).descriptionStyle)}
                >
                  {description}
                </p>
              )}
            </div>
          )}

          {stays.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#DED9D2] bg-white/70 p-12 text-center shadow-sm backdrop-blur-sm">
              <p className="text-base font-medium text-[#7A7266]">
                No accommodation stays added yet.
              </p>
              <p className="mt-1 text-xs text-[#A8825A]">
                Add stays in the Accommodation editor to preview your journey
                hotels and lodges.
              </p>
            </div>
          ) : (
            <div className="lgx:gap-7 flex flex-col gap-6 xl:gap-8">
              {stays.map((stay: any, idx: number) => {
                const stepLabel =
                  stay.step || (stay.day ? `DAY ${stay.day}` : `0${idx + 1}`)
                const durationLabel =
                  stay.duration ||
                  (stay.nights
                    ? `${stay.nights} ${typeof stay.nights === "number" && stay.nights === 1 ? "NIGHT" : "NIGHTS"}`
                    : "")
                const locationTitle = stay.city || stay.location || ""
                const staySubtitle = stay.subtitle || stay.stayType || ""
                const confirmedText = stay.confirmedBy
                  ? `Confirmed by ${stay.confirmedBy}`
                  : stay.confirmationBadge || ""
                const buttons = Array.isArray(stay.buttons) ? stay.buttons : []

                return (
                  <div
                    key={stay.id ?? idx}
                    className="group grid w-full grid-cols-1 overflow-hidden border border-[#E8E8E8] bg-white shadow-sm transition-shadow hover:shadow-md lg:grid-cols-12"
                  >
                    <div className="relative min-h-[260px] w-full overflow-hidden sm:min-h-[300px] lg:col-span-5 lg:min-h-[360px]">
                      <UniversalMultimediaPreview
                        multimedia={stay.imageMultimedia}
                        fallbackImageSrc={stay.image || FALLBACK_IMAGE}
                        fallbackAlt={locationTitle || "Stay"}
                        mode="background"
                        className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                        containerClassName="absolute inset-0"
                      />
                    </div>

                    <div className="lgx:p-10 flex flex-col justify-between gap-6 bg-white p-6 md:p-8 lg:col-span-7 xl:p-12">
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-4 text-xs font-semibold text-[#A8825A] uppercase md:text-sm">
                          <span
                            className="text-[#7A7266]"
                            style={fieldCssStyle(stay.stepStyle)}
                          >
                            {stepLabel}
                          </span>
                          {durationLabel && (
                            <span style={fieldCssStyle(stay.durationStyle)}>
                              {durationLabel}
                            </span>
                          )}
                        </div>

                        <div>
                          <h3
                            className="font-roboto-serif text-2xl font-medium text-[#1A1814] md:text-[26px]"
                            style={fieldCssStyle(
                              stay.cityStyle ?? stay.locationStyle
                            )}
                          >
                            {locationTitle}
                          </h3>
                          {staySubtitle && (
                            <span
                              className="mt-2 block text-xs font-medium text-[#A8825A] uppercase md:text-sm"
                              style={fieldCssStyle(
                                stay.subtitleStyle ?? stay.stayTypeStyle
                              )}
                            >
                              {staySubtitle}
                            </span>
                          )}
                        </div>

                        {stay.description && (
                          <p
                            className="mt-4 text-sm leading-relaxed font-normal text-[#7A7266] md:text-[15px]"
                            style={fieldCssStyle(stay.descriptionStyle)}
                          >
                            {stay.description}
                          </p>
                        )}

                        {buttons.length > 0 && (
                          <div className="mt-4 flex flex-wrap items-center gap-3">
                            {buttons.map((btn: any, bIdx: number) => {
                              const isPrimary = btn.style !== "outline"
                              return (
                                <a
                                  key={bIdx}
                                  href={btn.url || "#"}
                                  className={`inline-flex items-center gap-2 rounded-full px-5 py-2 text-xs font-semibold tracking-wider uppercase transition-all duration-300 ${
                                    isPrimary
                                      ? "bg-[#AF6348] text-white hover:bg-[#8F4E38]"
                                      : "border border-[#AF6348] text-[#AF6348] hover:bg-[#AF6348] hover:text-white"
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
                                  <span>{btn.label || "View Stay"}</span>
                                </a>
                              )
                            })}
                          </div>
                        )}
                      </div>

                      {confirmedText && (
                        <div
                          className="text-gradient-2 flex items-center gap-2 border-t border-[rgba(26,24,20,0.12)] pt-6 text-xs font-medium uppercase md:text-sm"
                          style={fieldCssStyle(stay.confirmedStyle)}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="none"
                            className="shrink-0"
                          >
                            <g clipPath="url(#clip_pin_icon)">
                              <path
                                d="M8 9C9.65685 9 11 7.65685 11 6C11 4.34315 9.65685 3 8 3C6.34315 3 5 4.34315 5 6C5 7.65685 6.34315 9 8 9Z"
                                stroke="#AF6348"
                                strokeWidth="1.2"
                                strokeLinecap="round"
                              />
                              <path
                                d="M8 1C5.2 1 3 3.2 3 6C3 10 8 15 8 15C8 15 13 10 13 6C13 3.2 10.8 1 8 1Z"
                                stroke="#AF6348"
                                strokeWidth="1.2"
                                strokeLinecap="round"
                              />
                            </g>
                            <defs>
                              <clipPath id="clip_pin_icon">
                                <rect width="16" height="16" fill="white" />
                              </clipPath>
                            </defs>
                          </svg>
                          <span>{confirmedText}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default AccommodationStaysPreview
