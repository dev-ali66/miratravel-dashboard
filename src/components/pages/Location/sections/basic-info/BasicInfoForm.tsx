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
  sectionNumber,
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
  }

  return (
    <FormSection
      title="Basic Information"
      sectionNumber={sectionNumber}
      active={isOpen}
      onClick={() => toggleSection("basic-info")}
    >
      <div className="flex flex-col gap-4">
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
          type="select"
          label="Location Type"
          fieldName="type"
          required={true}
          enableStyle={false}
          value={draft.type || "PLACE"}
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
