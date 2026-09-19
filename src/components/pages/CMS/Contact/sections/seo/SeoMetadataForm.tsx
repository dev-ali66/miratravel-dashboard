import { FormSection } from "@/components/pages/CMS/shared/FormControls"
import { SeoForm } from "@/components/pages/CMS/shared/SeoForm"

export type SeoMetadataFormProps = {
  data: any
  setData: React.Dispatch<React.SetStateAction<any>>
  openSections: Record<string, boolean>
  toggleSection: (key: string) => void
  sectionNumber: number | string
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
      sectionNumber={String(sectionNumber)}
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

export default SeoMetadataForm
