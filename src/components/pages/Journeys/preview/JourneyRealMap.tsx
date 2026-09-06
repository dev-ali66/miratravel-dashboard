/* =====================================================
   JOURNEYS — INTERACTIVE REAL MAP COMPONENT
   Uses MapLibre GL with CartoDB Voyager / Positron vector tiles
   Renders real GPS coordinates, route polyline, and pins
===================================================== */

import { useEffect, useRef, useState, useCallback } from "react"
import * as maplibregl from "maplibre-gl"
import "maplibre-gl/dist/maplibre-gl.css"
// @ts-ignore
import maplibreWorkerUrl from "maplibre-gl/dist/maplibre-gl-worker.mjs?url"
import { Layers, Maximize2, RotateCcw, ZoomIn, ZoomOut } from "lucide-react"
import { cn } from "@/lib/utils"

// Setup local worker URL or fallback
if (typeof window !== "undefined") {
  try {
    const hasGetWorkerUrl = typeof (maplibregl as any).getWorkerUrl === "function"
    if (hasGetWorkerUrl && !(maplibregl as any).getWorkerUrl()) {
      if (typeof maplibreWorkerUrl === "string" && maplibreWorkerUrl.length) {
        ;(maplibregl as any).setWorkerUrl(maplibreWorkerUrl)
      } else {
        const version = "6.6.0"
        ;(maplibregl as any).setWorkerUrl(
          `https://unpkg.com/maplibre-gl@${version}/dist/maplibre-gl-worker.mjs`
        )
      }
    }
  } catch {
    // Ignore worker registration errors
  }
}

