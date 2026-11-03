import React from "react"
import { THEME_COLORS } from "@/config/theme"
import { UniversalMultimediaPreview } from "@/components/pages/CMS/shared/UniversalMultimediaPreview"
import { DynamicStyledTextPreview } from "@/components/pages/CMS/shared/DynamicStyledTextPreview"
import { DynamicCmsButtonPreview } from "@/components/pages/CMS/shared/DynamicCmsButtonPreview"
import {
  MiraCollectionBadge,
  WishlistHeartButton,
  TagBadgePill,
} from "@/components/pages/CMS/shared/HeroBadges"
import type { StoryPreviewProps } from "../../config/storySections"

const SIGNATURE_LABEL_IMG = "/images/singnature-label.png"

export function HeroPreview({ story }: StoryPreviewProps) {
  const hero = story?.hero || {}
  const rawTitle = hero.title || story?.title
  const rawSubtitle = hero.subtitle
  const rawDescription = hero.description
  const rawBreadcrumb = hero.breadcrumb

  const titleVal = typeof rawTitle === "object" ? rawTitle?.value : rawTitle
  const displayTitle = titleVal || "Stories from the Balkans"

  const isSignature = Boolean(
    (typeof hero.label === "string" && /signature/i.test(hero.label)) ||
    (story?.label && /signature/i.test(String(story.label))) ||
    (story?.type && /signature/i.test(String(story.type))) ||
    (displayTitle && /signature/i.test(displayTitle))
  )

  const resolveBadgeText = () => {
    if (typeof hero.label === "string" && hero.label.trim()) {
      return hero.label.toUpperCase().trim()
    }
    if (hero.label && typeof hero.label === "object" && hero.label.value && typeof hero.label.value === "string") {
      return hero.label.value.toUpperCase().trim()
    }
    if (story?.type) {
      const typeStr = String(story.type).toLowerCase()
      if (typeStr === "travel_essentials" || typeStr === "travel_ease") return "TRAVEL ESSENTIALS"
      if (typeStr === "mira_editorial") return "MIRA EDITORIAL"
      if (typeStr === "normal_story") return "NORMAL STORY"
      return String(story.type).replace(/[\s_-]+/g, " ").toUpperCase().trim()
    }
    if (Array.isArray(story?.categories) && story.categories.length > 0 && story.categories[0]) {
      return String(story.categories[0]).toUpperCase().trim()
    }
    if (story?.category) {
      return String(story.category).toUpperCase().trim()
    }
    return "THE MIRA COLLECTION"
  }

  const badgeText = resolveBadgeText()

  const heroMultimedia =
    hero.backgroundMultimedia ||
    story?.backgroundMultimedia

  // Resolve Category / Metadata tags
  const getArray = (val: any): string[] => {
    if (!val) return []
    if (Array.isArray(val)) return val
    if (typeof val === "string") return [val]
    return []
  }

  const categories = getArray(story?.categories || story?.category)
  const explicitTags = getArray(story?.tags || hero?.tags)
  const readTime = story?.readTime ? `${String(story.readTime).replace(/min.*$/i, "").trim()} MIN READ` : null
  const author = story?.authorName ? `BY ${String(story.authorName).toUpperCase()}` : null

  const allTagSources = [
    ...categories,
    ...explicitTags,
    readTime,
    author,
  ].filter(Boolean) as string[]

  const resolvedTags = Array.from(
    new Set(allTagSources.map((t) => String(t).replace(/_/g, " ").toUpperCase().trim()))
  ).filter(Boolean)

  const displayTags = resolvedTags.length > 0 ? resolvedTags : ["CULTURE", "5 MIN READ"]

  return (
    <section className="relative flex min-h-[600px] md:h-[680px] lg:h-[700px] xl:h-[725px] w-full items-end overflow-hidden">
      {/* Background Multimedia (Image / Video / Color) */}
      <UniversalMultimediaPreview
        multimedia={heroMultimedia}
        mode="background"
        className="h-full w-full object-cover object-center"
        containerClassName="absolute inset-0 z-0 h-full w-full"
      />

      {/* Global Gradient Overlay */}
      <div
        className="absolute inset-0 z-10 bg-[linear-gradient(180deg,rgba(193,203,206,0.30)_0%,rgba(28,28,28,0.30)_100%)] pointer-events-none"
        aria-hidden="true"
      />

      {/* Hero Content Container */}
      <div className="relative z-20 w-full xl:pb-[80px] lg:pb-[70px] md:pb-[60px] sm:pb-[48px] pb-[36px] xl:pl-[136px] lg:pl-[96px] md:pl-[56px] sm:pl-[36px] pl-[20px] xl:pr-[136px] lg:pr-[96px] md:pr-[56px] sm:pr-[36px] pr-[20px]">
        <div className="flex w-full max-w-[756px] flex-col items-start gap-4 sm:gap-5">
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

          {/* Breadcrumb / Navigation Tag (if set) */}
          {rawBreadcrumb && (
            <DynamicStyledTextPreview
              as="nav"
              data={rawBreadcrumb}
              className="text-xs md:text-sm font-semibold uppercase tracking-[2px] text-neutral-200/90 -mb-2"
            />
          )}

          {/* Heading Title */}
          <DynamicStyledTextPreview
            as="h1"
            data={rawTitle}
            fallbackText="Stories from the Balkans"
            fallbackColor={THEME_COLORS.white}
            className="font-heading xl:text-[72px] mid:text-[68px] lgx:text-[64px] lg:text-[60px] md:text-[52px] text-[32px] font-[600] capitalize xl:leading-[92px] mid:leading-[88px] lgx:leading-[84px] lg:leading-[80px] md:leading-[66px] leading-[42px] text-neutral-200 drop-shadow-xs"
          />

          {/* Subtitle / Tagline */}
          {rawSubtitle && (
            <DynamicStyledTextPreview
              as="h2"
              data={rawSubtitle}
              className="text-[15px] md:text-[16px] xlg:text-[17px] xl:text-[18px] xl:leading-7 text-neutral-100 font-normal [&_*]:!text-inherit -mt-1"
            />
          )}

          {/* Editorial Description */}
          {rawDescription && (
            <DynamicStyledTextPreview
              as="div"
              data={rawDescription}
              className="xl:text-[20px] mid:text-[20px] lgx:text-[19px] md:text-[17px] text-base font-normal xl:leading-7 text-neutral-100 max-w-[640px] [&_*]:!text-inherit"
            />
          )}

          {/* Category & Metadata Tag Badges (First 2 tags, 1:1 frontend TagBadge styling) */}
          {displayTags && displayTags.length > 0 && (
            <div className="inline-flex flex-wrap justify-start items-center gap-2 md:gap-2.5">
              {displayTags.slice(0, 2).map((tag, idx) => (
                <TagBadgePill key={idx} label={tag} />
              ))}
            </div>
          )}

          {/* CTA Buttons */}
          {Array.isArray(hero.buttons) && hero.buttons.length > 0 && (
            <div className="mt-2 flex flex-wrap items-center justify-start gap-3">
              <DynamicCmsButtonPreview buttons={hero.buttons} />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
