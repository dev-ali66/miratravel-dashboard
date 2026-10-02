import type { JourneyPreviewSectionProps } from "../../journeyTypes"
import { DynamicStyledTextPreview } from "@/components/pages/CMS/shared/DynamicStyledTextPreview"
import { UniversalMultimediaPreview } from "@/components/pages/CMS/shared/UniversalMultimediaPreview"
import { DynamicCmsButtonPreview } from "@/components/pages/CMS/shared/DynamicCmsButtonPreview"
import { Calendar, MapPin, ArrowRight } from "lucide-react"

export function SignatureJourneysPreview({ draft }: JourneyPreviewSectionProps) {
  if (!draft) return null

  const sigData =
    draft.signature_journeys || draft?.data?.signature_journeys || {}

  // Mock signature journey cards for live preview representation
  const mockJourneys = [
    {
      title: "Grand Balkan Heritage Trail",
      location: "Albania • Montenegro • North Macedonia",
      duration: "10 Days / 9 Nights",
      category: "CULTURAL LUXURY",
      image: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=800&q=80",
    },
    {
      title: "Ionian Coastal & Riviera Odyssey",
      location: "Albanian Riviera • Corfu",
      duration: "7 Days / 6 Nights",
      category: "COASTAL ESCAPE",
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
    },
    {
      title: "Accursed Mountains Wilderness Expedition",
      location: "Theth • Valbona • Peaks of the Balkans",
      duration: "8 Days / 7 Nights",
      category: "PRIVATE ADVENTURE",
      image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80",
    },
  ]

  return (
    <section
      data-section="signature_journeys"
      className="relative w-full py-14 md:py-20 lg:py-24 overflow-hidden"
    >
      {/* Background Media (Color / Image / Video) */}
      <UniversalMultimediaPreview
        multimedia={sigData.backgroundMultimedia}
        fallbackColor="#FAF7F2"
        mode="background"
      />

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            {sigData.eyebrow && (
              <DynamicStyledTextPreview
                as="span"
                data={sigData.eyebrow}
                fallbackColor="#AF6348"
                className="mb-2 inline-block font-sans text-xs font-semibold uppercase tracking-widest"
              />
            )}
            <DynamicStyledTextPreview
              as="h2"
              data={sigData.title}
              fallbackColor="#111827"
              className="font-serif text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl"
            />
            {sigData.subtitle && (
              <DynamicStyledTextPreview
                as="p"
                data={sigData.subtitle}
                fallbackColor="#4B5563"
                className="mt-3 text-base text-gray-600 sm:text-lg"
              />
            )}
          </div>

          {Array.isArray(sigData.buttons) && sigData.buttons.length > 0 && (
            <div className="flex flex-wrap gap-3">
              <DynamicCmsButtonPreview buttons={sigData.buttons} />
            </div>
          )}
        </div>

        {/* Live Preview Signature Journey Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockJourneys.map((j, idx) => (
            <div
              key={idx}
              className="group overflow-hidden rounded-2xl border border-border/50 bg-card shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              <div className="relative h-60 w-full overflow-hidden bg-muted">
                <img
                  src={j.image}
                  alt={j.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute top-4 left-4 rounded-full bg-black/60 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur-md">
                  {j.category}
                </span>
              </div>
              <div className="p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mb-2">
                    <span className="flex items-center gap-1 font-medium text-primary">
                      <Calendar className="h-3.5 w-3.5" />
                      {j.duration}
                    </span>
                    <span className="flex items-center gap-1 truncate">
                      <MapPin className="h-3.5 w-3.5" />
                      {j.location}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors mb-4">
                    {j.title}
                  </h3>
                </div>
                <div className="pt-2 flex items-center justify-between border-t border-border/40 text-xs font-semibold text-primary">
                  <span>VIEW ITINERARY</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default SignatureJourneysPreview
