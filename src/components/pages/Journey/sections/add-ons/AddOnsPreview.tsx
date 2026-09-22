const TITLE_CSS =
  "text-[#313131] text-2xl tracking-normal leading-8 " +
  "md:text-4xl md:tracking-[0.5px] md:leading-10 " +
  "lg:text-[36px] lg:tracking-[1px] lg:leading-[42px] " +
  "lgx:text-[38px] lgx:tracking-[1.2px] lgx:leading-[44px] " +
  "xlg:text-[38px] xlg:tracking-[1.5px] xlg:leading-[46px] " +
  "mid:text-[40px] mid:tracking-[2px] mid:leading-[48px] " +
  "xl:text-[40px] xl:tracking-[2px] xl:leading-[48px] " +
  "font-serif font-medium"

export function AddOnsPreview({ addOns, draft }: { addOns?: any; draft?: any }) {
  const safeAddOns = addOns || draft?.addOns || {}

  const addOnItems =
    safeAddOns.itemsList && safeAddOns.itemsList.length > 0
      ? safeAddOns.itemsList
      : [
          {
            id: "addon-1",
            title: "Private Helicopter Scenic Tour",
            category: "EXCURSION",
            duration: "45 Mins",
            price: 450,
            currency: "EUR",
            description: "Experience dramatic aerial views over the Albanian Alps and Ionian Riviera coastline.",
            features: ["Private Certified Pilot", "Champagne Toast", "Helipad Transfer"],
            image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
          },
          {
            id: "addon-2",
            title: "Exclusive Sommelier Masterclass",
            category: "GASTRONOMY",
            duration: "2.5 Hours",
            price: 180,
            currency: "EUR",
            description: "Taste rare vintage wines guided by Albania's premier sommelier.",
            features: ["5 Vintage Reserves", "Artisanal Cheese Pairing", "Sommelier Notes"],
            image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=800&q=80",
          },
        ]

  return (
    <div className="w-full flex flex-col gap-8">
      <div className="flex flex-col gap-2 border-b border-[#D8CBB8] pb-4">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#af6348]">
          OPTIONAL EXPERIENCES
        </span>
        <h2 className={TITLE_CSS}>
          {safeAddOns.title || "Enhance Your Journey"}
        </h2>
        <p className="text-[#565e69] text-sm md:text-base">
          {safeAddOns.description || "Select exclusive optional upgrades to personalize your journey."}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {addOnItems.map((item: any, idx: number) => {
          const priceFormatted = `${item.currency === "EUR" ? "€" : item.currency === "USD" ? "$" : item.currency || "€"}${item.price || 250}`
          return (
            <div
              key={item.id || idx}
              className="rounded-[10px] border border-[#D8CBB8] bg-white overflow-hidden shadow-xs flex flex-col"
            >
              {item.image && (
                <div className="h-[180px] w-full relative">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover object-center"
                  />
                  {item.category && (
                    <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#182d09] text-white text-xs font-semibold uppercase tracking-wider">
                      {item.category}
                    </span>
                  )}
                </div>
              )}
              <div className="p-6 flex flex-col gap-3 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-serif text-lg font-semibold text-[#080c1d]">
                    {item.title}
                  </h4>
                  <span className="text-base font-semibold text-[#af6348] shrink-0">
                    + {priceFormatted}
                  </span>
                </div>
                <p className="text-xs md:text-sm text-[#565e69] leading-relaxed">
                  {item.description}
                </p>
                {item.features && item.features.length > 0 && (
                  <ul className="flex flex-col gap-1.5 pt-2 mt-auto">
                    {item.features.map((feat: string, fIdx: number) => (
                      <li key={fIdx} className="flex items-center gap-2 text-xs text-[#464136]">
                        <span className="text-[#af6348]">✓</span>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
