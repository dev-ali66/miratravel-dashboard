/* =====================================================
   GEODATA — FORM SECTION
   Auto-migrated from the legacy LocationForm.tsx monolith.
===================================================== */

import { Field, FormSection } from "../../shared/fields"
import type { LocationData } from "../../locationTypes"
import MapLibrePreview from "../../../../ui/MapLibrePreview"

export type GeoDataFormProps = {
    draft: LocationData
    updateField: (path: string, value: unknown) => void
    openSections: Record<string, boolean>
    toggleSection: (section: string) => void
}

export function GeoDataForm({
    draft,
    updateField,
    openSections,
    toggleSection,
}: GeoDataFormProps) {

    return (
                <FormSection
                    title="Geo Information"
                    active={
                        !!openSections["geo-data"]
                    }
                    onClick={() =>
                        toggleSection(
                            "geo-data"
                        )
                    }
                >
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <Field
                            label="Latitude"
                            value={
                                draft.geoData
                                    .latitude
                            }
                            onChange={(
                                value
                            ) =>
                                updateField(
                                    "geoData.latitude",
                                    Number(
                                        value
                                    )
                                )
                            }
                        />

                        <Field
                            label="Longitude"
                            value={
                                draft.geoData
                                    .longitude
                            }
                            onChange={(
                                value
                            ) =>
                                updateField(
                                    "geoData.longitude",
                                    Number(
                                        value
                                    )
                                )
                            }
                        />

                        <Field
                            label="Map Zoom"
                            value={
                                draft.geoData
                                    .mapZoom
                            }
                            onChange={(
                                value
                            ) =>
                                updateField(
                                    "geoData.mapZoom",
                                    Number(
                                        value
                                    )
                                )
                            }
                        />

                        <Field
                            label="Timezone"
                            value={
                                draft.geoData
                                    .timezone
                            }
                            onChange={(
                                value
                            ) =>
                                updateField(
                                    "geoData.timezone",
                                    value
                                )
                            }
                        />

                        <Field
                            label="Area Value"
                            value={
                                draft.geoData
                                    .area.value
                            }
                            onChange={(
                                value
                            ) =>
                                updateField(
                                    "geoData.area.value",
                                    Number(
                                        value
                                    )
                                )
                            }
                        />

                        <Field
                            label="Area Unit"
                            value={
                                draft.geoData
                                    .area.unit
                            }
                            onChange={(
                                value
                            ) =>
                                updateField(
                                    "geoData.area.unit",
                                    value
                                )
                            }
                        />
                    </div>
                    <div className="mt-4">
                        <MapLibrePreview
                            latitude={draft.geoData.latitude}
                            longitude={draft.geoData.longitude}
                            zoom={draft.geoData.mapZoom}
                            draggable={true}
                            onChange={(lat, lng, newZoom) => {
                                updateField("geoData.latitude", Number(lat));
                                updateField("geoData.longitude", Number(lng));
                                updateField("geoData.mapZoom", Number(newZoom));
                            }}
                        />
                    </div>
                </FormSection>
    )
}
