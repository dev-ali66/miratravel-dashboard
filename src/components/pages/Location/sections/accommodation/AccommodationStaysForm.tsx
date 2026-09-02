/* =====================================================
   ACCOMMODATION — FORM SECTION
   Auto-created from frontend layout for CMS edit UI.
===================================================== */

import { Field, ImageField, FormSection } from "../../shared/fields"
import { Plus, Trash2 } from "lucide-react"
import type { LocationData, AccommodationStayItem } from "../../locationTypes"
import { updateArrayItem } from "../../shared/arrayItemHelpers"

export type AccommodationStaysFormProps = {
    draft: LocationData
    updateField: (path: string, value: unknown) => void
    openSections: Record<string, boolean>
    toggleSection: (section: string) => void
}

export function AccommodationStaysForm({
    draft,
    updateField,
    openSections,
    toggleSection,
}: AccommodationStaysFormProps) {

    const updateStay = (
        index: number,
        field: keyof AccommodationStayItem,
        value: string | number | undefined
    ) =>
        updateArrayItem(
            draft.data.accommodation_stays?.stays ?? [],
            index,
            field,
            value,
            (next) => updateField("data.accommodation_stays.stays", next)
        )

    const stays = draft.data.accommodation_stays?.stays ?? []

    return (
        <FormSection
            title="Accommodation"
            active={!!openSections["accommodation"]}
            onClick={() => toggleSection("accommodation")}
        >
            <div className="space-y-5">
                <Field
                    label="Badge"
                    value={draft.data.accommodation_stays?.badge ?? ""}
                    onChange={(value) => updateField("data.accommodation_stays.badge", value)}
                />

                <Field
                    label="Title"
                    value={draft.data.accommodation_stays?.title ?? ""}
                    onChange={(value) => updateField("data.accommodation_stays.title", value)}
                />

                <Field
                    label="Description"
                    value={draft.data.accommodation_stays?.description ?? ""}
                    multiline
                    onChange={(value) => updateField("data.accommodation_stays.description", value)}
                />

                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <h4 className="text-sm font-semibold">Stays</h4>

                        <button
                            type="button"
                            onClick={() => {
                                const next = [
                                    ...stays,
                                    {
                                        id: Date.now(),
                                        image: "",
                                        step: "",
                                        day: undefined,
                                        duration: "",
                                        city: "",
                                        subtitle: "",
                                        stayType: "",
                                        confirmedBy: "",
                                        confirmationBadge: "",
                                        description: "",
                                        nights: undefined,
                                    },
                                ]
                                updateField("data.accommodation_stays.stays", next)
                            }}
                            className="flex items-center gap-1 text-xs font-medium text-primary"
                        >
                            <Plus className="h-3.5 w-3.5" />
                            Add
                        </button>
                    </div>

                    {stays.map((stay, index) => (
                        <div key={stay.id ?? index} className="rounded-xl border border-border/60 p-4">
                            <div className="mb-3 flex items-center justify-between">
                                <span className="text-xs font-semibold">Stay {index + 1}</span>
                                <button
                                    type="button"
                                    onClick={() => updateField("data.accommodation_stays.stays", stays.filter((_, i) => i !== index))}
                                    className="text-destructive"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <ImageField
                                    label="Image"
                                    value={stay.image ?? ""}
                                    onChange={(value) => updateStay(index, "image", value as string)}
                                />

                                <Field label="Step" value={stay.step ?? ""} onChange={(value) => updateStay(index, "step", value as string)} />
                                <Field label="Day (number)" value={stay.day ?? ""} onChange={(value) => updateStay(index, "day", Number(value))} />
                                <Field label="Duration" value={stay.duration ?? ""} onChange={(value) => updateStay(index, "duration", value as string)} />
                                <Field label="City / Location" value={stay.city ?? stay.location ?? ""} onChange={(value) => updateStay(index, "city", value as string)} />
                                <Field label="Subtitle" value={stay.subtitle ?? ""} onChange={(value) => updateStay(index, "subtitle", value as string)} />
                                <Field label="Stay Type" value={stay.stayType ?? ""} onChange={(value) => updateStay(index, "stayType", value as string)} />
                                <Field label="Confirmed By" value={stay.confirmedBy ?? ""} onChange={(value) => updateStay(index, "confirmedBy", value as string)} />
                                <Field label="Confirmation Badge" value={stay.confirmationBadge ?? ""} onChange={(value) => updateStay(index, "confirmationBadge", value as string)} />
                                <Field label="Nights (number)" value={stay.nights ?? ""} onChange={(value) => updateStay(index, "nights", Number(value))} />

                                <Field label="Description" value={stay.description ?? ""} multiline onChange={(value) => updateStay(index, "description", value as string)} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </FormSection>
    )
}

export default AccommodationStaysForm
