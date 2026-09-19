import type { ContactFormSectionProps } from "../../config/contactSections"
import { FormSection, DynamicStyledField } from "@/components/pages/CMS/shared/FormControls"
import { ButtonsField } from "@/components/pages/CMS/shared/ButtonsField"
import { UniversalMultimediaForm } from "@/components/pages/CMS/shared/UniversalMultimediaForm"
import { emptyCta } from "./emptyCta"

export function CtaForm({
  section,
  index,
  updateSection,
  openSections,
  toggleSection,
  sectionNumber,
}: ContactFormSectionProps) {
  const sec = (section || {}) as Record<string, any>
  const content = (sec.content ?? sec) as Record<string, any>
  const isOpen = Boolean(openSections["cta"])

  const updateField = (fieldKey: string, value: any) => {
    updateSection(index, { [fieldKey]: value })
  }

  return (
    <FormSection
      title="Call to Action (CTA)"
      sectionNumber={sectionNumber}
      active={isOpen}
      onClick={() => toggleSection("cta")}
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
              fieldName="cta.title"
              placeholder="e.g. Prefer something more personal? Let’s design it together"
              value={sec.title ?? content.title ?? emptyCta.title}
              onChange={(value: any) => updateField("title", value)}
              enableStyle
            />

            <DynamicStyledField
              type="richtext"
              label="Description"
              fieldName="cta.description"
              placeholder="Tell us how you like to travel..."
              value={sec.description ?? content.description ?? emptyCta.description}
              onChange={(value: any) => updateField("description", value)}
              enableStyle
            />
          </div>
        </div>

        <UniversalMultimediaForm
          title="Background Media & Style"
          fieldName="cta.backgroundMultimedia"
          defaultShow="color"
          showColorPicker
          colorLabel="Background color"
          defaultColor="#FBF9F5"
          imageFieldName="cmsContactCtaBackgroundImage"
          videoFieldName="cmsContactCtaBackgroundVideo"
          value={
            (sec as any).backgroundMultimedia ||
            content.backgroundMultimedia ||
            emptyCta.backgroundMultimedia
          }
          onChange={(multimedia) => updateField("backgroundMultimedia", multimedia)}
        />

        <UniversalMultimediaForm
          title="Right Side Media & Style"
          fieldName="cta.rightSideMultimedia"
          defaultShow="image"
          showColorPicker
          colorLabel="Right section color"
          defaultColor="#FBF9F5"
          imageTitle="Side Image"
          imageLabel="Side image"
          imageFieldName="cmsContactCtaRightSectionImage"
          videoFieldName="cmsContactCtaRightSectionVideo"
          value={
            (sec as any).rightSideMultimedia ||
            content.rightSideMultimedia ||
            emptyCta.rightSideMultimedia
          }
          onChange={(multimedia) => updateField("rightSideMultimedia", multimedia)}
        />

        <div className="rounded-lg border border-border/70 bg-card p-3.5">
          <p className="mb-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            Call to Action (CTA) Buttons
          </p>

          <ButtonsField
            fieldName="cta.buttons"
            value={sec.buttons ?? content.buttons ?? emptyCta.buttons}
            onChange={(buttons) => updateField("buttons", buttons)}
          />
        </div>
      </div>
    </FormSection>
  )
}

export default CtaForm

