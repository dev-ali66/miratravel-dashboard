import { FormSection, DynamicStyledField } from "@/components/pages/CMS/shared/FormControls"
import { RepeaterList } from "@/components/pages/CMS/shared/RepeaterList"
import type { ContactFormSectionProps } from "../../config/contactSections"
import { emptyProcess } from "./emptyProcess"
import { UniversalMultimediaForm } from "../../../shared/UniversalMultimediaForm"

export function ProcessForm({
  section,
  index,
  updateSection,
  openSections,
  toggleSection,
  sectionNumber,
}: ContactFormSectionProps) {
  const process = section || {}
  const isOpen = Boolean(openSections["process"])

  const updateProcessField = (fieldKey: string, value: any) => {
    updateSection(index, { [fieldKey]: value })
  }

  const items = Array.isArray(process.items)
    ? process.items
    : Array.isArray(process.steps)
      ? process.steps
      : emptyProcess.items

  return (
    <FormSection
      title="How The Process Works"
      sectionNumber={sectionNumber}
      active={isOpen}
      onClick={() => toggleSection("process")}
    >
      <div className="flex flex-col gap-5">

        <DynamicStyledField
          type="text"
          label="Section Title"
          fieldName="process.title"
          placeholder="e.g. HOW THE PROCESS WORKS"
          value={process.title}
          onChange={(val) => updateProcessField("title", val)}
        />

        <div className="rounded-lg border border-border/70 bg-card p-3.5">
          <RepeaterList
            title="Process Items"
            items={items}
            newItemTemplate={() => ({
              title: "New Process Item",
              description: "Description for this item...",
            })}
            onChange={(updatedItems) => updateProcessField("items", updatedItems)}
            renderItem={(item, updateItem, _idx) => (
              <div className="flex flex-col gap-3">
                <DynamicStyledField
                  type="text"
                  label={`Item ${_idx + 1} Title`}
                  fieldName={`process.item.${_idx}.title`}
                  placeholder="e.g. Initial Conversation"
                  value={item.title}
                  onChange={(val) => updateItem({ ...item, title: val })}
                />
                <DynamicStyledField
                  type="textarea"
                  rows={2}
                  label={`Item ${_idx + 1} Description`}
                  fieldName={`process.item.${_idx}.description`}
                  placeholder="Describe details..."
                  value={item.description}
                  onChange={(val) => updateItem({ ...item, description: val })}
                />
              </div>
            )}
          />
        </div>

         {/* Universal Multimedia / Background Media */}
         <UniversalMultimediaForm
                  title="Background Media"
                  fieldName="process.backgroundMultimedia"
                  defaultShow="color"
                  imageFieldName="cmsContactProcessBackgroundImage"
                  videoFieldName="cmsContactProcessBackgroundVideo"
                  value={
                    process.backgroundMultimedia ||
                    (process as any).multimedia ||
                    emptyProcess.backgroundMultimedia
                  }
                  onChange={(multimedia) =>
                    updateProcessField("backgroundMultimedia", multimedia)
                  }
                />
      </div>
    </FormSection>
  )
}

export default ProcessForm
