import { DynamicStyledField } from "../../../shared/FormControls"
import { UniversalMultimediaForm } from "../../../shared/UniversalMultimediaForm"
import { ButtonsField } from "../../../shared/ButtonsField"
import type { ContactSection } from "../../contactTypes"
import type { ContactFormSectionProps } from "./sectionTypes"
export const FinalCtaForm = ({
  section,
  index,
  updateSection,
  updateSectionContent,
  updateSectionButtons,
}: ContactFormSectionProps) => {
  const content = section.content ?? {}
  return (
    <div className="flex flex-col gap-4">
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
        contentMediaKey="contentMultimedia"
        backgroundType={content.contentMultimedia?.type}
        sectionTitle="CTA Media"
        showColorPicker
        defaultColor="#FBF9F5"
        imageFieldName="contactCtaImage"
        videoFieldName="contactCtaVideo"
        showImageAltField
        showVideoAltField
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
