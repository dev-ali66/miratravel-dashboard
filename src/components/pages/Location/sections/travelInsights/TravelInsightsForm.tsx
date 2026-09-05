/* =====================================================
   TRAVELINSIGHTS — FORM SECTION
   Auto-migrated from the legacy LocationForm.tsx monolith.
===================================================== */

import { GuideSection } from "../../shared/GuideSection"
import type { LocationData, GuideArticle } from "../../locationTypes"
import { updateArrayItem } from "../../shared/arrayItemHelpers"

export type TravelInsightsFormProps = {
  draft: LocationData
  updateField: (path: string, value: unknown) => void
  openSections: Record<string, boolean>
  toggleSection: (section: string) => void
}

export function TravelInsightsForm({
  draft,
  updateField,
  openSections,
  toggleSection,
}: TravelInsightsFormProps) {
  const travelInsights = draft.data?.travel_insights ?? {}
  const articles = Array.isArray(travelInsights.articles)
    ? travelInsights.articles
    : []

  const updateArticle = (
    index: number,
    field: keyof GuideArticle,
    value: any
  ) =>
    updateArrayItem(articles, index, field, value, (next) =>
      updateField("data.travel_insights.articles", next)
    )

  const updateArticlePatch = (index: number, patch: Partial<GuideArticle>) => {
    const next = articles.map((art, i) =>
      i === index ? { ...art, ...patch } : art
    )
    updateField("data.travel_insights.articles", next)
  }

  return (
    <GuideSection
      title="Travel Insights"
      sectionKey="travel-insights"
      openSections={openSections}
      onToggle={toggleSection}
      data={{
        ...travelInsights,
        title: travelInsights.title ?? "",
        sub_heading: travelInsights.sub_heading ?? "",
        main_image: travelInsights.main_image ?? "",
        articles,
      }}
      onFieldChange={updateField}
      onArticleChange={updateArticle}
      onArticlePatch={updateArticlePatch}
      onAdd={() => {
        const next = [
          ...articles,
          {
            id: String(Date.now()),
            number: String(articles.length + 1).padStart(2, "0"),
            title: "",
            category: "",
            description: "",
            href: "",
            thumbnail: "",
            buttons: [],
          },
        ]
        updateField("data.travel_insights.articles", next)
      }}
      onRemove={(index) => {
        updateField(
          "data.travel_insights.articles",
          articles.filter((_, i) => i !== index)
        )
      }}
    />
  )
}
