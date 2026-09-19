import type { ReactNode } from "react"
import { ImageShowPreview } from "@/components/shared/ImageShowPreview"
import type { HomeSection } from "../../homeTypes"
import { UniversalMultimediaPreview } from "@/components/pages/CMS/shared/UniversalMultimediaPreview"
import { DynamicStyledTextPreview } from "@/components/pages/CMS/shared/DynamicStyledTextPreview"
import { DynamicCmsButtonPreview } from "@/components/pages/CMS/shared/DynamicCmsButtonPreview"

const PREVIEW_IMAGE_SOURCE =
  "https://images.unsplash.com/photo-1530789253388-582c481c54b0?auto=format&fit=crop&w=1200&q=85"

const DEFAULT_PREVIEW_JOURNEYS = [
  {
    id: "preview-1",
    title: "Ancient Albania",
    description: "A slow journey through mountain villages, old stone towns, and the Adriatic coast.",
    days: "7 DAYS",
    priceFrom: "$1,890",
    label: "JOURNEY",
    image: "https://images.unsplash.com/photo-1530789253388-582c481c54b0?auto=format&fit=crop&w=1200&q=85",
    tags: ["History", "Culture", "Coast"],
  },
  {
    id: "preview-2",
    title: "Coastal Montenegro Monograph",
    description: "Dramatic fjords, Venetian islands, and serene coastal sanctuaries of Kotor.",
    days: "8 DAYS",
    priceFrom: "$2,450",
    label: "JOURNEY",
    image: "https://images.unsplash.com/photo-1565008447742-97f6f38c985c?auto=format&fit=crop&w=1200&q=85",
    tags: ["Coastal", "Luxury", "Heritage"],
  },
  {
    id: "preview-3",
    title: "Monasteries & Mountains of Bosnia",
    description: "Untamed rivers, Ottoman bridges, and spiritual mountain sanctuaries.",
    days: "10 DAYS",
    priceFrom: "$2,890",
    label: "JOURNEY",
    image: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=1200&q=85",
    tags: ["Nature", "Spiritual", "Mountains"],
  },
]

export type ExploreJourneysPreviewProps = {
  section: HomeSection
  accentColor: string
  darkText: string
  renderButtons?: (
    buttons?: any[],
    fullWidth?: boolean,
    alignRight?: boolean,
    mainButtonWidth?: boolean
  ) => ReactNode
}

