import { FormSection } from "@/components/pages/CMS/shared/FormControls"
import { SeoForm } from "@/components/pages/CMS/shared/SeoForm"
import type { JourneyCmsFormSectionProps } from "../../journeyCmsTypes"

export function JourneyCmsSeoMetadataForm({
  draft,
  updateField,
  openSections,
  toggleSection,
  sectionNumber,
}: JourneyCmsFormSectionProps) {
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

export default JourneyCmsSeoMetadataForm
