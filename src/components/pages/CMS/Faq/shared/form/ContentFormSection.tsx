import { DynamicStyledField } from "../../../shared/FormControls"
import { UniversalMultimediaForm } from "../../../shared/UniversalMultimediaForm"
import type { FaqSectionFormProps } from "./sectionTypes"

export const ContentFormSection = ({
  data,
  updateContent,
  updateData,
}: FaqSectionFormProps) => (
  <div className="flex flex-col gap-3">
    <DynamicStyledField
      type="text"
      label="Eyebrow"
      value={data.content?.eyebrow ?? ""}
      onChange={(value) => updateContent({ eyebrow: value })}
      enableStyle
      style={data.content?.faqContentEyebrowStyle}
      onStyleChange={(style) =>
        updateContent({ faqContentEyebrowStyle: style })
      }
    />
    <DynamicStyledField
      type="text"
      label="Title"
      value={data.content?.title ?? ""}
      onChange={(value) => updateContent({ title: value })}
      enableStyle
      style={data.content?.faqContentTitleStyle}
      onStyleChange={(style) => updateContent({ faqContentTitleStyle: style })}
    />
    <DynamicStyledField
      type="textarea"
      label="Subtitle"
      value={data.content?.subtitle ?? ""}
      onChange={(value) => updateContent({ subtitle: value })}
      enableStyle
      style={data.content?.faqContentSubtitleStyle}
      onStyleChange={(style) =>
        updateContent({ faqContentSubtitleStyle: style })
      }
    />
    <DynamicStyledField
      type="textarea"
      label="Description"
      value={data.content?.description ?? ""}
      onChange={(value) => updateContent({ description: value })}
      enableStyle
      style={data.content?.faqContentDescriptionStyle}
      onStyleChange={(style) =>
        updateContent({ faqContentDescriptionStyle: style })
      }
    />
    <UniversalMultimediaForm
      section={data as any}
      content={data.content as Record<string, any>}
      updateSection={(patch) => updateData(patch as any)}
      updateSectionContent={(patch) =>
        updateData({ content: { ...data.content, ...patch } } as any)
      }
      contentMediaKey="contentMultimedia"
      sectionTitle="Content Media"
      showColorPicker
      colorLabel="Content media color"
      defaultColor="#FFFFFF"
      imageTitle="Content Image"
      imageLabel="Content image"
      imageFieldName="cmsFaqContentImage"
      videoTitle="Content Video"
      videoLabel="Content video"
      videoFieldName="cmsFaqContentVideo"
      videoHint="Upload a video to use for FAQ content media."
      showVideoSwitches
    />
  </div>
)
