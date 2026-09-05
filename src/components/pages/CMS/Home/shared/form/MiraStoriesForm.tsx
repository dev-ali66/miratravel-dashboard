import type { HomeSection } from "../../homeTypes"
import { DynamicStyledField } from "../../../shared/FormControls"
import { ButtonsField } from "../../../shared/ButtonsField"
import { UniversalMultimediaForm } from "../../../shared/UniversalMultimediaForm"

export type MiraStoriesFormProps = {
  section: HomeSection
  index: number
  updateSection: (index: number, patch: Partial<HomeSection>) => void
  updateSectionContent: (index: number, patch: Record<string, any>) => void
  updateSectionImages: (index: number, images: any[]) => void
  updateSectionButtons: (index: number, buttons: any[]) => void
}

export function MiraStoriesForm({
  section,
  index,
  updateSection,
  updateSectionContent,
  updateSectionButtons,
}: MiraStoriesFormProps) {
  const content = (section.content ?? {}) as any
  const items = (section.items ?? []) as any[]

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
            style={content.homeMiraStoriesEyebrowStyle}
            onStyleChange={(style) =>
              updateSectionContent(index, {
                homeMiraStoriesEyebrowStyle: style,
              })
            }
          />

          <DynamicStyledField
            type="text"
            label="Title"
            value={content.title ?? ""}
            onChange={(value) => updateSectionContent(index, { title: value })}
            enableStyle
            style={content.homeMiraStoriesTitleStyle}
            onStyleChange={(style) =>
              updateSectionContent(index, { homeMiraStoriesTitleStyle: style })
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
            style={content.homeMiraStoriesDescriptionStyle}
            onStyleChange={(style) =>
              updateSectionContent(index, {
                homeMiraStoriesDescriptionStyle: style,
              })
            }
          />
        </div>
      </div>

      <div className="rounded-md border border-border/50 p-3">
        <p className="mb-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          Story Items
        </p>
        <div className="flex flex-col gap-4">
          {items.map((item, itemIndex) => (
            <div
              key={itemIndex}
              className="rounded-md border border-border/40 p-3"
            >
              <div className="mb-3 text-[11px] font-semibold">
                Story {itemIndex + 1}
              </div>
              <div className="flex flex-col gap-3">
                <DynamicStyledField
                  type="text"
                  label="Index"
                  value={item.index ?? ""}
                  onChange={(value) => {
                    const updated = [...items]
                    updated[itemIndex] = { ...updated[itemIndex], index: value }
                    updateSection(index, { items: updated })
                  }}
                  enableStyle
                  style={item.homeMiraStoriesItemIndexStyle}
                  onStyleChange={(style) => {
                    const updated = [...items]
                    updated[itemIndex] = {
                      ...updated[itemIndex],
                      homeMiraStoriesItemIndexStyle: style,
                    }
                    updateSection(index, { items: updated })
                  }}
                />

                <DynamicStyledField
                  type="text"
                  label="Title"
                  value={item.title ?? ""}
                  onChange={(value) => {
                    const updated = [...items]
                    updated[itemIndex] = { ...updated[itemIndex], title: value }
                    updateSection(index, { items: updated })
                  }}
                  enableStyle
                  style={item.homeMiraStoriesItemTitleStyle}
                  onStyleChange={(style) => {
                    const updated = [...items]
                    updated[itemIndex] = {
                      ...updated[itemIndex],
                      homeMiraStoriesItemTitleStyle: style,
                    }
                    updateSection(index, { items: updated })
                  }}
                />

                <DynamicStyledField
                  type="text"
                  label="Subtitle"
                  value={item.subtitle ?? ""}
                  onChange={(value) => {
                    const updated = [...items]
                    updated[itemIndex] = {
                      ...updated[itemIndex],
                      subtitle: value,
                    }
                    updateSection(index, { items: updated })
                  }}
                  enableStyle
                  style={item.homeMiraStoriesItemSubtitleStyle}
                  onStyleChange={(style) => {
                    const updated = [...items]
                    updated[itemIndex] = {
                      ...updated[itemIndex],
                      homeMiraStoriesItemSubtitleStyle: style,
                    }
                    updateSection(index, { items: updated })
                  }}
                />

                <DynamicStyledField
                  type="text"
                  label="URL"
                  value={item.url ?? ""}
                  onChange={(value) => {
                    const updated = [...items]
                    updated[itemIndex] = { ...updated[itemIndex], url: value }
                    updateSection(index, { items: updated })
                  }}
                  enableStyle
                  style={item.homeMiraStoriesItemUrlStyle}
                  onStyleChange={(style) => {
                    const updated = [...items]
                    updated[itemIndex] = {
                      ...updated[itemIndex],
                      homeMiraStoriesItemUrlStyle: style,
                    }
                    updateSection(index, { items: updated })
                  }}
                />
              </div>
            </div>
          ))}
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
        imageFieldName="cmsHomeMiraStoriesBackgroundImage"
        videoFieldName="cmsHomeMiraStoriesBackgroundVideo"
        imageAltStyleKey="homeMiraStoriesBackgroundImageAltStyle"
        videoAltStyleKey="homeMiraStoriesBackgroundVideoAltStyle"
      />

      <UniversalMultimediaForm
        section={section}
        content={content}
        updateSection={(patch) => updateSection(index, patch)}
        updateSectionContent={(patch) => updateSectionContent(index, patch)}
        contentMediaKey="leftSideMultimedia"
        sectionTitle="Left Section"
        showColorPicker
        colorLabel="Left section color"
        defaultColor="#FBF9F5"
        imageTitle="Left Side Multimedia"
        imageLabel="Left side image"
        imageFieldName="cmsHomeMiraStoriesLeftSectionImage"
        videoFieldName="cmsHomeMiraStoriesLeftSectionVideo"
        imageAltStyleKey="homeMiraStoriesLeftSideMultimediaAltStyle"
        videoAltStyleKey="homeMiraStoriesLeftSideMultimediaVideoAltStyle"
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
