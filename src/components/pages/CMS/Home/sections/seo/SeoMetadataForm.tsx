import { FormSection } from "@/components/pages/CMS/shared/FormControls"
import { SeoForm } from "@/components/pages/CMS/shared/SeoForm"
import type { HomePageData } from "../../homeTypes"

export type SeoMetadataFormProps = {
  data: HomePageData
  setData: React.Dispatch<React.SetStateAction<HomePageData>>
  openSections: Record<string, boolean>
  toggleSection: (key: string) => void
  sectionNumber: string
}

export function SeoMetadataForm({
  data,
  setData,
  openSections,
  toggleSection,
  sectionNumber,
}: SeoMetadataFormProps) {
  const isOpen = Boolean(openSections["seo"])
  const seoData = data?.metadata?.seo || (data?.metadata as any) || {}

  return (
    <FormSection
      title="SEO & Metadata"
      sectionNumber={sectionNumber}
      active={isOpen}
      onClick={() => toggleSection("seo")}
    >
      <SeoForm
        metadata={seoData ? (seoData as any) : undefined}
        onChange={(newMetadata: any) => {
          const nextSeo = {
            title: newMetadata.title ?? "",
            description: newMetadata.description ?? "",
            keywords: newMetadata.keywords ?? [],
            canonicalUrl: newMetadata.canonicalUrl ?? "",
            robots: {
              index: newMetadata.robots?.index ?? true,
              follow: newMetadata.robots?.follow ?? true,
            },
          }
          setData((prev: any) => ({
            ...prev,
            metadata: {
              ...(prev?.metadata || {}),
              ...nextSeo,
              seo: nextSeo,
            },
          }))
        }}
      />
    </FormSection>
  )
}
