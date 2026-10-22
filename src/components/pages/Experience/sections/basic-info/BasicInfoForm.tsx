import { useMemo } from "react"
import { ParentLocationSelect } from "@/components/pages/Location/shared/ParentLocationSelect"
import { DynamicStyledField } from "@/components/pages/CMS/shared/FormControls"
import { FormSection } from "@/components/pages/Location/shared/fields"
import type { ExperienceFormSectionProps } from "../../config/experienceSections"

const PRICE_TYPE_OPTIONS = [
  { label: "Per Person (EUR / Person)", value: "PER_PERSON" },
  { label: "Per Group (Fixed Group Rate)", value: "PER_GROUP" },
  { label: "Fixed Experience Price", value: "FIXED" },
  { label: "Starting From (Base Rate)", value: "STARTING_FROM" },
  { label: "Complimentary / Included", value: "COMPLIMENTARY" },
]

export function BasicInfoForm({
  draft,
  updateField,
  openSections,
  toggleSection,
  sectionNumber,
}: ExperienceFormSectionProps) {
  const isOpen = Boolean(openSections["basic-info"])

  const priceTypeOptions = useMemo(() => {
    return [
      { label: "Select Price Type...", value: "" },
      ...PRICE_TYPE_OPTIONS,
    ]
  }, [])

  return (
    <FormSection
      title="Basic Information"
      sectionNumber={sectionNumber}
      active={isOpen}
      onClick={() => toggleSection("basic-info")}
    >
      <div className="flex flex-col gap-4">
        {/* Experience Name */}
        <DynamicStyledField
          type="text"
          label="Experience Name"
          fieldName="name"
          placeholder="e.g. Helicopter Safari over Theth & Blue Eye"
          required={true}
          enableStyle={false}
          value={draft.name || ""}
          onChange={(val) => updateField("name", val)}
        />

        {/* Experience Custom Slug */}
        <DynamicStyledField
          type="text"
          label="URL Slug (Optional — generated automatically if empty)"
          fieldName="slug"
          placeholder="e.g. helicopter-safari-theth-blue-eye"
          enableStyle={false}
          value={draft.slug || ""}
          onChange={(val) => updateField("slug", val)}
        />

        {/* Price & Price Type Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <DynamicStyledField
            type="number"
            label="Price (€ EUR)"
            fieldName="price"
            placeholder="e.g. 250"
            enableStyle={false}
            value={draft.price !== null && draft.price !== undefined ? String(draft.price) : ""}
            onChange={(val) => {
              const num = val === "" ? null : Number(val)
              updateField("price", num)
            }}
          />

          <DynamicStyledField
            type="select"
            label="Price Type / Pricing Basis"
            fieldName="priceType"
            enableStyle={false}
            value={draft.priceType || ""}
            options={priceTypeOptions}
            onChange={(val) => updateField("priceType", val)}
          />
        </div>

        {/* Parent Location Selector */}
        <ParentLocationSelect
          value={draft.parentId || null}
          currentName={draft.parent?.name || (draft as any)?.parentName}
          excludeId={undefined}
          label="Parent Destination / Location"
          noneLabel="None (Standalone Experience)"
          onChange={(id, name) => {
            const nextId = id || null
            updateField("parentId", nextId)
            updateField("parent", nextId && name ? { id: nextId, name } : null)
          }}
        />

        {/* Featured Experience Checkbox */}
        <div className="flex items-center gap-2.5 rounded-lg border border-border/60 bg-muted/20 px-3 py-2.5 mt-1">
          <input
            type="checkbox"
            id="featured-experience-checkbox"
            checked={Boolean(draft.featured)}
            onChange={(e) => updateField("featured", e.target.checked)}
            className="h-4 w-4 rounded border-border text-primary focus:ring-primary cursor-pointer"
          />
          <label
            htmlFor="featured-experience-checkbox"
            className="text-xs font-semibold text-foreground cursor-pointer select-none"
          >
            Featured Experience
            <span className="block text-[11px] font-normal text-muted-foreground">
              Mark this experience as featured in destination showcases and highlights.
            </span>
          </label>
        </div>
      </div>
    </FormSection>
  )
}

export default BasicInfoForm
