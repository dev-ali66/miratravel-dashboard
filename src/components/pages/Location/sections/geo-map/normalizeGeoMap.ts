import { normalizeMultimedia, normalizeStyledField } from "../../shared/normalizeHelpers"
import { emptyGeoData } from "./emptyGeoMap"

export function normalizeGeoMap(rawGeoData: any) {
  const safeGeoData = rawGeoData && typeof rawGeoData === "object" ? rawGeoData : {}

  const rawGeoObj = safeGeoData.geo ?? safeGeoData.location ?? safeGeoData.map ?? emptyGeoData.geo ?? {}
  const geoLat = Number(rawGeoObj.latitude ?? safeGeoData.latitude ?? emptyGeoData.geo.latitude)
  const geoLng = Number(rawGeoObj.longitude ?? safeGeoData.longitude ?? emptyGeoData.geo.longitude)
  const geoZoom = Number(rawGeoObj.mapZoom ?? safeGeoData.mapZoom ?? emptyGeoData.geo.mapZoom)
  const geoPitch = Number(rawGeoObj.pitch ?? safeGeoData.pitch ?? emptyGeoData.geo.pitch)
  const geoBearing = Number(rawGeoObj.bearing ?? safeGeoData.bearing ?? emptyGeoData.geo.bearing)
  const geoTz = rawGeoObj.timezone ?? safeGeoData.timezone ?? emptyGeoData.geo.timezone
  const geoArea = {
    value: Number(rawGeoObj.area?.value ?? safeGeoData.area?.value ?? emptyGeoData.geo.area.value),
    unit: rawGeoObj.area?.unit ?? safeGeoData.area?.unit ?? emptyGeoData.geo.area.unit,
  }

  const showChildrenVal =
    safeGeoData.showChildren !== undefined
      ? Boolean(safeGeoData.showChildren)
      : (emptyGeoData.showChildren ?? true)

  const normalizedGeoData = {
    title: normalizeStyledField(
      safeGeoData.title ?? emptyGeoData.title,
      "Interactive Map",
      "#0a0a0a"
    ),
    description: normalizeStyledField(
      safeGeoData.description ?? emptyGeoData.description,
      "Spin the globe, then zoom into the destination to explore our properties.",
      "#565e69"
    ),
    backgroundMultimedia: normalizeMultimedia(
      safeGeoData.backgroundMultimedia || emptyGeoData.backgroundMultimedia,
      "color"
    ),
    geo: {
      latitude: geoLat,
      longitude: geoLng,
      mapZoom: geoZoom,
      pitch: geoPitch,
      bearing: geoBearing,
      timezone: geoTz,
      area: geoArea,
    },
    // Top-level aliases for universal compatibility across map components
    latitude: geoLat,
    longitude: geoLng,
    mapZoom: geoZoom,
    pitch: geoPitch,
    bearing: geoBearing,
    timezone: geoTz,
    area: geoArea,
    showChildren: showChildrenVal,
  }

  return normalizedGeoData
}


