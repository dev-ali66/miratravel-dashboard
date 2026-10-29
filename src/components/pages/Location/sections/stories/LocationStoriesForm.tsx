import { THEME_COLORS } from "@/config/theme"
import { useState } from "react"
import { Plus, Trash2, ChevronDown, ChevronUp, ArrowUp, ArrowDown, BookOpen, Layers } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DynamicStyledField } from "@/components/pages/CMS/shared/FormControls"
import { UniversalMultimediaForm } from "@/components/pages/CMS/shared/UniversalMultimediaForm"
import { ButtonsField } from "@/components/pages/CMS/shared/ButtonsField"
import { FormSection } from "../../shared/fields"
import type { LocationFormSectionProps } from "../../config/locationSections"
import { emptyLocation } from "../../shared/emptyLocation"
import { getSafeStringValue } from "../../shared/normalizeHelpers"
import { useGetStories } from "@/hooks/story/useGetStories"
import { StorySearchPicker } from "@/components/pages/CMS/shared/StorySearchPicker"

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
    emptyLocation.stories ||
    {}

  const isOpen = Boolean(openSections["stories"])

  const rawItems = storiesData.items
  const items: any[] = Array.isArray(rawItems) ? rawItems : []

  const [openItems, setOpenItems] = useState<Record<number, boolean>>({ 0: true })

  // Fetch live published stories to allow 1-click autofill
  const { data: storiesResponse } = useGetStories()
  const stories = storiesResponse?.data ?? []

  const updateStoriesField = (fieldKey: string, value: any) => {
    updateField(`stories.${fieldKey}`, value)
  }

  const updateItems = (newItems: any[]) => {
    updateStoriesField("items", newItems)
  }

  const toggleItemCollapse = (index: number) => {
    setOpenItems((prev) => ({
      ...prev,
      [index]: !prev[index],
    }))
  }

  const addItem = () => {
    const newItem = {
      title: {
        value: "",
        textColor: THEME_COLORS.primary,
        textOpacity: 1,
        backgroundColor: null,
        backgroundOpacity: 1,
      },
      subtitle: {
        value: "",
        textColor: THEME_COLORS.sub,
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
        backgroundColor: THEME_COLORS.primary,
        backgroundOpacity: 100,
        textColor: THEME_COLORS.white,
        textOpacity: 100,
        hoverBackgroundColor: THEME_COLORS.lightText,
        hoverTextColor: THEME_COLORS.overlayBlack,
        target: "_self",
        showIcon: true,
      },
      url: "",
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
    const targetIndex = direction === "up" ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= items.length) return
    const updated = [...items]
    const [moved] = updated.splice(index, 1)
    updated.splice(targetIndex, 0, moved)
    updateItems(updated)
    setOpenItems((prev) => ({
      ...prev,
      [index]: false,
      [targetIndex]: true,
    }))
  }

  const updateItem = (index: number, patch: Record<string, any>) => {
    const updated = [...items]
    updated[index] = {
      ...updated[index],
      ...patch,
    }
    updateItems(updated)
  }

  // 1-Click Story Autofill from Published Stories
  const selectStoryForIndex = (index: number, storyId: string) => {
    if (!storyId) return
    const selectedStory = stories.find((s: any) => s.id === storyId)
    if (!selectedStory) return

    const currentItem = items[index] || {}
    const newTitleText = selectedStory.title
    const newSubtitleText =
      (selectedStory as any).excerpt ||
      (selectedStory as any).metaDescription ||
      (selectedStory as any).description ||
      ""
    const storyUrl = `/stories/${selectedStory.slug || selectedStory.id}`

    const storyImage =
      (selectedStory as any).hero?.backgroundMultimedia?.image?.url ||
      (selectedStory as any).hero?.image?.url ||
      (selectedStory as any).coverImage ||
      ""

    const existingMedia = currentItem.media || {}
    const updatedMedia =
      storyImage && !existingMedia?.image?.url
        ? {
            ...existingMedia,
            show: existingMedia.show ?? true,
            color: existingMedia.color ?? "#000000",
            image: {
              url: storyImage,
              alt: selectedStory.title || "",
              opacity: existingMedia.image?.opacity ?? 100,
              overlayColor: existingMedia.image?.overlayColor ?? "#000000",
              overlayOpacity: existingMedia.image?.overlayOpacity ?? 0,
              width: existingMedia.image?.width ?? 0,
              height: existingMedia.image?.height ?? 0,
              aspectRatio: existingMedia.image?.aspectRatio ?? "auto",
              fit: existingMedia.image?.fit ?? "cover",
            },
            video: {
              url: existingMedia.video?.url ?? "",
              alt: existingMedia.video?.alt ?? "",
              opacity: existingMedia.video?.opacity ?? 100,
              overlayColor: existingMedia.video?.overlayColor ?? "#000000",
              overlayOpacity: existingMedia.video?.overlayOpacity ?? 0,
              width: existingMedia.video?.width ?? 0,
              height: existingMedia.video?.height ?? 0,
              aspectRatio: existingMedia.video?.aspectRatio ?? "auto",
              fit: existingMedia.video?.fit ?? "cover",
              autoplay: existingMedia.video?.autoplay ?? true,
              loop: existingMedia.video?.loop ?? true,
              muted: existingMedia.video?.muted ?? true,
            },
          }
        : existingMedia

    updateItem(index, {
      title:
        typeof currentItem.title === "object" && currentItem.title !== null
          ? { ...currentItem.title, value: newTitleText }
          : {
            value: newTitleText,
            textColor: THEME_COLORS.primary,
            textOpacity: 1,
            backgroundColor: null,
            backgroundOpacity: 1,
          },
      subtitle:
        typeof currentItem.subtitle === "object" && currentItem.subtitle !== null
          ? { ...currentItem.subtitle, value: newSubtitleText }
          : {
            value: newSubtitleText,
            textColor: THEME_COLORS.sub,
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
          backgroundColor: THEME_COLORS.primary,
          backgroundOpacity: 100,
          textColor: THEME_COLORS.white,
          textOpacity: 100,
          hoverBackgroundColor: THEME_COLORS.lightText,
          hoverTextColor: THEME_COLORS.overlayBlack,
          target: "_self",
          showIcon: true,
        }),
        url: storyUrl,
      },
      url: storyUrl,
      ...(storyImage && !existingMedia?.image?.url ? { media: updatedMedia } : {}),
    })
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
        <div className="rounded-md border border-border/70 bg-card/60 p-4 space-y-4">
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
            enableStyle
            style={storiesData.eyebrow}
            onStyleChange={(st) =>
              updateStoriesField("eyebrow", {
                ...(typeof storiesData.eyebrow === "object" ? storiesData.eyebrow : { value: storiesData.eyebrow || "" }),
                ...st,
              })
            }
          />

          {/* Main Title Heading */}
          <DynamicStyledField
            type="text"
            label="Main Section Title"
            fieldName="stories.title"
            placeholder="e.g. Location Stories"
            value={storiesData.title}
            onChange={(val) => updateStoriesField("title", val)}
            enableStyle
            style={storiesData.title}
            onStyleChange={(st) =>
              updateStoriesField("title", {
                ...(typeof storiesData.title === "object" ? storiesData.title : { value: storiesData.title || "" }),
                ...st,
              })
            }
          />

          {/* Description Paragraph */}
          <DynamicStyledField
            type="textarea"
            label="Section Description"
            fieldName="stories.description"
            placeholder="e.g. A collection of personal, cultural and inspiring stories..."
            value={storiesData.description}
            onChange={(val) => updateStoriesField("description", val)}
            enableStyle
            style={storiesData.description}
            onStyleChange={(st) =>
              updateStoriesField("description", {
                ...(typeof storiesData.description === "object" ? storiesData.description : { value: storiesData.description || "" }),
                ...st,
              })
            }
          />
        </div>

        {/* Story List Items */}
        <div className="flex flex-col gap-3 rounded-md border border-border/70 bg-card/60 p-4">
          <div className="flex items-center justify-between pb-1">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <Layers className="h-4 w-4 text-primary" />
              Stories List ({items.length})
            </h4>

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
              {items.map((item: any, index: number) => {
                const isItemOpen = openItems[index] ?? false
                const titleVal = getSafeStringValue(item.title, "Untitled Story Item")

                return (
                  <div
                    key={index}
                    className="overflow-hidden rounded-md border border-border/60 bg-background transition-all hover:border-border"
                  >
                    {/* Item Accordion Header */}
                    <div
                      onClick={() => toggleItemCollapse(index)}
                      className="flex cursor-pointer items-center justify-between bg-muted/30 px-3 py-2.5 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-2 text-xs min-w-0">
                        {isItemOpen ? (
                          <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
                        )}
                        <span className="font-semibold text-foreground shrink-0">
                          Story #{String(index + 1).padStart(2, "0")}:
                        </span>
                        <span className="text-muted-foreground truncate max-w-[180px] md:max-w-[260px]">
                          {titleVal}
                        </span>
                      </div>

                      <div
                        className="flex items-center gap-1 shrink-0 ml-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          disabled={index === 0}
                          onClick={() => moveItem(index, "up")}
                          className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground disabled:opacity-30 cursor-pointer"
                          title="Move Up"
                        >
                          <ArrowUp className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          disabled={index === items.length - 1}
                          onClick={() => moveItem(index, "down")}
                          className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground disabled:opacity-30 cursor-pointer"
                          title="Move Down"
                        >
                          <ArrowDown className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(index)}
                          className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive cursor-pointer"
                          title="Remove item"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>

                    {/* Item Content Body */}
                    {isItemOpen && (
                      <div className="flex flex-col gap-3 p-3.5 border-t border-border/40 space-y-3">
                        {/* Searchable Story Picker */}
                        <StorySearchPicker
                          stories={stories}
                          selectedTitle={titleVal}
                          onSelectStory={(story) => selectStoryForIndex(index, story.id)}
                        />

                        {/* Story Title */}
                        <DynamicStyledField
                          type="text"
                          label="Story Title"
                          fieldName={`stories.items[${index}].title`}
                          value={titleVal || ""}
                          onChange={(val: string) =>
                            updateItem(index, {
                              title: {
                                ...(typeof item.title === "object" ? item.title : {}),
                                value: val,
                              },
                            })
                          }
                          enableStyle
                          style={typeof item.title === "object" ? item.title : { textColor: THEME_COLORS.primary }}
                          onStyleChange={(st: any) =>
                            updateItem(index, {
                              title: {
                                ...(typeof item.title === "object" ? item.title : {}),
                                ...st,
                              },
                            })
                          }
                        />

                        {/* Story Subtitle */}
                        <DynamicStyledField
                          type="textarea"
                          label="Subtitle / Summary"
                          fieldName={`stories.items[${index}].subtitle`}
                          value={getSafeStringValue(item.subtitle)}
                          onChange={(val: string) =>
                            updateItem(index, {
                              subtitle: {
                                ...(typeof item.subtitle === "object" ? item.subtitle : {}),
                                value: val,
                              },
                            })
                          }
                          enableStyle
                          style={typeof item.subtitle === "object" ? item.subtitle : { textColor: THEME_COLORS.sub }}
                          onStyleChange={(st: any) =>
                            updateItem(index, {
                              subtitle: {
                                ...(typeof item.subtitle === "object" ? item.subtitle : {}),
                                ...st,
                              },
                            })
                          }
                        />

                        {/* Story Item Action Button */}
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
                                      backgroundColor: THEME_COLORS.primary,
                                      backgroundOpacity: 100,
                                      textColor: THEME_COLORS.white,
                                      textOpacity: 100,
                                      hoverBackgroundColor: THEME_COLORS.lightText,
                                      hoverTextColor: THEME_COLORS.overlayBlack,
                                      target: "_self",
                                      showIcon: true,
                                    },
                                  ]
                                  : []
                            }
                            onChange={(btns: any[]) => {
                              const updatedBtn = btns[0] || null
                              updateItem(index, {
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

        {/* Section Background Multimedia (Matching Home CMS Mira Stories) */}
        <UniversalMultimediaForm
          title="Background Media & Style"
          fieldName="stories.backgroundMultimedia"
          defaultShow="color"
          showColorPicker
          colorLabel="Background color"
          defaultColor={THEME_COLORS.bgWarm}
          imageFieldName="locationStoriesBackgroundImage"
          videoFieldName="locationStoriesBackgroundVideo"
          value={storiesData.backgroundMultimedia || emptyLocation.stories?.backgroundMultimedia}
          onChange={(multimedia) => updateStoriesField("backgroundMultimedia", multimedia)}
        />

        {/* Featured Left Side Media (Matching Home CMS Mira Stories) */}
        <UniversalMultimediaForm
          title="Left Section Media & Style"
          fieldName="stories.leftSideMultimedia"
          defaultShow="image"
          showColorPicker
          colorLabel="Left section color"
          defaultColor={THEME_COLORS.mediaPlaceholder}
          imageTitle="Side Image"
          imageLabel="Side image"
          imageFieldName="locationStoriesLeftSectionImage"
          videoFieldName="locationStoriesLeftSectionVideo"
          value={storiesData.leftSideMultimedia || emptyLocation.stories?.leftSideMultimedia}
          onChange={(multimedia) => updateStoriesField("leftSideMultimedia", multimedia)}
        />

        {/* Reusable Section Action Buttons (CTA Buttons) */}
        <div className="rounded-md border border-border/70 bg-card/60 p-4">
          <p className="mb-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            Call to Action (CTA) Buttons
          </p>
          <ButtonsField
            fieldName="stories.buttons"
            value={storiesData.buttons}
            onChange={(newButtons) => updateStoriesField("buttons", newButtons)}
          />
        </div>
      </div>
    </FormSection>
  )
}

export default LocationStoriesForm
