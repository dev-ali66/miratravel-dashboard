import type { JourneyPreviewSectionProps } from "../../journeyTypes"
import { DynamicStyledTextPreview } from "@/components/pages/CMS/shared/DynamicStyledTextPreview"
import { UniversalMultimediaPreview } from "@/components/pages/CMS/shared/UniversalMultimediaPreview"
import { Search, SlidersHorizontal } from "lucide-react"

export function AllJourneysPreview({ draft }: JourneyPreviewSectionProps) {
  if (!draft) return null

  const allData =
    draft.all_journeys || draft?.data?.all_journeys || {}

  return (
    <section
      data-section="all_journeys"
      className="relative w-full py-14 md:py-20 overflow-hidden border-t border-border/40"
    >
      {/* Background Media (Color / Image / Video) */}
      <UniversalMultimediaPreview
        multimedia={allData.backgroundMultimedia}
        fallbackColor="#FFFFFF"
        mode="background"
      />

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center max-w-3xl mx-auto">
          {allData.eyebrow && (
            <DynamicStyledTextPreview
              as="span"
              data={allData.eyebrow}
              fallbackColor="#AF6348"
              className="mb-2 inline-block font-sans text-xs font-semibold uppercase tracking-widest"
            />
          )}
          <DynamicStyledTextPreview
            as="h2"
            data={allData.title}
            fallbackColor="#111827"
            className="font-serif text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl"
          />
          {allData.subtitle && (
            <DynamicStyledTextPreview
              as="p"
              data={allData.subtitle}
              fallbackColor="#4B5563"
              className="mt-3 text-base text-gray-600 sm:text-lg"
            />
          )}
        </div>

        {/* Search Bar & Filter Bar Live Preview */}
        <div className="max-w-2xl mx-auto mb-10">
          <div className="relative flex items-center">
            <Search className="absolute left-4 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              readOnly
              placeholder={allData.searchPlaceholder || "Search journeys..."}
              className="w-full rounded-full border border-border bg-background py-3.5 pl-12 pr-12 text-sm text-foreground shadow-sm placeholder:text-muted-foreground pointer-events-none"
            />
            <button className="absolute right-3 p-2 text-muted-foreground hover:text-foreground">
              <SlidersHorizontal className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AllJourneysPreview
