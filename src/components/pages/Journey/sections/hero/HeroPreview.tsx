import React from "react"
import { THEME_COLORS } from "@/config/theme"
import { UniversalMultimediaPreview } from "@/components/pages/CMS/Home/shared/preview/UniversalMultimediaPreview"
import { DynamicStyledTextPreview } from "@/components/pages/CMS/shared/DynamicStyledTextPreview"

const SIGNATURE_LABEL_IMG = "/images/singnature-label.png"

import {
  MiraCollectionBadge,
  WishlistHeartButton,
  TagBadgePill,
} from "@/components/pages/CMS/shared/HeroBadges"

export function HeroPreview({ hero, draft }: { hero?: any; draft?: any }) {
  const heroData = hero || draft?.hero || {}
  const rawLabel = heroData.label || draft?.label
  const rawTitle = heroData.title || draft?.title

  const titleVal = typeof rawTitle === "object" ? rawTitle?.value : rawTitle
  const displayTitle = titleVal || "Classic Albania & The Ionian Coast"

  const journeyTypes: string[] = Array.isArray(draft?.journeyType)
    ? draft.journeyType
    : Array.isArray(heroData?.journeyType)
      ? heroData.journeyType
      : draft?.journeyType
        ? [String(draft.journeyType)]
        : heroData?.journeyType
          ? [String(heroData.journeyType)]
          : []

  const isSignature = journeyTypes.some((jt) => /signature/i.test(jt))

  const resolveBadgeText = () => {
    if (journeyTypes.some((jt) => /collection/i.test(jt))) {
      return "THE MIRA COLLECTION"
    }
    if (journeyTypes.some((jt) => /signature/i.test(jt))) {
      return "SIGNATURE JOURNEY"
    }
    if (journeyTypes.length > 0 && journeyTypes[0]) {
      const typeStr = journeyTypes[0].replace(/[\s_-]+/g, " ").toUpperCase().trim()
      if (typeStr === "NORMAL") return "NORMAL"
      return typeStr
    }
    return "THE MIRA COLLECTION"
  }

  const badgeText = resolveBadgeText()

  const heroMultimedia =
    heroData.backgroundMultimedia ||
    draft?.backgroundMultimedia ||
    draft?.hero?.backgroundMultimedia

  const getArray = (val: any): string[] => {
    if (!val) return []
    if (Array.isArray(val)) return val
    if (typeof val === "string") return [val]
    return []
  }

  const rawTravelStyles = getArray(draft?.travelStyle ?? heroData?.travelStyle)
  const rawPerfectFor = getArray(draft?.perfectFor ?? heroData?.perfectFor)
  const rawPace = draft?.pace ?? heroData?.pace
  const rawComfortLevel = draft?.comfortLevel ?? heroData?.comfortLevel
  const explicitTags = getArray(draft?.tags ?? heroData?.tags)

  const allTagSources = [
    ...explicitTags,
    ...rawTravelStyles,
    ...rawPerfectFor,
    rawPace ? `${rawPace} PACE` : null,
    rawComfortLevel ? String(rawComfortLevel).replace(/_/g, " ") : null,
  ].filter(Boolean) as string[]

  const resolvedTags = Array.from(
    new Set(allTagSources.map((t) => String(t).replace(/_/g, " ").toUpperCase().trim()))
  ).filter(Boolean)

  const displayTags = resolvedTags.length > 0 ? resolvedTags : ["NATURE", "MOUNTAINS"]

  return (
    <section className="relative flex min-h-[600px] md:h-[680px] lg:h-[700px] xl:h-[725px] w-full items-end overflow-hidden">
      <UniversalMultimediaPreview
        multimedia={heroMultimedia ?? undefined}
        mode="background"
        className="h-full w-full object-cover object-center"
        containerClassName="absolute inset-0 z-0 h-full w-full"
      />

      <div
        className="absolute inset-0 z-10 bg-[linear-gradient(180deg,rgba(193,203,206,0.30)_0%,rgba(28,28,28,0.30)_100%)] pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative z-20 w-full xl:pb-[80px] lg:pb-[70px] md:pb-[60px] sm:pb-[48px] pb-[36px] xl:pl-[136px] lg:pl-[96px] md:pl-[56px] sm:pl-[36px] pl-[20px] xl:pr-[136px] lg:pr-[96px] md:pr-[56px] sm:pr-[36px] pr-[20px]">
        <div className="flex w-full max-w-[680px] flex-col items-start gap-4 sm:gap-5">
          {/* Top Badge & Heart Action */}
          <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
            {isSignature ? (
              <img
                src={SIGNATURE_LABEL_IMG}
                alt="Signature Journey"
                className="w-[155px] md:w-[200px] xlg:w-[215px] mid:w-[230px] xl:w-[245px] h-auto shrink-0 aspect-[35/4] object-contain drop-shadow-sm select-none"
              />
            ) : (
              <MiraCollectionBadge text={badgeText} />
            )}

            <WishlistHeartButton />
          </div>

          {/* Heading Title */}
          <DynamicStyledTextPreview
            as="h1"
            data={rawTitle}
            fallbackText="Classic Albania & The Ionian Coast"
            fallbackColor={THEME_COLORS.white}
            className="font-heading xl:text-[72px] mid:text-[68px] lgx:text-[64px] lg:text-[60px] md:text-[52px] text-[32px] font-[600] capitalize xl:leading-[92px] mid:leading-[88px] lgx:leading-[84px] lg:leading-[80px] md:leading-[66px] leading-[42px] text-neutral-200 drop-shadow-xs"
          />

          {/* Tag Badges (First 2 tags, 1:1 frontend TagBadge styling) */}
          {displayTags && displayTags.length > 0 && (
            <div className="inline-flex flex-wrap justify-start items-center gap-2 md:gap-2.5">
              {displayTags.slice(0, 2).map((tag, idx) => (
                <TagBadgePill key={idx} label={tag} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

