import { useEffect, useRef, useState, useMemo } from "react"
import * as maplibregl from "maplibre-gl"
import "maplibre-gl/dist/maplibre-gl.css"
// @ts-ignore
import maplibreWorkerUrl from "maplibre-gl/dist/maplibre-gl-worker.mjs?url"
import { DynamicStyledTextPreview } from "@/components/pages/CMS/shared/DynamicStyledTextPreview"
import { UniversalMultimediaPreview } from "@/components/pages/CMS/Home/shared/preview/UniversalMultimediaPreview"
import type { LocationPreviewSectionProps } from "../../config/locationSections"
import { useGetLocationPages } from "@/hooks/location/useGetLocation"
import { ArrowUpRight, Compass, MapPin, X } from "lucide-react"

const BASE_STYLE = "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"

export type MapPinData = {
  id: string | number
  name: string
  category?: string
  lat: number
  lng: number
  isMother?: boolean
  image?: string
  heroTitle?: string
  heroSubtitle?: string
  heroBreadcrumb?: string
  heroButtonText?: string
  href?: string
}

export function GeoMapPreview({ draft }: LocationPreviewSectionProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<maplibregl.Map | null>(null)
  const markersRef = useRef<maplibregl.Marker[]>([])
  
  // Active / Hovered pin state for displaying Hero Data card
  const [activePin, setActivePin] = useState<MapPinData | null>(null)
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const { data: locationPagesResponse } = useGetLocationPages({ limit: 100 })
  const availableLocations = locationPagesResponse?.data || []

  const geoData = draft?.geoData || (draft as any)?.data?.geoData || {
    title: null,
    description: null,
    backgroundMultimedia: null,
    latitude: 41.1533,
    longitude: 20.1683,
    mapZoom: 4,
    pitch: 0,
    bearing: 0,
    showChildren: true,
  }

  const motherLat = Number(geoData.geo?.latitude ?? geoData.latitude) || 41.1533
  const motherLng = Number(geoData.geo?.longitude ?? geoData.longitude) || 20.1683
  const initialZoom = Number(geoData.geo?.mapZoom ?? geoData.mapZoom) || 4
  const showChildren = geoData.showChildren !== false

  // Mother pin definition with full Hero Data
  const motherPin: MapPinData = useMemo(() => {
    const motherHeroMedia = draft?.hero?.backgroundMultimedia
    const motherImg =
      motherHeroMedia?.image?.url ||
      draft?.hero?.image?.url ||
      draft?.card?.background_image ||
      ""

    const hTitle =
      typeof draft?.hero?.title === "object"
        ? draft?.hero?.title?.value
        : draft?.hero?.title || draft?.name || "Mother Location"

    const hSubtitle =
      typeof draft?.hero?.subtitle === "object"
        ? draft?.hero?.subtitle?.value
        : typeof draft?.hero?.description === "object"
        ? draft?.hero?.description?.value
        : draft?.hero?.subtitle || draft?.hero?.description || ""

    const hBreadcrumb =
      typeof draft?.hero?.breadcrumb === "object"
        ? draft?.hero?.breadcrumb?.value
        : draft?.hero?.breadcrumb || draft?.type || "Mother Destination"

    const btnText =
      draft?.hero?.button?.name ||
      `Explore ${draft?.name || "Destination"}`

    return {
      id: `mother-${draft?.id || "root"}`,
      name: draft?.name || "Mother Location",
      category: `${draft?.type || "COUNTRY"} • MAIN DESTINATION`,
      lat: motherLat,
      lng: motherLng,
      isMother: true,
      image: motherImg,
      heroTitle: hTitle,
      heroSubtitle: hSubtitle,
      heroBreadcrumb: hBreadcrumb,
      heroButtonText: btnText,
      href: `/destinations/${draft?.slug || "destinations"}`,
    }
  }, [draft, motherLat, motherLng])

  // Child pins definition with full Hero Data
  const childPins: MapPinData[] = useMemo(() => {
    if (!showChildren) return []

    const parentSlug = draft?.slug || "destinations"

    const matchingChildLocations = availableLocations.filter(
      (loc) =>
        loc.id !== draft?.id &&
        ((loc.parentId && loc.parentId === draft?.id) ||
          ((loc as any).parent?.id && (loc as any).parent?.id === draft?.id) ||
          draft?.children?.some((c) => c.id === loc.id || c.name === loc.name))
    )

    const resolvedChildren = matchingChildLocations
      .map((loc) => {
        const rawGeoObj = (loc.geoData as any)?.geo ?? loc.geoData ?? {}
        const cLat = Number(rawGeoObj.latitude ?? (loc as any).lat)
        const cLng = Number(rawGeoObj.longitude ?? (loc as any).lng)

        // Only include if valid coordinates exist in child geoData
        if (!cLat || !cLng || isNaN(cLat) || isNaN(cLng)) return null

        const heroMedia = loc.hero?.backgroundMultimedia
        const imgUrl =
          heroMedia?.image?.url ||
          loc.hero?.image?.url ||
          loc.card?.background_image ||
          ""

        const hTitle =
          typeof loc.hero?.title === "object"
            ? loc.hero?.title?.value
            : loc.hero?.title || loc.name

        const hSubtitle =
          typeof loc.hero?.subtitle === "object"
            ? loc.hero?.subtitle?.value
            : typeof loc.hero?.description === "object"
            ? loc.hero?.description?.value
            : loc.hero?.subtitle || loc.hero?.description || ""

        const hBreadcrumb =
          typeof loc.hero?.breadcrumb === "object"
            ? loc.hero?.breadcrumb?.value
            : loc.hero?.breadcrumb || loc.type || "Region"

        const btnText =
          loc.hero?.button?.name ||
          `Explore ${loc.name}`

        return {
          id: loc.id || loc.slug,
          name: loc.name,
          category: hBreadcrumb,
          lat: cLat,
          lng: cLng,
          isMother: false,
          image: imgUrl,
          heroTitle: hTitle,
          heroSubtitle: hSubtitle,
          heroBreadcrumb: hBreadcrumb,
          heroButtonText: btnText,
          href: `/destinations/${parentSlug}/${loc.slug}`,
        }
      })
      .filter(Boolean) as MapPinData[]

    return resolvedChildren
  }, [availableLocations, draft, showChildren])

  // Combine Map Pins (Mother always included; Children included if showChildren is true)
  const allMapPins: MapPinData[] = useMemo(() => {
    return [motherPin, ...childPins]
  }, [motherPin, childPins])

  // Clear hover timer on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current)
      }
    }
  }, [])

  // Initialize MapLibre
  useEffect(() => {
    if (typeof window === "undefined" || !mapContainerRef.current) return

    try {
      const hasGetWorkerUrl =
        typeof (maplibregl as any).getWorkerUrl === "function"
      const currentWorker = hasGetWorkerUrl
        ? (maplibregl as any).getWorkerUrl()
        : null
      if (hasGetWorkerUrl && !currentWorker) {
        if (typeof maplibreWorkerUrl === "string" && maplibreWorkerUrl.length) {
          try {
            ;(maplibregl as any).setWorkerUrl(maplibreWorkerUrl)
          } catch (err) {
            // ignore
          }
        }
        if (!(maplibregl as any).getWorkerUrl()) {
          const version = "6.8.0"
          ;(maplibregl as any).setWorkerUrl(
            `https://unpkg.com/maplibre-gl@${version}/dist/maplibre-gl-worker.mjs`
          )
        }
      }
    } catch (e) {
      // ignore
    }

    if (!mapRef.current) {
      const map = new maplibregl.Map({
        container: mapContainerRef.current,
        style: BASE_STYLE,
        center: [motherLng, motherLat],
        zoom: initialZoom,
        pitch: Number(geoData.pitch) || 0,
        bearing: Number(geoData.bearing) || 0,
        minZoom: 1,
        maxZoom: 20,
        attributionControl: false,
      })

      mapRef.current = map

      map.on("load", () => {
        // Set globe projection & sky styling
        try {
          map.setProjection({ type: "globe" as any })
          map.setSky({
            "sky-color": "#f6f5f2",
            "sky-horizon-blend": 0.6,
            "horizon-color": "#e6e3dc",
            "horizon-fog-blend": 0.6,
            "fog-color": "#f2f1ee",
            "fog-ground-blend": 0.7,
            "atmosphere-blend": ["interpolate", ["linear"], ["zoom"], 0, 1, 6, 1, 9, 0],
          } as any)
        } catch (err) {
          // ignore
        }

        // Apply light map theme recoloring without wiping out vector basemap details
        const style = map.getStyle()
        if (style?.layers) {
          for (const layer of style.layers) {
            try {
              if (layer.type === "background") {
                map.setPaintProperty(layer.id, "background-color", "#F6F3EB")
              } else if (layer.type === "fill") {
                if (layer.id.includes("water") || layer.id.includes("ocean")) {
                  map.setPaintProperty(layer.id, "fill-color", "#D5E1E3")
                } else if (layer.id.includes("building")) {
                  map.setPaintProperty(layer.id, "fill-color", "#EFEBE2")
                } else if (
                  layer.id.includes("park") ||
                  layer.id.includes("landuse") ||
                  layer.id.includes("wood")
                ) {
                  map.setPaintProperty(layer.id, "fill-color", "#E7ECE0")
                } else if (layer.id.includes("land")) {
                  map.setPaintProperty(layer.id, "fill-color", "#F6F3EB")
                }
              } else if (layer.type === "line") {
                if (layer.id.includes("water")) {
                  map.setPaintProperty(layer.id, "line-color", "#D5E1E3")
                } else if (layer.id.includes("admin") || layer.id.includes("border") || layer.id.includes("boundary")) {
                  map.setPaintProperty(layer.id, "line-color", "#D2C5B2")
                } else if (
                  layer.id.includes("road") ||
                  layer.id.includes("street") ||
                  layer.id.includes("highway")
                ) {
                  map.setPaintProperty(layer.id, "line-color", "#E9E3D8")
                }
              }
            } catch (e) {
              // ignore
            }
          }
        }
      })
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [])

  // Sync center when motherLat/motherLng change
  useEffect(() => {
    if (!mapRef.current) return
    mapRef.current.jumpTo({
      center: [motherLng, motherLat],
      zoom: initialZoom,
    })
  }, [motherLat, motherLng, initialZoom])

  // Sync markers on the map with flicker-free hover handlers
  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    // Clear old markers
    markersRef.current.forEach((m) => m.remove())
    markersRef.current = []

    allMapPins.forEach((place) => {
      const lat = Number(place.lat) || 0
      const lng = Number(place.lng) || 0
      if (!lat || !lng) return

      // Create Custom Pin DOM element
      const el = document.createElement("div")
      el.className =
        "relative flex cursor-pointer items-center justify-center select-none pin-marker-container"
      el.style.width = "40px"
      el.style.height = "40px"
      el.style.pointerEvents = "auto"

      if (place.isMother) {
        // MOTHER LOCATION PIN
        const ping = document.createElement("span")
        ping.className = "absolute h-9 w-9 rounded-full pointer-events-none"
        ping.style.backgroundColor = "#1f3d2b"
        ping.style.opacity = "0.2"
        el.appendChild(ping)

        const halo = document.createElement("span")
        halo.className = "absolute h-8 w-8 rounded-full border-2 border-[#1f3d2b]/60 pointer-events-none"
        el.appendChild(halo)

        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg")
        svg.setAttribute("width", "36")
        svg.setAttribute("height", "36")
        svg.setAttribute("viewBox", "0 0 24 24")
        svg.setAttribute("fill", "none")
        svg.setAttribute("class", "relative drop-shadow-[0_4px_8px_rgba(0,0,0,0.35)] pointer-events-none")

        const path = document.createElementNS("http://www.w3.org/2000/svg", "path")
        path.setAttribute(
          "d",
          "M12 2C7.3 2 3.5 5.8 3.5 10.5C3.5 16.8 11.1 22.3 11.4 22.5C11.6 22.6 11.8 22.7 12 22.7C12.2 22.7 12.4 22.6 12.6 22.5C12.9 22.3 20.5 16.8 20.5 10.5C20.5 5.8 16.7 2 12 2Z"
        )
        path.setAttribute("fill", "#1f3d2b")
        path.setAttribute("stroke", "#ffffff")
        path.setAttribute("stroke-width", "1.8")
        path.setAttribute("stroke-linejoin", "round")
        svg.appendChild(path)

        const star = document.createElementNS("http://www.w3.org/2000/svg", "path")
        star.setAttribute(
          "d",
          "M12 6.5L13.5 9.5L16.8 10L14.4 12.3L15 15.5L12 14L9 15.5L9.6 12.3L7.2 10L10.5 9.5L12 6.5Z"
        )
        star.setAttribute("fill", "#ffffff")
        svg.appendChild(star)

        el.appendChild(svg)
      } else {
        // CHILD LOCATION PIN
        const ping = document.createElement("span")
        ping.className = "absolute h-7 w-7 rounded-full pointer-events-none"
        ping.style.backgroundColor = "var(--color-accent, #af6348)"
        ping.style.opacity = "0.2"
        el.appendChild(ping)

        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg")
        svg.setAttribute("width", "28")
        svg.setAttribute("height", "28")
        svg.setAttribute("viewBox", "0 0 24 24")
        svg.setAttribute("fill", "none")
        svg.setAttribute("class", "relative drop-shadow-[0_2px_4px_rgba(0,0,0,0.25)] pointer-events-none")

        const path = document.createElementNS("http://www.w3.org/2000/svg", "path")
        path.setAttribute(
          "d",
          "M12 2C7.86 2 4.5 5.36 4.5 9.5c0 5.5 6.5 11.5 7.13 12.07a.5.5 0 0 0 .74 0C13 21 19.5 15 19.5 9.5 19.5 5.36 16.14 2 12 2Z"
        )
        path.setAttribute("fill", "var(--color-accent-light, #b85c38)")
        path.setAttribute("stroke", "#ffffff")
        path.setAttribute("stroke-width", "1.5")
        path.setAttribute("stroke-linejoin", "round")
        svg.appendChild(path)

        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle")
        circle.setAttribute("cx", "12")
        circle.setAttribute("cy", "9.5")
        circle.setAttribute("r", "2.75")
        circle.setAttribute("fill", "#ffffff")
        svg.appendChild(circle)

        el.appendChild(svg)
      }

      // Smooth, flicker-free hover handlers
      el.addEventListener("mouseenter", () => {
        if (hoverTimeoutRef.current) {
          clearTimeout(hoverTimeoutRef.current)
          hoverTimeoutRef.current = null
        }
        setActivePin(place)
      })

      el.addEventListener("mouseleave", () => {
        if (hoverTimeoutRef.current) {
          clearTimeout(hoverTimeoutRef.current)
        }
        hoverTimeoutRef.current = setTimeout(() => {
          setActivePin(null)
        }, 300)
      })

      // Click to pin card and fly to coordinate
      el.addEventListener("click", (e) => {
        e.stopPropagation()
        if (hoverTimeoutRef.current) {
          clearTimeout(hoverTimeoutRef.current)
          hoverTimeoutRef.current = null
        }
        setActivePin(place)
        map.flyTo({
          center: [lng, lat],
          zoom: Math.max(map.getZoom(), 5),
          duration: 900,
          essential: true,
        })
      })

      const marker = new maplibregl.Marker({
        element: el,
        anchor: "center",
      })
        .setLngLat([lng, lat])
        .addTo(map)

      markersRef.current.push(marker)
    })
  }, [allMapPins])

  const handleZoomIn = () => {
    mapRef.current?.zoomIn()
  }

  const handleZoomOut = () => {
    mapRef.current?.zoomOut()
  }

  // Handlers for hero preview card hover persistence
  const handleCardMouseEnter = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current)
      hoverTimeoutRef.current = null
    }
  }

  const handleCardMouseLeave = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current)
    }
    hoverTimeoutRef.current = setTimeout(() => {
      setActivePin(null)
    }, 250)
  }

  return (
    <section
      data-section="geo-map"
      className="relative w-full py-[58px] md:py-[74px] lg:py-[84px] xl:py-[92px] overflow-hidden border-b border-border/40 font-sans"
    >
      {/* Background Media (Image / Video / Color) */}
      <UniversalMultimediaPreview
        multimedia={geoData.backgroundMultimedia}
        fallbackColor="transparent"
        mode="background"
      />

      <div
        id="interactive-map"
        className="relative z-10 w-full scroll-mt-24 container px-4 lg:px-0 mx-auto"
        style={{ perspective: "1200px" }}
      >
        <div className="mx-auto flex w-full flex-col items-center self-stretch">
          {/* Header Block */}
          <div className="flex w-full flex-col items-center self-stretch text-center">
            <DynamicStyledTextPreview
              as="h2"
              data={geoData.title}
              fallbackColor="#0a0a0a"
              className="self-stretch shrink-0 h-auto justify-start font-medium font-heading text-[28px] leading-[38px] md:text-[38px] md:leading-[47px] lg:text-[42px] lg:leading-[50px] lgx:text-[43px] lgx:leading-[51px] xlg:text-[44px] xlg:leading-[52px] mid:text-[46px] mid:leading-[54px] xl:text-[48px] xl:leading-[56px] 2xl:text-[50px] 2xl:leading-[58px] text-title text-center"
            />

            <DynamicStyledTextPreview
              as="p"
              data={geoData.description}
              fallbackColor="#565e69"
              className="mt-[11px] md:mt-3 lgx:mt-[13px] mid:mt-[14px] xl:mt-[15px] w-full max-w-[672px] text-center font-normal text-subtitle text-sm md:text-[15px] lg:text-[15.5px] lgx:text-base xlg:text-[16.5px] mid:text-[17px] xl:text-[18px] leading-[20px] md:leading-[22px] lg:leading-[23px] lgx:leading-[24px] xlg:leading-[25px] mid:leading-[26px] xl:leading-[28px] tracking-[1.2px] md:tracking-[1.6px] lg:tracking-[1.7px] lgx:tracking-[1.8px] xlg:tracking-[1.85px] mid:tracking-[1.9px] xl:tracking-[2px]"
            />
          </div>

          {/* Globe Container */}
          <div
            data-lenis-prevent="true"
            className="relative mt-6 md:mt-8 lg:mt-9 lgx:mt-[38px] xlg:mt-10 mid:mt-11 xl:mt-12 h-[500px] md:h-[600px] lg:h-[620px] lgx:h-[640px] xlg:h-[660px] mid:h-[680px] xl:h-[700px] w-full lg:max-w-[920px] lgx:max-w-[980px] xlg:max-w-[1080px] mid:max-w-[1180px] xl:max-w-[1280px] 2xl:max-w-[1360px] mx-auto overflow-hidden rounded-[12px] md:rounded-[14px] lg:rounded-[16px] lgx:rounded-[17px] xlg:rounded-[18px] mid:rounded-[19px] xl:rounded-[20px] flex items-center justify-center shadow-lg border border-border/40"
            style={{ backgroundColor: "rgb(246, 245, 242)" }}
          >
            {/* Ambient Background Radial Glows */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden select-none">
              <div
                className="absolute inset-0"
                style={{ backgroundColor: "rgb(246, 245, 242)" }}
              />
              <div
                className="absolute -top-1/4 -right-1/4 h-[550px] w-[550px] rounded-full blur-3xl"
                style={{
                  background:
                    "radial-gradient(circle, rgba(0, 0, 0, 0.03) 0%, transparent 70%)",
                }}
              />
              <div
                className="absolute -bottom-1/4 -left-1/4 h-[550px] w-[550px] rounded-full blur-3xl"
                style={{
                  background:
                    "radial-gradient(circle, rgba(0, 0, 0, 0.02) 0%, transparent 70%)",
                }}
              />
            </div>

            {/* MapLibre Map Canvas */}
            <div
              ref={mapContainerRef}
              data-lenis-prevent="true"
              className="relative z-10 h-full w-full !bg-transparent"
            />

            {/* Floating Zoom Controls at Bottom Right */}
            <div className="absolute right-3 md:right-[31px] lg:right-[33px] lgx:right-[35px] xlg:right-[36.5px] mid:right-[38px] xl:right-[40px] bottom-3 md:bottom-[27px] lg:bottom-[29px] lgx:bottom-[30px] xlg:bottom-[32px] mid:bottom-[33.5px] xl:bottom-[35px] z-20 flex flex-col items-center gap-2.5 md:gap-3 lg:gap-[12.5px] lgx:gap-[13px] xlg:gap-[13.25px] mid:gap-[13.75px] xl:gap-3.5 bg-white/95 backdrop-blur-md border border-border/80 rounded-full p-2 md:p-2.5 lg:p-[10.5px] lgx:p-[11px] xlg:p-[11.5px] mid:p-[11.75px] xl:p-3 select-none shadow-md">
              <button
                type="button"
                aria-label="Zoom in"
                onClick={handleZoomIn}
                className="size-7 md:size-8 lg:size-[33px] lgx:size-[34px] xlg:size-[34.5px] mid:size-[35.5px] xl:size-9 flex items-center justify-center rounded-full text-dark hover:bg-primary hover:text-white active:bg-primary/90 transition-colors duration-200 cursor-pointer p-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="size-3.5 md:size-4 lg:size-[16.5px] lgx:size-[17px] xlg:size-[17.25px] mid:size-[17.75px] xl:size-4.5"
                >
                  <path
                    d="M22.7999 10.8H13.2001V1.19992C13.2001 0.537693 12.6624 0 11.9999 0C11.3377 0 10.8 0.537693 10.8 1.19992V10.8H1.19992C0.537693 10.8 0 11.3377 0 11.9999C0 12.6624 0.537693 13.2001 1.19992 13.2001H10.8V22.7999C10.8 23.4624 11.3377 24.0001 11.9999 24.0001C12.6624 24.0001 13.2001 23.4624 13.2001 22.7999V13.2001H22.7999C23.4624 13.2001 24.0001 12.6624 24.0001 11.9999C24.0001 11.3377 23.4624 10.8 22.7999 10.8Z"
                    fill="currentColor"
                  />
                </svg>
              </button>
              <div className="w-3.5 md:w-4 lg:w-[16.5px] lgx:w-[17px] xlg:w-[17.25px] mid:w-[17.75px] xl:w-[18px] h-px bg-border/70" />
              <button
                type="button"
                aria-label="Zoom out"
                onClick={handleZoomOut}
                className="size-7 md:size-8 lg:size-[33px] lgx:size-[34px] xlg:size-[34.5px] mid:size-[35.5px] xl:size-9 flex items-center justify-center rounded-full text-dark hover:bg-primary hover:text-white active:bg-primary/90 transition-colors duration-200 cursor-pointer p-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="size-3.5 md:size-4 lg:size-[16.5px] lgx:size-[17px] xlg:size-[17.25px] mid:size-[17.75px] xl:size-4.5"
                >
                  <path
                    d="M1.44009 13.441H22.56C22.7491 13.441 22.9364 13.4038 23.1112 13.3314C23.2859 13.259 23.4447 13.1529 23.5784 13.0191C23.7121 12.8854 23.8182 12.7266 23.8906 12.5519C23.9629 12.3771 24.0002 12.1898 24.0001 12.0007C24.0002 11.8116 23.9629 11.6243 23.8906 11.4495C23.8182 11.2748 23.7121 11.116 23.5784 10.9823C23.4447 10.8486 23.2859 10.7425 23.1112 10.6701C22.9364 10.5978 22.7491 10.5605 22.56 10.5605H1.44009C1.06103 10.565 0.699007 10.7187 0.432527 10.9883C0.166048 11.2579 0.0166016 11.6217 0.0166016 12.0008C0.0166016 12.3799 0.166048 12.7437 0.432527 13.0133C0.699007 13.2829 1.06103 13.4366 1.44009 13.441Z"
                    fill="currentColor"
                  />
                </svg>
              </button>
            </div>

            {/* Bottom-Right Attribution */}
            <div className="absolute left-3 bottom-3 z-10 text-[10px] text-muted-foreground/70 bg-white/70 px-2 py-0.5 rounded backdrop-blur-sm pointer-events-none">
              © <span className="font-semibold">CARTO</span>, © OpenStreetMap contributors
            </div>

            {/* FLOATING LOCATION HERO DATA CARD ON HOVER / CLICK */}
            {activePin && (
              <div
                onMouseEnter={handleCardMouseEnter}
                onMouseLeave={handleCardMouseLeave}
                className="absolute z-30 left-3 bottom-3 md:left-6 md:bottom-6 w-[290px] sm:w-[330px] md:w-[360px] rounded-[18px] border border-border/80 bg-card/95 backdrop-blur-md shadow-[0_20px_50px_rgba(0,0,0,0.25)] overflow-hidden transition-all animate-in fade-in zoom-in-95 duration-200"
              >
                {/* Hero Photo / Media Header */}
                <div className="relative h-36 md:h-40 w-full overflow-hidden bg-muted">
                  {activePin.image ? (
                    <img
                      src={activePin.image}
                      alt={activePin.heroTitle || activePin.name}
                      className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground">
                      <MapPin className="h-8 w-8 opacity-40" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent pointer-events-none" />

                  {/* Close button */}
                  <button
                    type="button"
                    onClick={() => setActivePin(null)}
                    className="absolute top-2.5 right-2.5 flex h-6 w-6 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors cursor-pointer z-10"
                    title="Close card"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>

                  {/* Hero Breadcrumb / Category Tag Pill */}
                  <div className="absolute bottom-2.5 left-3 right-3 pointer-events-none">
                    <span
                      className={`inline-flex items-center gap-1 max-w-[90%] truncate rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider shadow-sm backdrop-blur-sm ${
                        activePin.isMother
                          ? "bg-[#1f3d2b] text-white border border-amber-300/40"
                          : "bg-white/95 text-primary border border-border/60"
                      }`}
                    >
                      {activePin.isMother && <span className="text-amber-300">★</span>}
                      {activePin.heroBreadcrumb || activePin.category || (activePin.isMother ? "Mother Location" : "Region")}
                    </span>
                  </div>
                </div>

                {/* Hero Content Details */}
                <div className="space-y-2.5 p-4 bg-card text-left">
                  <div>
                    <h3 className="font-heading text-base md:text-[17px] font-semibold leading-snug text-foreground line-clamp-1">
                      {activePin.heroTitle || activePin.name}
                    </h3>
                    {activePin.heroSubtitle && (
                      <p className="mt-1 text-xs leading-relaxed text-muted-foreground line-clamp-2">
                        {activePin.heroSubtitle}
                      </p>
                    )}
                  </div>

                  {/* Action Button & Route Info */}
                  <div className="flex items-center justify-between pt-2 border-t border-border/60">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3.5 py-1.5 text-xs font-medium text-primary-foreground shadow-xs transition-all hover:opacity-90 cursor-pointer">
                      <span>{activePin.heroButtonText || "Explore"}</span>
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </span>

                    <span
                      title={activePin.href}
                      className="flex size-7 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors hover:bg-primary hover:text-primary-foreground cursor-pointer"
                    >
                      <Compass className="h-4 w-4" />
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default GeoMapPreview
