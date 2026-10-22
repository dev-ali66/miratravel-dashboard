import { UniversalMultimediaPreview } from "@/components/pages/CMS/shared/UniversalMultimediaPreview"
import { DynamicStyledTextPreview } from "@/components/pages/CMS/shared/DynamicStyledTextPreview"
import { DynamicCmsButtonPreview } from "@/components/pages/CMS/shared/DynamicCmsButtonPreview"
import { cn } from "@/lib/utils"
import { MapPin, Sparkles } from "lucide-react"
import type { ExperiencePreviewSectionProps } from "../../config/experienceSections"

const formatCurrencySymbol = (cur?: string | null) => {
  switch (cur?.toUpperCase()) {
    case "USD":
      return "$"
    case "GBP":
      return "£"
    case "CHF":
      return "CHF "
    case "ALL":
      return "Lek "
    case "EUR":
    default:
      return "€"
  }
}

const formatPriceType = (type?: string | null) => {
  if (!type) return ""
  return type.replace(/_/g, " ").toUpperCase()
}

export function HeroPreview({ draft }: ExperiencePreviewSectionProps) {
  const hero = draft?.hero || {}
  const isCenter = Boolean(hero.isCenter)
  const buttons = Array.isArray(hero.buttons) ? hero.buttons : []

  // Dynamic price calculation with 2 decimal places
  const priceNum = Number(draft?.price ?? 0)
  const formattedPrice = `${formatCurrencySymbol(draft?.currency || "EUR")}${priceNum.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
  const priceTypeStr = formatPriceType(draft?.priceType)
  const priceBadgeText = priceTypeStr ? `${formattedPrice} • ${priceTypeStr}` : formattedPrice

  const parentName = draft?.place?.name || draft?.country?.name || (draft as any)?.parent?.name
  const isFeatured = Boolean(draft?.featured)

  return (
    <section
      data-section="hero"
      className={cn(
        "relative flex min-h-[500px] h-[560px] @xs:h-[600px] @sm:h-[640px] @md:h-[720px] @lg:h-[740px] @xlg:h-[750px] @xl:h-[768px] w-full items-center overflow-hidden bg-[#171717] text-white",
        isCenter && "justify-center"
      )}
    >
      {/* Background Media (Image / Video / Color) */}
      <UniversalMultimediaPreview
        multimedia={hero.backgroundMultimedia || hero.multimedia}
        mode="background"
        overlayClassName="bg-gradient-to-t from-black/85 via-black/40 to-transparent"
      />

      {/* Hero Content Container */}
      <div
        className={cn(
          "relative z-10 mx-auto flex h-full w-full flex-col justify-end pb-[36px] @xs:pb-[42px] @sm:pb-[48px] @md:pb-[60px] @lg:pb-[70px] @xl:pb-[80px] pl-[20px] pr-[20px] @xs:pl-[28px] @xs:pr-[28px] @sm:pl-[36px] @sm:pr-[36px] @md:pl-[56px] @md:pr-[56px] @lg:pl-[96px] @lg:pr-[96px] @xl:pl-[136px] @xl:pr-[136px]"
        )}
      >
        <div className="flex w-full max-w-[880px] flex-col items-start text-left">
          {/* Top Badges / Tags Bar */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            {/* Price Badge */}
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#E5A84B]/60 bg-black/60 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-[#E5A84B] shadow-sm backdrop-blur-md">
              {priceBadgeText}
            </span>

            {/* Parent Location Badge */}
            {parentName && (
              <span className="inline-flex items-center gap-1 rounded-full border border-white/30 bg-black/50 px-3 py-1 text-xs font-medium text-white shadow-sm backdrop-blur-md">
                <MapPin className="h-3 w-3 text-accent" />
                {parentName}
              </span>
            )}

            {/* Featured Badge */}
            {isFeatured && (
              <span className="inline-flex items-center gap-1 rounded-full bg-[#af6348] px-3 py-1 text-xs font-semibold text-white shadow-sm tracking-wider uppercase">
                <Sparkles className="h-3 w-3" />
                Featured
              </span>
            )}
          </div>

          {/* Breadcrumb / Category Tag */}
          <DynamicStyledTextPreview
            as="span"
            data={hero.breadcrumb}
            className="text-xs @xs:text-[13px] @md:text-[15px] @xl:text-base font-semibold uppercase leading-5 @md:leading-[22px] @xl:leading-6 tracking-[2px] text-accent mb-2 @md:mb-2.5 @xl:mb-3"
          />

          {/* Hero Main Title */}
          <DynamicStyledTextPreview
            as="h1"
            data={hero.title}
            className="font-heading font-semibold text-[32px] @xs:text-[38px] @sm:text-[44px] @md:text-[52px] @lg:text-[56px] @xlg:text-[60px] @xl:text-[64px] leading-[40px] @xs:leading-[46px] @sm:leading-[52px] @md:leading-[60px] @lg:leading-[64px] @xlg:leading-[68px] @xl:leading-[72px] tracking-[0.905px] text-neutral-200 mb-3 @md:mb-3.5 @xl:mb-4"
          />

          {/* Hero Subtitle */}
          <DynamicStyledTextPreview
            as="h2"
            data={hero.subtitle}
            className="text-[14px] @xs:text-[15px] @sm:text-base @md:text-[17px] @xlg:text-[18px] @xl:text-[20px] leading-6 @md:leading-[28px] @xlg:leading-[34px] @xl:leading-[36px] font-medium text-neutral-200 mb-2 @md:mb-2.5 @xl:mb-3"
          />

          {/* Editorial Description with RichText Support */}
          <DynamicStyledTextPreview
            as="div"
            isRichText
            data={hero.description}
            className="max-w-[738px] text-[13px] @xs:text-[14px] @sm:text-base @md:text-[17px] @xlg:text-[18px] @xl:text-[20px] font-normal leading-5 @xs:leading-6 @md:leading-[28px] @xlg:leading-[34px] @xl:leading-[36px] text-neutral-100/90 mb-6"
          />

          {/* Reusable CTA Buttons List */}
          <DynamicCmsButtonPreview
            data={buttons}
            className="mt-2 justify-start"
          />
        </div>
      </div>
    </section>
  )
}

export default HeroPreview
