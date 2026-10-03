import { FormSection } from "../../shared/fields"
import { SeoForm as SharedSeoForm } from "@/components/pages/CMS/shared/SeoForm"
import type { StoryFormSectionProps } from "../../config/storySections"

export function SeoForm({
  draft,
  updateField,
  openSections,
  toggleSection,
  sectionNumber,
}: StoryFormSectionProps) {
  const isOpen = Boolean(openSections["seo"])
  const seoData = draft?.seo || (draft as any)?.metadata?.seo || {}

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
          updateField("seo", nextSeo)
        }}
      />
    </FormSection>
  )
}

export default SeoForm
