import type { JourneyData } from "../../journeyTypes"
import {
  JOURNEY_TYPES,
  TRAVEL_STYLES,
  PERFECT_FOR_LIST,
  PACE_LIST,
  COMFORT_LEVELS,
  JOURNEY_STATUS_LIST,
} from "../../journeyTypes"
import { FormSection, Field } from "../../shared/fields"
import { slugify } from "./normalizeBasicInfo"

interface BasicInfoFormProps {
  draft: JourneyData
  updateField: (path: string, value: any) => void
  openSections: Record<string, boolean>
  toggleSection: (key: string) => void
  sectionNumber: string
}

export function BasicInfoForm({
  draft,
  updateField,
  openSections,
  toggleSection,
  sectionNumber,
}: BasicInfoFormProps) {
  const isOpen = Boolean(openSections["basic-info"])

  const toggleArrayItem = (path: string, currentArray: string[] = [], item: string) => {
    const arr = Array.isArray(currentArray) ? currentArray : []
    if (arr.includes(item)) {
      updateField(
        path,
        arr.filter((i) => i !== item)
      )
    } else {
      updateField(path, [...arr, item])
    }
  }

  const handleTitleChange = (val: string) => {
    updateField("title", val)
    updateField("slug", slugify(val))
  }

  return (
    <FormSection
      title="Basic Journey Information & Schema Attributes"
      sectionNumber={sectionNumber}
      active={isOpen}
      onClick={() => toggleSection("basic-info")}
    >
      <div className="flex flex-col gap-4">
        {/* Title, Slug & Subtitle */}
        <Field
          label="Journey Title"
          value={draft.title}
          onChange={handleTitleChange}
          placeholder="e.g. Classic Albania & The Ionian Coast"
        />

        <Field
          label="URL Slug (Auto-generated)"
          value={draft.slug || slugify(draft.title || "")}
          onChange={(val) => updateField("slug", val)}
          placeholder="e.g. classic-albania-and-the-ionian-coast"
        />

        <Field
          label="Subtitle / Summary"
          value={draft.subtitle || ""}
          onChange={(val) => updateField("subtitle", val)}
          multiline
          rows={2}
          placeholder="Brief highlight of the journey experience..."
        />

        {/* Price & Currency */}
        <Field
          label="Base Price"
          type="number"
          value={draft.price}
          onChange={(val) => updateField("price", Number(val))}
        />

        <Field
          label="Currency"
          value={draft.currency || "EUR"}
          onChange={(val) => updateField("currency", val)}
          placeholder="EUR, USD..."
        />

        {/* Days */}
        <Field
          label="Min Days"
          type="number"
          value={draft.minDays}
          onChange={(val) => updateField("minDays", Number(val))}
        />

        <Field
          label="Max Days"
          type="number"
          value={draft.maxDays}
          onChange={(val) => updateField("maxDays", Number(val))}
        />

        {/* Select Dropdowns */}
        <div className="flex flex-col gap-1.5">
          <label className="block text-xs font-semibold uppercase tracking-wider text-foreground">
            Travel Pace
          </label>
          <select
            value={draft.pace || "BALANCED"}
            onChange={(e) => updateField("pace", e.target.value)}
            className="w-full rounded-lg border border-border/60 bg-background px-3 py-2 text-xs outline-none focus:border-primary cursor-pointer"
          >
            {PACE_LIST.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="block text-xs font-semibold uppercase tracking-wider text-foreground">
            Comfort Level
          </label>
          <select
            value={draft.comfortLevel || "BOUTIQUE"}
            onChange={(e) => updateField("comfortLevel", e.target.value)}
            className="w-full rounded-lg border border-border/60 bg-background px-3 py-2 text-xs outline-none focus:border-primary cursor-pointer"
          >
            {COMFORT_LEVELS.map((c) => (
              <option key={c} value={c}>
                {c.replace(/_/g, " ")}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="block text-xs font-semibold uppercase tracking-wider text-foreground">
            Publish Status
          </label>
          <select
            value={draft.status || "DRAFT"}
            onChange={(e) => updateField("status", e.target.value)}
            className="w-full rounded-lg border border-border/60 bg-background px-3 py-2 text-xs outline-none focus:border-primary cursor-pointer"
          >
            {JOURNEY_STATUS_LIST.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* Featured Checkbox */}
        <div className="flex flex-col gap-1.5 pt-1">
          <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-foreground">
            <input
              type="checkbox"
              checked={Boolean(draft.featured)}
              onChange={(e) => updateField("featured", e.target.checked)}
              className="h-4 w-4 rounded border-border text-primary focus:ring-primary cursor-pointer"
            />
            Mark as Featured Journey (Display on Homepage & Highlights)
          </label>
        </div>

        {/* Multi-select Enums */}
        <div className="flex flex-col gap-4 pt-4 border-t border-border/40">
          <div className="flex flex-col gap-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-foreground">
              Journey Types
            </label>
            <div className="flex flex-wrap gap-2">
              {JOURNEY_TYPES.map((type) => {
                const selected = (draft.journeyType || []).includes(type)
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => toggleArrayItem("journeyType", draft.journeyType, type)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${selected
                        ? "bg-primary text-primary-foreground shadow-xs"
                        : "bg-muted hover:bg-muted/80 text-muted-foreground"
                      }`}
                  >
                    {type.replace(/_/g, " ")}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-foreground">
              Travel Styles
            </label>
            <div className="flex flex-wrap gap-2">
              {TRAVEL_STYLES.map((style) => {
                const selected = (draft.travelStyle || []).includes(style)
                return (
                  <button
                    key={style}
                    type="button"
                    onClick={() => toggleArrayItem("travelStyle", draft.travelStyle, style)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${selected
                        ? "bg-accent text-accent-foreground shadow-xs"
                        : "bg-muted hover:bg-muted/80 text-muted-foreground"
                      }`}
                  >
                    {style.replace(/_/g, " ")}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-foreground">
              Perfect For
            </label>
            <div className="flex flex-wrap gap-2">
              {PERFECT_FOR_LIST.map((pf) => {
                const selected = (draft.perfectFor || []).includes(pf)
                return (
                  <button
                    key={pf}
                    type="button"
                    onClick={() => toggleArrayItem("perfectFor", draft.perfectFor, pf)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${selected
                        ? "bg-emerald-600 text-white shadow-xs"
                        : "bg-muted hover:bg-muted/80 text-muted-foreground"
                      }`}
                  >
                    {pf.replace(/_/g, " ")}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </FormSection>
  )
}

export default BasicInfoForm
