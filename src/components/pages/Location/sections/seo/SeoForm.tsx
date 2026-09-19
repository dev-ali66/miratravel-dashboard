/* =====================================================
   LOCATION — SEO & METADATA FORM SECTION
   Uses the Universal CMS SeoForm component
===================================================== */

import { FormSection } from "../../shared/fields"
import { SeoForm as SharedSeoForm } from "@/components/pages/CMS/shared/SeoForm"
import type { LocationFormSectionProps } from "../../config/locationSections"

export function SeoForm({
  draft,
  updateField,
  openSections,
  toggleSection,
  sectionNumber,
}: LocationFormSectionProps) {
  const isOpen = Boolean(openSections["seo"])
  const seoData = draft?.metadata?.seo || (draft?.metadata as any) || {}

  return (
    <FormSection
      title="SEO & Metadata"
      sectionNumber={sectionNumber}
      active={isOpen}
      onClick={() => toggleSection("seo")}
    >
      <SharedSeoForm
        metadata={seoData ? (seoData as any) : undefined}
        onChange={(metadata) => {
          const nextSeo = {
            title: metadata.title ?? "",
            description: metadata.description ?? "",
            keywords: metadata.keywords ?? [],
            canonicalUrl: metadata.canonicalUrl ?? "",
            robots: {
              index: metadata.robots?.index ?? true,
              follow: metadata.robots?.follow ?? true,
            },
          }
          updateField("metadata.seo", nextSeo)
        }}
      />
    </FormSection>
  )
}
