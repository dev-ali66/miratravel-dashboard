import type { HomeFormSectionProps } from "../../config/homeSections"
import { FormSection, DynamicStyledField } from "@/components/pages/CMS/shared/FormControls"
import { ButtonsField } from "@/components/pages/CMS/shared/ButtonsField"
import { UniversalMultimediaForm } from "@/components/pages/CMS/shared/UniversalMultimediaForm"
import { emptyDestinations } from "./emptyDestinations"

export function DestinationsForm({
  section,
  index,
  updateSection,
  openSections,
  toggleSection,
  sectionNumber,
}: HomeFormSectionProps) {
  const sec = section || {}
  const content = (sec.content ?? sec) as Record<string, any>
  const isOpen = Boolean(openSections["destinations"])

  const updateField = (fieldKey: string, value: any) => {
    updateSection(index, { [fieldKey]: value })
  }

  return (
    <FormSection
      title="Destinations Section"
      sectionNumber={sectionNumber}
      active={isOpen}
      onClick={() => toggleSection("destinations")}
    >
      <div className="flex flex-col gap-5">
        <div className="rounded-lg border border-border/70 bg-card p-3.5">
          <p className="mb-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            Section Header Content
          </p>

          <div className="flex flex-col gap-3">
            <DynamicStyledField
              type="text"
              label="Eyebrow"
              fieldName="destinations.eyebrow"
              placeholder="e.g. Destinations"
              value={sec.eyebrow ?? content.eyebrow}
              onChange={(value: any) => updateField("eyebrow", value)}
            />

            <DynamicStyledField
              type="textarea"
              rows={2}
              label="Title"
              fieldName="destinations.title"
              placeholder="e.g. Explore the countries that shape our journeys"
              value={sec.title ?? content.title}
              onChange={(value: any) => updateField("title", value)}
            />

            <DynamicStyledField
              type="textarea"
              label="Subtitle"
              fieldName="destinations.subtitle"
              placeholder="e.g. Discover rich cultures, breathtaking landscapes..."
              value={sec.subtitle ?? content.subtitle}
              onChange={(value: any) => updateField("subtitle", value)}
            />
          </div>
        </div>

        <UniversalMultimediaForm
          title="Background Media & Style"
          fieldName="destinations.backgroundMultimedia"
          defaultShow="color"
          showColorPicker
          colorLabel="Background color"
          defaultColor="#FFFFFF"
          imageFieldName="cmsHomeDestinationsBackgroundImage"
          videoFieldName="cmsHomeDestinationsBackgroundVideo"
          value={
            sec.backgroundMultimedia ||
            content.backgroundMultimedia ||
            emptyDestinations.backgroundMultimedia
          }
          onChange={(multimedia) => updateField("backgroundMultimedia", multimedia)}
        />

        <div className="rounded-lg border border-border/70 bg-card p-3.5">
          <p className="mb-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            Call to Action (CTA) Buttons
          </p>

          <ButtonsField
            fieldName="destinations.buttons"
            buttons={Array.isArray(sec.buttons) ? sec.buttons : Array.isArray(content.buttons) ? content.buttons : []}
            onChange={(buttons) => updateField("buttons", buttons)}
          />
        </div>
      </div>
    </FormSection>
  )
}

export default DestinationsForm
