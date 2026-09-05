/* =====================================================
   EXPERIENCES — FORM SECTION
   Phase 2 migration: ImageField → UniversalMultimediaForm
   for featured_experience.image and cards[i].image.
   All layout wrappers, field order, and existing data paths
   (data.experiences.*) are preserved exactly.
===================================================== */

import { DynamicStyledField, FormSection } from "../../shared/fields"
import { UniversalMultimediaForm } from "../../../CMS/shared/UniversalMultimediaForm"
import { ButtonsField } from "../../../CMS/shared/ButtonsField"
import { Plus, Trash2 } from "lucide-react"
import type { LocationData, ExperienceCard } from "../../locationTypes"
import { updateArrayItem } from "../../shared/arrayItemHelpers"

export type ExperiencesFormProps = {
  draft: LocationData
  updateField: (path: string, value: unknown) => void
  openSections: Record<string, boolean>
  toggleSection: (section: string) => void
}

export function ExperiencesForm({
  draft,
  updateField,
  openSections,
  toggleSection,
}: ExperiencesFormProps) {
  const updateExperience = (
    index: number,
    field: keyof ExperienceCard,
    value: string | number
  ) =>
    updateArrayItem(draft.data.experiences.cards, index, field, value, (next) =>
      updateField("data.experiences.cards", next)
    )

  const featured = draft.data.experiences.featured_experience

  return (
    <FormSection
      title="Experiences"
      active={!!openSections["experiences"]}
      onClick={() => toggleSection("experiences")}
    >
      <div className="space-y-5">
        <DynamicStyledField
          type="text"
          label="Title"
          value={draft.data.experiences.title ?? ""}
          onChange={(value: string) =>
            updateField("data.experiences.title", value)
          }
          enableStyle
          style={(draft.data.experiences as any).titleStyle}
          onStyleChange={(style) =>
            updateField("data.experiences.titleStyle", style)
          }
        />

        <DynamicStyledField
          type="text"
          label="Location"
          value={draft.data.experiences.location ?? ""}
          onChange={(value: string) =>
            updateField("data.experiences.location", value)
          }
          enableStyle
          style={(draft.data.experiences as any).locationStyle}
          onStyleChange={(style) =>
            updateField("data.experiences.locationStyle", style)
          }
        />

        <DynamicStyledField
          type="textarea"
          label="Description"
          value={draft.data.experiences.description ?? ""}
          onChange={(value: string) =>
            updateField("data.experiences.description", value)
          }
          enableStyle
          style={(draft.data.experiences as any).descriptionStyle}
          onStyleChange={(style) =>
            updateField("data.experiences.descriptionStyle", style)
          }
        />

        <DynamicStyledField
          type="textarea"
          label="Season Info"
          value={draft.data.experiences.seasonInfo ?? ""}
          onChange={(value: string) =>
            updateField("data.experiences.seasonInfo", value)
          }
          enableStyle
          style={(draft.data.experiences as any).seasonInfoStyle}
          onStyleChange={(style) =>
            updateField("data.experiences.seasonInfoStyle", style)
          }
        />

        <DynamicStyledField
          type="text"
          label="Season Location"
          value={draft.data.experiences.seasonLocation ?? ""}
          onChange={(value: string) =>
            updateField("data.experiences.seasonLocation", value)
          }
          enableStyle
          style={(draft.data.experiences as any).seasonLocationStyle}
          onStyleChange={(style) =>
            updateField("data.experiences.seasonLocationStyle", style)
          }
        />

        <div className="rounded-md border border-border/50 p-3">
          <p className="mb-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            Load More Button
          </p>

          <ButtonsField
            label="Buttons"
            value={
              Array.isArray((draft.data.experiences as any).buttons)
                ? (draft.data.experiences as any).buttons
                : (draft.data.experiences as any).loadMoreButton?.label ||
                    draft.data.experiences.load_more_button
                  ? [
                      {
                        label:
                          (draft.data.experiences as any).loadMoreButton
                            ?.label ||
                          draft.data.experiences.load_more_button ||
                          "Load More",
                        url:
                          (draft.data.experiences as any).loadMoreButton?.url ||
                          "#",
                        style:
                          (draft.data.experiences as any).loadMoreButton
                            ?.style || "primary",
                        backgroundColor:
                          (draft.data.experiences as any).loadMoreButton
                            ?.backgroundColor || "#8C4730",
                        textColor:
                          (draft.data.experiences as any).loadMoreButton
                            ?.textColor || "#FFFFFF",
                      },
                    ]
                  : []
            }
            onChange={(buttons) => {
              const primaryButton = buttons[0] ?? { label: "", url: "" }
              updateField("data.experiences", {
                ...draft.data.experiences,
                buttons,
                load_more_button: primaryButton.label ?? "",
                loadMoreButton: primaryButton,
              })
            }}
          />
        </div>

        <UniversalMultimediaForm
          section={draft.data.experiences as any}
          content={draft.data.experiences as Record<string, any>}
          updateSection={(patch) =>
            updateField("data.experiences", {
              ...draft.data.experiences,
              ...patch,
            })
          }
          updateSectionContent={(patch) =>
            updateField("data.experiences", {
              ...draft.data.experiences,
              ...patch,
            })
          }
          contentMediaKey="backgroundMultimedia"
          backgroundType={
            (draft.data.experiences as any)?.backgroundMultimedia?.type
          }
          backgroundTypeStyleKey="locationExperiencesBackgroundTypeStyle"
          sectionTitle="Background"
          showColorPicker
          colorLabel="Background color"
          defaultColor="#F1EEE5"
          imageTitle="Background Image"
          imageLabel="Background image"
          imageFieldName="locationExperiencesBackgroundImage"
          videoTitle="Background Video"
          videoLabel="Background video"
          videoFieldName="locationExperiencesBackgroundVideo"
          showImageAltField
          showVideoSwitches
        />

        <div className="rounded-xl border border-border/60 p-4">
          <h4 className="mb-4 text-sm font-semibold">Featured Experience</h4>

          <div className="space-y-4">
            <UniversalMultimediaForm
              section={featured as any}
              content={featured as Record<string, any>}
              updateSection={(patch) =>
                updateField("data.experiences.featured_experience", {
                  ...featured,
                  ...patch,
                })
              }
              updateSectionContent={(patch) =>
                updateField("data.experiences.featured_experience", {
                  ...featured,
                  ...patch,
                })
              }
              contentMediaKey="imageMultimedia"
              backgroundType={featured.imageMultimedia?.type}
              sectionTitle="Featured Experience Image"
              imageTitle="Featured Experience Image"
              imageLabel="Featured experience image"
              imageFieldName="locationExperienceFeaturedImage"
              showImageAltField
            />

            <DynamicStyledField
              type="text"
              label="Title"
              value={featured.title ?? ""}
              onChange={(value: string) =>
                updateField("data.experiences.featured_experience.title", value)
              }
            />

            <DynamicStyledField
              type="text"
              label="Category"
              value={featured.category ?? ""}
              onChange={(value: string) =>
                updateField(
                  "data.experiences.featured_experience.category",
                  value
                )
              }
            />

            <DynamicStyledField
              type="text"
              label="Duration"
              value={featured.duration ?? ""}
              onChange={(value: string) =>
                updateField(
                  "data.experiences.featured_experience.duration",
                  value
                )
              }
            />

            <DynamicStyledField
              type="textarea"
              label="Subtitle"
              value={featured.subtitle ?? ""}
              onChange={(value: string) =>
                updateField(
                  "data.experiences.featured_experience.subtitle",
                  value
                )
              }
            />

            <div className="rounded-md border border-border/50 p-3">
              <p className="mb-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                Featured Experience Button
              </p>

              <ButtonsField
                label="Buttons"
                value={
                  Array.isArray((featured as any).buttons)
                    ? (featured as any).buttons
                    : (featured as any).button?.label || featured.action_text
                      ? [
                          {
                            label:
                              (featured as any).button?.label ||
                              featured.action_text ||
                              "Meer info",
                            url: (featured as any).button?.url || "#",
                            style: (featured as any).button?.style || "primary",
                            backgroundColor:
                              (featured as any).button?.backgroundColor ||
                              "#1A4A40",
                            textColor:
                              (featured as any).button?.textColor || "#FFFFFF",
                          },
                        ]
                      : []
                }
                onChange={(buttons) => {
                  const primaryButton = buttons[0] ?? { label: "", url: "" }
                  updateField("data.experiences.featured_experience", {
                    ...featured,
                    buttons,
                    action_text: primaryButton.label ?? "",
                    button: primaryButton,
                  })
                }}
              />
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold">Experience Cards</h4>

            <button
              type="button"
              onClick={() => {
                const cards = [
                  ...draft.data.experiences.cards,
                  {
                    id: Date.now(),
                    image: "",
                    price: "",
                    title: "",
                    category: "",
                    subtitle: "",
                    action_text: "More info",
                    description: "",
                  },
                ]

                updateField("data.experiences.cards", cards)
              }}
              className="flex items-center gap-1 text-xs font-medium text-primary"
            >
              <Plus className="h-3.5 w-3.5" />
              Add
            </button>
          </div>

          {draft.data.experiences.cards.map((card, index) => (
            <div
              key={card.id}
              className="rounded-xl border border-border/60 p-4"
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-semibold">Card {index + 1}</span>

                <button
                  type="button"
                  onClick={() => {
                    updateField(
                      "data.experiences.cards",
                      draft.data.experiences.cards.filter((_, i) => i !== index)
                    )
                  }}
                  className="text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-4">
                <UniversalMultimediaForm
                  section={card as any}
                  content={card as Record<string, any>}
                  updateSection={(patch) =>
                    updateField(
                      "data.experiences.cards",
                      draft.data.experiences.cards.map((c, i) =>
                        i === index ? { ...c, ...patch } : c
                      )
                    )
                  }
                  updateSectionContent={(patch) =>
                    updateField(
                      "data.experiences.cards",
                      draft.data.experiences.cards.map((c, i) =>
                        i === index ? { ...c, ...patch } : c
                      )
                    )
                  }
                  contentMediaKey="imageMultimedia"
                  backgroundType={card.imageMultimedia?.type}
                  sectionTitle="Card Image"
                  imageTitle="Card Image"
                  imageLabel="Experience card image"
                  imageFieldName={`locationExperienceCard${index + 1}Image`}
                  showImageAltField
                />

                <DynamicStyledField
                  type="text"
                  label="Title"
                  value={card.title ?? ""}
                  onChange={(value: string) =>
                    updateExperience(index, "title", value)
                  }
                />

                <DynamicStyledField
                  type="text"
                  label="Category"
                  value={card.category ?? ""}
                  onChange={(value: string) =>
                    updateExperience(index, "category", value)
                  }
                />

                <DynamicStyledField
                  type="textarea"
                  label="Subtitle"
                  value={card.subtitle ?? ""}
                  onChange={(value: string) =>
                    updateExperience(index, "subtitle", value)
                  }
                />

                <DynamicStyledField
                  type="textarea"
                  label="Description"
                  value={card.description ?? ""}
                  onChange={(value: string) =>
                    updateExperience(index, "description", value)
                  }
                />

                <DynamicStyledField
                  type="text"
                  label="Price"
                  value={card.price ?? ""}
                  onChange={(value: string) =>
                    updateExperience(index, "price", value)
                  }
                />

                <div className="rounded-md border border-border/50 p-3">
                  <p className="mb-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                    Card Button
                  </p>

                  <ButtonsField
                    label="Buttons"
                    value={
                      Array.isArray((card as any).buttons)
                        ? (card as any).buttons
                        : (card as any).button?.label || card.action_text
                          ? [
                              {
                                label:
                                  (card as any).button?.label ||
                                  card.action_text ||
                                  "MORE INFO",
                                url: (card as any).button?.url || "#",
                                style: (card as any).button?.style || "primary",
                                backgroundColor:
                                  (card as any).button?.backgroundColor ||
                                  "transparent",
                                textColor:
                                  (card as any).button?.textColor || "#C8956C",
                              },
                            ]
                          : []
                    }
                    onChange={(buttons) => {
                      const primaryButton = buttons[0] ?? { label: "", url: "" }
                      updateField(
                        "data.experiences.cards",
                        draft.data.experiences.cards.map((c, i) =>
                          i === index
                            ? {
                                ...c,
                                buttons,
                                action_text: primaryButton.label ?? "",
                                button: primaryButton,
                              }
                            : c
                        )
                      )
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <DynamicStyledField
          type="textarea"
          label="Footer Note"
          value={draft.data.experiences.footer?.note ?? ""}
          onChange={(value: string) =>
            updateField("data.experiences.footer.note", value)
          }
          enableStyle
          style={
            (draft.data.experiences.footer as any)?.noteStyle ??
            (draft.data.experiences as any).seasonInfoStyle
          }
          onStyleChange={(style) => {
            updateField("data.experiences.footer.noteStyle", style)
            updateField("data.experiences.seasonInfoStyle", style)
          }}
        />

        <DynamicStyledField
          type="text"
          label="Footer Region"
          value={draft.data.experiences.footer?.region ?? ""}
          onChange={(value: string) =>
            updateField("data.experiences.footer.region", value)
          }
          enableStyle
          style={
            (draft.data.experiences.footer as any)?.regionStyle ??
            (draft.data.experiences as any).seasonLocationStyle
          }
          onStyleChange={(style) => {
            updateField("data.experiences.footer.regionStyle", style)
            updateField("data.experiences.seasonLocationStyle", style)
          }}
        />
      </div>
    </FormSection>
  )
}
