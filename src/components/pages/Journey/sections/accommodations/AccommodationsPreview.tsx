import { Sparkles } from "lucide-react"
import { getStr } from "../../shared/previewHelpers"
import { UniversalMultimediaPreview } from "@/components/pages/CMS/Home/shared/preview/UniversalMultimediaPreview"
import { DynamicStyledTextPreview } from "@/components/pages/CMS/shared/DynamicStyledTextPreview"
import { useGetLocationById } from "@/hooks/location/useGetLocationById"


function PrincipleIcon({ type }: { type: string }) {
  switch (type) {
    case "character":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" fill="none" className="w-full h-full">
          <path d="M14 3C14 3 5 9 5 16C5 18.3869 5.94821 20.6761 7.63604 22.364C9.32387 24.0518 11.6131 25 14 25C16.3869 25 18.6761 24.0518 20.364 22.364C22.0518 20.6761 23 18.3869 23 16C23 9 14 3 14 3Z" stroke="#af6348" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M14 16C14.5304 16 15.0391 15.7893 15.4142 15.4142C15.7893 15.0391 16 14.5304 16 14C16 13.4696 15.7893 12.9609 15.4142 12.5858C15.0391 12.2107 14.5304 12 14 12C13.4696 12 12.9609 12.2107 12.5858 12.5858C12.2107 12.9609 12 13.4696 12 14C12 14.5304 12.2107 15.0391 12.5858 15.4142C12.9609 15.7893 13.4696 16 14 16Z" stroke="#af6348" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    case "location":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" fill="none" className="w-full h-full">
          <path d="M14 24C19.5228 24 24 19.5228 24 14C24 8.47715 19.5228 4 14 4C8.47715 4 4 8.47715 4 14C4 19.5228 8.47715 24 14 24Z" stroke="#af6348" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M14 4V24M4 14H24" stroke="#af6348" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M7 7.5C9 11 11 13 14 14C17 13 19 11 21 7.5" stroke="#af6348" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M7 20.5C9 17 11 15 14 14C17 15 19 17 21 20.5" stroke="#af6348" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    case "comfort":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" fill="none" className="w-full h-full">
          <path d="M4 20V10L14 3L24 10V20" stroke="#af6348" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M18 14H10V22H18V14Z" stroke="#af6348" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M14 14V22" stroke="#af6348" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    case "connection":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" fill="none" className="w-full h-full">
          <path d="M14 5C10.7 5 8 7.7 8 11C8 15 14 23 14 23C14 23 20 15 20 11C20 7.7 17.3 5 14 5Z" stroke="#af6348" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M14 13C15.1046 13 16 12.1046 16 11C16 9.89543 15.1046 9 14 9C12.8954 9 12 9.89543 12 11C12 12.1046 12.8954 13 14 13Z" stroke="#af6348" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    default:
      return <Sparkles className="w-full h-full text-[#af6348]" />
  }
}

