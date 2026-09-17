/* =====================================================
   LOCATION — PRACTICAL INFORMATION FORM SECTION
   Form component to edit Region Practical Information (Before Travel) section.
===================================================== */

import { useState } from "react"
import {
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  Info,
  Sparkles,
} from "lucide-react"
import { DynamicStyledField } from "@/components/pages/CMS/shared/FormControls"
import { UniversalMultimediaForm } from "@/components/pages/CMS/shared/UniversalMultimediaForm"
import { FormSection } from "../../shared/fields"
import type { LocationFormSectionProps } from "../../config/locationSections"

export type PracticalInfoItem = {
  id?: string
  title: any
  content: any
}

export function PracticalInfoForm({
  draft,
  updateField,
  openSections,
  toggleSection,
  sectionNumber,
}: LocationFormSectionProps) {
  const practicalData =
    draft?.practicalInfo ||
    (draft as any)?.data?.practicalInfo ||
    (draft as any)?.travelInfo?.beforeTravel ||
    (draft as any)?.beforeTravel ||
    {}

  const rawItems = practicalData.items
  const items: PracticalInfoItem[] = Array.isArray(rawItems) ? rawItems : []

  const isOpen = Boolean(openSections["practical-info"])
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0)

  const updatePracticalField = (fieldKey: string, value: any) => {
    updateField(`practicalInfo.${fieldKey}`, value)
  }

  const updateItems = (newItems: PracticalInfoItem[]) => {
    updatePracticalField("items", newItems)
  }

  const handleAddItem = () => {
    const newItem: PracticalInfoItem = {
      title: {
        value: "New Practical Travel Guide Item",
        textColor: "#182d09",
        textOpacity: 1,
        backgroundColor: null,
        backgroundOpacity: 1,
      },
      content: {
        value: "Provide essential travel tips, visa rules, currency guidelines, or safety recommendations for visitors.",
        textColor: "#565e69",
        textOpacity: 1,
        backgroundColor: null,
        backgroundOpacity: 1,
      },
    }

    const updated = [...items, newItem]
    updateItems(updated)
    setExpandedIndex(updated.length - 1)
  }

  const handleRemoveItem = (indexToRemove: number) => {
    const updated = items.filter((_, idx) => idx !== indexToRemove)
    updateItems(updated)
    if (expandedIndex === indexToRemove) {
      setExpandedIndex(null)
    } else if (expandedIndex !== null && expandedIndex > indexToRemove) {
      setExpandedIndex(expandedIndex - 1)
    }
  }

  const handleMoveItem = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= items.length) return

    const updated = [...items]
    const temp = updated[index]
    updated[index] = updated[targetIndex]
    updated[targetIndex] = temp

    updateItems(updated)
    setExpandedIndex(targetIndex)
  }

  const handleItemFieldChange = (index: number, field: "title" | "content", value: any) => {
    const updated = [...items]
    updated[index] = {
      ...updated[index],
      [field]: value,
    }
    updateItems(updated)
  }

  return (
    <FormSection
      title="Practical Information (Before Travel)"
      sectionNumber={sectionNumber}
      active={isOpen}
      onClick={() => toggleSection("practical-info")}
    >
      <div className="flex flex-col gap-5">
        {/* Eyebrow Label */}
        <DynamicStyledField
          type="text"
          label="Eyebrow Label"
          fieldName="practicalInfo.label"
          placeholder="e.g. PRACTICAL INFORMATION"
          value={
            practicalData.label || {
              value: "PRACTICAL INFORMATION",
              textColor: "#af6348",
              textOpacity: 1,
              backgroundColor: null,
              backgroundOpacity: 1,
            }
          }
          onChange={(val) => updatePracticalField("label", val)}
        />

        {/* Section Heading Title */}
        <DynamicStyledField
          type="text"
          label="Section Heading Title"
          fieldName="practicalInfo.title"
          placeholder="e.g. Essential Insights Before You Travel"
          value={
            practicalData.title || {
              value: "Essential Insights Before You Travel",
              textColor: "#182d09",
              textOpacity: 1,
              backgroundColor: null,
              backgroundOpacity: 1,
            }
          }
          onChange={(val) => updatePracticalField("title", val)}
        />

        {/* Left Column Featured Image / Multimedia */}
        <UniversalMultimediaForm
          title="Left Column Featured Image"
          fieldName="practicalInfo.imageMultimedia"
          imageFieldName="practicalInfoFeaturedImage"
          value={
            practicalData.imageMultimedia || {
              show: "image",
              color: { color: "#FFFFFF", opacity: 100, width: "100%", height: "100%", aspectRatio: "auto" },
              image: { url: "", alt: "Practical Information" },
              video: { url: null, alt: null },
            }
          }
          onChange={(multimedia) => updatePracticalField("imageMultimedia", multimedia)}
        />

        {/* Section Background Multimedia */}
        <UniversalMultimediaForm
          title="Section Background Media"
          fieldName="practicalInfo.backgroundMultimedia"
          imageFieldName="practicalInfoBackgroundImage"
          videoFieldName="practicalInfoBackgroundVideo"
          value={
            practicalData.backgroundMultimedia || {
              show: "color",
              color: { color: "#FFF8F2", opacity: 100, width: "100%", height: "100%", aspectRatio: "auto" },
              image: { url: null, alt: null },
              video: { url: null, alt: null },
            }
          }
          onChange={(multimedia) => updatePracticalField("backgroundMultimedia", multimedia)}
        />

        {/* Accordion Items List */}
        <div className="flex flex-col gap-3 pt-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider flex items-center gap-1.5">
              <Info className="h-3.5 w-3.5 text-primary" />
              Accordion Guide Items ({items.length})
            </h4>
            <button
              type="button"
              onClick={handleAddItem}
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary/10 px-2.5 py-1.5 text-xs font-medium text-primary hover:bg-primary/20 transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Accordion Item
            </button>
          </div>

          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border p-6 text-center">
              <Sparkles className="h-6 w-6 text-muted-foreground/60 mb-2" />
              <p className="text-xs text-muted-foreground mb-3">
                No practical guide accordion items added yet. Click above to add visa, currency, etiquette, or transportation tips.
              </p>
              <button
                type="button"
                onClick={handleAddItem}
                className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                <Plus className="h-3.5 w-3.5" />
                Add First Accordion Item
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-2.5">
              {items.map((item, idx) => {
                const isExpanded = expandedIndex === idx
                const itemTitleStr =
                  typeof item.title === "object"
                    ? item.title?.value
                    : item.title || `Accordion Item #${idx + 1}`

                return (
                  <div
                    key={idx}
                    className="rounded-xl border border-border/80 bg-card overflow-hidden transition-all shadow-xs"
                  >
                    {/* Item Card Header */}
                    <div
                      onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                      className="flex items-center justify-between gap-3 bg-muted/30 px-3.5 py-2.5 cursor-pointer hover:bg-muted/50 transition-colors select-none"
                    >
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-semibold text-primary">
                          {idx + 1}
                        </span>
                        <span className="text-xs font-medium text-foreground truncate">
                          {itemTitleStr || "Untitled Accordion Item"}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => handleMoveItem(idx, "up")}
                          className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-30 transition-colors"
                          title="Move Up"
                        >
                          <ChevronUp className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          disabled={idx === items.length - 1}
                          onClick={() => handleMoveItem(idx, "down")}
                          className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-30 transition-colors"
                          title="Move Down"
                        >
                          <ChevronDown className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(idx)}
                          className="rounded p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors ml-1"
                          title="Delete Item"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Collapsible Form Body */}
                    {isExpanded && (
                      <div className="p-3.5 flex flex-col gap-4 border-t border-border/60">
                        {/* Title Field */}
                        <DynamicStyledField
                          type="text"
                          label="Accordion Item Title"
                          fieldName={`practicalInfo.items[${idx}].title`}
                          placeholder="e.g. Entry & Visa Requirements"
                          value={item.title}
                          onChange={(val) => handleItemFieldChange(idx, "title", val)}
                        />

                        {/* Content Field */}
                        <DynamicStyledField
                          type="richtext"
                          label="Accordion Item Content"
                          fieldName={`practicalInfo.items[${idx}].content`}
                          placeholder="Write the guide content, visa details, or travel advice for this item..."
                          value={item.content}
                          onChange={(val) => handleItemFieldChange(idx, "content", val)}
                        />

                        {/* Item Custom Side Media */}
                        <UniversalMultimediaForm
                          title="Item Custom Side Media (Shown when opened)"
                          fieldName={`practicalInfo.items.${idx}.multimedia`}
                          imageFieldName={`locationPracticalItemImg_${idx}`}
                          videoFieldName={`locationPracticalItemVid_${idx}`}
                          hideFieldNameBadge={true}
                          collapsible={true}
                          value={item.multimedia || item.imageMultimedia}
                          onChange={(multimedia) => handleItemFieldChange(idx, "multimedia", multimedia)}
                        />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </FormSection>
  )
}

export default PracticalInfoForm
