import type { JourneyCmsPreviewSectionProps } from "../../journeyCmsTypes"
import { DynamicStyledTextPreview } from "@/components/pages/CMS/shared/DynamicStyledTextPreview"
import { UniversalMultimediaPreview } from "@/components/pages/CMS/shared/UniversalMultimediaPreview"
import { DynamicCmsButtonPreview } from "@/components/pages/CMS/shared/DynamicCmsButtonPreview"
import { useGetJourneys } from "@/hooks/journey/useGetJourneys"

export function JourneyCmsSignatureJourneysPreview({ draft }: JourneyCmsPreviewSectionProps) {
  if (!draft) return null

  const sigData =
    draft.signature_journeys || draft?.data?.signature_journeys || {}

  // Fetch live journeys from backend API (/api/v1/journeys)
  const { data: journeysRes } = useGetJourneys({ limit: 10 })
  const dbJourneys = journeysRes?.data || []

  // Sample signature journey records matching user screenshot 1:1 if DB has fewer records
  const fallbackJourneys = [
    {
      id: "ultimate-wildlife-expedition",
      title: "Ultimate Wildlife Expedition",
      description: "An immersive adventure through some of the world's most spectacular wilderness",
      priceFrom: "$3195",
      journeyType: "SIGNATURE_JOURNEY",
      days: "7 DAYS",
      style: "NATURE",
      image: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1200&q=80",
    },
    {
      id: "wildlife-safari",
      title: "Wildlife Safari",
      description: "Experience remarkable wildlife and unforgettable encounters in nature",
      priceFrom: "$3195",
      journeyType: "LUXURY_ESCAPE",
      days: "7 DAYS",
      style: "NATURE",
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: "ancient-temples",
      title: "Ancient Temples",
      description: "From the Julian Alps to the Aegean Foothills",
      priceFrom: "$7495",
      journeyType: "FAMILY_JOURNEY",
      days: "21 DAYS",
      style: "CULTURE_HERITAGE",
      image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80",
    },
  ]

  const formatJourneyType = (rawType: any) => {
    if (!rawType) return "SIGNATURE_JOURNEY"
    const str = Array.isArray(rawType) ? rawType[0] : String(rawType)
    return str.toUpperCase().replace(/[\s-]+/g, "_")
  }

  const mappedDbJourneys = dbJourneys.map((j: any, idx: number) => {
    const fallback = fallbackJourneys[idx % fallbackJourneys.length]
    const jType = formatJourneyType(j.journeyType || j.type || fallback.journeyType)
    const daysStr = j.minDays ? `${j.minDays} DAYS` : j.days || fallback.days
    const styleStr = j.travelStyle?.[0] ? String(j.travelStyle[0]).toUpperCase().replace(/[\s-]+/g, "_") : fallback.style
    const priceStr = j.price ? `$${j.price.toLocaleString()}` : j.priceFrom || fallback.priceFrom

    return {
      id: j.id || fallback.id,
      title: j.title || j.name || j.hero?.title?.value || fallback.title,
      description: j.subtitle || j.description || j.hero?.subtitle?.value || fallback.description,
      priceFrom: priceStr,
      journeyType: jType,
      days: daysStr,
      style: styleStr,
      image: j.hero?.backgroundMultimedia?.image?.url || j.image || fallback.image,
    }
  })

  const signatureItems = mappedDbJourneys.length >= 3 ? mappedDbJourneys.slice(0, 3) : fallbackJourneys
  const mainItem = signatureItems[0]
  const subItems = signatureItems.slice(1, 3)

  return (
    <section
      data-section="signature_journeys"
      className="relative w-full py-10 md:py-[57px] lg:py-[62px] xl:py-[77px] overflow-hidden"
    >
      {/* Background Media */}
      <UniversalMultimediaPreview
        multimedia={sigData.backgroundMultimedia}
        fallbackColor="#FAF7F2"
        mode="background"
      />

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col w-full gap-4 md:gap-6 lgx:gap-7 xl:gap-8">
          {/* Section Header */}
          <div className="flex flex-col items-start gap-[11px] md:gap-[13px] xl:gap-4">
            {sigData.eyebrow && (
              <DynamicStyledTextPreview
                as="span"
                data={sigData.eyebrow}
                fallbackColor="#AF6348"
                className="text-xs font-semibold uppercase tracking-widest text-[#AF6348]"
              />
            )}

            <DynamicStyledTextPreview
              as="h2"
              data={sigData.title}
              fallbackColor="#182D09"
              className="font-heading font-semibold text-[28px] md:text-[36px] lgx:text-[40px] xl:text-[44px] leading-tight text-[#182D09]"
            />

            {sigData.subtitle && (
              <DynamicStyledTextPreview
                as="p"
                data={sigData.subtitle}
                fallbackColor="#4B5563"
                className="text-sm md:text-base text-[#4B5563] max-w-3xl"
              />
            )}

            {Array.isArray(sigData.buttons) && sigData.buttons.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-3">
                <DynamicCmsButtonPreview buttons={sigData.buttons} />
              </div>
            )}
          </div>

          {/* Bento Grid Layout matching screenshot 1:1 */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-5 w-full items-stretch">
            {/* Main Featured Card (Left - col-span-7) */}
            <div className="group relative isolate lg:col-span-7 flex flex-col justify-end min-h-[320px] md:min-h-[370px] lg:min-h-[400px] rounded-[4px] overflow-hidden shadow-sm">
              <div className="absolute inset-0 size-full overflow-hidden">
                <img
                  src={mainItem.image}
                  alt={mainItem.title}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>

              {/* Dark Gradient Overlay matching screenshot */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(0deg, rgba(17, 24, 39, 0.92) 0%, rgba(17, 24, 39, 0.45) 55%, rgba(17, 24, 39, 0) 100%)",
                }}
              />

              {/* Price Tag Pill Bottom Right */}
              <div className="absolute right-4 bottom-4 z-20">
                <span className="text-white font-sans font-bold text-sm md:text-base tracking-wider px-4 py-1.5 bg-[#111827]/90 rounded-[2px]">
                  From {mainItem.priceFrom}
                </span>
              </div>

              {/* Content Bottom Left */}
              <div className="relative z-20 p-5 md:p-6 flex flex-col gap-2 max-w-[85%]">
                <h3 className="text-white font-heading font-semibold text-xl md:text-2xl lg:text-[26px] leading-snug">
                  {mainItem.title}
                </h3>
                <p className="text-neutral-200 text-xs md:text-sm font-normal line-clamp-2 leading-relaxed">
                  {mainItem.description}
                </p>
                <div className="flex items-center gap-1.5 text-neutral-300 font-sans text-xs font-semibold tracking-wider uppercase mt-1">
                  <span>
                    {mainItem.journeyType} • {mainItem.days} • {mainItem.style}
                  </span>
                </div>
              </div>
            </div>

            {/* Right 2 Stacked Cards (Right - col-span-5) */}
            <div className="lg:col-span-5 flex flex-col gap-4 md:gap-5 justify-between">
              {subItems.map((item, idx) => (
                <div
                  key={item.id || idx}
                  className="group relative isolate flex flex-1 flex-col justify-end min-h-[175px] md:min-h-[190px] rounded-[4px] overflow-hidden shadow-sm"
                >
                  <div className="absolute inset-0 size-full overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>

                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background:
                        "linear-gradient(0deg, rgba(17, 24, 39, 0.92) 0%, rgba(17, 24, 39, 0.45) 55%, rgba(17, 24, 39, 0) 100%)",
                    }}
                  />

                  {/* Price Tag Pill */}
                  <div className="absolute right-4 bottom-4 z-20">
                    <span className="text-white font-sans font-bold text-xs md:text-sm tracking-wider px-3 py-1 bg-[#111827]/90 rounded-[2px]">
                      From {item.priceFrom}
                    </span>
                  </div>

                  {/* Content Bottom Left */}
                  <div className="relative z-20 p-4 sm:p-5 flex flex-col gap-1 max-w-[85%]">
                    <h3 className="text-white font-heading font-semibold text-base md:text-lg lg:text-[20px] leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-neutral-200 text-xs font-normal line-clamp-1 leading-normal">
                      {item.description}
                    </p>
                    <div className="flex items-center gap-1.5 text-neutral-300 font-sans text-[11px] font-semibold tracking-wider uppercase mt-1">
                      <span>
                        {item.journeyType} • {item.days} • {item.style}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default JourneyCmsSignatureJourneysPreview
