// import { Compass, Globe2, MapPin, TimerReset } from "lucide-react"

import type { LocationData } from "../../locationTypes"
// import { InfoItem } from "../../shared/previewPrimitives"
import MapLibrePreview from "../../../../ui/MapLibrePreview"

export type GeoDataPreviewProps = {
  draft: LocationData | null
}

const BANGLADESH_GEO = {
  latitude: 23.685,
  longitude: 90.3563,
  mapZoom: 7,
  timezone: "Asia/Dhaka",
  area: { value: 147570, unit: "km²" },
}

export function GeoDataPreview({ draft }: GeoDataPreviewProps) {
  const geoData = draft?.geoData
  const hasCoordinates =
    geoData?.latitude != null &&
    geoData?.longitude != null &&
    (geoData.latitude !== 0 || geoData.longitude !== 0)

  const geo = {
    latitude: hasCoordinates ? geoData!.latitude : BANGLADESH_GEO.latitude,
    longitude: hasCoordinates ? geoData!.longitude : BANGLADESH_GEO.longitude,
    mapZoom:
      (hasCoordinates ? geoData!.mapZoom : null) ?? BANGLADESH_GEO.mapZoom,
    timezone: geoData?.timezone || BANGLADESH_GEO.timezone,
    area: geoData?.area?.value ? geoData.area : BANGLADESH_GEO.area,
  }

  // const areaText = geo.area?.value ? `${geo.area.value.toLocaleString()} ${geo.area.unit}` : "—"

  return (
    <section className="mx-auto flex w-full max-w-[1460px] flex-col justify-center px-4 py-10 md:px-8 lg:px-10">
      <div className="mb-6 flex flex-col items-center gap-2 text-center">
        <h2 className="mt-4 text-4xl font-light md:text-6xl">
          Interactive Map
        </h2>
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
          className="h-[60vh] min-h-[360px] w-full rounded-[40px] border border-neutral-200 bg-white shadow-sm md:rounded-[60px]"
        />
      </div>
    </section>
  )
}
