import { DynamicStyledTextPreview } from "@/components/pages/CMS/shared/DynamicStyledTextPreview"
import { UniversalMultimediaPreview } from "@/components/pages/CMS/Home/shared/preview/UniversalMultimediaPreview"
import type { LocationPreviewSectionProps } from "../../config/locationSections"

const defaultFacts = [
  { label: "Coastline", value: "170 km", description: "Ionian & Adriatic coastline" },
  { label: "Sunshine", value: "300+ Days", description: "Mediterranean sunshine annually" },
  { label: "Water Temp", value: "24–27°C", description: "Peak summer swimming" },
  { label: "Best Access", value: "Vlorë / Sarandë", description: "Coastal highway or ferry" },
  { label: "Beach Season", value: "May – Oct", description: "Peak window: Jun–Sep" },
  { label: "Currency", value: "Albanian Lek / EUR", description: "Cards accepted in towns" },
]

export function StatsPreview({ draft }: LocationPreviewSectionProps) {
  const statsData =
    draft?.stats ||
    draft?.statistics ||
    (draft as any)?.data?.stats ||
    (draft as any)?.data?.statistics ||
    {}

  const rawFacts = statsData.items || statsData.facts || (draft as any)?.data?.stats?.items || (draft as any)?.data?.stats?.facts || (draft as any)?.data?.statistics?.items || (draft as any)?.data?.statistics?.facts
  const facts = Array.isArray(rawFacts) && rawFacts.length > 0 ? rawFacts : defaultFacts

  return (
    <section
      id="region-stats"
      className="relative w-full pb-[48px] @md:pb-[52px] @lg:pb-[60px] @lgx:pb-[64px] @xlg:pb-[69px] @mid:pb-[74px] @xl:pb-[80px]"
    >
      {/* Background Media / Color */}
      <UniversalMultimediaPreview
        multimedia={statsData.backgroundMultimedia}
        fallbackColor="#FFFFFF"
        mode="background"
      />

      <div className="relative z-10 container mx-auto px-4 @lg:px-0">
        <div className="w-full max-w-full @md:max-w-[720px] @lg:max-w-[920px] @lgx:max-w-[980px] @xlg:max-w-[1080px] @mid:max-w-[1180px] @xl:max-w-[1280px] mx-auto self-stretch grid grid-cols-2 @md:grid-cols-3 @lgx:grid-cols-6 gap-4 @md:gap-5 @lg:gap-6 @lgx:gap-4 @xlg:gap-5 @mid:gap-[22px] @xl:gap-6 border-l border-[rgba(26,21,16,0.12)] pl-6 @md:pl-[25px] @lg:pl-[26.5px] @lgx:pl-[28px] @xlg:pl-[29.5px] @mid:pl-[31px] @xl:pl-8">
          {facts.map((item: any, idx: number) => (
            <div
              key={idx}
              className="w-full max-w-[252px] py-3 @md:py-[13px] @lg:py-[14.5px] @lgx:py-4 @xlg:py-[17px] @mid:py-[18.5px] @xl:py-5 flex flex-col items-start gap-1.5 @md:gap-[6.5px] @lg:gap-[7px] @xl:gap-2"
            >
              <DynamicStyledTextPreview
                as="span"
                data={item.label}
                fallbackColor="#565e69"
                className="text-muted text-[11px] @md:text-[11.3px] @lg:text-[11.7px] @lgx:text-[12px] @xlg:text-[12.4px] @mid:text-[12.7px] @xl:text-[13px] font-normal uppercase leading-[13.5px] @md:leading-[14px] @lg:leading-[14.5px] @lgx:leading-[15px] @xl:leading-4 tracking-[0.12px]"
              />

              <DynamicStyledTextPreview
                as="span"
                data={item.value}
                fallbackColor="#182d09"
                className="text-primary text-base @md:text-[17.5px] @lg:text-[19px] @lgx:text-[20px] @xlg:text-[22px] @mid:text-[24px] @xl:text-[26px] font-semibold font-heading leading-[20px] @md:leading-[21px] @lg:leading-[22.2px] @lgx:leading-[23px] @xlg:leading-[24px] @mid:leading-[25px] @xl:leading-[26px]"
              />

              <DynamicStyledTextPreview
                as="span"
                data={item.description}
                fallbackColor="#565e69"
                className="text-muted text-[11px] @md:text-[11.3px] @lg:text-[11.7px] @lgx:text-[12px] @xlg:text-[12.4px] @mid:text-[12.7px] @xl:text-[13px] font-normal leading-[15px] @md:leading-[15.5px] @lg:leading-[16px] @xl:leading-[17px] tracking-[0.12px]"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default StatsPreview
