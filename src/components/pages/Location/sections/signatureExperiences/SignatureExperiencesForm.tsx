/* =====================================================
   SIGNATURE EXPERIENCES — FORM SECTION
   Allows editing Section Header (Label, Title, Description),
   Background Media/Color, and Numbered List of Signature
   Experiences (01, 02, 03...) matching the country details
   frontend page.
===================================================== */

import { DynamicStyledField, FormSection } from "../../shared/fields"
import { UniversalMultimediaForm } from "../../../CMS/shared/UniversalMultimediaForm"
import { ButtonsField } from "../../../CMS/shared/ButtonsField"
import { Plus, Trash2 } from "lucide-react"
import type { LocationData, SignatureExperienceItem } from "../../locationTypes"
import { updateArrayItem } from "../../shared/arrayItemHelpers"

export type SignatureExperiencesFormProps = {
  draft: LocationData
  updateField: (path: string, value: unknown) => void
  openSections: Record<string, boolean>
  toggleSection: (section: string) => void
}

export function SignatureExperiencesForm({
  draft,
  updateField,
  openSections,
  toggleSection,
}: SignatureExperiencesFormProps) {
  const section =
    draft.data.signature_experiences ?? draft.data.signatureExperiences ?? {
      label: "Signature Experiences",
      title: "Signature Experiences",
      description: "",
      experiences: [],
    }

  const items: SignatureExperienceItem[] = Array.isArray(section.experiences)
    ? section.experiences
    : []

  const updateItem = (
    index: number,
    field: keyof SignatureExperienceItem,
    value: unknown
  ) => {
    updateArrayItem(items, index, field, value, (next) =>
      updateField("data.signature_experiences.experiences", next)
    )
  }

  return (
    <FormSection
      title="Signature Experiences"
      active={!!openSections["signature-experiences"]}
      onClick={() => toggleSection("signature-experiences")}
    >
      <div className="space-y-5">
        {/* Label */}
        <DynamicStyledField
          type="text"
          label="Section Label / Eyebrow"
          value={section.label ?? ""}
          onChange={(value: string) =>
            updateField("data.signature_experiences.label", value)
          }
          enableStyle
          style={(section as any).labelStyle}
          onStyleChange={(style) =>
            updateField("data.signature_experiences.labelStyle", style)
          }
        />

        {/* Title */}
        <DynamicStyledField
          type="text"
          label="Title"
          value={section.title ?? ""}
          onChange={(value: string) =>
            updateField("data.signature_experiences.title", value)
          }
          enableStyle
          style={(section as any).titleStyle}
          onStyleChange={(style) =>
            updateField("data.signature_experiences.titleStyle", style)
          }
        />

        {/* Description */}
        <DynamicStyledField
          type="textarea"
          label="Description"
          value={section.description ?? ""}
          onChange={(value: string) =>
            updateField("data.signature_experiences.description", value)
          }
          enableStyle
          style={(section as any).descriptionStyle}
          onStyleChange={(style) =>
            updateField("data.signature_experiences.descriptionStyle", style)
          }
        />

        {/* Background Multimedia */}
        <UniversalMultimediaForm
          section={section as any}
          content={section as Record<string, any>}
          updateSection={(patch) =>
            updateField("data.signature_experiences", {
              ...section,
              ...patch,
            })
          }
          updateSectionContent={(patch) =>
            updateField("data.signature_experiences", {
              ...section,
              ...patch,
            })
          }
          contentMediaKey="backgroundMultimedia"
          backgroundType={(section as any)?.backgroundMultimedia?.type}
          backgroundTypeStyleKey="locationSignatureExpBackgroundTypeStyle"
          sectionTitle="Background"
          showColorPicker
          colorLabel="Background color"
          defaultColor="#FCFBF9"
          imageTitle="Background Image"
          imageLabel="Background image"
          imageFieldName="locationSignatureExpBackgroundImage"
          videoTitle="Background Video"
          videoLabel="Background video"
          videoFieldName="locationSignatureExpBackgroundVideo"
          showImageAltField
          showVideoSwitches
        />

        {/* Numbered Experiences Items */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold">
              Numbered Experiences ({items.length})
            </h4>

            <button
              type="button"
              onClick={() => {
                const nextNum = String(items.length + 1).padStart(2, "0")
                const newItems: SignatureExperienceItem[] = [
                  ...items,
                  {
                    id: `exp-${Date.now()}`,
                    number: nextNum,
                    title: "",
                    description: "",
                    href: "#",
                    linkText: "Explore this experience",
                  },
                ]
                updateField("data.signature_experiences.experiences", newItems)
              }}
              className="flex items-center gap-1 text-xs font-medium text-primary hover:opacity-80 transition"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Experience
            </button>
          </div>

          {items.map((item, index) => (
            <div
              key={item.id || index}
              className="rounded-xl border border-border/60 bg-muted/20 p-4 space-y-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-primary">
                  Item #{item.number || index + 1}
                </span>

                <button
                  type="button"
                  onClick={() => {
                    const next = items.filter((_, i) => i !== index)
                    updateField("data.signature_experiences.experiences", next)
                  }}
                  className="text-destructive hover:opacity-80 transition"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              {/* Number */}
              <DynamicStyledField
                type="text"
                label="Number (e.g. 01, 02)"
                value={item.number ?? ""}
                onChange={(value: string) =>
                  updateItem(index, "number", value)
                }
                enableStyle
                style={(item as any).numberStyle}
                onStyleChange={(style) =>
                  updateItem(index, "numberStyle" as any, style)
                }
              />

              {/* Title */}
              <DynamicStyledField
                type="text"
                label="Title"
                value={item.title ?? ""}
                onChange={(value: string) => updateItem(index, "title", value)}
                enableStyle
                style={(item as any).titleStyle}
                onStyleChange={(style) =>
                  updateItem(index, "titleStyle" as any, style)
                }
              />

              {/* Description */}
              <DynamicStyledField
                type="textarea"
                label="Description"
                value={item.description ?? ""}
                onChange={(value: string) =>
                  updateItem(index, "description", value)
                }
                enableStyle
                style={(item as any).descriptionStyle}
                onStyleChange={(style) =>
                  updateItem(index, "descriptionStyle" as any, style)
                }
              />

              {/* Link / URL */}
              <DynamicStyledField
                type="text"
                label="Link URL (href)"
                value={item.href ?? "#"}
                onChange={(value: string) => updateItem(index, "href", value)}
              />

              <DynamicStyledField
                type="text"
                label="Link Text"
                value={item.linkText ?? "Explore this experience"}
                onChange={(value: string) =>
                  updateItem(index, "linkText", value)
                }
              />

              {/* Optional Button Config */}
              <div className="rounded-md border border-border/50 p-3 bg-background">
                <p className="mb-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                  Action Button (Optional Override)
                </p>
                <ButtonsField
                  label="Button"
                  value={
                    Array.isArray((item as any).buttons)
                      ? (item as any).buttons
                      : (item as any).button?.label
                        ? [
                            {
                              label:
                                (item as any).button.label ||
                                item.linkText ||
                                "Explore this experience",
                              url:
                                (item as any).button.url || item.href || "#",
                              style:
                                (item as any).button.style || "primary",
                              backgroundColor:
                                (item as any).button.backgroundColor ||
                                "transparent",
                              textColor:
                                (item as any).button.textColor || "#C8956C",
                            },
                          ]
                        : []
                  }
                  onChange={(buttons) => {
                    const primaryButton = buttons[0] ?? null
                    const next = items.map((it, i) =>
                      i === index
                        ? {
                            ...it,
                            buttons,
                            button: primaryButton,
                            href: primaryButton?.url || it.href,
                            linkText: primaryButton?.label || it.linkText,
                          }
                        : it
                    )
                    updateField("data.signature_experiences.experiences", next)
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </FormSection>
  )
}
