import { useEffect, useRef, useState } from "react"
import * as maplibregl from "maplibre-gl"
import "maplibre-gl/dist/maplibre-gl.css"
import { Search, MapPin, Loader2, X } from "lucide-react"
// Prefer a local worker URL when running under Vite to avoid CORS to unpkg
// The `?url` suffix tells Vite to return an asset URL. TypeScript may not recognize it, so ignore the type error.
// @ts-ignore
import maplibreWorkerUrl from "maplibre-gl/dist/maplibre-gl-worker.mjs?url"

type Props = {
  latitude: number
  longitude: number
  zoom: number
  className?: string
  draggable?: boolean
  onChange?: (lat: number, lng: number, zoom: number) => void
}

export default function MapLibrePreview({
  latitude,
  longitude,
  zoom,
  className,
  draggable = false,
  onChange,
}: Props) {
  const mapContainer = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<maplibregl.Map | null>(null)
  const markerRef = useRef<maplibregl.Marker | null>(null)
  const wrapperRef = useRef<HTMLDivElement | null>(null)
  const [coords, setCoords] = useState({
    lat: latitude ?? 0,
    lng: longitude ?? 0,
    zoom: zoom ?? 0,
  })

  // Geocoding Search States
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  function handleZoomIn() {
    const map = mapRef.current
    if (!map) return
    map.zoomIn()
    const center = map.getCenter()
    const z = map.getZoom()
    setCoords({ lat: center.lat, lng: center.lng, zoom: z })
    onChange?.(center.lat, center.lng, z)
  }

  function handleZoomOut() {
    const map = mapRef.current
    if (!map) return
    map.zoomOut()
    const center = map.getCenter()
    const z = map.getZoom()
    setCoords({ lat: center.lat, lng: center.lng, zoom: z })
    onChange?.(center.lat, center.lng, z)
  }

  function handleLocate() {
    const map = mapRef.current
    if (!map) return
    const lat = markerRef.current ? markerRef.current.getLngLat().lat : latitude
    const lng = markerRef.current
      ? markerRef.current.getLngLat().lng
      : longitude
    map.flyTo({
      center: [lng || 0, lat || 0],
      zoom: Math.max(map.getZoom(), 8),
    })
    const z = map.getZoom()
    setCoords({ lat: lat ?? 0, lng: lng ?? 0, zoom: z })
    onChange?.(lat ?? 0, lng ?? 0, z)
  }

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current)

    if (!value.trim() || value.length < 2) {
      setSearchResults([])
      setShowDropdown(false)
      setIsSearching(false)
      return
    }

    setIsSearching(true)
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(value.trim())}&limit=5`
        )
        const data = await res.json()
        setSearchResults(Array.isArray(data) ? data : [])
        setShowDropdown(true)
      } catch (err) {
        setSearchResults([])
      } finally {
        setIsSearching(false)
      }
    }, 400)
  }

  const handleSelectLocation = (place: any) => {
    const lat = parseFloat(place.lat)
    const lng = parseFloat(place.lon)
    if (isNaN(lat) || isNaN(lng)) return

    const newZoom = 10
    const map = mapRef.current
    if (map) {
      map.flyTo({ center: [lng, lat], zoom: newZoom })
      if (markerRef.current) {
        markerRef.current.setLngLat([lng, lat])
      }
    }

    setCoords({ lat, lng, zoom: newZoom })
    onChange?.(lat, lng, newZoom)
    setSearchQuery(place.display_name?.split(",")[0] || place.display_name)
    setShowDropdown(false)
  }

  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current)
    }
  }, [])

  useEffect(() => {
    if (typeof window === "undefined") return

    if (!mapContainer.current) return

    if (!mapRef.current) {
      // set canonical worker JS URL to avoid application/octet-stream MIME errors on production static servers
      try {
        const version = (maplibregl as any).getVersion?.() || "6.8.0"
        ;(maplibregl as any).setWorkerUrl(
          `https://unpkg.com/maplibre-gl@${version}/dist/maplibre-gl-worker.js`
        )
      } catch (e) {
        // ignore failures to set worker URL
      }

      mapRef.current = new maplibregl.Map({
        container: mapContainer.current,
        style:
          "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
        center: [longitude || 0, latitude || 0],
        zoom: zoom ?? 6,
      })

      markerRef.current = new maplibregl.Marker({ draggable })
        .setLngLat([longitude || 0, latitude || 0])
        .addTo(mapRef.current)

      // marker drag end -> report new coords
      markerRef.current.on("dragend", () => {
        const lngLat = markerRef.current!.getLngLat()
        const currentZoom = mapRef.current!.getZoom()
        setCoords({ lat: lngLat.lat, lng: lngLat.lng, zoom: currentZoom })
        onChange?.(lngLat.lat, lngLat.lng, currentZoom)
      })

      // map click -> move marker & update coords
      mapRef.current.on("click", (e) => {
        if (draggable && markerRef.current) {
          const { lat, lng } = e.lngLat
          markerRef.current.setLngLat([lng, lat])
          const currentZoom = mapRef.current!.getZoom()
          setCoords({ lat, lng, zoom: currentZoom })
          onChange?.(lat, lng, currentZoom)
        }
      })

      // map move end -> report new zoom/center
      mapRef.current.on("moveend", () => {
        const center = mapRef.current!.getCenter()
        const currentZoom = mapRef.current!.getZoom()
        setCoords({ lat: center.lat, lng: center.lng, zoom: currentZoom })
        onChange?.(center.lat, center.lng, currentZoom)
      })
    }

    const map = mapRef.current
    if (!map) return

    // update view when props change
    map.jumpTo({ center: [longitude || 0, latitude || 0], zoom: zoom ?? 6 })

    // keep local coords in sync with props
    setCoords({ lat: latitude ?? 0, lng: longitude ?? 0, zoom: zoom ?? 0 })

    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [])

  // watch for prop changes and update marker/center
  useEffect(() => {
    const map = mapRef.current
    if (!map) return
    map.jumpTo({ center: [longitude || 0, latitude || 0], zoom: zoom ?? 6 })

    // update marker position and draggable
    if (!markerRef.current) {
      markerRef.current = new maplibregl.Marker({ draggable })
        .setLngLat([longitude || 0, latitude || 0])
        .addTo(map)
    } else {
      markerRef.current.setLngLat([longitude || 0, latitude || 0])
      // @ts-ignore - maplibre types include setDraggable on Marker
      if (typeof (markerRef.current as any).setDraggable === "function") {
        try {
          ;(markerRef.current as any).setDraggable(draggable)
        } catch (e) {
          /* ignore */
        }
      }
    }
  }, [latitude, longitude, zoom])

  return (
    <div
      ref={wrapperRef}
      className={`relative overflow-hidden ${
        className ?? "h-[300px] w-full rounded-md"
      }`}
    >
      <div ref={mapContainer} className="h-full w-full" />

      {/* Geocoding Search Overlay */}
      <div className="absolute top-3 left-3 z-30 w-[230px] sm:w-[270px]">
        <div className="relative flex items-center">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            onFocus={() => searchResults.length > 0 && setShowDropdown(true)}
            placeholder="Search location (e.g. Bangladesh, Tirana)..."
            className="w-full rounded-md border border-border/80 bg-white/95 px-3 py-1.5 pl-8 pr-7 text-xs text-foreground placeholder:text-muted-foreground/60 shadow-md backdrop-blur-md focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <Search className="absolute left-2.5 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
          {isSearching ? (
            <Loader2 className="absolute right-2.5 h-3.5 w-3.5 animate-spin text-muted-foreground" />
          ) : searchQuery ? (
            <button
              type="button"
              onClick={() => {
                setSearchQuery("")
                setSearchResults([])
                setShowDropdown(false)
              }}
              className="absolute right-2 h-4 w-4 rounded-full text-muted-foreground hover:text-foreground flex items-center justify-center"
            >
              <X className="h-3 w-3" />
            </button>
          ) : null}
        </div>

        {/* Dropdown Results */}
        {showDropdown && searchResults.length > 0 && (
          <div className="absolute left-0 top-full mt-1 w-full max-h-44 overflow-y-auto rounded-md border border-border/80 bg-white/95 shadow-lg backdrop-blur-md z-40 py-1">
            {searchResults.map((place, idx) => (
              <button
                key={place.place_id || idx}
                type="button"
                onClick={() => handleSelectLocation(place)}
                className="w-full text-left px-2.5 py-1.5 text-xs hover:bg-primary/10 transition-colors flex items-start gap-1.5 border-b border-border/30 last:border-b-0 cursor-pointer"
              >
                <MapPin className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                <span className="truncate text-foreground font-medium">
                  {place.display_name}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="absolute top-3 right-3 z-20 flex flex-col gap-2">
        <button
          type="button"
          aria-label="Zoom in"
          onClick={handleZoomIn}
          className="rounded-md bg-white/90 p-2 text-black shadow"
        >
          +
        </button>

        <button
          type="button"
          aria-label="Zoom out"
          onClick={handleZoomOut}
          className="rounded-md bg-white/90 p-2 text-black shadow"
        >
          −
        </button>

        <button
          type="button"
          aria-label="Locate"
          onClick={handleLocate}
          className="rounded-md bg-white/90 p-2 text-black shadow"
        >
          ⌖
        </button>
      </div>
      <div className="absolute bottom-3 left-3 z-20 rounded-md bg-white/90 p-2 text-xs text-black shadow">
        <div>Lat: {coords.lat.toFixed(5)}</div>
        <div>Lng: {coords.lng.toFixed(5)}</div>
        <div>Zoom: {coords.zoom.toFixed(2)}</div>
      </div>
    </div>
  )
}
