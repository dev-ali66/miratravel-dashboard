import { useState } from "react"
import { FormSection } from "@/components/pages/Location/shared/fields"
import type { ExperienceFormSectionProps } from "../../config/experienceSections"
import { useGetJourneys } from "@/hooks/journey/useGetJourneys"
import { Search, Compass, Plus, X, Loader2, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { getOptimizedImageUrl } from "@/lib/optimizedImage"

export function RelatedJourneysForm({
  draft,
  updateField,
  openSections,
  toggleSection,
  sectionNumber,
}: ExperienceFormSectionProps) {
  const isOpen = Boolean(openSections["related-journeys"])
  const [searchTerm, setSearchTerm] = useState("")

  const selectedJourneys: any[] = Array.isArray(draft.journeys) ? draft.journeys : []

  const { data: journeysResponse, isLoading } = useGetJourneys({
    search: searchTerm,
    limit: 15,
  })

  const availableJourneys = journeysResponse?.data || []

  const handleToggleJourney = (journey: any) => {
    const exists = selectedJourneys.some((j) => (j?.id || j) === journey.id)
    if (exists) {
      updateField(
        "journeys",
        selectedJourneys.filter((j) => (j?.id || j) !== journey.id)
      )
    } else {
      updateField("journeys", [
        ...selectedJourneys,
        {
          id: journey.id,
          title: journey.title,
          slug: journey.slug,
          hero: journey.hero,
          price: journey.price,
          currency: journey.currency,
          status: journey.status,
        },
      ])
    }
  }

  const handleRemove = (journeyId: string) => {
    updateField(
      "journeys",
      selectedJourneys.filter((j) => (j?.id || j) !== journeyId)
    )
  }

  return (
    <FormSection
      title="Related Journeys (Itinerary Integration)"
      sectionNumber={sectionNumber}
      active={isOpen}
      onClick={() => toggleSection("related-journeys")}
    >
      <div className="flex flex-col gap-5">
        <p className="text-xs text-muted-foreground">
          Link Journeys that include or pair seamlessly with this Experience. These will appear as suggested itineraries on the experience detail page.
        </p>

        {/* Selected Journeys Cards */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold text-foreground">
            Connected Journeys ({selectedJourneys.length})
          </span>

          {selectedJourneys.length === 0 ? (
            <div className="rounded-md border border-dashed border-border/80 p-6 text-center text-xs text-muted-foreground">
              No journeys linked yet. Search below to connect Journeys to this experience.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {selectedJourneys.map((j) => {
                const jId = j?.id || j
                const title = j?.title || `Journey ID: ${jId}`
                const thumb = (j?.hero as any)?.backgroundMultimedia?.image?.url || (j?.hero as any)?.image?.url

                return (
                  <div
                    key={jId}
                    className="flex items-center justify-between gap-3 p-2.5 rounded-lg border border-border/70 bg-card shadow-2xs"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="h-10 w-12 rounded overflow-hidden bg-muted shrink-0 border border-border flex items-center justify-center">
                        {thumb ? (
                          <img src={getOptimizedImageUrl(thumb, { width: 96, quality: 100 })} alt={title} className="h-full w-full object-cover" />
                        ) : (
                          <Compass className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs font-semibold text-foreground truncate">
                          {title}
                        </span>
                        {j?.status && (
                          <span className="text-[10px] text-muted-foreground uppercase font-medium">
                            {j.status}
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemove(jId)}
                      className="rounded p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors cursor-pointer"
                      title="Disconnect journey"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Live Search Picker */}
        <div className="rounded-md border border-border/70 bg-muted/15 p-3.5 flex flex-col gap-3">
          <div className="flex items-center gap-2 rounded-lg border border-border/80 bg-background px-3 py-1.5 shadow-2xs">
            <Search className="h-4 w-4 text-muted-foreground shrink-0" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search journeys to connect..."
              className="w-full bg-transparent text-xs text-foreground outline-none placeholder:text-muted-foreground/60"
            />
          </div>

          <div className="max-h-52 overflow-y-auto custom-scrollbar flex flex-col divide-y divide-border/40">
            {isLoading && (
              <div className="flex items-center justify-center gap-2 py-4 text-xs text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                Loading journeys...
              </div>
            )}

            {!isLoading && availableJourneys.length === 0 && (
              <div className="py-4 text-center text-xs text-muted-foreground">
                {searchTerm ? `No journeys found for "${searchTerm}"` : "No journeys available."}
              </div>
            )}

            {!isLoading &&
              availableJourneys.map((item) => {
                const isSelected = selectedJourneys.some((j) => (j?.id || j) === item.id)
                const thumb = (item.hero as any)?.backgroundMultimedia?.image?.url || (item.hero as any)?.image?.url

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleToggleJourney(item)}
                    className={cn(
                      "flex items-center justify-between p-2 text-left transition-colors hover:bg-muted/60 cursor-pointer",
                      isSelected && "bg-primary/5 font-semibold text-primary"
                    )}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="h-8 w-10 rounded overflow-hidden bg-muted shrink-0 border border-border flex items-center justify-center">
                        {thumb ? (
                          <img src={getOptimizedImageUrl(thumb, { width: 80, quality: 100 })} alt={item.title} className="h-full w-full object-cover" />
                        ) : (
                          <Compass className="h-3.5 w-3.5 text-muted-foreground" />
                        )}
                      </div>
                      <span className="text-xs truncate text-foreground">{item.title}</span>
                    </div>

                    <div className="shrink-0 ml-2">
                      {isSelected ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary">
                          <Check className="h-3.5 w-3.5" /> Connected
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-muted-foreground hover:text-foreground">
                          <Plus className="h-3.5 w-3.5" /> Connect
                        </span>
                      )}
                    </div>
                  </button>
                )
              })}
          </div>
        </div>
      </div>
    </FormSection>
  )
}

export default RelatedJourneysForm
