import { useMemo } from "react"
import { LOCATION_TYPES, type LocationType } from "../../locationTypes"
import { useGetLocationPages } from "@/hooks/location/useGetLocation"
import { DynamicStyledField } from "@/components/pages/CMS/shared/FormControls"
import { FormSection } from "../../shared/fields"
import type { LocationFormSectionProps } from "../../config/locationSections"

export function BasicInfoForm({
  draft,
  updateField,
  openSections,
  toggleSection,
}: LocationFormSectionProps) {
  const isOpen = Boolean(openSections["basic-info"])

  // Query existing locations for the Parent Location selector
  const { data: locationsResponse } = useGetLocationPages({ limit: 100 })
  const availableLocations = locationsResponse?.data ?? []

  // Filter out current location if editing so it cannot be its own parent
  const parentOptions = useMemo(() => {
    const list = availableLocations
      .filter((loc) => !draft?.id || loc.id !== draft.id)
      .map((loc) => ({
        label: `${loc.name} (${loc.type})`,
        value: loc.id,
      }))

    return [{ label: "None (Top-Level Destination)", value: "" }, ...list]
  }, [availableLocations, draft?.id])

  const locationTypeOptions = useMemo(
    () =>
      LOCATION_TYPES.map((t) => ({
        label: t.replace(/_/g, " "),
        value: t,
      })),
    []
  )

  const handleNameChange = (val: string) => {
    updateField("name", val)
    // Auto-generate slug only if slug is currently empty or matches previous slugified name
    if (!draft.slug || draft.slug === slugify(draft.name || "")) {
      updateField("slug", slugify(val))
    }
  }

  const slugify = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "")
  }

  return (
    <FormSection
      title="01. Basic Information"
      active={isOpen}
      onClick={() => toggleSection("basic-info")}
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <DynamicStyledField
          type="text"
          label="Location Name"
          fieldName="name"
          placeholder="e.g. Theth"
          required={true}
          enableStyle={false}
          value={draft.name || ""}
          onChange={handleNameChange}
        />

        <DynamicStyledField
          type="text"
          label="URL Slug (Preview / Auto-Generated)"
          fieldName="slug"
          placeholder="e.g. theth"
          enableStyle={false}
          disabled={true}
          value={draft.slug || ""}
          hint="URL slug is auto-generated from name and cannot be edited directly."
        />

        <DynamicStyledField
          type="select"
          label="Location Type"
          fieldName="type"
          required={true}
          enableStyle={false}
          value={draft.type || "DESTINATION"}
          options={locationTypeOptions}
          onChange={(val) => updateField("type", val as LocationType)}
        />

        <DynamicStyledField
          type="select"
          label="Parent Location"
          fieldName="parentId"
          enableStyle={false}
          value={draft.parentId || ""}
          options={parentOptions}
          onChange={(val) => updateField("parentId", val || null)}
        />
      </div>
    </FormSection>
  )
}

export default BasicInfoForm
