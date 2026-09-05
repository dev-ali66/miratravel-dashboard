/* =====================================================
   LOCATION — SHARED GUIDE SECTION
   Reused by both the "Local Guide" and "Travel Insights"
   sections (identical shape: title/sub_heading/main_image
   + an articles[] repeater), so it lives here once instead
   of being duplicated per section.
===================================================== */

import { useState } from "react"
import { ChevronDown, Plus, Trash2 } from "lucide-react"
import { FormSection, DynamicStyledField } from "./fields"
import { UniversalMultimediaForm } from "../../CMS/shared/UniversalMultimediaForm"
import { ButtonsField } from "../../CMS/shared/ButtonsField"
import type { GuideArticle } from "../locationTypes"

export function GuideSection({
  title,
  sectionKey,
  openSections,
  onToggle,
  data,
  onFieldChange,
  onArticleChange,
  onArticlePatch,
  onAdd,
  onRemove,
}: {
  title: string
  sectionKey: string
  openSections: Record<string, boolean>
  onToggle: (value: string) => void
  data: {
    title: string
    sub_heading: string
    main_image: string
    mainImageMultimedia?: Record<string, any> | null
    articles: GuideArticle[]
  }
  onFieldChange: (path: string, value: unknown) => void
  onArticleChange: (
    index: number,
    field: keyof GuideArticle,
    value: any
  ) => void
  onArticlePatch?: (index: number, patch: Partial<GuideArticle>) => void
  onAdd: () => void
  onRemove: (index: number) => void
}) {
  const articles = Array.isArray(data?.articles) ? data.articles : []
  const [openArticles, setOpenArticles] = useState<Record<number, boolean>>({
    0: true,
  })

  const toggleArticle = (index: number) => {
    setOpenArticles((prev) => ({
      ...prev,
      [index]: !prev[index],
    }))
  }
  return (
    <FormSection
      title={title}
      active={!!openSections[sectionKey]}
      onClick={() => onToggle(sectionKey)}
    >
      <div className="space-y-5">
        <DynamicStyledField
          type="text"
          label="Title"
          value={data.title ?? ""}
          onChange={(value: string) =>
            onFieldChange(
              `data.${sectionKey === "local-guide" ? "local_guide" : "travel_insights"}.title`,
              value
            )
          }
          enableStyle
          style={(data as any).titleStyle}
          onStyleChange={(style) =>
            onFieldChange(
              `data.${sectionKey === "local-guide" ? "local_guide" : "travel_insights"}.titleStyle`,
              style
            )
          }
        />

        <DynamicStyledField
          type="text"
          label="Sub Heading"
          value={data.sub_heading ?? ""}
          onChange={(value: string) =>
            onFieldChange(
              `data.${sectionKey === "local-guide" ? "local_guide" : "travel_insights"}.sub_heading`,
              value
            )
          }
          enableStyle
          style={(data as any).subHeadingStyle}
          onStyleChange={(style) =>
            onFieldChange(
              `data.${sectionKey === "local-guide" ? "local_guide" : "travel_insights"}.subHeadingStyle`,
              style
            )
          }
        />

        <UniversalMultimediaForm
          section={data as any}
          content={data as Record<string, any>}
          updateSection={(patch) =>
            onFieldChange(
              `data.${
                sectionKey === "local-guide" ? "local_guide" : "travel_insights"
              }`,
              { ...data, ...patch }
            )
          }
          updateSectionContent={(patch) =>
            onFieldChange(
              `data.${
                sectionKey === "local-guide" ? "local_guide" : "travel_insights"
              }`,
              { ...data, ...patch }
            )
          }
          contentMediaKey="mainImageMultimedia"
          backgroundType={data.mainImageMultimedia?.type}
          sectionTitle="Main Image"
          imageTitle="Main Image"
          imageLabel="Section main image"
          imageFieldName={`location${
            sectionKey === "local-guide" ? "LocalGuide" : "TravelInsights"
          }MainImage`}
          showImageAltField
        />

        <UniversalMultimediaForm
          section={data as any}
          content={data as Record<string, any>}
          updateSection={(patch) =>
            onFieldChange(
              `data.${
                sectionKey === "local-guide" ? "local_guide" : "travel_insights"
              }`,
              { ...data, ...patch }
            )
          }
          updateSectionContent={(patch) =>
            onFieldChange(
              `data.${
                sectionKey === "local-guide" ? "local_guide" : "travel_insights"
              }`,
              { ...data, ...patch }
            )
          }
          contentMediaKey="backgroundMultimedia"
          backgroundType={(data as any).backgroundMultimedia?.type}
          backgroundTypeStyleKey={`location${
            sectionKey === "local-guide" ? "LocalGuide" : "TravelInsights"
          }BackgroundTypeStyle`}
          sectionTitle="Background"
          showColorPicker
          colorLabel="Background color"
          defaultColor={sectionKey === "local-guide" ? "#e9e7df" : "#1A2E2A"}
          imageTitle="Background Image"
          imageLabel="Background image"
          imageFieldName={`location${
            sectionKey === "local-guide" ? "LocalGuide" : "TravelInsights"
          }BackgroundImage`}
          videoTitle="Background Video"
          videoLabel="Background video"
          videoFieldName={`location${
            sectionKey === "local-guide" ? "LocalGuide" : "TravelInsights"
          }BackgroundVideo`}
          showImageAltField
          showVideoSwitches
        />

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold">Articles</h4>

            <button
              type="button"
              onClick={() => {
                onAdd()
                setOpenArticles((prev) => ({
                  ...prev,
                  [articles.length]: true,
                }))
              }}
              className="flex cursor-pointer items-center gap-1 text-xs font-semibold text-primary hover:underline"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Article
            </button>
          </div>

          {articles.map((article, index) => {
            const isOpen = !!openArticles[index]
            const articleTitle =
              article.title || article.category || `Article ${index + 1}`

            return (
              <div
                key={article.id || `article-${index}`}
                className="overflow-hidden rounded-xl border border-border/60 bg-muted/10 transition-colors"
              >
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => toggleArticle(index)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault()
                      toggleArticle(index)
                    }
                  }}
                  className="flex cursor-pointer items-center justify-between p-3.5 transition-colors select-none hover:bg-muted/30 sm:p-4"
                >
                  <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
                    <div
                      className={`flex size-6 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-transform duration-200 ${
                        isOpen ? "rotate-180" : "rotate-0"
                      }`}
                    >
                      <ChevronDown className="h-4 w-4" />
                    </div>

                    <div className="flex min-w-0 flex-wrap items-center gap-2">
                      <span className="shrink-0 text-xs font-semibold">
                        {article.number
                          ? `#${article.number}`
                          : `Article ${index + 1}`}
                        :
                      </span>
                      <span className="truncate text-xs font-medium text-foreground/85">
                        {articleTitle}
                      </span>
                      {article.category && (
                        <span className="shrink-0 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                          {article.category}
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      onRemove(index)
                    }}
                    className="ml-2 shrink-0 p-1 text-destructive transition-opacity hover:opacity-80"
                    title="Remove article"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                {isOpen && (
                  <div className="space-y-4 border-t border-border/40 p-4 pt-2">
                    <DynamicStyledField
                      type="text"
                      label="Number"
                      value={article.number ?? ""}
                      onChange={(value: string) =>
                        onArticleChange(index, "number", value)
                      }
                      enableStyle
                      style={article.numberStyle}
                      onStyleChange={(style) =>
                        onArticleChange(index, "numberStyle" as any, style)
                      }
                    />

                    <DynamicStyledField
                      type="text"
                      label="ID"
                      value={article.id ?? ""}
                      onChange={(value: string) =>
                        onArticleChange(index, "id", value)
                      }
                    />

                    <DynamicStyledField
                      type="text"
                      label="Title"
                      value={article.title ?? ""}
                      onChange={(value: string) =>
                        onArticleChange(index, "title", value)
                      }
                      enableStyle
                      style={article.titleStyle}
                      onStyleChange={(style) =>
                        onArticleChange(index, "titleStyle" as any, style)
                      }
                    />

                    <DynamicStyledField
                      type="text"
                      label="Category"
                      value={article.category ?? ""}
                      onChange={(value: string) =>
                        onArticleChange(index, "category", value)
                      }
                      enableStyle
                      style={article.categoryStyle}
                      onStyleChange={(style) =>
                        onArticleChange(index, "categoryStyle" as any, style)
                      }
                    />

                    <DynamicStyledField
                      type="textarea"
                      label="Description"
                      value={article.description ?? ""}
                      onChange={(value: string) =>
                        onArticleChange(index, "description", value)
                      }
                      enableStyle
                      style={article.descriptionStyle}
                      onStyleChange={(style) =>
                        onArticleChange(index, "descriptionStyle" as any, style)
                      }
                    />

                    <ButtonsField
                      label="Action Buttons"
                      value={
                        article.buttons ??
                        (article.button
                          ? [article.button as any]
                          : article.href
                            ? [
                                {
                                  label: "Read More",
                                  url: article.href,
                                  style: "primary",
                                },
                              ]
                            : [])
                      }
                      onChange={(buttons) => {
                        if (onArticlePatch) {
                          onArticlePatch(index, {
                            buttons,
                            button: buttons?.[0],
                            href: buttons?.[0]?.url || article.href,
                          })
                        } else {
                          onArticleChange(index, "buttons", buttons)
                        }
                      }}
                    />

                    <UniversalMultimediaForm
                      section={article as any}
                      content={article as any}
                      updateSection={(patch) => {
                        const multimedia =
                          (patch as any).thumbnailMultimedia || patch
                        if (onArticlePatch) {
                          onArticlePatch(index, {
                            thumbnailMultimedia: multimedia,
                            thumbnail:
                              multimedia?.image?.url || article.thumbnail,
                          })
                        } else {
                          onArticleChange(
                            index,
                            "thumbnailMultimedia",
                            multimedia
                          )
                          if (multimedia?.image?.url) {
                            onArticleChange(
                              index,
                              "thumbnail",
                              multimedia.image.url
                            )
                          }
                        }
                      }}
                      updateSectionContent={(patch) => {
                        const multimedia =
                          (patch as any).thumbnailMultimedia || patch
                        if (onArticlePatch) {
                          onArticlePatch(index, {
                            thumbnailMultimedia: multimedia,
                            thumbnail:
                              multimedia?.image?.url || article.thumbnail,
                          })
                        } else {
                          onArticleChange(
                            index,
                            "thumbnailMultimedia",
                            multimedia
                          )
                          if (multimedia?.image?.url) {
                            onArticleChange(
                              index,
                              "thumbnail",
                              multimedia.image.url
                            )
                          }
                        }
                      }}
                      contentMediaKey="thumbnailMultimedia"
                      backgroundType={
                        article.thumbnailMultimedia?.type || "image"
                      }
                      sectionTitle="Thumbnail Multimedia"
                      imageTitle="Thumbnail Image"
                      imageLabel="Article thumbnail image"
                      imageFieldName={`article_${article.id || index}_thumbnail`}
                      showImageAltField
                      showColorPicker
                      allowImage
                      allowVideo
                      showVideoSwitches
                    />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </FormSection>
  )
}
