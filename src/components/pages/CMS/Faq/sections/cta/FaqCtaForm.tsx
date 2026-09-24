import {
  FormSection,
  DynamicStyledField,
} from "@/components/pages/CMS/shared/FormControls"
import { ButtonsField } from "@/components/pages/CMS/shared/ButtonsField"
import { UniversalMultimediaForm } from "@/components/pages/CMS/shared/UniversalMultimediaForm"
import { emptyFaqCta } from "../../config/emptyFaqPayload"

export interface FaqCtaFormProps {
  section: any
  index: number
  updateSection: (index: number, patch: Record<string, any>) => void
  openSections: Record<string, boolean>
  toggleSection: (key: string) => void
  sectionNumber: number
}

export function FaqCtaForm({
  section,
  index,
  updateSection,
  openSections,
  toggleSection,
  sectionNumber,
}: FaqCtaFormProps) {
  const cta = (section || {}) as Record<string, any>
  const isOpen = Boolean(openSections["cta"])

  const updateCtaField = (fieldKey: string, value: any) => {
    updateSection(index, { [fieldKey]: value })
  }

  return (
    <FormSection
      title="A Note from Mira (Bottom CTA Section)"
      sectionNumber={sectionNumber}
      active={isOpen}
      onClick={() => toggleSection("cta")}
    >
      <div className="flex flex-col gap-5">
        {/* Section Header & Typography */}
        <div className="rounded-lg border border-border/70 bg-card p-3.5">
          <p className="mb-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            Section Header & Typography
          </p>

          <div className="flex flex-col gap-3">
            {/* Eyebrow */}
            <DynamicStyledField
              type="text"
              label="Eyebrow Tag"
              fieldName="cta.eyebrow"
              placeholder="e.g. A NOTE FROM MIRA"
              value={cta.eyebrow ?? emptyFaqCta.eyebrow}
              onChange={(val) => updateCtaField("eyebrow", val)}
              enableStyle
            />

            {/* Title */}
            <DynamicStyledField
              type="richtext"
              label="Title"
              fieldName="cta.title"
              placeholder="e.g. Not every question has a standard answer."
              value={cta.title ?? emptyFaqCta.title}
              onChange={(val) => updateCtaField("title", val)}
              enableStyle
            />

            {/* Note / Description Text */}
            <DynamicStyledField
              type="richtext"
              label="Editorial Note / Description"
              fieldName="cta.description"
              placeholder="Not every question has a standard answer. Travel rarely fits neatly into a FAQ..."
              value={cta.description ?? emptyFaqCta.description}
              onChange={(val) => updateCtaField("description", val)}
              enableStyle
            />
          </div>
        </div>

        {/* Background Media & Style */}
        <UniversalMultimediaForm
          title="Background Media & Style"
          fieldName="cta.backgroundMultimedia"
          defaultShow="color"
          showColorPicker
          colorLabel="Background color"
          defaultColor="#101912"
          imageFieldName="cmsFaqCtaBackgroundImage"
          videoFieldName="cmsFaqCtaBackgroundVideo"
          value={
            cta.backgroundMultimedia || emptyFaqCta.backgroundMultimedia
          }
          onChange={(multimedia) =>
            updateCtaField("backgroundMultimedia", multimedia)
          }
        />

        {/* Side Image / Media & Style */}
        <UniversalMultimediaForm
          title="Side Media / Card Image"
          fieldName="cta.rightSideMultimedia"
          defaultShow="image"
          showColorPicker
          colorLabel="Side media color"
          defaultColor="#101912"
          imageTitle="Side Image"
          imageLabel="Side image"
          imageFieldName="cmsFaqWhyMiraImage"
          videoFieldName="cmsFaqWhyMiraVideo"
          value={
            cta.rightSideMultimedia ||
            cta.imageMultimedia ||
            emptyFaqCta.rightSideMultimedia
          }
          onChange={(multimedia) => {
            updateCtaField("rightSideMultimedia", multimedia)
            updateCtaField("imageMultimedia", multimedia) // keep alias synced
          }}
        />

        {/* CTA Buttons */}
        <div className="rounded-lg border border-border/70 bg-card p-3.5">
          <p className="mb-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            Call to Action (CTA) Buttons
          </p>

          <ButtonsField
            fieldName="cta.buttons"
            buttons={Array.isArray(cta.buttons) && cta.buttons.length > 0 ? cta.buttons : emptyFaqCta.buttons}
            onChange={(buttons) => {
              updateCtaField("buttons", buttons)
            }}
          />
        </div>
      </div>
    </FormSection>
  )
}

export default FaqCtaForm
