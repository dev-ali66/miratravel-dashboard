import { useState } from "react"
import type { JourneyCmsPreviewSectionProps } from "../../journeyCmsTypes"
import { DynamicStyledTextPreview } from "@/components/pages/CMS/shared/DynamicStyledTextPreview"
import { UniversalMultimediaPreview } from "@/components/pages/CMS/shared/UniversalMultimediaPreview"
import { Search, SlidersHorizontal, Heart, X } from "lucide-react"
import { useGetJourneys } from "@/hooks/journey/useGetJourneys"

export function JourneyCmsAllJourneysPreview({ draft }: JourneyCmsPreviewSectionProps) {
  if (!draft) return null

  const allData =
    draft.all_journeys || draft?.data?.all_journeys || {}

  const [searchQuery, setSearchQuery] = useState("")
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({})

  // Fetch live journeys from backend API (/api/v1/journeys)
  const { data: journeysRes } = useGetJourneys({ limit: 20 })
  const dbJourneys = journeysRes?.data || []

  // Sample fallback journeys matching user screenshot 2 100% 1:1
  const fallbackJourneys = [
    {
      id: "ultimate-wildlife-expedition",
      title: "Ultimate Wildlife Expedition",
      description: "An immersive adventure through some of the world's most spectacular wilderness",
      journeyType: "SIGNATURE_JOURNEY",
      days: "7 DAYS",
      priceFrom: "$3195",
      tags: ["NATURE", "ADVENTURE_SEEKERS", "CURATED"],
      image: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: "wildlife-safari",
      title: "Wildlife Safari",
      description: "Experience remarkable wildlife and unforgettable encounters in nature",
      journeyType: "LUXURY_ESCAPE",
      days: "7 DAYS",
      priceFrom: "$3195",
      tags: ["NATURE", "NATURE_LOVERS", "CURATED"],
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: "ancient-temples",
      title: "Ancient Temples",
      description: "From the Julian Alps to the Aegean Foothills",
      journeyType: "FAMILY_JOURNEY",
      days: "21 DAYS",
      priceFrom: "$7495",
      tags: ["CULTURE_HERITAGE", "RETURNING_VISITORS", "CURATED"],
      image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: "island-escape",
      title: "Island Escape",
      description: "A relaxing escape across beautiful islands and secluded coastlines",
      journeyType: "LUXURY_ESCAPE",
      days: "7 DAYS",
      priceFrom: "$3195",
      tags: ["COASTAL_ESCAPE", "HONEYMOONERS", "CURATED"],
      image: "https://res.cloudinary.com/dscqp4wwt/image/upload/v1790266904/P/why_mira.rightSideMultimedia.image.url/ruqyyawdzhxflzu3jcy7.jpg",
    },
    {
      id: "wildlife-discovery",
      title: "Wildlife Discovery",
      description: "Primeval Forests, Canyon Sanctuaries & Wild River Basins",
      journeyType: "SIGNATURE_JOURNEY",
      days: "12 DAYS",
      priceFrom: "$4195",
      tags: ["NATURE", "NATURE_LOVERS", "CURATED"],
      image: "https://res.cloudinary.com/dscqp4wwt/image/upload/v1790018470/P/mira_stories.leftSideMultimedia.image.url/bv0ei4gpbq82lbnrrxzg.jpg",
    },
    {
      id: "temple-trail",
      title: "Temple Trail",
      description: "Explore ancient temples, rich traditions, and remarkable landscapes",
      journeyType: "PRIVATE_JOURNEY",
      days: "7 DAYS",
      priceFrom: "$3195",
      tags: ["CULTURE_HERITAGE", "FIRST_TIME_VISITORS", "CURATED"],
      image: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=800&q=80",
    },
  ]

  const formatJourneyType = (rawType: any, idx: number) => {
    if (!rawType) return fallbackJourneys[idx % fallbackJourneys.length].journeyType
    const str = Array.isArray(rawType) ? rawType[0] : String(rawType)
    return str.toUpperCase().replace(/[\s-]+/g, "_")
  }

  const mappedDbJourneys = dbJourneys.map((j: any, idx: number) => {
    const fallback = fallbackJourneys[idx % fallbackJourneys.length]
    const jType = formatJourneyType(j.journeyType || j.type, idx)
    const daysStr = j.minDays ? `${j.minDays} DAYS` : fallback.days
    const priceStr = j.price ? `$${j.price.toLocaleString()}` : fallback.priceFrom

    const rawTags = [
      ...(Array.isArray(j.travelStyle) ? j.travelStyle : []),
      ...(Array.isArray(j.perfectFor) ? j.perfectFor : []),
    ]
      .map((t: string) => String(t).toUpperCase().replace(/[\s-]+/g, "_"))
      .filter(Boolean)

    const tags = rawTags.length > 0 ? [...new Set([...rawTags, "CURATED"])] : fallback.tags

    return {
      id: j.id || fallback.id,
      title: j.title || j.name || j.hero?.title?.value || fallback.title,
      description: j.subtitle || j.description || j.hero?.subtitle?.value || fallback.description,
      journeyType: jType,
      days: daysStr,
      priceFrom: priceStr,
      tags,
      image: j.hero?.backgroundMultimedia?.image?.url || j.image || fallback.image,
    }
  })

  const baseJourneys = mappedDbJourneys.length >= 6 ? mappedDbJourneys : fallbackJourneys

  // Filter journeys by search query
  const filteredJourneys = baseJourneys.filter((j) => {
    if (!searchQuery.trim()) return true
    const q = searchQuery.toLowerCase()
    return (
      j.title.toLowerCase().includes(q) ||
      j.description.toLowerCase().includes(q) ||
      j.journeyType.toLowerCase().includes(q) ||
      j.tags.some((t) => t.toLowerCase().includes(q))
    )
  })

  const toggleHeart = (id: string) => {
    setLikedMap((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <section
      data-section="all_journeys"
      className="relative w-full py-10 md:py-[57px] lg:py-[62px] xl:py-[77px] overflow-hidden"
    >
      {/* Background Media */}
      <UniversalMultimediaPreview
        multimedia={allData.backgroundMultimedia}
        fallbackColor="#FFFFFF"
        mode="background"
      />

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search & Filter Header Toolbar matching user screenshot 2 100% 1:1 */}
        <div className="flex flex-col w-full pb-6 md:pb-8 gap-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Left: Eyebrow + Title + Subtitle */}
            <div className="flex flex-col items-start gap-[11px] md:gap-[13px] xl:gap-4 shrink-0">
              {allData.eyebrow && (
                <DynamicStyledTextPreview
                  as="span"
                  data={allData.eyebrow}
                  fallbackColor="#AF6348"
                  className="text-xs font-semibold uppercase tracking-widest text-[#AF6348]"
                />
              )}
              <DynamicStyledTextPreview
                as="h2"
                data={allData.title}
                fallbackColor="#182D09"
                className="font-heading font-semibold text-[28px] md:text-[36px] lgx:text-[40px] xl:text-[44px] leading-tight text-[#182D09]"
              />
              {allData.subtitle && (
                <DynamicStyledTextPreview
                  as="p"
                  data={allData.subtitle}
                  fallbackColor="#4B5563"
                  className="text-sm md:text-base text-[#4B5563]"
                />
              )}
            </div>

            {/* Right: Search Input + Filter Button */}
            <div className="w-full md:flex-1 md:min-w-0 inline-flex items-center justify-end gap-3">
              <div className="group flex flex-1 min-w-0 w-full max-w-[480px] items-center gap-2.5 rounded-[6px] border border-gray-200 bg-white py-2.5 px-3.5 shadow-2xs focus-within:border-[#182D09] transition-all">
                <Search className="h-4 w-4 text-gray-400 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={allData.searchPlaceholder || "Search journeys..."}
                  className="w-full bg-transparent text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="text-gray-400 hover:text-gray-600 p-0.5 rounded-full"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              <button
                type="button"
                className="inline-flex items-center justify-center gap-2 rounded-[6px] border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-2xs hover:bg-gray-50 transition-colors shrink-0 cursor-pointer"
              >
                <SlidersHorizontal className="h-4 w-4 text-gray-600" />
                <span>Filter</span>
              </button>
            </div>
          </div>
        </div>

        {/* 3-Column Responsive Grid matching screenshot 2 100% 1:1 */}
        {filteredJourneys.length === 0 ? (
          <div className="py-16 text-center text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-200">
            No journeys match your search query &quot;{searchQuery}&quot;.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full items-stretch">
            {filteredJourneys.map((j) => {
              const isLiked = Boolean(likedMap[j.id])
              return (
                <div
                  key={j.id}
                  className="group relative flex w-full flex-col overflow-hidden rounded-[8px] border border-gray-200/90 bg-white shadow-xs transition-all duration-300 hover:shadow-md"
                >
                  {/* Media Cover */}
                  <div className="relative h-[250px] md:h-[270px] w-full overflow-hidden bg-gray-100">
                    <img
                      src={j.image}
                      alt={j.title}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />

                    {/* Top-Left Category Badge (Dark pill with uppercase text) */}
                    <div className="absolute left-3 top-3 z-20 rounded-[3px] bg-[#111827] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                      {j.journeyType}
                    </div>

                    {/* Top-Right Heart Save Button */}
                    <button
                      type="button"
                      onClick={() => toggleHeart(j.id)}
                      className="absolute right-3 top-3 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-gray-700 shadow-xs hover:bg-white transition-all cursor-pointer"
                      aria-label="Save journey"
                    >
                      <Heart
                        className={`h-4 w-4 ${
                          isLiked ? "fill-red-500 text-red-500" : "text-gray-700"
                        }`}
                      />
                    </button>

                    {/* Bottom-Left Days Pill */}
                    <div className="absolute left-3 bottom-3 z-20 rounded-[3px] bg-black/60 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-xs">
                      {j.days}
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="flex flex-1 flex-col justify-between p-5">
                    <div className="flex flex-col gap-2">
                      <h3 className="font-heading text-xl md:text-[22px] font-normal leading-snug tracking-wide text-[#182D09] group-hover:text-[#AF6348] transition-colors">
                        {j.title}
                      </h3>
                      <p className="text-xs md:text-sm text-[#4B5563] line-clamp-2 leading-relaxed">
                        {j.description}
                      </p>
                    </div>

                    {/* Footer Row: Tags on Left, Price on Right */}
                    <div className="flex items-center justify-between gap-2 mt-5 pt-3 border-t border-gray-100">
                      <div className="flex items-center gap-1.5 flex-wrap min-w-0">
                        {j.tags.map((tag, tIdx) => (
                          <span
                            key={tIdx}
                            className="rounded-full border border-gray-200 px-2.5 py-0.5 text-[9.5px] font-medium tracking-wider text-gray-500 uppercase whitespace-nowrap"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      <span className="text-xs text-gray-500 shrink-0">
                        From{" "}
                        <span className="text-sm md:text-base font-bold text-[#C97B4A]">
                          {j.priceFrom}
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}

export default JourneyCmsAllJourneysPreview
