import { useMemo } from "react"
import { ParentLocationSelect } from "@/components/pages/Location/shared/ParentLocationSelect"
import { DynamicStyledField } from "@/components/pages/CMS/shared/FormControls"
import { FormSection } from "@/components/pages/Location/shared/fields"
import type { ExperienceFormSectionProps } from "../../config/experienceSections"
import {
  EXPERIENCE_TYPES,
  EXPERIENCE_TYPE_CONFIG,
  EXPERIENCE_ATTRIBUTES,
  EXPERIENCE_CURRENCY_OPTIONS,
  type ExperienceType,
} from "../../experienceTypes"
import { cn } from "@/lib/utils"
import { Globe, Layers, Tag, Check, Sparkles } from "lucide-react"

const PRICE_TYPE_OPTIONS = [
  { label: "Per Person", value: "PER_PERSON" },
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

  const currencyOptions = useMemo(() => {
    return EXPERIENCE_CURRENCY_OPTIONS
  }, [])

  const currentPrimaryType = draft.primaryType || "CULTURE_HERITAGE"
  const currentSecondaryTypes: ExperienceType[] = Array.isArray(draft.secondaryTypes)
    ? draft.secondaryTypes
    : []
  const currentAttributes: string[] = Array.isArray(draft.attributes)
    ? draft.attributes
    : []

  const handleToggleSecondaryType = (typeVal: ExperienceType) => {
    if (currentSecondaryTypes.includes(typeVal)) {
      updateField(
        "secondaryTypes",
        currentSecondaryTypes.filter((t) => t !== typeVal)
      )
    } else {
      updateField("secondaryTypes", [...currentSecondaryTypes, typeVal])
    }
  }

  const handleToggleAttribute = (attrVal: string) => {
    if (currentAttributes.includes(attrVal)) {
      updateField(
        "attributes",
        currentAttributes.filter((a) => a !== attrVal)
      )
    } else {
      updateField("attributes", [...currentAttributes, attrVal])
    }
  }

  return (
    <FormSection
      title="Basic Information & Classification"
      sectionNumber={sectionNumber}
      active={isOpen}
      onClick={() => toggleSection("basic-info")}
    >
      <div className="flex flex-col gap-6">
        {/* Experience Name (Full Width) */}
        <div>
          <DynamicStyledField
            type="text"
            label="Experience Name"
            fieldName="name"
            placeholder="e.g. Exclusive Helicopter Safari over Theth & Blue Eye"
            required={true}
            enableStyle={false}
            value={draft.name || ""}
            onChange={(val) => updateField("name", val)}
          />
        </div>

        {/* Editorial Subtitle & Short Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DynamicStyledField
            type="text"
            label="Inspirational Subtitle / Tagline"
            fieldName="subtitle"
            placeholder="e.g. Soar over untamed alpine peaks and pristine emerald springs"
            enableStyle={false}
            value={draft.subtitle || ""}
            onChange={(val) => updateField("subtitle", val)}
          />

          <DynamicStyledField
            type="text"
            label="Short Summary (Teaser)"
            fieldName="summary"
            placeholder="e.g. A private airborne expedition into the Accursed Mountains with insider landing."
            enableStyle={false}
            value={draft.summary || ""}
            onChange={(val) => updateField("summary", val)}
          />
        </div>

        {/* CLASSIFICATION: Primary (Dropdown) & Secondary Types (Pills) */}
        <div className="rounded-xl border border-border/80 bg-muted/15 p-4.5 flex flex-col gap-4">
          <div className="flex items-center gap-2 pb-2 border-b border-border/50">
            <Layers className="h-4 w-4 text-primary" />
            <span className="text-xs font-bold uppercase tracking-wider text-foreground">
              Experience Classification (8 Canonical Types)
            </span>
          </div>

          {/* Primary Type Selection as Dropdown */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-foreground block">
              Primary Experience Type <span className="text-destructive">*</span>
            </label>
            <select
              value={currentPrimaryType}
              onChange={(e) => {
                const nextVal = e.target.value as ExperienceType
                updateField("primaryType", nextVal)
                // Remove from secondary if it was there
                if (currentSecondaryTypes.includes(nextVal)) {
                  updateField(
                    "secondaryTypes",
                    currentSecondaryTypes.filter((st) => st !== nextVal)
                  )
                }
              }}
              className="w-full rounded-lg border border-border/70 bg-card px-3 py-2 text-xs font-medium text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-2xs cursor-pointer"
            >
              {EXPERIENCE_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label} — ({t.scope})
                </option>
              ))}
            </select>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              {EXPERIENCE_TYPE_CONFIG[currentPrimaryType]?.scope}
            </p>
          </div>

          {/* Secondary Types Multi-select */}
          <div>
            <label className="text-xs font-semibold text-foreground mb-1.5 block">
              Secondary Experience Types (Optional)
              <span className="text-[11px] font-normal text-muted-foreground ml-2">
                (Add complementary dimensions to enrich discoverability)
              </span>
            </label>
            <div className="flex flex-wrap gap-2">
              {EXPERIENCE_TYPES.filter((t) => t.value !== currentPrimaryType).map((t) => {
                const isChecked = currentSecondaryTypes.includes(t.value)
                return (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => handleToggleSecondaryType(t.value)}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium border transition-colors cursor-pointer",
                      isChecked
                        ? "bg-primary/15 text-primary border-primary/50 font-semibold"
                        : "bg-card text-muted-foreground border-border/70 hover:bg-muted hover:text-foreground"
                    )}
                  >
                    {isChecked && <Check className="h-3 w-3 text-primary" />}
                    {t.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Experience Attributes & Tags */}
          <div>
            <div className="flex items-center gap-1.5 mb-1.5">
              <Tag className="h-3.5 w-3.5 text-muted-foreground" />
              <label className="text-xs font-semibold text-foreground">
                Attributes & Service Modifiers
              </label>
            </div>
            <div className="flex flex-wrap gap-2">
              {EXPERIENCE_ATTRIBUTES.map((attr) => {
                const isSelected = currentAttributes.includes(attr.value)
                return (
                  <button
                    key={attr.value}
                    type="button"
                    onClick={() => handleToggleAttribute(attr.value)}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium border transition-colors cursor-pointer",
                      isSelected
                        ? "bg-secondary text-secondary-foreground border-secondary font-semibold"
                        : "bg-card text-muted-foreground border-border/60 hover:bg-muted"
                    )}
                  >
                    <Sparkles className="h-3 w-3" />
                    {attr.label}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* GEOGRAPHY LINKING: Country, Region, Place (Flex Column) */}
        <div className="rounded-xl border border-border/80 bg-muted/15 p-4.5 flex flex-col gap-4">
          <div className="flex items-center gap-2 pb-2 border-b border-border/50">
            <Globe className="h-4 w-4 text-primary" />
            <span className="text-xs font-bold uppercase tracking-wider text-foreground">
              Geographical Destination Linking
            </span>
          </div>

          <div className="flex flex-col gap-4">
            {/* Country (Required) */}
            <ParentLocationSelect
              value={draft.countryId || null}
              currentName={draft.country?.name}
              filterType="COUNTRY"
              label="Country (Required Location Link)"
              noneLabel="Select Country..."
              placeholder="Search countries..."
              onChange={(id, name) => {
                const nextId = id || null
                updateField("countryId", nextId)
                updateField("country", nextId && name ? { id: nextId, name } : null)
                // Also default parentId to country if not set
                if (!draft.parentId && nextId) {
                  updateField("parentId", nextId)
                  updateField("parent", { id: nextId, name: name || "" })
                }
              }}
            />

            {/* Region (Optional) */}
            <ParentLocationSelect
              value={draft.regionId || null}
              currentName={draft.region?.name}
              filterType="REGION"
              label="Region (Optional)"
              noneLabel="No Region Assigned"
              placeholder="Search regions..."
              onChange={(id, name) => {
                const nextId = id || null
                updateField("regionId", nextId)
                updateField("region", nextId && name ? { id: nextId, name } : null)
                if (nextId) {
                  updateField("parentId", nextId)
                  updateField("parent", { id: nextId, name: name || "" })
                }
              }}
            />

            {/* Place (Optional) */}
            <ParentLocationSelect
              value={draft.placeId || null}
              currentName={draft.place?.name}
              filterType="PLACE"
              label="Place / City / Landmark (Optional)"
              noneLabel="No Specific Place Assigned"
              placeholder="Search places..."
              onChange={(id, name) => {
                const nextId = id || null
                updateField("placeId", nextId)
                updateField("place", nextId && name ? { id: nextId, name } : null)
                if (nextId) {
                  updateField("parentId", nextId)
                  updateField("parent", { id: nextId, name: name || "" })
                }
              }}
            />
          </div>
        </div>

        {/* Price, Currency & Price Type Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <DynamicStyledField
            type="number"
            label="Price"
            fieldName="price"
            placeholder="0.00"
            min={0}
            step={0.01}
            enableStyle={false}
            value={draft.price !== null && draft.price !== undefined ? String(draft.price) : "0"}
            onChange={(val) => {
              const num = val === "" ? 0 : Number(val)
              updateField("price", num)
            }}
          />

          <DynamicStyledField
            type="select"
            label="Currency"
            fieldName="currency"
            enableStyle={false}
            value={draft.currency || "EUR"}
            options={currencyOptions}
            onChange={(val) => updateField("currency", val || "EUR")}
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

        {/* Featured Experience Checkbox */}
        <div className="flex items-center gap-2.5 rounded-lg border border-border/60 bg-muted/20 px-3 py-2.5">
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
              Feature this experience prominently across destination guides, hero cards, and curated collections.
            </span>
          </label>
        </div>
      </div>
    </FormSection>
  )
}

export default BasicInfoForm
