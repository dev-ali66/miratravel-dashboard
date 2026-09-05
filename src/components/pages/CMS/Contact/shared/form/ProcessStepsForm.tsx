import { DynamicStyledField } from "../../../shared/FormControls"
import { UniversalMultimediaForm } from "../../../shared/UniversalMultimediaForm"
import { RepeaterList } from "../../../shared/RepeaterList"
import type { ContactSection } from "../../contactTypes"
import type { ContactFormSectionProps } from "./sectionTypes"
export const ProcessStepsForm = ({
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
        sectionTitle="Process Steps Media"
        showColorPicker
        colorLabel="Process background color"
        defaultColor="#FDF8F1"
        imageFieldName="contactProcessBackgroundImage"
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
            />
            <DynamicStyledField
              type="text"
              label="Title"
              value={item.title ?? ""}
              onChange={(value) => update({ ...item, title: value })}
            />
            <DynamicStyledField
              type="textarea"
              label="Description"
              value={item.description ?? ""}
              onChange={(value) => update({ ...item, description: value })}
            />
          </div>
        )}
      />
    </div>
  )
}
