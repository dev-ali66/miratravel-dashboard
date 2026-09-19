import type { JourneyData, OverviewHighlightItem } from "../../journeyTypes"
import { FormSection, Field } from "../../shared/fields"
import { UniversalMultimediaForm } from "@/components/pages/CMS/shared/UniversalMultimediaForm"
import { Plus, Trash2 } from "lucide-react"

interface OverviewFormProps {
  draft: JourneyData
  updateField: (path: string, value: any) => void
  openSections: Record<string, boolean>
  toggleSection: (key: string) => void
  sectionNumber: string
}

export function OverviewForm({
  draft,
  updateField,
  openSections,
  toggleSection,
  sectionNumber,
}: OverviewFormProps) {
  const isOpen = Boolean(openSections["overview"])
  const overviewData = draft.overview || {}
  const highlightsList = overviewData.highlightsList || []
  const featuresList = overviewData.featuresList || []

  const addHighlight = () => {
    const newItem: OverviewHighlightItem = {
      id: `hl-${Date.now()}`,
      title: "New Highlight",
      description: "Highlight description...",
    }
    updateField("overview.highlightsList", [...highlightsList, newItem])
  }

  const removeHighlight = (index: number) => {
    updateField(
      "overview.highlightsList",
      highlightsList.filter((_, i) => i !== index)
    )
  }

  const addFeature = () => {
    updateField("overview.featuresList", [...featuresList, "New Feature Highlight"])
  }

  const updateFeature = (index: number, val: string) => {
    const next = [...featuresList]
    next[index] = val
    updateField("overview.featuresList", next)
  }

  const removeFeature = (index: number) => {
    updateField(
      "overview.featuresList",
      featuresList.filter((_, i) => i !== index)
    )
  }

  return (
    <FormSection
      title="Overview Tab & Narrative Content"
      sectionNumber={sectionNumber}
      active={isOpen}
      onClick={() => toggleSection("overview")}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field
          label="Badge Text"
          value={overviewData.badge || ""}
          onChange={(val) => updateField("overview.badge", val)}
          placeholder="e.g. Journey Overview"
        />

        <Field
          label="Overview Title"
          value={overviewData.title || ""}
          onChange={(val) => updateField("overview.title", val)}
          placeholder="e.g. Experience Unrivaled Luxury"
        />
      </div>

      <Field
        label="Overview Narrative (Detailed Story)"
        value={overviewData.overviewText || ""}
        onChange={(val) => updateField("overview.overviewText", val)}
        multiline
        rows={5}
        placeholder="Enter comprehensive journey overview text..."
      />

      <Field
        label="Route & Geography Summary"
        value={overviewData.routeSummary || ""}
        onChange={(val) => updateField("overview.routeSummary", val)}
        multiline
        rows={2}
        placeholder="e.g. Jackson Hole → Yellowstone National Park → Grand Teton Peak"
      />

      {/* Highlights List */}
      <div className="space-y-3 pt-3 border-t border-border/40">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-foreground">
            Key Highlights & Attributes
          </label>
          <button
            type="button"
            onClick={addHighlight}
            className="flex items-center gap-1 rounded bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary hover:bg-primary hover:text-primary-foreground transition-all cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" /> Add Highlight
          </button>
        </div>

        {highlightsList.map((hl, idx) => (
          <div
            key={hl.id || idx}
            className="rounded-lg border border-border/60 bg-muted/20 p-3 space-y-2 relative"
          >
            <button
              type="button"
              onClick={() => removeHighlight(idx)}
              className="absolute top-2 right-2 text-muted-foreground hover:text-destructive p-1 cursor-pointer"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>

            <Field
              label="Highlight Title"
              value={hl.title}
              onChange={(val) => updateField(`overview.highlightsList.${idx}.title`, val)}
            />
            <Field
              label="Description"
              value={hl.description || ""}
              onChange={(val) => updateField(`overview.highlightsList.${idx}.description`, val)}
              multiline
              rows={2}
            />
          </div>
        ))}
      </div>

      {/* Quick Features List */}
      <div className="space-y-3 pt-3 border-t border-border/40">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-foreground">
            Quick Bullet Features
          </label>
          <button
            type="button"
            onClick={addFeature}
            className="flex items-center gap-1 rounded bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary hover:bg-primary hover:text-primary-foreground transition-all cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" /> Add Bullet Feature
          </button>
        </div>

        {featuresList.map((feat, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <input
              type="text"
              value={feat}
              onChange={(e) => updateFeature(idx, e.target.value)}
              className="flex-1 rounded-lg border border-border/60 bg-background px-3 py-1.5 text-xs outline-none focus:border-primary"
            />
            <button
              type="button"
              onClick={() => removeFeature(idx)}
              className="text-muted-foreground hover:text-destructive p-1 cursor-pointer"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>

      {/* Mandatory Section Background Multimedia */}
      <div className="pt-4 border-t border-border/40">
        <label className="block text-xs font-bold uppercase tracking-wider text-foreground mb-3">
          Overview Section Background Multimedia
        </label>
        <UniversalMultimediaForm
          value={overviewData.backgroundMultimedia || { show: "color", color: { color: "#ffffff" } }}
          onChange={(val) => updateField("overview.backgroundMultimedia", val)}
        />
      </div>
    </FormSection>
  )
}
