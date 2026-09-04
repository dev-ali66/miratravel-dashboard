import type { HomeSection } from "../../homeTypes"
import { DynamicStyledField } from "../../../shared/FormControls"
import { ButtonsField } from "../../../shared/ButtonsField"
import { UniversalMultimediaForm } from "./UniversalMultimediaForm"

export type CustomJourneyCtaFormProps = {
  section: HomeSection
  index: number
  updateSection: (index: number, patch: Partial<HomeSection>) => void
  updateSectionContent: (index: number, patch: Record<string, any>) => void
  updateSectionImages: (index: number, images: any[]) => void
  updateSectionButtons: (index: number, buttons: any[]) => void
}

export function CustomJourneyCtaForm({
  section,
  index,
  updateSection,
  updateSectionContent,
  updateSectionButtons,
}: CustomJourneyCtaFormProps) {
  const content = (section.content ?? {}) as any

  return (
    <div className="flex flex-col gap-5">
      <div className="rounded-md border border-border/50 p-3">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">CTA Content</p>
        <div className="flex flex-col gap-3">
          <DynamicStyledField type="text"
            label="Title line 1"
            value={content.titleLine1 ?? ""}
            onChange={(value) => updateSectionContent(index, { titleLine1: value })}
            enableStyle
            style={content.homeCustomJourneyCtaTitleLine1Style}
            onStyleChange={(style) =>
              updateSectionContent(index, { homeCustomJourneyCtaTitleLine1Style: style })
            }
          />

          <DynamicStyledField type="text"
            label="Title highlight"
            value={content.titleHighlight ?? ""}
            onChange={(value) => updateSectionContent(index, { titleHighlight: value })}
            enableStyle
            style={content.homeCustomJourneyCtaTitleHighlightStyle}
            onStyleChange={(style) =>
              updateSectionContent(index, { homeCustomJourneyCtaTitleHighlightStyle: style })
            }
          />

          <DynamicStyledField type="textarea"
            label="Description"
            value={content.description ?? ""}
            onChange={(value) => updateSectionContent(index, { description: value })}
            enableStyle
            style={content.homeCustomJourneyCtaDescriptionStyle}
            onStyleChange={(style) =>
              updateSectionContent(index, { homeCustomJourneyCtaDescriptionStyle: style })
            }
          />
        </div>
      </div>

      <UniversalMultimediaForm
        section={section}
        content={content}
        updateSection={(patch) => updateSection(index, patch)}
        updateSectionContent={(patch) => updateSectionContent(index, patch)}
        contentMediaKey="backgroundMultimedia"
        sectionTitle="Background"
        showColorPicker
        colorLabel="Background color"
        defaultColor="#1F3A1B"
        imageTitle="Background Image"
        imageLabel="Background image"
        imageFieldName="cmsHomeCustomJourneyCtaBackgroundImage"
        imageAltStyleKey="homeCustomJourneyCtaBackgroundImageAltStyle"
      />

      <div className="rounded-md border border-border/50 p-3">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Button</p>
        <ButtonsField
          value={section.buttons ?? []}
          onChange={(buttons) => updateSectionButtons(index, buttons)}
        />
      </div>
    </div>
  )
}
