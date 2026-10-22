import MiraLoader from "@/components/shared/MiraLoader"
import {
  useGetExperiencePages,
  type ExperienceItemData,
} from "@/hooks/experience/useGetExperiences"
import { useDeleteExperience } from "@/hooks/experience/useDeleteExperience"
import { Link } from "react-router-dom"
import { useEffect, useState } from "react"
import {
  Trash2,
  MapPin,
  Plus,
  Search,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  DollarSign,
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
import { ParentLocationSelect } from "@/components/pages/Location/shared/ParentLocationSelect"
import { UniversalMultimediaPreview } from "@/components/pages/CMS/Home/shared/preview/UniversalMultimediaPreview"
import { EXPERIENCE_CURRENCY_OPTIONS } from "./experienceTypes"

const PAGE_SIZE = 12

export default function ExperiencePages() {
  const [page, setPage] = useState(1)
  const [searchInput, setSearchInput] = useState("")
  const [search, setSearch] = useState("")
  const [parentId, setParentId] = useState<string | null>(null)
  const [currency, setCurrency] = useState<string>("")
  const [featured, setFeatured] = useState<boolean | undefined>(undefined)

  // Debounce search box
  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearch(searchInput)
      setPage(1)
    }, 350)

    return () => clearTimeout(timeout)
  }, [searchInput])

  const { data, isLoading, isError, refetch } = useGetExperiencePages({
    page,
    limit: PAGE_SIZE,
    search: search || undefined,
    parentId: parentId || undefined,
    currency: currency || undefined,
    featured,
  })

  useEffect(() => {
    refetch()
  }, [refetch])

  const { mutate: deleteExperience, isPending: isDeleting } = useDeleteExperience()

  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [selectedExperience, setSelectedExperience] = useState<ExperienceItemData | null>(null)

  const openDeleteModal = (exp: ExperienceItemData) => {
    setSelectedExperience(exp)
    setDeleteModalOpen(true)
  }

  const confirmDelete = () => {
    if (!selectedExperience) return

    deleteExperience(selectedExperience.id, {
      onSuccess: () => {
        refetch()
        setDeleteModalOpen(false)
        setSelectedExperience(null)
      },
      onError: () => {
        toast.error("Failed to delete experience. Please try again.")
      },
    })
  }

  const formatPriceType = (type?: string | null) => {
    if (!type) return ""
    return type.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())
  }

  const formatCurrencySymbol = (cur?: string | null) => {
    switch (cur?.toUpperCase()) {
      case "USD":
        return "$"
      case "GBP":
        return "£"
      case "CHF":
        return "CHF "
      case "ALL":
        return "Lek "
      case "EUR":
      default:
        return "€"
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/70 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold tracking-tight text-foreground">
                Experiences Management
              </h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                Curate signature activities, helicopter safaris, private tastings, and bespoke adventures.
              </p>
            </div>
          </div>
        </div>

        <Link
          to="/experiences/new"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs md:text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors self-start sm:self-auto cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Create Experience</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search experiences by name or slug..."
            className="w-full rounded-xl border border-border/70 bg-card pl-9 pr-4 py-2 text-xs md:text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        {/* Parent Location Filter */}
        <div className="w-full md:w-64">
          <ParentLocationSelect
            value={parentId}
            label=""
            noneLabel="All Destinations"
            onChange={(id) => {
              setParentId(id || null)
              setPage(1)
            }}
          />
        </div>

        {/* Currency Filter */}
        <select
          value={currency}
          onChange={(e) => {
            setCurrency(e.target.value)
            setPage(1)
          }}
          className="rounded-xl border border-border/70 bg-card px-3 py-2 text-xs md:text-sm text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary md:w-40 cursor-pointer"
        >
          <option value="">All Currencies</option>
          {EXPERIENCE_CURRENCY_OPTIONS.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>

        {/* Featured Filter Toggle */}
        <button
          type="button"
          onClick={() => {
            setFeatured((prev) => (prev === true ? undefined : true))
            setPage(1)
          }}
          className={`inline-flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-medium transition-colors cursor-pointer shrink-0 ${
            featured === true
              ? "border-primary bg-primary/10 text-primary font-semibold"
              : "border-border/70 bg-card text-muted-foreground hover:bg-muted/50"
          }`}
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span>Featured Only</span>
        </button>
      </div>

      {/* Experience List Cards */}
      {isLoading ? (
        <MiraLoader text="Loading experiences..." className="min-h-[300px] py-12" />
      ) : isError ? (
        <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-8 text-center">
          <p className="text-sm font-semibold text-destructive">Failed to fetch experiences.</p>
          <p className="text-xs text-muted-foreground mt-1">
            Please make sure the backend server is running on port 5010.
          </p>
        </div>
      ) : data?.data && data.data.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {data.data.map((exp) => {
            const heroMedia = exp.hero?.backgroundMultimedia || exp.hero?.multimedia
            const essenceMedia = exp.essence?.imageMultimedia || exp.essence?.multimedia
            const previewMedia = heroMedia || essenceMedia

            return (
              <div
                key={exp.id}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border/70 bg-card shadow-xs hover:border-primary/50 hover:shadow-md transition-all duration-300"
              >
                {/* Media Thumbnail Container */}
                <Link
                  to={`/experiences/${exp.id}/${exp.slug || "details"}`}
                  className="relative h-44 w-full overflow-hidden bg-muted/40 cursor-pointer block"
                >
                  <UniversalMultimediaPreview
                    multimedia={previewMedia}
                    mode="inline"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Top Badges */}
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 z-10">
                    {exp.featured && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/90 backdrop-blur-xs px-2 py-0.5 text-[10px] font-semibold text-white shadow-xs">
                        <Sparkles className="h-2.5 w-2.5" />
                        Featured
                      </span>
                    )}
                    {exp.parent?.name && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-black/60 backdrop-blur-xs px-2 py-0.5 text-[10px] font-medium text-white shadow-xs">
                        <MapPin className="h-2.5 w-2.5 text-accent" />
                        {exp.parent.name}
                      </span>
                    )}
                  </div>

                  {/* Delete Button (Absolute Hover) */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      openDeleteModal(exp)
                    }}
                    className="absolute top-2.5 right-2.5 z-20 flex h-7 w-7 items-center justify-center rounded-lg bg-black/60 backdrop-blur-xs text-white/80 opacity-0 group-hover:opacity-100 hover:bg-destructive hover:text-white transition-all cursor-pointer"
                    title="Delete Experience"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </Link>

                {/* Card Content */}
                <div className="p-4 flex flex-col gap-2.5 flex-1">
                  <div>
                    <Link
                      to={`/experiences/${exp.id}/${exp.slug || "details"}`}
                      className="text-sm font-bold text-foreground hover:text-primary transition-colors line-clamp-1"
                    >
                      {exp.name}
                    </Link>
                    <p className="text-[11px] font-mono text-muted-foreground truncate mt-0.5">
                      /{exp.slug || "no-slug"}
                    </p>
                  </div>

                  {/* Price & PriceType Badge */}
                  <div className="mt-auto pt-2.5 border-t border-border/50 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs text-foreground font-semibold">
                      <DollarSign className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                      {exp.price !== null && exp.price !== undefined ? (
                        <span>
                          {formatCurrencySymbol(exp.currency)}
                          {Number(exp.price).toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                          {exp.priceType && (
                            <span className="text-[10px] font-normal text-muted-foreground ml-1">
                              ({formatPriceType(exp.priceType)})
                            </span>
                          )}
                        </span>
                      ) : (
                        <span className="text-muted-foreground text-[11px] font-normal">
                          Custom / Inquire
                        </span>
                      )}
                    </div>

                    <Link
                      to={`/experiences/${exp.id}/${exp.slug || "details"}`}
                      className="text-[11px] font-medium text-primary hover:underline"
                    >
                      Edit ➔
                    </Link>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-border/80 bg-muted/20 p-12 text-center flex flex-col items-center justify-center">
          <Sparkles className="h-10 w-10 text-muted-foreground/60 mb-3" />
          <h3 className="text-base font-semibold text-foreground">No experiences found</h3>
          <p className="text-xs text-muted-foreground max-w-sm mt-1 mb-4">
            {search || parentId || currency || featured
              ? "No experiences match your active filters. Try adjusting your search query or clear filters."
              : "Start by creating your first luxury experience, private excursion, or tasting session."}
          </p>

          {search || parentId || currency || featured ? (
            <button
              type="button"
              onClick={() => {
                setSearchInput("")
                setSearch("")
                setParentId(null)
                setCurrency("")
                setFeatured(undefined)
                setPage(1)
              }}
              className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-4 py-2 text-xs font-semibold text-foreground hover:bg-muted/50 transition-colors cursor-pointer"
            >
              Clear All Filters
            </button>
          ) : (
            <Link
              to="/experiences/new"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Create First Experience
            </Link>
          )}
        </div>
      )}

      {/* Pagination Bar */}
      {data?.meta && data.meta.totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-border/70 pt-4 mt-2">
          <p className="text-xs text-muted-foreground">
            Showing Page <span className="font-semibold text-foreground">{data.meta.page}</span> of{" "}
            <span className="font-semibold text-foreground">{data.meta.totalPages}</span> (
            {data.meta.total} total)
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={data.meta.page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="inline-flex items-center gap-1 rounded-lg border border-border/70 bg-card px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted/50 disabled:opacity-40 transition-colors cursor-pointer"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              Previous
            </button>

            <button
              type="button"
              disabled={data.meta.page >= data.meta.totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="inline-flex items-center gap-1 rounded-lg border border-border/70 bg-card px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted/50 disabled:opacity-40 transition-colors cursor-pointer"
            >
              Next
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Experience</DialogTitle>
            <DialogDescription>
              Are you sure you want to permanently delete{" "}
              <span className="font-semibold text-foreground">
                "{selectedExperience?.name}"
              </span>
              ? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
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
            >
              {isDeleting ? "Deleting..." : "Delete Permanently"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