function escapeHtml(str: string): string {
  return (str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
}

// Famous Balkan & Albanian destination coordinates [lng, lat]
const KNOWN_COORDINATES: Record<string, [number, number]> = {
  shkoder: [19.5126, 42.0683],
  shkodër: [19.5126, 42.0683],
  theth: [19.7744, 42.3978],
  valbona: [19.8944, 42.4533],
  valbone: [19.8944, 42.4533],
  koman: [19.8247, 42.1122],
  tirana: [19.8187, 41.3275],
  tiranë: [19.8187, 41.3275],
  berat: [19.9522, 40.7058],
  gjirokaster: [20.1389, 40.0758],
  gjirokastër: [20.1389, 40.0758],
  sarande: [20.0053, 39.8756],
  sarandë: [20.0053, 39.8756],
  vlore: [19.4914, 40.4667],
  vlorë: [19.4914, 40.4667],
  durres: [19.45, 41.323],
  durrës: [19.45, 41.323],
  kruje: [19.7944, 41.5094],
  krujë: [19.7944, 41.5094],
  korce: [20.7808, 40.6158],
  korçë: [20.7808, 40.6158],
  pogradec: [20.6556, 40.9019],
  himare: [19.7447, 40.1017],
  himarë: [19.7447, 40.1017],
  dhermi: [19.6417, 40.15],
  dhërmi: [19.6417, 40.15],
  ksamil: [20.0058, 39.7686],
  butrint: [20.0198, 39.7442],
  kotor: [18.7712, 42.4247],
  budva: [18.8403, 42.2911],
  ulcinj: [19.2144, 41.9311],
  podgorica: [19.2636, 42.4411],
  ohrid: [20.8016, 41.1172],
  skopje: [21.4314, 42.0],
  prizren: [20.7415, 42.2153],
  pristina: [21.1655, 42.6629],
  mostar: [17.808, 43.3438],
  sarajevo: [18.4131, 43.8563],
  dubrovnik: [18.0944, 42.6507],
}

const MAP_STYLES = {
  voyager: {
    name: "Travel",
    url: "https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json",
  },
  positron: {
    name: "Minimal",
    url: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
  },
  dark: {
    name: "Dark",
    url: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
  },
}

export interface StopItem {
  id: string | number
  idx: number
  name: string
  days: string
  dayCount: number
  daysList: any[]
  image: string
  multimedia?: any
  geoData?: { latitude: number | null; longitude: number | null } | null
  locationId?: string | null
  isAddon?: boolean
}

export interface JourneyRealMapProps {
  stops: StopItem[]
  selectedStopIdx: number | null
  hoveredStopIdx: number | null
  hoverSource?: "sidebar" | "map"
  onSelectStop: (idx: number, stop: StopItem) => void
  onHoverStop: (idx: number | null, source?: "sidebar" | "map") => void
  className?: string
}

function resolveCoordinates(stop: StopItem, idx: number, total: number): [number, number] {
  if (
    typeof stop.geoData?.latitude === "number" &&
    typeof stop.geoData?.longitude === "number" &&
    !isNaN(stop.geoData.latitude) &&
    !isNaN(stop.geoData.longitude) &&
    (stop.geoData.latitude !== 0 || stop.geoData.longitude !== 0)
  ) {
    return [Number(stop.geoData.longitude), Number(stop.geoData.latitude)]
  }

  const raw = (stop.name || "").toLowerCase().trim()
  if (KNOWN_COORDINATES[raw]) {
    return KNOWN_COORDINATES[raw]
  }

  for (const [key, coords] of Object.entries(KNOWN_COORDINATES)) {
    if (raw.includes(key) || key.includes(raw)) {
      return coords
    }
  }

  // Fallback: interpolate natural corridor in Albania/Balkans
  const ratio = total > 1 ? idx / (total - 1) : 0.5
  const baseLng = 19.5 + ratio * 0.75
  const baseLat = 41.2 + ratio * 1.2
  return [baseLng, baseLat]
}

export function JourneyRealMap({
  stops,
  selectedStopIdx,
  hoveredStopIdx,
  hoverSource = "sidebar",
  onSelectStop,
  onHoverStop,
  className,
}: JourneyRealMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<maplibregl.Map | null>(null)
  const markersRef = useRef<maplibregl.Marker[]>([])
  const [activeStyle, setActiveStyle] = useState<keyof typeof MAP_STYLES>("voyager")
  const [mapLoaded, setMapLoaded] = useState(false)

  // Calculate coordinates for each stop
  const stopCoordinates = useRef<Array<{ idx: number; coords: [number, number]; stop: StopItem }>>([])
  stopCoordinates.current = stops.map((stop, idx) => ({
    idx,
    coords: resolveCoordinates(stop, idx, stops.length),
    stop,
  }))

  // Auto-fit all stops into the map bounds
  const fitAllBounds = useCallback(() => {
    const map = mapRef.current
    if (!map || stopCoordinates.current.length === 0) return

    const coords = stopCoordinates.current.map((item) => item.coords)
    const bounds = new maplibregl.LngLatBounds(coords[0], coords[0])
    for (const c of coords) {
      bounds.extend(c)
    }

    map.fitBounds(bounds, {
      padding: { top: 60, bottom: 60, left: 240, right: 60 },
      maxZoom: 12,
      duration: 800,
    })
  }, [])

  // Initialize Map
  useEffect(() => {
    if (typeof window === "undefined" || !containerRef.current) return

    if (!mapRef.current) {
      const initialCoords: [number, number] =
        stopCoordinates.current.length > 0
          ? stopCoordinates.current[0].coords
          : [19.8187, 41.3275]

      const map = new maplibregl.Map({
        container: containerRef.current,
        style: MAP_STYLES[activeStyle].url,
        center: initialCoords,
        zoom: 7.5,
        attributionControl: false,
      })

      map.on("load", () => {
        setMapLoaded(true)
        map.resize()
      })

      mapRef.current = map
    }

    return () => {
      if (mapRef.current) {
        markersRef.current.forEach((m) => m.remove())
        markersRef.current = []
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [activeStyle])

  // Handle ResizeObserver to keep map pixel-perfect inside split panes
  useEffect(() => {
    if (!containerRef.current || !mapRef.current) return

    const observer = new ResizeObserver(() => {
      mapRef.current?.resize()
    })
    observer.observe(containerRef.current)

    return () => observer.disconnect()
  }, [])

  const pinElementsRef = useRef<Map<number, HTMLElement>>(new Map())
  const onSelectStopRef = useRef(onSelectStop)
  onSelectStopRef.current = onSelectStop
  const onHoverStopRef = useRef(onHoverStop)
  onHoverStopRef.current = onHoverStop

  // Update Route Polyline & Markers on Map
  useEffect(() => {
    const map = mapRef.current
    if (!map || !mapLoaded) return

    // Clear previous markers
    markersRef.current.forEach((m) => m.remove())
    markersRef.current = []
    pinElementsRef.current.clear()

    const coordsList = stopCoordinates.current.map((item) => item.coords)

    // Route GeoJSON Source & Layers
    const lineGeoJSON: any = {
      type: "Feature",
      properties: {},
      geometry: {
        type: "LineString",
        coordinates: coordsList,
      },
    }

    if (map.getSource("route-polyline")) {
      ;(map.getSource("route-polyline") as any).setData(lineGeoJSON)
    } else {
      map.addSource("route-polyline", {
        type: "geojson",
        data: lineGeoJSON,
      })

      // Outer glow / halo line
      map.addLayer({
        id: "route-polyline-halo",
        type: "line",
        source: "route-polyline",
        layout: { "line-cap": "round", "line-join": "round" },
        paint: {
          "line-color": "#ffffff",
          "line-width": 5.5,
          "line-opacity": 0.85,
        },
      })

      // Inner brand dotted route line
      map.addLayer({
        id: "route-polyline-line",
        type: "line",
        source: "route-polyline",
        layout: { "line-cap": "round", "line-join": "round" },
        paint: {
          "line-color": "#af6348",
          "line-width": 3,
          "line-dasharray": [2, 2],
        },
      })
    }

    // Add Markers for each stop
    stopCoordinates.current.forEach(({ idx, coords, stop }) => {
      const isSelected = selectedStopIdx === idx
      const isHovered = hoveredStopIdx === idx
      const isAddon = stop.isAddon

      const el = document.createElement("div")
      el.className = "journey-real-map-pin"
      el.style.cursor = "pointer"

      el.innerHTML = `
        <div class="pin-inner ${isSelected ? "is-selected" : ""} ${isHovered ? "is-hovered" : ""} ${isAddon ? "is-addon" : ""}">
          <div class="pin-badge">
            <span class="pin-idx">${isAddon ? '+' : idx + 1}</span>
            <span class="pin-text">${escapeHtml(stop.name)}</span>
          </div>
          <div class="pin-dot"></div>
        </div>
      `

      const innerEl = el.querySelector(".pin-inner") as HTMLElement
      if (innerEl) {
        pinElementsRef.current.set(idx, innerEl)
      }

      el.addEventListener("click", (e) => {
        e.stopPropagation()
        onSelectStopRef.current(idx, stop)
        map.flyTo({
          center: coords,
          zoom: Math.max(map.getZoom(), 10.5),
          duration: 900,
        })
      })

      el.addEventListener("mouseenter", () => onHoverStopRef.current(idx, "map"))
      el.addEventListener("mouseleave", () => onHoverStopRef.current(null, "map"))

      const marker = new maplibregl.Marker({
        element: el,
        anchor: "bottom",
      })
        .setLngLat(coords)
        .addTo(map)

      markersRef.current.push(marker)
    })

    // Fit bounds once markers are initialized
    fitAllBounds()
  }, [stops, mapLoaded, fitAllBounds])

  // Sync marker visual states (is-hovered / is-selected) without rebuilding markers
  useEffect(() => {
    pinElementsRef.current.forEach((el, idx) => {
      el.classList.toggle("is-hovered", hoveredStopIdx === idx)
      el.classList.toggle("is-selected", selectedStopIdx === idx)
    })
  }, [hoveredStopIdx, selectedStopIdx])

  // Center map on stop point when hovered from sidebar
  useEffect(() => {
    if (hoveredStopIdx === null || !mapRef.current) return
    // Only animate camera to center when hovering from sidebar!
    if (hoverSource !== "sidebar") return

    const target = stopCoordinates.current.find((item) => item.idx === hoveredStopIdx)
    if (target) {
      mapRef.current.stop()
      mapRef.current.flyTo({
        center: target.coords,
        padding: { left: 240, top: 40, right: 40, bottom: 40 },
        zoom: Math.max(mapRef.current.getZoom(), 10),
        duration: 650,
        essential: true,
      })
    }
  }, [hoveredStopIdx, hoverSource])

  // Fly to stop when selected (e.g. clicked in sidebar or pin)
  useEffect(() => {
    if (selectedStopIdx === null || !mapRef.current) return
    const target = stopCoordinates.current.find((item) => item.idx === selectedStopIdx)
    if (target) {
      mapRef.current.stop()
      mapRef.current.flyTo({
        center: target.coords,
        padding: { left: 240, top: 40, right: 40, bottom: 40 },
        zoom: Math.max(mapRef.current.getZoom(), 10.5),
        duration: 800,
        essential: true,
      })
    }
  }, [selectedStopIdx])

  const prevSelectedRef = useRef<number | null>(null)
  useEffect(() => {
    if (prevSelectedRef.current !== null && selectedStopIdx === null && mapRef.current) {
      fitAllBounds()
    }
    prevSelectedRef.current = selectedStopIdx
  }, [selectedStopIdx, fitAllBounds])

  const handleZoomIn = () => mapRef.current?.zoomIn({ duration: 300 })
  const handleZoomOut = () => mapRef.current?.zoomOut({ duration: 300 })

  return (
    <div className={cn("relative size-full overflow-hidden bg-neutral-100", className)}>
      {/* Map Container */}
      <div ref={containerRef} className="size-full" />

      {/* Map Controls (Top Right: Style switcher & Reset Bounds) */}
      <div className="absolute top-3 md:top-6 right-3 md:right-6 z-20 flex items-center gap-1.5 bg-white/95 backdrop-blur-md shadow-md border border-black/10 rounded-full px-2 py-1 text-xs">
        <Layers className="size-3.5 text-muted-foreground ml-1" />
        {(Object.keys(MAP_STYLES) as Array<keyof typeof MAP_STYLES>).map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setActiveStyle(key)}
            className={cn(
              "px-2.5 py-1 rounded-full text-[11px] font-medium transition cursor-pointer",
              activeStyle === key
                ? "bg-[#af6348] text-white font-semibold shadow-xs"
                : "text-neutral-700 hover:bg-neutral-100"
            )}
          >
            {MAP_STYLES[key].name}
          </button>
        ))}

        <div className="w-px h-4 bg-border/60 mx-0.5" />

        <button
          type="button"
          onClick={fitAllBounds}
          title="Fit All Stops"
          className="p-1 rounded-full text-neutral-700 hover:bg-neutral-100 transition cursor-pointer"
        >
          <RotateCcw className="size-3.5" />
        </button>
      </div>

      {/* Map Zoom Controls (Bottom Right) */}
      <div className="absolute right-3 md:right-[31px] bottom-3 md:bottom-[27px] z-20 flex flex-col items-center gap-1.5 bg-[#F8F5F3]/95 backdrop-blur-md shadow-lg border border-black/10 rounded-full p-1.5">
        <button
          type="button"
          onClick={handleZoomIn}
          aria-label="Zoom in"
          title="Zoom In"
          className="size-8 flex items-center justify-center rounded-full text-neutral-800 hover:bg-neutral-200 active:scale-95 transition-colors cursor-pointer"
        >
          <ZoomIn className="size-4" />
        </button>
        <button
          type="button"
          onClick={handleZoomOut}
          aria-label="Zoom out"
          title="Zoom Out"
          className="size-8 flex items-center justify-center rounded-full text-neutral-800 hover:bg-neutral-200 active:scale-95 transition-colors cursor-pointer"
        >
          <ZoomOut className="size-4" />
        </button>
        <button
          type="button"
          onClick={fitAllBounds}
          aria-label="Fit View"
          title="Reset to Full Route"
          className="size-8 flex items-center justify-center rounded-full text-neutral-800 hover:bg-neutral-200 active:scale-95 transition-colors cursor-pointer"
        >
          <Maximize2 className="size-3.5 text-[#af6348]" />
        </button>
      </div>

      {/* Embedded CSS for Custom MapLibre Pins */}
      <style>{`
        .journey-real-map-pin {
          display: flex;
          flex-direction: column;
          align-items: center;
          user-select: none;
          pointer-events: auto;
        }
        .pin-inner {
          display: flex;
          flex-direction: column;
          align-items: center;
          transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .pin-inner:hover,
        .pin-inner.is-hovered {
          transform: translateY(-6px) scale(1.18);
          z-index: 60;
        }
        .pin-inner.is-selected {
          transform: translateY(-8px) scale(1.22);
          z-index: 70;
        }
        .pin-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          background: rgba(255, 255, 255, 0.96);
          border: 1.5px solid rgba(175, 99, 72, 0.35);
          color: #1c1917;
          border-radius: 9999px;
          padding: 3px 9px 3px 4px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15), 0 1px 3px rgba(0,0,0,0.1);
          font-family: inherit;
          backdrop-filter: blur(4px);
          transition: all 0.2s ease;
        }
        .pin-inner.is-hovered .pin-badge {
          background: #af6348;
          border-color: #ffffff;
          color: #ffffff;
          box-shadow: 0 0 0 5px rgba(175, 99, 72, 0.25), 0 8px 20px rgba(175, 99, 72, 0.4);
        }
        .pin-inner.is-selected .pin-badge {
          background: #af6348;
          border-color: #ffffff;
          color: #ffffff;
          box-shadow: 0 0 0 6px rgba(175, 99, 72, 0.35), 0 10px 24px rgba(175, 99, 72, 0.5);
        }
        
        /* Add-on styles */
        .pin-inner.is-addon .pin-badge {
          border-color: rgba(212, 175, 55, 0.5);
        }
        .pin-inner.is-addon:hover .pin-badge,
        .pin-inner.is-addon.is-hovered .pin-badge {
          background: #d4af37;
          border-color: #ffffff;
          color: #ffffff;
          box-shadow: 0 0 0 5px rgba(212, 175, 55, 0.25), 0 8px 20px rgba(212, 175, 55, 0.4);
        }
        .pin-inner.is-addon.is-selected .pin-badge {
          background: #d4af37;
          border-color: #ffffff;
          color: #ffffff;
          box-shadow: 0 0 0 6px rgba(212, 175, 55, 0.35), 0 10px 24px rgba(212, 175, 55, 0.5);
        }

        .pin-idx {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 18px;
          height: 18px;
          border-radius: 9999px;
          background: rgba(175, 99, 72, 0.15);
          color: #af6348;
          font-size: 10px;
          font-weight: 700;
        }
        .pin-inner.is-selected .pin-idx,
        .pin-inner.is-hovered .pin-idx {
          background: rgba(255, 255, 255, 0.25);
          color: #ffffff;
        }
        
        .pin-inner.is-addon .pin-idx {
          color: #d4af37;
          background: rgba(212, 175, 55, 0.15);
        }
        .pin-inner.is-addon.is-selected .pin-idx,
        .pin-inner.is-addon.is-hovered .pin-idx {
          background: rgba(255, 255, 255, 0.25);
          color: #ffffff;
        }

        .pin-text {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: -0.01em;
          white-space: nowrap;
          max-width: 110px;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .pin-dot {
          width: 7px;
          height: 7px;
          border-radius: 9999px;
          background: #af6348;
          border: 1.5px solid #ffffff;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
          margin-top: 1px;
        }
        .pin-inner.is-selected .pin-dot {
          background: #af6348;
          transform: scale(1.3);
        }
        
        .pin-inner.is-addon .pin-dot {
          background: #d4af37;
        }
        .pin-inner.is-addon.is-selected .pin-dot {
          background: #d4af37;
        }
      `}</style>
    </div>
  )
}
