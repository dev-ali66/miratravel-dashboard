/* =====================================================
   SHARED INFO — FORM SECTION
   Simple form to edit shared info text used by previews.
===================================================== */

import { ColorField, Field, FormSection } from "./fields"
import type { LocationData } from "../locationTypes"

export type SharedInfoFormProps = {
  draft: LocationData
  updateField: (path: string, value: unknown) => void
  openSections: Record<string, boolean>
  toggleSection: (section: string) => void
}

export function SharedInfoForm({ draft, updateField, openSections, toggleSection }: SharedInfoFormProps) {
  return (
    <FormSection title="Shared Info" active={!!openSections["shared-info"]} onClick={() => toggleSection("shared-info")}>
      <div className="space-y-4">
        <Field
          label="Text"
          value={draft.data.sharedInfo?.text || "Add shared info details here."}
          multiline
          onChange={(value) => updateField("data.sharedInfo.text", value)}
        />

        <div className="grid grid-cols-2 gap-3">
          <ColorField
            label="Background Color"
            value={draft.data.sharedInfo?.style?.backgroundColor ?? ""}
            onChange={(value) =>
              updateField("data.sharedInfo.style.backgroundColor", value)
            }
          />

          <ColorField
            label="Text Color"
            value={draft.data.sharedInfo?.style?.textColor ?? ""}
            onChange={(value) =>
              updateField("data.sharedInfo.style.textColor", value)
            }
          />
        </div>
      </div>
    </FormSection>
  )
}

export default SharedInfoForm
