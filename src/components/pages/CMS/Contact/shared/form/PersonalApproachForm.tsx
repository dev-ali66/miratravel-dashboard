import { DynamicStyledField } from "../../../shared/FormControls"
import { UniversalMultimediaForm } from "../../../shared/UniversalMultimediaForm"
import type { ContactSection } from "../../contactTypes"
import type { ContactFormSectionProps } from "./sectionTypes"
export const PersonalApproachForm = ({
  section,
  index,
  updateSection,
  updateSectionContent,
}: ContactFormSectionProps) => {
  const content = section.content ?? {}
  return (
    <div className="flex flex-col gap-4">
      <DynamicStyledField
        type="text"
        label="Eyebrow"
        value={content.eyebrow ?? ""}
        onChange={(value) => updateSectionContent(index, { eyebrow: value })}
        enableStyle
        style={content.contactSectionEyebrowStyle}
        onStyleChange={(style) =>
          updateSectionContent(index, { contactSectionEyebrowStyle: style })
        }
      />
      <DynamicStyledField
        type="text"
        label="Title"
        value={content.title ?? ""}
        onChange={(value) => updateSectionContent(index, { title: value })}
        enableStyle
        style={content.contactSectionTitleStyle}
        onStyleChange={(style) =>
          updateSectionContent(index, { contactSectionTitleStyle: style })
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
        style={content.contactSectionDescriptionStyle}
        onStyleChange={(style) =>
          updateSectionContent(index, { contactSectionDescriptionStyle: style })
        }
      />
      <UniversalMultimediaForm
        section={section as any}
        content={content as Record<string, any>}
        updateSection={(patch) =>
          updateSection(index, patch as Partial<ContactSection>)
        }
        updateSectionContent={(patch) => updateSectionContent(index, patch)}
        contentMediaKey="leftMultimedia"
        backgroundType={content.leftMultimedia?.type}
        sectionTitle="Left Media"
        showColorPicker
        defaultColor="#FDF8F1"
        imageFieldName="contactApproachLeftImage"
        videoFieldName="contactApproachLeftVideo"
        showImageAltField
        showVideoAltField
        showVideoSwitches
      />
      <UniversalMultimediaForm
        section={section as any}
        content={content as Record<string, any>}
        updateSection={(patch) =>
          updateSection(index, patch as Partial<ContactSection>)
        }
        updateSectionContent={(patch) => updateSectionContent(index, patch)}
        contentMediaKey="contentMultimedia"
        backgroundType={content.contentMultimedia?.type}
        sectionTitle="Background Media"
        showColorPicker
        defaultColor="#FDF8F1"
        imageFieldName="contactApproachBackGroundImage"
        videoFieldName="contactApproachBackGroundVideo"
        showImageAltField
        showVideoAltField
        showVideoSwitches
      />
    </div>
  )
}
