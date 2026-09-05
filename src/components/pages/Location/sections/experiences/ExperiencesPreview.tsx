/* =====================================================
   EXPERIENCES — PREVIEW SECTION
   Phase 2 migration: featured_experience.image and
   cards[i].image now use UniversalMultimediaPreview with
   legacy image as fallback. Layout unchanged.
===================================================== */

import type { LocationData } from "../../locationTypes"
import {
  getLocationBasics,
  FALLBACK_IMAGE,
  FALLBACK_TEXT,
} from "../../shared/previewBasics"
import { ArrowRight, MapPin } from "lucide-react"
import { useState } from "react"
import { UniversalMultimediaPreview } from "../../../CMS/Home/shared/preview/UniversalMultimediaPreview"
import { fieldCssStyle } from "../../../CMS/shared/fieldStyle"

export type ExperiencesPreviewProps = {
  draft: LocationData | null
}

export function ExperiencesPreview({ draft }: ExperiencesPreviewProps) {
  const { data, name } = getLocationBasics(draft)
  const experiences = data.experiences ?? {}
  const experienceCards = Array.isArray(experiences.cards)
    ? experiences.cards
    : []
  const featuredExperience = experiences.featured_experience ?? {}
  const seasonInfo = experiences.seasonInfo ?? experiences.footer?.note ?? ""
  const seasonLocation =
    experiences.seasonLocation ?? experiences.footer?.region ?? ""

  const [showAll, setShowAll] = useState(false)
  const visibleCards = showAll ? experienceCards : experienceCards.slice(0, 3)
  const background = (experiences as any)?.backgroundMultimedia

  return (
    <section className="lgx:py-10 relative w-full overflow-hidden py-6 md:py-8 xl:py-12">
      <UniversalMultimediaPreview
        multimedia={background}
        fallbackColor="#F1EEE5"
        mode="background"
        className="h-full w-full object-cover"
        containerClassName="absolute inset-0 z-0 pointer-events-none"
      />
      <div className="relative z-10 container mx-auto px-6">
        <div className="mx-auto flex w-full flex-col items-center">
          {/* Header */}
          <div className="flex w-full flex-col items-start gap-2.5 self-stretch md:gap-3.5 xl:gap-4">
            <div className="flex flex-col items-start self-stretch">
              <span
                className="font-nunito-sans text-sm leading-3 font-semibold tracking-[1.5px] text-[#C8956C] uppercase md:text-[15px] md:leading-3.5 md:tracking-[2px] xl:text-base xl:leading-4 xl:tracking-[2.64px]"
                style={fieldCssStyle((experiences as any).locationStyle)}
              >
                {experiences.location || name.toUpperCase()}
              </span>
            </div>

            <div className="flex w-full flex-col items-start justify-between gap-4 lg:flex-row lg:items-end">
              <h2
                className="font-roboto-serif text-4xl font-light text-[#1A2E2A] md:text-6xl"
                style={fieldCssStyle((experiences as any).titleStyle)}
              >
                {experiences.title || "Experiences"}
              </h2>

              <p
                className="w-full text-sm leading-[18px] font-normal text-[#6B7C6E] md:text-[15px] md:leading-[22px] lg:w-[384px] lg:max-w-[384px] xl:text-base xl:leading-[26px]"
                style={fieldCssStyle((experiences as any).descriptionStyle)}
              >
                {experiences.description || FALLBACK_TEXT}
              </p>
            </div>

            <div className="w-full self-stretch pt-6 md:pt-8 xl:pt-10">
              <div className="h-px w-full bg-[rgba(26_46_42/12%)]" />
            </div>
          </div>

          {/* Featured Experience Banner */}
          {(featuredExperience.imageMultimedia || featuredExperience.image) && (
            <div className="mt-6 w-full sm:mt-8">
              <div className="group lgx:p-10 relative flex min-h-[340px] w-full flex-col items-start justify-end overflow-hidden rounded-[8px] bg-black p-6 text-white md:min-h-[380px] md:p-8 lg:h-[400px] xl:h-[460px] xl:p-12">
                {featuredExperience.imageMultimedia ? (
                  <UniversalMultimediaPreview
                    multimedia={featuredExperience.imageMultimedia}
                    fallbackImageSrc={
                      featuredExperience.image || FALLBACK_IMAGE
                    }
                    fallbackAlt={
                      featuredExperience.title || "Featured Experience"
                    }
                    mode="background"
                    className="absolute inset-0 h-full w-full object-cover object-center"
                    containerClassName="absolute inset-0"
                  />
                ) : (
                  <img
                    src={featuredExperience.image || FALLBACK_IMAGE}
                    alt={featuredExperience.title || "Featured Experience"}
                    className="absolute inset-0 h-full w-full object-cover object-center"
                    onError={(e) => {
                      e.currentTarget.src = FALLBACK_IMAGE
                    }}
                  />
                )}

                <div
                  className="absolute inset-0 bg-gradient-to-t from-[#0d221e]/85 via-[#1A2E2A]/40 to-transparent"
                  aria-hidden="true"
                />

                <div className="relative z-10 flex w-full max-w-[1088px] flex-col items-start">
                  <div className="flex flex-wrap items-center gap-3 pb-3 text-[10px] font-semibold text-[#F5F0E8] uppercase sm:pb-4">
                    {featuredExperience.category && (
                      <div className="inline-flex items-center rounded-full bg-[#1A4A40] px-2 py-0.5 md:px-2.5 lg:py-0.75 xl:px-3 xl:py-1">
                        <span className="text-[10px] leading-3 font-semibold tracking-[0.8px] text-[#F5F0E8] uppercase md:text-[11px] md:leading-3.5 md:tracking-[1px] xl:text-[12px] xl:leading-4 xl:tracking-[1.2px]">
                          {featuredExperience.category}
                        </span>
                      </div>
                    )}

                    {featuredExperience.duration && (
                      <span className="font-nunito-sans text-[10px] font-normal text-[#C8B89A] md:text-[11px] xl:text-[12px]">
                        {featuredExperience.duration}
                      </span>
                    )}
                  </div>

                  <h3 className="mt-3 text-3xl font-light md:text-5xl">
                    {featuredExperience.title || "Featured Experience"}
                  </h3>

                  <p className="mt-3 w-full max-w-[576px] text-sm text-[#C8B89A]">
                    {featuredExperience.subtitle || ""}
                  </p>

                  {(() => {
                    const featuredButtons: any[] = Array.isArray(
                      (featuredExperience as any).buttons
                    )
                      ? (featuredExperience as any).buttons
                      : (featuredExperience as any).button?.label ||
                          featuredExperience.action_text
                        ? [
                            {
                              label:
                                (featuredExperience as any).button?.label ||
                                featuredExperience.action_text ||
                                "Meer info",
                              url:
                                (featuredExperience as any).button?.url || "#",
                              style:
                                (featuredExperience as any).button?.style ||
                                "primary",
                              backgroundColor:
                                (featuredExperience as any).button
                                  ?.backgroundColor || "transparent",
                              textColor:
                                (featuredExperience as any).button?.textColor ||
                                "#FFFFFF",
                            },
                          ]
                        : []

                    if (featuredButtons.length === 0) return null

                    return (
                      <div className="mt-5 flex flex-row flex-wrap items-center gap-3">
                        {featuredButtons.map((btn: any, idx: number) => {
                          const isPrimary =
                            !btn.style || btn.style === "primary"
                          const defaultBg = isPrimary
                            ? btn.backgroundColor || "transparent"
                            : "transparent"
                          const defaultText = btn.textColor || "#FFFFFF"
                          const defaultBorder = isPrimary
                            ? "none"
                            : "1px solid rgba(255, 255, 255, 0.4)"

                          return (
                            <a
                              key={`${btn.label || "btn"}-${idx}`}
                              href={btn.url || "#"}
                              className="group/btn inline-flex min-h-[38px] items-center gap-2 rounded-full px-5 text-xs font-semibold tracking-[0.08em] uppercase transition hover:opacity-85 md:min-h-[42px]"
                              style={{
                                backgroundColor:
                                  btn.backgroundColor || defaultBg,
                                color: defaultText,
                                border: btn.backgroundColor
                                  ? "none"
                                  : defaultBorder,
                              }}
                            >
                              <span className="font-nunito-sans tracking-[0.35px]">
                                {btn.label || "Meer info"}
                              </span>
                              <div className="relative flex h-3.5 w-3.5 shrink-0 items-center justify-center transition-transform duration-300 ease-out group-hover/btn:translate-x-1.5">
                                <ArrowRight className="h-3.5 w-3.5" />
                              </div>
                            </a>
                          )
                        })}
                      </div>
                    )
                  })()}
                </div>
              </div>
            </div>
          )}

          {/* Experience Cards Grid */}
          {experienceCards.length > 0 && (
            <div className="w-full pt-6 md:pt-8 xl:pt-12">
              <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {visibleCards.map((card: any, idx: number) => (
                  <div
                    key={card.id ?? card.title ?? idx}
                    className="group relative flex w-full cursor-pointer flex-col items-start overflow-hidden rounded-[14px] border-[1px] border-[rgba(26_46_42/_12%)] bg-[#F1EEE5]"
                  >
                    <div className="relative h-[240px] w-full overflow-hidden bg-[#FAF7F2]">
                      {card.imageMultimedia ? (
                        <UniversalMultimediaPreview
                          multimedia={card.imageMultimedia}
                          fallbackImageSrc={card.image || FALLBACK_IMAGE}
                          fallbackAlt={card.title || "Experience"}
                          className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                        />
                      ) : (
                        <img
                          src={card.image || FALLBACK_IMAGE}
                          alt={card.title || "Experience"}
                          className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                          onError={(e) => {
                            e.currentTarget.src = FALLBACK_IMAGE
                          }}
                        />
                      )}
                      {card.badge && (
                        <div
                          style={{ backgroundColor: card.badgeBg || "#2C5F8A" }}
                          className="absolute top-3 left-3 z-20 inline-flex items-center rounded-full px-2.5 py-1 shadow-sm"
                        >
                          <span className="text-xs leading-4 font-semibold tracking-wider text-stone-100 uppercase">
                            {card.badge}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex w-full flex-col items-start gap-[11px] p-4 md:p-5">
                      <div className="flex w-full items-start justify-between gap-2">
                        <h4 className="font-roboto-serif text-base font-medium text-primary transition-colors duration-300 group-hover:text-black md:text-[18px] xl:text-[20px]">
                          {card.title}
                        </h4>
                        {card.price && (
                          <div className="shrink-0 pt-1 text-[#C8956C]">
                            {card.price}
                          </div>
                        )}
                      </div>

                      {card.subtitle && (
                        <p className="text-[12px] leading-4 font-normal tracking-[0.3px] text-[#6B7C6E]">
                          {card.subtitle}
                        </p>
                      )}

                      {card.description && (
                        <p className="pt-1 text-[12.5px] leading-6 font-normal text-[rgba(26,46,42,0.80)]">
                          {card.description}
                        </p>
                      )}

                      <div className="flex w-full items-center justify-between border-t border-[rgba(26,46,42,0.12)] pt-3">
                        <span className="text-[12px] leading-4 font-normal text-[#6B7C6E]">
                          {card.price}
                        </span>
                        {(() => {
                          const cardButtons: any[] = Array.isArray(card.buttons)
                            ? card.buttons
                            : card.button?.label || card.action_text
                              ? [
                                  {
                                    label:
                                      card.button?.label ||
                                      card.action_text ||
                                      "MORE INFO",
                                    url: card.button?.url || "#",
                                    style: card.button?.style || "primary",
                                    backgroundColor:
                                      card.button?.backgroundColor ||
                                      "transparent",
                                    textColor:
                                      card.button?.textColor || "#C8956C",
                                  },
                                ]
                              : []

                          if (cardButtons.length === 0) {
                            return null
                          }

                          return (
                            <div className="flex flex-row flex-wrap items-center gap-2">
                              {cardButtons.map((btn: any, bIdx: number) => {
                                const isPrimary =
                                  !btn.style || btn.style === "primary"
                                const defaultBg = isPrimary
                                  ? btn.backgroundColor || "transparent"
                                  : "transparent"
                                const defaultText = btn.textColor || "#C8956C"
                                const defaultBorder = isPrimary
                                  ? "none"
                                  : "1px solid #C8956C"

                                return (
                                  <a
                                    key={`${btn.label || "btn"}-${bIdx}`}
                                    href={btn.url || "#"}
                                    onClick={(e) => {
                                      if (!btn.url || btn.url === "#") {
                                        e.preventDefault()
                                      }
                                    }}
                                    className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold uppercase transition hover:opacity-80"
                                    style={{
                                      backgroundColor:
                                        btn.backgroundColor || defaultBg,
                                      color: defaultText,
                                      border: btn.backgroundColor
                                        ? "none"
                                        : defaultBorder,
                                    }}
                                  >
                                    <span>{btn.label || "MORE INFO"}</span>
                                    <ArrowRight className="h-3 w-3" />
                                  </a>
                                )
                              })}
                            </div>
                          )
                        })()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {(() => {
                const rawButtons: any[] = Array.isArray(
                  (experiences as any).buttons
                )
                  ? (experiences as any).buttons
                  : (experiences as any).loadMoreButton?.label ||
                      experiences.load_more_button
                    ? [
                        {
                          label:
                            (experiences as any).loadMoreButton?.label ||
                            experiences.load_more_button ||
                            "Load More",
                          url: (experiences as any).loadMoreButton?.url || "#",
                          style:
                            (experiences as any).loadMoreButton?.style ||
                            "primary",
                          backgroundColor:
                            (experiences as any).loadMoreButton
                              ?.backgroundColor || "#8C4730",
                          textColor:
                            (experiences as any).loadMoreButton?.textColor ||
                            "#FFFFFF",
                        },
                      ]
                    : []

                if (rawButtons.length === 0 && experienceCards.length <= 3) {
                  return null
                }

                return (
                  <div className="mt-5 mb-8 flex w-full flex-row flex-wrap items-center justify-center gap-3 md:mt-7 md:mb-10 xl:mt-8 xl:mb-12">
                    {rawButtons.length > 0 ? (
                      rawButtons.map((btn: any, idx: number) => {
                        const isPrimary = !btn.style || btn.style === "primary"
                        const defaultBg = isPrimary ? "#8C4730" : "transparent"
                        const defaultText = isPrimary ? "#FFFFFF" : "#8C4730"
                        const defaultBorder = isPrimary
                          ? "none"
                          : "1px solid #8C4730"

                        const labelText =
                          idx === 0 && experienceCards.length > 3 && showAll
                            ? "Show Less"
                            : btn.label || "Load More"

                        return (
                          <button
                            key={`${btn.label || "btn"}-${idx}`}
                            onClick={() => {
                              if (idx === 0 && experienceCards.length > 3) {
                                setShowAll((s) => !s)
                              } else if (btn.url && btn.url !== "#") {
                                window.open(btn.url, "_blank")
                              }
                            }}
                            type="button"
                            className="inline-flex min-h-[42px] min-w-[170px] items-center justify-center gap-2 rounded-full px-6 text-xs font-semibold tracking-[0.08em] uppercase transition hover:opacity-85 md:min-h-[46px]"
                            style={{
                              backgroundColor: btn.backgroundColor || defaultBg,
                              color: btn.textColor || defaultText,
                              border: btn.backgroundColor
                                ? "none"
                                : defaultBorder,
                            }}
                          >
                            <span>{labelText}</span>
                          </button>
                        )
                      })
                    ) : (
                      <button
                        onClick={() => setShowAll((s) => !s)}
                        type="button"
                        className="inline-flex min-h-[42px] min-w-[170px] items-center justify-center gap-2 rounded-full bg-[#8C4730] px-6 text-xs font-semibold tracking-[0.08em] text-white uppercase transition hover:opacity-85 md:min-h-[46px]"
                      >
                        <span>{showAll ? "Show Less" : "Load More"}</span>
                      </button>
                    )}
                  </div>
                )
              })()}

              {/* Bottom Season Information Bar */}
              {(seasonInfo || seasonLocation) && (
                <div className="flex w-full flex-col items-start justify-between gap-4 border-t border-[rgba(26,46,42,0.12)] pt-5 text-sm text-[#6B7C6E] sm:flex-row sm:items-center md:pt-7 xl:pt-8">
                  <p
                    className="max-w-[448px] text-[13px] leading-[19.5px] text-[#6B7C6E] md:text-sm"
                    style={fieldCssStyle(
                      (experiences as any).footer?.noteStyle ??
                        (experiences as any).seasonInfoStyle
                    )}
                  >
                    {seasonInfo}
                  </p>

                  {seasonLocation && (
                    <div
                      className="inline-flex items-center gap-1.5 text-xs leading-4 font-semibold text-[#C8956C]"
                      style={fieldCssStyle(
                        (experiences as any).footer?.regionStyle ??
                          (experiences as any).seasonLocationStyle
                      )}
                    >
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
