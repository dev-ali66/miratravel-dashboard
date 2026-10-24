import { THEME_COLORS } from "@/config/theme"
import { DynamicStyledField } from "@/components/pages/CMS/shared/FormControls"
import { UniversalMultimediaForm } from "@/components/pages/CMS/shared/UniversalMultimediaForm"
import { FormSection } from "@/components/pages/Location/shared/fields"
import type { ExperienceFormSectionProps } from "../../config/experienceSections"
import { emptyEssence } from "../../shared/emptyExperience"

export function EssenceForm({
  draft,
  updateField,
  openSections,
  toggleSection,
  sectionNumber,
}: ExperienceFormSectionProps) {
  const essence = draft?.essence || {}
  const isOpen = Boolean(openSections["essence"])

  const updateEssenceField = (fieldKey: string, value: any) => {
    updateField(`essence.${fieldKey}`, value)
  }

  return (
    <FormSection
      title="Essence & Highlight Narrative"
      sectionNumber={sectionNumber}
      active={isOpen}
      onClick={() => toggleSection("essence")}
    >
      <div className="flex flex-col gap-5">
        {/* Eyebrow Label */}
        <DynamicStyledField
          type="text"
          label="Eyebrow / Tag"
          fieldName="essence.label"
          placeholder="e.g. THE SOUL OF THE EXPEDITION"
          value={essence.label}
          onChange={(val) => updateEssenceField("label", val)}
        />

        {/* Main Heading / Title */}
        <DynamicStyledField
          type="text"
          label="Main Heading / Title"
          fieldName="essence.title"
          placeholder="e.g. Uncharted valleys, private alpine landings, and timeless quiet"
          value={essence.title}
          onChange={(val) => updateEssenceField("title", val)}
        />

        {/* Editorial Story Paragraphs with Rich Text */}
        <DynamicStyledField
          type="richtext"
          label="Story Paragraphs / Narrative"
          fieldName="essence.paragraphs"
          placeholder="Describe the atmosphere, exclusivity, and moments of this experience..."
          value={essence.paragraphs}
          onChange={(val) => updateEssenceField("paragraphs", val)}
        />

        {/* Editorial Quote */}
        <DynamicStyledField
          type="textarea"
          label="Editorial Highlight Quote"
          fieldName="essence.quote"
          placeholder="e.g. In the stillness between mountain ridges, time ceases to exist."
          value={essence.quote}
          onChange={(val) => updateEssenceField("quote", val)}
        />

        {/* Featured Image / Media */}
        <UniversalMultimediaForm
          title="Featured Experience Media (Right Side Card)"
          fieldName="essence.imageMultimedia"
          imageFieldName="experienceEssenceImage"
          videoFieldName="experienceEssenceVideo"
          value={essence.imageMultimedia || essence.multimedia || emptyEssence.imageMultimedia}
          onChange={(multimedia) => updateEssenceField("imageMultimedia", multimedia)}
        />

        {/* Overlay Stat Badge */}
        {(() => {
          const stat = (essence.stat || {}) as Record<string, any>
          const statValue = stat.statValue ?? stat.value ?? essence.statValue
          const statLabel = stat.statLabel ?? stat.label ?? essence.statLabel
          const statBadgeBg =
            (stat.statBadgeBg ??
            stat.badgeBg ??
            (typeof statValue === "object" ? statValue?.backgroundColor : null)) ||
            essence.statBadgeBg || THEME_COLORS.accentMuted

          const updateStatField = (key: string, val: any) => {
            const currentStat = (essence.stat || {}) as Record<string, any>
            updateEssenceField("stat", {
              ...currentStat,
              [key]: val,
            })
          }

          return (
            <div className="rounded-lg border border-border/70 bg-card p-4">
              <div className="mb-3 flex items-center justify-between">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Media Stat Highlight Badge
                </h4>
                <span className="rounded bg-accent-muted/20 px-2 py-0.5 text-[10px] font-medium text-accent-muted">
                  Overlaid on Media
                </span>
              </div>

              <div className="flex flex-col gap-4">
                <DynamicStyledField
                  type="text"
                  label="Stat Value"
                  fieldName="essence.stat.statValue"
                  placeholder="e.g. 2,400m"
                  value={statValue}
                  onChange={(val) => updateStatField("statValue", val)}
                />

                <DynamicStyledField
                  type="text"
                  label="Stat Label / Caption"
                  fieldName="essence.stat.statLabel"
                  placeholder="e.g. Peak Elevation Reached"
                  value={statLabel}
                  onChange={(val) => updateStatField("statLabel", val)}
                />
              </div>

              <div className="mt-4 pt-3 border-t border-border/50">
                <DynamicStyledField
                  type="color"
                  label="Badge Background Color"
                  fieldName="essence.stat.statBadgeBg"
                  placeholder="#E5A84B"
                  value={statBadgeBg}
                  onChange={(val) => {
                    updateStatField("statBadgeBg", val)
                    if (typeof statValue === "object" && statValue !== null) {
                      updateStatField("statValue", { ...statValue, backgroundColor: val })
                    }
                  }}
                />
              </div>
            </div>
          )
        })()}

        {/* Universal Background Media */}
        <UniversalMultimediaForm
          title="Section Background Media"
          fieldName="essence.backgroundMultimedia"
          imageFieldName="experienceEssenceBackgroundImage"
          videoFieldName="experienceEssenceBackgroundVideo"
          value={essence.backgroundMultimedia || emptyEssence.backgroundMultimedia}
          onChange={(multimedia) => updateEssenceField("backgroundMultimedia", multimedia)}
        />
      </div>
    </FormSection>
  )
}

export default EssenceForm
