import { useState } from "react"
import type { JourneyData } from "../../journeyTypes"
import { FormSection } from "../../shared/fields"
import { DynamicStyledField } from "@/components/pages/CMS/shared/FormControls"
import { UniversalMultimediaForm } from "@/components/pages/CMS/shared/UniversalMultimediaForm"
import { SingleButtonField } from "@/components/pages/CMS/shared/ButtonsField"
import { Plus, Trash2, Sparkles, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface AddOnsFormProps {
  draft: JourneyData
  updateField: (path: string, value: any) => void
  openSections: Record<string, boolean>
  toggleSection: (key: string) => void
  sectionNumber: string
}

export function AddOnsForm({
  draft,
  updateField,
  openSections,
  toggleSection,
  sectionNumber,
}: AddOnsFormProps) {
  const isOpen = Boolean(openSections["add-ons"])
  const addOnsData = draft.addOns || {}
  const itemsList = addOnsData.items || addOnsData.itemsList || []

  const [openItem, setOpenItem] = useState<number | null>(0)

  const addAddOn = () => {
    const nextNumber = itemsList.length + 1
    const newItem = {
      title: { value: "New Optional Experience", textColor: "#080c1d", textOpacity: 1, backgroundColor: null, backgroundOpacity: 1 },
      price: { value: "3,495", textColor: "#af6348", textOpacity: 1, backgroundColor: null, backgroundOpacity: 1 },
      currency: { value: "$", textColor: "#af6348", textOpacity: 1, backgroundColor: null, backgroundOpacity: 1 },
      day: { value: `Day ${nextNumber}`, textColor: "#af6348", textOpacity: 1, backgroundColor: null, backgroundOpacity: 1 },
      heading: { value: "Detailed Experience Heading", textColor: "#080c1d", textOpacity: 1, backgroundColor: null, backgroundOpacity: 1 },
      description: { value: "Explore scenic trails and historic experiences with guided local experts.", textColor: "#565e69", textOpacity: 1, backgroundColor: null, backgroundOpacity: 1 },
      multimedia: {
        show: "image",
        image: { url: "", alt: "", opacity: 100, overlayColor: "#000000", overlayOpacity: 0, width: "100%", height: "auto", aspectRatio: "auto", fit: "cover" },
        video: { url: "", alt: "", autoplay: true, loop: true, muted: true, opacity: 100, overlayColor: "#000000", overlayOpacity: 0, width: "100%", height: "auto", aspectRatio: "auto", fit: "cover" },
        color: { color: "#ffffff", opacity: 100, width: "100%", height: "100%", aspectRatio: "auto" },
      },
      button: {
        label: "Add this item",
        href: "#",
        variant: "primary",
        isExternal: false,
      },
    }
    const nextItems = [...itemsList, newItem]
    updateField("addOns.items", nextItems)
    setOpenItem(nextItems.length - 1)
  }

  const removeAddOn = (index: number) => {
    const nextItems = itemsList.filter((_: any, i: number) => i !== index)
    updateField("addOns.items", nextItems)
    if (openItem === index) setOpenItem(null)
  }

  const updateItemField = (index: number, subPath: string, val: any) => {
    updateField(`addOns.items.${index}.${subPath}`, val)
  }

  return (
    <FormSection
      title="Add-ons & Optional Upgrades Builder"
      sectionNumber={sectionNumber}
      active={isOpen}
      onClick={() => toggleSection("add-ons")}
    >
      <div className="flex flex-col gap-5">
        {/* Section Top Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DynamicStyledField
            type="text"
            label="Eyebrow / Badge Text"
            fieldName="addOns.eyebrow"
            placeholder="e.g. OPTIONAL EXPERIENCES"
            value={addOnsData.eyebrow}
            onChange={(val) => updateField("addOns.eyebrow", val)}
          />

          <DynamicStyledField
            type="textarea"
            rows={2}
            label="Section Title"
            fieldName="addOns.title"
            placeholder="e.g. Add some fun in your trip"
            value={addOnsData.title}
            onChange={(val) => updateField("addOns.title", val)}
          />
        </div>

        <DynamicStyledField
          type="richtext"
          label="Section Description"
          fieldName="addOns.description"
          placeholder="e.g. Enhance your journey with curated optional experiences..."
          value={addOnsData.description ?? addOnsData.subtitle}
          onChange={(val) => updateField("addOns.description", val)}
        />

        {/* Add-ons List */}
        <div className="space-y-4 pt-3 border-t border-border/40">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-primary" />
              Add-On Experiences (`items`) ({itemsList.length})
            </label>

            <button
              type="button"
              onClick={addAddOn}
              className="flex items-center gap-1 rounded bg-secondary px-2.5 py-1 text-xs font-semibold text-secondary-foreground hover:bg-secondary/80 transition-all cursor-pointer shadow-2xs"
            >
              <Plus className="h-3.5 w-3.5" /> Add Experience
            </button>
          </div>

          <div className="flex flex-col gap-3">
            {itemsList.map((item: any, idx: number) => {
              const isOpenItem = openItem === idx
              const itemTitleVal = typeof item.title === "object" ? item.title?.value : item.title

              return (
                <div
                  key={idx}
                  className="rounded-lg border border-border/60 bg-muted/20 overflow-hidden shadow-2xs"
                >
                  <div
                    onClick={() => setOpenItem(isOpenItem ? null : idx)}
                    className="flex items-center justify-between px-3 py-2.5 bg-muted/40 hover:bg-muted/60 border-b border-border/40 cursor-pointer transition-colors select-none"
                  >
                    <span className="text-xs font-bold text-primary uppercase tracking-wider">
                      Upgrade #{idx + 1}: {itemTitleVal || "Untitled Experience"}
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          removeAddOn(idx)
                        }}
                        className="text-muted-foreground hover:text-destructive p-1 cursor-pointer transition-colors"
                        title="Remove Upgrade"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                      <ChevronDown
                        className={cn(
                          "h-4 w-4 text-muted-foreground transition-transform duration-200",
                          isOpenItem && "rotate-180"
                        )}
                      />
                    </div>
                  </div>

                  {isOpenItem && (
                    <div className="p-4 flex flex-col gap-4 bg-background/50">
                      {/* Title, Price, Currency Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <DynamicStyledField
                          type="text"
                          label="Title (`title`)"
                          fieldName={`addOns.items.${idx}.title`}
                          value={item.title}
                          onChange={(val) => updateItemField(idx, "title", val)}
                          placeholder="e.g. Cycling"
                        />

                        <DynamicStyledField
                          type="text"
                          label="Price (`price`)"
                          fieldName={`addOns.items.${idx}.price`}
                          value={item.price}
                          onChange={(val) => updateItemField(idx, "price", val)}
                          placeholder="e.g. 3,495"
                        />

                        <DynamicStyledField
                          type="text"
                          label="Currency (`currency`)"
                          fieldName={`addOns.items.${idx}.currency`}
                          value={item.currency}
                          onChange={(val) => updateItemField(idx, "currency", val)}
                          placeholder="e.g. $ or EUR"
                        />
                      </div>

                      {/* Day, Heading Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <DynamicStyledField
                          type="text"
                          label="Day (`day`)"
                          fieldName={`addOns.items.${idx}.day`}
                          value={item.day ?? item.dayLabel}
                          onChange={(val) => updateItemField(idx, "day", val)}
                          placeholder="e.g. Day 1"
                        />

                        <DynamicStyledField
                          type="text"
                          label="Heading (`heading`)"
                          fieldName={`addOns.items.${idx}.heading`}
                          value={item.heading ?? item.detailedHeading}
                          onChange={(val) => updateItemField(idx, "heading", val)}
                          placeholder="e.g. Make your trip fun by cycling"
                        />
                      </div>

                      {/* Detailed Description */}
                      <DynamicStyledField
                        type="richtext"
                        label="Description (`description`)"
                        fieldName={`addOns.items.${idx}.description`}
                        value={item.description}
                        onChange={(val) => updateItemField(idx, "description", val)}
                        placeholder="Write experience detailed narrative..."
                      />

                      {/* Multimedia */}
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                          Experience Multimedia (`multimedia`)
                        </label>
                        <UniversalMultimediaForm
                          value={item.multimedia || { show: "image", image: { url: "" } }}
                          onChange={(val) => updateItemField(idx, "multimedia", val)}
                        />
                      </div>

                      {/* Action Button */}
                      <div className="pt-3 border-t border-border/40">
                        <SingleButtonField
                          label="Experience Button (`button`)"
                          value={item.button || { label: "Add this item", href: "#" }}
                          onChange={(val) => updateItemField(idx, "button", val)}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </FormSection>
  )
}
