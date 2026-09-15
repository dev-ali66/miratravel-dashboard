import { useLocationDraft } from "./shared/LocationDraftContext"
import {
  locationSectionOrder,
  locationSectionRegistry,
} from "./config/locationSections"

/* =====================================================
   COMPONENT
   Dynamic Live Preview: Renders active registered sections
   strictly driven by config/locationSections.ts.
===================================================== */

export const LocationPreview = () => {
  const { draft } = useLocationDraft()

  return (
    <div className="@container w-full min-h-full bg-[#F9F9F9] text-foreground text-sm md:text-base">
      {locationSectionOrder.map((key) => {
        const SectionPreview = locationSectionRegistry[key]?.preview

        if (!SectionPreview) {
          return (
            <div
              key={key}
              data-section={key}
              style={{ display: "none" }}
              aria-hidden
            />
          )
        }

        return (
          <section key={key} data-section={key} className="w-full">
            <SectionPreview draft={draft} />
          </section>
        )
      })}
    </div>
  )
}

export default LocationPreview
