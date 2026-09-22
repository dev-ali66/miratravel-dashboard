const CONFIRM_MARK_IMG = "/images/confirm-mark.png"

const TITLE_CSS =
  "text-[#313131] text-2xl tracking-normal leading-8 " +
  "md:text-4xl md:tracking-[0.5px] md:leading-10 " +
  "lg:text-[36px] lg:tracking-[1px] lg:leading-[42px] " +
  "lgx:text-[38px] lgx:tracking-[1.2px] lgx:leading-[44px] " +
  "xlg:text-[38px] xlg:tracking-[1.5px] xlg:leading-[46px] " +
  "mid:text-[40px] mid:tracking-[2px] mid:leading-[48px] " +
  "xl:text-[40px] xl:tracking-[2px] xl:leading-[48px] " +
  "font-serif font-medium"

export function WhatsIncludedPreview({ whatsIncluded, draft }: { whatsIncluded?: any; draft?: any }) {
  const safeInc = whatsIncluded || draft?.whatsIncluded || {}

  const inclusions =
    safeInc.inclusions && safeInc.inclusions.length > 0
      ? safeInc.inclusions.map((i: any) => i.title || i)
      : [
          "All boutique hotel accommodations (8 nights)",
          "Daily gourmet breakfast and selected local dinners",
          "Private luxury vehicle with dedicated English-speaking chauffeur",
          "All entrance fees to castles, museums, and national parks",
          "Exclusive wine tasting session at family vineyards in Berat",
          "24/7 MIRA Concierge assistance throughout your journey",
        ]

  const exclusions =
    safeInc.exclusions && safeInc.exclusions.length > 0
      ? safeInc.exclusions.map((e: any) => e.title || e)
      : [
          "International flight tickets to/from Tirana",
          "Personal travel & medical insurance",
          "Unspecified meals, alcoholic beverages, and personal expenses",
          "Optional add-on excursions & private spa treatments",
        ]

  const notes =
    safeInc.notes && safeInc.notes.length > 0
      ? safeInc.notes
      : [
          "Private transfers are tailored to match your specific arrival flight time.",
          "Comfortable walking shoes are recommended for cobblestone historical centers.",
          "Custom extensions or itinerary adjustments are available upon request.",
        ]

  return (
    <div className="w-full flex flex-col gap-10">
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 w-full">
        {/* Included Column */}
        <div className="flex-1 flex flex-col gap-5 lg:pr-8 lg:border-r lg:border-[#D8CBB8]">
          <h2 className={TITLE_CSS}>
            What's Included
          </h2>
          <div className="flex flex-col gap-3">
            {inclusions.map((item: string, idx: number) => (
              <div key={idx} className="flex items-start gap-3 text-sm md:text-base leading-6 text-[#464136]">
                <span className="text-[#af6348] font-bold">✓</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Not Included Column */}
        <div className="flex-1 flex flex-col gap-5">
          <h2 className={TITLE_CSS}>
            What's Not Included
          </h2>
          <div className="flex flex-col gap-3">
            {exclusions.map((item: string, idx: number) => (
              <div key={idx} className="flex items-start gap-3 text-sm md:text-base leading-6 text-[#464136]">
                <span className="text-neutral-400 font-bold">✗</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Important Information Box */}
      <div className="w-full rounded-[10px] bg-[#F6F1ED] p-6 md:p-8 flex flex-col gap-4 relative border border-[#D8CBB8]/50 shadow-xs">
        <h3 className="text-[#080c1d] font-serif text-lg md:text-xl font-semibold">
          Important Information
        </h3>
        <ul className="flex flex-col gap-2.5 z-10">
          {notes.map((info: string, idx: number) => (
            <li key={idx} className="flex items-start gap-2.5 text-sm md:text-base text-[#464136]">
              <span className="select-none font-bold text-[#af6348]">•</span>
              <span>{info}</span>
            </li>
          ))}
        </ul>
        <img
          src={CONFIRM_MARK_IMG}
          alt=""
          className="pointer-events-none absolute bottom-4 right-4 w-[70px] h-[75px] object-contain opacity-40"
        />
      </div>
    </div>
  )
}
