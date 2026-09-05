import { DynamicStyledField } from "../../../shared/FormControls"
import { UniversalMultimediaForm } from "../../../shared/UniversalMultimediaForm"
import { RepeaterList } from "../../../shared/RepeaterList"
import { FormBuilder } from "../../../shared/formBuilder/FormBuilder"
import type { ContactSection } from "../../contactTypes"
import type { ContactFormSectionProps } from "./sectionTypes"

export const ContactSectionForm = ({
  section,
  index,
  updateSection,
  updateSectionContent,
  updateSectionField,
  addField,
  removeField,
  updateButton,
}: ContactFormSectionProps) => {
  const content = section.content ?? {}

  return (
    <div className="flex flex-col gap-4">
      {![
        "pageHero",
        "stepList",
        "contactForm",
        "textImageFeature",
        "ctaBanner",
      ].includes(section.type) && (
        <DynamicStyledField
          type="color"
          label="Background color"
          value={section.bgColor ?? "#FDF8F1"}
          onChange={(value) => updateSection(index, { bgColor: value })}
        />
      )}

      {section.type === "pageHero" && (
        <>
          <DynamicStyledField
            type="text"
            label="Eyebrow"
            value={content.eyebrow ?? ""}
            onChange={(value) =>
              updateSectionContent(index, { eyebrow: value })
            }
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
            onChange={(value) =>
              updateSectionContent(index, { titleLine1: value })
            }
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
            onChange={(value) =>
              updateSectionContent(index, { titleLine2: value })
            }
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
              updateSectionContent(index, {
                contactHeroDescriptionStyle: style,
              })
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
            backgroundTypeStyleKey="contactHeroBackgroundTypeStyle"
            sectionTitle="Hero Media"
            showColorPicker
            colorLabel="Hero background color"
            defaultColor="#24351C"
            imageTitle="Hero Background Image"
            imageLabel="Hero background image"
            imageFieldName="contactHeroBackgroundImage"
            imageAltStyleKey="contactHeroBackgroundImageAltStyle"
            showImageAltField
            videoTitle="Hero Background Video"
            videoLabel="Hero background video"
            videoFieldName="contactHeroBackgroundVideo"
            videoAltStyleKey="contactHeroBackgroundVideoAltStyle"
            showVideoAltField
            videoHint="Upload a video for the contact hero background."
            showVideoSwitches
          />
        </>
      )}

      {section.type === "stepList" && (
        <>
          <DynamicStyledField
            type="text"
            label="Section title"
            value={content.title ?? ""}
            onChange={(value) => updateSectionContent(index, { title: value })}
            enableStyle
            style={content.contactStepsTitleStyle}
            onStyleChange={(style) =>
              updateSectionContent(index, { contactStepsTitleStyle: style })
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
            backgroundTypeStyleKey="contactStepsBackgroundTypeStyle"
            sectionTitle="Process Steps Media"
            showColorPicker
            colorLabel="Process background color"
            defaultColor="#FDF8F1"
            imageTitle="Process Background Image"
            imageLabel="Process background image"
            imageFieldName="contactProcessBackgroundImage"
            videoTitle="Process Background Video"
            videoLabel="Process background video"
            videoFieldName="contactProcessBackgroundVideo"
            videoHint="Upload a video for the process steps background."
            showVideoSwitches
          />
          <RepeaterList<any>
            items={(section.items ?? []) as any[]}
            onChange={(items) =>
              updateSection(index, { items } as Partial<ContactSection>)
            }
            addLabel="Add step"
            emptyLabel="No process steps added."
            itemLabel={(item) => item.title || "Untitled step"}
            newItem={() => ({
              id: `step-${Date.now()}`,
              index: String((section.items?.length ?? 0) + 1),
              title: "",
              description: "",
            })}
            renderItem={(item, update) => (
              <div className="flex flex-col gap-3">
                <DynamicStyledField
                  type="text"
                  label="Step"
                  value={item.index ?? ""}
                  onChange={(value) => update({ ...item, index: value })}
                  enableStyle
                  style={item.contactStepIndexStyle}
                  onStyleChange={(style) =>
                    update({ ...item, contactStepIndexStyle: style })
                  }
                />
                <DynamicStyledField
                  type="text"
                  label="Title"
                  value={item.title ?? ""}
                  onChange={(value) => update({ ...item, title: value })}
                  enableStyle
                  style={item.contactStepTitleStyle}
                  onStyleChange={(style) =>
                    update({ ...item, contactStepTitleStyle: style })
                  }
                />
                <DynamicStyledField
                  type="textarea"
                  label="Description"
                  value={item.description ?? ""}
                  onChange={(value) => update({ ...item, description: value })}
                  enableStyle
                  style={item.contactStepDescriptionStyle}
                  onStyleChange={(style) =>
                    update({ ...item, contactStepDescriptionStyle: style })
                  }
                />
              </div>
            )}
          />
        </>
      )}

      {(section.type === "contactForm" ||
        section.type === "textImageFeature" ||
        section.type === "ctaBanner") && (
        <>
          <DynamicStyledField
            type="text"
            label="Eyebrow"
            value={content.eyebrow ?? ""}
            onChange={(value) =>
              updateSectionContent(index, { eyebrow: value })
            }
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
              updateSectionContent(index, {
                contactSectionDescriptionStyle: style,
              })
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
            backgroundTypeStyleKey={`contact${section.type}BackgroundTypeStyle`}
            sectionTitle="Section Media"
            showColorPicker
            colorLabel="Section background color"
            defaultColor="#FDF8F1"
            imageTitle="Section Background Image"
            imageLabel="Section background image"
            imageFieldName={`contact${section.type}BackgroundImage`}
            videoTitle="Section Background Video"
            videoLabel="Section background video"
            videoFieldName={`contact${section.type}BackgroundVideo`}
            videoHint="Upload a video for this Contact section background."
            showVideoSwitches
          />
        </>
      )}

      {section.type === "textImageFeature" && (
        <UniversalMultimediaForm
          section={section as any}
          content={(section.sideImages?.[0] ?? {}) as Record<string, any>}
          updateSection={(patch) =>
            updateSection(index, patch as Partial<ContactSection>)
          }
          updateSectionContent={(patch) =>
            updateSection(index, {
              sideImages: [{ ...(section.sideImages?.[0] ?? {}), ...patch }],
            })
          }
          image={{
            url: section.sideImages?.[0]?.url ?? "",
            alt: section.sideImages?.[0]?.alt,
          }}
          onImageChange={(next) =>
            updateSection(index, {
              sideImages: [
                {
                  ...(section.sideImages?.[0] ?? {}),
                  url: next.url ?? "",
                  alt: next.alt,
                },
              ],
            })
          }
          enableTypeSelector={false}
          sectionTitle="Approach Media"
          imageTitle="Approach Image"
          imageLabel="Approach image"
          imageFieldName="contactApproachImage"
          showImageAltField
          allowVideo={false}
        />
      )}

      {section.type === "contactForm" && (
        <FormBuilder
          fields={section.fields ?? []}
          onChange={(fieldIndex, patch) =>
            updateSectionField(index, fieldIndex, patch)
          }
          onAdd={() => addField(index)}
          onRemove={(fieldIndex) => removeField(index, fieldIndex)}
        />
      )}

      {section.type === "contactForm" && (
        <UniversalMultimediaForm
          section={section as any}
          content={content as Record<string, any>}
          updateSection={(patch) =>
            updateSection(index, patch as Partial<ContactSection>)
          }
          updateSectionContent={(patch) => updateSectionContent(index, patch)}
          contentMediaKey="sideMultimedia"
          backgroundType={content.sideMultimedia?.type}
          sectionTitle="Inquiry Side Media"
          showColorPicker
          colorLabel="Inquiry side media color"
          defaultColor="#F5F0E8"
          imageTitle="Inquiry Side Image"
          imageLabel="Inquiry side image"
          imageFieldName="contactInquirySideImage"
          showImageAltField
          videoTitle="Inquiry Side Video"
          videoLabel="Inquiry side video"
          videoFieldName="contactInquirySideVideo"
          videoHint="Upload a video for the inquiry side media."
          showVideoAltField
          showVideoSwitches
        />
      )}

      {section.type === "infoColumns" && (
        <RepeaterList<any>
          items={(section.items ?? []) as any[]}
          onChange={(items) =>
            updateSection(index, { items } as Partial<ContactSection>)
          }
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
            </div>
          )}
        />
      )}

      {section.buttons?.map((button, buttonIndex) => (
        <div
          key={buttonIndex}
          className="rounded-md border border-border/50 p-3"
        >
          <DynamicStyledField
            type="text"
            label="Button label"
            value={button.label}
            onChange={(value) =>
              updateButton(index, buttonIndex, { label: value })
            }
            enableStyle
            style={(button as any).contactButtonLabelStyle}
            onStyleChange={(style) =>
              updateButton(index, buttonIndex, {
                contactButtonLabelStyle: style,
              })
            }
          />
          <DynamicStyledField
            type="text"
            label="Button URL"
            value={button.url}
            onChange={(value) =>
              updateButton(index, buttonIndex, { url: value })
            }
          />
          <DynamicStyledField
            type="text"
            label="API URL"
            value={(button as any).apiUrl ?? ""}
            onChange={(value) =>
              updateButton(index, buttonIndex, { apiUrl: value })
            }
          />
          <DynamicStyledField
            type="text"
            label="Action"
            value={button.action ?? ""}
            onChange={(value) =>
              updateButton(index, buttonIndex, { action: value })
            }
          />
        </div>
      ))}
    </div>
  )
}
