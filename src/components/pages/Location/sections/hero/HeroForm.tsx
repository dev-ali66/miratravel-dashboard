/* =====================================================
   HERO — FORM SECTION
   Auto-migrated from the legacy LocationForm.tsx monolith.
===================================================== */

import { DynamicStyledField, FormSection } from "../../shared/fields"
import { UniversalMultimediaForm } from "../../../CMS/shared/UniversalMultimediaForm"
import { ButtonsField } from "../../../CMS/shared/ButtonsField"
import type { LocationData } from "../../locationTypes"

export type HeroFormProps = {
  draft: LocationData
  updateField: (path: string, value: unknown) => void
  openSections: Record<string, boolean>
  toggleSection: (section: string) => void
}

export function HeroForm({
  draft,
  updateField,
  openSections,
  toggleSection,
}: HeroFormProps) {
  return (
    <FormSection
      title="Hero"
      active={!!openSections["hero"]}
      onClick={() => toggleSection("hero")}
    >
      <div className="space-y-4">
        <DynamicStyledField
          type="text"
          label="Hero Title"
          value={draft.data.hero.title ?? ""}
          onChange={(value: string) => updateField("data.hero.title", value)}
          enableStyle
          style={(draft.data.hero as any).titleStyle}
          onStyleChange={(style) => updateField("data.hero.titleStyle", style)}
        />

        <DynamicStyledField
          type="text"
          label="Breadcrumb"
          value={draft.data.hero.breadcrumb ?? ""}
          onChange={(value: string) =>
            updateField("data.hero.breadcrumb", value)
          }
          enableStyle
          style={(draft.data.hero as any).breadcrumbStyle}
          onStyleChange={(style) =>
            updateField("data.hero.breadcrumbStyle", style)
          }
        />

        <DynamicStyledField
          type="textarea"
          label="Description"
          value={draft.data.hero.description ?? ""}
          onChange={(value: string) =>
            updateField("data.hero.description", value)
          }
          enableStyle
          style={(draft.data.hero as any).descriptionStyle}
          onStyleChange={(style) =>
            updateField("data.hero.descriptionStyle", style)
          }
        />

        <UniversalMultimediaForm
          section={draft.data.hero as any}
          content={draft.data.hero as Record<string, any>}
          updateSection={(patch) =>
            updateField("data.hero", { ...draft.data.hero, ...patch })
          }
          updateSectionContent={(patch) =>
            updateField("data.hero", { ...draft.data.hero, ...patch })
          }
          contentMediaKey="backgroundMultimedia"
          backgroundType={draft.data.hero.backgroundMultimedia?.type}
          backgroundTypeStyleKey="locationHeroBackgroundTypeStyle"
          sectionTitle="Hero Media"
          showColorPicker
          colorLabel="Hero background color"
          defaultColor="#0F2A2E"
          imageTitle="Hero Background Image"
          imageLabel="Hero background image"
          imageFieldName="locationHeroBackgroundImage"
          imageAltStyleKey="locationHeroBackgroundImageAltStyle"
          videoFieldName="locationHeroBackgroundVideo"
          videoTitle="Hero Background Video"
          videoLabel="Hero background video"
          videoHint="Upload a video for the location hero background."
          videoAltStyleKey="locationHeroBackgroundVideoAltStyle"
          showImageAltField
          showVideoAltField
          showVideoSwitches
        />

        <div className="rounded-md border border-border/50 p-3">
          <p className="mb-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            Buttons
          </p>

          <ButtonsField
            value={
              Array.isArray((draft.data.hero as any).buttons)
                ? (draft.data.hero as any).buttons
                : draft.data.hero.button?.name
                  ? [
                      {
                        label: draft.data.hero.button.name,
                        url: draft.data.hero.button.url,
                        style: "primary",
                      },
                    ]
                  : []
            }
            onChange={(buttons) => {
              const primaryButton = buttons[0] ?? { label: "", url: "" }
              updateField("data.hero", {
                ...draft.data.hero,
                buttons,
                button: {
                  name: primaryButton.label ?? "",
                  url: primaryButton.url ?? "",
                },
              })
            }}
          />
        </div>
      </div>
    </FormSection>
  )
}
