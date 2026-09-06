/* =====================================================
   JOURNEYS — HERO FORM SECTION
===================================================== */

import { FormSection } from "../../shared/fields"
import { HeroFields } from "./HeroFields"
import type { Journey } from "../../journeyTypes"

export type HeroFormProps = {
  draft: Journey
  updateField: (path: string, value: unknown) => void
  openSections: Record<string, boolean>
  toggleSection: (section: string) => void
}

export function HeroForm({
  draft,
  updateField,
  openSections,
  toggleSection,
}: HeroFormProps) {
  return (
    <FormSection
      title="Hero & Media"
      active={!!openSections["hero"]}
      onClick={() => toggleSection("hero")}
    >
      <HeroFields draft={draft} updateField={updateField} />
    </FormSection>
  )
}

