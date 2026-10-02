import { FormSection } from "@/components/pages/CMS/shared/FormControls"
import { SeoForm } from "@/components/pages/CMS/shared/SeoForm"
import type { NewsletterCmsFormSectionProps } from "../../newsletterCmsTypes"

export function NewsletterCmsSeoMetadataForm({
  draft,
  updateField,
  openSections,
  toggleSection,
  sectionNumber,
}: NewsletterCmsFormSectionProps) {
  const isOpen = Boolean(openSections["seo"])
  const seoData = draft?.seo || draft?.metadata?.seo || draft?.metadata || {}

  return (
    <FormSection
      title="SEO & Metadata"
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

export default NewsletterCmsSeoMetadataForm
