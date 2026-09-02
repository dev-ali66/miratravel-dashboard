/* =====================================================
   SHARED INFO — FORM SECTION
   Simple form to edit shared info text used by previews.
===================================================== */

import { Field, FormSection } from "./fields"
import type { LocationData } from "../locationTypes"

export type SharedInfoFormProps = {
  draft: LocationData
  updateField: (path: string, value: unknown) => void
  openSections: Record<string, boolean>
  toggleSection: (section: string) => void
}

export function SharedInfoForm({ draft, updateField, openSections, toggleSection }: SharedInfoFormProps) {
  return (
    <FormSection title="Shared Info" active={!!openSections['shared-info']} onClick={() => toggleSection('shared-info')}>
      <div className="space-y-4">
        <Field
          label="Text"
          value={draft.data.sharedInfo?.text ?? ''}
          multiline
          onChange={(value) => updateField('data.sharedInfo.text', value)}
        />
      </div>
    </FormSection>
  )
}

export default SharedInfoForm
