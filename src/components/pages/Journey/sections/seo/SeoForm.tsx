import type { JourneyData } from "../../journeyTypes"
import { FormSection, Field, ImageField } from "../../shared/fields"
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
    : ""

  return (
    <FormSection
      title="SEO & Search Engine Metadata"
      sectionNumber={sectionNumber}
      active={isOpen}
      onClick={() => toggleSection("seo")}
    >
      <div className="flex items-center gap-2 mb-3">
        <Globe className="h-4 w-4 text-primary" />
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Search Engine Optimization Governance
        </span>
      </div>

      <Field
        label="SEO Meta Title"
        value={seoData.metaTitle || seoData.title || draft.title || ""}
        onChange={(val) => updateField("metadata.seo.metaTitle", val)}
        placeholder="e.g. Yellowstone Luxury Wilderness Escape | MIRA Journeys"
      />

      <Field
        label="SEO Meta Description"
        value={seoData.metaDescription || seoData.description || draft.subtitle || ""}
        onChange={(val) => updateField("metadata.seo.metaDescription", val)}
        multiline
        rows={3}
        placeholder="A compelling search result snippet summary..."
      />

      <Field
        label="Meta Keywords (comma-separated)"
        value={keywordsStr}
        onChange={(val) =>
          updateField(
            "metadata.seo.metaKeywords",
            val.split(",").map((k) => k.trim()).filter(Boolean)
          )
        }
        placeholder="Yellowstone, Luxury Journey, Wildlife Excursion, USA Travel"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-border/40">
        <Field
          label="Open Graph (OG) Social Title"
          value={seoData.ogTitle || seoData.metaTitle || draft.title || ""}
          onChange={(val) => updateField("metadata.seo.ogTitle", val)}
        />

        <Field
          label="Canonical URL"
          value={seoData.canonicalUrl || ""}
          onChange={(val) => updateField("metadata.seo.canonicalUrl", val)}
          placeholder="https://miratravel.nl/journeys/yellowstone-wilderness"
        />
      </div>

      <Field
        label="Open Graph (OG) Description"
        value={seoData.ogDescription || seoData.metaDescription || ""}
        onChange={(val) => updateField("metadata.seo.ogDescription", val)}
        multiline
        rows={2}
      />

      <ImageField
        label="Social Sharing (OG Image) Banner"
        value={seoData.ogImage || ""}
        onChange={(url) => updateField("metadata.seo.ogImage", url)}
      />
    </FormSection>
  )
}
