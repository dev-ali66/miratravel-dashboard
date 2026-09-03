// import { Compass, Globe2, MapPin, TimerReset } from "lucide-react"

import type { LocationData } from "../../locationTypes"
// import { InfoItem } from "../../shared/previewPrimitives"
import MapLibrePreview from "../../../../ui/MapLibrePreview"

export type GeoDataPreviewProps = {
  draft: LocationData | null
}

export function GeoDataPreview({ draft }: GeoDataPreviewProps) {
  const geo = draft?.geoData ?? {
    latitude: 0,
    longitude: 0,
    mapZoom: 6,
    timezone: "UTC",
    area: { value: 0, unit: "km²" },
  }

  // const areaText = geo.area?.value ? `${geo.area.value.toLocaleString()} ${geo.area.unit}` : "—"

  return (
    <section className="mx-auto flex w-full max-w-[1460px] flex-col justify-center px-4 py-10 md:px-8 lg:px-10">
      <div className="mb-6 flex flex-col items-center gap-2 text-center">
        <h2 className="mt-4 text-4xl font-light md:text-6xl">Interactive Map</h2>
        <p className="text-[10px] tracking-[0.25em] text-neutral-400">
          Spin the globe, then zoom into the location to explore our properties
        </p>
      </div>

      <div className="mx-auto w-[90vw] max-w-[1200px]">
        <MapLibrePreview
          latitude={geo.latitude}
          longitude={geo.longitude}
          zoom={geo.mapZoom}
          draggable={false}
          className="h-[80vh] min-h-[420px] w-full rounded-[80px] border border-neutral-200 bg-white shadow-sm"
        />
      </div>
      
    </section>
  )
}
