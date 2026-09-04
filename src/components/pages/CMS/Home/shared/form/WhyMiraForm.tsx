import type { HomeSection } from "../../homeTypes"
import { DynamicStyledField } from "../../../shared/FormControls"
import { UniversalMultimediaForm } from "./UniversalMultimediaForm"

export type WhyMiraFormProps = {
  section: HomeSection
  index: number
  updateSection: (index: number, patch: Partial<HomeSection>) => void
  updateSectionContent: (index: number, patch: Record<string, any>) => void
}

export function WhyMiraForm({
  section,
  index,
  updateSection,
  updateSectionContent,
}: WhyMiraFormProps) {
  const content = (section.content ?? {}) as any
  const paragraphs = content.paragraphs ?? []

  return (
    <div className="flex flex-col gap-5">
      <div className="rounded-md border border-border/50 p-3">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Content</p>
        <div className="flex flex-col gap-3">
          <DynamicStyledField type="text"
            label="Eyebrow"
            value={content.eyebrow ?? ""}
            onChange={(value) => updateSectionContent(index, { eyebrow: value })}
            enableStyle
            style={content.homeWhyMiraEyebrowStyle}
            onStyleChange={(style) =>
              updateSectionContent(index, { homeWhyMiraEyebrowStyle: style })
            }
          />

          <DynamicStyledField type="text"
            label="Title"
            value={content.title ?? ""}
            onChange={(value) => updateSectionContent(index, { title: value })}
            enableStyle
            style={content.homeWhyMiraTitleStyle}
            onStyleChange={(style) =>
              updateSectionContent(index, { homeWhyMiraTitleStyle: style })
            }
          />

          <DynamicStyledField type="text"
            label="Signature"
            value={content.signature ?? ""}
            onChange={(value) => updateSectionContent(index, { signature: value })}
            enableStyle
            style={content.homeWhyMiraSignatureStyle}
            onStyleChange={(style) =>
              updateSectionContent(index, { homeWhyMiraSignatureStyle: style })
            }
          />

          {paragraphs.map((paragraph: string, paragraphIndex: number) => (
            <DynamicStyledField type="textarea"
              key={paragraphIndex}
              label={`Paragraph ${paragraphIndex + 1}`}
              value={paragraph ?? ""}
              onChange={(value) => {
                const updated = [...paragraphs]
                updated[paragraphIndex] = value
                updateSectionContent(index, { paragraphs: updated })
              }}
              enableStyle
              style={content[`homeWhyMiraParagraph${paragraphIndex + 1}Style`]}
              onStyleChange={(style) =>
                updateSectionContent(index, {
                  [`homeWhyMiraParagraph${paragraphIndex + 1}Style`]: style,
                })
              }
            />
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
        defaultColor="#1F3A1B"
        imageFieldName="cmsHomeWhyMiraBackgroundImage"
        videoFieldName="cmsHomeWhyMiraBackgroundVideo"
        imageAltStyleKey="homeWhyMiraBackgroundImageAltStyle"
        videoAltStyleKey="homeWhyMiraBackgroundVideoAltStyle"
      />

      <UniversalMultimediaForm
        section={section}
        content={content}
        updateSection={(patch) => updateSection(index, patch)}
        updateSectionContent={(patch) => updateSectionContent(index, patch)}
        contentMediaKey="rightSideMultimedia"
        sectionTitle="Right Section"
        showColorPicker
        colorLabel="Right section color"
        defaultColor="#FBF9F5"
        imageTitle="Side Image"
        imageLabel="Side image"
        imageFieldName="cmsHomeWhyMiraRightSectionImage"
        videoFieldName="cmsHomeWhyMiraRightSectionVideo"
        imageAltStyleKey="homeWhyMiraSideImageAltStyle"
        videoAltStyleKey="homeWhyMiraRightSectionVideoAltStyle"
      />
    </div>
  )
}
