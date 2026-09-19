import type { ReactNode } from "react"
import type { HomeSection, HomeStoryItem } from "../../homeTypes"
import { UniversalMultimediaPreview } from "../../shared/preview/UniversalMultimediaPreview"
import { DynamicStyledPreview } from "@/components/shared/DynamicStyledPreview"


export type MiraStoriesPreviewProps = {
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

export function MiraStoriesPreview({
  section,
  accentColor,
  darkText,
  renderButtons,
}: MiraStoriesPreviewProps) {
  const content = (section.content ?? {}) as Record<string, any>
  const eyebrow = (section as any).eyebrow ?? content.eyebrow
  const title = (section as any).title ?? content.title
  const description = (section as any).description ?? content.description

  const backgroundMultimedia = (section as any).backgroundMultimedia || content.backgroundMultimedia || (section as any).multimedia || content.multimedia
  const leftSideMultimedia = (section as any).leftSideMultimedia || content.leftSideMultimedia || (content as any).leftSideMedia

  const items = section.items ?? []

  return (
    <section
      id="stories"
      className="relative w-full overflow-hidden pt-[65px] md:pt-[90px] lg:pt-[100px] xlg:pt-[110px] xl:pt-[120px] pb-[65px] md:pb-[90px] lg:pb-[100px] xlg:pb-[110px] xl:pb-[120px]"
      style={{
        backgroundColor: (section as any).bgColor ?? "transparent",
        color: darkText,
      }}
    >
      <UniversalMultimediaPreview
        multimedia={backgroundMultimedia}
        fallbackAlt="Mira Stories background"
        fallbackColor={(section as any).bgColor ?? "transparent"}
        mode="background"
        overlayClassName="bg-white/70"
      />

      <div className="relative z-10 container mx-auto px-4 lg:px-0 flex w-full max-w-[1336px] flex-col items-center justify-center lg:items-center gap-[38px] md:gap-[50px] lg:gap-[48px] lgx:gap-[56px] xl:gap-[64px] lg:flex-row">
        <div className="w-full aspect-[776/661] lg:w-[440px] lg:h-[375px] lgx:w-[500px] lgx:h-[426px] xlg:w-[580px] xlg:h-[494px] xl:w-[776px] xl:h-[661px] overflow-hidden shrink-0 rounded-lg">
          <UniversalMultimediaPreview
            multimedia={leftSideMultimedia}
            fallbackAlt="Mira Stories editorial"
            fallbackColor="#E5E7EB"
            className="h-full w-full object-cover"
          />
        </div>

        <div className="flex w-full flex-col items-start lg:flex-1 xl:w-[550px] xl:flex-none">
          <div className="flex w-full flex-col items-start xl:gap-10 lgx:gap-9 md:gap-8 gap-6">
            <DynamicStyledPreview
              as="p"
              field={eyebrow}
              styleObj={(section as any).homeMiraStoriesEyebrowStyle ?? content.homeMiraStoriesEyebrowStyle}
              fallbackColor={accentColor}
              className="text-sm md:text-[15px] font-normal xl:leading-4 leading-3 tracking-[1.5px] md:tracking-[2px] xl:tracking-[2.4px] uppercase"
            />

            <DynamicStyledPreview
              as="h2"
              field={title}
              styleObj={(section as any).homeMiraStoriesTitleStyle ?? content.homeMiraStoriesTitleStyle}
              fallbackColor={darkText}
              className="font-heading max-w-[496px] font-semibold text-card-title tracking-[2px] md:tracking-[3px] xl:tracking-[4px] text-[36px] md:text-[52px] lgx:text-[56px] xl:text-[64px] leading-[44px] md:leading-[64px] lgx:leading-[70px] xl:leading-[80px] self-stretch"
            />

            <DynamicStyledPreview
              as="p"
              field={description}
              styleObj={(section as any).homeMiraStoriesDescriptionStyle ?? content.homeMiraStoriesDescriptionStyle}
              fallbackColor={darkText}
              className="w-full text-sm sm:text-[15px] font-normal leading-[24px] sm:leading-[26px] md:leading-[28px] xl:leading-[30px] text-subtitle max-w-[550px]"
            />
          </div>

          <div className="flex w-full flex-col gap-4 md:gap-6 lgx:gap-7 xl:gap-8 xl:mt-10 lgx:mt-9 md:mt-8 mt-6">
            {items.length
              ? items.map((item: HomeStoryItem, index) => {
                  const itemStyle = item as Record<string, any>

                  return (
                    <a
                      key={index}
                      href={(item as any).button?.url || item.url || "#"}
                      className="group flex items-start gap-4 md:gap-6 lgx:gap-7 xl:gap-8 transition-opacity hover:opacity-80"
                    >
                      <DynamicStyledPreview
                        as="span"
                        field={String(index + 1).padStart(2, "0")}
                        styleObj={itemStyle.homeMiraStoriesItemIndexStyle}
                        fallbackColor={accentColor}
                        className="mt-0.5 text-sm font-normal leading-5 tracking-wide text-muted transition-colors group-hover:text-accent"
                      />

                      <div className="flex flex-col gap-1 gap-[5px] xl:gap-1.5">
                        <DynamicStyledPreview
                          as="h3"
                          field={item.title}
                          styleObj={itemStyle.homeMiraStoriesItemTitleStyle}
                          fallback="Story title"
                          fallbackColor={darkText}
                          className="font-heading text-base md:text-[18px] xl:text-[20px] font-medium leading-5 md:leading-6 xl:leading-7 text-card-title transition-colors group-hover:text-primary"
                        />

                        <DynamicStyledPreview
                          as="p"
                          field={item.subtitle}
                          styleObj={itemStyle.homeMiraStoriesItemSubtitleStyle}
                          fallbackColor={darkText}
                          className="text-xs md:text-[13px] xl:text-sm font-normal xl:leading-5 leading-[18px] text-muted"
                        />
                      </div>
                    </a>
                  )
                })
              : [1, 2, 3, 4].map((item) => (
                  <div
                    key={item}
                    className="group flex items-start gap-4 md:gap-6 lgx:gap-7 xl:gap-8"
                  >
                    <span
                      className="mt-0.5 text-sm font-normal leading-5 tracking-wide text-muted"
                      style={{ color: accentColor }}
                    >
                      {String(item).padStart(2, "0")}
                    </span>

                    <div className="flex flex-col gap-1 gap-[5px] xl:gap-1.5">
                      <h3 className="font-heading text-base md:text-[18px] xl:text-[20px] font-medium leading-5 md:leading-6 xl:leading-7 text-card-title">
                        Story title
                      </h3>

                      <p className="text-xs md:text-[13px] xl:text-sm font-normal xl:leading-5 leading-[18px] text-muted">
                        Story subtitle
                      </p>
                    </div>
                  </div>
                ))}
          </div>

          <div className="w-full md:w-auto xl:mt-10 lgx:mt-9 md:mt-8 mt-6">
            <div className="w-full md:w-[280px]">
              {renderButtons(section.buttons, true, false, true)}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
