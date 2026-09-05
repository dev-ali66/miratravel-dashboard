import type { HomeSection } from "../../homeTypes"
import { DynamicStyledField } from "../../../shared/FormControls"
import { ButtonsField } from "../../../shared/ButtonsField"
import { UniversalMultimediaForm } from "../../../shared/UniversalMultimediaForm"

export type ExploreJourneysFormProps = {
  section: HomeSection
  index: number
  updateSection: (index: number, patch: Partial<HomeSection>) => void
  updateSectionContent: (index: number, patch: Record<string, any>) => void
  updateSectionImages: (index: number, images: any[]) => void
  updateSectionVideos: (index: number, videos: any[]) => void
  updateSectionButtons: (index: number, buttons: any[]) => void
}

export function ExploreJourneysForm({
  section,
  index,
  updateSection,
  updateSectionContent,
  updateSectionButtons,
}: ExploreJourneysFormProps) {
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
            onChange={(value: string) =>
              updateSectionContent(index, { eyebrow: value })
            }
            enableStyle
            style={content.homeExploreJourneysEyebrowStyle}
            onStyleChange={(style) =>
              updateSectionContent(index, {
                homeExploreJourneysEyebrowStyle: style,
              })
            }
          />

          <DynamicStyledField
            type="text"
            label="Title"
            value={content.title ?? ""}
            onChange={(value: string) =>
              updateSectionContent(index, { title: value })
            }
            enableStyle
            style={content.homeExploreJourneysTitleStyle}
            onStyleChange={(style) =>
              updateSectionContent(index, {
                homeExploreJourneysTitleStyle: style,
              })
            }
          />

          <DynamicStyledField
            type="text"
            label="Subtitle"
            value={content.subtitle ?? ""}
            onChange={(value: string) =>
              updateSectionContent(index, { subtitle: value })
            }
            enableStyle
            style={content.homeExploreJourneysSubtitleStyle}
            onStyleChange={(style) =>
              updateSectionContent(index, {
                homeExploreJourneysSubtitleStyle: style,
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
            style={content.homeExploreJourneysDescriptionStyle}
            onStyleChange={(style) =>
              updateSectionContent(index, {
                homeExploreJourneysDescriptionStyle: style,
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
        backgroundTypeStyleKey="homeExploreJourneysBackgroundTypeStyle"
        showColorPicker
        colorLabel="Background color"
        defaultColor="#FBF9F5"
        imageTitle="Background Image"
        imageLabel="Background image"
        imageFieldName="cmsHomeExploreJourneysBackgroundImage"
        imageAltStyleKey="homeExploreJourneysBackgroundImageAltStyle"
        videoTitle="Background Video"
        videoLabel="Background video"
        videoHint="Upload a video to use as the Explore Journeys background."
        videoFieldName="cmsHomeExploreJourneysBackgroundVideo"
        videoAltStyleKey="homeExploreJourneysBackgroundVideoAltStyle"
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
