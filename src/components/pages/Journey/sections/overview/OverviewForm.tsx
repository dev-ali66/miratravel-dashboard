import { DynamicStyledField } from "@/components/pages/CMS/shared/FormControls"
import { UniversalMultimediaForm } from "@/components/pages/CMS/shared/UniversalMultimediaForm"
import { FormSection } from "../../shared/fields"
import type { JourneyData } from "../../journeyTypes"
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

  const updateOverviewField = (fieldKey: string, value: any) => {
    updateField(`overview.${fieldKey}`, value)
  }

  const highlights = Array.isArray(overviewData.highlightsList) ? overviewData.highlightsList : []
  const features = Array.isArray(overviewData.featuresList) ? overviewData.featuresList : []

  const addHighlight = () => {
    const newHighlight = {
      id: `hl-${Date.now()}`,
      title: { value: "", textColor: "#464136", textOpacity: 1, backgroundColor: null, backgroundOpacity: 1 },
    }
    updateOverviewField("highlightsList", [...highlights, newHighlight])
  }

  const removeHighlight = (index: number) => {
    const updated = highlights.filter((_, idx) => idx !== index)
    updateOverviewField("highlightsList", updated)
  }

  const updateHighlightTitle = (index: number, val: any) => {
    const updated = highlights.map((item: any, idx: number) => {
      if (idx !== index) return item
      return { ...item, title: val }
    })
    updateOverviewField("highlightsList", updated)
  }

  const addFeature = () => {
    const newFeature = { value: "", textColor: "#464136", textOpacity: 1, backgroundColor: null, backgroundOpacity: 1 }
    updateOverviewField("featuresList", [...features, newFeature])
  }

  const removeFeature = (index: number) => {
    const updated = features.filter((_, idx) => idx !== index)
    updateOverviewField("featuresList", updated)
  }

  const updateFeatureVal = (index: number, val: any) => {
    const updated = features.map((f: any, idx: number) => {
      if (idx !== index) return f
      return val
    })
    updateOverviewField("featuresList", updated)
  }

  return (
    <FormSection
      title="Journey Overview & Highlights Configuration"
      sectionNumber={sectionNumber}
      active={isOpen}
      onClick={() => toggleSection("overview")}
    >
      <div className="flex flex-col gap-5">
        {/* Section Badge */}
        <DynamicStyledField
          type="text"
          label="Section Badge"
          fieldName="overview.badge"
          placeholder="e.g. Journey Overview"
          value={overviewData.badge}
          onChange={(val) => updateOverviewField("badge", val)}
        />

        {/* Section Main Title */}
        <DynamicStyledField
          type="textarea"
          rows={2}
          label="Overview Title"
          fieldName="overview.title"
          placeholder="e.g. Experience Unrivaled Luxury"
          value={overviewData.title}
          onChange={(val) => updateOverviewField("title", val)}
        />

        {/* Subtitle */}
        <DynamicStyledField
          type="text"
          label="Overview Subtitle"
          fieldName="overview.subtitle"
          placeholder="e.g. Curated experiences tailored to perfection"
          value={overviewData.subtitle}
          onChange={(val) => updateOverviewField("subtitle", val)}
        />

        {/* Why We Designed This Journey Narrative */}
        <DynamicStyledField
          type="textarea"
          rows={5}
          label="Why We Designed This Journey (Editorial Paragraphs)"
          fieldName="overview.overviewText"
          placeholder="Write the editorial narrative paragraphs..."
          value={overviewData.overviewText}
          onChange={(val) => updateOverviewField("overviewText", val)}
        />

        {/* Route Summary */}
        <DynamicStyledField
          type="text"
          label="Route Summary Route Line"
          fieldName="overview.routeSummary"
          placeholder="e.g. Tirana · Berat · Gjirokastër · Theth · Shkodër"
          value={overviewData.routeSummary}
          onChange={(val) => updateOverviewField("routeSummary", val)}
        />

        {/* Journey Highlights Repeater */}
        <div className="space-y-3 rounded-lg border border-border/70 bg-card p-4">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold uppercase tracking-wider text-foreground">
              Journey Highlights List (Checkmarked Items)
            </label>
            <button
              type="button"
              onClick={addHighlight}
              className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:opacity-90 cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Highlight
            </button>
          </div>

          <div className="space-y-3">
            {highlights.map((item: any, idx: number) => (
              <div key={item.id || idx} className="flex items-start gap-2 rounded-lg border border-border/50 bg-background p-3">
                <div className="flex-1">
                  <DynamicStyledField
                    type="text"
                    label={`Highlight #${idx + 1}`}
                    fieldName={`overview.highlightsList.${idx}.title`}
                    placeholder="e.g. Exclusive wine tasting at family-owned Berat vineyards"
                    value={item.title}
                    onChange={(val) => updateHighlightTitle(idx, val)}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeHighlight(idx)}
                  className="mt-6 text-muted-foreground hover:text-destructive cursor-pointer p-1"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Is This Journey For You? Features Repeater */}
        <div className="space-y-3 rounded-lg border border-border/70 bg-card p-4">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold uppercase tracking-wider text-foreground">
              "Is This Journey For You?" Items
            </label>
            <button
              type="button"
              onClick={addFeature}
              className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:opacity-90 cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Item
            </button>
          </div>

          <div className="space-y-3">
            {features.map((f: any, idx: number) => (
              <div key={idx} className="flex items-start gap-2 rounded-lg border border-border/50 bg-background p-3">
                <div className="flex-1">
                  <DynamicStyledField
                    type="text"
                    label={`Item #${idx + 1}`}
                    fieldName={`overview.featuresList.${idx}`}
                    placeholder="e.g. Seekers of authentic local heritage"
                    value={f}
                    onChange={(val) => updateFeatureVal(idx, val)}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeFeature(idx)}
                  className="mt-6 text-muted-foreground hover:text-destructive cursor-pointer p-1"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Universal Multimedia Background */}
        <UniversalMultimediaForm
          title="Overview Section Background Media"
          fieldName="overview.backgroundMultimedia"
          value={overviewData.backgroundMultimedia || { show: "color" }}
          onChange={(val) => updateOverviewField("backgroundMultimedia", val)}
        />
      </div>
    </FormSection>
  )
}
