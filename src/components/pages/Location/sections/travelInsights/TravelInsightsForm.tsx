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

    const updateArticle = (
        index: number,
        field: keyof GuideArticle,
        value: string
    ) =>
        updateArrayItem(
            draft.data.travel_insights.articles,
            index,
            field,
            value,
            (next) => updateField("data.travel_insights.articles", next)
        )

    return (
                <GuideSection
                    title="Travel Insights"
                    sectionKey="travel-insights"
                    openSections={
                        openSections
                    }
                    onToggle={
                        toggleSection
                    }
                    data={
                        draft.data
                            .travel_insights
                    }
                    onFieldChange={
                        updateField
                    }
                    onArticleChange={(
                        index,
                        field,
                        value
                    ) =>
                        updateArticle(
                            index,
                            field,
                            value
                        )
                    }
                    onAdd={() => {
                        updateField(
                            "data.travel_insights.articles",
                            [
                                ...draft.data
                                    .travel_insights
                                    .articles,
                                {
                                    id: String(
                                        Date.now()
                                    ),
                                    number: "",
                                    title: "",
                                    category: "",
                                    description: "",
                                    href: "",
                                    thumbnail:
                                        "",
                                },
                            ]
                        )
                    }}
                    onRemove={(
                        index
                    ) => {
                        updateField(
                            "data.travel_insights.articles",
                            draft.data.travel_insights.articles.filter(
                                (
                                    _,
                                    i
                                ) =>
                                    i !==
                                    index
                            )
                        )
                    }}
                />
    )
}
