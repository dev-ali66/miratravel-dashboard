import { useState } from "react"
import {
  ChevronDown,
  ChevronUp,
} from "lucide-react"

import { useCmsPage } from "../shared/useCmsPage"
import { SaveBar } from "../shared/SaveBar"

import {
  ColorField,
  DynamicStyledField,
} from "../shared/FormControls"

import { ButtonsField } from "../shared/ButtonsField"

import type {
  HomeButton,
  HomeImage,
  HomePageData,
  HomeSection,
  HomeVideo,
} from "./homeTypes"

import type { FieldStyle, ValidationRules } from "../shared/FormControls"

interface TextFieldProps {
  label: string
  value: string | number | undefined
  onChange: (value: string | number) => void
  placeholder?: string
  hint?: string
  validation?: ValidationRules
  onValidChange?: (isValid: boolean) => void
  enableStyle?: boolean
  style?: FieldStyle
  onStyleChange?: (style: FieldStyle) => void
}

interface TextAreaFieldProps extends TextFieldProps { rows?: number; maxLength?: number }

interface MediaFieldProps {
  label: string
  value?: string
  fieldName?: string
  onChange: (value: string) => void
  opacity?: number
  onOpacityChange?: (value: number) => void
  overlayColor?: string
  onOverlayColorChange?: (value: string) => void
  overlayOpacity?: number
  onOverlayOpacityChange?: (value: number) => void
}

type ImageUploadFieldProps = MediaFieldProps
type VideoUploadFieldProps = MediaFieldProps

const TextField = (props: TextFieldProps) => <DynamicStyledField type="text" {...props} />
const TextAreaField = (props: TextAreaFieldProps) => <DynamicStyledField type="textarea" {...props} />
const ImageUploadField = (props: ImageUploadFieldProps) => <DynamicStyledField type="image" {...props} />
const VideoUploadField = (props: VideoUploadFieldProps) => <DynamicStyledField type="video" {...props} />

