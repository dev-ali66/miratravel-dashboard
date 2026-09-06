import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import {
  Compass,
  Plus,
  Search,
  Trash2,
  Edit,
  Clock,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  AlertCircle,
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
import type { Journey, JourneyStatus } from "./journeyTypes"

const PAGE_SIZE = 12

export default function JourneysPage() {
  const [page, setPage] = useState(1)
  const [searchInput, setSearchInput] = useState("")
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("")

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput)
      setPage(1)
    }, 350)
    return () => clearTimeout(timer)
  }, [searchInput])

  const { data, isLoading, isError, refetch } = useGetJourneys({
    page,
    limit: PAGE_SIZE,
    search: search || undefined,
    status: (statusFilter as JourneyStatus) || undefined,
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
        toast.success(`"${selectedJourney.title}" was deleted.`)
        refetch()
        setDeleteModalOpen(false)
        setSelectedJourney(null)
      },
      onError: (err: any) => {
        toast.error(err?.message || "Failed to delete journey.")
      },
    })
  }

  const journeys = data?.data || []
  const meta = data?.meta || {
    total: journeys.length,
    page: 1,
    limit: PAGE_SIZE,
    totalPages: 1,
  }

  return (
    <div className="space-y-6 p-6 md:p-8 max-w-7xl mx-auto">
      {/* =================================================
          PAGE HEADER
      ================================================= */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Compass className="h-5 w-5 text-[#af6348]" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Journeys & Itineraries
            </h1>
            <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">
              {meta.total}
            </span>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
            Manage multi-day signature journeys, daily itineraries, stays, and pricing.
          </p>
        </div>

        <Link to="/journeys/new">
          <Button className="flex items-center gap-2 bg-primary text-primary-foreground shadow-sm hover:opacity-90">
            <Plus className="h-4 w-4" />
            <span>Add Journey</span>
          </Button>
        </Link>
      </div>

      {/* =================================================
          FILTER BAR
      ================================================= */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search journeys by title, slug, or destination..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full rounded-lg border border-border/70 bg-card pl-9 pr-4 py-2 text-xs text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        {/* Status Dropdown */}
        <div className="w-full sm:w-48">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value)
              setPage(1)
            }}
            className="w-full rounded-lg border border-border/70 bg-card px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
          >
            <option value="">All Statuses</option>
            <option value="PUBLISHED">Published</option>
            <option value="DRAFT">Draft</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </div>
      </div>

      {/* =================================================
          CONTENT / CARDS GRID
      ================================================= */}
      {isLoading ? (
        <div className="flex min-h-[300px] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : isError ? (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-center">
          <AlertCircle className="mx-auto h-8 w-8 text-destructive" />
          <p className="mt-2 text-sm font-semibold text-destructive">
            Failed to load journeys.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            className="mt-3 text-xs"
          >
            Try Again
          </Button>
        </div>
      ) : journeys.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border/80 bg-card/50 p-12 text-center">
          <Compass className="mx-auto h-12 w-12 text-muted-foreground/40" />
          <h3 className="mt-3 text-base font-semibold text-foreground">
            No journeys found
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            {search || statusFilter
              ? "Try adjusting your filters or search query."
              : "Create your first signature journey to get started."}
          </p>
          <Link to="/journeys/new" className="mt-4 inline-block">
            <Button size="sm" className="gap-1.5 text-xs">
              <Plus className="h-3.5 w-3.5" />
              Create Journey
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {journeys.map((journey) => {
            const heroMedia = journey.data?.hero?.media
            const heroImg =
              heroMedia?.src ||
              (heroMedia as any)?.url ||
              "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80"

            const duration =
              journey.minDays === journey.maxDays
                ? `${journey.minDays} Days`
                : `${journey.minDays} - ${journey.maxDays} Days`

            const isPublished = journey.status === "PUBLISHED"
            const isDraft = journey.status === "DRAFT"

            return (
              <div
                key={journey.id}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border/70 bg-card shadow-xs transition-all duration-300 hover:border-primary/40 hover:shadow-md"
              >
                {/* Image & Badges */}
                <div className="relative h-48 w-full overflow-hidden bg-muted">
                  <img
                    src={heroImg}
                    alt={journey.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Status pill */}
                  <div className="absolute top-3 left-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                        isPublished
                          ? "bg-emerald-500/90 text-white"
                          : isDraft
                          ? "bg-amber-500/90 text-white"
                          : "bg-zinc-600/90 text-white"
                      }`}
                    >
                      {journey.status}
                    </span>
                  </div>

                  {/* Featured */}
                  {journey.featured && (
                    <div className="absolute top-3 right-3">
                      <span className="flex items-center gap-1 rounded-full bg-primary/90 px-2 py-0.5 text-[10px] font-medium text-white shadow-xs">
                        <Sparkles className="h-3 w-3" /> Featured
                      </span>
                    </div>
                  )}

                  {/* Bottom Image Overlay: Duration & Price */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white">
                    <div className="flex items-center gap-1 font-medium">
                      <Clock className="h-3.5 w-3.5 text-[#af6348]" />
                      {duration}
                    </div>
                    <div className="font-bold">
                      {journey.currency || "USD"} ${journey.price?.toLocaleString()}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col justify-between p-5 space-y-4">
                  <div>
                    {journey.journeyType && journey.journeyType.length > 0 && (
                      <div className="mb-1.5 flex flex-wrap gap-1">
                        {journey.journeyType.slice(0, 2).map((t, idx) => (
                          <span
                            key={idx}
                            className="rounded bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground uppercase"
                          >
                            {t.replace(/_/g, " ")}
                          </span>
                        ))}
                      </div>
                    )}

                    <h3 className="font-serif text-base font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                      {journey.title}
                    </h3>

                    {journey.subtitle && (
                      <p className="mt-1 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                        {journey.subtitle}
                      </p>
                    )}
                  </div>

                  {/* Attributes footer */}
                  <div className="flex items-center justify-between border-t border-border/50 pt-3 text-[11px] text-muted-foreground">
                    <span className="capitalize">
                      Pace: {journey.pace?.toLowerCase() || "Moderate"}
                    </span>
                    <span className="capitalize">
                      {journey.comfortLevel?.replace(/_/g, " ").toLowerCase() || "Luxury"}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 pt-1">
                    <Link
                      to={`/journeys/${journey.id}/${journey.slug}`}
                      className="flex-1"
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full gap-1.5 text-xs font-medium"
                      >
                        <Edit className="h-3.5 w-3.5" />
                        Edit Journey
                      </Button>
                    </Link>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openDeleteModal(journey)}
                      className="h-8 w-8 p-0 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                      title="Delete Journey"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* =================================================
          PAGINATION
      ================================================= */}
      {meta.totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-border/60 pt-4">
          <p className="text-xs text-muted-foreground">
            Page {meta.page} of {meta.totalPages} ({meta.total} total)
          </p>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="h-8 px-2 text-xs"
            >
              <ChevronLeft className="h-4 w-4 mr-1" /> Prev
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
              disabled={page >= meta.totalPages}
              className="h-8 px-2 text-xs"
            >
              Next <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}

      {/* =================================================
          DELETE MODAL
      ================================================= */}
      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold text-destructive">
              Delete Journey
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Are you sure you want to permanently delete{" "}
              <strong className="text-foreground">
                "{selectedJourney?.title}"
              </strong>
              ? This action cannot be undone and will remove all itinerary days, stays, and pricing data.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDeleteModalOpen(false)}
              disabled={isDeleting}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={confirmDelete}
              disabled={isDeleting}
              className="gap-1.5 text-xs"
            >
              {isDeleting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              Delete Permanently
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
