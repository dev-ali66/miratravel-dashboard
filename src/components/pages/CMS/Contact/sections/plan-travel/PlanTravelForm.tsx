import { FormSection, DynamicStyledField } from "@/components/pages/CMS/shared/FormControls"
import { UniversalMultimediaForm } from "@/components/pages/CMS/shared/UniversalMultimediaForm"
import type { ContactFormSectionProps } from "../../config/contactSections"
import { emptyPlanTravel } from "./emptyPlanTravel"

export function PlanTravelForm({
  section,
  index,
  updateSection,
  openSections,
  toggleSection,
  sectionNumber,
}: ContactFormSectionProps) {
  const plan = section || {}
  const isOpen = Boolean(openSections["plan-travel"])

  const updatePlanField = (fieldKey: string, value: any) => {
    updateSection(index, { [fieldKey]: value })
  }

  return (
    <FormSection
      title="A Personal Approach / Plan Travel"
      sectionNumber={sectionNumber}
      active={isOpen}
      onClick={() => toggleSection("plan-travel")}
    >
      <div className="flex flex-col gap-5">
        <DynamicStyledField
          type="text"
          label="Eyebrow / Section Label"
          fieldName="plan.label"
          placeholder="e.g. A PERSONAL APPROACH"
          value={plan.label}
          onChange={(val) => updatePlanField("label", val)}
        />

        <DynamicStyledField
          type="text"
          label="Section Title"
          fieldName="plan.title"
          placeholder="e.g. A more thoughtful way to plan travel."
          value={plan.title}
          onChange={(val) => updatePlanField("title", val)}
        />

        <DynamicStyledField
          type="richtext"
          label="Description / Narrative Content"
          fieldName="plan.description"
          placeholder="Write narrative details..."
          value={plan.description}
          onChange={(val) => updatePlanField("description", val)}
        />

        <UniversalMultimediaForm
          title="Left-side Featured Image / Media"
          fieldName="plan.leftSideMultimedia"
          defaultShow="image"
          imageFieldName="cmsContactPlanTravelImage"
          videoFieldName="cmsContactPlanTravelVideo"
          value={
            plan.leftSideMultimedia ||
            (plan as any).multimedia ||
            emptyPlanTravel.leftSideMultimedia
          }
          onChange={(multimedia) =>
            updatePlanField("leftSideMultimedia", multimedia)
          }
        />

        <UniversalMultimediaForm
          title="Background Media"
          fieldName="plan.backgroundMultimedia"
          defaultShow="color"
          imageFieldName="cmsContactPlanTravelBackgroundImage"
          videoFieldName="cmsContactPlanTravelBackgroundVideo"
          value={
            plan.backgroundMultimedia ||
            emptyPlanTravel.backgroundMultimedia
          }
          onChange={(multimedia) =>
            updatePlanField("backgroundMultimedia", multimedia)
          }
        />
      </div>
    </FormSection>
  )
}

export default PlanTravelForm
