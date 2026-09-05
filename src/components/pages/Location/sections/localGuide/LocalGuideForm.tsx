/* =====================================================
   LOCALGUIDE — FORM SECTION
   Auto-migrated from the legacy LocationForm.tsx monolith.
===================================================== */

import { GuideSection } from "../../shared/GuideSection"
import type { LocationData, GuideArticle } from "../../locationTypes"
import { updateArrayItem } from "../../shared/arrayItemHelpers"

export type LocalGuideFormProps = {
  draft: LocationData
  updateField: (path: string, value: unknown) => void
  openSections: Record<string, boolean>
  toggleSection: (section: string) => void
}

export function LocalGuideForm({
  draft,
  updateField,
  openSections,
  toggleSection,
}: LocalGuideFormProps) {
  const localGuide = draft.data?.local_guide ?? {}
  const articles = Array.isArray(localGuide.articles) ? localGuide.articles : []

  const updateArticle = (
    index: number,
    field: keyof GuideArticle,
    value: any
  ) =>
    updateArrayItem(articles, index, field, value, (next) =>
      updateField("data.local_guide.articles", next)
    )

  const updateArticlePatch = (index: number, patch: Partial<GuideArticle>) => {
    const next = articles.map((art, i) =>
      i === index ? { ...art, ...patch } : art
    )
    updateField("data.local_guide.articles", next)
  }

  return (
    <GuideSection
      title="Local Guide"
      sectionKey="local-guide"
      openSections={openSections}
      onToggle={toggleSection}
      data={{
        ...localGuide,
        title: localGuide.title ?? "",
        sub_heading: localGuide.sub_heading ?? "",
        main_image: localGuide.main_image ?? "",
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
        updateField("data.local_guide.articles", next)
      }}
      onRemove={(index) => {
        updateField(
          "data.local_guide.articles",
          articles.filter((_, i) => i !== index)
        )
      }}
    />
  )
}
