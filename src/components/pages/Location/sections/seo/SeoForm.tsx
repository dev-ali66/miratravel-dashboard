/* =====================================================
   SEO — FORM SECTION
   Auto-migrated from the legacy LocationForm.tsx monolith.
===================================================== */

import { FormSection } from "../../shared/fields"
import { SeoForm as SharedSeoForm } from "../../../CMS/shared/SeoForm"
import type { LocationData } from "../../locationTypes"

export type SeoFormProps = {
  draft: LocationData
  updateField: (path: string, value: unknown) => void
  openSections: Record<string, boolean>
  toggleSection: (section: string) => void
}

export function SeoForm({
  draft,
  updateField,
  openSections,
  toggleSection,
}: SeoFormProps) {
  return (
    <FormSection
      title="SEO"
      active={!!openSections["seo"]}
      onClick={() => toggleSection("seo")}
    >
      <SharedSeoForm
        metadata={draft.metadata.seo}
        onChange={(metadata) =>
          updateField("metadata.seo", {
            title: metadata.title ?? "",
            description: metadata.description ?? "",
            keywords: metadata.keywords ?? [],
            canonicalUrl: metadata.canonicalUrl ?? "",
            robots: metadata.robots,
          })
        }
      />
    </FormSection>
  )
}
