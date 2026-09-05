/* =====================================================
   REGION CHARACTER — FORM SECTION
===================================================== */

import {
  ColorField,
  DynamicStyledField,
  FormSection,
} from "../../shared/fields"
import { UniversalMultimediaForm } from "../../../CMS/shared/UniversalMultimediaForm"
import type { LocationData } from "../../locationTypes"
import { emptyLocation } from "../../shared/emptyLocation"

export type RegionCharacterFormProps = {
  draft: LocationData
  updateField: (path: string, value: unknown) => void
  openSections: Record<string, boolean>
  toggleSection: (section: string) => void
}

export function RegionCharacterForm({
  draft,
  updateField,
  openSections,
  toggleSection,
}: RegionCharacterFormProps) {
  const character = draft.data.regionCharacter ?? {
    label: "",
    title: "",
    items: [] as NonNullable<LocationData["data"]["regionCharacter"]>["items"],
  }
  const style =
    character.style ?? emptyLocation.data.regionCharacter?.style ?? {}
  const items = character.items ?? []

  const updateItem = (index: number, field: string, value: any) => {
    const next = [...items]
    next[index] = { ...next[index], [field]: value }
    updateField("data.regionCharacter.items", next)
  }

  return (
    <FormSection
      title="Region Character"
      active={!!openSections["region-character"]}
      onClick={() => toggleSection("region-character")}
    >
      <div className="space-y-4">
        <DynamicStyledField
          type="text"
          label="Label"
          value={character.label ?? ""}
          onChange={(value: string) =>
            updateField("data.regionCharacter.label", value)
          }
          enableStyle
          style={(character as any).labelStyle}
          onStyleChange={(style) =>
            updateField("data.regionCharacter.labelStyle", style)
          }
        />
        <DynamicStyledField
          type="text"
          label="Title"
          value={character.title ?? ""}
          onChange={(value: string) =>
            updateField("data.regionCharacter.title", value)
          }
          enableStyle
          style={(character as any).titleStyle}
          onStyleChange={(style) =>
            updateField("data.regionCharacter.titleStyle", style)
          }
        />
        <UniversalMultimediaForm
          section={character as any}
          content={character as Record<string, any>}
          updateSection={(patch) =>
            updateField("data.regionCharacter", { ...character, ...patch })
          }
          updateSectionContent={(patch) =>
            updateField("data.regionCharacter", { ...character, ...patch })
          }
          contentMediaKey="backgroundMultimedia"
          backgroundType={(character as any).backgroundMultimedia?.type}
          backgroundTypeStyleKey="locationRegionCharacterBackgroundTypeStyle"
          sectionTitle="Background"
          showColorPicker
          colorLabel="Background color"
          defaultColor="#FAF7F2"
          imageTitle="Background Image"
          imageLabel="Background image"
          imageFieldName="locationRegionCharacterBackgroundImage"
          videoTitle="Background Video"
          videoLabel="Background video"
          videoFieldName="locationRegionCharacterBackgroundVideo"
          showImageAltField
          showVideoSwitches
        />
        {items.map((item, index) => (
          <div
            key={`${item.id}-${index}`}
            className="space-y-4 rounded-xl border border-border/60 p-4"
          >
            <DynamicStyledField
              type="text"
              label="Icon (mountain, home, compass)"
              value={item.icon ?? ""}
              onChange={(value: string) => updateItem(index, "icon", value)}
            />
            <UniversalMultimediaForm
              section={item as any}
              content={item as any}
              updateSection={(patch) => {
                const media =
                  (patch as any).multimedia ||
                  (patch as any).iconMultimedia ||
                  patch
                const next = [...items]
                next[index] = {
                  ...next[index],
                  ...patch,
                  multimedia: media,
                  iconMultimedia: media,
                  iconImage: media?.image?.url || next[index].iconImage,
                }
                updateField("data.regionCharacter.items", next)
              }}
              updateSectionContent={(patch) => {
                const media =
                  (patch as any).multimedia ||
                  (patch as any).iconMultimedia ||
                  patch
                const next = [...items]
                next[index] = {
                  ...next[index],
                  ...patch,
                  multimedia: media,
                  iconMultimedia: media,
                  iconImage: media?.image?.url || next[index].iconImage,
                }
                updateField("data.regionCharacter.items", next)
              }}
              contentMediaKey="multimedia"
              backgroundType={
                item.multimedia?.type ||
                (item as any).iconMultimedia?.type ||
                "image"
              }
              sectionTitle="Pillar Icon / Media"
              imageTitle="Pillar Icon / Image"
              imageLabel="Pillar icon or image"
              imageFieldName={`pillar_${item.id || index}_media`}
              showImageAltField
              showColorPicker
              allowImage
              allowVideo
              showVideoSwitches
            />
            <DynamicStyledField
              type="text"
              label="Pillar Title"
              value={item.title ?? ""}
              onChange={(value: string) => updateItem(index, "title", value)}
              enableStyle
              style={(item as any).titleStyle}
              onStyleChange={(style) =>
                updateItem(index, "titleStyle" as any, style as any)
              }
            />
            <DynamicStyledField
              type="textarea"
              label="Description"
              value={item.description ?? ""}
              onChange={(value: string) =>
                updateItem(index, "description", value)
              }
              enableStyle
              style={(item as any).descriptionStyle}
              onStyleChange={(style) =>
                updateItem(index, "descriptionStyle" as any, style as any)
              }
            />
            <DynamicStyledField
              type="text"
              label="Link URL"
              value={item.href ?? ""}
              onChange={(value: string) => updateItem(index, "href", value)}
            />
            <DynamicStyledField
              type="text"
              label="Link Text"
              value={item.linkText ?? ""}
              onChange={(value: string) => updateItem(index, "linkText", value)}
            />
            <button
              type="button"
              className="text-[10px] font-medium text-destructive"
              onClick={() =>
                updateField(
                  "data.regionCharacter.items",
                  items.filter((_, itemIndex) => itemIndex !== index)
                )
              }
            >
              Remove pillar
            </button>
          </div>
        ))}
        <button
          type="button"
          className="text-left text-[10px] font-medium text-primary"
          onClick={() =>
            updateField("data.regionCharacter.items", [
              ...items,
              {
                id: String(Date.now()),
                icon: "mountain",
                iconImage: "",
                title: "",
                description: "",
                href: "",
                linkText: "Read More",
              },
            ])
          }
        >
          + Add pillar
        </button>
        <div className="space-y-4 border-t border-border/60 pt-4">
          <p className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
            Appearance
          </p>
          <ColorField
            label="Border Color"
            value={style.borderColor ?? ""}
            onChange={(value) =>
              updateField("data.regionCharacter.style.borderColor", value)
            }
          />
        </div>
      </div>
    </FormSection>
  )
}

export default RegionCharacterForm
