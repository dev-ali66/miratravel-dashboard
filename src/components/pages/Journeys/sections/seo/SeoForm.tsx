/* =====================================================
   JOURNEYS — SEO & METADATA FORM SECTION
   Uses the Universal CMS SeoForm component
===================================================== */

import { FormSection } from "../../shared/fields"
import { SeoForm as SharedSeoForm } from "@/components/pages/CMS/shared/SeoForm"
import type { Journey } from "../../journeyTypes"

export type SeoFormProps = {
  draft: Journey
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
      title="SEO & Metadata"
      active={!!openSections["seo"]}
      onClick={() => toggleSection("seo")}
    >
      <SharedSeoForm
        metadata={draft.metadata?.seo ? (draft.metadata.seo as any) : undefined}
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
