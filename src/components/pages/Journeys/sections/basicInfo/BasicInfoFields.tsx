import { useEffect } from "react"
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react"
import { DynamicStyledField } from "@/components/pages/CMS/shared/FormControls"
import { JourneySelectField } from "../../shared/fields"
import { useJourneyDraft } from "../../shared/JourneyDraftContext"
import { useCheckJourneySlug } from "@/hooks/journey/useCheckJourneySlug"
import type { Journey, Pace, ComfortLevel, JourneyStatus } from "../../journeyTypes"

export type BasicInfoFieldsProps = {
  draft: Journey
  updateField: (path: string, value: unknown) => void
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
  { label: "EUR (€)", value: "EUR" },
  { label: "USD ($)", value: "USD" },
  { label: "GBP (£)", value: "GBP" },
]

function generateSlug(val: string): string {
  return val
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
}

export function BasicInfoFields({ draft, updateField }: BasicInfoFieldsProps) {
  const { setIsSlugConflict, setSlugConflictMessage } = useJourneyDraft()

  const handleTitleChange = (val: string) => {
    updateField("title", val)
    const generatedSlug = generateSlug(val)
    updateField("slug", generatedSlug)
  }

  const currentSlug = draft.slug || generateSlug(draft.title ?? "")

  // Live backend query to check if a journey with this slug exists
  const { data: checkResult, isFetching: isCheckingSlug } = useCheckJourneySlug(
    currentSlug,
    draft.id
  )

  const isConflict = Boolean(checkResult?.exists)
  const conflictTitle = checkResult?.conflictJourney?.title

  useEffect(() => {
    if (isConflict) {
      setIsSlugConflict(true)
      setSlugConflictMessage(
        `Already journey exists with slug "${currentSlug}" (${conflictTitle || "Existing Journey"}). Creation locked!`
      )
    } else {
      setIsSlugConflict(false)
      setSlugConflictMessage(undefined)
    }
  }, [isConflict, conflictTitle, currentSlug, setIsSlugConflict, setSlugConflictMessage])

  return (
    <div className="space-y-4">
      {/* 1. Title */}
      <DynamicStyledField
        type="text"
        label="Journey Title"
        value={draft.title ?? ""}
        onChange={handleTitleChange}
        placeholder="e.g., Ancient Albania & Beyond"
      />

      {/* 2. URL Slug (Read-Only Preview & Conflict Check) */}
      <div className="space-y-2">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-foreground">
            URL Slug Preview
          </label>
          <div className="flex items-center rounded-lg border border-border/70 bg-muted/40 px-3 py-2 text-xs font-mono text-muted-foreground select-all">
            <span className="text-primary/70 mr-1 select-none">/journeys/</span>
            <span className="font-semibold text-foreground">
              {currentSlug || "slug-preview"}
            </span>
          </div>
        </div>

        {/* Live Query Feedback / Alert Box */}
        {isCheckingSlug ? (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground pt-0.5">
            <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
            <span>Checking slug availability in database...</span>
          </div>
        ) : isConflict ? (
          <div className="flex items-start gap-2.5 rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-xs text-destructive animate-in fade-in duration-300">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-destructive" />
            <div>
              <p className="font-semibold text-sm">
                Journey with this slug already exists! Cannot create duplicate journey.
              </p>
              <p className="mt-1 text-xs text-destructive/90 leading-relaxed">
                A journey named &quot;{conflictTitle || currentSlug}&quot; is already registered in the database with this URL slug. Duplicate journeys with the same slug are not permitted, and the creation action has been locked. Please update the Journey Title to continue.
              </p>
            </div>
          </div>
        ) : currentSlug ? (
          <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium pt-0.5">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>Slug is available for new journey</span>
          </div>
        ) : null}
      </div>

      {/* 3. Subtitle / Description */}
      <DynamicStyledField
        type="textarea"
        label="Subtitle / Description"
        value={draft.subtitle ?? ""}
        onChange={(val: string) => updateField("subtitle", val)}
        placeholder="e.g., A curated 7-day luxury expedition across jagged alpine peaks, Ottoman citadel heritage, and turquoise coastal fjords."
      />

      {/* 4. Price & Currency */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <DynamicStyledField
          type="number"
          label="Starting Price"
          value={draft.price ?? 0}
          onChange={(val: string) => updateField("price", val === "" ? 0 : Number(val))}
          placeholder="3495"
          min={0}
        />

        <JourneySelectField
          label="Currency"
          value={draft.currency || "EUR"}
          options={CURRENCY_OPTIONS}
          onChange={(val) => updateField("currency", val)}
        />
      </div>

      {/* 5. Days Range */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <DynamicStyledField
          type="number"
          label="Minimum Days"
          value={draft.minDays ?? 1}
          onChange={(val: string) => updateField("minDays", val === "" ? 1 : Number(val))}
          min={1}
          placeholder="7"
        />

        <DynamicStyledField
          type="number"
          label="Maximum Days"
          value={draft.maxDays ?? 1}
          onChange={(val: string) => updateField("maxDays", val === "" ? 1 : Number(val))}
          min={1}
          placeholder="10"
        />
      </div>

      {/* 6. Pace & Comfort Level */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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

      {/* 7. Status & Featured */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-end">
        <JourneySelectField
          label="Publication Status"
          value={draft.status || "DRAFT"}
          options={STATUS_OPTIONS}
          onChange={(val) => updateField("status", val)}
        />

        <div className="flex items-center gap-2.5 rounded-lg border border-border/70 bg-card/50 p-2.5 shadow-sm">
          <input
            type="checkbox"
            id="featured-checkbox"
            checked={!!draft.featured}
            onChange={(e) => updateField("featured", e.target.checked)}
            className="h-4 w-4 rounded border-border text-primary focus:ring-primary cursor-pointer"
          />
          <label
            htmlFor="featured-checkbox"
            className="text-xs font-medium text-foreground cursor-pointer select-none"
          >
            Featured Journey (Highlight on Homepage)
          </label>
        </div>
      </div>
    </div>
  )
}

