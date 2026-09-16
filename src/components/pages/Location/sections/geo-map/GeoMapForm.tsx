import { DynamicStyledField } from "@/components/pages/CMS/shared/FormControls"
import { UniversalMultimediaForm } from "@/components/pages/CMS/shared/UniversalMultimediaForm"
import { FormSection } from "../../shared/fields"
import type { LocationFormSectionProps } from "../../config/locationSections"
import { emptyLocation } from "../../shared/emptyLocation"

export function GeoMapForm({
  draft,
  updateField,
  openSections,
  toggleSection,
}: LocationFormSectionProps) {
  const geoData = draft?.geoData || {
    title: "Interactive Map",
    description:
      "Spin the globe, then zoom into the Albanian Riviera to explore our properties.",
    backgroundMultimedia: null,
    latitude: 41.1533,
    longitude: 20.1683,
    mapZoom: 4,
    timezone: "UTC+1 (CET)",
    area: {
      value: 28748,
      unit: "km²",
    },
    showChildren: true,
  }

  const isOpen = Boolean(openSections["geo-map"])

  const updateGeoField = (fieldKey: string, value: any) => {
    if (["latitude", "longitude", "mapZoom", "pitch", "bearing", "timezone", "area"].includes(fieldKey)) {
      updateField(`geoData.geo.${fieldKey}`, value)
    } else {
      updateField(`geoData.${fieldKey}`, value)
    }
  }

  const isShowChildren = geoData.showChildren !== false

  return (
    <FormSection
      title="06. Interactive Map & Geo Data"
      active={isOpen}
      onClick={() => toggleSection("geo-map")}
    >
      <div className="flex flex-col gap-5">
        {/* 1. Section Title */}
        <DynamicStyledField
          type="text"
          label="Section Title"
          fieldName="geoData.title"
          placeholder="e.g. Interactive Map"
          value={geoData.title}
          onChange={(val) => updateGeoField("title", val)}
        />

        {/* 2. Subtitle / Description */}
        <DynamicStyledField
          type="textarea"
          label="Subtitle / Description"
          fieldName="geoData.description"
          placeholder="e.g. Spin the globe, then zoom into the destination to explore our properties."
          value={geoData.description}
          onChange={(val) => updateGeoField("description", val)}
        />

        {/* 3. Section Background Multimedia */}
        <UniversalMultimediaForm
          title="Section Background Media"
          fieldName="geoData.backgroundMultimedia"
          imageFieldName="locationGeoMapBackgroundImage"
          videoFieldName="locationGeoMapBackgroundVideo"
          value={
            geoData.backgroundMultimedia ||
            emptyLocation.geoData?.backgroundMultimedia ||
            null
          }
          onChange={(multimedia) =>
            updateGeoField("backgroundMultimedia", multimedia)
          }
        />

        {/* 4. Map Center Coordinates & Settings */}
        <div className="rounded-xl border border-border/70 bg-card p-4 space-y-4 shadow-2xs">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground border-b border-border/50 pb-2">
            Map Viewport & Coordinates
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Latitude */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-foreground">
                Latitude (Mother Pin)
              </label>
              <input
                type="number"
                step="any"
                value={geoData.geo?.latitude ?? geoData.latitude ?? 41.1533}
                onChange={(e) =>
                  updateGeoField("latitude", parseFloat(e.target.value) || 0)
                }
                placeholder="e.g. 41.1533"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            {/* Longitude */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-foreground">
                Longitude (Mother Pin)
              </label>
              <input
                type="number"
                step="any"
                value={geoData.geo?.longitude ?? geoData.longitude ?? 20.1683}
                onChange={(e) =>
                  updateGeoField("longitude", parseFloat(e.target.value) || 0)
                }
                placeholder="e.g. 20.1683"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            {/* Default Map Zoom */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-foreground">
                Map Zoom Level (1 - 20)
              </label>
              <input
                type="number"
                min={1}
                max={20}
                value={geoData.geo?.mapZoom ?? geoData.mapZoom ?? 4}
                onChange={(e) =>
                  updateGeoField("mapZoom", parseInt(e.target.value, 10) || 4)
                }
                placeholder="e.g. 4"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            {/* Map Pitch / Tilt */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-foreground">
                Camera Pitch / Tilt (0 - 85°)
              </label>
              <input
                type="number"
                min={0}
                max={85}
                value={geoData.geo?.pitch ?? geoData.pitch ?? 0}
                onChange={(e) =>
                  updateGeoField("pitch", parseInt(e.target.value, 10) || 0)
                }
                placeholder="e.g. 0"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            {/* Area (Value & Unit) */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-foreground">
                Area Size (km²)
              </label>
              <input
                type="number"
                value={geoData.geo?.area?.value ?? geoData.area?.value ?? 28748}
                onChange={(e) =>
                  updateGeoField("area", {
                    ...(geoData.geo?.area || geoData.area),
                    value: parseFloat(e.target.value) || 0,
                  })
                }
                placeholder="e.g. 28748"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            {/* Timezone */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-foreground">
                Timezone
              </label>
              <input
                type="text"
                value={geoData.geo?.timezone ?? geoData.timezone ?? ""}
                onChange={(e) => updateGeoField("timezone", e.target.value)}
                placeholder="e.g. UTC+1 (CET)"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>
        </div>

        {/* 5. Show Child Locations (True / False Toggle Switch) */}
        <div className="flex items-center justify-between rounded-xl border border-border/70 bg-card p-4 shadow-2xs">
          <div className="space-y-0.5">
            <label className="text-xs font-semibold text-foreground cursor-pointer">
              Show Child Location Pins on Map
            </label>
            <p className="text-[11px] text-muted-foreground">
              Automatically display linked child location pins on the interactive map.
            </p>
          </div>

          <button
            type="button"
            role="switch"
            aria-checked={isShowChildren}
            onClick={() => updateGeoField("showChildren", !isShowChildren)}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${isShowChildren ? "bg-primary" : "bg-muted"
              }`}
          >
            <span
              aria-hidden="true"
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${isShowChildren ? "translate-x-5" : "translate-x-0"
                }`}
            />
          </button>
        </div>
      </div>
    </FormSection>
  )
}

export default GeoMapForm
