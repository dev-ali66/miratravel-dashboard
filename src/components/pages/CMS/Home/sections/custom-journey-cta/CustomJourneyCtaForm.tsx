import type { HomeFormSectionProps } from "../../config/homeSections"
import { FormSection, DynamicStyledField } from "@/components/pages/CMS/shared/FormControls"
import { ButtonsField } from "@/components/pages/CMS/shared/ButtonsField"
import { UniversalMultimediaForm } from "@/components/pages/CMS/shared/UniversalMultimediaForm"
import { emptyCustomJourneyCta } from "./emptyCustomJourneyCta"

export function CustomJourneyCtaForm({
  section,
  index,
  updateSection,
  openSections,
  toggleSection,
  sectionNumber,
}: HomeFormSectionProps) {
  const sec = (section || {}) as Record<string, any>
  const content = (sec.content ?? sec) as Record<string, any>
  const isOpen = Boolean(
    openSections["custom_journey_cta"] || openSections["custom-journey-cta"]
  )

  const updateField = (fieldKey: string, value: any) => {
    updateSection(index, { [fieldKey]: value })
  }

  return (
    <FormSection
      title="Custom Journey CTA Section"
      sectionNumber={sectionNumber}
      active={isOpen}
      onClick={() => toggleSection("custom_journey_cta")}
    >
      <div className="flex flex-col gap-5">
        <div className="rounded-lg border border-border/70 bg-card p-3.5">
          <p className="mb-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            Section Header & Title
          </p>

          <div className="flex flex-col gap-3">
            <DynamicStyledField
              type="richtext"
              label="Title"
              fieldName="custom_journey_cta.title"
              placeholder="e.g. Prefer something more personal? Let’s design it together"
              value={sec.title ?? content.title ?? emptyCustomJourneyCta.title}
              onChange={(value: any) => updateField("title", value)}
              enableStyle
            />

            <DynamicStyledField
              type="richtext"
              label="Description"
              fieldName="custom_journey_cta.description"
              placeholder="Tell us how you like to travel..."
              value={sec.description ?? content.description ?? emptyCustomJourneyCta.description}
              onChange={(value: any) => updateField("description", value)}
              enableStyle
            />
          </div>
        </div>

        <UniversalMultimediaForm
          title="Background Media & Style"
          fieldName="custom_journey_cta.backgroundMultimedia"
          defaultShow="color"
          showColorPicker
          colorLabel="Background color"
          defaultColor="#FBF9F5"
          imageFieldName="cmsHomeCustomJourneyCtaBackgroundImage"
          videoFieldName="cmsHomeCustomJourneyCtaBackgroundVideo"
          value={
            (sec as any).backgroundMultimedia ||
            content.backgroundMultimedia ||
            emptyCustomJourneyCta.backgroundMultimedia
          }
          onChange={(multimedia) => updateField("backgroundMultimedia", multimedia)}
        />

        <UniversalMultimediaForm
          title="Right Side Media & Style"
          fieldName="custom_journey_cta.rightSideMultimedia"
          defaultShow="image"
          showColorPicker
          colorLabel="Right section color"
          defaultColor="#FBF9F5"
          imageTitle="Side Image"
          imageLabel="Side image"
          imageFieldName="cmsHomeCustomJourneyCtaRightSectionImage"
          videoFieldName="cmsHomeCustomJourneyCtaRightSectionVideo"
          value={
            (sec as any).rightSideMultimedia ||
            content.rightSideMultimedia ||
            emptyCustomJourneyCta.rightSideMultimedia
          }
          onChange={(multimedia) => updateField("rightSideMultimedia", multimedia)}
        />

        <div className="rounded-lg border border-border/70 bg-card p-3.5">
          <p className="mb-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            Call to Action (CTA) Buttons
          </p>

          <ButtonsField
            fieldName="custom_journey_cta.buttons"
            value={sec.buttons ?? content.buttons ?? emptyCustomJourneyCta.buttons}
            onChange={(buttons) => updateField("buttons", buttons)}
          />
        </div>
      </div>
    </FormSection>
  )
}

export default CustomJourneyCtaForm
