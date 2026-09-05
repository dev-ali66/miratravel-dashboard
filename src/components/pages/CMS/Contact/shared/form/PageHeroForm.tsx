import { DynamicStyledField } from "../../../shared/FormControls"
import { UniversalMultimediaForm } from "../../../shared/UniversalMultimediaForm"
import type { ContactSection } from "../../contactTypes"
import type { ContactFormSectionProps } from "./sectionTypes"

export const PageHeroForm = ({
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
        style={content.contactHeroEyebrowStyle}
        onStyleChange={(style) =>
          updateSectionContent(index, { contactHeroEyebrowStyle: style })
        }
      />
      <DynamicStyledField
        type="text"
        label="Title line 1"
        value={content.titleLine1 ?? ""}
        onChange={(value) => updateSectionContent(index, { titleLine1: value })}
        enableStyle
        style={content.contactHeroTitleLine1Style}
        onStyleChange={(style) =>
          updateSectionContent(index, { contactHeroTitleLine1Style: style })
        }
      />
      <DynamicStyledField
        type="text"
        label="Title line 2"
        value={content.titleLine2 ?? ""}
        onChange={(value) => updateSectionContent(index, { titleLine2: value })}
        enableStyle
        style={content.contactHeroTitleLine2Style}
        onStyleChange={(style) =>
          updateSectionContent(index, { contactHeroTitleLine2Style: style })
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
        style={content.contactHeroDescriptionStyle}
        onStyleChange={(style) =>
          updateSectionContent(index, { contactHeroDescriptionStyle: style })
        }
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
        sectionTitle="Hero Media"
        showColorPicker
        colorLabel="Hero background color"
        defaultColor="#24351C"
        imageFieldName="contactHeroBackgroundImage"
        videoFieldName="contactHeroBackgroundVideo"
        videoHint="Upload a video for the contact hero background."
        showImageAltField
        showVideoAltField
        showVideoSwitches
      />
    </div>
  )
}
