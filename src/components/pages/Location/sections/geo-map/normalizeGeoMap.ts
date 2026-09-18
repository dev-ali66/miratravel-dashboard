import { normalizeMultimedia, normalizeStyledField } from "../../shared/normalizeHelpers"

export function normalizeGeoMap(rawGeoData: any) {
  const safeGeoData = rawGeoData && typeof rawGeoData === "object" ? rawGeoData : {}

  const rawGeoObj = safeGeoData.geo ?? safeGeoData.location ?? safeGeoData.map ?? {}
  const geoLat = Number(rawGeoObj.latitude ?? safeGeoData.latitude ?? 41.1533)
  const geoLng = Number(rawGeoObj.longitude ?? safeGeoData.longitude ?? 20.1683)
  const geoZoom = Number(rawGeoObj.mapZoom ?? safeGeoData.mapZoom ?? 4)
  const geoPitch = Number(rawGeoObj.pitch ?? safeGeoData.pitch ?? 0)
  const geoBearing = Number(rawGeoObj.bearing ?? safeGeoData.bearing ?? 0)
  const geoTz = rawGeoObj.timezone ?? safeGeoData.timezone ?? "UTC+1 (CET)"
  const geoArea = {
    value: Number(rawGeoObj.area?.value ?? safeGeoData.area?.value ?? 28748),
    unit: rawGeoObj.area?.unit ?? safeGeoData.area?.unit ?? "km²",
  }

  const showChildrenVal =
    safeGeoData.showChildren !== undefined
      ? Boolean(safeGeoData.showChildren)
      : safeGeoData.children?.showChildren !== false

  const normalizedGeoData = {
    title: normalizeStyledField(
      safeGeoData.title,
      "Interactive Map",
      "#0a0a0a"
    ),
    description: normalizeStyledField(
      safeGeoData.description,
      "Spin the globe, then zoom into the destination to explore our properties.",
      "#565e69"
    ),
    backgroundMultimedia: normalizeMultimedia(
      safeGeoData.backgroundMultimedia,
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