export function ExploreJourneysPreview({
  section,
  accentColor,
  darkText,
}: ExploreJourneysPreviewProps) {
  const sec = section || {}
  const content = (sec.content ?? sec) as Record<string, any>
  const multimedia = sec.backgroundMultimedia || content.backgroundMultimedia || (sec as any).multimedia
  const buttons = Array.isArray(sec.buttons) ? sec.buttons : Array.isArray(content.buttons) ? content.buttons : []

  const itemsToRender =
    Array.isArray(sec.items) && sec.items.length > 0
      ? sec.items
      : DEFAULT_PREVIEW_JOURNEYS

  return (
    <section
      id="journeys"
      className="relative w-full overflow-hidden pt-[65px] md:pt-[90px] lg:pt-[100px] xlg:pt-[110px] xl:pt-[120px] pb-[65px] md:pb-[90px] lg:pb-[100px] xlg:pb-[110px] xl:pb-[120px]"
      style={{
        color: darkText,
      }}
    >
      <UniversalMultimediaPreview
        multimedia={multimedia}
        fallbackAlt="Explore Journeys background"
        fallbackColor="#FBF9F5"
        mode="background"
        overlayClassName="bg-white/70"
      />

      <div className="relative z-10 container mx-auto px-4 lg:px-0 flex w-full flex-col gap-14">
        <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-end">
          <div className="flex flex-col items-start gap-4">
            <DynamicStyledTextPreview
              as="p"
              data={sec.eyebrow ?? content.eyebrow}
              fallbackColor={accentColor}
              className="text-[10px] font-semibold tracking-[0.18em] uppercase"
            />

            <DynamicStyledTextPreview
              as="h2"
              data={sec.title ?? content.title}
              fallbackColor={darkText}
              className="max-w-[700px] font-serif text-[24px] leading-[24px] md:text-[28px] md:leading-[28px] lg:text-[30px] lg:leading-[30px] lgx:text-[34px] lgx:leading-[34px] mid:text-[36px] mid:leading-[36px] xlg:text-[38px] xlg:leading-[38px] xl:text-[40px] xl:leading-[40px]"
            />

            <DynamicStyledTextPreview
              as="p"
              data={sec.subtitle ?? content.subtitle}
              fallbackColor={darkText}
              className="text-sm font-normal text-muted-foreground"
            />
          </div>

          <DynamicStyledTextPreview
            as="p"
            data={sec.description ?? content.description}
            fallbackColor={darkText}
            className="xlg:max-w-[558px] max-w-[500px] text-sm font-normal leading-8 text-muted-foreground"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 lgx:gap-6 xlg:gap-7 xl:gap-10 md:grid-cols-2 lg:grid-cols-3">
          {itemsToRender.map((item: any, idx: number) => {
            const rawTitle = typeof item.title === "string" ? item.title : item.title?.text || item.title?.value
            const title = rawTitle || `Journey ${idx + 1}`

            const rawDesc = typeof item.description === "string" ? item.description : item.description?.text || item.description?.value
            const description = rawDesc || ""

            const image = item.image || item.media?.image?.url || item.media?.url || PREVIEW_IMAGE_SOURCE
            const days = item.days || item.subtitle || `${7 + idx} DAYS`
            const price = item.priceFrom ? (item.priceFrom.startsWith("$") ? item.priceFrom : `$${item.priceFrom}`) : "$1,890"
            const tags = Array.isArray(item.tags) && item.tags.length > 0 ? item.tags : (item.tag ? [item.tag] : ["Curated"])
            const label = item.label || "JOURNEY"

            return (
              <div
                key={item.id || idx}
                className="group border-border-muted/40 relative flex w-full flex-col overflow-hidden rounded-[8px] border bg-neutral-100 transition-all duration-300 hover:shadow-md"
              >
                <div className="lgx:h-[413px] relative h-[280px] w-full shrink-0 overflow-hidden rounded-sm md:h-[380px]">
                  <div className="relative h-full w-full overflow-hidden bg-muted">
                    <ImageShowPreview
                      src={image}
                      alt={title}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>

                  <div
                    className="absolute top-4 left-4 z-10 rounded-full px-3 py-1 text-[10px] font-bold tracking-[0.08em] uppercase"
                    style={{
                      backgroundColor: item.labelBg || "#FEF3C7",
                      color: item.labelTextColor || "#9A3412",
                    }}
                  >
                    {label}
                  </div>

                  <div className="absolute top-4 right-4 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-transparent bg-neutral-100 text-sm shadow-sm">
                    ♡
                  </div>

                  <div className="absolute bottom-4 left-4 z-10 rounded-full bg-black/45 px-3 py-1 text-[10px] font-semibold tracking-[0.08em] text-white uppercase backdrop-blur-xs">
                    {days}
                  </div>
                </div>

                <div className="flex flex-1 flex-col justify-between px-4 pt-4 pb-5">
                  <div>
                    <h3 className="font-serif text-[21px] leading-tight text-secondary group-hover:text-primary transition-colors">
                      {title}
                    </h3>

                    {description ? (
                      <p className="text-subtitle mt-2 text-xs leading-5 line-clamp-2 text-muted-foreground">
                        {description}
                      </p>
                    ) : null}
                  </div>

                  <div className="mt-5 flex items-center justify-between gap-2">
                    <div className="flex flex-wrap gap-1.5">
                      {tags.map((tag: string, tIdx: number) => (
                        <span
                          key={tIdx}
                          className="border-border-light text-subtitle rounded-[38px] border px-2 py-1 text-[8px] tracking-[0.08em] uppercase"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <span
                      className="shrink-0 text-[11px] font-semibold"
                      style={{ color: accentColor }}
                    >
                      From {price} ↗
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {buttons.length > 0 && (
          <div className="flex w-full justify-center">
            <DynamicCmsButtonPreview
              data={buttons}
              className="w-full md:w-[230px] justify-center"
            />
          </div>
        )}
      </div>
    </section>
  )
}

export default ExploreJourneysPreview
