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

    const updateArticle = (
        index: number,
        field: keyof GuideArticle,
        value: string
    ) =>
        updateArrayItem(
            draft.data.local_guide.articles,
            index,
            field,
            value,
            (next) => updateField("data.local_guide.articles", next)
        )

    return (
                <GuideSection
                    title="Local Guide"
                    sectionKey="local-guide"
                    openSections={
                        openSections
                    }
                    onToggle={
                        toggleSection
                    }
                    data={
                        draft.data.local_guide
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
                            "data.local_guide.articles",
                            [
                                ...draft.data
                                    .local_guide
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
                            "data.local_guide.articles",
                            draft.data.local_guide.articles.filter(
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
