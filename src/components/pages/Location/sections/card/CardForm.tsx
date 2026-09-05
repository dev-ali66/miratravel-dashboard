/* =====================================================
   CARD — FORM SECTION
   Auto-migrated from the legacy LocationForm.tsx monolith.
===================================================== */

import { DynamicStyledField, FormSection } from "../../shared/fields"
import { UniversalMultimediaForm } from "../../../CMS/shared/UniversalMultimediaForm"
import { ButtonsField } from "../../../CMS/shared/ButtonsField"
import type { LocationData } from "../../locationTypes"

export type CardFormProps = {
  draft: LocationData
  updateField: (path: string, value: unknown) => void
  openSections: Record<string, boolean>
  toggleSection: (section: string) => void
}

export function CardForm({
  draft,
  updateField,
  openSections,
  toggleSection,
}: CardFormProps) {
  return (
    <FormSection
      title="Card"
      active={!!openSections["card"]}
      onClick={() => toggleSection("card")}
    >
      <div className="space-y-4">
        <DynamicStyledField
          type="text"
          label="Title"
          value={draft.data.card.title ?? ""}
          onChange={(value: string) => updateField("data.card.title", value)}
          enableStyle
          style={(draft.data.card as any).titleStyle}
          onStyleChange={(style) => updateField("data.card.titleStyle", style)}
        />

        <DynamicStyledField
          type="textarea"
          label="Subtitle"
          value={draft.data.card.subtitle ?? ""}
          onChange={(value: string) => updateField("data.card.subtitle", value)}
          enableStyle
          style={(draft.data.card as any).subtitleStyle}
          onStyleChange={(style) =>
            updateField("data.card.subtitleStyle", style)
          }
        />

        <UniversalMultimediaForm
          section={draft.data.card as any}
          content={draft.data.card as Record<string, any>}
          updateSection={(patch) =>
            updateField("data.card", { ...draft.data.card, ...patch })
          }
          updateSectionContent={(patch) =>
            updateField("data.card", { ...draft.data.card, ...patch })
          }
          contentMediaKey="backgroundMultimedia"
          backgroundType={draft.data.card.backgroundMultimedia?.type}
          sectionTitle="Card Background"
          showColorPicker
          colorLabel="Card background color"
          defaultColor="#FFFFFF"
          imageTitle="Card Background Image"
          imageLabel="Card background image"
          imageFieldName="locationCardBackgroundImage"
          videoTitle="Card Background Video"
          videoLabel="Card background video"
          videoFieldName="locationCardBackgroundVideo"
          showImageAltField
          showVideoAltField
          showVideoSwitches
        />

        <ButtonsField
          value={[draft.data.card.button]}
          onChange={(buttons) => {
            const button = buttons[0] ?? { label: "", url: "" }
            updateField("data.card.button", {
              ...draft.data.card.button,
              ...button,
            })
          }}
        />
      </div>
    </FormSection>
  )
}
