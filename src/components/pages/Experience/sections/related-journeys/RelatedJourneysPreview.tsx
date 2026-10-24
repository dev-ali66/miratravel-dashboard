import { Compass, ArrowRight } from "lucide-react"
import type { ExperiencePreviewSectionProps } from "../../config/experienceSections"

export function RelatedJourneysPreview({ draft }: ExperiencePreviewSectionProps) {
  const journeys = Array.isArray(draft?.journeys) ? draft.journeys : []

  if (journeys.length === 0) return null

  return (
    <section
      data-section="related-journeys"
      className="relative w-full py-16 px-6 md:px-12 lg:px-20 bg-background border-t border-border/60 text-foreground"
    >
      <div className="max-w-6xl mx-auto flex flex-col gap-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[2.5px] text-accent mb-2 block">
              FEATURED IN BESPOKE ITINERARIES
            </span>
            <h3 className="font-serif text-3xl font-light text-foreground">
              Journeys Featuring This Experience
            </h3>
          </div>
          <p className="text-xs text-muted-foreground max-w-sm">
            This experience can be woven into any of these signature itineraries or tailored into a bespoke route.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {journeys.map((j: any) => {
            const title = j.title || "Signature Journey"
            const thumb = (j.hero as any)?.backgroundMultimedia?.image?.url || (j.hero as any)?.image?.url

            return (
              <div
                key={j.id}
                className="group flex flex-col rounded-xl overflow-hidden bg-card text-card-foreground border border-border/60 shadow-xs hover:shadow-md transition-all"
              >
                <div className="relative h-44 w-full overflow-hidden bg-muted">
                  {thumb ? (
                    <img
                      src={thumb}
                      alt={title}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-muted">
                      <Compass className="h-8 w-8 text-muted-foreground/40" />
                    </div>
                  )}
                </div>

                <div className="flex flex-col p-5 flex-1 justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-accent block mb-1">
                      JOURNEY ITINERARY
                    </span>
                    <h4 className="font-serif text-lg font-medium text-brand-primary group-hover:text-accent transition-colors leading-snug">
                      {title}
                    </h4>
                  </div>

                  <div className="flex items-center justify-between text-xs font-semibold text-primary pt-3 border-t border-border/40">
                    <span>Explore Itinerary</span>
                    <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default RelatedJourneysPreview
