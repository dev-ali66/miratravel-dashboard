import {
  FormSection,
  DynamicStyledField,
} from "@/components/pages/CMS/shared/FormControls"
import { UniversalMultimediaForm } from "@/components/pages/CMS/shared/UniversalMultimediaForm"
import type { NewsletterCmsFormSectionProps } from "../../newsletterCmsTypes"

export function NewsletterCmsHeroForm({
  draft,
  updateField,
  openSections,
  toggleSection,
  sectionNumber,
}: NewsletterCmsFormSectionProps) {
  const hero = draft?.hero || draft?.data?.hero || {}
  const isOpen = Boolean(openSections["hero"])

  const updateHeroField = (fieldKey: string, value: any) => {
    updateField(`hero.${fieldKey}`, value)
  }

  return (
    <FormSection
      title="Newsletter Subscribe Section"
      sectionNumber={sectionNumber}
      active={isOpen}
      onClick={() => toggleSection("hero")}
    >
      <div className="flex flex-col gap-5">
        {/* Title */}
        <DynamicStyledField
          type="textarea"
          rows={2}
          label="Subscribe Main Title"
          fieldName="hero.title"
          placeholder="e.g. A Curated Travel Perspective"
          value={hero.title}
          onChange={(val) => updateHeroField("title", val)}
          enableStyle
        />

        {/* Subtitle / Paragraph */}
        <DynamicStyledField
          type="textarea"
          rows={3}
          label="Subtitle / Introductory Paragraph"
          fieldName="hero.subtitle"
          placeholder="e.g. Thoughtful dispatches featuring curated Balkan travel inspiration..."
          value={hero.subtitle}
          onChange={(val) => updateHeroField("subtitle", val)}
          enableStyle
        />

        {/* Form Input Customization */}
        <div className="rounded-lg border border-border/70 bg-card p-3.5 flex flex-col gap-3">
          <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            Form Field Options
          </p>

          <DynamicStyledField
            type="text"
            label="Email Input Label"
            fieldName="hero.emailLabel"
            placeholder="e.g. Enter your email address"
            value={hero.emailLabel}
            onChange={(val) => updateHeroField("emailLabel", val)}
            enableStyle
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-muted-foreground">
                Input Placeholder Text
              </label>
              <input
                type="text"
                className="h-9 w-full rounded-md border border-input bg-background px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                value={hero.inputPlaceholder || ""}
                onChange={(e) => updateHeroField("inputPlaceholder", e.target.value)}
                placeholder="Insert your email here"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-muted-foreground">
                Submit Button Text
              </label>
              <input
                type="text"
                className="h-9 w-full rounded-md border border-input bg-background px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                value={hero.buttonText || ""}
                onChange={(e) => updateHeroField("buttonText", e.target.value)}
                placeholder="Subscribe"
              />
            </div>
          </div>
        </div>

        {/* Footer Navigation Links */}
        <div className="rounded-lg border border-border/70 bg-card p-3.5 flex flex-col gap-3">
          <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            Form Footer Links
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-muted-foreground">
                Left Link Label
              </label>
              <input
                type="text"
                className="h-9 w-full rounded-md border border-input bg-background px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                value={hero.links?.exploreJourneys?.label || ""}
                onChange={(e) =>
                  updateHeroField("links.exploreJourneys.label", e.target.value)
                }
                placeholder="Explore journeys"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-muted-foreground">
                Right Link Label
              </label>
              <input
                type="text"
                className="h-9 w-full rounded-md border border-input bg-background px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                value={hero.links?.returnHome?.label || ""}
                onChange={(e) =>
                  updateHeroField("links.returnHome.label", e.target.value)
                }
                placeholder="Return Home"
              />
            </div>
          </div>
        </div>

        {/* Side Image / Media */}
        <UniversalMultimediaForm
          title="Left Column Showcase Image"
          fieldName="hero.backgroundMultimedia"
          allowImage={true}
          allowVideo={true}
          allowColor={true}
          defaultShow="image"
          imageTitle="Showcase Image"
          imageLabel="Expedition Showcase Image"
          value={hero.backgroundMultimedia}
          onChange={(val) => {
            updateHeroField("backgroundMultimedia", val)
            if (val?.image?.url) {
              updateHeroField("image.url", val.image.url)
            }
          }}
        />
      </div>
    </FormSection>
  )
}

export default NewsletterCmsHeroForm
