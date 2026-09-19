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
    if (currentArray.includes(item)) {
      updateField(
        path,
        currentArray.filter((i) => i !== item)
      )
    } else {
      updateField(path, [...currentArray, item])
    }
  }

  return (
    <FormSection
      title="Basic Journey Information & Schema Attributes"
      sectionNumber={sectionNumber}
      active={isOpen}
      onClick={() => toggleSection("basic-info")}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field
          label="Journey Title"
          value={draft.title}
          onChange={(val) => updateField("title", val)}
          placeholder="e.g. Yellowstone Wilderness Escape"
        />

        <Field
          label="URL Slug"
          value={draft.slug}
          onChange={(val) => updateField("slug", val)}
          placeholder="yellowstone-wilderness-escape"
          hint="Unique identifier for URL route"
        />
      </div>

      <Field
        label="Subtitle / Summary"
        value={draft.subtitle || ""}
        onChange={(val) => updateField("subtitle", val)}
        multiline
        rows={2}
        placeholder="Brief highlight of the journey experience..."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
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
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold uppercase tracking-wider text-foreground">
            Travel Pace
          </label>
          <select
            value={draft.pace || "BALANCED"}
            onChange={(e) => updateField("pace", e.target.value)}
            className="w-full rounded-lg border border-border/60 bg-background px-3 py-2 text-xs outline-none focus:border-primary"
          >
            {PACE_LIST.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold uppercase tracking-wider text-foreground">
            Comfort Level
          </label>
          <select
            value={draft.comfortLevel || "BOUTIQUE"}
            onChange={(e) => updateField("comfortLevel", e.target.value)}
            className="w-full rounded-lg border border-border/60 bg-background px-3 py-2 text-xs outline-none focus:border-primary"
          >
            {COMFORT_LEVELS.map((c) => (
              <option key={c} value={c}>
                {c.replace(/_/g, " ")}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold uppercase tracking-wider text-foreground">
            Publish Status
          </label>
          <select
            value={draft.status || "DRAFT"}
            onChange={(e) => updateField("status", e.target.value)}
            className="w-full rounded-lg border border-border/60 bg-background px-3 py-2 text-xs outline-none focus:border-primary"
          >
            {JOURNEY_STATUS_LIST.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-foreground">
          <input
            type="checkbox"
            checked={Boolean(draft.featured)}
            onChange={(e) => updateField("featured", e.target.checked)}
            className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
          />
          Mark as Featured Journey (Display on Homepage & Highlights)
        </label>
      </div>

      {/* Multi-select Enums */}
      <div className="space-y-4 pt-3 border-t border-border/40">
        <div className="space-y-2">
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
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    selected
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-muted hover:bg-muted/80 text-muted-foreground"
                  }`}
                >
                  {type.replace(/_/g, " ")}
                </button>
              )
            })}
          </div>
        </div>

        <div className="space-y-2">
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
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    selected
                      ? "bg-accent text-accent-foreground shadow-sm"
                      : "bg-muted hover:bg-muted/80 text-muted-foreground"
                  }`}
                >
                  {style.replace(/_/g, " ")}
                </button>
              )
            })}
          </div>
        </div>

        <div className="space-y-2">
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
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    selected
                      ? "bg-emerald-600 text-white shadow-sm"
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
    </FormSection>
  )
}
