/* =====================================================
   LOCATION — CHARACTER FORM SECTION
   Form component to edit Region Character pillars section.
   Form section title is "Character".
===================================================== */

import { useState } from "react"
import { Plus, Trash2, ChevronDown, ChevronUp, Sparkles, Layers, Link as LinkIcon } from "lucide-react"
import { DynamicStyledField } from "@/components/pages/CMS/shared/FormControls"
import { UniversalMultimediaForm } from "@/components/pages/CMS/shared/UniversalMultimediaForm"
import { ButtonsField, type CmsButton } from "@/components/pages/CMS/shared/ButtonsField"
import { FormSection } from "../../shared/fields"
import type { LocationFormSectionProps } from "../../config/locationSections"
import { getSafeStringValue } from "../../shared/normalizeHelpers"

export type CharacterItem = {
  id?: string
  title: any
  description: any
  href?: string
  linkText?: string
  buttons?: CmsButton[]
  multimedia?: any
}

const defaultCharacterItems: CharacterItem[] = [
  {
    id: "alpine-wilderness",
    title: {
      value: "Untouched Alpine Wilderness",
      textColor: "#182d09",
      textOpacity: 1,
      backgroundColor: null,
      backgroundOpacity: 1,
    },
    description: {
      value: "The Accursed Mountains remained almost entirely off-limits to outsiders until the early 2000s. Today they offer trekking with a frontier quality that the Alps lost generations ago — without the lifts or crowds.",
      textColor: "#565e69",
      textOpacity: 1,
      backgroundColor: null,
      backgroundOpacity: 1,
    },
    href: "/destinations/albania/north-albania/wilderness",
    linkText: "Read More",
    multimedia: null,
  },
  {
    id: "highland-culture",
    title: {
      value: "Living Highland Culture",
      textColor: "#182d09",
      textOpacity: 1,
      backgroundColor: null,
      backgroundOpacity: 1,
    },
    description: {
      value: "The Kanun — a 15th-century code of highland law governing hospitality, marriage, and property — is still informally observed in remote villages.",
      textColor: "#565e69",
      textOpacity: 1,
      backgroundColor: null,
      backgroundOpacity: 1,
    },
    href: "/destinations/albania/north-albania/culture",
    linkText: "Read More",
    multimedia: null,
  },
  {
    id: "slow-journeys",
    title: {
      value: "The Great Slow Journeys",
      textColor: "#182d09",
      textOpacity: 1,
      backgroundColor: null,
      backgroundOpacity: 1,
    },
    description: {
      value: "The Komani Lake ferry and the Valbona-to-Theth trail have become essential experiences of the northern Balkans. Both remain unhurried and impossible to replicate.",
      textColor: "#565e69",
      textOpacity: 1,
      backgroundColor: null,
      backgroundOpacity: 1,
    },
    href: "/destinations/albania/north-albania/slow-journeys",
    linkText: "Read More",
    multimedia: null,
  },
]

