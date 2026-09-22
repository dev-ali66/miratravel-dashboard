import type { JourneyData } from "../../journeyTypes"
import { FormSection } from "../../shared/fields"
import { DynamicStyledField } from "@/components/pages/CMS/shared/FormControls"
import { UniversalMultimediaForm } from "@/components/pages/CMS/shared/UniversalMultimediaForm"
import { Globe } from "lucide-react"

interface SeoFormProps {
  draft: JourneyData
  updateField: (path: string, value: any) => void
  openSections: Record<string, boolean>
  toggleSection: (key: string) => void
  sectionNumber: string
}

export function SeoForm({
  draft,
  updateField,
  openSections,
  toggleSection,
  sectionNumber,
}: SeoFormProps) {
  const isOpen = Boolean(openSections["seo"])
  const rawMeta = draft.metadata || {}
  const seoData = rawMeta.seo || rawMeta || {}

  const keywordsStr = Array.isArray(seoData.metaKeywords)
    ? seoData.metaKeywords.join(", ")
    : typeof seoData.metaKeywords === "string"
    ? seoData.metaKeywords
    : typeof seoData.metaKeywords === "object" && seoData.metaKeywords !== null
    ? seoData.metaKeywords.value
    : ""

  return (
    <FormSection
      title="SEO & Search Engine Metadata"
      sectionNumber={sectionNumber}
      active={isOpen}
      onClick={() => toggleSection("seo")}
    >
      <div className="flex flex-col gap-5">
        <div className="flex items-center gap-2 mb-1">
          <Globe className="h-4 w-4 text-primary" />
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Search Engine Optimization Governance
          </span>
        </div>

        <DynamicStyledField
          type="text"
          label="SEO Meta Title"
          fieldName="metadata.seo.metaTitle"
          value={seoData.metaTitle || seoData.title || draft.title}
          onChange={(val) => updateField("metadata.seo.metaTitle", val)}
          placeholder="e.g. Yellowstone Luxury Wilderness Escape | MIRA Journeys"
        />

        <DynamicStyledField
          type="richtext"
          label="SEO Meta Description"
          fieldName="metadata.seo.metaDescription"
          value={seoData.metaDescription || seoData.description || draft.subtitle}
          onChange={(val) => updateField("metadata.seo.metaDescription", val)}
          placeholder="A compelling search result snippet summary..."
        />

        <DynamicStyledField
          type="text"
          label="Meta Keywords (comma-separated)"
          fieldName="metadata.seo.metaKeywords"
          value={keywordsStr}
          onChange={(val) =>
            updateField(
              "metadata.seo.metaKeywords",
              typeof val === "string" ? val.split(",").map((k) => k.trim()).filter(Boolean) : val
            )
          }
          placeholder="Yellowstone, Luxury Journey, Wildlife Excursion, USA Travel"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-border/40">
          <DynamicStyledField
            type="text"
            label="Open Graph (OG) Social Title"
            fieldName="metadata.seo.ogTitle"
            value={seoData.ogTitle || seoData.metaTitle || draft.title}
            onChange={(val) => updateField("metadata.seo.ogTitle", val)}
          />

          <DynamicStyledField
            type="text"
            label="Canonical URL"
            fieldName="metadata.seo.canonicalUrl"
            value={seoData.canonicalUrl}
            onChange={(val) => updateField("metadata.seo.canonicalUrl", val)}
            placeholder="https://miratravel.nl/journeys/yellowstone-wilderness"
          />
        </div>

        <DynamicStyledField
          type="richtext"
          label="Open Graph (OG) Description"
          fieldName="metadata.seo.ogDescription"
          value={seoData.ogDescription || seoData.metaDescription}
          onChange={(val) => updateField("metadata.seo.ogDescription", val)}
        />

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
            Social Sharing (OG Image) Banner
          </label>
          <UniversalMultimediaForm
            value={seoData.ogImageMultimedia || { show: "image", image: { url: typeof seoData.ogImage === "string" ? seoData.ogImage : "" } }}
            onChange={(val) => updateField("metadata.seo.ogImageMultimedia", val)}
          />
        </div>
      </div>
    </FormSection>
  )
}

