import type { HomeFormSectionProps } from "../../config/homeSections"
import { FormSection, DynamicStyledField } from "@/components/pages/CMS/shared/FormControls"
import { UniversalMultimediaForm } from "@/components/pages/CMS/shared/UniversalMultimediaForm"
import { emptyWhyMira } from "./emptyWhyMira"

export function WhyMiraForm({
  section,
  index,
  updateSection,
  openSections,
  toggleSection,
  sectionNumber,
}: HomeFormSectionProps) {
  const content = (section.content ?? {}) as any
  const isOpen = Boolean(openSections["why_mira"] || openSections["why-mira"])

  return (
    <FormSection
      title="Why Mira Section"
      sectionNumber={sectionNumber}
      active={isOpen}
      onClick={() => toggleSection("why_mira")}
    >
      <div className="flex flex-col gap-5">
        <div className="rounded-lg border border-border/70 bg-card p-3.5">
          <p className="mb-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            Section Header, Description & Signature
          </p>

          <div className="flex flex-col gap-3">
            <DynamicStyledField
              type="text"
              label="Eyebrow"
              value={section.eyebrow ?? content.eyebrow ?? emptyWhyMira.eyebrow}
              onChange={(val: any) => updateSection(index, { eyebrow: val })}
              enableStyle
            />

            <DynamicStyledField
              type="textarea"
              rows={2}
              label="Title"
              value={section.title ?? content.title ?? emptyWhyMira.title}
              onChange={(val: any) => updateSection(index, { title: val })}
              enableStyle
            />

            <DynamicStyledField
              type="richtext"
              label="Editorial Description (Rich Text)"
              value={section.description ?? content.description ?? emptyWhyMira.description}
              onChange={(val: any) => updateSection(index, { description: val })}
              enableStyle
            />

            <DynamicStyledField
              type="text"
              label="Signature Text"
              value={section.signature ?? content.signature ?? emptyWhyMira.signature}
              onChange={(val: any) => updateSection(index, { signature: val })}
              enableStyle
            />
          </div>
        </div>

        <UniversalMultimediaForm
          title="Background Media & Style"
          fieldName="why_mira.backgroundMultimedia"
          defaultShow="color"
          showColorPicker
          colorLabel="Background color"
          defaultColor="#182D09"
          imageFieldName="cmsHomeWhyMiraBackgroundImage"
          videoFieldName="cmsHomeWhyMiraBackgroundVideo"
          value={
            (section as any).backgroundMultimedia ||
            content.backgroundMultimedia ||
            emptyWhyMira.backgroundMultimedia
          }
          onChange={(multimedia) => updateSection(index, { backgroundMultimedia: multimedia })}
        />

        <UniversalMultimediaForm
          title="Right Section Media & Style"
          fieldName="why_mira.rightSideMultimedia"
          defaultShow="image"
          showColorPicker
          colorLabel="Right section color"
          defaultColor="#FBF9F5"
          imageTitle="Side Image"
          imageLabel="Side image"
          imageFieldName="cmsHomeWhyMiraRightSectionImage"
          videoFieldName="cmsHomeWhyMiraRightSectionVideo"
          value={
            (section as any).rightSideMultimedia ||
            content.rightSideMultimedia ||
            emptyWhyMira.rightSideMultimedia
          }
          onChange={(multimedia) => updateSection(index, { rightSideMultimedia: multimedia })}
        />
      </div>
    </FormSection>
  )
}
