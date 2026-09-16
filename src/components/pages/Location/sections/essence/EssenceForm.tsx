import { DynamicStyledField } from "@/components/pages/CMS/shared/FormControls"
import { UniversalMultimediaForm } from "@/components/pages/CMS/shared/UniversalMultimediaForm"
import { FormSection } from "../../shared/fields"
import type { LocationFormSectionProps } from "../../config/locationSections"

export function EssenceForm({
  draft,
  updateField,
  openSections,
  toggleSection,
}: LocationFormSectionProps) {
  const essence = draft?.essence || (draft as any)?.data?.essence || {}
  const isOpen = Boolean(openSections["essence"])

  const updateEssenceField = (fieldKey: string, value: any) => {
    updateField(`essence.${fieldKey}`, value)
  }

  // Handle rich-text or string paragraphs seamlessly
  const paragraphsValue = essence.paragraphs

  return (
    <FormSection
      title="03. Essence of Location"
      active={isOpen}
      onClick={() => toggleSection("essence")}
    >
      <div className="flex flex-col gap-5">
        {/* Eyebrow Label */}
        <DynamicStyledField
          type="text"
          label="Eyebrow / Category Tag"
          fieldName="essence.label"
          placeholder="e.g. THE ESSENCE OF ALBANIA"
          value={essence.label}
          onChange={(val) => updateEssenceField("label", val)}
        />

        {/* Main Heading / Title */}
        <DynamicStyledField
          type="text"
          label="Main Heading / Title"
          fieldName="essence.title"
          placeholder="e.g. A country that kept its secrets for fifty years"
          value={essence.title}
          onChange={(val) => updateEssenceField("title", val)}
        />

        {/* Editorial Story Paragraphs with Rich Text */}
        <DynamicStyledField
          type="richtext"
          label="Story Paragraphs / Editorial Text"
          fieldName="essence.paragraphs"
          placeholder="Write the editorial narrative paragraphs for the essence section..."
          value={paragraphsValue}
          onChange={(val) => updateEssenceField("paragraphs", val)}
        />

        {/* Editorial Quote / Callout */}
        <DynamicStyledField
          type="textarea"
          label="Editorial Highlight Quote"
          fieldName="essence.quote"
          placeholder="e.g. You arrive with no preconceptions and leave with stories nobody else has told."
          value={essence.quote}
          onChange={(val) => updateEssenceField("quote", val)}
        />

        {/* Featured Image / Multimedia on the Right */}
        <UniversalMultimediaForm
          title="Featured Essence Media (Right Side Card)"
          fieldName="essence.imageMultimedia"
          imageFieldName="locationEssenceImage"
          videoFieldName="locationEssenceVideo"
          value={essence.imageMultimedia || essence.multimedia}
          onChange={(multimedia) => updateEssenceField("imageMultimedia", multimedia)}
        />

        {/* Overlay Stat Badge (Absolute Badge on the Image) */}
        {(() => {
          const stat = essence.stat || {}
          const statValue = stat.statValue ?? stat.value ?? essence.statValue
          const statLabel = stat.statLabel ?? stat.label ?? essence.statLabel
          const statBadgeBg =
            stat.statBadgeBg ??
            stat.badgeBg ??
            (typeof statValue === "object" ? statValue?.backgroundColor : null) ||
            essence.statBadgeBg ||
            "#B86B3A"

          const updateStatField = (key: string, val: any) => {
            const currentStat = essence.stat || {}
            updateEssenceField("stat", {
              ...currentStat,
              [key]: val,
            })
          }

          return (
            <div className="rounded-lg border border-border/70 bg-card p-4">
              <div className="mb-3 flex items-center justify-between">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Absolute Image Stat Badge
                </h4>
                <span className="rounded bg-[#B86B3A]/20 px-2 py-0.5 text-[10px] font-medium text-[#B86B3A]">
                  Overlaid on Media
                </span>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <DynamicStyledField
                  type="text"
                  label="Stat Value"
                  fieldName="essence.stat.statValue"
                  placeholder="e.g. 50+"
                  value={statValue}
                  onChange={(val) => updateStatField("statValue", val)}
                />

                <DynamicStyledField
                  type="text"
                  label="Stat Label / Unit"
                  fieldName="essence.stat.statLabel"
                  placeholder="e.g. Countries & Sovereign Territories"
                  value={statLabel}
                  onChange={(val) => updateStatField("statLabel", val)}
                />
              </div>

              <div className="mt-4 pt-3 border-t border-border/50">
                <DynamicStyledField
                  type="color"
                  label="Badge Background Color"
                  fieldName="essence.stat.statBadgeBg"
                  placeholder="#B86B3A"
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

        {/* Universal Background Media for the Entire Section */}
        <UniversalMultimediaForm
          title="Section Background Media"
          fieldName="essence.backgroundMultimedia"
          imageFieldName="locationEssenceBackgroundImage"
          videoFieldName="locationEssenceBackgroundVideo"
          value={essence.backgroundMultimedia}
          onChange={(multimedia) => updateEssenceField("backgroundMultimedia", multimedia)}
        />
      </div>
    </FormSection>
  )
}

export default EssenceForm