function StayCard({ stay, idx }: { stay: any; idx: number }) {
  const locationId = stay.locationId
  const { data: locationResponse } = useGetLocationById(locationId || undefined)
  const locData = locationResponse?.data || locationResponse
  const locHero = locData?.hero || locData?.data?.hero || {}

  const stepLabel = stay.step || `0${idx + 1}`
  const durationLabel = getStr(stay.duration, "2 nights")

  const locationTitle =
    getStr(locHero.title) ||
    getStr(locData?.name || locData?.city) ||
    getStr(stay.location || stay.name || stay.city, "Tirana")

  const staySubtitle =
    getStr(stay.stayType || stay.subtitle) ||
    getStr(locHero.label, "URBAN BOUTIQUE STAY")

  const confirmedText = getStr(stay.confirmationBadge || stay.confirmedBy, "Personally confirmed by Mira")

  const media =
    stay.multimedia ||
    locHero.backgroundMultimedia ||
    locData?.multimedia ||
    { show: "image", image: { url: typeof stay.image === "string" ? stay.image : stay.image?.url || "" } }

  return (
    <div className="w-full overflow-hidden bg-neutral-100 rounded-[10px] border border-black/10 grid grid-cols-1 md:grid-cols-12 group transition-all duration-300">
      {/* Image Container (Left 5 Cols) */}
      <div className="relative w-full min-h-[240px] xs:min-h-[260px] md:min-h-[300px] md:col-span-5 overflow-hidden">
        <UniversalMultimediaPreview
          multimedia={media}
          className="w-full h-full object-cover object-center"
          containerClassName="w-full h-full min-h-[240px]"
        />
      </div>

      {/* Content Container (Right 7 Cols) */}
      <div className="relative p-6 md:p-8 lg:p-10 md:col-span-7 flex flex-col justify-between gap-6">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-4 text-[#af6348] text-xs md:text-[13px] uppercase tracking-[2px]">
            <span className="text-[#af6348]/70">{stepLabel}</span>
            {durationLabel && <span>{durationLabel}</span>}
          </div>

          <div>
            <h3 className="text-[#080c1d] text-2xl md:text-[28px] lg:text-[30px] leading-snug font-serif font-medium tracking-[1.5px]">
              {locationTitle}
            </h3>
            {staySubtitle && (
              <span className="text-[#af6348] text-xs md:text-[13px] uppercase tracking-[1.8px] mt-2 block">
                {staySubtitle}
              </span>
            )}
          </div>

          <DynamicStyledTextPreview
            data={stay.description || locData?.overview?.description || locData?.description}
            fallbackText="Experience curated accommodation during your stay."
            className="text-[#565e69] text-xs md:text-sm lg:text-base leading-relaxed mt-2 font-normal"
          />
        </div>

        {/* Confirmation Badge Footer */}
        <div className="pt-5 border-t border-black/10 flex items-center gap-2 text-[#af6348] text-xs md:text-[13px] uppercase tracking-[1.8px] font-medium">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0 size-4">
            <g clipPath="url(#clip_pin_icon)">
              <path d="M8 9C9.65685 9 11 7.65685 11 6C11 4.34315 9.65685 3 8 3C6.34315 3 5 4.34315 5 6C5 7.65685 6.34315 9 8 9Z" stroke="#af6348" strokeWidth="1.2" strokeLinecap="round" />
              <path d="M8 1C5.2 1 3 3.2 3 6C3 10 8 15 8 15C8 15 13 10 13 6C13 3.2 10.8 1 8 1Z" stroke="#af6348" strokeWidth="1.2" strokeLinecap="round" />
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
}

export function AccommodationsPreview({ accommodations, draft }: { accommodations?: any; draft?: any }) {
  const safeAcc = accommodations || draft?.accommodations || {}

  const philData = safeAcc.philosophy || {}
  const destData = safeAcc.destinationStays || safeAcc.destinations || {}
  const stdData = safeAcc.standards || {}
  const visData = safeAcc.visualReference || {}

  const principles =
    (philData.items && philData.items.length > 0)
      ? philData.items
      : [
          {
            iconType: "character",
            title: "Character",
            description: "Properties with local identity, atmosphere and a genuine sense of place — never interchangeable, always memorable.",
            multimedia: { show: "image", image: { url: "" } },
          },
          {
            iconType: "location",
            title: "Location",
            description: "Carefully positioned so guests experience each destination from its most meaningful vantage point.",
            multimedia: { show: "image", image: { url: "" } },
          },
          {
            iconType: "comfort",
            title: "Comfort",
            description: "Selected for quality of service, cleanliness and the warmth of the guest experience above all else.",
            multimedia: { show: "image", image: { url: "" } },
          },
          {
            iconType: "connection",
            title: "Connection",
            description: "Places that draw travelers closer to local culture, architecture and the authentic rhythms of daily life.",
            multimedia: { show: "image", image: { url: "" } },
          },
        ]

  const stays =
    (destData.items && destData.items.length > 0)
      ? destData.items
      : [
          {
            step: "01",
            duration: "2 nights",
            location: "Tirana",
            stayType: "Urban Boutique Stay",
            description: "Begin your journey in a stylish boutique property in or near the heart of Albania's vibrant, rapidly transforming capital.",
            confirmationBadge: "Personally confirmed by Mira",
            multimedia: { show: "image", image: { url: "" } },
          },
          {
            step: "02",
            duration: "2 nights",
            location: "Berat",
            stayType: "Historic Heritage Stay",
            description: "Experience the rare charm of a UNESCO World Heritage town from a carefully selected traditional property overlooking the white city.",
            confirmationBadge: "Personally confirmed by Mira",
            multimedia: { show: "image", image: { url: "" } },
          },
          {
            step: "03",
            duration: "2 nights",
            location: "Gjirokastër",
            stayType: "Stone City Retreat",
            description: "Stay within walking distance of the historic bazaar and castle district — a property steeped in the atmosphere of the Ottoman era.",
            confirmationBadge: "Personally confirmed by Mira",
            multimedia: { show: "image", image: { url: "" } },
          },
          {
            step: "04",
            duration: "2–3 nights",
            location: "Albanian Riviera",
            stayType: "Seaside Boutique Escape",
            description: "Close out your journey surrounded by relaxed Mediterranean light, turquoise waters and unhurried coastal hospitality.",
            confirmationBadge: "Personally confirmed by Mira",
            multimedia: { show: "image", image: { url: "" } },
          },
        ]

  const standards =
    (stdData.items && stdData.items.length > 0)
      ? stdData.items
      : [
          "Boutique and small-scale properties",
          "Family-owned accommodations",
          "Heritage properties where available",
          "Private bathroom in all rooms",
          "Daily breakfast included",
          "Premium central locations",
          "Personally selected by Mira",
          "Regularly reviewed for quality",
          "Local character in every stay",
        ]

  const visualItems =
    (visData.items && visData.items.length > 0)
      ? visData.items
      : [
          { show: "image", image: { url: "", alt: "Atmospheric boutique bedroom in Albania" } },
          { show: "image", image: { url: "", alt: "Scenic coastal terrace view" } },
          { show: "image", image: { url: "", alt: "Historic stone architecture and interior details" } },
        ]

  const visualFeatured = visualItems[0] || { show: "image", image: { url: "", alt: "Atmospheric boutique bedroom in Albania" } }
  const visualGallery = visualItems.slice(1)

  const philEyebrow = getStr(philData.eyebrow || philData.badge, "OUR PHILOSOPHY")
  const philTitle = getStr(philData.title, "Our Accommodation Philosophy")

  const destEyebrow = getStr(destData.eyebrow || destData.badge, "DESTINATION BY DESTINATION")
  const destTitle = getStr(destData.title || destData.handpickedTitle, "Your Accommodation Journey")

  const stdEyebrow = getStr(stdData.eyebrow || stdData.badge, "STANDARDS")
  const stdTitle = getStr(stdData.title, "What You Can Expect")

  const visEyebrow = getStr(visData.eyebrow || visData.badge, "VISUAL REFERENCE")
  const visTitle = getStr(visData.title, "Examples of the Accommodation Style")

  return (
    <div className="w-full max-w-[120rem] mx-auto flex flex-col gap-12 md:gap-16">
      {/* 1. Our Philosophy Section */}
      <section className="w-full">
        <div className="w-full flex flex-col gap-6 md:gap-8">
          {/* Section Header */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 md:gap-6 pb-6 border-b border-black/10">
            <div className="flex flex-col gap-2.5 w-full lg:max-w-[405px]">
              <span className="text-[#af6348] text-xs font-semibold tracking-[1.5px] uppercase">
                {philEyebrow}
              </span>
              <h2 className="text-[#080c1d] font-serif text-2xl md:text-[32px] lg:text-[36px] font-medium leading-snug">
                {philTitle}
              </h2>
            </div>
            <DynamicStyledTextPreview
              data={philData.description}
              fallbackText="Mira does not simply book hotels. Every property we recommend is chosen against four principles that together ensure each stay becomes a meaningful part of the journey, not merely a place to sleep."
              className="text-[#565e69] text-sm md:text-base leading-relaxed w-full lg:max-w-[50%] lg:max-w-[600px]"
            />
          </div>

          {/* 4 Principles Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-8 border-b border-black/10">
            {principles.map((item: any, idx: number) => {
              const pTitle = getStr(item.title, `Principle #${idx + 1}`)
              const hasMedia = Boolean(item.multimedia?.image?.url || item.multimedia?.video?.url)

              return (
                <div
                  key={idx}
                  className="group relative overflow-hidden bg-neutral-100 p-6 md:p-8 rounded-[8px] border border-black/10 flex flex-col items-start gap-5 hover:border-black/20 transition-all duration-300"
                >
                  <div className="size-6 md:size-7 flex items-center justify-center shrink-0">
                    {hasMedia ? (
                      <UniversalMultimediaPreview
                        multimedia={item.multimedia}
                        className="w-full h-full object-contain"
                        containerClassName="w-full h-full"
                      />
                    ) : (
                      <PrincipleIcon type={item.iconType || item.icon || "character"} />
                    )}
                  </div>

                  <div className="flex flex-col gap-2 w-full">
                    <h3 className="text-[#080c1d] text-base md:text-lg font-serif font-semibold group-hover:text-[#af6348] transition-colors">
                      {pTitle}
                    </h3>
                    <DynamicStyledTextPreview
                      data={item.description || item.subtitle}
                      className="text-[#565e69] text-xs md:text-sm leading-relaxed"
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* 2. Destination by Destination Stays Section */}
      <section className="w-full">
        <div className="w-full flex flex-col gap-6 md:gap-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 md:gap-6 pb-6 border-b border-black/10">
            <div className="flex flex-col gap-2.5 w-full lg:max-w-[515px]">
              <span className="text-[#af6348] text-xs font-semibold tracking-[1.5px] uppercase">
                {destEyebrow}
              </span>
              <h2 className="text-[#080c1d] font-serif text-2xl md:text-[32px] lg:text-[36px] font-medium leading-snug">
                {destTitle}
              </h2>
            </div>
            <DynamicStyledTextPreview
              data={destData.description}
              fallbackText="Each destination on your route offers a distinct type of stay. Below we outline the character and setting of accommodation at each stop — exact properties are confirmed personally during the booking process."
              className="text-[#565e69] text-sm md:text-base leading-relaxed w-full lg:max-w-[50%] lg:max-w-[515px]"
            />
          </div>

          <div className="flex flex-col gap-6 md:gap-8">
            {stays.map((stay: any, idx: number) => (
              <StayCard key={idx} stay={stay} idx={idx} />
            ))}
          </div>
        </div>
      </section>

      {/* 3. Standards / What You Can Expect Section */}
      <section className="w-full">
        <div className="w-full flex flex-col lg:flex-row gap-8 lg:gap-12 items-start py-8 md:py-10 border-t border-black/10">
          <div className="w-full max-w-md lg:max-w-[380px] shrink-0 flex flex-col gap-3">
            <span className="text-[#af6348] text-xs font-semibold tracking-[1.5px] uppercase">
              {stdEyebrow}
            </span>
            <h2 className="text-[#080c1d] font-serif text-2xl md:text-[30px] font-medium leading-snug">
              {stdTitle}
            </h2>
            <DynamicStyledTextPreview
              data={stdData.description}
              fallbackText="Every stay on your Mira journey meets a consistent set of standards — so you can travel with confidence rather than questions."
              className="text-[#565e69] text-sm leading-relaxed mt-1"
            />
          </div>

          {/* Right Grid of Standard Items (1 col mobile, 3 cols sm+) */}
          <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-3 bg-[#F9F6ED] rounded-[10px] border border-[#D8CBB8]/60 overflow-hidden">
            {standards.map((item: any, idx: number) => {
              return (
                <div
                  key={idx}
                  className="px-6 py-5 flex items-center border-b sm:border-r border-[#D8CBB8]/60 last:border-b-0"
                >
                  <DynamicStyledTextPreview
                    data={item}
                    className="text-[#565e69] text-xs md:text-sm font-medium leading-relaxed"
                  />
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* 4. Visual Reference Section */}
      <section className="w-full">
        <div className="w-full flex flex-col gap-6 md:gap-8 pt-4 border-t border-black/10">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 md:gap-6 pb-6 border-b border-black/10">
            <div className="flex flex-col gap-2.5 w-full lg:max-w-[527px]">
              <span className="text-[#af6348] text-xs font-semibold tracking-[1.5px] uppercase">
                {visEyebrow}
              </span>
              <h2 className="text-[#080c1d] font-serif text-2xl md:text-[32px] lg:text-[36px] font-medium leading-snug">
                {visTitle}
              </h2>
            </div>
            <DynamicStyledTextPreview
              data={visData.description}
              fallbackText="The images below represent the style and standard of properties you can expect on this journey. Exact properties may vary depending on travel dates, availability and final itinerary design."
              className="text-[#565e69] text-sm md:text-base leading-relaxed w-full lg:max-w-[50%] lg:max-w-[515px]"
            />
          </div>

          <div className="flex flex-col lg:flex-row items-stretch gap-4 w-full">
            {/* Featured Large Image */}
            <div className="w-full lg:w-1/2 min-h-[260px] md:min-h-[360px] lg:min-h-[420px] rounded-[10px] overflow-hidden relative">
              <UniversalMultimediaPreview
                multimedia={visualFeatured}
                className="w-full h-full object-cover object-center"
                containerClassName="w-full h-full min-h-[260px] md:min-h-[360px] lg:min-h-[420px]"
              />
            </div>

            {/* Stacked Gallery Images */}
            <div className="w-full lg:w-1/2 flex flex-col md:flex-row lg:flex-col gap-4 justify-between">
              {visualGallery.slice(0, 2).map((img: any, idx: number) => (
                <div key={idx} className="w-full h-[180px] md:h-[200px] lg:h-[200px] rounded-[10px] overflow-hidden relative">
                  <UniversalMultimediaPreview
                    multimedia={img}
                    className="w-full h-full object-cover object-center"
                    containerClassName="w-full h-full h-[180px] md:h-[200px]"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