export const HomeForm = () => {
  const {
    page,
    setPage,
    isLoading,
    isSaving,
    save,
  } = useCmsPage<HomePageData>(
    "home",
    "Home"
  )

  const data = page?.data
  const theme = data?.theme ?? {}
  const sections = data?.sections ?? []

  /*
   * ============================================================
   * COLLAPSED SECTIONS
   * ============================================================
   */

  const [openSections, setOpenSections] =
    useState<Record<string, boolean>>({
      hero: true,
    })

  const toggleSection = (key: string) => {
    setOpenSections((current) => ({
      ...current,
      [key]: !current[key],
    }))
  }

  /*
   * ============================================================
   * HELPERS
   * ============================================================
   */

  const updateData = (
    patch: Partial<
      NonNullable<HomePageData["data"]>
    >
  ) => {
    setPage({
      ...page,
      name: page?.name ?? "Home",

      metadata: {
        ...(page?.metadata ?? {}),
      },

      data: {
        ...(page?.data ?? {}),
        ...patch,
      },
    })
  }

  const updateTheme = (
    patch: Partial<
      NonNullable<HomePageData["data"]>["theme"]
    >
  ) => {
    updateData({
      theme: {
        ...(data?.theme ?? {}),
        ...patch,
      },
    })
  }

  const updateSection = (
    index: number,
    patch: Partial<HomeSection>
  ) => {
    const currentSections =
      data?.sections ?? []

    const updatedSections =
      currentSections.map(
        (section, sectionIndex) =>
          sectionIndex === index
            ? {
              ...section,
              ...patch,
            }
            : section
      )

    updateData({
      sections: updatedSections,
    })
  }

  const updateSectionContent = (
    index: number,
    patch: Record<string, any>
  ) => {
    const section =
      sections[index]

    updateSection(index, {
      content: {
        ...(section?.content as Record<
          string,
          any
        >),
        ...patch,
      } as HomeSection["content"],
    })
  }

  const updateSectionButtons = (
    index: number,
    buttons: HomeButton[]
  ) => {
    updateSection(index, {
      buttons,
    })
  }

  const updateSectionImages = (
    index: number,
    images: HomeImage[]
  ) => {
    updateSection(index, {
      bgImages: images,
    })
  }

  const updateSectionVideos = (
    index: number,
    videos: HomeVideo[]
  ) => {
    updateSection(index, {
      bgVideos: videos,
    })
  }

  /*
   * ============================================================
   * LOADING
   * ============================================================
   */

  if (isLoading) {
    return (
      <div className="flex flex-col">
        <SaveBar
          title="Home"
          description="Manage homepage content, sections, theme and media."
          onSave={save}
          isSaving={isSaving}
          isLoading={isLoading}
        />

        <div className="flex items-center justify-center p-10">
          <p className="text-sm text-muted-foreground">
            Loading Home data...
          </p>
        </div>
      </div>
    )
  }

  /*
   * ============================================================
   * SECTION LABEL
   * ============================================================
   */

  const getSectionTitle = (
    section: HomeSection
  ) => {
    switch (section.key) {
      case "hero":
        return "Hero"

      case "explore_journeys":
        return "Explore Journeys"

      case "destinations":
        return "Destinations"

      case "mira_stories":
        return "Mira Stories"

      case "why_mira":
        return "Why Mira"

      case "travel_insights":
        return "Travel Insights"

      case "custom_journey_cta":
        return "Custom Journey CTA"

      default:
        return section.key
    }
  }

  /*
   * ============================================================
   * HERO
   * ============================================================
   */

  const renderHero = (
    section: HomeSection,
    index: number
  ) => {
    const content =
      (section.content ?? {}) as any

    const bgImage =
      section.bgImages?.[0] ?? {}

    const bgVideo =
      section.bgVideos?.[0] ?? {}

    const backgroundType =
      section.backgroundType ??
      (section.showVideo
        ? "video"
        : section.bgImages?.[0]?.url
          ? "image"
          : "color")

    const selectBackgroundType = (
      type: "image" | "video" | "color"
    ) => {
      updateSection(index, {
        backgroundType: type,
        showVideo: type === "video",
      })
    }

    return (
      <div className="flex flex-col gap-5">

        {/* HERO CONTENT */}

        <div className="rounded-md border border-border/50 p-3">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Hero Content
          </p>

          <div className="flex flex-col gap-3">

            <TextField
              label="Title line 1"
              value={
                content.titleLine1 ?? ""
              }
              onChange={(value) =>
                updateSectionContent(
                  index,
                  {
                    titleLine1: value,
                  }
                )
              }
              enableStyle
              style={content.titleLine1Style}
              onStyleChange={(style) =>
                updateSectionContent(index, { titleLine1Style: style })
              }
            />

            <TextField
              label="Title line 2"
              value={
                content.titleLine2 ?? ""
              }
              onChange={(value) =>
                updateSectionContent(
                  index,
                  {
                    titleLine2: value,
                  }
                )
              }
              enableStyle
              style={content.titleLine2Style}
              onStyleChange={(style) =>
                updateSectionContent(index, { titleLine2Style: style })
              }
            />

            <TextField
              label="Title highlight"
              value={
                content.titleHighlight ?? ""
              }
              onChange={(value) =>
                updateSectionContent(
                  index,
                  {
                    titleHighlight: value,
                  }
                )
              }
              enableStyle
              style={content.titleHighlightStyle}
              onStyleChange={(style) =>
                updateSectionContent(index, { titleHighlightStyle: style })
              }
            />

            <TextAreaField
              label="Description"
              value={
                content.description ?? ""
              }
              onChange={(value) =>
                updateSectionContent(
                  index,
                  {
                    description: value,
                  }
                )
              }
              enableStyle
              style={content.descriptionStyle}
              onStyleChange={(style) =>
                updateSectionContent(index, { descriptionStyle: style })
              }
            />
          </div>
        </div>

        {/* BACKGROUND */}

        <div className="rounded-md border border-border/50 p-3">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Background
          </p>

          <div className="flex flex-col gap-4">

            <div className="flex flex-col gap-3">
              <p className="text-[11px] font-semibold text-foreground">
                Background Type
              </p>

              {([
                ["image", "Show Background Image"],
                ["video", "Show Background Video"],
                ["color", "Show Background Color"],
              ] as const).map(([type, label]) => (
                <label key={type} className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name={`hero-background-${index}`}
                    checked={backgroundType === type}
                    onChange={() => selectBackgroundType(type)}
                  />
                  {label}
                </label>
              ))}
            </div>

            {backgroundType === "color" && (
              <ColorField
                label="Background color"
                value={section.bgColor ?? "#0F2A2E"}
                onChange={(value) => updateSection(index, { bgColor: value })}
              />
            )}

            {backgroundType === "image" && (
              <div className="rounded-md border border-border/40 p-3">
                <p className="mb-3 text-[11px] font-semibold text-foreground">
                  Background Image
                </p>

                <div className="flex flex-col gap-3">

                  <ImageUploadField
                    label="Background image"
                    value={
                      bgImage.url ?? ""
                    }
                    opacity={bgImage.opacity ?? 100}
                    onOpacityChange={(value) =>
                      updateSectionImages(index, [{ ...bgImage, opacity: value }])
                    }
                    overlayColor={bgImage.overlayColor ?? "#000000"}
                    onOverlayColorChange={(value) =>
                      updateSectionImages(index, [{ ...bgImage, overlayColor: value }])
                    }
                    overlayOpacity={bgImage.overlayOpacity ?? 0}
                    onOverlayOpacityChange={(value) =>
                      updateSectionImages(index, [{ ...bgImage, overlayOpacity: value }])
                    }
                    fieldName="homeHeroImage"
                    onChange={(value) => {
                      updateSectionImages(
                        index,
                        [
                          {
                            ...bgImage,
                            url: value,
                          },
                        ]
                      )
                    }}
                  />

                  <TextField
                    label="Image alt text"
                    value={
                      bgImage.alt ?? ""
                    }
                    onChange={(value) => {
                      updateSectionImages(
                        index,
                        [
                          {
                            ...bgImage,
                            alt: value,
                          },
                        ]
                      )
                    }}
                  />

                </div>
              </div>
            )}

            {backgroundType === "video" && (
              <div className="rounded-md border border-border/40 p-3">
                <p className="mb-1 text-[11px] font-semibold text-foreground">
                  Background Video
                </p>

                <p className="mb-3 text-[10px] text-muted-foreground">
                  Upload a video to use as the Hero background.
                </p>

                <div className="flex flex-col gap-4">

                  <VideoUploadField
                    label="Hero background video"
                    value={
                      bgVideo.url ?? ""
                    }
                    opacity={bgVideo.opacity ?? 100}
                    onOpacityChange={(value) =>
                      updateSectionVideos(index, [{ ...bgVideo, opacity: value }])
                    }
                    overlayColor={bgVideo.overlayColor ?? "#000000"}
                    onOverlayColorChange={(value) =>
                      updateSectionVideos(index, [{ ...bgVideo, overlayColor: value }])
                    }
                    overlayOpacity={bgVideo.overlayOpacity ?? 0}
                    onOverlayOpacityChange={(value) =>
                      updateSectionVideos(index, [{ ...bgVideo, overlayOpacity: value }])
                    }
                    fieldName="homeHeroVideo"
                    onChange={(value) => {
                      updateSectionVideos(
                        index,
                        [
                          {
                            ...bgVideo,
                            url: value,
                          },
                        ]
                      )
                    }}
                  />

                  <TextField
                    label="Video alt text"
                    value={bgVideo.alt ?? ""}
                    onChange={(value) =>
                      updateSectionVideos(index, [{ ...bgVideo, alt: value }])
                    }
                  />

                  <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-4">
                    <label className="flex items-center gap-2 text-sm">

                      <input
                        type="checkbox"
                        checked={bgVideo.loop ?? true}
                        onChange={(event) =>
                          updateSectionVideos(index, [{ ...bgVideo, loop: event.target.checked }])
                        }
                      />
                      Loop
                    </label>

                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={bgVideo.autoplay ?? true}
                        onChange={(event) =>
                          updateSectionVideos(index, [{ ...bgVideo, autoplay: event.target.checked }])
                        }
                      />
                      Autoplay
                    </label>

                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={bgVideo.muted ?? true}
                        onChange={(event) =>
                          updateSectionVideos(index, [{ ...bgVideo, muted: event.target.checked }])
                        }
                      />
                      Muted
                    </label>
                  </div>

                </div>
              </div>
            )}

          </div>
        </div>

        {/* BUTTONS */}

        <div className="rounded-md border border-border/50 p-3">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Buttons
          </p>

          <ButtonsField
            value={
              section.buttons ?? []
            }
            onChange={(buttons) =>
              updateSectionButtons(
                index,
                buttons
              )
            }
          />
        </div>

      </div>
    )
  }

  /*
   * ============================================================
   * EXPLORE JOURNEYS
   * ============================================================
   */

  const renderExploreJourneys = (
    section: HomeSection,
    index: number
  ) => {
    const content =
      (section.content ?? {}) as any

    const bgImage = section.bgImages?.[0] ?? {}
    const bgVideo = section.bgVideos?.[0] ?? {}
    const backgroundType =
      section.backgroundType ??
      (section.showVideo
        ? "video"
        : bgImage.url
          ? "image"
          : "color")

    const selectBackgroundType = (
      type: "image" | "video" | "color"
    ) => {
      updateSection(index, {
        backgroundType: type,
        showVideo: type === "video",
      })
    }

    return (
      <div className="flex flex-col gap-5">

        <div className="rounded-md border border-border/50 p-3">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Content
          </p>

          <div className="flex flex-col gap-3">

            <TextField
              label="Eyebrow"
              value={
                content.eyebrow ?? ""
              }
              onChange={(value) =>
                updateSectionContent(
                  index,
                  {
                    eyebrow: value,
                  }
                )
              }
            />

            <TextField
              label="Title"
              value={
                content.title ?? ""
              }
              onChange={(value) =>
                updateSectionContent(
                  index,
                  {
                    title: value,
                  }
                )
              }
            />

            <TextField
              label="Subtitle"
              value={
                content.subtitle ?? ""
              }
              onChange={(value) =>
                updateSectionContent(
                  index,
                  {
                    subtitle: value,
                  }
                )
              }
            />

            <TextAreaField
              label="Description"
              value={
                content.description ?? ""
              }
              onChange={(value) =>
                updateSectionContent(
                  index,
                  {
                    description: value,
                  }
                )
              }
            />

          </div>
        </div>

        <div className="rounded-md border border-border/50 p-3">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Background
          </p>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-3">
              <p className="text-[11px] font-semibold text-foreground">
                Background Type
              </p>

              {([
                ["image", "Show Background Image"],
                ["video", "Show Background Video"],
                ["color", "Show Background Color"],
              ] as const).map(([type, label]) => (
                <label key={type} className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name={`explore-journeys-background-${index}`}
                    checked={backgroundType === type}
                    onChange={() => selectBackgroundType(type)}
                  />
                  {label}
                </label>
              ))}
            </div>

            {backgroundType === "color" && (
              <ColorField
                label="Background color"
                value={section.bgColor ?? "#FBF9F5"}
                onChange={(value) => updateSection(index, { bgColor: value })}
              />
            )}

            {backgroundType === "image" && (
              <div className="rounded-md border border-border/40 p-3">
                <p className="mb-3 text-[11px] font-semibold text-foreground">
                  Background Image
                </p>

                <div className="flex flex-col gap-3">
                  <ImageUploadField
                    label="Background image"
                    value={bgImage.url ?? ""}
                    opacity={bgImage.opacity ?? 100}
                    onOpacityChange={(value) =>
                      updateSectionImages(index, [{ ...bgImage, opacity: value }])
                    }
                    overlayColor={bgImage.overlayColor ?? "#000000"}
                    onOverlayColorChange={(value) =>
                      updateSectionImages(index, [{ ...bgImage, overlayColor: value }])
                    }
                    overlayOpacity={bgImage.overlayOpacity ?? 0}
                    onOverlayOpacityChange={(value) =>
                      updateSectionImages(index, [{ ...bgImage, overlayOpacity: value }])
                    }
                    fieldName="homeExploreJourneysImage"
                    onChange={(value) =>
                      updateSectionImages(index, [{ ...bgImage, url: value }])
                    }
                  />

                  <TextField
                    label="Image alt text"
                    value={bgImage.alt ?? ""}
                    onChange={(value) =>
                      updateSectionImages(index, [{ ...bgImage, alt: value }])
                    }
                  />
                </div>
              </div>
            )}

            {backgroundType === "video" && (
              <div className="rounded-md border border-border/40 p-3">
                <p className="mb-1 text-[11px] font-semibold text-foreground">
                  Background Video
                </p>

                <p className="mb-3 text-[10px] text-muted-foreground">
                  Upload a video to use as the Explore Journeys background.
                </p>

                <div className="flex flex-col gap-4">
                  <VideoUploadField
                    label="Background video"
                    value={bgVideo.url ?? ""}
                    opacity={bgVideo.opacity ?? 100}
                    onOpacityChange={(value) =>
                      updateSectionVideos(index, [{ ...bgVideo, opacity: value }])
                    }
                    overlayColor={bgVideo.overlayColor ?? "#000000"}
                    onOverlayColorChange={(value) =>
                      updateSectionVideos(index, [{ ...bgVideo, overlayColor: value }])
                    }
                    overlayOpacity={bgVideo.overlayOpacity ?? 0}
                    onOverlayOpacityChange={(value) =>
                      updateSectionVideos(index, [{ ...bgVideo, overlayOpacity: value }])
                    }
                    fieldName="homeExploreJourneysVideo"
                    onChange={(value) =>
                      updateSectionVideos(index, [{ ...bgVideo, url: value }])
                    }
                  />

                  <TextField
                    label="Video alt text"
                    value={bgVideo.alt ?? ""}
                    onChange={(value) =>
                      updateSectionVideos(index, [{ ...bgVideo, alt: value }])
                    }
                  />

                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={bgVideo.loop ?? true}
                      onChange={(event) =>
                        updateSectionVideos(index, [{ ...bgVideo, loop: event.target.checked }])
                      }
                    />
                    Loop
                  </label>

                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={bgVideo.autoplay ?? true}
                      onChange={(event) =>
                        updateSectionVideos(index, [{ ...bgVideo, autoplay: event.target.checked }])
                      }
                    />
                    Autoplay
                  </label>

                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={bgVideo.muted ?? true}
                      onChange={(event) =>
                        updateSectionVideos(index, [{ ...bgVideo, muted: event.target.checked }])
                      }
                    />
                    Muted
                  </label>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="rounded-md border border-border/50 p-3">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Background
          </p>

          <ColorField
            label="Background color"
            value={
              section.bgColor ??
              "#FBF9F5"
            }
            onChange={(value) =>
              updateSection(index, {
                bgColor: value,
              })
            }
          />
        </div>

        <div className="rounded-md border border-border/50 p-3">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Button
          </p>

          <ButtonsField
            value={
              section.buttons ?? []
            }
            onChange={(buttons) =>
              updateSectionButtons(
                index,
                buttons
              )
            }
          />
        </div>

      </div>
    )
  }

  /*
   * ============================================================
   * DESTINATIONS
   * ============================================================
   */

  const renderDestinations = (
    section: HomeSection,
    index: number
  ) => {
    const content =
      (section.content ?? {}) as any

    return (
      <div className="flex flex-col gap-5">

        <div className="rounded-md border border-border/50 p-3">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Content
          </p>

          <div className="flex flex-col gap-3">

            <TextField
              label="Eyebrow"
              value={
                content.eyebrow ?? ""
              }
              onChange={(value) =>
                updateSectionContent(
                  index,
                  {
                    eyebrow: value,
                  }
                )
              }
            />

            <TextField
              label="Title"
              value={
                content.title ?? ""
              }
              onChange={(value) =>
                updateSectionContent(
                  index,
                  {
                    title: value,
                  }
                )
              }
            />

            <TextAreaField
              label="Subtitle"
              value={
                content.subtitle ?? ""
              }
              onChange={(value) =>
                updateSectionContent(
                  index,
                  {
                    subtitle: value,
                  }
                )
              }
            />

          </div>
        </div>

        <div className="rounded-md border border-border/50 p-3">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Background
          </p>

          <ColorField
            label="Background color"
            value={
              section.bgColor ??
              "#FBF9F5"
            }
            onChange={(value) =>
              updateSection(index, {
                bgColor: value,
              })
            }
          />
        </div>

        <div className="rounded-md border border-border/50 p-3">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Button
          </p>

          <ButtonsField
            value={
              section.buttons ?? []
            }
            onChange={(buttons) =>
              updateSectionButtons(
                index,
                buttons
              )
            }
          />
        </div>

      </div>
    )
  }

  /*
   * ============================================================
   * MIRA STORIES
   * ============================================================
   */

  const renderMiraStories = (
    section: HomeSection,
    index: number
  ) => {
    const content =
      (section.content ?? {}) as any

    const items =
      section.items ?? []

    const image =
      section.bgImages?.[0] ?? {}

    return (
      <div className="flex flex-col gap-5">

        <div className="rounded-md border border-border/50 p-3">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Content
          </p>

          <div className="flex flex-col gap-3">

            <TextField
              label="Eyebrow"
              value={
                content.eyebrow ?? ""
              }
              onChange={(value) =>
                updateSectionContent(
                  index,
                  {
                    eyebrow: value,
                  }
                )
              }
            />

            <TextField
              label="Title"
              value={
                content.title ?? ""
              }
              onChange={(value) =>
                updateSectionContent(
                  index,
                  {
                    title: value,
                  }
                )
              }
            />

            <TextAreaField
              label="Description"
              value={
                content.description ?? ""
              }
              onChange={(value) =>
                updateSectionContent(
                  index,
                  {
                    description: value,
                  }
                )
              }
            />

          </div>
        </div>

        <div className="rounded-md border border-border/50 p-3">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Story Items
          </p>

          <div className="flex flex-col gap-4">

            {items.map(
              (
                item,
                itemIndex
              ) => (
                <div
                  key={itemIndex}
                  className="rounded-md border border-border/40 p-3"
                >
                  <div className="mb-3 text-[11px] font-semibold">
                    Story {itemIndex + 1}
                  </div>

                  <div className="flex flex-col gap-3">

                    <TextField
                      label="Index"
                      value={
                        item.index ?? ""
                      }
                      onChange={(value) => {
                        const updated =
                          [...items]

                        updated[itemIndex] = {
                          ...updated[
                          itemIndex
                          ],
                          index: value,
                        }

                        updateSection(
                          index,
                          {
                            items: updated,
                          }
                        )
                      }}
                    />

                    <TextField
                      label="Title"
                      value={
                        item.title ?? ""
                      }
                      onChange={(value) => {
                        const updated =
                          [...items]

                        updated[itemIndex] = {
                          ...updated[
                          itemIndex
                          ],
                          title: value,
                        }

                        updateSection(
                          index,
                          {
                            items: updated,
                          }
                        )
                      }}
                    />

                    <TextField
                      label="Subtitle"
                      value={
                        item.subtitle ?? ""
                      }
                      onChange={(value) => {
                        const updated =
                          [...items]

                        updated[itemIndex] = {
                          ...updated[
                          itemIndex
                          ],
                          subtitle: value,
                        }

                        updateSection(
                          index,
                          {
                            items: updated,
                          }
                        )
                      }}
                    />

                    <TextField
                      label="URL"
                      value={
                        item.url ?? ""
                      }
                      onChange={(value) => {
                        const updated =
                          [...items]

                        updated[itemIndex] = {
                          ...updated[
                          itemIndex
                          ],
                          url: value,
                        }

                        updateSection(
                          index,
                          {
                            items: updated,
                          }
                        )
                      }}
                    />

                  </div>
                </div>
              )
            )}

          </div>
        </div>

        <div className="rounded-md border border-border/50 p-3">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Background Image
          </p>

          <ImageUploadField
            label="Background image"
            value={
              image.url ?? ""
            }
            opacity={image.opacity ?? 100}
            onOpacityChange={(value) =>
              updateSectionImages(index, [{ ...image, opacity: value }])
            }
            overlayColor={image.overlayColor ?? "#000000"}
            onOverlayColorChange={(value) =>
              updateSectionImages(index, [{ ...image, overlayColor: value }])
            }
            overlayOpacity={image.overlayOpacity ?? 0}
            onOverlayOpacityChange={(value) =>
              updateSectionImages(index, [{ ...image, overlayOpacity: value }])
            }
            fieldName="homeMiraStoriesImage"
            onChange={(value) =>
              updateSectionImages(
                index,
                [
                  {
                    ...image,
                    url: value,
                  },
                ]
              )
            }
          />

          <div className="mt-3">
            <TextField
              label="Image alt text"
              value={
                image.alt ?? ""
              }
              onChange={(value) =>
                updateSectionImages(
                  index,
                  [
                    {
                      ...image,
                      alt: value,
                    },
                  ]
                )
              }
            />
          </div>
        </div>

        <div className="rounded-md border border-border/50 p-3">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Background
          </p>

          <ColorField
            label="Background color"
            value={
              section.bgColor ??
              "#FBF9F5"
            }
            onChange={(value) =>
              updateSection(index, {
                bgColor: value,
              })
            }
          />
        </div>

        <div className="rounded-md border border-border/50 p-3">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Button
          </p>

          <ButtonsField
            value={
              section.buttons ?? []
            }
            onChange={(buttons) =>
              updateSectionButtons(
                index,
                buttons
              )
            }
          />
        </div>

      </div>
    )
  }

  /*
   * ============================================================
   * WHY MIRA
   * ============================================================
   */

  const renderWhyMira = (
    section: HomeSection,
    index: number
  ) => {
    const content =
      (section.content ?? {}) as any

    const paragraphs =
      content.paragraphs ?? []

    const sideImage =
      section.sideImages?.[0] ?? {}

    return (
      <div className="flex flex-col gap-5">

        <div className="rounded-md border border-border/50 p-3">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Content
          </p>

          <div className="flex flex-col gap-3">

            <TextField
              label="Eyebrow"
              value={
                content.eyebrow ?? ""
              }
              onChange={(value) =>
                updateSectionContent(
                  index,
                  {
                    eyebrow: value,
                  }
                )
              }
            />

            <TextField
              label="Title"
              value={
                content.title ?? ""
              }
              onChange={(value) =>
                updateSectionContent(
                  index,
                  {
                    title: value,
                  }
                )
              }
            />

            <TextField
              label="Signature"
              value={
                content.signature ?? ""
              }
              onChange={(value) =>
                updateSectionContent(
                  index,
                  {
                    signature: value,
                  }
                )
              }
            />

            {paragraphs.map(
              (
                paragraph: string,
                paragraphIndex: number
              ) => (
                <TextAreaField
                  key={paragraphIndex}
                  label={`Paragraph ${paragraphIndex + 1
                    }`}
                  value={
                    paragraph ?? ""
                  }
                  onChange={(value) => {
                    const updated =
                      [...paragraphs]

                    updated[
                      paragraphIndex
                    ] = value

                    updateSectionContent(
                      index,
                      {
                        paragraphs:
                          updated,
                      }
                    )
                  }}
                />
              )
            )}

          </div>
        </div>

        <div className="rounded-md border border-border/50 p-3">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Appearance
          </p>

          <ColorField
            label="Background color"
            value={
              section.bgColor ??
              "#1F3A1B"
            }
            onChange={(value) =>
              updateSection(index, {
                bgColor: value,
              })
            }
          />
        </div>

        <div className="rounded-md border border-border/50 p-3">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Side Image
          </p>

          <div className="flex flex-col gap-3">

            <ImageUploadField
              label="Side image"
              value={
                sideImage.url ?? ""
              }
              opacity={sideImage.opacity ?? 100}
              onOpacityChange={(value) =>
                updateSection(index, {
                  sideImages: [{ ...sideImage, opacity: value }],
                })
              }
              overlayColor={sideImage.overlayColor ?? "#000000"}
              onOverlayColorChange={(value) =>
                updateSection(index, {
                  sideImages: [{ ...sideImage, overlayColor: value }],
                })
              }
              overlayOpacity={sideImage.overlayOpacity ?? 0}
              onOverlayOpacityChange={(value) =>
                updateSection(index, {
                  sideImages: [{ ...sideImage, overlayOpacity: value }],
                })
              }
              fieldName="homeWhyMiraImage"
              onChange={(value) =>
                updateSection(
                  index,
                  {
                    sideImages: [
                      {
                        ...sideImage,
                        url: value,
                      },
                    ],
                  }
                )
              }
            />

            <TextField
              label="Image alt text"
              value={
                sideImage.alt ?? ""
              }
              onChange={(value) =>
                updateSection(
                  index,
                  {
                    sideImages: [
                      {
                        ...sideImage,
                        alt: value,
                      },
                    ],
                  }
                )
              }
            />

          </div>
        </div>

      </div>
    )
  }

  /*
   * ============================================================
   * TRAVEL INSIGHTS
   * ============================================================
   */

  const renderTravelInsights = (
    section: HomeSection,
    index: number
  ) => {
    const content =
      (section.content ?? {}) as any

    const image =
      section.bgImages?.[0] ?? {}

    return (
      <div className="flex flex-col gap-5">

        <div className="rounded-md border border-border/50 p-3">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Content
          </p>

          <div className="flex flex-col gap-3">

            <TextField
              label="Eyebrow"
              value={
                content.eyebrow ?? ""
              }
              onChange={(value) =>
                updateSectionContent(
                  index,
                  {
                    eyebrow: value,
                  }
                )
              }
            />

            <TextField
              label="Title"
              value={
                content.title ?? ""
              }
              onChange={(value) =>
                updateSectionContent(
                  index,
                  {
                    title: value,
                  }
                )
              }
            />

            <TextAreaField
              label="Description"
              value={
                content.description ?? ""
              }
              onChange={(value) =>
                updateSectionContent(
                  index,
                  {
                    description: value,
                  }
                )
              }
            />

          </div>
        </div>

        <div className="rounded-md border border-border/50 p-3">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Appearance
          </p>

          <ColorField
            label="Background color"
            value={
              section.bgColor ??
              "#FBF9F5"
            }
            onChange={(value) =>
              updateSection(index, {
                bgColor: value,
              })
            }
          />
        </div>

        <div className="rounded-md border border-border/50 p-3">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Background Image
          </p>

          <div className="flex flex-col gap-3">

            <ImageUploadField
              label="Background image"
              value={
                image.url ?? ""
              }
              opacity={image.opacity ?? 100}
              onOpacityChange={(value) =>
                updateSectionImages(index, [{ ...image, opacity: value }])
              }
              overlayColor={image.overlayColor ?? "#000000"}
              onOverlayColorChange={(value) =>
                updateSectionImages(index, [{ ...image, overlayColor: value }])
              }
              overlayOpacity={image.overlayOpacity ?? 0}
              onOverlayOpacityChange={(value) =>
                updateSectionImages(index, [{ ...image, overlayOpacity: value }])
              }
              fieldName="homeTravelInsightsImage"
              onChange={(value) =>
                updateSectionImages(
                  index,
                  [
                    {
                      ...image,
                      url: value,
                    },
                  ]
                )
              }
            />

            <TextField
              label="Image alt text"
              value={
                image.alt ?? ""
              }
              onChange={(value) =>
                updateSectionImages(
                  index,
                  [
                    {
                      ...image,
                      alt: value,
                    },
                  ]
                )
              }
            />

          </div>
        </div>

        <div className="rounded-md border border-border/50 p-3">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Button
          </p>

          <ButtonsField
            value={
              section.buttons ?? []
            }
            onChange={(buttons) =>
              updateSectionButtons(
                index,
                buttons
              )
            }
          />
        </div>

      </div>
    )
  }

  /*
   * ============================================================
   * CUSTOM JOURNEY CTA
   * ============================================================
   */

  const renderCustomJourneyCta = (
    section: HomeSection,
    index: number
  ) => {
    const content =
      (section.content ?? {}) as any

    const image =
      section.bgImages?.[0] ?? {}

    return (
      <div className="flex flex-col gap-5">

        <div className="rounded-md border border-border/50 p-3">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            CTA Content
          </p>

          <div className="flex flex-col gap-3">

            <TextField
              label="Title line 1"
              value={
                content.titleLine1 ?? ""
              }
              onChange={(value) =>
                updateSectionContent(
                  index,
                  {
                    titleLine1: value,
                  }
                )
              }
            />

            <TextField
              label="Title highlight"
              value={
                content.titleHighlight ?? ""
              }
              onChange={(value) =>
                updateSectionContent(
                  index,
                  {
                    titleHighlight: value,
                  }
                )
              }
            />

            <TextAreaField
              label="Description"
              value={
                content.description ?? ""
              }
              onChange={(value) =>
                updateSectionContent(
                  index,
                  {
                    description: value,
                  }
                )
              }
            />

          </div>
        </div>

        <div className="rounded-md border border-border/50 p-3">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Appearance
          </p>

          <ColorField
            label="Background color"
            value={
              section.bgColor ??
              "#1F3A1B"
            }
            onChange={(value) =>
              updateSection(index, {
                bgColor: value,
              })
            }
          />
        </div>

        <div className="rounded-md border border-border/50 p-3">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Background Image
          </p>

          <div className="flex flex-col gap-3">

            <ImageUploadField
              label="Background image"
              value={
                image.url ?? ""
              }
              opacity={image.opacity ?? 100}
              onOpacityChange={(value) =>
                updateSectionImages(index, [{ ...image, opacity: value }])
              }
              overlayColor={image.overlayColor ?? "#000000"}
              onOverlayColorChange={(value) =>
                updateSectionImages(index, [{ ...image, overlayColor: value }])
              }
              overlayOpacity={image.overlayOpacity ?? 0}
              onOverlayOpacityChange={(value) =>
                updateSectionImages(index, [{ ...image, overlayOpacity: value }])
              }
              fieldName="homeCustomJourneyImage"
              onChange={(value) =>
                updateSectionImages(
                  index,
                  [
                    {
                      ...image,
                      url: value,
                    },
                  ]
                )
              }
            />

            <TextField
              label="Image alt text"
              value={
                image.alt ?? ""
              }
              onChange={(value) =>
                updateSectionImages(
                  index,
                  [
                    {
                      ...image,
                      alt: value,
                    },
                  ]
                )
              }
            />

          </div>
        </div>

        <div className="rounded-md border border-border/50 p-3">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Button
          </p>

          <ButtonsField
            value={
              section.buttons ?? []
            }
            onChange={(buttons) =>
              updateSectionButtons(
                index,
                buttons
              )
            }
          />
        </div>

      </div>
    )
  }

  /*
   * ============================================================
   * SECTION RENDERER
   * ============================================================
   */

  const renderSectionContent = (
    section: HomeSection,
    index: number
  ) => {
    switch (section.key) {
      case "hero":
        return renderHero(
          section,
          index
        )

      case "explore_journeys":
        return renderExploreJourneys(
          section,
          index
        )

      case "destinations":
        return renderDestinations(
          section,
          index
        )

      case "mira_stories":
        return renderMiraStories(
          section,
          index
        )

      case "why_mira":
        return renderWhyMira(
          section,
          index
        )

      case "travel_insights":
        return renderTravelInsights(
          section,
          index
        )

      case "custom_journey_cta":
        return renderCustomJourneyCta(
          section,
          index
        )

      default:
        return (
          <div className="rounded-md border border-border/50 p-3">
            <p className="text-sm text-muted-foreground">
              No editor available for this section.
            </p>
          </div>
        )
    }
  }

  /*
   * ============================================================
   * RENDER
   * ============================================================
   */

  return (
    <div className="flex flex-col">

      {/* SAVE BAR */}

      <SaveBar
        title="Home"
        description="Manage homepage content, sections, theme and media."
        onSave={save}
        isSaving={isSaving}
        isLoading={isLoading}
      />

      <div className="flex flex-col gap-6 p-4">

        {openSections.__legacyTopPanels && (
          <>

            {/* SEO */}

            <div className="rounded-lg border border-border/60 p-3">

              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                SEO Metadata
              </p>

              <div className="flex flex-col gap-3">

                <TextField
                  label="Meta title"
                  value={
                    page?.metadata?.title ?? ""
                  }
                  onChange={(value) =>
                    setPage({
                      ...page,
                      name:
                        page?.name ?? "Home",

                      metadata: {
                        ...(page?.metadata ?? {}),
                        title: value,
                      },

                      data: {
                        ...(page?.data ?? {}),
                      },
                    })
                  }
                />

                <TextAreaField
                  label="Meta description"
                  value={
                    page?.metadata?.description ??
                    ""
                  }
                  onChange={(value) =>
                    setPage({
                      ...page,
                      name:
                        page?.name ?? "Home",

                      metadata: {
                        ...(page?.metadata ?? {}),
                        description: value,
                      },

                      data: {
                        ...(page?.data ?? {}),
                      },
                    })
                  }
                />

                <TextField
                  label="Keywords (comma separated)"
                  value={
                    page?.metadata?.keywords?.join(
                      ", "
                    ) ?? ""
                  }
                  onChange={(value) =>
                    setPage({
                      ...page,
                      name:
                        page?.name ?? "Home",

                      metadata: {
                        ...(page?.metadata ?? {}),

                        keywords: value
                          .split(",")
                          .map(
                            (item) =>
                              item.trim()
                          )
                          .filter(Boolean),
                      },

                      data: {
                        ...(page?.data ?? {}),
                      },
                    })
                  }
                />

                <TextField
                  label="Canonical URL"
                  value={
                    page?.metadata?.canonicalUrl ??
                    ""
                  }
                  onChange={(value) =>
                    setPage({
                      ...page,
                      name:
                        page?.name ?? "Home",

                      metadata: {
                        ...(page?.metadata ?? {}),
                        canonicalUrl: value,
                      },

                      data: {
                        ...(page?.data ?? {}),
                      },
                    })
                  }
                />

                <div className="flex flex-col gap-2">

                  <span className="text-sm font-medium">
                    Robots
                  </span>

                  <div className="flex items-center gap-5">

                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={
                          page?.metadata?.robots
                            ?.index ?? true
                        }
                        onChange={(event) =>
                          setPage({
                            ...page,
                            name:
                              page?.name ??
                              "Home",

                            metadata: {
                              ...(page?.metadata ??
                                {}),

                              robots: {
                                ...(page
                                  ?.metadata
                                  ?.robots ??
                                  {}),

                                index:
                                  event.target
                                    .checked,
                              },
                            },

                            data: {
                              ...(page?.data ??
                                {}),
                            },
                          })
                        }
                      />

                      Index
                    </label>

                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={
                          page?.metadata?.robots
                            ?.follow ?? true
                        }
                        onChange={(event) =>
                          setPage({
                            ...page,
                            name:
                              page?.name ??
                              "Home",

                            metadata: {
                              ...(page?.metadata ??
                                {}),

                              robots: {
                                ...(page
                                  ?.metadata
                                  ?.robots ??
                                  {}),

                                follow:
                                  event.target
                                    .checked,
                              },
                            },

                            data: {
                              ...(page?.data ??
                                {}),
                            },
                          })
                        }
                      />

                      Follow
                    </label>

                  </div>
                </div>

              </div>
            </div>

            {/* GLOBAL THEME */}

            <div className="rounded-lg border border-border/60 p-3">

              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Home Theme
              </p>

              <div className="flex flex-col gap-3">

                <ColorField
                  label="Accent color"
                  value={
                    theme.accentColor ??
                    "#C97B4A"
                  }
                  onChange={(value) =>
                    updateTheme({
                      accentColor: value,
                    })
                  }
                />

                <ColorField
                  label="Primary color"
                  value={
                    theme.primaryColor ??
                    "#1F3A1B"
                  }
                  onChange={(value) =>
                    updateTheme({
                      primaryColor: value,
                    })
                  }
                />

                <ColorField
                  label="Dark text color"
                  value={
                    theme.textColorDark ??
                    "#1A1A1A"
                  }
                  onChange={(value) =>
                    updateTheme({
                      textColorDark: value,
                    })
                  }
                />

                <ColorField
                  label="Light text color"
                  value={
                    theme.textColorLight ??
                    "#FFFFFF"
                  }
                  onChange={(value) =>
                    updateTheme({
                      textColorLight: value,
                    })
                  }
                />

              </div>
            </div>

          </>
        )}

        {/* HOME SECTIONS */}

        <div className="flex flex-col gap-3">

          <div className="px-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Home Sections
            </p>

            <p className="mt-1 text-[11px] text-muted-foreground">
              Click a section to expand or collapse its settings.
            </p>
          </div>

          {sections
            .slice()
            .sort(
              (a, b) =>
                (a.order ?? 0) -
                (b.order ?? 0)
            )
            .map(
              (
                section,
                index
              ) => {
                const isOpen =
                  openSections[
                  section.key
                  ] ?? false

                const actualIndex =
                  sections.findIndex(
                    (item) =>
                      item.key ===
                      section.key
                  )

                return (
                  <div
                    key={
                      `${section.key}-${index}`
                    }
                    className="overflow-hidden rounded-lg border border-border/60"
                  >

                    {/* HEADER */}

                    <button
                      type="button"
                      onClick={() =>
                        toggleSection(
                          section.key
                        )
                      }
                      className="
                        flex
                        w-full
                        items-center
                        justify-between
                        gap-3
                        px-4
                        py-3
                        text-left
                        transition-colors
                        hover:bg-muted/40
                      "
                    >

                      <div className="flex min-w-0 items-center gap-3">

                        <span
                          className="
                            flex
                            h-7
                            min-w-7
                            items-center
                            justify-center
                            rounded-md
                            bg-muted
                            px-2
                            text-[10px]
                            font-semibold
                            text-muted-foreground
                          "
                        >
                          {String(
                            section.order ??
                            index + 1
                          ).padStart(
                            2,
                            "0"
                          )}
                        </span>

                        <div className="min-w-0">

                          <p className="text-sm font-semibold">
                            {
                              getSectionTitle(
                                section
                              )
                            }
                          </p>

                          <p className="truncate text-[10px] text-muted-foreground">
                            {section.type}
                          </p>

                        </div>

                      </div>

                      {isOpen ? (
                        <ChevronUp className="h-4 w-4 shrink-0 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
                      )}

                    </button>

                    {/* CONTENT */}

                    {isOpen && (
                      <div className="border-t border-border/60 p-4">
                        {renderSectionContent(
                          section,
                          actualIndex
                        )}
                      </div>
                    )}

                  </div>
                )
              }
            )}

        </div>

        <div className="overflow-hidden rounded-lg border border-border/60">
          <button
            type="button"
            onClick={() => toggleSection("seo")}
            className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/40"
          >
            <span className="text-sm font-semibold">SEO Metadata</span>
            {openSections.seo ? (
              <ChevronUp className="h-4 w-4 shrink-0 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
            )}
          </button>

          {openSections.seo && (
            <div className="flex flex-col gap-3 border-t border-border/60 p-4">
              <TextField
                label="Meta title"
                value={page?.metadata?.title ?? ""}
                onChange={(value) =>
                  setPage({
                    ...page,
                    name: page?.name ?? "Home",
                    metadata: { ...(page?.metadata ?? {}), title: value },
                    data: { ...(page?.data ?? {}) },
                  })
                }
              />
              <TextAreaField
                label="Meta description"
                value={page?.metadata?.description ?? ""}
                onChange={(value) =>
                  setPage({
                    ...page,
                    name: page?.name ?? "Home",
                    metadata: { ...(page?.metadata ?? {}), description: value },
                    data: { ...(page?.data ?? {}) },
                  })
                }
              />
              <TextField
                label="Keywords (comma separated)"
                value={page?.metadata?.keywords?.join(", ") ?? ""}
                onChange={(value) =>
                  setPage({
                    ...page,
                    name: page?.name ?? "Home",
                    metadata: {
                      ...(page?.metadata ?? {}),
                      keywords: value.split(",").map((item) => item.trim()).filter(Boolean),
                    },
                    data: { ...(page?.data ?? {}) },
                  })
                }
              />
              <TextField
                label="Canonical URL"
                value={page?.metadata?.canonicalUrl ?? ""}
                onChange={(value) =>
                  setPage({
                    ...page,
                    name: page?.name ?? "Home",
                    metadata: { ...(page?.metadata ?? {}), canonicalUrl: value },
                    data: { ...(page?.data ?? {}) },
                  })
                }
              />
              <div className="flex flex-col gap-2">
                <span className="text-sm font-medium">Robots</span>
                <div className="flex items-center gap-5">
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={page?.metadata?.robots?.index ?? true}
                      onChange={(event) =>
                        setPage({
                          ...page,
                          name: page?.name ?? "Home",
                          metadata: {
                            ...(page?.metadata ?? {}),
                            robots: { ...(page?.metadata?.robots ?? {}), index: event.target.checked },
                          },
                          data: { ...(page?.data ?? {}) },
                        })
                      }
                    />
                    Index
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={page?.metadata?.robots?.follow ?? true}
                      onChange={(event) =>
                        setPage({
                          ...page,
                          name: page?.name ?? "Home",
                          metadata: {
                            ...(page?.metadata ?? {}),
                            robots: { ...(page?.metadata?.robots ?? {}), follow: event.target.checked },
                          },
                          data: { ...(page?.data ?? {}) },
                        })
                      }
                    />
                    Follow
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}