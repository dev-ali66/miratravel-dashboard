/* =====================================================
   LOCATION — SHARED GUIDE SECTION
   Reused by both the "Local Guide" and "Travel Insights"
   sections (identical shape: title/sub_heading/main_image
   + an articles[] repeater), so it lives here once instead
   of being duplicated per section.
===================================================== */

import { Plus, Trash2 } from "lucide-react"
import { FormSection, Field, ImageField } from "./fields"
import type { GuideArticle } from "../locationTypes"

export function GuideSection({
    title,
    sectionKey,
    openSections,
    onToggle,
    data,
    onFieldChange,
    onArticleChange,
    onAdd,
    onRemove,
}: {
    title: string
    sectionKey: string
    openSections: Record<string, boolean>
    onToggle: (
        value: string
    ) => void
    data: {
        title: string
        sub_heading: string
        main_image: string
        articles: GuideArticle[]
    }
    onFieldChange: (
        path: string,
        value: unknown
    ) => void
    onArticleChange: (
        index: number,
        field: keyof GuideArticle,
        value: string
    ) => void
    onAdd: () => void
    onRemove: (
        index: number
    ) => void
}) {
    return (
        <FormSection
            title={title}
            active={!!openSections[sectionKey]}
            onClick={() =>
                onToggle(
                    sectionKey
                )
            }
        >
            <div className="space-y-5">
                <Field
                    label="Title"
                    value={
                        data.title
                    }
                    onChange={(
                        value
                    ) =>
                        onFieldChange(
                            `data.${sectionKey === "local-guide" ? "local_guide" : "travel_insights"}.title`,
                            value
                        )
                    }
                />

                <Field
                    label="Sub Heading"
                    value={
                        data.sub_heading
                    }
                    onChange={(
                        value
                    ) =>
                        onFieldChange(
                            `data.${sectionKey === "local-guide" ? "local_guide" : "travel_insights"}.sub_heading`,
                            value
                        )
                    }
                />

                <ImageField
                    label="Main Image"
                    value={
                        data.main_image
                    }
                    onChange={(
                        value
                    ) =>
                        onFieldChange(
                            `data.${sectionKey === "local-guide" ? "local_guide" : "travel_insights"}.main_image`,
                            value
                        )
                    }
                />

                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <h4 className="text-sm font-semibold">
                            Articles
                        </h4>

                        <button
                            type="button"
                            onClick={
                                onAdd
                            }
                            className="flex items-center gap-1 text-xs text-primary"
                        >
                            <Plus className="h-3.5 w-3.5" />
                            Add Article
                        </button>
                    </div>

                    {data.articles.map(
                        (
                            article,
                            index
                        ) => (
                            <div
                                key={
                                    article.id
                                }
                                className="rounded-xl border border-border/60 p-4"
                            >
                                <div className="mb-3 flex items-center justify-between">
                                    <span className="text-xs font-semibold">
                                        Article{" "}
                                        {index +
                                            1}
                                    </span>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            onRemove(
                                                index
                                            )
                                        }
                                        className="text-destructive"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    <Field
                                        label="Number"
                                        value={
                                            article.number ?? ""
                                        }
                                        onChange={(
                                            value
                                        ) =>
                                            onArticleChange(
                                                index,
                                                "number",
                                                value
                                            )
                                        }
                                    />

                                    <Field
                                        label="ID"
                                        value={
                                            article.id
                                        }
                                        onChange={(
                                            value
                                        ) =>
                                            onArticleChange(
                                                index,
                                                "id",
                                                value
                                            )
                                        }
                                    />

                                    <Field
                                        label="Title"
                                        value={
                                            article.title
                                        }
                                        onChange={(
                                            value
                                        ) =>
                                            onArticleChange(
                                                index,
                                                "title",
                                                value
                                            )
                                        }
                                    />

                                    <Field
                                        label="Category"
                                        value={
                                            article.category ?? ""
                                        }
                                        onChange={(
                                            value
                                        ) =>
                                            onArticleChange(
                                                index,
                                                "category",
                                                value
                                            )
                                        }
                                    />

                                    <Field
                                        label="Description"
                                        value={
                                            article.description ?? ""
                                        }
                                        multiline
                                        onChange={(
                                            value
                                        ) =>
                                            onArticleChange(
                                                index,
                                                "description",
                                                value
                                            )
                                        }
                                    />

                                    <Field
                                        label="Link"
                                        value={
                                            article.href ?? ""
                                        }
                                        onChange={(
                                            value
                                        ) =>
                                            onArticleChange(
                                                index,
                                                "href",
                                                value
                                            )
                                        }
                                    />

                                    <ImageField
                                        label="Thumbnail"
                                        value={
                                            article.thumbnail
                                        }
                                        onChange={(
                                            value
                                        ) =>
                                            onArticleChange(
                                                index,
                                                "thumbnail",
                                                value
                                            )
                                        }
                                    />
                                </div>
                            </div>
                        )
                    )}
                </div>
            </div>
        </FormSection>
    )
}
