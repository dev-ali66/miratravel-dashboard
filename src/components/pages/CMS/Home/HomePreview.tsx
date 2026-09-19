import { useCmsDraft } from "../shared/CmsDraftContext"
import { useGetCmsBySlug } from "@/hooks/cms/useGetCmsBySlug"
import { getDefaultCmsPageData } from "../shared/defaultCmsData"
import { FooterPreview } from "../Footer/FooterPreview"
import type { FooterPageData } from "../Footer/footerTypes"

import type { HomeButton, HomePageData, HomeSection } from "./homeTypes"
import { cn } from "@/lib/utils"

import { emptyHomePayload } from "./shared/emptyHomePayload"
import { homeSectionOrder, homeSectionRegistry } from "./config/homeSections"

const getHomeSectionEntry = (key: string) => {
  return homeSectionRegistry[key as keyof typeof homeSectionRegistry]
}

export const HomePreview = () => {
  const page = useCmsDraft<HomePageData>()

  const { data: footerCmsData } = useGetCmsBySlug("footer")
  const fetchedFooter = footerCmsData?.data
  const footerData = (
    fetchedFooter && (fetchedFooter.data?.theme || fetchedFooter.data?.content)
      ? fetchedFooter
      : getDefaultCmsPageData("footer", "Footer")
  ) as unknown as FooterPageData

  const data = (page?.data ?? emptyHomePayload.data) as Record<string, any>

  const theme = data.theme ?? emptyHomePayload.data?.theme ?? {}

  /*
   * ============================================================
   * THEME
   * ============================================================
   */

  const accentColor = theme.accentColor ?? "#E5A84B"
  const primaryColor = theme.primaryColor ?? "#182D09"
  const darkText = theme.textColorDark ?? "#182D09"
  const lightText = theme.textColorLight ?? "#FFFFFF"

  const getSectionData = (key: string): HomeSection => {
    const rawSec = data[key] ?? data[key.replace(/-/g, "_")]
    if (rawSec && typeof rawSec === "object" && Object.keys(rawSec).length > 0) {
      return { key, type: key, ...rawSec }
    }
    if (Array.isArray(data.sections)) {
      const found = data.sections.find((s: any) => s.key === key || s.type === key)
      if (found) return { key, type: key, ...found }
    }
    const defaultSec = (emptyHomePayload.data as any)?.[key] ?? {}
    return { key, type: key, ...defaultSec }
  }

  /*
   * ============================================================
   * BUTTONS
   * ============================================================
   */

  const renderButtons = (
    buttons: HomeButton[] = [],
    fullWidth = false,
    alignRight = false,
    mainButtonWidth = false
  ) => {
    if (!buttons.length) {
      return null
    }

    return (
      <div
        className={cn(
          "flex flex-row flex-wrap items-start gap-3",
          fullWidth ? "w-full" : "mt-7",
          alignRight && "justify-end"
        )}
      >
        {buttons.map((button, index) => {
          const isPrimary = button.style === "primary"

          return (
            <a
              key={`${button.label}-${index}`}
              href={button.url || "#"}
              className={cn(
                "inline-flex min-h-[38px] items-center justify-center px-7 text-[10px] font-semibold tracking-[0.08em] uppercase transition-opacity hover:opacity-80",
                buttons.length === 1 && fullWidth && "w-full",
                mainButtonWidth && index === 0 && "w-full md:w-[230px]"
              )}
              style={{
                backgroundColor:
                  button.backgroundColor ??
                  (isPrimary ? primaryColor : "transparent"),

                color:
                  button.textColor ?? (isPrimary ? lightText : primaryColor),

                border: isPrimary ? "none" : `1px solid ${primaryColor}`,
              }}
            >
              {button.label || "Button"}
            </a>
          )
        })}
      </div>
    )
  }

  /*
   * ============================================================
   * SECTION RENDERER
   * ============================================================
   */

  const renderSection = (section: HomeSection) => {
    const entry = getHomeSectionEntry(section.key)

    if (!entry) {
      return null
    }

    const SectionPreview = entry.preview

    return (
      <SectionPreview
        section={section}
        accentColor={accentColor}
        darkText={darkText}
        primaryColor={primaryColor}
        lightText={lightText}
        renderButtons={renderButtons}
      />
    )
  }

  /*
   * ============================================================
   * PREVIEW
   * ============================================================
   */

  return (
    <div className="w-full overflow-hidden bg-background">
      {homeSectionOrder.map((key) => {
        const section = getSectionData(key)
        return (
          <div key={key} data-section={key} className="w-full">
            {renderSection(section)}
          </div>
        )
      })}

      {/* FOOTER PREVIEW (Fetched via API) */}
      <FooterPreview footerData={footerData} />
    </div>
  )
}
