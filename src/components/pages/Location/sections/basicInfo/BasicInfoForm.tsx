/* =====================================================
   BASICINFO — FORM SECTION
   Auto-migrated from the legacy LocationForm.tsx monolith.
===================================================== */

import { DynamicStyledField, FormSection } from "../../shared/fields"
import { ParentLocationSelect } from "../../shared/ParentLocationSelect"
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
        <DynamicStyledField
          type="text"
          label="Location Name"
          value={draft.name ?? ""}
          onChange={handleNameChange}
        />

        <DynamicStyledField
          type="text"
          label="Slug"
          value={draft.slug ?? ""}
          onChange={() => {}}
          disabled
        />

        <ParentLocationSelect
          value={draft.parentId ?? null}
          currentName={draft.parent?.name}
          excludeId={draft.id}
          onChange={(id, name) => {
            updateField("parentId", id)
            if (id && name) {
              updateField("parent", {
                ...(draft.parent || {}),
                id,
                name,
              })
            } else if (!id) {
              updateField("parent", null)
            }
          }}
        />
      </div>
    </FormSection>
  )
}
