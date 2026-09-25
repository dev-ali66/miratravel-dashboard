/* =====================================================
   LOCATION — PARENT LOCATION SELECT
   Searchable, Glance-style live location picker.
   Displays `name`, `type`, parent context & thumbnail,
   stores `id` in the draft. Uses GET /locations/search
   via useSearchLocations hook.
===================================================== */

import { useEffect, useState } from "react"
import { Loader2, MapPin, X, ChevronDown, Search, Check } from "lucide-react"
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

type ParentLocationSelectProps = {
  value: string | null | undefined
  /** Current parent's display name, if already known (edit mode). */
  currentName?: string | null
  /** Excludes a location from its own parent options (edit mode). */
  excludeId?: string
  onChange: (id: string | null, name: string | null) => void
  /** Field label. Defaults to "Parent Location". */
  label?: string
  /** Label shown for the "clear" option. Defaults to "No parent (top-level)". */
  noneLabel?: string
  placeholder?: string
}

export function ParentLocationSelect({
  value,
  currentName,
  excludeId,
  onChange,
  label = "Parent Location",
  noneLabel = "No parent (top-level)",
  placeholder = "Search location by name, slug or type...",
}: ParentLocationSelectProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [debouncedQuery, setDebouncedQuery] = useState("")
  const [selectedName, setSelectedName] = useState<string | null>(
    currentName ?? null
  )

  // keep the displayed name in sync if currentName changes from outside
  useEffect(() => {
    if (currentName !== undefined) {
      setSelectedName(currentName)
    }
  }, [currentName])

  // debounce search query
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedQuery(query)
    }, 250)
    return () => clearTimeout(timeout)
  }, [query])

  // fetch matching locations using live search hook
  const { data: searchResponse, isLoading } = useSearchLocations(
    open ? debouncedQuery : "",
    undefined,
    50
  )

  const rawResults: LocationSearchItem[] = searchResponse?.data || []
  const options = rawResults.filter((item) => !excludeId || item.id !== excludeId)

  // if value is set but selectedName is null, try finding name in options
  useEffect(() => {
    if (value && !selectedName && options.length > 0) {
      const match = options.find((o) => o.id === value || o.slug === value)
      if (match) {
        setSelectedName(match.name)
      }
    }
  }, [value, selectedName, options])

  const handleSelect = (option: LocationSearchItem) => {
    setSelectedName(option.name)
    onChange(option.id, option.name)
    setOpen(false)
    setQuery("")
  }

  const handleClear = () => {
    setSelectedName(null)
    onChange(null, null)
    setOpen(false)
    setQuery("")
  }

  return (
    <div className="space-y-1.5">
      {label && (
        <label className="text-xs font-semibold text-foreground mb-1 block">
          {label}
        </label>
      )}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className="flex w-full items-center justify-between rounded-lg border border-border/60 bg-background px-3 py-2 text-left text-xs transition-all outline-none hover:border-border focus:border-primary shadow-2xs cursor-pointer"
          >
            <span
              className={cn(
                "flex items-center gap-2 truncate font-medium",
                !value && "text-muted-foreground font-normal"
              )}
            >
              <MapPin className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
              {value ? (selectedName ?? "Selected location") : noneLabel}
            </span>

            <div className="flex shrink-0 items-center gap-1.5">
              {value && (
                <span
                  role="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleClear()
                  }}
                  className="rounded p-0.5 text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer"
                  title="Clear selection"
                >
                  <X className="h-3.5 w-3.5" />
                </span>
              )}
              <ChevronDown
                className={cn(
                  "h-3.5 w-3.5 text-muted-foreground transition-transform duration-200",
                  open && "rotate-180"
                )}
              />
            </div>
          </button>
        </PopoverTrigger>

        <PopoverContent
          align="start"
          sideOffset={4}
          className="z-50 w-[var(--radix-popover-trigger-width)] max-w-[95vw] min-w-[280px] rounded-lg border border-border bg-popover p-0 shadow-xl"
        >
          {/* Live Search Input Header */}
          <div className="flex items-center border-b border-border/60 px-3 py-2.5">
            <Search className="mr-2 h-4 w-4 shrink-0 text-muted-foreground pointer-events-none" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={placeholder}
              className="w-full bg-transparent text-xs text-foreground outline-none placeholder:text-muted-foreground/60"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="rounded p-0.5 text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Options List */}
          <div className="custom-scrollbar max-h-64 overflow-y-auto divide-y divide-border/30 p-1">
            {/* Clear option */}
            <button
              type="button"
              onClick={handleClear}
              className={cn(
                "flex w-full items-center justify-between rounded-md px-2.5 py-2 text-left text-xs transition-colors hover:bg-muted/70 cursor-pointer",
                !value && "bg-primary/10 font-semibold text-primary"
              )}
            >
              <span className="truncate">{noneLabel}</span>
              {!value && <Check className="h-3.5 w-3.5 shrink-0 text-primary" />}
            </button>

            {isLoading && (
              <div className="flex items-center justify-center gap-2 py-6 text-xs text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                Searching locations...
              </div>
            )}

            {!isLoading && options.length === 0 && (
              <div className="py-6 text-center text-xs text-muted-foreground">
                {query ? `No locations found matching "${query}"` : "No locations available."}
              </div>
            )}

            {!isLoading &&
              options.map((option) => {
                const isSelected = option.id === value || option.slug === value
                const heroMedia = option.hero?.backgroundMultimedia
                const thumbUrl =
                  heroMedia?.image?.url ||
                  option.hero?.image?.url ||
                  option.card?.background_image ||
                  ""

                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => handleSelect(option)}
                    className={cn(
                      "flex w-full items-center justify-between gap-2.5 rounded-md p-2 text-left text-xs transition-colors hover:bg-muted/70 cursor-pointer",
                      isSelected && "bg-primary/10 font-semibold text-primary"
                    )}
                  >
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      {/* Mini Thumbnail */}
                      <div className="relative h-8 w-11 shrink-0 overflow-hidden rounded border border-border/70 bg-muted flex items-center justify-center">
                        {thumbUrl ? (
                          <img
                            src={thumbUrl}
                            alt={option.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <MapPin className="h-3.5 w-3.5 text-muted-foreground/50" />
                        )}
                      </div>

                      <div className="flex flex-col min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="truncate text-xs font-semibold text-foreground">
                            {option.name}
                          </span>
                          <span className="shrink-0 rounded bg-primary/10 px-1.5 py-0.5 text-[9px] font-semibold uppercase text-primary">
                            {option.type}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-[10px] text-muted-foreground mt-0.5">
                          {option.parent?.name && (
                            <span>In {option.parent.name}</span>
                          )}
                          <span className="font-mono text-[9px] opacity-70">
                            /{option.slug}
                          </span>
                        </div>
                      </div>
                    </div>

                    {isSelected && (
                      <Check className="h-4 w-4 shrink-0 text-primary" />
                    )}
                  </button>
                )
              })}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}

export default ParentLocationSelect