export function CharacterForm({
  draft,
  updateField,
  openSections,
  toggleSection,
  sectionNumber,
}: LocationFormSectionProps) {
  const characterData =
    draft?.character ||
    draft?.regionCharacter ||
    (draft as any)?.data?.character ||
    (draft as any)?.data?.regionCharacter ||
    {}

  const labelData = characterData.label || {
    value: "Character",
    textColor: "#af6348",
    textOpacity: 1,
    backgroundColor: null,
    backgroundOpacity: 1,
  }

  const titleData = characterData.title || {
    value: "What makes this region singular",
    textColor: "#182d09",
    textOpacity: 1,
    backgroundColor: null,
    backgroundOpacity: 1,
  }

  const rawItems = characterData.items
  const items: CharacterItem[] = Array.isArray(rawItems) ? rawItems : []

  const bgMultimedia = characterData.backgroundMultimedia || {
    show: "color",
    color: { color: "#FFF8F2", opacity: 100, width: "100%", height: "100%", aspectRatio: "auto" },
    image: { url: null, alt: null },
    video: { url: null, alt: null },
  }

  const isOpen = Boolean(openSections["character"])

  // State to manage individual collapsible cards (first item expanded by default)
  const [openItems, setOpenItems] = useState<Record<number, boolean>>({ 0: true })

  const updateCharacterField = (fieldKey: string, value: any) => {
    updateField(`character.${fieldKey}`, value)
  }

  const updateItems = (newItems: CharacterItem[]) => {
    updateCharacterField("items", newItems)
  }

  const toggleItemCollapse = (index: number) => {
    setOpenItems((prev) => ({
      ...prev,
      [index]: !prev[index],
    }))
  }

  const expandAll = () => {
    const allOpen: Record<number, boolean> = {}
    items.forEach((_, idx) => {
      allOpen[idx] = true
    })
    setOpenItems(allOpen)
  }

  const collapseAll = () => {
    setOpenItems({})
  }

  const addItem = () => {
    const newItem: CharacterItem = {
      title: {
        value: "New Character Pillar",
        textColor: "#182d09",
        textOpacity: 1,
        backgroundColor: null,
        backgroundOpacity: 1,
      },
      description: {
        value: "Describe the defining characteristic or highlight of this region.",
        textColor: "#565e69",
        textOpacity: 1,
        backgroundColor: null,
        backgroundOpacity: 1,
      },
      buttons: [
        {
          label: "Read More",
          url: "",
          variant: "primary",
        },
      ],
      multimedia: null,
    }
    const updated = [...items, newItem]
    updateItems(updated)
    setOpenItems((prev) => ({ ...prev, [updated.length - 1]: true }))
  }

  const removeItem = (index: number) => {
    const updated = items.filter((_, i) => i !== index)
    updateItems(updated)
    setOpenItems((prev) => {
      const next: Record<number, boolean> = {}
      Object.keys(prev).forEach((k) => {
        const i = parseInt(k, 10)
        if (i < index) next[i] = prev[i]
        else if (i > index) next[i - 1] = prev[i]
      })
      return next
    })
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

    setOpenItems((prev) => {
      const next = { ...prev }
      const currentOpen = !!prev[index]
      const targetOpen = !!prev[targetIndex]
      next[index] = targetOpen
      next[targetIndex] = currentOpen
      return next
    })
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
      title="Character"
      sectionNumber={sectionNumber}
      active={isOpen}
      onClick={() => toggleSection("character")}
    >
      <div className="flex flex-col gap-6">
        {/* Section Header Settings */}
        <div className="rounded-xl border border-border/70 bg-card/60 p-4 space-y-4">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            Section Header & Narrative
          </h4>

          {/* Eyebrow Label */}
          <DynamicStyledField
            type="text"
            label="Eyebrow / Section Label"
            fieldName="character.label"
            value={labelData.value !== undefined ? labelData.value : labelData}
            onChange={(val: string) =>
              updateCharacterField("label.value", val)
            }
            enableStyle
            style={typeof labelData === "object" ? labelData : { textColor: "#af6348" }}
            onStyleChange={(st: any) =>
              updateCharacterField("label", {
                ...(typeof labelData === "object" ? labelData : {}),
                ...st,
              })
            }
          />

          {/* Section Title */}
          <DynamicStyledField
            type="text"
            label="Main Section Title"
            fieldName="character.title"
            value={titleData.value !== undefined ? titleData.value : titleData}
            onChange={(val: string) =>
              updateCharacterField("title.value", val)
            }
            enableStyle
            style={typeof titleData === "object" ? titleData : { textColor: "#182d09" }}
            onStyleChange={(st: any) =>
              updateCharacterField("title", {
                ...(typeof titleData === "object" ? titleData : {}),
                ...st,
              })
            }
          />
        </div>

        {/* Character Pillars List Header */}
        <div className="flex items-center justify-between pt-2">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <Layers className="h-4 w-4 text-primary" />
            Character Pillars ({items.length})
          </h4>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={expandAll}
              className="text-[11px] font-medium text-primary hover:underline cursor-pointer"
            >
              Expand All
            </button>
            <span className="text-muted-foreground/40 text-[10px]">|</span>
            <button
              type="button"
              onClick={collapseAll}
              className="text-[11px] font-medium text-muted-foreground hover:text-foreground cursor-pointer"
            >
              Collapse All
            </button>
          </div>
        </div>

        {/* Pillars Array */}
        <div className="flex flex-col gap-3">
          {items.map((item, index) => {
            const isItemOpen = !!openItems[index]
            const titleVal = getSafeStringValue(item.title)

            return (
              <div
                key={item.id || index}
                className="rounded-xl border border-border/80 bg-background transition-all hover:border-border"
              >
                {/* Item Accordion Header */}
                <div className="flex items-center justify-between px-4 py-3 bg-muted/20 rounded-t-xl">
                  <div
                    onClick={() => toggleItemCollapse(index)}
                    className="flex flex-1 items-center gap-3 cursor-pointer min-w-0"
                  >
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[11px] font-semibold text-primary">
                      {index + 1}
                    </span>
                    <span className="truncate text-xs font-semibold text-foreground">
                      {titleVal || `Pillar #${index + 1}`}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 shrink-0 ml-2">
                    {/* Move Up/Down Controls */}
                    <button
                      type="button"
                      onClick={() => moveItem(index, "up")}
                      disabled={index === 0}
                      className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-30 cursor-pointer"
                      title="Move Up"
                    >
                      <ChevronUp className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveItem(index, "down")}
                      disabled={index === items.length - 1}
                      className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-30 cursor-pointer"
                      title="Move Down"
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
                      title="Delete Pillar"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {/* Item Content Body */}
                {isItemOpen && (
                  <div className="p-4 border-t border-border/40 space-y-4">
                    {/* Title */}
                    <DynamicStyledField
                      type="text"
                      label="Pillar Title"
                      fieldName={`character.items[${index}].title`}
                      value={titleVal || ""}
                      onChange={(val: string) =>
                        updateItem(index, "title", {
                          ...(typeof item.title === "object" ? item.title : {}),
                          value: val,
                        })
                      }
                      enableStyle
                      style={
                        typeof item.title === "object"
                          ? item.title
                          : { textColor: "#182d09" }
                      }
                      onStyleChange={(st: any) =>
                        updateItem(index, "title", {
                          ...(typeof item.title === "object" ? item.title : {}),
                          ...st,
                        })
                      }
                    />

                    {/* Description */}
                    <DynamicStyledField
                      type="textarea"
                      label="Description"
                      fieldName={`character.items[${index}].description`}
                      value={
                        typeof item.description === "object"
                          ? item.description?.value
                          : item.description || ""
                      }
                      onChange={(val: string) =>
                        updateItem(index, "description", {
                          ...(typeof item.description === "object"
                            ? item.description
                            : {}),
                          value: val,
                        })
                      }
                      enableStyle
                      style={
                        typeof item.description === "object"
                          ? item.description
                          : { textColor: "#565e69" }
                      }
                      onStyleChange={(st: any) =>
                        updateItem(index, "description", {
                          ...(typeof item.description === "object"
                            ? item.description
                            : {}),
                          ...st,
                        })
                      }
                    />

                    {/* Action Buttons */}
                    <div className="rounded-lg border border-border/70 bg-card p-3.5">
                      <ButtonsField
                        label="Action Buttons"
                        fieldName={`character.items[${index}].buttons`}
                        buttons={
                          Array.isArray(item.buttons) && item.buttons.length > 0
                            ? item.buttons
                            : item.href || item.linkText
                            ? [{ label: item.linkText || "Read More", url: item.href || "#", variant: "primary" }]
                            : []
                        }
                        onChange={(newButtons) => updateItem(index, "buttons", newButtons)}
                      />
                    </div>

                    {/* Multimedia / Icon Form */}
                    <div className="pt-2">
                      <label className="text-xs font-medium text-foreground mb-2 block">
                        Pillar Icon / Image Multimedia
                      </label>
                      <UniversalMultimediaForm
                        value={item.multimedia || null}
                        onChange={(mVal) => updateItem(index, "multimedia", mVal)}
                      />
                    </div>
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
            Add Character Pillar Item
          </button>
        </div>

        {/* Background Multimedia */}
        <div className="rounded-xl border border-border/70 bg-card/60 p-4 space-y-3 pt-4">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Section Background Multimedia
          </h4>
          <UniversalMultimediaForm
            value={bgMultimedia}
            onChange={(val) => updateCharacterField("backgroundMultimedia", val)}
          />
        </div>
      </div>
    </FormSection>
  )
}
