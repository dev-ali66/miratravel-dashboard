/* =====================================================
   JOURNEYS — BASIC INFO FORM SECTION
===================================================== */

import {
  FormSection,
  JourneyInputField,
  JourneySelectField,
} from "../../shared/fields"
import type { Journey, Pace, ComfortLevel, JourneyStatus } from "../../journeyTypes"

export type BasicInfoFormProps = {
  draft: Journey
  updateField: (path: string, value: unknown) => void
  openSections: Record<string, boolean>
  toggleSection: (section: string) => void
}

const PACE_OPTIONS: { label: string; value: Pace }[] = [
  { label: "Relaxed", value: "RELAXED" },
  { label: "Balanced", value: "BALANCED" },
  { label: "Active", value: "ACTIVE" },
]

const COMFORT_OPTIONS: { label: string; value: ComfortLevel }[] = [
  { label: "Comfort / Standard", value: "COMFORT" },
  { label: "Boutique", value: "BOUTIQUE" },
  { label: "Premium Luxury", value: "PREMIUM_LUXURY" },
]

const STATUS_OPTIONS: { label: string; value: JourneyStatus }[] = [
  { label: "Draft", value: "DRAFT" },
  { label: "Published", value: "PUBLISHED" },
  { label: "Archived", value: "ARCHIVED" },
]

const CURRENCY_OPTIONS = [
  { label: "USD ($)", value: "USD" },
  { label: "EUR (€)", value: "EUR" },
  { label: "GBP (£)", value: "GBP" },
]

export function BasicInfoForm({
  draft,
  updateField,
  openSections,
  toggleSection,
}: BasicInfoFormProps) {
  const handleTitleChange = (val: string) => {
    updateField("title", val)
    // If slug is empty or was auto-generated from old title, update slug
    if (!draft.slug || draft.slug === "") {
      const generatedSlug = val
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-")
      updateField("slug", generatedSlug)
    }
  }

  return (
    <FormSection
      title="Basic Information"
      active={!!openSections["basic-info"]}
      onClick={() => toggleSection("basic-info")}
    >
      <div className="space-y-3.5">
        <JourneyInputField
          label="Journey Title"
          value={draft.title ?? ""}
          onChange={handleTitleChange}
          placeholder="e.g., Classic Northern Albania & Theth Valley"
          required
        />

        <JourneyInputField
          label="URL Slug"
          value={draft.slug ?? ""}
          onChange={(val) => updateField("slug", val)}
          placeholder="e.g., classic-northern-albania"
          required
        />

        <JourneyInputField
          label="Subtitle / Tagline"
          value={draft.subtitle ?? ""}
          onChange={(val) => updateField("subtitle", val)}
          placeholder="e.g., An immersive traverse from Tirana through high alpine peaks"
        />

        {/* Price & Currency */}
        <div className="grid grid-cols-2 gap-3">
          <JourneyInputField
            label="Starting Price"
            type="number"
            value={draft.price ?? 0}
            onChange={(val) => updateField("price", val)}
            placeholder="2850"
            min={0}
            required
          />

          <JourneySelectField
            label="Currency"
            value={draft.currency || "USD"}
            options={CURRENCY_OPTIONS}
            onChange={(val) => updateField("currency", val)}
          />
        </div>

        {/* Days Range */}
        <div className="grid grid-cols-2 gap-3">
          <JourneyInputField
            label="Min Days"
            type="number"
            value={draft.minDays ?? 1}
            onChange={(val) => updateField("minDays", val)}
            min={1}
            required
          />

          <JourneyInputField
            label="Max Days"
            type="number"
            value={draft.maxDays ?? 1}
            onChange={(val) => updateField("maxDays", val)}
            min={1}
            required
          />
        </div>

        {/* Pace & Comfort */}
        <div className="grid grid-cols-2 gap-3">
          <JourneySelectField
            label="Trip Pace"
            value={draft.pace || "BALANCED"}
            options={PACE_OPTIONS}
            onChange={(val) => updateField("pace", val)}
          />

          <JourneySelectField
            label="Comfort Level"
            value={draft.comfortLevel || "BOUTIQUE"}
            options={COMFORT_OPTIONS}
            onChange={(val) => updateField("comfortLevel", val)}
          />
        </div>

        {/* Status & Featured */}
        <div className="grid grid-cols-2 gap-3 items-end">
          <JourneySelectField
            label="Status"
            value={draft.status || "DRAFT"}
            options={STATUS_OPTIONS}
            onChange={(val) => updateField("status", val)}
          />

          <div className="flex items-center gap-2 pb-2">
            <input
              type="checkbox"
              id="featured-checkbox"
              checked={!!draft.featured}
              onChange={(e) => updateField("featured", e.target.checked)}
              className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
            />
            <label
              htmlFor="featured-checkbox"
              className="text-xs font-medium text-foreground cursor-pointer select-none"
            >
              Feature on Homepage
            </label>
          </div>
        </div>
      </div>
    </FormSection>
  )
}
