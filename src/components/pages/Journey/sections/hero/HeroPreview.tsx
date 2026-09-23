import { UniversalMultimediaPreview } from "@/components/pages/CMS/Home/shared/preview/UniversalMultimediaPreview"
import { DynamicStyledTextPreview } from "@/components/pages/CMS/shared/DynamicStyledTextPreview"

const SIGNATURE_LABEL_IMG = "/images/singnature-label.png"

export function HeroPreview({ hero, draft }: { hero?: any; draft?: any }) {
  const heroData = hero || draft?.hero || {}
  const rawLabel = heroData.label
  const rawTitle = heroData.title

  const titleVal = typeof rawTitle === "object" ? rawTitle?.value : rawTitle
  const displayTitle = titleVal || "Classic Albania & The Ionian Coast"

  const isSignature = Boolean(
    (typeof rawLabel === "string" && /signature/i.test(rawLabel)) ||
    (displayTitle && /classic albania/i.test(displayTitle))
  )

  const heroMultimedia = heroData.backgroundMultimedia

  // Duration Tag
  const minDays = draft?.minDays ?? heroData?.minDays
  const maxDays = draft?.maxDays ?? heroData?.maxDays
  const daysText = minDays
    ? maxDays && maxDays !== minDays
      ? `${minDays}–${maxDays} DAYS`
      : `${minDays} DAYS`
    : null

  // Price Tag
  const priceVal = draft?.price ?? heroData?.price
  const priceText = priceVal
    ? `${draft?.currency || heroData?.currency || "EUR"} ${priceVal}`
    : null

  const getArray = (val: any): string[] => {
    if (!val) return []
    if (Array.isArray(val)) return val
    if (typeof val === "string") return [val]
    return []
  }

  const journeyTypes = getArray(draft?.journeyType || heroData?.journeyType)
  const travelStyles = getArray(draft?.travelStyle || heroData?.travelStyle)
  const perfectFors = getArray(draft?.perfectFor || heroData?.perfectFor)

  const paceVal = draft?.pace || heroData?.pace
  const comfortVal = draft?.comfortLevel || heroData?.comfortLevel

  // Combined Tags Bar Sync with Basic Info
  const tags = [
    daysText,
    priceText,
    paceVal ? `${paceVal} PACE` : null,
    comfortVal ? comfortVal.replace(/_/g, " ") : null,
    ...journeyTypes.map((t: string) => t.replace(/_/g, " ")),
    ...travelStyles.map((s: string) => s.replace(/_/g, " ")),
    ...perfectFors.map((p: string) => `FOR ${p.replace(/_/g, " ")}`),
  ].filter(Boolean)

  return (
    <section className="relative flex min-h-[600px] md:h-[680px] lg:h-[700px] xl:h-[725px] w-full items-end overflow-hidden">
      <UniversalMultimediaPreview
        multimedia={heroMultimedia ?? undefined}
        mode="background"
        className="h-full w-full object-cover object-center"
        containerClassName="absolute inset-0 z-0 h-full w-full"
      />

      <div
        className="absolute inset-0 z-10 bg-[linear-gradient(180deg,rgba(193,203,206,0.30)_0%,rgba(28,28,28,0.30)_100%)] pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative z-20 w-full xl:pb-[80px] lg:pb-[70px] md:pb-[60px] sm:pb-[48px] pb-[36px] xl:pl-[136px] lg:pl-[96px] md:pl-[56px] sm:pl-[36px] pl-[20px] xl:pr-[136px] lg:pr-[96px] md:pr-[56px] sm:pr-[36px] pr-[20px]">
        <div className="flex w-full max-w-[780px] flex-col items-start gap-4 sm:gap-5">
          {isSignature ? (
            <div>
              <img
                src={SIGNATURE_LABEL_IMG}
                alt="Signature Journey"
                className="w-[245px] h-[28px] shrink-0 aspect-[35/4] object-contain"
              />
            </div>
          ) : rawLabel ? (
            <DynamicStyledTextPreview
              as="div"
              data={rawLabel}
              fallbackText="MIRA EXCLUSIVE JOURNEY"
              fallbackColor="#af6348"
              className="inline-flex items-center justify-center bg-neutral-100/90 px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-xs"
            />
          ) : null}

          <DynamicStyledTextPreview
            as="h1"
            data={rawTitle}
            fallbackText="Classic Albania & The Ionian Coast"
            fallbackColor="#FFFFFF"
            className="font-serif xl:text-[72px] mid:text-[68px] lgx:text-[64px] lg:text-[60px] md:text-[52px] text-[32px] font-[600] capitalize xl:leading-[92px] mid:leading-[88px] lgx:leading-[84px] lg:leading-[80px] md:leading-[66px] leading-[42px] drop-shadow-xs"
          />

          {tags && tags.length > 0 && (
            <div className="inline-flex flex-wrap justify-start items-center gap-2 md:gap-2.5 pt-1">
              {tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="border border-white/40 bg-black/40 text-white backdrop-blur-md px-3.5 py-1 text-xs font-medium uppercase tracking-wider rounded-full shadow-2xs"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
