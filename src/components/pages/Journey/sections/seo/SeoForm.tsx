import { FormSection } from "../../shared/fields"
import { SeoForm as SharedSeoForm } from "@/components/pages/CMS/shared/SeoForm"
import type { JourneyData } from "../../journeyTypes"

interface SeoFormProps {
  draft: JourneyData
  updateField: (path: string, value: any) => void
  openSections: Record<string, boolean>
  toggleSection: (key: string) => void
  sectionNumber?: string | number
}

export function SeoForm({
  draft,
  updateField,
  openSections,
  toggleSection,
  sectionNumber,
}: SeoFormProps) {
  const isOpen = Boolean(openSections["seo"])
  const seoData = (draft as any)?.seo || (draft as any)?.metadata?.seo || {}

  return (
    <FormSection
      title="SEO & Metadata"
      sectionNumber={sectionNumber !== undefined ? String(sectionNumber) : undefined}
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
          updateField("metadata.seo", nextSeo)
        }}
      />
    </FormSection>
  )
}

export default SeoForm
