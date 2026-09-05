import type { HomeSection } from "../../homeTypes"
import { DynamicStyledField } from "../../../shared/FormControls"
import { ButtonsField } from "../../../shared/ButtonsField"
import { UniversalMultimediaForm } from "../../../shared/UniversalMultimediaForm"

export type HeroFormProps = {
  section: HomeSection
  index: number
  updateSection: (index: number, patch: Partial<HomeSection>) => void
  updateSectionContent: (index: number, patch: Record<string, any>) => void
  updateSectionImages: (index: number, images: any[]) => void
  updateSectionVideos: (index: number, videos: any[]) => void
  updateSectionButtons: (index: number, buttons: any[]) => void
}

export function HeroForm({
  section,
  index,
  updateSection,
  updateSectionContent,
  updateSectionButtons,
}: HeroFormProps) {
  const content = (section.content ?? {}) as any

  return (
    <div className="flex flex-col gap-5">
      <div className="rounded-md border border-border/50 p-3">
        <p className="mb-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          Hero Content
        </p>

        <div className="flex flex-col gap-3">
          <DynamicStyledField
            type="text"
            label="Title line 1"
            value={content.titleLine1 ?? ""}
            onChange={(value: string) =>
              updateSectionContent(index, { titleLine1: value })
            }
            enableStyle
            style={content.homeHeroTitleStyle ?? content.titleLine1Style}
            onStyleChange={(style) =>
              updateSectionContent(index, {
                homeHeroTitleStyle: style,
                titleLine1Style: style,
              })
            }
          />

          <DynamicStyledField
            type="text"
            label="Title highlight"
            value={content.titleHighlight ?? ""}
            onChange={(value: string) =>
              updateSectionContent(index, { titleHighlight: value })
            }
            enableStyle
            style={
              content.homeHeroTitleHighlightStyle ?? content.titleHighlightStyle
            }
            onStyleChange={(style) =>
              updateSectionContent(index, {
                homeHeroTitleHighlightStyle: style,
                titleHighlightStyle: style,
              })
            }
          />

          <DynamicStyledField
            type="text"
            label="Title line 2"
            value={content.titleLine2 ?? ""}
            onChange={(value: string) =>
              updateSectionContent(index, { titleLine2: value })
            }
            enableStyle
            style={content.homeHeroTitleLine2Style ?? content.titleLine2Style}
            onStyleChange={(style) =>
              updateSectionContent(index, {
                homeHeroTitleLine2Style: style,
                titleLine2Style: style,
              })
            }
          />

          <DynamicStyledField
            type="textarea"
            label="Description"
            value={content.description ?? ""}
            onChange={(value: string) =>
              updateSectionContent(index, { description: value })
            }
            enableStyle
            style={content.homeHeroDescriptionStyle ?? content.descriptionStyle}
            onStyleChange={(style) =>
              updateSectionContent(index, {
                homeHeroDescriptionStyle: style,
                descriptionStyle: style,
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
        backgroundTypeStyleKey="homeHeroBackgroundTypeStyle"
        showColorPicker
        colorLabel="Background color"
        defaultColor="#0F2A2E"
        imageTitle="Background Image"
        imageLabel="Background image"
        imageFieldName="cmsHomeHeroBackgroundImage"
        imageAltStyleKey="homeHeroBackgroundImageAltStyle"
        videoTitle="Background Video"
        videoLabel="Hero background video"
        videoHint="Upload a video to use as the Hero background."
        videoFieldName="cmsHomeHeroBackgroundVideo"
        videoAltStyleKey="homeHeroBackgroundVideoAltStyle"
        showVideoSwitches
      />

      <div className="rounded-md border border-border/50 p-3">
        <p className="mb-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          Buttons
        </p>

        <ButtonsField
          value={section.buttons ?? []}
          onChange={(buttons: any[]) => updateSectionButtons(index, buttons)}
        />
      </div>
    </div>
  )
}
