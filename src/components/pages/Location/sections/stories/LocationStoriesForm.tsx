import { useState } from "react"
import { Plus, Trash2, ChevronDown, ChevronUp, BookOpen, Layers } from "lucide-react"
import { DynamicStyledField } from "@/components/pages/CMS/shared/FormControls"
import { UniversalMultimediaForm } from "@/components/pages/CMS/shared/UniversalMultimediaForm"
import { ButtonsField } from "@/components/pages/CMS/shared/ButtonsField"
import { FormSection } from "../../shared/fields"
import type { LocationFormSectionProps } from "../../config/locationSections"
import { emptyLocation } from "../../shared/emptyLocation"
import { getSafeStringValue } from "../../shared/normalizeHelpers"

export type LocationStoryItem = {
  title: any
  subtitle: any
  button?: any
}

export function LocationStoriesForm({
  draft,
  updateField,
  openSections,
  toggleSection,
  sectionNumber,
}: LocationFormSectionProps) {
  const storiesData =
    draft?.stories ||
    (draft as any)?.data?.stories ||
    {}

  const isOpen = Boolean(openSections["stories"])

  const rawItems = storiesData.items
  const items: LocationStoryItem[] = Array.isArray(rawItems) ? rawItems : []

  const [openItems, setOpenItems] = useState<Record<number, boolean>>({ 0: true })

  const updateStoriesField = (fieldKey: string, value: any) => {
    updateField(`stories.${fieldKey}`, value)
  }

  const updateItems = (newItems: LocationStoryItem[]) => {
    updateStoriesField("items", newItems)
  }

  const toggleItemCollapse = (index: number) => {
    setOpenItems((prev) => ({
      ...prev,
      [index]: !prev[index],
    }))
  }

  const addItem = () => {
    const newItem: LocationStoryItem = {
      title: {
        value: "New Story Title",
        textColor: "#182D09",
        textOpacity: 1,
        backgroundColor: null,
        backgroundOpacity: 1,
      },
      subtitle: {
        value: "Brief story summary or takeaway",
        textColor: "#4B5563",
        textOpacity: 1,
        backgroundColor: null,
        backgroundOpacity: 1,
      },
      button: {
        label: "Read Story",
        url: "#",
      },
    }
    const updated = [...items, newItem]
    updateItems(updated)
    setOpenItems((prev) => ({ ...prev, [updated.length - 1]: true }))
  }

  const removeItem = (index: number) => {
    const updated = items.filter((_, i) => i !== index)
    updateItems(updated)
  }

  const moveItem = (index: number, direction: "up" | "down") => {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === items.length - 1)
    ) {
      return
    }
    const targetIndex = direction === "up" ? index - 1 : index + 1
    const updated = [...items]
    const [moved] = updated.splice(index, 1)
    updated.splice(targetIndex, 0, moved)
    updateItems(updated)
  }

  const updateItem = (index: number, fieldKey: string, value: any) => {
    const updated = items.map((item, i) => {
      if (i !== index) return item
      return {
        ...item,
        [fieldKey]: value,
      }
    })
    updateItems(updated)
  }

  return (
    <FormSection
      title="Location Stories"
      sectionNumber={sectionNumber}
      active={isOpen}
      onClick={() => toggleSection("stories")}
    >
      <div className="flex flex-col gap-6">
        {/* Header & Typography Controls */}
        <div className="rounded-xl border border-border/70 bg-card/60 p-4 space-y-4">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-primary" />
            Section Headers & Narrative
          </h4>

          {/* Eyebrow Label */}
          <DynamicStyledField
            type="text"
            label="Eyebrow Tag (e.g. The Editorial)"
            fieldName="stories.eyebrow"
            placeholder="e.g. The Editorial"
            value={storiesData.eyebrow}
            onChange={(val) => updateStoriesField("eyebrow", val)}
          />

          {/* Main Title Heading */}
          <DynamicStyledField
            type="text"
            label="Main Section Title"
            fieldName="stories.title"
            placeholder="e.g. Mira Stories / Location Stories"
            value={storiesData.title}
            onChange={(val) => updateStoriesField("title", val)}
          />

          {/* Description Paragraph */}
          <DynamicStyledField
            type="textarea"
            label="Section Description"
            fieldName="stories.description"
            placeholder="e.g. A collection of personal, cultural and inspiring stories..."
            value={storiesData.description}
            onChange={(val) => updateStoriesField("description", val)}
          />
        </div>

        {/* Featured Left Side Media */}
        <UniversalMultimediaForm
          title="Featured Media (Left Side Card)"
          fieldName="stories.leftSideMultimedia"
          value={storiesData.leftSideMultimedia || emptyLocation.stories?.leftSideMultimedia}
          onChange={(multimedia) => updateStoriesField("leftSideMultimedia", multimedia)}
        />

        {/* Story List Items */}
        <div className="flex items-center justify-between pt-2">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <Layers className="h-4 w-4 text-primary" />
            Stories List ({items.length})
          </h4>
        </div>

        <div className="flex flex-col gap-3">
          {items.map((item, index) => {
            const isItemOpen = !!openItems[index]
            const titleVal = getSafeStringValue(item.title)

            return (
              <div
                key={index}
                className="rounded-xl border border-border/80 bg-background transition-all hover:border-border"
              >
                {/* Item Accordion Header */}
                <div className="flex items-center justify-between px-4 py-3 bg-muted/20 rounded-t-xl">
                  <div
                    onClick={() => toggleItemCollapse(index)}
                    className="flex flex-1 items-center gap-3 cursor-pointer min-w-0"
                  >
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[11px] font-semibold text-primary">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="truncate text-xs font-semibold text-foreground">
                      {titleVal || `Story #${index + 1}`}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 shrink-0 ml-2">
                    <button
                      type="button"
                      onClick={() => moveItem(index, "up")}
                      disabled={index === 0}
                      className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-30 cursor-pointer"
                    >
                      <ChevronUp className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveItem(index, "down")}
                      disabled={index === items.length - 1}
                      className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-30 cursor-pointer"
                    >
                      <ChevronDown className="h-3.5 w-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => toggleItemCollapse(index)}
                      className="p-1 text-muted-foreground hover:text-foreground cursor-pointer"
                    >
                      <ChevronDown
                        className={`h-4 w-4 transition-transform duration-200 ${
                          isItemOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="p-1 text-destructive/80 hover:text-destructive cursor-pointer ml-1"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {/* Item Content Body */}
                {isItemOpen && (
                  <div className="p-4 border-t border-border/40 space-y-4">
                    {/* Story Title */}
                    <DynamicStyledField
                      type="text"
                      label="Story Title"
                      fieldName={`stories.items[${index}].title`}
                      value={titleVal || ""}
                      onChange={(val: string) =>
                        updateItem(index, "title", {
                          ...(typeof item.title === "object" ? item.title : {}),
                          value: val,
                        })
                      }
                      enableStyle
                      style={typeof item.title === "object" ? item.title : { textColor: "#182D09" }}
                      onStyleChange={(st: any) =>
                        updateItem(index, "title", {
                          ...(typeof item.title === "object" ? item.title : {}),
                          ...st,
                        })
                      }
                    />

                    {/* Story Subtitle */}
                    <DynamicStyledField
                      type="textarea"
                      label="Story Subtitle / Excerpt"
                      fieldName={`stories.items[${index}].subtitle`}
                      value={getSafeStringValue(item.subtitle)}
                      onChange={(val: string) =>
                        updateItem(index, "subtitle", {
                          ...(typeof item.subtitle === "object" ? item.subtitle : {}),
                          value: val,
                        })
                      }
                      enableStyle
                      style={typeof item.subtitle === "object" ? item.subtitle : { textColor: "#4B5563" }}
                      onStyleChange={(st: any) =>
                        updateItem(index, "subtitle", {
                          ...(typeof item.subtitle === "object" ? item.subtitle : {}),
                          ...st,
                        })
                      }
                    />
                  </div>
                )}
              </div>
            )
          })}

          <button
            type="button"
            onClick={addItem}
            className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-border/80 bg-muted/10 p-3 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/50 hover:bg-muted/30 hover:text-primary cursor-pointer mt-1"
          >
            <Plus className="h-4 w-4" />
            Add Story Item
          </button>
        </div>

        {/* Reusable Action Buttons */}
        <div className="rounded-xl border border-border/70 bg-card/60 p-4">
          <ButtonsField
            label="Section Action Buttons"
            fieldName="stories.buttons"
            value={storiesData.buttons}
            onChange={(newButtons) => updateStoriesField("buttons", newButtons)}
          />
        </div>

        {/* Section Background Multimedia */}
        <UniversalMultimediaForm
          title="Section Background Media (Image / Video / Color)"
          fieldName="stories.backgroundMultimedia"
          value={storiesData.backgroundMultimedia || emptyLocation.stories?.backgroundMultimedia}
          onChange={(multimedia) => updateStoriesField("backgroundMultimedia", multimedia)}
        />
      </div>
    </FormSection>
  )
}

export default LocationStoriesForm
