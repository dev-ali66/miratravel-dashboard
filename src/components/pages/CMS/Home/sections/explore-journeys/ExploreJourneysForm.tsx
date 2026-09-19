import type { HomeFormSectionProps } from "../../config/homeSections"
import { FormSection, DynamicStyledField } from "@/components/pages/CMS/shared/FormControls"
import { ButtonsField } from "@/components/pages/CMS/shared/ButtonsField"
import { UniversalMultimediaForm } from "@/components/pages/CMS/shared/UniversalMultimediaForm"
import { emptyExploreJourneys } from "./emptyExploreJourneys"

export function ExploreJourneysForm({
  section,
  index,
  updateSectionContent,
  openSections,
  toggleSection,
  sectionNumber,
}: HomeFormSectionProps) {
  const sec = section || {}
  const content = (sec.content ?? sec) as Record<string, any>
  const isOpen = Boolean(openSections["explore_journeys"] || openSections["explore-journeys"])

  const updateField = (fieldKey: string, value: any) => {
    updateSectionContent(index, { [fieldKey]: value })
  }

  return (
    <FormSection
      title="Explore Journeys"
      sectionNumber={sectionNumber}
      active={isOpen}
      onClick={() => toggleSection("explore_journeys")}
    >
      <div className="flex flex-col gap-5">
        <div className="rounded-lg border border-border/70 bg-card p-3.5">
          <p className="mb-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            Section Header & Description
          </p>

          <div className="flex flex-col gap-3">
            <DynamicStyledField
              type="text"
              label="Eyebrow"
              fieldName="explore_journeys.eyebrow"
              placeholder="e.g. Journeys"
              value={sec.eyebrow ?? content.eyebrow}
              onChange={(value: any) => updateField("eyebrow", value)}
            />

            <DynamicStyledField
              type="textarea"
              rows={2}
              label="Title"
              fieldName="explore_journeys.title"
              placeholder="e.g. Explore Our Journeys"
              value={sec.title ?? content.title}
              onChange={(value: any) => updateField("title", value)}
            />

            <DynamicStyledField
              type="text"
              label="Subtitle"
              fieldName="explore_journeys.subtitle"
              placeholder="e.g. Find the journey that matches the way you want to travel."
              value={sec.subtitle ?? content.subtitle}
              onChange={(value: any) => updateField("subtitle", value)}
            />

            <DynamicStyledField
              type="textarea"
              rows={3}
              label="Description"
              fieldName="explore_journeys.description"
              placeholder="Write the introduction description paragraph..."
              value={sec.description ?? content.description}
              onChange={(value: any) => updateField("description", value)}
            />
          </div>
        </div>

        <UniversalMultimediaForm
          title="Background Media & Style"
          fieldName="explore_journeys.backgroundMultimedia"
          defaultShow="color"
          showColorPicker
          colorLabel="Background color"
          defaultColor="#FBF9F5"
          imageFieldName="cmsHomeExploreJourneysBackgroundImage"
          videoFieldName="cmsHomeExploreJourneysBackgroundVideo"
          value={
            sec.backgroundMultimedia ||
            content.backgroundMultimedia ||
            emptyExploreJourneys.backgroundMultimedia
          }
          onChange={(multimedia) => updateField("backgroundMultimedia", multimedia)}
        />

        <div className="rounded-lg border border-border/70 bg-card p-3.5">
          <p className="mb-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            Call to Action (CTA) Buttons
          </p>

          <ButtonsField
            fieldName="explore_journeys.buttons"
            buttons={Array.isArray(sec.buttons) ? sec.buttons : Array.isArray(content.buttons) ? content.buttons : []}
            onChange={(buttons) => updateField("buttons", buttons)}
          />
        </div>
      </div>
    </FormSection>
  )
}

export default ExploreJourneysForm
