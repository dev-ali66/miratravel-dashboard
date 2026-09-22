import { UniversalMultimediaPreview } from "@/components/pages/CMS/Home/shared/preview/UniversalMultimediaPreview"
import { DynamicStyledTextPreview } from "@/components/pages/CMS/shared/DynamicStyledTextPreview"

const SIGNATURE_LABEL_IMG = "/images/singnature-label.png"
const DEFAULT_HERO_BG = "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80"

export function HeroPreview({ hero, draft }: { hero?: any; draft?: any }) {
  const heroData = hero || draft?.hero || {}
  const rawLabel = heroData.label || draft?.label
  const rawTitle = heroData.title || draft?.title
  const heroMultimedia = heroData.backgroundMultimedia

  const titleVal = typeof rawTitle === "object" ? rawTitle?.value : rawTitle
  const isSignature = Boolean(
    (typeof rawLabel === "string" && /signature/i.test(rawLabel)) ||
      (titleVal && /classic albania/i.test(titleVal))
  )

  const tags = [
    `${draft?.minDays || 9} DAYS`,
    draft?.pace || "BALANCED",
    draft?.comfortLevel?.replace(/_/g, " ") || "BOUTIQUE",
    ...(draft?.journeyType || []).slice(0, 1).map((t: string) => t.replace(/_/g, " ")),
  ].filter(Boolean)

  return (
    <section className="relative flex min-h-[600px] md:h-[680px] lg:h-[700px] xl:h-[725px] w-full items-end overflow-hidden">
      <UniversalMultimediaPreview
        multimedia={heroMultimedia ?? undefined}
        fallbackImageSrc={DEFAULT_HERO_BG}
        mode="background"
        className="h-full w-full object-cover object-center"
        containerClassName="absolute inset-0 z-0 h-full w-full"
      />

      <div
        className="absolute inset-0 z-10 bg-[linear-gradient(180deg,rgba(193,203,206,0.30)_0%,rgba(28,28,28,0.30)_100%)] pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative z-20 w-full xl:pb-[80px] lg:pb-[70px] md:pb-[60px] sm:pb-[48px] pb-[36px] xl:pl-[136px] lg:pl-[96px] md:pl-[56px] sm:pl-[36px] pl-[20px] xl:pr-[136px] lg:pr-[96px] md:pr-[56px] sm:pr-[36px] pr-[20px]">
        <div className="flex w-full max-w-[680px] flex-col items-start gap-4 sm:gap-5">
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
              className="inline-flex items-center justify-center bg-neutral-100/90 px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-sm"
            />
          ) : null}

          <DynamicStyledTextPreview
            as="h1"
            data={rawTitle}
            fallbackText="Classic Albania & The Ionian Coast"
            fallbackColor="#FFFFFF"
            className="font-serif xl:text-[72px] mid:text-[68px] lgx:text-[64px] lg:text-[60px] md:text-[52px] text-[32px] font-[600] capitalize xl:leading-[92px] mid:leading-[88px] lgx:leading-[84px] lg:leading-[80px] md:leading-[66px] leading-[42px] drop-shadow-sm"
          />

          {tags && tags.length > 0 && (
            <div className="inline-flex flex-wrap justify-start items-center gap-2 md:gap-2.5">
              {tags.slice(0, 3).map((tag, idx) => (
                <span
                  key={idx}
                  className="border border-white/40 bg-black/40 text-white backdrop-blur-md px-3.5 py-1 text-xs font-medium uppercase tracking-wider rounded-full"
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
