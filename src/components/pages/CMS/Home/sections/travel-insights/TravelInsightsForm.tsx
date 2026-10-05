import type { HomeFormSectionProps } from "../../config/homeSections"
import { FormSection, DynamicStyledField } from "@/components/pages/CMS/shared/FormControls"
import { ButtonsField } from "@/components/pages/CMS/shared/ButtonsField"
import { UniversalMultimediaForm } from "@/components/pages/CMS/shared/UniversalMultimediaForm"
import { emptyTravelInsights } from "./emptyTravelInsights"

export function TravelInsightsForm({
  section,
  index,
  updateSection,
  updateSectionButtons,
  openSections,
  toggleSection,
  sectionNumber,
}: HomeFormSectionProps) {
  const content = (section.content ?? {}) as any
  const isOpen = Boolean(openSections["travel_insights"] || openSections["travel-insights"])

  return (
    <FormSection
      title="Travel Insights Section"
      sectionNumber={sectionNumber}
      active={isOpen}
      onClick={() => toggleSection("travel_insights")}
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
              value={section.eyebrow ?? content.eyebrow ?? emptyTravelInsights.eyebrow}
              onChange={(val: any) => updateSection(index, { eyebrow: val })}
              enableStyle
            />

            <DynamicStyledField
              type="textarea"
              rows={2}
              label="Title"
              value={section.title ?? content.title ?? emptyTravelInsights.title}
              onChange={(val: any) => updateSection(index, { title: val })}
              enableStyle
            />

            <DynamicStyledField
              type="textarea"
              rows={3}
              label="Subtitle / Description"
              value={section.subtitle ?? content.subtitle ?? section.description ?? content.description ?? emptyTravelInsights.subtitle}
              onChange={(val: any) =>
                updateSection(index, {
                  subtitle: val,
                  description: val,
                })
              }
              enableStyle
            />
          </div>
        </div>

        <UniversalMultimediaForm
          title="Background Media & Style"
          fieldName="travel_insights.backgroundMultimedia"
          defaultShow="color"
          showColorPicker
          colorLabel="Background color"
          defaultColor="#FBF9F5"
          imageFieldName="cmsHomeTravelInsightsBackgroundImage"
          videoFieldName="cmsHomeTravelInsightsBackgroundVideo"
          value={
            (section as any).backgroundMultimedia ||
            content.backgroundMultimedia ||
            emptyTravelInsights.backgroundMultimedia
          }
          onChange={(multimedia) => updateSection(index, { backgroundMultimedia: multimedia })}
        />

        <div className="rounded-lg border border-border/70 bg-card p-3.5">
          <p className="mb-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            Call to Action (CTA) Buttons
          </p>

          <ButtonsField
            value={section.buttons ?? []}
            onChange={(buttons: any[]) => updateSectionButtons(index, buttons)}
          />
        </div>
      </div>
    </FormSection>
  )
}
