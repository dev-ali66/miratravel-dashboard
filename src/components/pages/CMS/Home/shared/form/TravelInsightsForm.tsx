import type { HomeSection } from "../../homeTypes"
import { DynamicStyledField } from "../../../shared/FormControls"
import { ButtonsField } from "../../../shared/ButtonsField"
import { UniversalMultimediaForm } from "../../../shared/UniversalMultimediaForm"

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

  return (
    <div className="flex flex-col gap-5">
      <div className="rounded-md border border-border/50 p-3">
        <p className="mb-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          Content
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
            label="Description"
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
