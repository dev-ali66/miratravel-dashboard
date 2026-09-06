/* =====================================================
   JOURNEYS — OVERVIEW HERO PREVIEW
   100% Pixel-Perfect Match with frontend/components/journey-overview/overview-hero.tsx
   & frontend/components/journey-overview/overview-card.tsx
   Uses UniversalMultimediaPreview Single Source of Truth
===================================================== */

import { motion } from "framer-motion"
import { UniversalMultimediaPreview } from "@/components/pages/CMS/Home/shared/preview/UniversalMultimediaPreview"
import { fieldCssStyle, type FieldStyleValue } from "@/components/pages/CMS/shared/fieldStyle"
import type { CmsButton } from "@/components/pages/CMS/shared/ButtonsField"
import { cn } from "@/lib/utils"
import { TagBadge } from "./TagBadge"
import { overviewHeroData } from "./journeyStaticData"
import type { Journey } from "../journeyTypes"

const CARD_OVERLAP_PX = 170

function getHeroTextStyle(
  style?: FieldStyleValue,
  fallbackColor?: string
): React.CSSProperties {
  const css = fieldCssStyle(style, fallbackColor) as React.CSSProperties
  if (
    css.backgroundColor &&
    css.backgroundColor !== "transparent" &&
    css.backgroundColor !== "#00000000"
  ) {
    return {
      ...css,
      display: "inline-block",
      padding: "0.35rem 0.85rem",
      borderRadius: "0.5rem",
      width: "fit-content",
    }
  }
  return css
}

const numberWords: Record<number, string> = {
  1: "per",
  2: "two",
  3: "three",
  4: "four",
  5: "five",
  6: "six",
  7: "seven",
  8: "eight",
  9: "nine",
  10: "ten",
}

function formatPriceSuffix(val: unknown): string {
  if (typeof val === "string" && isNaN(Number(val)) && val.trim() !== "") {
    return val
  }
  const n = Number(val) || 1
  if (n <= 1) {
    return "per person"
  }
  const word = numberWords[n] || String(n)
  return `${word} persons`
}

function formatOccupancyText(val: unknown): string {
  if (typeof val === "string" && isNaN(Number(val)) && val.trim() !== "") {
    return val
  }
  const n = Number(val) || 1
  if (n === 1) return "Based on single occupancy"
  if (n === 2) return "Based on double occupancy"
  if (n === 3) return "Based on triple occupancy"
  const word = numberWords[n] || String(n)
  return `Based on ${word} persons occupancy`
}

