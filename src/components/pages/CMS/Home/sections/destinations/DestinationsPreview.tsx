import type { ReactNode } from "react"
import { ArrowUpRight } from "lucide-react"
import { ImageShowPreview } from "@/components/shared/ImageShowPreview"
import type { HomeSection } from "../../homeTypes"
import { UniversalMultimediaPreview } from "../../shared/preview/UniversalMultimediaPreview"
import { DynamicStyledPreview } from "@/components/shared/DynamicStyledPreview"

const PREVIEW_IMAGE_SOURCE =
  "https://images.unsplash.com/photo-1530789253388-582c481c54b0?auto=format&fit=crop&w=1200&q=85"

export type DestinationsPreviewProps = {
  section: HomeSection
  accentColor: string
  darkText: string
  renderButtons: (
    buttons?: any[],
    fullWidth?: boolean,
    alignRight?: boolean,
    mainButtonWidth?: boolean
  ) => ReactNode
}

export function DestinationsPreview({
  section,
  accentColor,
  darkText,
  renderButtons,
}: DestinationsPreviewProps) {
  const content = (section.content ?? {}) as Record<string, any>
  const eyebrow = (section as any).eyebrow ?? content.eyebrow
  const title = (section as any).title ?? content.title
  const subtitle = (section as any).subtitle ?? content.subtitle
  const multimedia = (section as any).backgroundMultimedia || content.backgroundMultimedia || (section as any).multimedia || content.multimedia

  const DummyImage = ({ className = "" }: { className?: string }) => (
    <div className={`relative overflow-hidden bg-muted ${className}`}>
      <ImageShowPreview
        src={PREVIEW_IMAGE_SOURCE}
        alt="Destination preview"
        className="h-full w-full object-cover"
      />
    </div>
  )

  return (
    <section
      id="destinations"
      className="relative w-full overflow-hidden pt-[65px] md:pt-[90px] lg:pt-[100px] xlg:pt-[110px] xl:pt-[120px] pb-[65px] md:pb-[90px] lg:pb-[100px] xlg:pb-[110px] xl:pb-[120px]"
      style={{
        backgroundColor: (section as any).bgColor ?? "transparent",
        color: darkText,
      }}
    >
      <UniversalMultimediaPreview
        multimedia={multimedia}
        fallbackAlt="Destinations background"
        fallbackColor={(section as any).bgColor ?? "transparent"}
        mode="background"
        overlayClassName="bg-white/70"
      />

      <div className="relative z-10 container mx-auto px-4 lg:px-0 flex w-full flex-col items-center gap-14">
        <div className="flex flex-col items-center gap-4 text-center">
          <DynamicStyledPreview
            as="p"
            field={eyebrow}
            styleObj={(section as any).homeDestinationEyebrowStyle ?? content.homeDestinationEyebrowStyle}
            fallbackColor={accentColor}
            className="text-base md:text-[20px] lgx:text-[22px] xl:text-[24px] leading-7 md:leading-8 lgx:leading-9 xl:leading-10 font-medium tracking-[1.4px]"
          />

          <DynamicStyledPreview
            as="h2"
            field={title}
            styleObj={(section as any).homeDestinationTitleStyle ?? content.homeDestinationTitleStyle}
            fallbackColor={darkText}
            className="max-w-[900px] font-heading font-normal text-neutral-900 tracking-[1px] text-[28px] md:text-[38px] lgx:text-[44px] xl:text-[48px] leading-tight"
          />

          <DynamicStyledPreview
            as="p"
            field={subtitle}
            styleObj={(section as any).homeDestinationSubtitleStyle ?? content.homeDestinationSubtitleStyle}
            fallbackColor={darkText}
            className="max-w-[700px] text-sm md:text-base text-subtitle leading-relaxed"
          />
        </div>

        <div className="grid w-full grid-cols-1 items-start gap-4 lgx:gap-6 xlg:gap-7 xl:gap-10 md:grid-cols-2 lg:grid-cols-3">
          {["Croatia", "Bosnia & Herzegovina", "Albania"].map((name) => (
            <div
              key={name}
              className="group border-border-muted/40 flex w-full flex-col gap-8 rounded-[2px] border bg-neutral-100 p-4 md:gap-9 md:p-[18px] xl:gap-10 xl:p-6"
            >
              <div className="lgx:h-[360px] relative h-[300px] w-full overflow-hidden rounded-[2px] md:h-[320px] xl:h-[394px]">
                <DummyImage className="h-full w-full" />
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-[21px] text-primary md:text-[22px] xl:text-[24px]">
                    {name}
                  </h3>

                  <ArrowUpRight className="h-5 w-5 shrink-0 text-accent" />
                </div>

                <p className="text-subtitle text-sm leading-[21px] md:text-[15px]">
                  Experience timeless coastal villages and crystal clear waters.
                </p>
              </div>
            </div>
          ))}
        </div>

        {section.buttons?.length ? (
          <div className="w-full md:w-[230px]">
            {renderButtons(section.buttons, true, false, true)}
          </div>
        ) : null}
      </div>
    </section>
  )
}
