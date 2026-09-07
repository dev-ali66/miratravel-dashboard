import { useState } from "react"
import type { HomeSection } from "../../homeTypes"
import { DynamicStyledField } from "../../../shared/FormControls"
import { ButtonsField } from "../../../shared/ButtonsField"
import { UniversalMultimediaForm } from "../../../shared/UniversalMultimediaForm"
import { Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useGetStories } from "@/hooks/story/useGetStories"

export type TravelInsightsFormProps = {
  section: HomeSection
  index: number
  updateSection: (index: number, patch: Partial<HomeSection>) => void
  updateSectionContent: (index: number, patch: Record<string, any>) => void
  updateSectionImages: (index: number, images: any[]) => void
  updateSectionButtons: (index: number, buttons: any[]) => void
}

export function TravelInsightsForm({
  section,
  index,
  updateSection,
  updateSectionContent,
  updateSectionButtons,
}: TravelInsightsFormProps) {
  const content = (section.content ?? {}) as any
  const items = (section.items ?? []) as any[]

  const { data: storiesData } = useGetStories()
  const availableStories = storiesData?.data ?? []

  const [openItems, setOpenItems] = useState<Record<number, boolean>>({
    0: true,
  })

  const toggleItem = (itemIndex: number) => {
    setOpenItems((prev) => ({
      ...prev,
      [itemIndex]: !prev[itemIndex],
    }))
  }

  const addItem = () => {
    const newIdx = items.length
    const updated = [
      ...items,
      {
        tag: "STORY",
        title: "",
        description: "",
        url: "/stories",
        image: "",
      },
    ]
    updateSection(index, { items: updated })
    setOpenItems((prev) => ({ ...prev, [newIdx]: true }))
  }

  const removeItem = (itemIndex: number) => {
    const updated = items.filter((_, i) => i !== itemIndex)
    updateSection(index, { items: updated })
  }

  const handleSelectStory = (itemIndex: number, storyId: string) => {
    const selectedStory = availableStories.find((s) => s.id === storyId)
    if (!selectedStory) return
    const updated = [...items]
    updated[itemIndex] = {
      ...updated[itemIndex],
      tag: selectedStory.category?.toUpperCase() || "STORY",
      title: selectedStory.title,
      description: selectedStory.description || "",
      url: `/stories/${selectedStory.slug}`,
      image: selectedStory.image || updated[itemIndex].image || "",
    }
    updateSection(index, { items: updated })
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="rounded-md border border-border/50 p-3">
        <p className="mb-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          Header Content
        </p>
        <div className="flex flex-col gap-3">
          <DynamicStyledField
            type="text"
            label="Eyebrow"
            value={content.eyebrow ?? ""}
            onChange={(value) =>
              updateSectionContent(index, { eyebrow: value })
            }
            enableStyle
            style={content.homeTravelInsightsEyebrowStyle}
            onStyleChange={(style) =>
              updateSectionContent(index, {
                homeTravelInsightsEyebrowStyle: style,
              })
            }
          />

          <DynamicStyledField
            type="text"
            label="Title"
            value={content.title ?? ""}
            onChange={(value) => updateSectionContent(index, { title: value })}
            enableStyle
            style={content.homeTravelInsightsTitleStyle}
            onStyleChange={(style) =>
              updateSectionContent(index, {
                homeTravelInsightsTitleStyle: style,
              })
            }
          />

          <DynamicStyledField
            type="textarea"
            label="Description / Subtitle"
            value={content.description ?? ""}
            onChange={(value) =>
              updateSectionContent(index, { description: value })
            }
            enableStyle
            style={content.homeTravelInsightsDescriptionStyle}
            onStyleChange={(style) =>
              updateSectionContent(index, {
                homeTravelInsightsDescriptionStyle: style,
              })
            }
          />
        </div>
      </div>

      <div className="rounded-md border border-border/50 p-3">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            Insight Items ({items.length})
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addItem}
            className="h-7 gap-1 text-xs"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Insight Item
          </Button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-md border border-dashed border-border/60 py-6 text-center">
            <p className="mb-2 text-xs text-muted-foreground">
              No insight items added yet.
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addItem}
              className="gap-1 text-xs"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Insight Item
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            {items.map((item, itemIndex) => {
              const isOpen = openItems[itemIndex] ?? false
              const isFeatured = itemIndex === 0

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
                      {isOpen ? (
                        <ChevronUp className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      )}
                      <span className="font-semibold text-foreground">
                        {isFeatured ? "Featured Story (Top)" : `Story ${itemIndex + 1}`}:
                      </span>
                      <span className="text-muted-foreground truncate max-w-[200px] md:max-w-[300px]">
                        {item.title || "Untitled Insight Item"}
                      </span>
                      {item.tag && (
                        <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary uppercase">
                          {item.tag}
                        </span>
                      )}
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        removeItem(itemIndex)
                      }}
                      className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                      title="Remove item"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>

                  {isOpen && (
                    <div className="flex flex-col gap-3 p-3 border-t border-border/30">
                      {availableStories.length > 0 && (
                        <div className="flex flex-col gap-1">
                          <label className="text-[11px] font-medium text-muted-foreground">
                            Import from Published Stories (Optional):
                          </label>
                          <select
                            className="w-full rounded-md border border-input bg-background px-2.5 py-1.5 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                            onChange={(e) => {
                              if (e.target.value) {
                                handleSelectStory(itemIndex, e.target.value)
                              }
                            }}
                            defaultValue=""
                          >
                            <option value="" disabled>
                              -- Select a story to auto-fill --
                            </option>
                            {availableStories.map((s) => (
                              <option key={s.id} value={s.id}>
                                {s.title} ({s.category || "Story"})
                              </option>
                            ))}
                          </select>
                        </div>
                      )}

                      <DynamicStyledField
                        type="text"
                        label="Tag / Category (e.g. HERITAGE, STAYS)"
                        value={item.tag ?? ""}
                        onChange={(value) => {
                          const updated = [...items]
                          updated[itemIndex] = {
                            ...updated[itemIndex],
                            tag: value,
                          }
                          updateSection(index, { items: updated })
                        }}
                      />

                      <DynamicStyledField
                        type="text"
                        label="Title"
                        value={item.title ?? ""}
                        onChange={(value) => {
                          const updated = [...items]
                          updated[itemIndex] = {
                            ...updated[itemIndex],
                            title: value,
                          }
                          updateSection(index, { items: updated })
                        }}
                      />

                      <DynamicStyledField
                        type="textarea"
                        label="Description"
                        value={item.description ?? ""}
                        onChange={(value) => {
                          const updated = [...items]
                          updated[itemIndex] = {
                            ...updated[itemIndex],
                            description: value,
                          }
                          updateSection(index, { items: updated })
                        }}
                      />

                      <DynamicStyledField
                        type="text"
                        label="URL / Link Path"
                        value={item.url ?? ""}
                        onChange={(value) => {
                          const updated = [...items]
                          updated[itemIndex] = {
                            ...updated[itemIndex],
                            url: value,
                          }
                          updateSection(index, { items: updated })
                        }}
                      />

                      <DynamicStyledField
                        type="text"
                        label="Card Thumbnail Image URL"
                        value={typeof item.image === "string" ? item.image : item.image?.url ?? ""}
                        onChange={(value) => {
                          const updated = [...items]
                          updated[itemIndex] = {
                            ...updated[itemIndex],
                            image: value,
                          }
                          updateSection(index, { items: updated })
                        }}
                      />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      <UniversalMultimediaForm
        section={section}
        content={content}
        updateSection={(patch) => updateSection(index, patch)}
        updateSectionContent={(patch) => updateSectionContent(index, patch)}
        contentMediaKey="leftSideMultimedia"
        sectionTitle="Spotlight Left Image"
        showColorPicker={false}
        imageTitle="Spotlight Image"
        imageLabel="Spotlight image"
        imageFieldName="cmsHomeTravelInsightsLeftSectionImage"
        videoFieldName="cmsHomeTravelInsightsLeftSectionVideo"
      />

      <UniversalMultimediaForm
        section={section}
        content={content}
        updateSection={(patch) => updateSection(index, patch)}
        updateSectionContent={(patch) => updateSectionContent(index, patch)}
        contentMediaKey="backgroundMultimedia"
        sectionTitle="Background"
        showColorPicker
        colorLabel="Background color"
        defaultColor="#FBF9F5"
        imageTitle="Background Image"
        imageLabel="Background image"
        imageFieldName="cmsHomeTravelInsightsBackgroundImage"
        imageAltStyleKey="homeTravelInsightsBackgroundImageAltStyle"
      />

      <div className="rounded-md border border-border/50 p-3">
        <p className="mb-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          Button
        </p>
        <ButtonsField
          value={section.buttons ?? []}
          onChange={(buttons) => updateSectionButtons(index, buttons)}
        />
      </div>
    </div>
  )
}
