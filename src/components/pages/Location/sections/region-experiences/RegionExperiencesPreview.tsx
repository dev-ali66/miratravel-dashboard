import { THEME_COLORS } from "@/config/theme"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { DynamicStyledTextPreview } from "@/components/pages/CMS/shared/DynamicStyledTextPreview"
import { DynamicCmsButtonPreview } from "@/components/pages/CMS/shared/DynamicCmsButtonPreview"
import { UniversalMultimediaPreview } from "@/components/pages/CMS/Home/shared/preview/UniversalMultimediaPreview"
import type { LocationPreviewSectionProps } from "../../config/locationSections"
import type { RegionExperienceItemData } from "../../locationTypes"
import { getSafeStringValue } from "../../shared/normalizeHelpers"

export function RegionExperiencesPreview({ draft }: LocationPreviewSectionProps) {
  const destName = getSafeStringValue(draft?.name, "Destination")

  const regionExperiences =
    draft?.regionExperiences ||
    (draft as any)?.data?.regionExperiences ||
    (draft as any)?.experience || {
      label: `EXPLORE ${destName.toUpperCase()}`,
      title: "Four Regions. Four Different Experiences.",
      items: [],
      backgroundMultimedia: null,
    }

  const rawItems: RegionExperienceItemData[] =
    Array.isArray(regionExperiences.items) ? regionExperiences.items : []

  // Sample items shown only if no items have been added
  const sampleItems: RegionExperienceItemData[] = [
    {
      id: "sample-1",
      title: { value: `${destName} Highlands` },
      subtitle: { value: "Alpine Peaks & High Passes" },
      description: { value: `Untouched nature, mountain peaks, and quiet valleys of ${destName}.` },
      tag: { value: "HIGHLANDS" },
      imageMultimedia: {
        show: "image",
        image: {
          url: "",
          alt: `${destName} Highlands`,
          fit: "cover",
        },
      },
    },
    {
      id: "sample-2",
      title: { value: `Central ${destName}` },
      subtitle: { value: "Culture & Living Heritage" },
      description: { value: `Historic castles, vibrant bazaars, and traditional hospitality in ${destName}.` },
      tag: { value: "CULTURE" },
      imageMultimedia: {
        show: "image",
        image: {
          url: "",
          alt: `Central ${destName}`,
          fit: "cover",
        },
      },
    },
    {
      id: "sample-3",
      title: { value: `${destName} Valleys` },
      subtitle: { value: "Rivers & Rural Villages" },
      description: { value: `Pristine water springs, serene valleys, and authentic artisan crafts.` },
      tag: { value: "NATURE" },
      imageMultimedia: {
        show: "image",
        image: {
          url: "",
          alt: `${destName} Valleys`,
          fit: "cover",
        },
      },
    },
    {
      id: "sample-4",
      title: { value: `Southern ${destName}` },
      subtitle: { value: "Thermal Springs & Ancient Ruins" },
      description: { value: `Stone architecture, ancient ruins, and rich culinary traditions.` },
      tag: { value: "HERITAGE" },
      imageMultimedia: {
        show: "image",
        image: {
          url: "",
          alt: `Southern ${destName}`,
          fit: "cover",
        },
      },
    },
  ]

  const items: RegionExperienceItemData[] =
    rawItems.length > 0 ? rawItems : sampleItems

  const [activeId, setActiveId] = useState<string>("")

  // Keep active item valid
  useEffect(() => {
    if (items.length > 0) {
      if (!activeId || !items.some((it) => (it.id || `region-${items.indexOf(it)}`) === activeId)) {
        setActiveId(items[0].id || "region-0")
      }
    } else {
      setActiveId("")
    }
  }, [items, activeId])

  const activeIndex = items.findIndex(
    (it, idx) => (it.id || `region-${idx}`) === activeId
  )
  const activeRegion = items[activeIndex >= 0 ? activeIndex : 0] || items[0]

  return (
    <section
      data-section="region-experiences"
      className="relative w-full overflow-hidden pt-[60px] @xs:pt-[70px] @sm:pt-[80px] @md:pt-[95px] @lg:pt-[110px] @xlg:pt-[120px] @xl:pt-[145px] pb-[60px] @xs:pb-[70px] @sm:pb-[80px] @md:pb-[95px] @lg:pb-[110px] @xlg:pb-[120px] @xl:pb-[145px]"
    >
      {/* Universal Background Media (Color / Image / Video) */}
      <UniversalMultimediaPreview
        multimedia={regionExperiences.backgroundMultimedia}
        fallbackColor={THEME_COLORS.bgLightGray}
        mode="background"
      />

      <div
        id="region-experiences"
        className="relative z-10 w-full scroll-mt-24 container mx-auto px-4 @xs:px-5 @sm:px-6 @lg:px-8 @xl:px-0"
        style={{ perspective: "1200px" }}
      >
        <div className="w-full">
          <div className="mx-auto flex w-full flex-col items-center justify-center max-w-full @lg:max-w-[960px] @xlg:max-w-[1078px] @xl:max-w-[1263px]">
            {/* Header Section */}
            <div className="flex w-full flex-col items-center justify-center text-center mx-auto">
              {/* Eyebrow Label */}
              <div className="self-stretch flex flex-col justify-center items-center">
                <DynamicStyledTextPreview
                  as="div"
                  data={regionExperiences.label}
                  fallbackColor={THEME_COLORS.accent}
                  className="self-stretch text-accent text-sm @xs:text-base @md:text-lg @lgx:text-[20px] @mid:text-[22px] @xl:text-2xl leading-5 @xs:leading-6 @md:leading-[26px] @lgx:leading-7 @mid:leading-[30px] @xl:leading-8 mx-auto w-full text-center justify-center font-medium uppercase tracking-[2px] @md:tracking-[3px]"
                />
              </div>

              {/* Main Heading Title */}
              <div className="self-stretch mt-3 @md:mt-4 flex flex-col justify-center items-center">
                <DynamicStyledTextPreview
                  as="h2"
                  data={regionExperiences.title}
                  fallbackColor={THEME_COLORS.primary}
                  className="self-stretch shrink-0 h-auto font-medium font-heading text-[24px] @xs:text-[28px] @sm:text-[32px] @md:text-[38px] @lg:text-[42px] @xlg:text-[44px] @xl:text-[48px] @2xl:text-[50px] leading-[32px] @xs:leading-[38px] @sm:leading-[42px] @md:leading-[47px] @lg:leading-[50px] @xlg:leading-[52px] @xl:leading-[56px] @2xl:leading-[58px] mx-auto w-full text-center justify-center text-primary max-w-full @md:max-w-[600px] @lg:max-w-[690px] @xlg:max-w-[780px] @xl:max-w-[920px]"
                />
              </div>
            </div>

            {/* Interactive Content Layout (Image Frame on Left + Tabs on Right) */}
              <div className="mt-8 @md:mt-[36px] @lg:mt-[44px] @xl:mt-16 flex w-full flex-col @lg:flex-row items-center @lg:items-stretch justify-center @lg:justify-between gap-8 @md:gap-[38px] @lg:gap-[50px] @xlg:gap-[62px] @xl:gap-20">
                {/* Left Column: Dynamic Animated Image Frame */}
                <div
                  className="relative flex items-start shrink-0 overflow-hidden w-full @md:max-w-[580px] @lg:w-[460px] @xlg:w-[527px] @xl:w-[632px]
                  h-[320px] @xs:h-[340px] @md:h-[364px] @lg:h-[410px] @xlg:h-[457px] @xl:h-[530px] rounded-sm bg-surface"
                >
                  {activeRegion ? (
                    <div
                      className="relative h-full w-full overflow-hidden"
                      role="tabpanel"
                      id={`region-panel-${activeRegion.id || activeIndex}`}
                      aria-labelledby={`region-tab-${activeRegion.id || activeIndex}`}
                    >
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={activeRegion.id || activeIndex}
                          initial={{ opacity: 0, scale: 0.98 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.4, ease: "easeOut" }}
                          className="absolute inset-0 h-full w-full"
                        >
                          <UniversalMultimediaPreview
                            multimedia={
                              activeRegion.imageMultimedia || {
                                show: "image",
                                image: {
                                  url: (activeRegion as any).image || "",
                                  alt: getSafeStringValue(activeRegion.title, "Region Experience"),
                                  opacity: 100,
                                  overlayColor: THEME_COLORS.overlayBlack,
                                  overlayOpacity: 0,
                                  width: "100%",
                                  height: "100%",
                                  fit: "cover",
                                },
                              }
                            }
                            fallbackColor={THEME_COLORS.bgSubdued}
                            mode="inline"
                            className="size-full object-cover object-center transition-transform duration-700 hover:scale-105"
                            containerClassName="size-full"
                          />

                          {/* Subtle Ambient Vignette Overlay */}
                          <div
                            className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent pointer-events-none z-10"
                            aria-hidden="true"
                          />

                          {/* Overlaid Tag Badge */}
                          {activeRegion.tag && (
                            <div className="absolute top-4 left-4 z-20">
                              <DynamicStyledTextPreview
                                as="span"
                                data={activeRegion.tag}
                                fallbackColor={THEME_COLORS.white}
                                className="rounded bg-black/60 backdrop-blur-md px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-white border border-white/20"
                              />
                            </div>
                          )}
                        </motion.div>
                      </AnimatePresence>
                    </div>
                  ) : (
                    <div className="flex size-full items-center justify-center text-muted-foreground text-xs">
                      No region media configured
                    </div>
                  )}
                </div>

                {/* Right Column: Interactive Region Selection Tablist */}
                <div
                  role="tablist"
                  aria-orientation="vertical"
                  className="flex w-full flex-1 max-w-[580px] @lg:max-w-[552px] flex-col justify-start @lg:justify-between items-start gap-4 sm:gap-5 @md:gap-[22px] @lg:gap-[26px] @xlg:gap-[30px] @xl:gap-9 shrink-0"
                >
                  {items.map((region, idx) => {
                    const itemId = region.id || `region-${idx}`
                    const isActive = itemId === activeId || (idx === 0 && !activeId)

                    const itemTitleFallback = getSafeStringValue(region.title, `Region ${idx + 1}`)

                    const exploreUrl =
                      region.button?.url ||
                      (region as any).buttonUrl ||
                      `/destinations/${region.id || `region-${idx + 1}`}`

                    const exploreLabel =
                      getSafeStringValue(region.button?.label) ||
                      (region as any).buttonText ||
                      `Explore ${itemTitleFallback}`

                    const regionButtons = Array.isArray(region.buttons) && region.buttons.length > 0
                      ? region.buttons
                      : region.button
                      ? [region.button]
                      : [{ label: exploreLabel, url: exploreUrl, variant: "primary" }]

                    return (
                      <div
                        key={itemId}
                        tabIndex={0}
                        role="tab"
                        id={`region-tab-${itemId}`}
                        aria-selected={isActive}
                        aria-controls={`region-panel-${itemId}`}
                        onMouseEnter={() => setActiveId(itemId)}
                        onClick={() => setActiveId(itemId)}
                        onFocus={() => setActiveId(itemId)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault()
                            setActiveId(itemId)
                          }
                        }}
                        className={`group relative flex w-full cursor-pointer items-start gap-3 @md:gap-[13px] @lg:gap-[15px] @xl:gap-5 transition-all duration-300 outline-none rounded-sm p-1.5 -m-1.5 ${
                          isActive
                            ? "bg-black/[0.02]"
                            : "opacity-75 hover:opacity-100"
                        }`}
                      >
                        {/* Left Active Indicator Bar */}
                        <div className="self-stretch pt-1 flex justify-start items-start shrink-0">
                          <div className="relative w-[2px] min-h-[60px] self-stretch overflow-hidden bg-stone-300">
                            {isActive && (
                              <motion.div
                                layoutId="activeRegionIndicator"
                                className="absolute inset-0 bg-primary"
                                transition={{
                                  type: "spring",
                                  stiffness: 350,
                                  damping: 30,
                                }}
                              />
                            )}
                          </div>
                        </div>

                        {/* Region Content Details */}
                        <div className="flex flex-1 flex-col justify-start items-start">
                          {/* Region Title */}
                          <DynamicStyledTextPreview
                            as="h3"
                            data={region.title}
                            fallbackColor={THEME_COLORS.primary}
                            className="font-heading font-semibold text-base @md:text-[16.3px] @lg:text-[16.7px] @xlg:text-[17.2px] @xl:text-lg leading-[22px] @md:leading-[22.7px] @lg:leading-[24.2px] @xlg:leading-[25.7px] @xl:leading-7 transition-colors duration-300 mb-1 text-primary"
                          />

                          {/* Region Subtitle */}
                          <DynamicStyledTextPreview
                            as="p"
                            data={region.subtitle}
                            fallbackColor={isActive ? THEME_COLORS.accent : THEME_COLORS.accentWarm}
                            className={`mb-2 text-xs @md:text-[12.3px] @xl:text-sm font-normal leading-4 italic transition-colors duration-300 ${
                              isActive ? "text-accent-hover font-medium" : "text-accent-muted"
                            }`}
                          />

                          {/* Region Description */}
                          <DynamicStyledTextPreview
                            as="p"
                            data={region.description}
                            fallbackColor={THEME_COLORS.muted}
                            className="w-full text-xs @md:text-[12.3px] @xl:text-sm font-normal leading-5 transition-colors duration-300 text-subtitle"
                          />

                          {/* Explore Region Action Buttons */}
                          {isActive && (
                            <div className="mt-3 flex flex-wrap items-center gap-2">
                              <DynamicCmsButtonPreview buttons={regionButtons} defaultVariant="primary" />
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default RegionExperiencesPreview
