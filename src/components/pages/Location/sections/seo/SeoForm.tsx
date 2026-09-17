/* =====================================================
   LOCATION — SEO & METADATA FORM SECTION
   Uses the Universal CMS SeoForm component
===================================================== */

import { Globe } from "lucide-react"
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
      <div className="space-y-4">
        {/* Helper Note Banner */}
        <div className="flex items-start gap-3 rounded-lg border border-amber-500/20 bg-amber-500/5 p-3 text-xs text-muted-foreground">
          <Globe className="h-4 w-4 shrink-0 text-amber-500 mt-0.5" />
          <div>
            <p className="font-medium text-foreground">Search Engine Optimization (SEO)</p>
            <p className="mt-0.5 leading-relaxed">
              Configure search engine metadata, OpenGraph canonical URL, search keywords, and robot crawling directives for this destination.
            </p>
          </div>
        </div>

        {/* Universal Shared SEO Form */}
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
      </div>
    </FormSection>
  )
}