export function OverviewHeroPreview({ draft }: { draft: Journey }) {
  const hero = ((draft.data?.hero as any) || {}) as Record<string, any>
  const title =
    hero.title !== undefined && hero.title !== ""
      ? hero.title
      : overviewHeroData.title
  const subtitle =
    hero.subtitle !== undefined
      ? hero.subtitle
      : "A curated 7-day luxury expedition across jagged alpine peaks, Ottoman citadel heritage, and turquoise coastal fjords."
  const titleStyle = hero.titleStyle as FieldStyleValue | undefined
  const subtitleStyle = hero.subtitleStyle as FieldStyleValue | undefined

  // Person Count & Dynamic Suffix/Occupancy
  const personCount =
    hero.personCount !== undefined
      ? hero.personCount
      : hero.priceSuffix !== undefined
      ? hero.priceSuffix
      : 1

  const priceSuffix = formatPriceSuffix(personCount)
  const occupancyText = hero.occupancyText || formatOccupancyText(personCount)

  // Format Dynamic Pricing & Currency
  const priceNum = Number(draft.price ?? 0)
  const currencySymbol =
    draft.currency === "USD"
      ? "$"
    : draft.currency === "GBP"
    ? "£"
    : "€"
  const formattedPrice =
    priceNum > 0
      ? `${currencySymbol}${priceNum.toLocaleString()}`
      : overviewHeroData.price

  // Format Dynamic Days
  const daysText =
    draft.minDays && draft.maxDays
      ? draft.minDays === draft.maxDays
        ? `${draft.minDays} Days`
        : `${draft.minDays}-${draft.maxDays} Days`
      : draft.minDays
      ? `${draft.minDays} Days`
      : "7-10 Days"

  // Format Dynamic Trip Pace
  const paceFormatted = draft.pace
    ? draft.pace.charAt(0) + draft.pace.slice(1).toLowerCase()
    : "Balanced"

  // Format Dynamic Comfort Level
  const comfortFormatted = draft.comfortLevel
    ? draft.comfortLevel
        .replace(/_/g, " ")
        .toLowerCase()
        .replace(/\b\w/g, (c) => c.toUpperCase())
    : "Boutique"

  const tags = draft.journeyType?.length
    ? [...draft.journeyType, ...(draft.travelStyle || [])]
    : [daysText, `${paceFormatted} Pace`, comfortFormatted, ...overviewHeroData.tags]

  const heroBackground =
    (hero as any)?.backgroundMultimedia ||
    (draft.journeyHeroImage?.[0]
      ? { type: "image", url: draft.journeyHeroImage[0], alt: title }
      : {
          type: "video",
          url: overviewHeroData.videoSrc,
          alt: title,
        })

  const taxesLabel = (hero as any).taxesLabel || overviewHeroData.taxesLabel
  const taxesValue = (hero as any).taxesValue || overviewHeroData.taxesValue
  const benefitsList: string[] = (hero as any).benefits?.length ? (hero as any).benefits : overviewHeroData.benefits

  const rawButtons = Array.isArray(hero.buttons) ? (hero.buttons as CmsButton[]) : []
  const heroButtons: CmsButton[] =
    rawButtons.length > 0
      ? rawButtons
      : [
          {
            label: "Request This Journey",
            url: "#request",
            style: "primary",
            backgroundColor: "#235347",
            textColor: "#FFFFFF",
          },
          {
            label: "Questions on this journey?",
            url: "/contact-us",
            style: "link",
            textColor: "#464136",
          },
          {
            label: "Contact our travel experts",
            url: "/contact-us",
            style: "link",
            textColor: "#af6348",
          },
        ]

  // Floating Overview Card matching frontend/components/journey-overview/overview-card.tsx
  const overviewCard = (
    <div className="flex md:w-[390px] flex-col items-center justify-center xl:gap-6 gap-3 md:gap-4 rounded-[10px] border border-[#D8CBB8] bg-white p-8 shadow-[0_3px_33.3px_0_rgba(0,0,0,0.05)]">
      {/* Price Block */}
      <div className="flex w-full flex-col items-start xl:gap-2.5 md:gap-2 gap-1.5">
        <div className="flex items-baseline gap-2">
          <span className="text-xl md:text-2xl lgx:text-3xl xl:text-[32px] font-semibold tracking-[1.5px] md:tracking-[1.8px] xl:tracking-[2px] text-[#080c1d] xl:leading-10 lgx:leading-9 leading-7">
            {formattedPrice}
          </span>
          <span className="xl:text-sm md:text-[13px] text-[12px] font-normal text-[#464136] xl:leading-5 leading-4">
            / {priceSuffix}
          </span>
        </div>
        <p className="xl:text-sm md:text-[13px] text-[12px] font-normal text-[#464136] xl:leading-5 leading-4">
          {occupancyText} • {daysText} • {paceFormatted} • {comfortFormatted}
        </p>
      </div>

      <div className="flex flex-col items-start xl:gap-6 gap-4 md:gap-5 w-full">
        {/* Taxes & Fees Row */}
        <div className="flex w-full border-t border-[#D8CBB8] xl:pt-[17px] pt-3 items-start justify-between self-stretch text-sm font-normal text-[#464136] xl:h-[69px] h-[61px] md:h-[63px]">
          <span>{taxesLabel}</span>
          <span className="font-medium text-[#080c1d]">{taxesValue}</span>
        </div>

        {/* Dynamic Buttons from ButtonsField */}
        <div className="flex w-full flex-col items-center gap-2.5">
          {heroButtons.map((btn, idx) => {
            const isLink = btn.style === "link"
            const isOutline = btn.style === "outline"
            const isSecondary = btn.style === "secondary"

            if (isLink) {
              const isPrompt = btn.label.includes("?")
              return (
                <div
                  key={idx}
                  className={cn(
                    "flex flex-col justify-center items-center self-stretch text-center",
                    idx === 1 && "pt-1"
                  )}
                >
                  <a
                    href={btn.url || "#"}
                    className={cn(
                      "xl:text-sm md:text-[13px] text-[12px] transition-colors hover:opacity-80",
                      isPrompt
                        ? "font-normal no-underline"
                        : "font-semibold underline underline-offset-2"
                    )}
                    style={{
                      color: btn.textColor || (isPrompt ? "#464136" : "#af6348"),
                    }}
                  >
                    {btn.label}
                  </a>
                </div>
              )
            }

            return (
              <a
                key={idx}
                href={btn.url || "#"}
                className="w-full rounded-[4px] font-semibold py-3.5 px-6 text-sm tracking-wider uppercase transition shadow-sm text-center flex items-center justify-center cursor-pointer hover:opacity-90"
                style={{
                  backgroundColor: isOutline
                    ? "transparent"
                    : btn.backgroundColor || (isSecondary ? "#af6348" : "#235347"),
                  color:
                    btn.textColor ||
                    (isOutline ? btn.backgroundColor || "#235347" : "#ffffff"),
                  border: isOutline
                    ? `1px solid ${btn.backgroundColor || "#235347"}`
                    : "none",
                }}
              >
                {btn.label}
              </a>
            )
          })}
        </div>

        {/* Benefits List */}
        <ul className="flex w-full flex-col items-start pt-[14px] md:pt-4 xl:pt-[25px] xl:gap-3 md:gap-2.5 gap-2 border-t border-[#D8CBB8] self-stretch">
          {benefitsList.map((benefit, idx) => (
            <li
              key={idx}
              className="flex items-start gap-[6px] xl:text-sm md:text-[13px] text-[12px] font-normal text-[#464136]"
            >
              <span className="text-[#af6348] font-bold">✓</span>
              <span>{benefit}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )

  return (
    <div className="relative w-full">
      <section className="relative flex min-h-[600px] md:h-[680px] lg:h-[700px] xl:h-[725px] w-full items-end overflow-hidden">
        {/* Universal Multimedia Background */}
        <UniversalMultimediaPreview
          multimedia={heroBackground}
          fallbackImageSrc="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1800&q=80"
          fallbackAlt={title}
          fallbackColor="#080c1d"
          mode="background"
          className="h-full w-full object-cover object-center"
          containerClassName="absolute inset-0 z-0"
        />

        {/* Background Overlay matching frontend: linear-gradient(180deg,rgba(193,203,206,0.30)_0%,rgba(28,28,28,0.30)_100%) */}
        {heroBackground?.overlay !== false && (
          <div
            className="absolute inset-0 bg-[linear-gradient(180deg,rgba(193,203,206,0.30)_0%,rgba(28,28,28,0.30)_100%)] z-1"
            aria-hidden="true"
          />
        )}

        {/* Hero Title, Subtitle & Badges */}
        <div className="relative z-10 w-full xl:pb-[80px] lg:pb-[70px] md:pb-[60px] sm:pb-[48px] pb-[36px] xl:pl-[136px] lg:pl-[96px] md:pl-[56px] sm:pl-[36px] pl-[20px] xl:pr-[136px] lg:pr-[96px] md:pr-[56px] sm:pr-[36px] pr-[20px]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex w-full max-w-[680px] flex-col items-start gap-4 sm:gap-5"
          >
            <h1
              className="text-[32px] md:text-[36px] lgx:text-[44px] xl:text-5xl font-heading font-bold text-neutral-100 leading-[51.7px] md:leading-[53.7px] lgx:leading-[55.7px] xl:leading-[57.6px]"
              style={getHeroTextStyle(titleStyle)}
            >
              {title}
            </h1>

            {subtitle && (
              <p
                className="text-sm sm:text-base md:text-lg font-light text-neutral-200 leading-relaxed max-w-[640px] whitespace-pre-line"
                style={getHeroTextStyle(subtitleStyle)}
              >
                {subtitle}
              </p>
            )}

            {tags && tags.length > 0 && (
              <div className="inline-flex flex-wrap justify-start items-center gap-2 sm:gap-2.5">
                {tags.map((tag, idx) => (
                  <TagBadge key={idx} tag={tag} />
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Mobile/Tablet Overview Card */}
      <div className="px-4 pt-6 md:px-9 lg:pt-8 xlg:hidden">
        <div className="mx-auto max-w-[412px]">{overviewCard}</div>
      </div>

      {/* Desktop Floating Overview Card overlapping hero bottom */}
      <div
        className="hidden xlg:block xlg:absolute right-6 xl:right-[136px] z-40"
        style={{ bottom: `-${CARD_OVERLAP_PX}px` }}
      >
        {overviewCard}
      </div>
    </div>
  )
}
