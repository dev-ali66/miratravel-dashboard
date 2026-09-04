/* =====================================================
   REGION CHARACTER — FORM SECTION
===================================================== */

import { ColorField, Field, FormSection, ImageField } from "../../shared/fields"
import type { LocationData } from "../../locationTypes"
import { emptyLocation } from "../../shared/emptyLocation"

export type RegionCharacterFormProps = {
    draft: LocationData
    updateField: (path: string, value: unknown) => void
    openSections: Record<string, boolean>
    toggleSection: (section: string) => void
}

export function RegionCharacterForm({ draft, updateField, openSections, toggleSection }: RegionCharacterFormProps) {
    const character = draft.data.regionCharacter ?? {
        label: "",
        title: "",
        items: [] as NonNullable<LocationData["data"]["regionCharacter"]>["items"],
    }
    const style = character.style ?? emptyLocation.data.regionCharacter?.style ?? {}
    const items = character.items ?? []

    const updateItem = (index: number, field: "icon" | "iconImage" | "title" | "description" | "href" | "linkText", value: string) => {
        const next = [...items]
        next[index] = { ...next[index], [field]: value }
        updateField("data.regionCharacter.items", next)
    }

    return (
        <FormSection title="Region Character" active={!!openSections["region-character"]} onClick={() => toggleSection("region-character")}>
            <div className="space-y-4">
                <Field label="Label" value={character.label} onChange={(value) => updateField("data.regionCharacter.label", value)} />
                <Field label="Title" value={character.title} onChange={(value) => updateField("data.regionCharacter.title", value)} />
                {items.map((item, index) => (
                    <div key={`${item.id}-${index}`} className="space-y-3 rounded-lg border border-border/60 p-3">
                        <Field label="Icon (mountain, home, compass)" value={item.icon} onChange={(value) => updateItem(index, "icon", value)} />
                        <ImageField label="Icon Image" value={item.iconImage} onChange={(value) => updateItem(index, "iconImage", value)} />
                        <Field label="Pillar Title" value={item.title} onChange={(value) => updateItem(index, "title", value)} />
                        <Field label="Description" value={item.description} multiline onChange={(value) => updateItem(index, "description", value)} />
                        <Field label="Link URL" value={item.href} onChange={(value) => updateItem(index, "href", value)} />
                        <Field label="Link Text" value={item.linkText} onChange={(value) => updateItem(index, "linkText", value)} />
                        <button type="button" className="text-[10px] font-medium text-destructive" onClick={() => updateField("data.regionCharacter.items", items.filter((_, itemIndex) => itemIndex !== index))}>Remove pillar</button>
                    </div>
                ))}
                <button type="button" className="text-left text-[10px] font-medium text-primary" onClick={() => updateField("data.regionCharacter.items", [...items, { id: String(Date.now()), icon: "mountain", iconImage: "", title: "", description: "", href: "", linkText: "Read More" }])}>+ Add pillar</button>
                <div className="space-y-4 border-t border-border/60 pt-4">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Appearance</p>
                    <div className="grid grid-cols-2 gap-3">
                        <ColorField label="Background Color" value={style.backgroundColor ?? ""} onChange={(value) => updateField("data.regionCharacter.style.backgroundColor", value)} />
                        <ColorField label="Border Color" value={style.borderColor ?? ""} onChange={(value) => updateField("data.regionCharacter.style.borderColor", value)} />
                        <ColorField label="Label Color" value={style.labelTextColor ?? ""} onChange={(value) => updateField("data.regionCharacter.style.labelTextColor", value)} />
                        <ColorField label="Title Color" value={style.titleTextColor ?? ""} onChange={(value) => updateField("data.regionCharacter.style.titleTextColor", value)} />
                        <ColorField label="Description Color" value={style.descriptionTextColor ?? ""} onChange={(value) => updateField("data.regionCharacter.style.descriptionTextColor", value)} />
                        <ColorField label="Icon Color" value={style.iconColor ?? ""} onChange={(value) => updateField("data.regionCharacter.style.iconColor", value)} />
                        <ColorField label="Hover Background" value={style.hoverBackgroundColor ?? ""} onChange={(value) => updateField("data.regionCharacter.style.hoverBackgroundColor", value)} />
                        <ColorField label="Link Color" value={style.linkTextColor ?? ""} onChange={(value) => updateField("data.regionCharacter.style.linkTextColor", value)} />
                    </div>
                </div>
            </div>
        </FormSection>
    )
}

export default RegionCharacterForm
