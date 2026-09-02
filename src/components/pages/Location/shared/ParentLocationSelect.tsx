/* =====================================================
   LOCATION — PARENT LOCATION SELECT
   Searchable, API-driven parent picker. Displays `name`,
   stores `id` in the draft. Uses GET /locations?search=...
   (backend-driven, debounced) — never a hardcoded list.

   Edit mode: the current parent's name is resolved from
   `draft.parent` (the backend always includes it via
   Prisma `include: { parent: true }` on GET /locations),
   so no extra request is needed just to show the label.
===================================================== */

import { useEffect, useRef, useState } from "react"
import { Loader2, MapPin, X } from "lucide-react"
import { apiPrivate } from "@/lib/api-client"
import { cn } from "@/lib/utils"

type ParentOption = {
    id: string
    name: string
    type: string
}

type LocationsResponse = {
    success: boolean
    data: ParentOption[]
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

    const containerRef = useRef<HTMLDivElement>(null)

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
        }, 300)

        return () => clearTimeout(timeout)
    }, [query])

    // fetch matching locations whenever the debounced query changes
    // (or the dropdown opens with an empty query, to show recent options)
    useEffect(() => {
        if (!open) return

        let cancelled = false

        setIsLoading(true)

        apiPrivate
            .get<LocationsResponse>("/locations", {
                params: {
                    limit: 20,
                    ...(debouncedQuery
                        ? { search: debouncedQuery }
                        : {}),
                },
            })
            .then((res) => {
                if (cancelled) return

                const results = (res.data?.data ?? []).filter(
                    (item) => item.id !== excludeId
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

    // close on outside click
    useEffect(() => {
        function handleClick(e: MouseEvent) {
            if (
                containerRef.current &&
                !containerRef.current.contains(e.target as Node)
            ) {
                setOpen(false)
            }
        }

        document.addEventListener("mousedown", handleClick)
        return () =>
            document.removeEventListener("mousedown", handleClick)
    }, [])

    const handleSelect = (option: ParentOption) => {
        setSelectedName(option.name)
        onChange(option.id, option.name)
        setOpen(false)
        setQuery("")
    }

    const handleClear = () => {
        setSelectedName(null)
        onChange(null, null)
    }

    return (
        <div className="space-y-1.5" ref={containerRef}>
            <label className="text-[11px] font-medium text-muted-foreground">
                {label}
            </label>

            <div className="relative">
                {!open ? (
                    <button
                        type="button"
                        onClick={() => setOpen(true)}
                        className="flex w-full items-center justify-between rounded-lg border border-border/60 bg-background px-3 py-2 text-left text-sm outline-none focus:border-primary"
                    >
                        <span
                            className={cn(
                                "flex items-center gap-2 truncate",
                                !value && "text-muted-foreground"
                            )}
                        >
                            <MapPin className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                            {value
                                ? selectedName ?? "Selected location"
                                : noneLabel}
                        </span>

                        {value && (
                            <span
                                role="button"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    handleClear()
                                }}
                                className="ml-2 shrink-0 rounded p-0.5 text-muted-foreground hover:bg-muted"
                            >
                                <X className="h-3.5 w-3.5" />
                            </span>
                        )}
                    </button>
                ) : (
                    <input
                        autoFocus
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search locations..."
                        className="w-full rounded-lg border border-primary bg-background px-3 py-2 text-sm outline-none"
                    />
                )}

                {open && (
                    <div className="absolute z-30 mt-1 max-h-64 w-full overflow-auto rounded-lg border border-border/60 bg-card shadow-lg">
                        <button
                            type="button"
                            onClick={() => {
                                setSelectedName(null)
                                onChange(null, null)
                                setOpen(false)
                                setQuery("")
                            }}
                            className="flex w-full items-center px-3 py-2 text-left text-xs text-muted-foreground hover:bg-muted"
                        >
                            {noneLabel}
                        </button>

                        {isLoading && (
                            <div className="flex items-center gap-2 px-3 py-2 text-xs text-muted-foreground">
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                Searching...
                            </div>
                        )}

                        {!isLoading && options.length === 0 && (
                            <div className="px-3 py-2 text-xs text-muted-foreground">
                                No matching locations found.
                            </div>
                        )}

                        {!isLoading &&
                            options.map((option) => (
                                <button
                                    key={option.id}
                                    type="button"
                                    onClick={() =>
                                        handleSelect(option)
                                    }
                                    className={cn(
                                        "flex w-full flex-col items-start px-3 py-2 text-left text-sm hover:bg-muted",
                                        option.id === value &&
                                            "bg-muted"
                                    )}
                                >
                                    <span>{option.name}</span>
                                    <span className="text-[10px] uppercase tracking-wide text-muted-foreground">
                                        {option.type}
                                    </span>
                                </button>
                            ))}
                    </div>
                )}
            </div>
        </div>
    )
}
