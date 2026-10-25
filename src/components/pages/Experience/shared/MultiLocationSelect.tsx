/* =====================================================
   EXPERIENCE — MULTI-LOCATION SELECT
   Searchable, multi-select location picker supporting
   linking multiple Countries, Regions, or Places to an
   Experience as an array of IDs.
===================================================== */

import { useEffect, useState, useRef } from "react"
import { Loader2, MapPin, X, ChevronDown, Search, Check, Compass } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  useSearchLocations,
  type LocationSearchItem,
} from "@/hooks/location/useGetLocation"
import { useGetLocationById } from "@/hooks/location/useGetLocationById"

type MultiLocationSelectProps = {
  values?: Array<string | { id: string; name?: string }> | null
  filterType: "COUNTRY" | "REGION" | "PLACE"
  label: string
  placeholder?: string
  onChange: (ids: string[]) => void
}

function SelectedLocationBadge({
  id,
  fallbackName,
  onRemove,
}: {
  id: string
  fallbackName?: string
  onRemove: (id: string) => void
}) {
  const { data: rawData, isLoading } = useGetLocationById(id)
  const innerData = rawData?.data !== undefined ? rawData.data : rawData
  const loc = Array.isArray(innerData)
    ? innerData[0]
    : innerData?.items && Array.isArray(innerData.items)
      ? innerData.items[0]
      : innerData
  const name = loc?.name || fallbackName || (isLoading ? "Loading..." : `ID: ${id.slice(-6)}`)

  return (
    <span className="inline-flex items-center gap-1.5 rounded-lg border border-border/80 bg-card px-2.5 py-1 text-xs font-medium text-foreground shadow-2xs transition-all hover:border-border">
      <MapPin className="h-3 w-3 text-primary shrink-0" />
      <span className="truncate max-w-[160px]">{name}</span>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          onRemove(id)
        }}
        className="rounded-full p-0.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors cursor-pointer"
        title="Remove"
      >
        <X className="h-3 w-3" />
      </button>
    </span>
  )
}

export function MultiLocationSelect({
  values = [],
  filterType,
  label,
  placeholder = "Search and select locations...",
  onChange,
}: MultiLocationSelectProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [debouncedQuery, setDebouncedQuery] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  const selectedIds = Array.isArray(values)
    ? values.map((v) => (typeof v === "string" ? v : v?.id)).filter(Boolean)
    : []

  // Local cache of known location names: id -> name
  const [nameCache, setNameCache] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {}
    if (Array.isArray(values)) {
      values.forEach((v) => {
        if (typeof v === "object" && v?.id && v?.name) {
          initial[v.id] = v.name
        }
      })
    }
    return initial
  })

  // Sync incoming values with nameCache
  useEffect(() => {
    if (Array.isArray(values) && values.length > 0) {
      setNameCache((prev) => {
        let changed = false
        const next = { ...prev }
        values.forEach((v) => {
          if (typeof v === "object" && v?.id && v?.name && next[v.id] !== v.name) {
            next[v.id] = v.name
            changed = true
          }
        })
        return changed ? next : prev
      })
    }
  }, [values])

  // Debounce search query
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedQuery(query)
    }, 200)
    return () => clearTimeout(timeout)
  }, [query])

  // Fetch matching locations
  const { data: searchResponse, isLoading } = useSearchLocations(
    open ? debouncedQuery : "",
    filterType,
    50
  )

  const options: LocationSearchItem[] = searchResponse?.data || []

  // Sync options from search with nameCache
  useEffect(() => {
    if (options && options.length > 0) {
      setNameCache((prev) => {
        let changed = false
        const next = { ...prev }
        options.forEach((opt) => {
          if (opt?.id && opt?.name && next[opt.id] !== opt.name) {
            next[opt.id] = opt.name
            changed = true
          }
        })
        return changed ? next : prev
      })
    }
  }, [options])

  const handleToggle = (option: LocationSearchItem) => {
    setNameCache((prev) => ({ ...prev, [option.id]: option.name }))
    if (selectedIds.includes(option.id)) {
      onChange(selectedIds.filter((item) => item !== option.id))
    } else {
      onChange([...selectedIds, option.id])
    }
  }

  const handleRemove = (id: string) => {
    onChange(selectedIds.filter((item) => item !== id))
  }

  const handleClearAll = (e: React.MouseEvent) => {
    e.stopPropagation()
    onChange([])
  }

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-foreground block">
          {label}
        </label>
        {selectedIds.length > 0 && (
          <button
            type="button"
            onClick={handleClearAll}
            className="text-[11px] text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
          >
            Clear all ({selectedIds.length})
          </button>
        )}
      </div>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div
            role="button"
            tabIndex={0}
            className={cn(
              "flex min-h-[38px] w-full items-center justify-between gap-2 rounded-lg border border-border/70 bg-card px-3 py-1.5 text-xs font-medium text-foreground outline-none transition-colors hover:border-border focus:border-primary focus:ring-1 focus:ring-primary shadow-2xs cursor-pointer",
              open && "border-primary ring-1 ring-primary"
            )}
          >
            <div className="flex flex-wrap items-center gap-1.5 flex-1 min-w-0">
              {selectedIds.length > 0 ? (
                selectedIds.map((id) => (
                  <SelectedLocationBadge
                    key={id}
                    id={id}
                    fallbackName={nameCache[id]}
                    onRemove={handleRemove}
                  />
                ))
              ) : (
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <Compass className="h-3.5 w-3.5" />
                  {placeholder}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1 shrink-0 text-muted-foreground">
              <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", open && "rotate-180")} />
            </div>
          </div>
        </PopoverTrigger>

        <PopoverContent
          align="start"
          className="w-[340px] p-0 shadow-lg border border-border/80 bg-popover"
        >
          {/* Search Input Header */}
          <div className="flex items-center gap-2 border-b border-border/60 px-3 py-2">
            <Search className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`Filter ${filterType.toLowerCase()}s...`}
              className="w-full bg-transparent text-xs text-foreground placeholder:text-muted-foreground outline-none"
              autoFocus
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Options List */}
          <div className="max-h-60 overflow-y-auto p-1 text-xs">
            {isLoading ? (
              <div className="flex items-center justify-center py-6 text-muted-foreground gap-2">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>Searching {filterType.toLowerCase()}s...</span>
              </div>
            ) : options.length === 0 ? (
              <div className="py-6 text-center text-muted-foreground">
                {query ? "No matching locations found" : `No ${filterType.toLowerCase()}s available`}
              </div>
            ) : (
              options.map((option) => {
                const isSelected = selectedIds.includes(option.id)
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => handleToggle(option)}
                    className={cn(
                      "flex w-full items-center justify-between gap-2 rounded-sm px-2.5 py-2 text-left transition-colors cursor-pointer",
                      isSelected
                        ? "bg-primary/10 text-primary font-semibold"
                        : "hover:bg-muted text-foreground"
                    )}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <MapPin className={cn("h-3.5 w-3.5 shrink-0", isSelected ? "text-primary" : "text-muted-foreground")} />
                      <div className="truncate">
                        <p className="truncate font-medium">{option.name}</p>
                        {option.parent?.name && (
                          <p className="text-[10px] text-muted-foreground truncate">
                            in {option.parent.name}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="rounded bg-muted px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
                        {option.type || filterType}
                      </span>
                      {isSelected && (
                        <Check className="h-3.5 w-3.5 text-primary" />
                      )}
                    </div>
                  </button>
                )
              })
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
