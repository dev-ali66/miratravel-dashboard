/* =====================================================
   JOURNEYS — BASIC INFO FORM SECTION
===================================================== */

import { FormSection } from "../../shared/fields"
import { BasicInfoFields } from "./BasicInfoFields"
import type { Journey } from "../../journeyTypes"

export type BasicInfoFormProps = {
  draft: Journey
  updateField: (path: string, value: unknown) => void
  openSections: Record<string, boolean>
  toggleSection: (section: string) => void
}

export function BasicInfoForm({
  draft,
  updateField,
  openSections,
  toggleSection,
}: BasicInfoFormProps) {
  return (
    <FormSection
      title="Basic Information"
      active={!!openSections["basic-info"]}
      onClick={() => toggleSection("basic-info")}
    >
      <BasicInfoFields draft={draft} updateField={updateField} />
    </FormSection>
  )
}

