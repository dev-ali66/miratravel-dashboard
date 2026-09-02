/* =====================================================
   BASICINFO — FORM SECTION
   Auto-migrated from the legacy LocationForm.tsx monolith.
===================================================== */

import { Field, SelectField, FormSection } from "../../shared/fields"
import { ParentLocationSelect } from "../../shared/ParentLocationSelect"
import { LOCATION_TYPES } from "../../locationTypes"
import type { LocationData } from "../../locationTypes"

export type BasicInfoFormProps = {
    draft: LocationData
    updateField: (path: string, value: unknown) => void
    openSections: Record<string, boolean>
    toggleSection: (section: string) => void
}

export function BasicInfoForm({
    draft,
    updateField,
    openSections,
    toggleSection,
}: BasicInfoFormProps) {
    const handleNameChange = (value: string) => {
        updateField("name", value)

        // Auto-generate slug for new drafts (no id)
        if (!draft.id) {
            const slug = String(value || "")
                .trim()
                .toLowerCase()
                .replace(/\s+/g, "-")
                .replace(/[^a-z0-9-]/g, "")

            updateField("slug", slug)
        }
    }

    return (
        <FormSection
            title="Basic Information"
            active={!!openSections["basic-info"]}
            onClick={() => toggleSection("basic-info")}
        >
            <div className="space-y-4">
                <Field label="Location Name" value={draft.name} onChange={handleNameChange} />

                <div>
                    <label className="text-[11px] font-medium text-muted-foreground">Slug</label>
                    <input
                        value={draft.slug ?? ""}
                        readOnly
                        className="w-full rounded-lg border border-border/60 bg-background px-3 py-2 text-sm outline-none disabled:cursor-not-allowed"
                    />
                </div>

                <ParentLocationSelect
                    value={draft.parentId ?? null}
                    currentName={draft.parent?.name}
                    excludeId={draft.id}
                    onChange={(id) => updateField("parentId", id)}
                />
            </div>
        </FormSection>
    )
}
