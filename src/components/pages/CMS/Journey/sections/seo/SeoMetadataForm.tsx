import { FormSection } from "@/components/pages/CMS/shared/FormControls"
import { SeoForm } from "@/components/pages/CMS/shared/SeoForm"
import type { JourneyFormSectionProps } from "../../journeyTypes"

export function SeoMetadataForm({
  draft,
  updateField,
  openSections,
  toggleSection,
  sectionNumber,
}: JourneyFormSectionProps) {
  const isOpen = Boolean(openSections["seo"])
  const seoData = draft?.seo || draft?.metadata?.seo || draft?.metadata || {}

  return (
    <FormSection
      title="Journey CMS SEO & Metadata"
      sectionNumber={String(sectionNumber)}
      active={isOpen}
      onClick={() => toggleSection("seo")}
    >
      <SeoForm
        metadata={seoData}
        onChange={(newSeo: any) => {
          updateField("seo", newSeo)
        }}
      />
    </FormSection>
  )
}

export default SeoMetadataForm
