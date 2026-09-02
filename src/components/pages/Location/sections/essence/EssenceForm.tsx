/* =====================================================
   ESSENCE — FORM SECTION
   Every field here maps 1:1 onto the real frontend
   `<Essence />` component's props (label/title/paragraphs/
   quote/imageSrc/imageAlt/statValue/statLabel), plus a
   CMS-only `style` group so text color, font size, image
   and background are all editable per element.
===================================================== */

import {
    Field,
    ImageField,
    TextArrayField,
    FormSection,
    TextStyleFields,
} from "../../shared/fields"
import type { LocationData } from "../../locationTypes"
import { emptyLocation } from "../../shared/emptyLocation"
import { ColorField } from "@/components/pages/CMS/shared/FormControls"

export type EssenceFormProps = {
    draft: LocationData
    updateField: (path: string, value: unknown) => void
    openSections: Record<string, boolean>
    toggleSection: (section: string) => void
}

export function EssenceForm({
    draft,
    updateField,
    openSections,
    toggleSection,
}: EssenceFormProps) {
    const essence = draft?.data?.essence ?? emptyLocation.data.essence
    const style = essence.style ?? {}
    const statBadgeStyle = style.statBadge ?? {}
    const labelStyle = style.label ?? {}
    const titleStyle = style.title ?? {}
    const paragraphStyle = style.paragraph ?? {}
    const quoteStyle = style.quote ?? {}

    return (
        <FormSection
            title="Essence"
            active={!!openSections["essence"]}
            onClick={() => toggleSection("essence")}
        >
            <div className="space-y-6">
                {/* =========================================
                    CONTENT
                ========================================= */}

                <div className="space-y-4">
                    <Field
                        label="Eyebrow Label"
                        value={essence.label}
                        onChange={(value) =>
                            updateField(
                                "data.essence.label",
                                value
                            )
                        }
                    />

                    <Field
                        label="Title"
                        value={essence.title}
                        onChange={(value) =>
                            updateField(
                                "data.essence.title",
                                value
                            )
                        }
                    />

                    <TextArrayField
                        label="Paragraphs"
                        values={essence.paragraphs}
                        onChange={(values) =>
                            updateField(
                                "data.essence.paragraphs",
                                values
                            )
                        }
                    />

                    <Field
                        label="Quote"
                        value={essence.quote}
                        multiline
                        onChange={(value) =>
                            updateField(
                                "data.essence.quote",
                                value
                            )
                        }
                    />

                    <ImageField
                        label="Image"
                        value={essence.imageSrc}
                        onChange={(value) =>
                            updateField(
                                "data.essence.imageSrc",
                                value
                            )
                        }
                    />

                    <Field
                        label="Image Alt Text"
                        value={essence.imageAlt}
                        onChange={(value) =>
                            updateField(
                                "data.essence.imageAlt",
                                value
                            )
                        }
                    />

                    <div className="grid grid-cols-2 gap-3">
                        <Field
                            label="Stat Value"
                            value={essence.statValue}
                            placeholder="e.g. 2,753"
                            onChange={(value) =>
                                updateField(
                                    "data.essence.statValue",
                                    value
                                )
                            }
                        />

                        <Field
                            label="Stat Label"
                            value={essence.statLabel}
                            placeholder="e.g. km of rivers and lakes"
                            onChange={(value) =>
                                updateField(
                                    "data.essence.statLabel",
                                    value
                                )
                            }
                        />
                    </div>
                </div>

                {/* =========================================
                    STYLE — every part individually
                    customizable: text color, font size,
                    background color.
                ========================================= */}

                <div className="space-y-4 border-t border-border/60 pt-4">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                        Appearance
                    </p>

                    <ColorField
                        label="Section Background Color"
                        value={style.sectionBackgroundColor ?? ""}
                        onChange={(value) =>
                            updateField(
                                "data.essence.style.sectionBackgroundColor",
                                value
                            )
                        }
                    />

                    <TextStyleFields
                        label="Eyebrow Label"
                        value={labelStyle}
                        onChange={(value) =>
                            updateField(
                                "data.essence.style.label",
                                value
                            )
                        }
                    />

                    <TextStyleFields
                        label="Title"
                        value={titleStyle}
                        onChange={(value) =>
                            updateField(
                                "data.essence.style.title",
                                value
                            )
                        }
                    />

                    <TextStyleFields
                        label="Paragraph"
                        value={paragraphStyle}
                        onChange={(value) =>
                            updateField(
                                "data.essence.style.paragraph",
                                value
                            )
                        }
                    />

                    <TextStyleFields
                        label="Quote"
                        value={quoteStyle}
                        onChange={(value) =>
                            updateField(
                                "data.essence.style.quote",
                                value
                            )
                        }
                    />

                    <div className="grid grid-cols-2 gap-3">
                        <ColorField
                            label="Stat Badge — Background"
                            value={
                                statBadgeStyle.backgroundColor ?? ""
                            }
                            onChange={(value) =>
                                updateField(
                                    "data.essence.style.statBadge.backgroundColor",
                                    value
                                )
                            }
                        />

                        <ColorField
                            label="Stat Badge — Text Color"
                            value={
                                statBadgeStyle.textColor ?? ""
                            }
                            onChange={(value) =>
                                updateField(
                                    "data.essence.style.statBadge.textColor",
                                    value
                                )
                            }
                        />
                    </div>
                </div>
            </div>
        </FormSection>
    )
}
