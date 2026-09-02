import {
    useGetLocationPages,
    type LocationPageData,
} from "@/hooks/location/useGetLocation"
import { useDeleteLocation } from "@/hooks/location/useDeleteLocation"
import { Link } from "react-router-dom"
import { useEffect, useState } from "react"
import {
    Trash2,
    MapPin,
    Loader2,
    Plus,
    Search,
    ChevronLeft,
    ChevronRight,
} from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

import { LOCATION_TYPES } from "@/components/pages/Location/locationTypes"
import { ParentLocationSelect } from "@/components/pages/Location/shared/ParentLocationSelect"

const PAGE_SIZE = 12

export default function LocationPages() {
    const [page, setPage] = useState(1)
    const [searchInput, setSearchInput] = useState("")
    const [search, setSearch] = useState("")
    const [type, setType] = useState<string>("")
    const [parentId, setParentId] = useState<string | null>(null)

    // debounce the search box before it hits the API
    useEffect(() => {
        const timeout = setTimeout(() => {
            setSearch(searchInput)
            setPage(1)
        }, 350)

        return () => clearTimeout(timeout)
    }, [searchInput])

    const { data, isLoading, isError } = useGetLocationPages({
        page,
        limit: PAGE_SIZE,
        search: search || undefined,
        type: type || undefined,
        parentId: parentId || undefined,
    })

    const { mutate: deleteLocation, isPending: isDeleting } =
        useDeleteLocation()

    const [deleteModalOpen, setDeleteModalOpen] = useState(false)
    const [selectedPage, setSelectedPage] =
        useState<LocationPageData | null>(null)

    const openDeleteModal = (page: LocationPageData) => {
        setSelectedPage(page)
        setDeleteModalOpen(true)
    }

    const confirmDelete = () => {
        if (!selectedPage) return

        deleteLocation(selectedPage.id, {
            onSuccess: () => {
                toast.success(
                    `"${selectedPage.name}" location page deleted.`
                )

                setDeleteModalOpen(false)
                setSelectedPage(null)
            },
            onError: () => {
                toast.error(
                    "Failed to delete location page. Please try again."
                )
            },
        })
    }

    const formatPageName = (name: string) => {
        return name
            .replace(/([A-Z])/g, " $1")
            .replace(/[-_]/g, " ")
            .trim()
    }

    const pages = data?.data ?? []
    const meta = data?.meta

    const hasFilters = Boolean(search || type || parentId)

    return (
        <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-700 pt-2">
            {/* Header */}
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">
                        Location Pages
                    </h1>

                    <p className="mt-1 text-sm text-muted-foreground">
                        Manage content for individual location and destination
                        pages.
                    </p>
                </div>

                <Link
                    to="/locations/new"
                    className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition hover:opacity-90"
                >
                    <Plus className="h-4 w-4" />
                    Add Location
                </Link>
            </div>

            {/* Search + Filters */}
            <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center">
                <div className="relative flex-1">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                    <input
                        value={searchInput}
                        onChange={(e) =>
                            setSearchInput(e.target.value)
                        }
                        placeholder="Search locations by name, slug or type..."
                        className="w-full rounded-lg border border-border/60 bg-background py-2.5 pl-9 pr-3 text-sm outline-none focus:border-primary"
                    />
                </div>

                <select
                    value={type}
                    onChange={(e) => {
                        setType(e.target.value)
                        setPage(1)
                    }}
                    className="rounded-lg border border-border/60 bg-background px-3 py-2.5 text-sm outline-none focus:border-primary md:w-48"
                >
                    <option value="">All Types</option>
                    {LOCATION_TYPES.map((t) => (
                        <option key={t} value={t}>
                            {t}
                        </option>
                    ))}
                </select>

                <div className="md:w-64">
                    <ParentLocationSelect
                        value={parentId}
                        label=""
                        noneLabel="All Parent Locations"
                        onChange={(id) => {
                            setParentId(id)
                            setPage(1)
                        }}
                    />
                </div>
            </div>

            {/* Loading */}
            {isLoading ? (
                <div className="flex justify-center py-10">
                    <div className="size-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                </div>
            ) : isError ? (
                /* Error State */
                <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-center">
                    <p className="text-sm font-medium text-destructive">
                        Failed to load location pages.
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                        Please try again.
                    </p>
                </div>
            ) : pages.length > 0 ? (
                <>
                    {/* Location Pages */}
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {pages.map((page) => {
                            const pageName = formatPageName(page.name)

                            // Safe access for location data
                            const locationData = page.data
                            const geoData = page.geoData
                            const seo = page.metadata?.seo
                            const parent = page.parent

                            const experienceCount =
                                locationData?.experiences?.cards?.length ?? 0

                            const tags = locationData?.why?.tags ?? []

                            return (
                                <div
                                    key={page.id}
                                    className="group relative flex min-h-[390px] flex-col overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                                >
                                    {/* Delete */}
                                    <button
                                        type="button"
                                        onClick={() => openDeleteModal(page)}
                                        className="absolute right-4 top-4 z-20 rounded-full bg-background/90 p-2 text-muted-foreground opacity-0 shadow-sm backdrop-blur transition-all hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100 focus:opacity-100"
                                        title="Delete Location Page"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>

                                    {/* Image / Hero */}
                                    <div className="relative h-44 overflow-hidden bg-muted">
                                        {locationData?.hero?.background_image ? (
                                            <img
                                                src={locationData.hero.background_image}
                                                alt={pageName}
                                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="flex h-full items-center justify-center bg-primary/5">
                                                <MapPin className="h-10 w-10 text-primary/40" />
                                            </div>
                                        )}

                                        {/* Gradient */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                                        {/* Location Type */}
                                        <div className="absolute left-4 top-4">
                                            <span className="rounded-full bg-background/90 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-foreground shadow-sm backdrop-blur">
                                                {page.type || "PLACE"}
                                            </span>
                                        </div>

                                        {/* Location Name */}
                                        <div className="absolute bottom-4 left-4 right-4">
                                            <h3 className="text-xl font-bold text-white">
                                                {pageName}
                                            </h3>

                                            {parent?.name && (
                                                <p className="mt-1 flex items-center gap-1 text-xs text-white/80">
                                                    <MapPin className="h-3 w-3" />
                                                    {parent.name}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="flex flex-1 flex-col p-5">
                                        {/* Description */}
                                        <p className="line-clamp-2 text-[13px] leading-relaxed text-muted-foreground">
                                            {locationData?.shortDescription ||
                                                locationData?.description ||
                                                `Manage content and information for the ${pageName} location page.`}
                                        </p>

                                        {/* Tags */}
                                        {
                                            tags.length > 0 && (
                                                <div className="mt-4 flex flex-wrap gap-1.5">
                                                    {tags.slice(0, 3).map((tag: string) => (
                                                        <span
                                                            key={tag}
                                                            className="rounded-md bg-primary/8 px-2 py-1 text-[10px] font-medium text-primary"
                                                        >
                                                            {tag}
                                                        </span>
                                                    ))}

                                                    {tags.length > 3 && (
                                                        <span className="rounded-md bg-muted px-2 py-1 text-[10px] font-medium text-muted-foreground">
                                                            +{tags.length - 3}
                                                        </span>
                                                    )}
                                                </div>
                                            )
                                        }

                                        {/* Location Stats */}
                                        <div className="mt-5 grid grid-cols-3 divide-x rounded-xl border border-border/50 bg-muted/30 py-3">
                                            {/* Area */}
                                            <div className="flex flex-col items-center">
                                                <span className="text-sm font-bold text-foreground">
                                                    {locationData?.statistics?.area?.value ??
                                                        geoData?.area?.value ??
                                                        "—"}
                                                </span>

                                                <span className="mt-0.5 text-[10px] uppercase tracking-wide text-muted-foreground">
                                                    {locationData?.statistics?.area?.unit ||
                                                        geoData?.area?.unit ||
                                                        "Area"}
                                                </span>
                                            </div>

                                            {/* Elevation */}
                                            <div className="flex flex-col items-center">
                                                <span className="text-sm font-bold text-foreground">
                                                    {locationData?.statistics?.elevation?.value ??
                                                        "—"}
                                                </span>

                                                <span className="mt-0.5 text-[10px] uppercase tracking-wide text-muted-foreground">
                                                    Elevation
                                                </span>
                                            </div>

                                            {/* Experiences */}
                                            <div className="flex flex-col items-center">
                                                <span className="text-sm font-bold text-foreground">
                                                    {experienceCount}
                                                </span>

                                                <span className="mt-0.5 text-[10px] uppercase tracking-wide text-muted-foreground">
                                                    Experiences
                                                </span>
                                            </div>
                                        </div>

                                        {/* SEO + Coordinates */}
                                        <div className="mt-4 flex items-center justify-between text-[11px] text-muted-foreground">
                                            <div className="flex items-center gap-1">
                                                <span
                                                    className={`h-1.5 w-1.5 rounded-full ${seo?.title
                                                        ? "bg-emerald-500"
                                                        : "bg-orange-400"
                                                        }`}
                                                />

                                                {seo?.title ? "SEO Ready" : "SEO Incomplete"}
                                            </div>

                                            {geoData?.latitude && geoData?.longitude && (
                                                <span>
                                                    {geoData.latitude.toFixed(2)},{" "}
                                                    {geoData.longitude.toFixed(2)}
                                                </span>
                                            )}
                                        </div>

                                        {/* Edit */}
                                        <Link
                                            to={`/locations/${page.id}/${page.slug}`}
                                            className="mt-5 inline-flex items-center justify-between rounded-lg bg-primary/10 px-4 py-2.5 text-sm font-semibold text-primary transition-all hover:bg-primary hover:text-primary-foreground"
                                        >
                                            <span>Edit {pageName} Page</span>

                                            <span className="transition-transform group-hover:translate-x-1">
                                                →
                                            </span>
                                        </Link>
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    {/* Pagination */}
                    {meta && meta.totalPages > 1 && (
                        <div className="mt-8 flex items-center justify-center gap-3">
                            <button
                                type="button"
                                onClick={() =>
                                    setPage((p) => Math.max(1, p - 1))
                                }
                                disabled={page <= 1}
                                className="flex items-center gap-1 rounded-lg border border-border/60 px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                <ChevronLeft className="h-4 w-4" />
                                Prev
                            </button>

                            <span className="text-sm text-muted-foreground">
                                Page {meta.page} of {meta.totalPages}
                            </span>

                            <button
                                type="button"
                                onClick={() =>
                                    setPage((p) =>
                                        Math.min(meta.totalPages, p + 1)
                                    )
                                }
                                disabled={page >= meta.totalPages}
                                className="flex items-center gap-1 rounded-lg border border-border/60 px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                Next
                                <ChevronRight className="h-4 w-4" />
                            </button>
                        </div>
                    )}
                </>
            ) : (
                /* Empty State */
                <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/60 bg-card/50 py-24 text-center">
                    <div className="mb-4 rounded-full bg-primary/10 p-4">
                        <MapPin className="h-8 w-8 text-primary" />
                    </div>

                    <h3 className="mb-2 text-xl font-semibold">
                        {hasFilters
                            ? "No matching locations found"
                            : "No Location Pages Found"}
                    </h3>

                    <p className="max-w-sm text-muted-foreground">
                        {hasFilters
                            ? "Try a different search term or clear the filters."
                            : "There are no location pages created yet."}
                    </p>
                </div>
            )}

            {/* Delete Dialog */}
            <Dialog
                open={deleteModalOpen}
                onOpenChange={setDeleteModalOpen}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            Delete location page?
                        </DialogTitle>

                        <DialogDescription>
                            This will permanently delete{" "}
                            <span className="font-medium text-foreground">
                                "{selectedPage?.name}"
                            </span>
                            . This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setDeleteModalOpen(false)}
                            disabled={isDeleting}
                        >
                            Cancel
                        </Button>

                        <Button
                            variant="destructive"
                            onClick={confirmDelete}
                            disabled={isDeleting}
                            className="gap-1.5"
                        >
                            {isDeleting && (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            )}

                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}