import { useMemo } from "react"
import { type LocationType } from "../../locationTypes"
import { ParentLocationSelect } from "@/components/pages/Location/shared/ParentLocationSelect"
import { DynamicStyledField } from "@/components/pages/CMS/shared/FormControls"
import { FormSection } from "../../shared/fields"
import type { LocationFormSectionProps } from "../../config/locationSections"
import { useDevMode } from "@/context/DevModeContext"

export function BasicInfoForm({
  draft,
  updateField,
  openSections,
  toggleSection,
  sectionNumber,
}: LocationFormSectionProps) {
  const isOpen = Boolean(openSections["basic-info"])
  const { isDevMode } = useDevMode()

  const locationTypesList = useMemo(() => {
    const base = ["CONTINENT", "COUNTRY", "REGION", "PLACE", "LANDMARK", "ACCOMMODATION"]
    return isDevMode ? [...base, "TEST"] : base
  }, [isDevMode])

  const locationTypeOptions = useMemo(
    () => [
      { label: "Select Location Type...", value: "" },
      ...locationTypesList.map((t) => ({
        label: t === "TEST" ? "TEST (DEV ONLY — All 20 Sections)" : t.replace(/_/g, " "),
        value: t,
      })),
    ],
    [locationTypesList]
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
          value={draft.type || ""}
          options={locationTypeOptions}
          onChange={(val) => updateField("type", val as LocationType)}
        />

        <ParentLocationSelect
          value={draft.parentId || null}
          currentName={draft.parent?.name || (draft as any)?.parentName}
          excludeId={draft.id}
          label="Parent Location"
          noneLabel="None (Top-Level Destination)"
          onChange={(id, name) => {
            const nextId = id || null
            updateField("parentId", nextId)
            updateField("parent", nextId && name ? { id: nextId, name } : null)
          }}
        />

        {/* Featured Checkbox */}
        <div className="flex items-center gap-2.5 rounded-lg border border-border/60 bg-muted/20 px-3 py-2.5 mt-1">
          <input
            type="checkbox"
            id="featured-location-checkbox"
            checked={Boolean(draft.featured)}
            onChange={(e) => updateField("featured", e.target.checked)}
            className="h-4 w-4 rounded border-border text-primary focus:ring-primary cursor-pointer"
          />
          <label
            htmlFor="featured-location-checkbox"
            className="text-xs font-semibold text-foreground cursor-pointer select-none"
          >
            Featured Location
            <span className="block text-[11px] font-normal text-muted-foreground">
              Mark this location as featured across destination cards and home showcases.
            </span>
          </label>
        </div>
      </div>
    </FormSection>
  )
}

export default BasicInfoForm

