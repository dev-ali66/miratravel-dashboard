/* =====================================================
   JOURNEYS — LOCATION SEARCH COMBOBOX
   Search and select locations dynamically for itinerary days
   Supports consecutive / duplicate selection across days
===================================================== */

import { useState, useRef, useEffect } from "react"
import { Search, MapPin, X, Loader2, Check } from "lucide-react"
import { useJourneyLocations, type JourneyLocationItem } from "@/hooks/journey"
import { cn } from "@/lib/utils"

export interface SelectedLocation {
  id: string
  name: string
  slug?: string
  type?: string
  geoData?: {
    latitude: number | null
    longitude: number | null
  } | null
}

export interface LocationSearchComboboxProps {
  valueLocationId?: string | null
  valueLocationName?: string | null
  onSelect: (location: SelectedLocation | null) => void
  label?: string
  placeholder?: string
  className?: string
  disabled?: boolean
}

export function LocationSearchCombobox({
  valueLocationId,
  valueLocationName,
  onSelect,
  label = "Location",
  placeholder = "Search destinations, cities, villages...",
  className,
  disabled = false,
}: LocationSearchComboboxProps) {
  const [query, setQuery] = useState("")
  const [debouncedQuery, setDebouncedQuery] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Debounce search query by 250ms
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query.trim())
    }, 250)
    return () => clearTimeout(handler)
  }, [query])

  // Fetch locations from journey dedicated hook
  const { data, isLoading, isFetching } = useJourneyLocations({
    page: 1,
    limit: 40,
    search: debouncedQuery || undefined,
  })

  const locations: JourneyLocationItem[] = data?.data || []

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSelect = (loc: JourneyLocationItem) => {
    const lat = typeof loc.geoData?.latitude === "number" ? loc.geoData.latitude : null
    const lng = typeof loc.geoData?.longitude === "number" ? loc.geoData.longitude : null

    onSelect({
      id: loc.id,
      name: loc.name,
      slug: loc.slug,
      type: loc.type,
      geoData: {
        latitude: lat,
        longitude: lng,
      },
    })
    setIsOpen(false)
    setQuery("")
  }

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    onSelect(null)
    setQuery("")
  }

  const hasSelection = Boolean(valueLocationId || valueLocationName)

  return (
    <div ref={containerRef} className={cn("relative space-y-1.5 w-full", className)}>
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
          <MapPin className="h-3.5 w-3.5 text-primary" />
          {label}
        </label>
        {hasSelection && (
          <span className="text-[11px] text-muted-foreground">
            ID: <span className="font-mono text-[10px] text-primary">{valueLocationId || "custom"}</span>
          </span>
        )}
      </div>

      {/* Selected location chip OR Search Input */}
      {hasSelection ? (
        <div className="flex items-center justify-between gap-2 rounded-lg border border-primary/30 bg-primary/5 px-3 py-2 text-sm transition-all hover:bg-primary/10">
          <div className="flex items-center gap-2 min-w-0">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
              <MapPin className="h-3.5 w-3.5" />
            </span>
            <div className="flex flex-col min-w-0">
              <span className="font-medium text-xs text-foreground truncate">
                {valueLocationName || "Selected Location"}
              </span>
              <span className="text-[10px] text-muted-foreground truncate">
                Selected for this itinerary stop
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              className="rounded px-2 py-1 text-[11px] font-medium text-primary hover:bg-primary/20 transition-colors"
            >
              Change
            </button>
            <button
              type="button"
              onClick={handleClear}
              aria-label="Remove location"
              className="rounded p-1 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      ) : (
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            {isLoading || isFetching ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />
            ) : (
              <Search className="h-3.5 w-3.5 text-muted-foreground" />
            )}
          </div>
          <input
            type="text"
            disabled={disabled}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              if (!isOpen) setIsOpen(true)
            }}
            onFocus={() => setIsOpen(true)}
            placeholder={placeholder}
            className="w-full rounded-lg border border-border bg-background py-2 pl-9 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      )}

      {/* Floating Dropdown List */}
      {isOpen && (
        <div className="absolute z-50 mt-1 max-h-60 w-full overflow-y-auto rounded-lg border border-border bg-popover p-1 shadow-lg backdrop-blur-md animate-in fade-in-0 zoom-in-95">
          {/* Active search input inside dropdown when a selection was already active */}
          {hasSelection && (
            <div className="p-1 border-b border-border/50 mb-1">
              <div className="relative">
                <Search className="pointer-events-none absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                <input
                  type="text"
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Type to search another location..."
                  className="w-full rounded-md border border-border/80 bg-background py-1.5 pl-8 pr-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>
          )}

          {isLoading ? (
            <div className="flex items-center justify-center gap-2 py-6 text-xs text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
              <span>Searching locations...</span>
            </div>
          ) : locations.length === 0 ? (
            <div className="py-4 text-center">
              <p className="text-xs text-muted-foreground">
                {debouncedQuery ? `No locations matching "${debouncedQuery}"` : "No locations available"}
              </p>
              {debouncedQuery && (
                <button
                  type="button"
                  onClick={() => {
                    onSelect({
                      id: `custom_${Date.now()}`,
                      name: debouncedQuery,
                    })
                    setIsOpen(false)
                    setQuery("")
                  }}
                  className="mt-2 text-xs text-primary underline hover:text-primary/80"
                >
                  Use "{debouncedQuery}" as custom location name
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-0.5">
              {locations.map((loc) => {
                const isSelected = valueLocationId === loc.id
                return (
                  <button
                    key={loc.id}
                    type="button"
                    onClick={() => handleSelect(loc)}
                    className={cn(
                      "flex w-full items-center justify-between rounded-md px-2.5 py-2 text-left text-xs transition-colors cursor-pointer",
                      isSelected
                        ? "bg-primary/15 text-primary font-medium"
                        : "hover:bg-muted/70 text-foreground"
                    )}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <MapPin className={cn("h-3.5 w-3.5 shrink-0", isSelected ? "text-primary" : "text-muted-foreground")} />
                      <div className="flex flex-col min-w-0">
                        <span className="font-medium truncate">{loc.name}</span>
                        {loc.parent?.name && (
                          <span className="text-[10px] text-muted-foreground truncate">
                            in {loc.parent.name}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {loc.type && (
                        <span className="rounded bg-secondary/80 px-1.5 py-0.5 text-[9px] font-semibold text-secondary-foreground uppercase tracking-wide">
                          {loc.type}
                        </span>
                      )}
                      {isSelected && <Check className="h-3.5 w-3.5 text-primary" />}
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
