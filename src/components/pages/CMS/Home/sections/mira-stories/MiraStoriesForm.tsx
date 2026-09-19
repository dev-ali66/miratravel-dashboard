import { useState } from "react"
import type { HomeFormSectionProps } from "../../config/homeSections"
import { FormSection, DynamicStyledField, getSafeString } from "@/components/pages/CMS/shared/FormControls"
import { ButtonsField } from "@/components/pages/CMS/shared/ButtonsField"
import { UniversalMultimediaForm } from "@/components/pages/CMS/shared/UniversalMultimediaForm"
import { Plus, Trash2, ChevronDown, ChevronUp, ArrowUp, ArrowDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useGetStories } from "@/hooks/story/useGetStories"
import { emptyMiraStories } from "./emptyMiraStories"

export function MiraStoriesForm({
  section,
  index,
  updateSection,
  updateSectionContent,
  updateSectionButtons,
  openSections,
  toggleSection,
  sectionNumber,
}: HomeFormSectionProps) {
  const content = (section.content ?? {}) as any
  const items = (section.items ?? []) as any[]
  const isOpen = Boolean(openSections["mira_stories"] || openSections["mira-stories"])

  const [openItems, setOpenItems] = useState<Record<number, boolean>>({
    0: true,
  })

  const { data: storiesResponse } = useGetStories()
  const stories = storiesResponse?.data ?? []

  const toggleItem = (itemIndex: number) => {
    setOpenItems((prev) => ({
      ...prev,
      [itemIndex]: !prev[itemIndex],
    }))
  }

  const addItem = () => {
    const newItem = {
      title: {
        value: "",
        textColor: "#182D09",
        textOpacity: 1,
        backgroundColor: null,
        backgroundOpacity: 1,
      },
      subtitle: {
        value: "",
        textColor: "#4B5563",
        textOpacity: 1,
        backgroundColor: null,
        backgroundOpacity: 1,
      },
      button: {
        label: "Read Story",
        url: "",
        variant: "PRIMARY",
        style: "primary",
        rounded: "full",
        backgroundColor: "#182D09",
        backgroundOpacity: 100,
        textColor: "#ffffff",
        textOpacity: 100,
        hoverBackgroundColor: "#f3f4f6",
        hoverTextColor: "#000000",
        target: "_self",
        showIcon: true,
      },
      url: "",
    }
    const updatedItems = [...items, newItem]
    updateSection(index, { items: updatedItems })
    setOpenItems((prev) => ({
      ...prev,
      [updatedItems.length - 1]: true,
    }))
  }

  const removeItem = (itemIndex: number) => {
    const updatedItems = items.filter((_, idx) => idx !== itemIndex)
    updateSection(index, { items: updatedItems })
  }

  const moveItem = (itemIndex: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? itemIndex - 1 : itemIndex + 1
    if (targetIndex < 0 || targetIndex >= items.length) return
    const updatedItems = [...items]
    const [moved] = updatedItems.splice(itemIndex, 1)
    updatedItems.splice(targetIndex, 0, moved)
    updateSection(index, { items: updatedItems })
    setOpenItems((prev) => ({
      ...prev,
      [itemIndex]: false,
      [targetIndex]: true,
    }))
  }

  const updateItem = (itemIndex: number, patch: Record<string, any>) => {
    const updatedItems = [...items]
    updatedItems[itemIndex] = {
      ...updatedItems[itemIndex],
      ...patch,
    }
    updateSection(index, { items: updatedItems })
  }

  const selectStoryForIndex = (itemIndex: number, storyId: string) => {
    if (!storyId) return
    const selectedStory = stories.find((s: any) => s.id === storyId)
    if (!selectedStory) return

    const currentItem = items[itemIndex] || {}
    const newTitleText = selectedStory.title
    const newSubtitleText =
      (selectedStory as any).excerpt ||
      (selectedStory as any).metaDescription ||
      (selectedStory as any).description ||
      ""
    const storyUrl = `/stories/${selectedStory.slug}`

    updateItem(itemIndex, {
      title:
        typeof currentItem.title === "object" && currentItem.title !== null
          ? { ...currentItem.title, value: newTitleText }
          : {
              value: newTitleText,
              textColor: "#182D09",
              textOpacity: 1,
              backgroundColor: null,
              backgroundOpacity: 1,
            },
      subtitle:
        typeof currentItem.subtitle === "object" && currentItem.subtitle !== null
          ? { ...currentItem.subtitle, value: newSubtitleText }
          : {
              value: newSubtitleText,
              textColor: "#4B5563",
              textOpacity: 1,
              backgroundColor: null,
              backgroundOpacity: 1,
            },
      button: {
        ...(currentItem.button || {
          label: "Read Story",
          variant: "PRIMARY",
          style: "primary",
          rounded: "full",
          backgroundColor: "#182D09",
          backgroundOpacity: 100,
          textColor: "#ffffff",
          textOpacity: 100,
          hoverBackgroundColor: "#f3f4f6",
          hoverTextColor: "#000000",
          target: "_self",
          showIcon: true,
        }),
        url: storyUrl,
      },
      url: storyUrl,
    })
  }

  return (
    <FormSection
      title="Mira Stories Section"
      sectionNumber={sectionNumber}
      active={isOpen}
      onClick={() => toggleSection("mira_stories")}
    >
      <div className="flex flex-col gap-5">
        <div className="rounded-lg border border-border/70 bg-card p-3.5">
          <p className="mb-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            Section Header & Description
          </p>

          <div className="flex flex-col gap-3">
            <DynamicStyledField
              type="text"
              label="Eyebrow"
              value={section.eyebrow ?? content.eyebrow ?? ""}
              onChange={(value: string) =>
                updateSectionContent(index, { eyebrow: value })
              }
              enableStyle
              style={section.homeMiraStoriesEyebrowStyle ?? content.homeMiraStoriesEyebrowStyle}
              onStyleChange={(style: any) =>
                updateSectionContent(index, {
                  homeMiraStoriesEyebrowStyle: style,
                })
              }
            />

            <DynamicStyledField
              type="textarea"
              rows={2}
              label="Title"
              value={section.title ?? content.title ?? ""}
              onChange={(value: string) =>
                updateSectionContent(index, { title: value })
              }
              enableStyle
              style={section.homeMiraStoriesTitleStyle ?? content.homeMiraStoriesTitleStyle}
              onStyleChange={(style: any) =>
                updateSectionContent(index, {
                  homeMiraStoriesTitleStyle: style,
                })
              }
            />

            <DynamicStyledField
              type="textarea"
              label="Description"
              value={section.description ?? content.description ?? ""}
              onChange={(value: string) =>
                updateSectionContent(index, { description: value })
              }
              enableStyle
              style={section.homeMiraStoriesDescriptionStyle ?? content.homeMiraStoriesDescriptionStyle}
              onStyleChange={(style: any) =>
                updateSectionContent(index, {
                  homeMiraStoriesDescriptionStyle: style,
                })
              }
            />
          </div>
        </div>

        <div className="rounded-lg border border-border/70 bg-card p-3.5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              Story Items List ({items.length})
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addItem}
              className="h-7 text-xs gap-1.5 cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" /> Add Story Item
            </Button>
          </div>

          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-6 border border-dashed border-border/60 rounded-md text-center">
              <p className="text-xs text-muted-foreground mb-2">
                No story items added yet.
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addItem}
                className="h-7 text-xs gap-1.5 cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" /> Add First Item
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-2.5">
              {items.map((item: any, itemIndex: number) => {
                const isItemOpen = openItems[itemIndex] ?? false

                return (
                  <div
                    key={itemIndex}
                    className="overflow-hidden rounded-md border border-border/40 bg-card/40"
                  >
                    <div
                      onClick={() => toggleItem(itemIndex)}
                      className="flex cursor-pointer items-center justify-between bg-muted/30 px-3 py-2.5 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-2 text-xs">
                        {isItemOpen ? (
                          <ChevronUp className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        )}
                        <span className="font-semibold text-foreground">
                          Story #{String(itemIndex + 1).padStart(2, "0")}:
                        </span>
                        <span className="text-muted-foreground truncate max-w-[180px] md:max-w-[260px]">
                          {getSafeString(item.title, "Untitled Story Item")}
                        </span>
                      </div>

                      <div
                        className="flex items-center gap-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          disabled={itemIndex === 0}
                          onClick={() => moveItem(itemIndex, "up")}
                          className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground disabled:opacity-30 cursor-pointer"
                          title="Move Up"
                        >
                          <ArrowUp className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          disabled={itemIndex === items.length - 1}
                          onClick={() => moveItem(itemIndex, "down")}
                          className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground disabled:opacity-30 cursor-pointer"
                          title="Move Down"
                        >
                          <ArrowDown className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(itemIndex)}
                          className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive cursor-pointer"
                          title="Remove item"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>

                    {isItemOpen && (
                      <div className="flex flex-col gap-3 p-3 border-t border-border/30">
                        {stories.length > 0 && (
                          <div className="flex flex-col gap-1.5">
                            <label className="text-[11px] font-medium text-muted-foreground">
                              Select from Published Stories
                            </label>
                            <select
                              className="h-8 w-full rounded-md border border-input bg-background px-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                              defaultValue=""
                              onChange={(e) => selectStoryForIndex(itemIndex, e.target.value)}
                            >
                              <option value="" disabled>
                                -- Pick a story to autofill --
                              </option>
                              {stories.map((story: any) => (
                                <option key={story.id} value={story.id}>
                                  {story.title} ({story.slug})
                                </option>
                              ))}
                            </select>
                          </div>
                        )}

                        <DynamicStyledField
                          type="text"
                          label="Item Title"
                          value={item.title}
                          onChange={(val: any) => updateItem(itemIndex, { title: val })}
                          enableStyle
                        />

                        <DynamicStyledField
                          type="textarea"
                          label="Subtitle / Summary"
                          value={item.subtitle}
                          onChange={(val: any) => updateItem(itemIndex, { subtitle: val })}
                          enableStyle
                        />

                        <div className="pt-1">
                          <ButtonsField
                            label="Item Action Button"
                            value={
                              item.button
                                ? [item.button]
                                : item.url
                                ? [
                                    {
                                      label: "Read Story",
                                      url: item.url,
                                      variant: "PRIMARY",
                                      style: "primary",
                                      rounded: "full",
                                      backgroundColor: "#182D09",
                                      backgroundOpacity: 100,
                                      textColor: "#ffffff",
                                      textOpacity: 100,
                                      hoverBackgroundColor: "#f3f4f6",
                                      hoverTextColor: "#000000",
                                      target: "_self",
                                      showIcon: true,
                                    },
                                  ]
                                : []
                            }
                            onChange={(btns: any[]) => {
                              const updatedBtn = btns[0] || null
                              updateItem(itemIndex, {
                                button: updatedBtn,
                                url: updatedBtn?.url || "",
                              })
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <UniversalMultimediaForm
          title="Background Media & Style"
          fieldName="mira_stories.backgroundMultimedia"
          defaultShow="color"
          showColorPicker
          colorLabel="Background color"
          defaultColor="#FCFBF9"
          imageFieldName="cmsHomeMiraStoriesBackgroundImage"
          videoFieldName="cmsHomeMiraStoriesBackgroundVideo"
          value={
            (section as any).backgroundMultimedia ||
            content.backgroundMultimedia ||
            emptyMiraStories.backgroundMultimedia
          }
          onChange={(multimedia) => updateSection(index, { backgroundMultimedia: multimedia })}
        />

        <UniversalMultimediaForm
          title="Left Section Media & Style"
          fieldName="mira_stories.leftSideMultimedia"
          defaultShow="image"
          showColorPicker
          colorLabel="Left section color"
          defaultColor="#E5E7EB"
          imageTitle="Side Image"
          imageLabel="Side image"
          imageFieldName="cmsHomeMiraStoriesLeftSectionImage"
          videoFieldName="cmsHomeMiraStoriesLeftSectionVideo"
          value={
            (section as any).leftSideMultimedia ||
            content.leftSideMultimedia ||
            emptyMiraStories.leftSideMultimedia
          }
          onChange={(multimedia) => updateSection(index, { leftSideMultimedia: multimedia })}
        />

        <div className="rounded-lg border border-border/70 bg-card p-3.5">
          <p className="mb-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            Call to Action (CTA) Buttons
          </p>

          <ButtonsField
            value={section.buttons ?? []}
            onChange={(buttons: any[]) => updateSectionButtons(index, buttons)}
          />
        </div>
      </div>
    </FormSection>
  )
}
