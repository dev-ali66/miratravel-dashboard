import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import {
  Compass,
  Plus,
  Search,
  Trash2,
  Clock,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { useGetJourneys } from "@/hooks/journey/useGetJourneys"
import { useDeleteJourney } from "@/hooks/journey/useDeleteJourney"
import { UniversalMultimediaPreview } from "@/components/pages/CMS/Home/shared/preview/UniversalMultimediaPreview"
import {
  JOURNEY_TYPES,
  JOURNEY_STATUSES,
  type Journey,
  type JourneyStatus,
  type JourneyType,
} from "./journeyTypes"

const PAGE_SIZE = 12

export default function JourneysPage() {
  const [page, setPage] = useState(1)
  const [searchInput, setSearchInput] = useState("")
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("")
  const [typeFilter, setTypeFilter] = useState<string>("")

  // Debounce search before querying API
  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearch(searchInput)
      setPage(1)
    }, 350)

    return () => clearTimeout(timeout)
  }, [searchInput])

  const { data, isLoading, isError, refetch } = useGetJourneys({
    page,
    limit: PAGE_SIZE,
    search: search || undefined,
    status: (statusFilter as JourneyStatus) || undefined,
    journeyType: (typeFilter as JourneyType) || undefined,
  })

  const { mutate: deleteJourney, isPending: isDeleting } = useDeleteJourney()

  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [selectedJourney, setSelectedJourney] = useState<Journey | null>(null)

  const openDeleteModal = (journey: Journey) => {
    setSelectedJourney(journey)
    setDeleteModalOpen(true)
  }

  const confirmDelete = () => {
    if (!selectedJourney?.id) return

    deleteJourney(selectedJourney.id, {
      onSuccess: () => {
        toast.success(`"${selectedJourney.title}" journey deleted.`)
        refetch()
        setDeleteModalOpen(false)
        setSelectedJourney(null)
      },
      onError: () => {
        toast.error("Failed to delete journey. Please try again.")
      },
    })
  }

  const journeys = data?.data ?? []
  const meta = data?.meta

  const hasFilters = Boolean(search || statusFilter || typeFilter)

  return (
    <div className="w-full animate-in pt-2 duration-700 fade-in slide-in-from-bottom-4">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Journeys & Itineraries
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Manage multi-day signature journeys, daily itineraries, stays, and pricing.
          </p>
        </div>

        <Link
          to="/journeys/new"
          className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition hover:opacity-90"
        >
          <Plus className="h-4 w-4" />
          Add Journey
        </Link>
      </div>

      {/* Search + Filters */}
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search journeys by title, slug, or destination..."
            className="w-full rounded-lg border border-border/60 bg-background py-2.5 pr-3 pl-9 text-sm outline-none focus:border-primary"
          />
        </div>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value)
            setPage(1)
          }}
          className="rounded-lg border border-border/60 bg-background px-3 py-2.5 text-sm outline-none focus:border-primary md:w-44"
        >
          <option value="">All Statuses</option>
          {JOURNEY_STATUSES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>

        {/* Journey Type Filter */}
        <select
          value={typeFilter}
          onChange={(e) => {
            setTypeFilter(e.target.value)
            setPage(1)
          }}
          className="rounded-lg border border-border/60 bg-background px-3 py-2.5 text-sm outline-none focus:border-primary md:w-52"
        >
          <option value="">All Journey Types</option>
          {JOURNEY_TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex justify-center py-10">
          <div className="size-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      ) : isError ? (
        /* Error State */
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-center">
          <p className="text-sm font-medium text-destructive">
            Failed to load journeys.
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Please try again.
          </p>
        </div>
      ) : journeys.length > 0 ? (
        <>
          {/* Card Grid */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {journeys.map((journey, index) => {
              const heroMultimedia = journey.data?.hero?.backgroundMultimedia
              const heroImg =
                journey.journeyHeroImage?.[0] ||
                heroMultimedia?.url ||
                journey.data?.hero?.media?.src ||
                "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80"

              const duration =
                journey.minDays === journey.maxDays
                  ? `${journey.minDays} Days`
                  : `${journey.minDays} - ${journey.maxDays} Days`

              const durationShort =
                journey.minDays === journey.maxDays
                  ? `${journey.minDays}D`
                  : `${journey.minDays}-${journey.maxDays}D`

              const isPublished = journey.status === "PUBLISHED"
              const isDraft = journey.status === "DRAFT"

              const tags = [
                ...(journey.journeyType || []),
                ...(journey.travelStyle || []),
              ]

              const seo = journey.metadata?.seo

              return (
                <div
                  key={`${journey.id ?? "journey"}-${journey.slug ?? index}`}
                  className="group relative flex min-h-[390px] flex-col overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  {/* Floating Delete Button (revealed on card hover) */}
                  <button
                    type="button"
                    onClick={() => openDeleteModal(journey)}
                    className="absolute top-4 right-4 z-20 rounded-full bg-background/90 p-2 text-muted-foreground opacity-0 shadow-sm backdrop-blur transition-all group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive focus:opacity-100"
                    title="Delete Journey"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>

                  {/* Image / Hero */}
                  <div className="relative h-44 overflow-hidden bg-muted">
                    <UniversalMultimediaPreview
                      multimedia={heroMultimedia ?? undefined}
                      fallbackImageSrc={heroImg}
                      fallbackAlt={journey.title}
                      mode="background"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      containerClassName="h-full w-full"
                    />

                    {/* Gradient Overlay */}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    {/* Status Badge */}
                    <div className="absolute top-4 left-4 z-10">
                      <span
                        className={`rounded-full px-3 py-1 text-[10px] font-bold tracking-wider uppercase shadow-sm backdrop-blur ${
                          isPublished
                            ? "bg-emerald-500/90 text-white"
                            : isDraft
                            ? "bg-amber-500/90 text-white"
                            : "bg-background/90 text-foreground"
                        }`}
                      >
                        {journey.status || "DRAFT"}
                      </span>
                    </div>

                    {/* Journey Title & Price Overlay */}
                    <div className="absolute right-4 bottom-4 left-4 z-10">
                      <h3 className="text-xl font-bold text-white line-clamp-1">
                        {journey.title || "Untitled Journey"}
                      </h3>

                      <div className="mt-1 flex items-center justify-between text-xs text-white/90">
                        <span className="flex items-center gap-1 font-medium">
                          <Clock className="h-3.5 w-3.5 text-[#af6348]" />
                          {duration}
                        </span>

                        <span className="font-bold">
                          {journey.currency === "EUR"
                            ? "€"
                            : journey.currency === "GBP"
                            ? "£"
                            : "$"}
                          {Number(journey.price || 0).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card Content Body */}
                  <div className="flex flex-1 flex-col p-5">
                    {/* Subtitle / Description */}
                    <p className="line-clamp-2 text-[13px] leading-relaxed text-muted-foreground">
                      {journey.subtitle ||
                        (journey.data?.hero as any)?.subtitle ||
                        `Explore authentic handcrafted routes across regional landscapes.`}
                    </p>

                    {/* Tags */}
                    {tags.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {tags.slice(0, 3).map((tag: string) => (
                          <span
                            key={tag}
                            className="rounded-md bg-primary/8 px-2 py-1 text-[10px] font-medium text-primary"
                          >
                            {tag.replace(/_/g, " ")}
                          </span>
                        ))}

                        {tags.length > 3 && (
                          <span className="rounded-md bg-muted px-2 py-1 text-[10px] font-medium text-muted-foreground">
                            +{tags.length - 3}
                          </span>
                        )}
                      </div>
                    )}

                    {/* 3-Column Stats Grid Bar (Matching Location's architecture) */}
                    <div className="mt-5 grid grid-cols-3 divide-x rounded-xl border border-border/50 bg-muted/30 py-3">
                      {/* Pace */}
                      <div className="flex flex-col items-center">
                        <span className="text-sm font-bold text-foreground capitalize">
                          {journey.pace?.toLowerCase() || "—"}
                        </span>

                        <span className="mt-0.5 text-[10px] tracking-wide text-muted-foreground uppercase">
                          Pace
                        </span>
                      </div>

                      {/* Comfort */}
                      <div className="flex flex-col items-center">
                        <span className="text-sm font-bold text-foreground capitalize">
                          {journey.comfortLevel?.replace(/_/g, " ").toLowerCase() || "—"}
                        </span>

                        <span className="mt-0.5 text-[10px] tracking-wide text-muted-foreground uppercase">
                          Comfort
                        </span>
                      </div>

                      {/* Duration */}
                      <div className="flex flex-col items-center">
                        <span className="text-sm font-bold text-foreground">
                          {durationShort}
                        </span>

                        <span className="mt-0.5 text-[10px] tracking-wide text-muted-foreground uppercase">
                          Duration
                        </span>
                      </div>
                    </div>

                    {/* SEO Status + Featured Indicator */}
                    <div className="mt-4 flex items-center justify-between text-[11px] text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            seo?.title ? "bg-emerald-500" : "bg-orange-400"
                          }`}
                        />

                        {seo?.title ? "SEO Ready" : "SEO Incomplete"}
                      </div>

                      {journey.featured ? (
                        <span className="flex items-center gap-1 font-semibold text-primary">
                          <Sparkles className="h-3 w-3" /> Featured
                        </span>
                      ) : (
                        <span>
                          {journey.perfectFor?.[0]?.replace(/_/g, " ") || "Curated"}
                        </span>
                      )}
                    </div>

                    {/* Edit Action Button */}
                    <Link
                      to={`/journeys/${journey.id}/${journey.slug}`}
                      className="mt-5 inline-flex items-center justify-between rounded-lg bg-primary/10 px-4 py-2.5 text-sm font-semibold text-primary transition-all hover:bg-primary hover:text-primary-foreground"
                    >
                      <span>Edit Journey</span>

                      <span className="transition-transform group-hover:translate-x-1">
                        →
                      </span>
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Pagination (Matching Location's architecture) */}
          {meta && meta.totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
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
                onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
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
            <Compass className="h-8 w-8 text-primary" />
          </div>

          <h3 className="mb-2 text-xl font-semibold">
            {hasFilters
              ? "No matching journeys found"
              : "No Journeys Found"}
          </h3>

          <p className="max-w-sm text-muted-foreground">
            {hasFilters
              ? "Try a different search term or clear the filters."
              : "There are no journeys created yet."}
          </p>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete journey?</DialogTitle>

            <DialogDescription>
              This will permanently delete{" "}
              <span className="font-medium text-foreground">
                "{selectedJourney?.title}"
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
              {isDeleting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
