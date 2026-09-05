/* =====================================================
   GEODATA — FORM SECTION
   Auto-migrated from the legacy LocationForm.tsx monolith.
===================================================== */

import { DynamicStyledField, FormSection } from "../../shared/fields"
import type { LocationData } from "../../locationTypes"
import MapLibrePreview from "../../../../ui/MapLibrePreview"

export type GeoDataFormProps = {
  draft: LocationData
  updateField: (path: string, value: unknown) => void
  openSections: Record<string, boolean>
  toggleSection: (section: string) => void
}

const BANGLADESH_GEO = {
  latitude: 23.685,
  longitude: 90.3563,
  mapZoom: 7,
  timezone: "Asia/Dhaka",
  area: { value: 147570, unit: "km²" },
}

export function GeoDataForm({
  draft,
  updateField,
  openSections,
  toggleSection,
}: GeoDataFormProps) {
  const geoData = draft.geoData
  const hasCoordinates =
    geoData?.latitude != null &&
    geoData?.longitude != null &&
    (geoData.latitude !== 0 || geoData.longitude !== 0)

  const currentLat = hasCoordinates ? geoData.latitude : BANGLADESH_GEO.latitude
  const currentLng = hasCoordinates
    ? geoData.longitude
    : BANGLADESH_GEO.longitude
  const currentZoom =
    (hasCoordinates ? geoData.mapZoom : null) ?? BANGLADESH_GEO.mapZoom

  return (
    <FormSection
      title="Geo Information"
      active={!!openSections["geo-data"]}
      onClick={() => toggleSection("geo-data")}
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <DynamicStyledField
          type="number"
          label="Latitude"
          value={draft.geoData.latitude || BANGLADESH_GEO.latitude}
          onChange={(value: any) =>
            updateField("geoData.latitude", Number(value))
          }
        />

        <DynamicStyledField
          type="number"
          label="Longitude"
          value={draft.geoData.longitude || BANGLADESH_GEO.longitude}
          onChange={(value: any) =>
            updateField("geoData.longitude", Number(value))
          }
        />

        <DynamicStyledField
          type="number"
          label="Map Zoom"
          value={draft.geoData.mapZoom || BANGLADESH_GEO.mapZoom}
          onChange={(value: any) =>
            updateField("geoData.mapZoom", Number(value))
          }
        />

        <DynamicStyledField
          type="text"
          label="Timezone"
          value={draft.geoData.timezone || BANGLADESH_GEO.timezone}
          onChange={(value: string) => updateField("geoData.timezone", value)}
        />

        <DynamicStyledField
          type="number"
          label="Area Value"
          value={draft.geoData.area.value || BANGLADESH_GEO.area.value}
          onChange={(value: any) =>
            updateField("geoData.area.value", Number(value))
          }
        />

        <DynamicStyledField
          type="text"
          label="Area Unit"
          value={draft.geoData.area.unit || BANGLADESH_GEO.area.unit}
          onChange={(value: string) => updateField("geoData.area.unit", value)}
        />
      </div>
      <div className="mt-4">
        <MapLibrePreview
          latitude={currentLat}
          longitude={currentLng}
          zoom={currentZoom}
          draggable={true}
          onChange={(lat, lng, newZoom) => {
            updateField("geoData.latitude", Number(lat))
            updateField("geoData.longitude", Number(lng))
            updateField("geoData.mapZoom", Number(newZoom))
          }}
        />
      </div>
    </FormSection>
  )
}
