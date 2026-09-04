/* =====================================================
   REGION GLANCE — FORM SECTION
   Card content is static demo content in the preview and
   intentionally has no CMS fields.
===================================================== */

import { ColorField, Field, FormSection } from "../../shared/fields"
import type { LocationData } from "../../locationTypes"
import { emptyLocation } from "../../shared/emptyLocation"

export type RegionGlanceFormProps = {
    draft: LocationData
    updateField: (path: string, value: unknown) => void
    openSections: Record<string, boolean>
    toggleSection: (section: string) => void
}

export function RegionGlanceForm({
    draft,
    updateField,
    openSections,
    toggleSection,
}: RegionGlanceFormProps) {
    const glance = {
        ...emptyLocation.data.regionGlance,
        ...draft.data.regionGlance,
    }
    const style = glance.style ?? {}

    return (
        <FormSection
            title="Region Glance"
            active={!!openSections["region-glance"]}
            onClick={() => toggleSection("region-glance")}
        >
            <div className="space-y-4">
                <Field
                    label="Label"
                    value={glance.label}
                    onChange={(value) => updateField("data.regionGlance.label", value)}
                />
                <Field
                    label="Title"
                    value={glance.title}
                    onChange={(value) => updateField("data.regionGlance.title", value)}
                />
                <Field
                    label="Description"
                    value={glance.description}
                    multiline
                    onChange={(value) => updateField("data.regionGlance.description", value)}
                />

                <div className="space-y-4 border-t border-border/60 pt-4">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                        Appearance
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                        <ColorField
                            label="Section Background"
                            value={style.backgroundColor ?? ""}
                            onChange={(value) => updateField("data.regionGlance.style.backgroundColor", value)}
                        />
                        <ColorField
                            label="Label Color"
                            value={style.labelTextColor ?? ""}
                            onChange={(value) => updateField("data.regionGlance.style.labelTextColor", value)}
                        />
                        <ColorField
                            label="Title Color"
                            value={style.titleTextColor ?? ""}
                            onChange={(value) => updateField("data.regionGlance.style.titleTextColor", value)}
                        />
                        <ColorField
                            label="Description Color"
                            value={style.descriptionTextColor ?? ""}
                            onChange={(value) => updateField("data.regionGlance.style.descriptionTextColor", value)}
                        />
                    </div>
                </div>
            </div>
        </FormSection>
    )
}

export default RegionGlanceForm
