import { DynamicStyledField } from "@/components/pages/CMS/shared/FormControls"
import { UniversalMultimediaForm } from "@/components/pages/CMS/shared/UniversalMultimediaForm"
import { FormSection } from "@/components/pages/Location/shared/fields"
import type { ExperienceFormSectionProps } from "../../config/experienceSections"
import { emptyMiraTouch } from "../../shared/emptyExperience"
import { Plus, Trash2, Award } from "lucide-react"

export function MiraTouchForm({
  draft,
  updateField,
  openSections,
  toggleSection,
  sectionNumber,
}: ExperienceFormSectionProps) {
  const miraTouch = draft?.miraTouch || emptyMiraTouch
  const isOpen = Boolean(openSections["mira-touch"])
  const items = Array.isArray(miraTouch.items) ? miraTouch.items : emptyMiraTouch.items

  const updateTouchField = (fieldKey: string, value: any) => {
    updateField(`miraTouch.${fieldKey}`, value)
  }

  const handleAddItem = () => {
    const newItem = {
      title: {
        value: "",
        textColor: "#182d09",
        textOpacity: 1,
        backgroundColor: null,
        backgroundOpacity: 1,
      },
      description: {
        value: "",
        textColor: "#565e69",
        textOpacity: 1,
        backgroundColor: null,
        backgroundOpacity: 1,
      },
    }
    updateTouchField("items", [...items, newItem])
  }

  const handleRemoveItem = (index: number) => {
    const nextItems = items.filter((_, i) => i !== index)
    updateTouchField("items", nextItems)
  }

  const handleUpdateItem = (index: number, key: "title" | "description", val: any) => {
    const nextItems = [...items]
    nextItems[index] = {
      ...nextItems[index],
      [key]: val,
    }
    updateTouchField("items", nextItems)
  }

  return (
    <FormSection
      title="The MIRA Touch (Distinctive Insider Elements)"
      sectionNumber={sectionNumber}
      active={isOpen}
      onClick={() => toggleSection("mira-touch")}
    >
      <div className="flex flex-col gap-5">
        <p className="text-xs text-muted-foreground">
          Highlight what elevates this experience: private access, master hosts, bespoke flexibility, or thoughtful MIRA amenities.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DynamicStyledField
            type="text"
            label="Section Eyebrow / Label"
            fieldName="miraTouch.label"
            placeholder="e.g. THE MIRA TOUCH"
            value={miraTouch.label}
            onChange={(val) => updateTouchField("label", val)}
          />

          <DynamicStyledField
            type="text"
            label="Section Headline"
            fieldName="miraTouch.title"
            placeholder="e.g. Distinction, Privacy & Insider Access"
            value={miraTouch.title}
            onChange={(val) => updateTouchField("title", val)}
          />
        </div>

        <DynamicStyledField
          type="textarea"
          label="Philosophy / Narrative Description"
          fieldName="miraTouch.description"
          placeholder="Describe how MIRA crafts this experience differently from conventional tourism..."
          value={miraTouch.description}
          onChange={(val) => updateTouchField("description", val)}
        />

        {/* Distinctive Elements Repeater */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <Award className="h-3.5 w-3.5 text-primary" />
              Distinctive Elements ({items.length})
            </span>

            <button
              type="button"
              onClick={handleAddItem}
              className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary hover:bg-primary/20 transition-colors cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Touch
            </button>
          </div>

          <div className="flex flex-col gap-3">
            {items.map((item, idx) => (
              <div
                key={idx}
                className="flex flex-col gap-3 rounded-xl border border-border/70 bg-card p-3.5 shadow-2xs relative"
              >
                <div className="flex items-center justify-between border-b border-border/50 pb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-primary">
                    Touch 0{idx + 1}
                  </span>

                  {items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(idx)}
                      className="rounded p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>

                <DynamicStyledField
                  type="text"
                  label="Title"
                  fieldName={`miraTouch.items.${idx}.title`}
                  placeholder="e.g. Behind-the-scenes access"
                  value={item.title}
                  onChange={(val) => handleUpdateItem(idx, "title", val)}
                />

                <DynamicStyledField
                  type="textarea"
                  label="Description"
                  fieldName={`miraTouch.items.${idx}.description`}
                  placeholder="Explain why this touch is special..."
                  value={item.description}
                  onChange={(val) => handleUpdateItem(idx, "description", val)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Visual Media */}
        <UniversalMultimediaForm
          title="The MIRA Touch Image / Visual"
          fieldName="miraTouch.imageMultimedia"
          imageFieldName="miraTouchImage"
          videoFieldName="miraTouchVideo"
          value={miraTouch.imageMultimedia || emptyMiraTouch.imageMultimedia}
          onChange={(multimedia) => updateTouchField("imageMultimedia", multimedia)}
        />
      </div>
    </FormSection>
  )
}

export default MiraTouchForm
