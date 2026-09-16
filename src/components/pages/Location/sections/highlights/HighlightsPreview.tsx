import { useState } from "react"
import { DynamicStyledPreview } from "@/components/shared/DynamicStyledPreview"
import { UniversalMultimediaPreview } from "@/components/pages/CMS/Home/shared/preview/UniversalMultimediaPreview"
import type { LocationPreviewSectionProps } from "../../config/locationSections"
import type { HighlightLocationItem } from "../../locationTypes"
import { useGetLocationPages } from "@/hooks/location/useGetLocation"

export function HighlightsPreview({ draft }: LocationPreviewSectionProps) {
  const [isPaused, setIsPaused] = useState(false)

  // Fetch available locations from DB to dynamically resolve and aggregate hero / card data
  const { data: locationPagesResponse } = useGetLocationPages({ limit: 100 })
  const availableLocations = locationPagesResponse?.data || []

  const highlights =
    draft?.highlights ||
    (draft as any)?.data?.highlights || {
      label: "SEASONAL HIGHLIGHTS",
      title: "Regions of Albania",
      description:
        "A selection of destinations currently resonating with our most discerning travelers.",
      items: [],
      backgroundMultimedia: null,
    }

  // Normalize highlights.items (supports both rich objects and legacy string IDs)
  const rawItems: any[] = Array.isArray(highlights.items) ? highlights.items : []

  const dynamicItems: HighlightLocationItem[] = rawItems
    .map((it: any, idx: number) => {
      if (typeof it === "string") {
        const loc =
          availableLocations.find((l) => l.id === it || l.slug === it) ||
          (draft?.children as any[])?.find((c: any) => c.id === it || c.slug === it)
        const parentName = loc?.parent?.name || draft?.name || "Country"
        const parentSlug = loc?.parent?.slug || draft?.slug || "explore"
        const childSlug = loc?.slug || `highlight-${idx + 1}`
        const subtitleTag =
          loc?.hero?.subtitle?.value ||
          loc?.hero?.subtitle ||
          (Array.isArray(loc?.why?.tags) ? loc.why.tags.join(" • ") : "") ||
          loc?.hero?.breadcrumb?.value ||
          loc?.type ||
          ""

        const heroMedia = loc?.hero?.backgroundMultimedia
        const imgUrl =
          heroMedia?.image?.url ||
          loc?.hero?.image?.url ||
          loc?.card?.background_image ||
          (heroMedia?.show === "image" ? heroMedia?.image?.url : "") ||
          "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1200&q=85"

        return {
          id: it,
          locationId: it,
          region: loc?.name || loc?.hero?.title?.value || `Region ${idx + 1}`,
          country: parentName,
          tags: subtitleTag,
          imageMultimedia: {
            show: "image",
            image: {
              url: imgUrl,
              alt: loc?.name || "Highlight",
              fit: "cover",
            },
          },
          countrySlug: parentSlug,
          regionSlug: childSlug,
          href: `/destinations/${parentSlug}/${childSlug}`,
        }
      }

      // If it is an object
      const loc = it.locationId
        ? availableLocations.find((l) => l.id === it.locationId || l.slug === it.locationId)
        : null

      const fallbackRegion = loc?.name || loc?.hero?.title?.value || `Region ${idx + 1}`
      const fallbackCountry = loc?.parent?.name || draft?.name || "Country"
      const fallbackTags =
        loc?.hero?.subtitle?.value ||
        loc?.hero?.subtitle ||
        (Array.isArray(loc?.why?.tags) ? loc.why.tags.join(" • ") : "") ||
        ""

      return {
        ...it,
        id: it.id || loc?.id || `hl-${idx}`,
        locationId: it.locationId || loc?.id,
        region: it.region || fallbackRegion,
        country: it.country || fallbackCountry,
        tags: it.tags !== undefined ? it.tags : fallbackTags,
        href:
          it.href ||
          (it.countrySlug && it.regionSlug
            ? `/destinations/${it.countrySlug}/${it.regionSlug}`
            : "#"),
      }
    })
    .filter(Boolean) as HighlightLocationItem[]

  // Sample items shown only if no items have been added
  const sampleItems: HighlightLocationItem[] = [
    {
      id: "sample-1",
      region: "North Albania",
      country: draft?.name || "Albania",
      tags: "Alpine & Peaks",
      imageMultimedia: {
        show: "image",
        image: {
          url: "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1200&q=85",
          alt: "North Albania",
          fit: "cover",
        },
      },
    },
    {
      id: "sample-2",
      region: "Central Albania",
      country: draft?.name || "Albania",
      tags: "Culture & Heritage",
      imageMultimedia: {
        show: "image",
        image: {
          url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=85",
          alt: "Central Albania",
          fit: "cover",
        },
      },
    },
    {
      id: "sample-3",
      region: "Albanian Riviera",
      country: draft?.name || "Albania",
      tags: "Coastal & Coves",
      imageMultimedia: {
        show: "image",
        image: {
          url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=85",
          alt: "Albanian Riviera",
          fit: "cover",
        },
      },
    },
    {
      id: "sample-4",
      region: "South Albania",
      country: draft?.name || "Albania",
      tags: "UNESCO Sites",
      imageMultimedia: {
        show: "image",
        image: {
          url: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=85",
          alt: "South Albania",
          fit: "cover",
        },
      },
    },
  ]

  const items: HighlightLocationItem[] =
    dynamicItems.length > 0 ? dynamicItems : sampleItems

  // Create a 3x set for seamless infinite marquee loop ticker
  const marqueeItems = [...items, ...items, ...items]

  return (
    <section
      data-section="highlights"
      className="relative w-full py-[58px] md:py-[74px] lg:py-[84px] xl:py-[92px] overflow-hidden border-b border-border/40 font-sans"
    >
      {/* Background Media (Image / Video / Color) */}
      <UniversalMultimediaPreview
        multimedia={highlights.backgroundMultimedia}
        fallbackColor="#fbf8f2"
        mode="background"
      />

      <div
        id="highlights"
        className="relative z-10 w-full scroll-mt-24"
        style={{ perspective: "1200px" }}
      >
        <div className="w-full">
          {/* Header Container */}
          <div className="container mx-auto px-4 sm:px-6">
            <div className="mx-auto flex w-full md:max-w-[85%] max-w-[90%] lg:max-w-[863px] flex-col items-center text-center xl:gap-3 md:gap-2.5 gap-2">
              {/* Eyebrow Label */}
              <div className="self-stretch flex flex-col justify-center items-center font-normal text-sm md:text-base lg:text-lg xl:text-xl text-center tracking-[2.34px] xl:leading-9 lgx:leading-[34px] md:leading-8 leading-[30px]">
                <DynamicStyledPreview
                  as="span"
                  field={highlights.label}
                  fallback="SEASONAL HIGHLIGHTS"
                  fallbackColor="#af6348"
                  className="text-center font-normal uppercase tracking-[2.34px]"
                />
              </div>

              {/* Section Main Title */}
              <div className="self-stretch shrink-0 h-auto flex flex-col justify-center items-center text-center mb-2 md:mb-[9px] xl:mb-[11px] font-heading xl:leading-[56px] lgx:leading-[52px] md:leading-[48px] leading-[44px]">
                <DynamicStyledPreview
                  as="h2"
                  field={highlights.title}
                  fallback={`Regions of ${draft?.name || "Albania"}`}
                  fallbackColor="#182d09"
                  className="font-semibold font-heading text-[28px] md:text-[38px] lg:text-[42px] lg:leading-[42px] lgx:text-[42px] mid:text-[44px] mid:leading-[44px] xlg:text-[46px] xlg:leading-[46px] xl:text-[48px] text-center"
                />
              </div>

              {/* Subtitle / Description */}
              {highlights.description && (
                <div className="self-stretch h-auto shrink-0 flex flex-col justify-center items-center text-center">
                  <DynamicStyledPreview
                    as="p"
                    field={highlights.description}
                    fallback="A selection of destinations currently resonating with our most discerning travelers."
                    fallbackColor="#565e69"
                    className="text-center font-normal text-[16px] md:text-[18px] lg:text-[20px]"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Auto-Looping Infinite Slider Row */}
          <div
            className="mt-12 md:mt-16 lg:mt-[74px] xl:mt-[80px] w-full overflow-hidden"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={() => setIsPaused(true)}
            onTouchEnd={() => setIsPaused(false)}
          >
            <div
              className={`flex items-center gap-6 sm:gap-8 md:gap-10 lg:gap-12 xl:gap-12 w-max cursor-pointer ${
                isPaused ? "" : "animate-[marquee_60s_linear_infinite]"
              }`}
              style={{
                animationPlayState: isPaused ? "paused" : "running",
              }}
            >
              {marqueeItems.map((item, index) => {
                const cardMedia =
                  item.imageMultimedia?.image?.url ||
                  item.imageMultimedia?.video?.url ||
                  item.imageMultimedia?.color
                    ? item.imageMultimedia
                    : (item as any).image
                    ? {
                        show: "image",
                        image: {
                          url: (item as any).image,
                          alt:
                            typeof item.region === "object"
                              ? item.region?.value
                              : item.region || "Highlight",
                          fit: "cover",
                        },
                      }
                    : {
                        show: "image",
                        image: {
                          url: "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1200&q=85",
                          alt:
                            typeof item.region === "object"
                              ? item.region?.value
                              : item.region || "Highlight",
                          fit: "cover",
                        },
                      }

                const regionLabel =
                  typeof item.region === "object"
                    ? item.region?.value || ""
                    : item.region || ""
                const countryLabel =
                  typeof item.country === "object"
                    ? item.country?.value || ""
                    : item.country || ""

                return (
                  <div
                    key={`${item.id}-${index}`}
                    className="group relative shrink-0 block overflow-hidden shadow-md transition-shadow duration-500 hover:shadow-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-primary w-[300px] md:w-[440px] lg:w-[487px] xlg:w-[507px] xl:w-[527px] h-[340px] md:h-[500px] lg:h-[520px] xlg:h-[540px] xl:h-[551px]"
                    aria-label={`Explore ${regionLabel}, ${countryLabel}`}
                  >
                    {/* Background Media Container with Hover Scale */}
                    <div className="absolute inset-0 size-full transition-transform duration-1000 ease-out group-hover:scale-105">
                      <UniversalMultimediaPreview
                        multimedia={cardMedia}
                        fallbackImageSrc="https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1200&q=85"
                        fallbackAlt={`${regionLabel} — ${countryLabel}`}
                        mode="background"
                        className="size-full object-cover object-center"
                      />
                    </div>

                    {/* Left-to-Right Primary Color Slide-In Layer */}
                    <div
                      className="absolute inset-0 -translate-x-full bg-gradient-to-r from-[#182d09]/60 via-[#182d09]/40 to-[#182d09]/20 transition-transform duration-700 ease-out group-hover:translate-x-0 pointer-events-none z-10"
                      aria-hidden="true"
                    />

                    {/* Top Ambient Subtle Vignette */}
                    <div
                      className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-85 pointer-events-none"
                      aria-hidden="true"
                    />

                    {/* Gradient Dark Overlay (from bottom to top) */}
                    <div
                      style={{
                        background:
                          "linear-gradient(0deg, rgba(6, 23, 0, 0.8) 0%, rgba(6, 23, 0, 0) 50%, rgba(6, 23, 0, 0) 100%)",
                      }}
                      className="absolute inset-0 pointer-events-none transition-opacity duration-500 group-hover:opacity-95"
                      aria-hidden="true"
                    />

                    {/* Content Box Positioned at Bottom Left */}
                    <div className="absolute inset-x-0 bottom-0 z-10 flex flex-col justify-start items-start gap-1.5 p-6 sm:p-7 md:p-8 lg:p-9 xl:p-[36px] text-left">
                      {/* Country Tag */}
                      <DynamicStyledPreview
                        as="span"
                        field={item.country}
                        fallback={draft?.name || "Country"}
                        fallbackColor="#f3f4f6"
                        className="text-neutral-100/60 uppercase text-xs md:text-[13.5px] xl:text-sm font-normal xl:leading-[22.5px] md:leading-[20px] leading-[18px] tracking-[1.4px]"
                      />

                      {/* Region Title */}
                      <DynamicStyledPreview
                        as="h3"
                        field={item.region}
                        fallback="Untitled Region"
                        fallbackColor="#ffffff"
                        className="text-neutral-100 font-heading text-xl md:text-[26px] xl:text-[27px] font-normal leading-9 md:leading-[38px] xl:leading-[41px] transition-colors duration-300 group-hover:text-accent"
                      />

                      {/* Subtitle / Activity Tags */}
                      {Boolean(item.tags) && (
                        <DynamicStyledPreview
                          as="p"
                          field={item.tags}
                          fallback=""
                          fallbackColor="#ffffff"
                          className="text-neutral-100 text-sm md:text-[15px] xl:text-base font-normal xl:leading-5 md:leading-[18px] leading-4 tracking-[1px] pt-[5px] transition-colors duration-300 group-hover:text-neutral-100/95 line-clamp-1"
                        />
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HighlightsPreview
