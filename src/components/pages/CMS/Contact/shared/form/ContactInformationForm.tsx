import { RepeaterList } from "../../../shared/RepeaterList"
import { UniversalMultimediaForm } from "../../../shared/UniversalMultimediaForm"
import type { ContactSection } from "../../contactTypes"
import { DynamicStyledField } from "../../../shared/FormControls"
import type { ContactFormSectionProps } from "./sectionTypes"
export const ContactInformationForm = ({
  section,
  index,
  updateSection,
  updateSectionContent,
}: ContactFormSectionProps) => (
  <div className="flex flex-col gap-4">
    <UniversalMultimediaForm
      section={section as any}
      content={(section.content ?? {}) as Record<string, any>}
      updateSection={(patch) =>
        updateSection(index, patch as Partial<ContactSection>)
      }
      updateSectionContent={(patch) => updateSectionContent(index, patch)}
      contentMediaKey="contentMultimedia"
      backgroundType={(section.content as any)?.contentMultimedia?.type}
      sectionTitle="Contact Information Background"
      showColorPicker
      colorLabel="Contact information background color"
      defaultColor="#FBF9F5"
      imageFieldName="contactInformationBackgroundImage"
      videoFieldName="contactInformationBackgroundVideo"
      videoHint="Upload a video for contact information background."
      showImageAltField
      showVideoAltField
      showVideoSwitches
    />
    <RepeaterList<any>
      items={(section.items ?? []) as any[]}
      onChange={(items) => updateSection(index, { items } as any)}
      addLabel="Add contact"
      emptyLabel="No contact information added."
      itemLabel={(item) => item.label || "Untitled contact"}
      newItem={() => ({
        id: `contact-${Date.now()}`,
        label: "",
        value: "",
        url: "",
      })}
      renderItem={(item, update) => (
        <div className="flex flex-col gap-3">
          <DynamicStyledField
            type="text"
            label="Label"
            value={item.label ?? ""}
            onChange={(value) => update({ ...item, label: value })}
            enableStyle
            style={item.contactInfoLabelStyle}
            onStyleChange={(style) =>
              update({ ...item, contactInfoLabelStyle: style })
            }
          />
          <DynamicStyledField
            type="text"
            label="Value"
            value={item.value ?? ""}
            onChange={(value) => update({ ...item, value })}
            enableStyle
            style={item.contactInfoValueStyle}
            onStyleChange={(style) =>
              update({ ...item, contactInfoValueStyle: style })
            }
          />
          <DynamicStyledField
            type="text"
            label="URL"
            value={item.url ?? ""}
            onChange={(value) => update({ ...item, url: value })}
          />
          <UniversalMultimediaForm
            section={{} as any}
            content={item as Record<string, any>}
            updateSection={() => undefined}
            updateSectionContent={(patch) => update({ ...item, ...patch })}
            contentMediaKey="iconMultimedia"
            backgroundType={(item.iconMultimedia as any)?.type}
            sectionTitle="Contact Icon Media"
            showColorPicker
            colorLabel="Icon color"
            defaultColor="#B87858"
            imageTitle="Contact Icon Image"
            imageLabel="Contact icon image"
            imageFieldName="contactInformationIcon"
            videoTitle="Contact Icon Video"
            videoLabel="Contact icon video"
            videoFieldName="contactInformationIconVideo"
            showImageAltField
            showVideoAltField
            showVideoSwitches
          />
        </div>
      )}
    />
  </div>
)
