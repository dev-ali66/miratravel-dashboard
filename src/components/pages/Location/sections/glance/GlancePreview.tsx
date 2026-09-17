import { DynamicStyledTextPreview } from "@/components/pages/CMS/shared/DynamicStyledTextPreview"
import { UniversalMultimediaPreview } from "@/components/pages/CMS/Home/shared/preview/UniversalMultimediaPreview"
import type { LocationPreviewSectionProps } from "../../config/locationSections"
import { useGetLocationPages } from "@/hooks/location/useGetLocation"
import { Layers } from "lucide-react"

export function GlancePreview({ draft }: LocationPreviewSectionProps) {
  // Fetch available locations from DB to dynamically resolve hero / card data by ID
  const { data: locationPagesResponse } = useGetLocationPages({ limit: 100 })
  const availableLocations = locationPagesResponse?.data || []

  const glanceData =
    draft?.glance ||
    draft?.regionGlance ||
    (draft as any)?.data?.glance ||
    (draft as any)?.data?.regionGlance ||
    {}

  const rawItems: any[] = Array.isArray(glanceData.items) ? glanceData.items : []

  // Sample items shown only if no items have been added
  const sampleItems = [
    {
      id: "sample-glance-1",
      country: draft?.name || "Albania",
      title: "North Albania & Alpine Peaks",
      multimedia: {
        show: "image",
        image: {
          url: "",
          alt: "North Albania",
          fit: "cover",
        },
      },
    },
    {
      id: "sample-glance-2",
      country: draft?.name || "Albania",
      title: "Central Albania & Living Heritage",
      multimedia: {
        show: "image",
        image: {
          url: "",
          alt: "Central Albania",
          fit: "cover",
        },
      },
    },
    {
      id: "sample-glance-3",
      country: draft?.name || "Albania",
      title: "Albanian Riviera & Coastal Bays",
      multimedia: {
        show: "image",
        image: {
          url: "",
          alt: "Albanian Riviera",
          fit: "cover",
        },
      },
    },
  ]

  const items: any[] = rawItems.length > 0 ? rawItems : sampleItems

  // Resolve dynamic cards from string location IDs or objects
  const dynamicItems = items
    .map((it: any, idx: number) => {
      if (typeof it === "string") {
        const loc =
          availableLocations.find((l: any) => l.id === it || l.slug === it) ||
          (draft?.children as any[])?.find((c: any) => c.id === it || c.slug === it)

        const parentName = loc?.parent?.name || draft?.name || "Destination"
        const parentSlug = loc?.parent?.slug || draft?.slug || "explore"
        const childSlug = loc?.slug || `glance-${idx + 1}`

        const heroMedia = loc?.hero?.backgroundMultimedia
        const imgUrl =
          heroMedia?.image?.url ||
          loc?.hero?.image?.url ||
          loc?.card?.background_image ||
          (heroMedia?.show === "image" ? heroMedia?.image?.url : "") ||
          ""

        return {
          id: it,
          country: parentName,
          title: loc?.name || loc?.hero?.title?.value || it,
          href: parentSlug && childSlug ? `/destinations/${parentSlug}/${childSlug}` : `#`,
          multimedia: {
            show: "image",
            image: {
              url: imgUrl,
              alt: loc?.name || "Glance Card",
              fit: "cover",
            },
          },
        }
      }

      // Legacy object item fallback
      const loc = (it.id && typeof it.id === "string" && !it.id.startsWith("sample-"))
        ? availableLocations.find((l: any) => l.id === (it.id || it.locationId) || l.slug === (it.id || it.locationId))
        : null

      const fallbackTitle = loc?.name || loc?.hero?.title?.value || it.title || `Destination ${idx + 1}`
      const fallbackCountry = loc?.parent?.name || it.country || draft?.name || "Destination"

      return {
        ...it,
        id: it.id || loc?.id || `glance-${idx}`,
        country: fallbackCountry,
        title: fallbackTitle,
        multimedia: it.multimedia || it.imageMultimedia,
      }
    })
    .filter(Boolean)

  // Index 0 is automatically the Featured Card (Left Large col-span-7 or 12)
  const featured = dynamicItems.length > 0 ? dynamicItems[0] : null
  // Index 1+ are the Sub-destination Cards (Right Stacked col-span-5)
  const subItems = dynamicItems.length > 1 ? dynamicItems.slice(1) : []

  return (
    <section id="region-glance" data-section="glance" className="relative w-full py-12 md:py-16 overflow-hidden">
      <UniversalMultimediaPreview
        multimedia={glanceData.backgroundMultimedia}
        fallbackColor="#FFFFFF"
        mode="background"
      />

      <div className="relative z-10 container mx-auto px-4">
        {/* Header Section */}
        <div className="w-full flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 md:mb-12">
          <div className="max-w-xl space-y-2">
            <DynamicStyledTextPreview
              as="span"
              data={glanceData.label}
              fallbackColor="#af6348"
              className="text-xs font-semibold uppercase tracking-widest"
            />
            <DynamicStyledTextPreview
              as="h2"
              data={glanceData.title}
              fallbackColor="#182d09"
              className="text-2xl md:text-3xl font-normal font-serif"
            />
          </div>

          <div className="max-w-md">
            <DynamicStyledTextPreview
              as="p"
              data={glanceData.description}
              fallbackColor="#565e69"
              className="text-sm leading-relaxed"
            />
          </div>
        </div>

        {/* Cards Media Grid or Empty State Placeholder Banner */}
        {dynamicItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-primary/30 bg-muted/20 p-10 text-center min-h-[220px]">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary mb-2.5">
              <Layers className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-serif font-medium text-foreground mb-1">
              Region at a Glance Section
            </h3>
            <p className="text-xs text-muted-foreground max-w-sm">
              No glance destination cards added yet. Search and add locations in the left form panel to feature regional cards here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Left Featured Card (#1 in Array - col-span-7 or col-span-12 if alone) */}
            {featured && (
              <div
                className={`${
                  subItems.length > 0 ? "lg:col-span-7" : "lg:col-span-12"
                } relative min-h-[360px] md:min-h-[460px] w-full overflow-hidden rounded-sm group cursor-pointer`}
              >
                <UniversalMultimediaPreview
                  multimedia={featured.multimedia || featured.imageMultimedia}
                  fallbackAlt="Featured region"
                  mode="background"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent z-[2]" />

                <div className="absolute bottom-6 left-6 right-6 z-10 space-y-1">
                  {featured.country && (
                    <span className="text-white/80 text-xs font-normal uppercase tracking-widest">
                      {featured.country}
                    </span>
                  )}
                  <DynamicStyledTextPreview
                    as="h3"
                    data={featured.title}
                    fallbackColor="#FFFFFF"
                    className="text-xl md:text-2xl font-serif text-white font-normal"
                  />
                </div>
              </div>
            )}

            {/* Right Column: Stacked Cards (#2+ in Array - col-span-5) */}
            {subItems.length > 0 && (
              <div className="lg:col-span-5 flex flex-col justify-between gap-6">
                {subItems.map((item: any, index: number) => (
                  <div
                    key={index}
                    className="relative min-h-[200px] md:min-h-[220px] w-full overflow-hidden rounded-sm group cursor-pointer flex flex-col justify-end"
                  >
                    <UniversalMultimediaPreview
                      multimedia={item.multimedia || item.imageMultimedia}
                      fallbackAlt={item.country || "Sub region"}
                      mode="background"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-[2]" />

                    <div className="absolute bottom-5 left-5 right-5 z-10 space-y-1">
                      {item.country && (
                        <span className="text-white/80 text-xs font-normal uppercase tracking-widest">
                          {item.country}
                        </span>
                      )}
                      <DynamicStyledTextPreview
                        as="h3"
                        data={item.title}
                        fallbackColor="#FFFFFF"
                        className="text-lg md:text-xl font-heading text-white font-normal"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}

export default GlancePreview
