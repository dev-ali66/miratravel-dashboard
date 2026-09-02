/* =====================================================
   EXPERIENCES — FORM SECTION
   Auto-migrated from the legacy LocationForm.tsx monolith.
===================================================== */

import { Field, ImageField, FormSection } from "../../shared/fields"
import { Plus, Trash2 } from "lucide-react"
import type { LocationData, ExperienceCard } from "../../locationTypes"
import { updateArrayItem } from "../../shared/arrayItemHelpers"

export type ExperiencesFormProps = {
    draft: LocationData
    updateField: (path: string, value: unknown) => void
    openSections: Record<string, boolean>
    toggleSection: (section: string) => void
}

export function ExperiencesForm({
    draft,
    updateField,
    openSections,
    toggleSection,
}: ExperiencesFormProps) {

    const updateExperience = (
        index: number,
        field: keyof ExperienceCard,
        value: string | number
    ) =>
        updateArrayItem(
            draft.data.experiences.cards,
            index,
            field,
            value,
            (next) => updateField("data.experiences.cards", next)
        )

    return (
                <FormSection
                    title="Experiences"
                    active={
                        !!openSections["experiences"]
                    }
                    onClick={() =>
                        toggleSection(
                            "experiences"
                        )
                    }
                >
                    <div className="space-y-5">
                        <Field
                            label="Title"
                            value={
                                draft.data
                                    .experiences
                                    .title
                            }
                            onChange={(
                                value
                            ) =>
                                updateField(
                                    "data.experiences.title",
                                    value
                                )
                            }
                        />

                        <Field
                            label="Location"
                            value={
                                draft.data
                                    .experiences
                                    .location
                            }
                            onChange={(
                                value
                            ) =>
                                updateField(
                                    "data.experiences.location",
                                    value
                                )
                            }
                        />

                        <Field
                            label="Description"
                            value={
                                draft.data
                                    .experiences
                                    .description
                            }
                            multiline
                            onChange={(
                                value
                            ) =>
                                updateField(
                                    "data.experiences.description",
                                    value
                                )
                            }
                        />

                        <Field
                            label="Season Info"
                            value={
                                draft.data
                                    .experiences
                                    .seasonInfo ?? ""
                            }
                            multiline
                            onChange={(value) =>
                                updateField(
                                    "data.experiences.seasonInfo",
                                    value
                                )
                            }
                        />

                        <Field
                            label="Season Location"
                            value={
                                draft.data
                                    .experiences
                                    .seasonLocation ?? ""
                            }
                            onChange={(value) =>
                                updateField(
                                    "data.experiences.seasonLocation",
                                    value
                                )
                            }
                        />

                        <Field
                            label="Load More Button"
                            value={
                                draft.data
                                    .experiences
                                    .load_more_button
                            }
                            onChange={(
                                value
                            ) =>
                                updateField(
                                    "data.experiences.load_more_button",
                                    value
                                )
                            }
                        />

                        <div className="rounded-xl border border-border/60 p-4">
                            <h4 className="mb-4 text-sm font-semibold">
                                Featured Experience
                            </h4>

                            <div className="space-y-4">
                                <ImageField
                                    label="Image"
                                    value={
                                        draft
                                            .data
                                            .experiences
                                            .featured_experience
                                            .image
                                    }
                                    onChange={(
                                        value
                                    ) =>
                                        updateField(
                                            "data.experiences.featured_experience.image",
                                            value
                                        )
                                    }
                                />

                                <Field
                                    label="Title"
                                    value={
                                        draft
                                            .data
                                            .experiences
                                            .featured_experience
                                            .title
                                    }
                                    onChange={(
                                        value
                                    ) =>
                                        updateField(
                                            "data.experiences.featured_experience.title",
                                            value
                                        )
                                    }
                                />

                                <Field
                                    label="Category"
                                    value={
                                        draft
                                            .data
                                            .experiences
                                            .featured_experience
                                            .category
                                    }
                                    onChange={(
                                        value
                                    ) =>
                                        updateField(
                                            "data.experiences.featured_experience.category",
                                            value
                                        )
                                    }
                                />

                                <Field
                                    label="Duration"
                                    value={
                                        draft
                                            .data
                                            .experiences
                                            .featured_experience
                                            .duration
                                    }
                                    onChange={(
                                        value
                                    ) =>
                                        updateField(
                                            "data.experiences.featured_experience.duration",
                                            value
                                        )
                                    }
                                />

                                <Field
                                    label="Subtitle"
                                    value={
                                        draft
                                            .data
                                            .experiences
                                            .featured_experience
                                            .subtitle
                                    }
                                    multiline
                                    onChange={(
                                        value
                                    ) =>
                                        updateField(
                                            "data.experiences.featured_experience.subtitle",
                                            value
                                        )
                                    }
                                />

                                <Field
                                    label="Action Text"
                                    value={
                                        draft
                                            .data
                                            .experiences
                                            .featured_experience
                                            .action_text
                                    }
                                    onChange={(
                                        value
                                    ) =>
                                        updateField(
                                            "data.experiences.featured_experience.action_text",
                                            value
                                        )
                                    }
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <h4 className="text-sm font-semibold">
                                    Experience Cards
                                </h4>

                                <button
                                    type="button"
                                    onClick={() => {
                                        const cards =
                                            [
                                                ...draft
                                                    .data
                                                    .experiences
                                                    .cards,
                                                {
                                                    id: Date.now(),
                                                    image: "",
                                                    price: "",
                                                    title: "",
                                                    category: "",
                                                    subtitle: "",
                                                    action_text:
                                                        "More info",
                                                    description:
                                                        "",
                                                },
                                            ]

                                        updateField(
                                            "data.experiences.cards",
                                            cards
                                        )
                                    }}
                                    className="flex items-center gap-1 text-xs font-medium text-primary"
                                >
                                    <Plus className="h-3.5 w-3.5" />
                                    Add
                                </button>
                            </div>

                            {draft.data.experiences.cards.map(
                                (
                                    card,
                                    index
                                ) => (
                                    <div
                                        key={
                                            card.id
                                        }
                                        className="rounded-xl border border-border/60 p-4"
                                    >
                                        <div className="mb-3 flex items-center justify-between">
                                            <span className="text-xs font-semibold">
                                                Card{" "}
                                                {index +
                                                    1}
                                            </span>

                                            <button
                                                type="button"
                                                onClick={() => {
                                                    updateField(
                                                        "data.experiences.cards",
                                                        draft
                                                            .data
                                                            .experiences
                                                            .cards.filter(
                                                                (
                                                                    _,
                                                                    i
                                                                ) =>
                                                                    i !==
                                                                    index
                                                            )
                                                    )
                                                }}
                                                className="text-destructive"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>

                                        <div className="space-y-4">
                                            <ImageField
                                                label="Image"
                                                value={
                                                    card.image
                                                }
                                                onChange={(
                                                    value
                                                ) =>
                                                    updateExperience(
                                                        index,
                                                        "image",
                                                        value
                                                    )
                                                }
                                            />

                                            <Field
                                                label="Title"
                                                value={
                                                    card.title
                                                }
                                                onChange={(
                                                    value
                                                ) =>
                                                    updateExperience(
                                                        index,
                                                        "title",
                                                        value
                                                    )
                                                }
                                            />

                                            <Field
                                                label="Category"
                                                value={
                                                    card.category
                                                }
                                                onChange={(
                                                    value
                                                ) =>
                                                    updateExperience(
                                                        index,
                                                        "category",
                                                        value
                                                    )
                                                }
                                            />

                                            <Field
                                                label="Subtitle"
                                                value={
                                                    card.subtitle
                                                }
                                                multiline
                                                onChange={(
                                                    value
                                                ) =>
                                                    updateExperience(
                                                        index,
                                                        "subtitle",
                                                        value
                                                    )
                                                }
                                            />

                                            <Field
                                                label="Description"
                                                value={
                                                    card.description
                                                }
                                                multiline
                                                onChange={(
                                                    value
                                                ) =>
                                                    updateExperience(
                                                        index,
                                                        "description",
                                                        value
                                                    )
                                                }
                                            />

                                            <Field
                                                label="Price"
                                                value={
                                                    card.price
                                                }
                                                onChange={(
                                                    value
                                                ) =>
                                                    updateExperience(
                                                        index,
                                                        "price",
                                                        value
                                                    )
                                                }
                                            />

                                            <Field
                                                label="Action Text"
                                                value={
                                                    card.action_text
                                                }
                                                onChange={(
                                                    value
                                                ) =>
                                                    updateExperience(
                                                        index,
                                                        "action_text",
                                                        value
                                                    )
                                                }
                                            />
                                        </div>
                                    </div>
                                )
                            )}
                        </div>

                        <Field
                            label="Footer Note"
                            value={
                                draft.data
                                    .experiences
                                    .footer?.note ?? ""
                            }
                            multiline
                            onChange={(
                                value
                            ) =>
                                updateField(
                                    "data.experiences.footer.note",
                                    value
                                )
                            }
                        />

                        <Field
                            label="Footer Region"
                            value={
                                draft.data
                                    .experiences
                                    .footer?.region ?? ""
                            }
                            onChange={(
                                value
                            ) =>
                                updateField(
                                    "data.experiences.footer.region",
                                    value
                                )
                            }
                        />
                    </div>
                </FormSection>
    )
}
