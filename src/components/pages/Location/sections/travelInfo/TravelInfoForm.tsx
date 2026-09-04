/* =====================================================
   TRAVELINFO — FORM SECTION
   Auto-migrated from the legacy LocationForm.tsx monolith.
===================================================== */

import { ColorField, Field, ArrayField, FormSection, ImageField } from "../../shared/fields"
import type { LocationData } from "../../locationTypes"
import { emptyLocation } from "../../shared/emptyLocation"

export type TravelInfoFormProps = {
    draft: LocationData
    updateField: (path: string, value: unknown) => void
    openSections: Record<string, boolean>
    toggleSection: (section: string) => void
}

export function TravelInfoForm({
    draft,
    updateField,
    openSections,
    toggleSection,
}: TravelInfoFormProps) {
    const beforeTravel = draft.data.travelInfo?.beforeTravel ?? emptyLocation.data.travelInfo?.beforeTravel ?? {
        label: "BEFORE YOU TRAVEL",
        title: "Everything you need to know before you go",
        image: "",
        imageAlt: "Travel landscape",
        items: [],
    }
    const style = beforeTravel.style ?? emptyLocation.data.travelInfo?.beforeTravel?.style ?? {}
    const items = beforeTravel.items ?? []

    const updateItem = (index: number, field: "title" | "content", value: string) => {
        const next = [...items]
        next[index] = { ...next[index], [field]: value }
        updateField("data.travelInfo.beforeTravel.items", next)
    }

    return (
        <FormSection
            title="Travel Information"
            active={!!openSections["travel-info"]}
            onClick={() => toggleSection("travel-info")}
        >
            <div className="space-y-4">
                <Field label="Before Travel Label" value={beforeTravel.label} onChange={(value) => updateField("data.travelInfo.beforeTravel.label", value)} />
                <Field label="Before Travel Title" value={beforeTravel.title} onChange={(value) => updateField("data.travelInfo.beforeTravel.title", value)} />
                <ImageField label="Before Travel Image" value={beforeTravel.image} onChange={(value) => updateField("data.travelInfo.beforeTravel.image", value)} />
                <Field label="Image Alt Text" value={beforeTravel.imageAlt} onChange={(value) => updateField("data.travelInfo.beforeTravel.imageAlt", value)} />

                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <label className="text-[11px] font-medium text-muted-foreground">Accordion Items</label>
                        <button type="button" className="text-[10px] font-medium text-primary" onClick={() => updateField("data.travelInfo.beforeTravel.items", [...items, { id: String(Date.now()), title: "", content: "" }])}>+ Add</button>
                    </div>
                    {items.map((item, index) => (
                        <div key={`${item.id}-${index}`} className="space-y-3 rounded-lg border border-border/60 p-3">
                            <Field label="Item Title" value={item.title} onChange={(value) => updateItem(index, "title", value)} />
                            <Field label="Item Content" value={item.content} multiline onChange={(value) => updateItem(index, "content", value)} />
                            <button type="button" className="text-[10px] font-medium text-destructive" onClick={() => updateField("data.travelInfo.beforeTravel.items", items.filter((_, itemIndex) => itemIndex !== index))}>Remove item</button>
                        </div>
                    ))}
                </div>

                <div className="space-y-4 border-t border-border/60 pt-4">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Appearance</p>
                    <div className="grid grid-cols-2 gap-3">
                        <ColorField label="Background Color" value={style.backgroundColor ?? ""} onChange={(value) => updateField("data.travelInfo.beforeTravel.style.backgroundColor", value)} />
                        <ColorField label="Label Color" value={style.labelTextColor ?? ""} onChange={(value) => updateField("data.travelInfo.beforeTravel.style.labelTextColor", value)} />
                        <ColorField label="Title Color" value={style.titleTextColor ?? ""} onChange={(value) => updateField("data.travelInfo.beforeTravel.style.titleTextColor", value)} />
                        <ColorField label="Body Color" value={style.bodyTextColor ?? ""} onChange={(value) => updateField("data.travelInfo.beforeTravel.style.bodyTextColor", value)} />
                        <ColorField label="Border Color" value={style.borderColor ?? ""} onChange={(value) => updateField("data.travelInfo.beforeTravel.style.borderColor", value)} />
                        <ColorField label="Icon Color" value={style.iconColor ?? ""} onChange={(value) => updateField("data.travelInfo.beforeTravel.style.iconColor", value)} />
                    </div>
                </div>

                <div className="border-t border-border/60 pt-4" />
                <Field
                    label="Visa Description"
                    value={draft.data.travelInfo.visa.description}
                    multiline
                    onChange={(value) =>
                        updateField("data.travelInfo.visa.description", value)
                    }
                />

                <Field
                    label="Currency"
                    value={draft.data.travelInfo.currency.majorCurrency}
                    onChange={(value) =>
                        updateField("data.travelInfo.currency.majorCurrency", value)
                    }
                />

                <Field
                    label="Currency Description"
                    value={draft.data.travelInfo.currency.description}
                    multiline
                    onChange={(value) =>
                        updateField("data.travelInfo.currency.description", value)
                    }
                />

                <Field
                    label="General Best Time"
                    value={draft.data.travelInfo.bestTimeToVisit.general}
                    onChange={(value) =>
                        updateField("data.travelInfo.bestTimeToVisit.general", value)
                    }
                />

                <Field
                    label="Summer"
                    value={draft.data.travelInfo.bestTimeToVisit.summer}
                    onChange={(value) =>
                        updateField("data.travelInfo.bestTimeToVisit.summer", value)
                    }
                />

                <Field
                    label="Winter"
                    value={draft.data.travelInfo.bestTimeToVisit.winter}
                    onChange={(value) =>
                        updateField("data.travelInfo.bestTimeToVisit.winter", value)
                    }
                />

                <ArrayField
                    label="Transportation"
                    values={draft.data.travelInfo.popularTransportation}
                    onChange={(values) =>
                        updateField("data.travelInfo.popularTransportation", values)
                    }
                />
            </div>
        </FormSection>
    )
}
