import { useState } from "react"
import { getStr } from "../../shared/previewHelpers"
import { DynamicStyledTextPreview } from "@/components/pages/CMS/shared/DynamicStyledTextPreview"
import { UniversalMultimediaPreview } from "@/components/pages/CMS/Home/shared/preview/UniversalMultimediaPreview"

export function AddOnsPreview({ addOns, draft }: { addOns?: any; draft?: any }) {
  const safeAddOns = addOns || draft?.addOns || {}

  const addOnItems =
    safeAddOns.items && safeAddOns.items.length > 0
      ? safeAddOns.items
      : safeAddOns.itemsList && safeAddOns.itemsList.length > 0
      ? safeAddOns.itemsList
      : [
          {
            title: "Cycling",
            price: "3,495",
            currency: "$",
            day: "Day 1",
            heading: "Make your trip fun by cycling",
            description:
              "Explore scenic countryside trails and historic villages on premium bikes, guided by local cycling experts with refreshment stops along the way.",
            multimedia: { show: "image", image: { url: "/images/albania-journey4.jpg" } },
            button: { label: "Add this item" },
          },
          {
            title: "Boat riding",
            price: "3,495",
            currency: "$",
            day: "Day 2",
            heading: "Scenic Coastal Boat Exploration",
            description:
              "Cruise along secluded crystalline bays, hidden sea caves, and pristine swimming coves accessible only by private boat.",
            multimedia: { show: "image", image: { url: "/images/albania-journey5.jpg" } },
            button: { label: "Add this item" },
          },
          {
            title: "Zipline over the Tara Canyon",
            price: "3,495",
            currency: "$",
            day: "Day 3",
            heading: "Thrilling Tara Canyon Aerial Ride",
            description:
              "Soar across panoramic gorges and dramatic mountain valleys with state-of-the-art safety gear and breathtaking aerial views.",
            multimedia: { show: "image", image: { url: "/images/albania-journey6.jpg" } },
            button: { label: "Add this item" },
          },
        ]

  const eyebrowText = getStr(safeAddOns.eyebrow, "OPTIONAL EXPERIENCES")
  const titleText = getStr(safeAddOns.title, "Add some fun in your trip")

  const [expandedId, setExpandedId] = useState<string | number | null>(null)
  const [addedItems, setAddedItems] = useState<Record<string | number, boolean>>({})

  const toggleExpand = (id: string | number) => {
    setExpandedId((prev) => (prev === id ? null : id))
  }

  const toggleAddItem = (id: string | number) => {
    setAddedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  return (
    <div className="w-full max-w-[120rem] mx-auto flex flex-col">
      <section className="w-full">
        <div className="w-full flex flex-col gap-5 md:gap-6 lg:gap-7 lgx:gap-[30px] xlg:gap-[30px] mid:gap-[30px] xl:gap-8">
          {/* Section Header */}
          <div className="flex flex-col gap-1.5">
            {eyebrowText && (
              <span className="text-xs font-bold uppercase tracking-widest text-[#af6348]">
                {eyebrowText}
              </span>
            )}
            <h2 className="text-[#182d09] font-serif text-xl md:text-[26px] lg:text-[28px] lgx:text-[32px] xlg:text-[34px] mid:text-[36px] xl:text-[38px] 2xl:text-[40px] font-medium leading-7 md:leading-9 lg:leading-10 lgx:leading-[42px] xlg:leading-[42px] mid:leading-[44px] xl:leading-[44px]">
              {titleText}
            </h2>
            {safeAddOns.description && (
              <DynamicStyledTextPreview
                data={safeAddOns.description}
                className="text-[#565e69] text-sm md:text-base leading-6 tracking-[0.5px]"
              />
            )}
          </div>

          {/* Addon Accordion List */}
          <div className="flex flex-col gap-3.5 md:gap-4 lg:gap-[18px] lgx:gap-[18px] xlg:gap-[19px] mid:gap-[19px] xl:gap-5 w-full">
            {addOnItems.map((item: any, index: number) => {
              const itemId = item.id ?? index + 1
              const isExpanded = expandedId === itemId
              const isAdded = !!addedItems[itemId]
              const itemNum = index + 1
              const itemTitle = getStr(item.title, "Upgrade Experience")
              const itemPrice = getStr(item.price, "")
              const itemCurr = getStr(item.currency, "$")
              const formattedPrice = itemPrice
                ? itemPrice.startsWith("$") || itemPrice.startsWith("€") || itemPrice.startsWith("£")
                  ? itemPrice
                  : `${itemCurr}${itemPrice}`
                : ""
              const dayLabel = getStr(item.day ?? item.dayLabel, `Day ${index + 1}`)
              const detailedHeading = getStr(item.heading ?? item.detailedHeading, itemTitle)
              const multimedia =
                item.multimedia ||
                item.imageMultimedia || {
                  show: "image",
                  image: { url: typeof item.image === "string" ? item.image : item.thumbnail || "" },
                }
              const btnLabel = getStr(item.button?.label ?? item.button, "Add this item")

              return (
                <div
                  key={itemId}
                  className={`w-full rounded-[8px] md:rounded-[10px] lg:rounded-[11px] lgx:rounded-[12px] xlg:rounded-[13px] mid:rounded-[14px] xl:rounded-[14px] 2xl:rounded-[16px] border overflow-hidden bg-neutral-100 transition-colors duration-200 ${
                    isExpanded ? "border-black/15" : "border-black/10 hover:border-black/20"
                  }`}
                >
                  {/* Clickable Header Row */}
                  <button
                    type="button"
                    onClick={() => toggleExpand(itemId)}
                    className="w-full p-3 xs:p-3.5 md:p-4 lg:p-[18px] lgx:p-[18px] xlg:p-[19px] mid:p-[19px] xl:p-5 flex items-center justify-between text-left cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-2.5 xs:gap-3 md:gap-3.5 lg:gap-4 lgx:gap-4 xlg:gap-[17px] mid:gap-[17px] xl:gap-[18px] min-w-0 flex-1">
                      {/* Number Badge */}
                      <div className="size-6 md:size-[26px] lg:size-7 lgx:size-[28px] xlg:size-[29px] mid:size-[30px] xl:size-8 2xl:size-9 shrink-0 bg-[#182d09] text-neutral-100 rounded-full flex items-center justify-center text-xs md:text-[12.5px] lg:text-[13px] lgx:text-[13.5px] xlg:text-[13.5px] mid:text-md xl:text-md 2xl:text-base font-medium leading-none">
                        {itemNum}
                      </div>

                      {/* Thumbnail */}
                      <div className="relative size-16 xs:size-[72px] md:size-20 lg:size-[84px] lgx:size-[86px] xlg:size-[88px] mid:size-[90px] xl:size-24 2xl:size-28 rounded-[6px] md:rounded-[8px] lg:rounded-[9px] lgx:rounded-[10px] xlg:rounded-[11px] mid:rounded-[11px] xl:rounded-[12px] shrink-0 overflow-hidden">
                        <UniversalMultimediaPreview
                          multimedia={multimedia}
                          className="w-full h-full object-cover object-center"
                          containerClassName="w-full h-full"
                        />
                      </div>

                      {/* Title and Price */}
                      <div className="flex flex-col items-start justify-center gap-1.5 md:gap-2 lg:gap-2.5 lgx:gap-[10px] xlg:gap-[10px] mid:gap-[11px] xl:gap-3 min-w-0">
                        <h3 className="text-[#080c1d] text-[17px] xs:text-[18px] md:text-[19px] lg:text-[20px] lgx:text-[21px] xlg:text-[22px] mid:text-[23px] xl:text-[24px] 2xl:text-[26px] font-semibold leading-snug md:leading-6 font-serif truncate max-w-full">
                          {itemTitle}
                        </h3>
                        {formattedPrice && (
                          <span className="text-[#af6348] text-[16px] xs:text-[17px] md:text-[18px] lg:text-[19px] lgx:text-[20px] xlg:text-[21px] mid:text-[22px] xl:text-[24px] 2xl:text-[26px] font-medium leading-none">
                            {formattedPrice}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Expand/Collapse Chevron */}
                    <div
                      className={`size-4 md:size-[18px] lg:size-5 lgx:size-[21px] xlg:size-[21px] mid:size-[22px] xl:size-6 aspect-square shrink-0 text-muted-foreground ml-2 md:ml-4 transition-transform duration-300 ${
                        isExpanded ? "rotate-180" : ""
                      }`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        className="w-full h-full"
                      >
                        <path
                          d="M12.0002 16.0002C11.8686 16.0009 11.7381 15.9757 11.6163 15.926C11.4944 15.8762 11.3836 15.8029 11.2902 15.7102L5.29019 9.71019C5.10188 9.52188 4.99609 9.26649 4.99609 9.00019C4.99609 8.73388 5.10188 8.47849 5.29019 8.29019C5.47849 8.10188 5.73388 7.99609 6.00019 7.99609C6.26649 7.99609 6.52188 8.10188 6.71019 8.29019L12.0002 13.5902L17.2902 8.30019C17.4815 8.13636 17.7276 8.05075 17.9792 8.06047C18.2309 8.0702 18.4697 8.17453 18.6477 8.35262C18.8258 8.53072 18.9302 8.76946 18.9399 9.02113C18.9496 9.27281 18.864 9.51888 18.7002 9.71019L12.7002 15.7102C12.5139 15.8949 12.2625 15.9991 12.0002 16.0002Z"
                          fill="currentColor"
                        />
                      </svg>
                    </div>
                  </button>

                  {/* Expanded Content Panel */}
                  {isExpanded && (
                    <div className="overflow-hidden border-t border-black/[0.06]">
                      <div className="pt-3 pb-5 xs:pt-4 xs:pb-6 md:pt-5 md:pb-7 lg:pt-[22px] lg:pb-[30px] lgx:pt-6 lgx:pb-8 xlg:pt-6 xlg:pb-8 mid:pt-6 mid:pb-8 xl:pt-6 xl:pb-8 flex flex-col gap-4 md:gap-5 lg:gap-6 lgx:gap-[26px] xlg:gap-[26px] mid:gap-7 xl:gap-7 px-3 md:px-4 lg:px-5 lgx:px-5 xlg:px-[22px] mid:px-6 xl:px-6">
                        <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-5 md:gap-6 lg:gap-6 lgx:gap-7 xlg:gap-7 mid:gap-8 xl:gap-8">
                          {/* Left Narrative Text */}
                          <div className="flex-1 flex flex-col justify-center p-3 xs:p-4 md:p-5 lg:p-6 lgx:p-7 xlg:p-[30px] mid:p-8 xl:p-8 2xl:p-10">
                            <div className="flex flex-col">
                              {dayLabel && (
                                <span className="text-[#af6348] text-[11px] md:text-[11.5px] lg:text-xs lgx:text-[12.5px] xlg:text-[12.5px] mid:text-[12.5px] xl:text-[12.5px] mb-2 md:mb-2.5 font-bold uppercase tracking-[0.85px] leading-tight">
                                  {dayLabel}
                                </span>
                              )}
                              {detailedHeading && (
                                <h4 className="text-black font-serif text-md md:text-[15px] lg:text-[15.5px] lgx:text-[15.5px] xlg:text-base xl:text-base 2xl:text-[17px] font-semibold uppercase tracking-[1.5px] md:tracking-[1.8px] lgx:tracking-[1.9px] xl:tracking-[2px] leading-snug md:leading-6 lg:leading-[26px] lgx:leading-[26px] xlg:leading-7 xl:leading-7 mb-2.5 md:mb-3 lgx:mb-[13px] xl:mb-3.5">
                                  {detailedHeading}
                                </h4>
                              )}
                              {item.description && (
                                <DynamicStyledTextPreview
                                  data={item.description}
                                  className="text-[#565e69] text-xs md:text-[13px] lg:text-[13.5px] lgx:text-md xlg:text-md mid:text-[13.5px] xl:text-md 2xl:text-[14.5px] font-normal tracking-[0.4px] md:tracking-[0.6px] lgx:tracking-[0.7px] xl:tracking-[0.8px] leading-relaxed md:leading-[25px] lgx:leading-[26px] xl:leading-[27px]"
                                />
                              )}
                            </div>

                            {/* Add this item CTA Button */}
                            <div className="pt-4 md:pt-5 lg:pt-[22px] lgx:pt-6 xlg:pt-6 mid:pt-6 xl:pt-6">
                              <button
                                type="button"
                                onClick={() => toggleAddItem(itemId)}
                                className={`group relative flex h-[44px] xs:h-[46px] md:h-[48px] lg:h-[50px] lgx:h-[52px] xl:h-[54px] 2xl:h-[56px] w-[340px] max-w-full items-center justify-center overflow-hidden rounded-[2px] px-4 py-2 text-xs md:text-md font-semibold text-neutral-100 transition-colors duration-200 cursor-pointer ${
                                  isAdded ? "bg-lime-900" : "bg-[#182d09]"
                                }`}
                              >
                                <span className="relative z-10 flex items-center justify-center gap-2">
                                  {isAdded ? "Added to trip ✓" : btnLabel}
                                </span>
                              </button>
                            </div>
                          </div>

                          {/* Right Visual Image */}
                          <div className="w-full lg:w-[340px] lgx:w-[370px] xlg:w-[400px] mid:w-[430px] xl:w-[460px] 2xl:w-[490px] h-[200px] xs:h-[220px] md:h-[240px] lg:h-[260px] lgx:h-[265px] xlg:h-[270px] mid:h-[275px] xl:h-[280px] 2xl:h-[300px] relative rounded-[8px] md:rounded-[10px] lg:rounded-r-[11px] lgx:rounded-r-[12px] xlg:rounded-r-[13px] mid:rounded-r-[14px] xl:rounded-r-[14px] 2xl:rounded-r-[16px] lg:rounded-l-none overflow-hidden shrink-0 group select-none cursor-pointer">
                            <UniversalMultimediaPreview
                              multimedia={multimedia}
                              className="w-full h-full object-cover object-center"
                              containerClassName="w-full h-full"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}

export default AddOnsPreview
