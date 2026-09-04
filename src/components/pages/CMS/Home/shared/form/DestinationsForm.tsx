import type { HomeSection } from "../../homeTypes"
import { DynamicStyledField } from "../../../shared/FormControls"
import { ButtonsField } from "../../../shared/ButtonsField"
import { UniversalMultimediaForm } from "./UniversalMultimediaForm"

export type DestinationsFormProps = {
  section: HomeSection
  index: number
  updateSection: (index: number, patch: Partial<HomeSection>) => void
  updateSectionContent: (index: number, patch: Record<string, any>) => void
  updateSectionImages: (index: number, images: any[]) => void
  updateSectionVideos: (index: number, videos: any[]) => void
  updateSectionButtons: (index: number, buttons: any[]) => void
}

export function DestinationsForm({
  section,
  index,
  updateSection,
  updateSectionContent,
  updateSectionButtons,
}: DestinationsFormProps) {
  const content = (section.content ?? {}) as any

  return (
    <div className="flex flex-col gap-5">
      <div className="rounded-md border border-border/50 p-3">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Content
        </p>

        <div className="flex flex-col gap-3">
          <DynamicStyledField type="text"
            label="Eyebrow"
            value={content.eyebrow ?? ""}
            onChange={(value: string) => updateSectionContent(index, { eyebrow: value })}
            enableStyle
            style={content.homeDestinationEyebrowStyle}
            onStyleChange={(style) =>
              updateSectionContent(index, { homeDestinationEyebrowStyle: style })
            }
          />

          <DynamicStyledField type="text"
            label="Title"
            value={content.title ?? ""}
            onChange={(value: string) => updateSectionContent(index, { title: value })}
            enableStyle
            style={content.homeDestinationTitleStyle}
            onStyleChange={(style) =>
              updateSectionContent(index, { homeDestinationTitleStyle: style })
            }
          />

          <DynamicStyledField type="textarea"
            label="Subtitle"
            value={content.subtitle ?? ""}
            onChange={(value: string) => updateSectionContent(index, { subtitle: value })}
            enableStyle
            style={content.homeDestinationSubtitleStyle}
            onStyleChange={(style) =>
              updateSectionContent(index, { homeDestinationSubtitleStyle: style })
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
      />

      <div className="rounded-md border border-border/50 p-3">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
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
