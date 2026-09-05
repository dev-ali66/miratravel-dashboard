/* =====================================================
   LOCATION — PARENT LOCATION SELECT
   Searchable, API-driven parent picker. Displays `name`,
   stores `id` in the draft. Uses GET /locations?search=...
   (backend-driven, debounced) — never a hardcoded list.

   Edit mode: the current parent's name is resolved from
   `draft.parent` (the backend always includes it via
   Prisma `include: { parent: true }` on GET /locations),
   so no extra request is needed just to show the label.

   Uses Radix Popover (portaled) so suggestions are NEVER
   clipped by parent overflow-hidden or covered by sibling
   form sections.
===================================================== */

import { useEffect, useState } from "react"
import { Loader2, MapPin, X, ChevronDown, Search } from "lucide-react"
import { apiPrivate } from "@/lib/api-client"
import { cn } from "@/lib/utils"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

type ParentOption = {
  id: string
  name: string
  type: string
}

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
}

export function ParentLocationSelect({
  value,
  currentName,
  excludeId,
  onChange,
  label = "Parent Location",
  noneLabel = "No parent (top-level)",
}: ParentLocationSelectProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [debouncedQuery, setDebouncedQuery] = useState("")
  const [options, setOptions] = useState<ParentOption[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedName, setSelectedName] = useState<string | null>(
    currentName ?? null
  )

  // keep the displayed name in sync if the draft's resolved
  // parent name changes from outside (e.g. edit mode load)
  useEffect(() => {
    if (currentName !== undefined) {
      setSelectedName(currentName)
    }
  }, [currentName])

  // debounce the search query
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedQuery(query)
    }, 250)

    return () => clearTimeout(timeout)
  }, [query])

  // fetch matching locations whenever the debounced query changes
  // (or the dropdown opens with an empty query, to show recent options)
  useEffect(() => {
    if (!open) return

    let cancelled = false
    setIsLoading(true)

    apiPrivate
      .get<any>("/locations", {
        params: {
          limit: 20,
          ...(debouncedQuery ? { search: debouncedQuery } : {}),
        },
      })
      .then((res) => {
        if (cancelled) return

        const raw = res.data
        const list: ParentOption[] = Array.isArray(raw)
          ? raw
          : Array.isArray(raw?.data)
            ? raw.data
            : []

        const results = list.filter(
          (item) => !excludeId || item.id !== excludeId
        )

        setOptions(results)
      })
      .catch(() => {
        if (!cancelled) setOptions([])
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [open, debouncedQuery, excludeId])

  const handleSelect = (option: ParentOption) => {
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
        <label className="text-[11px] font-medium text-muted-foreground">
          {label}
        </label>
      )}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className="flex w-full items-center justify-between rounded-lg border border-border/60 bg-background px-3 py-2 text-left text-sm transition-colors outline-none hover:border-border focus:border-primary"
          >
            <span
              className={cn(
                "flex items-center gap-2 truncate",
                !value && "text-muted-foreground"
              )}
            >
              <MapPin className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
              {value ? (selectedName ?? "Selected location") : noneLabel}
            </span>

            <div className="flex shrink-0 items-center gap-1">
              {value && (
                <span
                  role="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleClear()
                  }}
                  className="rounded p-0.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                  title="Clear selection"
                >
                  <X className="h-3.5 w-3.5" />
                </span>
              )}
              <ChevronDown
                className={cn(
                  "h-3.5 w-3.5 text-muted-foreground transition-transform",
                  open && "rotate-180"
                )}
              />
            </div>
          </button>
        </PopoverTrigger>

        <PopoverContent
          align="start"
          sideOffset={4}
          className="z-50 w-[var(--radix-popover-trigger-width)] max-w-[95vw] min-w-[240px] rounded-lg border border-border/80 bg-popover p-0 shadow-xl"
        >
          {/* Search Header */}
          <div className="flex items-center border-b border-border/60 px-3 py-2">
            <Search className="mr-2 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search locations..."
              className="w-full bg-transparent text-xs outline-none placeholder:text-muted-foreground"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="rounded p-0.5 text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>

          {/* Options List */}
          <div className="custom-scrollbar max-h-60 overflow-y-auto p-1">
            <button
              type="button"
              onClick={handleClear}
              className="flex w-full items-center rounded-md px-2.5 py-1.5 text-left text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {noneLabel}
            </button>

            {isLoading && (
              <div className="flex items-center gap-2 px-2.5 py-2.5 text-xs text-muted-foreground">
                <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
                Searching locations...
              </div>
            )}

            {!isLoading && options.length === 0 && (
              <div className="px-2.5 py-3 text-center text-xs text-muted-foreground">
                No matching locations found.
              </div>
            )}

            {!isLoading &&
              options.map((option, idx) => (
                <button
                  key={`${option.id}-${idx}`}
                  type="button"
                  onClick={() => handleSelect(option)}
                  className={cn(
                    "flex w-full items-center justify-between rounded-md px-2.5 py-2 text-left text-xs transition-colors hover:bg-muted",
                    option.id === value &&
                      "bg-primary/10 font-medium text-primary"
                  )}
                >
                  <span className="truncate pr-2">{option.name}</span>
                  <span className="shrink-0 rounded bg-muted/80 px-1.5 py-0.5 text-[9px] font-semibold tracking-wider text-muted-foreground uppercase">
                    {option.type}
                  </span>
                </button>
              ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
