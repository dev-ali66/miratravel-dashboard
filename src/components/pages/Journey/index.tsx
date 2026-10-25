import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Pagination } from "@/components/shared/Pagination"
import { DataPreview } from "@/components/shared/DataPreview"
import { useListingPagination } from "@/hooks/ui/useListingPagination"
import { PageHeader, CompactStatCard } from "@/components/shared/PageHeader"
import {
  FilterToolbar,
  FilterGroup,
  FilterSearch,
  FilterSelect,
  FilterActions,
  FilterCreateButton,
  FilterResetButton,
} from "@/components/shared/FilterToolbar"
import {
  Trash2,
  Compass,
  Loader2,
  Plus,
  Globe,
  Tag,
  CheckCircle2,
  Sparkles,
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

import {
  useGetJourneys,
  type JourneyPageData,
} from "@/hooks/journey/useGetJourneys"
import { useDeleteJourney } from "@/hooks/journey/useDeleteJourney"
import {
  JOURNEY_TYPES,
  TRAVEL_STYLES,
  JOURNEY_STATUS_LIST,
} from "./journeyTypes"
import { UniversalMultimediaPreview } from "@/components/pages/CMS/Home/shared/preview/UniversalMultimediaPreview"
import { getSafeStringValue } from "@/components/pages/Location/shared/normalizeHelpers"

export default function JourneyPages() {
  const [searchInput, setSearchInput] = useState("")
  const [search, setSearch] = useState("")
  const [journeyType, setJourneyType] = useState<string>("")
  const [travelStyle, setTravelStyle] = useState<string>("")
  const [status, setStatus] = useState<string>("")

  // Debounce search input
  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearch(searchInput)
    }, 350)
    return () => clearTimeout(timeout)
  }, [searchInput])

  const filterKey = `${search}-${journeyType}-${travelStyle}-${status}`

  const {
    mode,
    currentPage,
    setCurrentPage,
    setTargetItems,
    columns,
    effectiveLimit,
    pageSizeOptions,
    gridRef,
    displayItems,
    hasMore,
    isLoadingMore,
    handleLoadMore,
    setIncomingData,
  } = useListingPagination<JourneyPageData>({
    mode: "infinite",
    initialTargetItems: 18,
    isGrid: true,
    gridColumns: { base: 1, md: 3, lg: 5, xl: 6 },
    filterKey,
    keyExtractor: (item) => item.id,
  })

  const setPage = setCurrentPage

  const { data, isLoading, isFetching, isError, refetch } = useGetJourneys({
    page: currentPage,
    limit: effectiveLimit,
    search: search || undefined,
    journeyType: journeyType || undefined,
    travelStyle: travelStyle || undefined,
    status: status || undefined,
  })

  // Sync incoming data to pagination manager
  useEffect(() => {
    if (data) {
      setIncomingData(data.data, data.meta?.total)
    }
  }, [data, setIncomingData])

  useEffect(() => {
    refetch()
  }, [refetch])

  const { mutate: deleteJourney, isPending: isDeleting } = useDeleteJourney()

  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [selectedJourney, setSelectedJourney] = useState<JourneyPageData | null>(
    null
  )

  const openDeleteModal = (j: JourneyPageData) => {
    setSelectedJourney(j)
    setDeleteModalOpen(true)
  }

  const confirmDelete = () => {
    if (!selectedJourney) return

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

  const journeys = displayItems
  const meta = data?.meta

  const hasFilters = Boolean(search || journeyType || travelStyle || status)

  return (
    <div className="w-full space-y-6 animate-in pt-2 duration-700 fade-in slide-in-from-bottom-4">
      {/* Header with 30% title & 70% compact statistics */}
      <PageHeader
        icon={Compass}
        title="Journeys Management"
        subtitle="Create, publish, and manage bespoke travel itineraries."
        stats={
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5 w-full">
            <CompactStatCard
              label="Total Journeys"
              value={meta?.total ?? journeys.length}
              subtext="Bespoke catalog"
              icon={Compass}
              iconColor="text-primary"
            />
            <CompactStatCard
              label="Live Published"
              value={`${journeys.filter((j) => (j as any).status === "PUBLISHED").length} Active`}
              subtext="Public explorer"
              icon={CheckCircle2}
              iconColor="text-emerald-500"
            />
            <CompactStatCard
              label="Signatures"
              value={`${journeys.filter((j) => (j as any).isSignature || (j as any).isFeatured).length} Curated`}
              subtext="Featured routes"
              icon={Sparkles}
              iconColor="text-purple-500"
            />
            <CompactStatCard
              label="Drafts / Review"
              value={`${journeys.filter((j) => (j as any).status !== "PUBLISHED").length} Drafts`}
              subtext="In review"
              icon={Globe}
              iconColor="text-amber-500"
            />
          </div>
        }
      />

      {/* Filters */}
      <FilterToolbar>
        <FilterGroup>
          <FilterSearch
            value={searchInput}
            onChange={(val) => {
              setSearchInput(val)
              setPage(1)
            }}
            placeholder="Search journeys..."
            width="w-44 sm:w-56 shrink-0"
          />

          <FilterSelect
            value={journeyType}
            onChange={(val) => {
              setJourneyType(val)
              setPage(1)
            }}
            options={JOURNEY_TYPES.map((t) => ({
              label: t.replace(/_/g, " "),
              value: t,
            }))}
            allLabel="All Journey Types"
            placeholder="Journey Type"
            width="min-w-[130px] max-w-[160px]"
          />

          <FilterSelect
            value={travelStyle}
            onChange={(val) => {
              setTravelStyle(val)
              setPage(1)
            }}
            options={TRAVEL_STYLES.map((s) => ({
              label: s.replace(/_/g, " "),
              value: s,
            }))}
            allLabel="All Travel Styles"
            placeholder="Travel Style"
            width="min-w-[130px] max-w-[160px]"
          />

          <FilterSelect
            value={status}
            onChange={(val) => {
              setStatus(val)
              setPage(1)
            }}
            options={JOURNEY_STATUS_LIST.map((st) => ({
              label: st,
              value: st,
            }))}
            allLabel="All Statuses"
            placeholder="Status"
            width="min-w-[105px] max-w-[125px]"
          />

          {(searchInput || journeyType || travelStyle || status) && (
            <FilterResetButton
              onClick={() => {
                setSearchInput("")
                setJourneyType("")
                setTravelStyle("")
                setStatus("")
                setPage(1)
              }}
            />
          )}
        </FilterGroup>

        <FilterActions>
          <FilterCreateButton
            to="/journeys/new"
            label="Create Journey"
            icon={Plus}
          />
        </FilterActions>
      </FilterToolbar>

      {/* Journeys Grid via Universal DataPreview */}
      <DataPreview<JourneyPageData>
        gridRef={gridRef}
        items={displayItems}
        isLoading={isLoading && currentPage === 1}
        isError={isError}
        errorMessage="Failed to load journeys. Please try again later."
        onRetry={refetch}
        layout="grid"
        gridClassName="grid grid-cols-1 gap-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6"
        emptyIcon={Compass}
        emptyTitle={hasFilters ? "No matching journeys found" : "No Journeys Created Yet"}
        emptyDescription={
          hasFilters
            ? "Try adjusting your search criteria or clearing filters."
            : "Click below to build your first bespoke journey."
        }
        emptyAction={
          <Link
            to="/journeys/new"
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-brand-primary px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-accent"
          >
            <Plus className="h-4 w-4" /> Add Journey
          </Link>
        }
        renderItem={(j, index) => {
          const journeyTitle = j.title || "Untitled Journey"
          const slugPath = j.slug ? `/journeys/${j.slug}` : ""

              const heroData = j.hero || (j as any).data?.hero || {}
              const heroMultimedia = heroData.backgroundMultimedia
              const heroBgImage = heroData.background_image
              const heroVideo = heroData.video

              const rawMeta = j.metadata || (j as any).data?.metadata
              const seoData = rawMeta?.seo || rawMeta || {}
              const seoTitle = getSafeStringValue(seoData.title || seoData.metaTitle, "")
              const seoDesc = getSafeStringValue(seoData.description || seoData.metaDescription, "")

              const isSeoComplete = Boolean(seoTitle && seoDesc)

              return (
                <div
                  key={`${j.id ?? "j"}-${j.slug ?? index}`}
                  className="group relative flex min-h-[440px] flex-col overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm transition-all duration-500 hover:-translate-y-1.5 hover:shadow-2xl hover:border-primary/40"
                >
                  {/* Delete Button */}
                  <button
                    type="button"
                    onClick={() => openDeleteModal(j)}
                    className="absolute top-3.5 right-3.5 z-20 rounded-full bg-background/90 p-2 text-muted-foreground opacity-0 shadow-md backdrop-blur transition-all group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive focus:opacity-100 cursor-pointer"
                    title="Delete Journey"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>

                  {/* HERO BANNER PREVIEW */}
                  <div className="relative h-56 overflow-hidden bg-brand-primary">
                    <UniversalMultimediaPreview
                      multimedia={heroMultimedia ?? undefined}
                      fallbackImageSrc={heroBgImage}
                      fallbackVideoSrc={heroVideo}
                      fallbackAlt={journeyTitle}
                      mode="background"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      containerClassName="h-full w-full"
                    />

                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/10" />

                    {/* Top Badges */}
                    <div className="absolute top-3.5 left-3.5 z-10 flex flex-wrap gap-1.5 items-center">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider shadow-sm ${
                          j.status === "PUBLISHED"
                            ? "bg-brand-primary text-amber-100 border border-brand-primary"
                            : j.status === "ARCHIVED"
                            ? "bg-slate-800 text-white"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {j.status || "DRAFT"}
                      </span>
                      {j.featured && (
                        <span className="rounded-full bg-accent px-2.5 py-0.5 text-[10px] font-bold text-white shadow-sm tracking-wider uppercase">
                          ★ Featured
                        </span>
                      )}
                    </div>

                    {/* Bottom Info Overlay */}
                    <div className="absolute right-3.5 bottom-3.5 left-3.5 z-10 space-y-1">
                      <p className="text-[11px] font-semibold text-accent-muted uppercase tracking-widest truncate">
                        {j.currency === "EUR" ? "€" : j.currency} {j.price} • {j.minDays}-{j.maxDays} Days
                      </p>
                      <h3 className="text-xl font-serif font-bold text-white leading-snug drop-shadow-sm truncate">
                        {journeyTitle}
                      </h3>
                      {slugPath && (
                        <p className="text-[11px] font-mono text-white/75 truncate">
                          {slugPath}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* CARD BODY */}
                  <div className="flex flex-1 flex-col p-4 justify-between gap-4">
                    {/* Tags & Attributes */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[11px] font-semibold text-accent uppercase tracking-wider">
                        <span className="flex items-center gap-1">
                          <Tag className="h-3.5 w-3.5 text-accent" />
                          Attributes
                        </span>
                        <span className="text-[10px] text-foreground font-mono bg-muted/40 border border-border/60 px-2 py-0.5 rounded-md">
                          {j.pace} PACE
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-1.5">
                        {(j.journeyType || []).slice(0, 2).map((jt) => (
                          <span
                            key={jt}
                            className="rounded-full bg-muted/40 border border-border/60 px-2.5 py-0.5 text-[10px] font-medium text-foreground tracking-wider uppercase"
                          >
                            {jt.replace(/_/g, " ")}
                          </span>
                        ))}
                        {(j.travelStyle || []).slice(0, 2).map((ts) => (
                          <span
                            key={ts}
                            className="rounded-full bg-muted/40 border border-border/60 px-2.5 py-0.5 text-[10px] font-medium text-accent tracking-wider uppercase"
                          >
                            {ts.replace(/_/g, " ")}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* SEO STATUS */}
                    <div className="rounded-xl border border-border/60 bg-muted/20 p-3 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-foreground flex items-center gap-1">
                          <Globe className="h-3.5 w-3.5 text-accent" />
                          SEO Governance
                        </span>
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-medium tracking-wide ${
                            isSeoComplete
                              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                              : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                          }`}
                        >
                          {isSeoComplete ? "Ready" : "Partial"}
                        </span>
                      </div>

                      <p className="text-[11px] font-medium text-muted-foreground truncate" title={seoTitle}>
                        {seoTitle || "No Meta Title"}
                      </p>
                    </div>

                    {/* EDIT LINK */}
                    <Link
                      to={`/journeys/${j.id}/${j.slug}`}
                      className="inline-flex items-center justify-between rounded-xl bg-brand-primary px-4 py-2.5 text-xs font-semibold text-white tracking-wide transition-all hover:bg-accent shadow-sm cursor-pointer"
                    >
                      <span>Edit Journey</span>
                      <span>→</span>
                    </Link>
                  </div>
                </div>
              )
            }}
          />

      {/* Universal Smart Pagination & Infinite Scroll Sentinel */}
      {meta && (
        <Pagination
          mode={mode}
          currentPage={currentPage}
          totalPages={meta.totalPages}
          totalItems={meta.total}
          pageSize={effectiveLimit}
          pageSizeOptions={pageSizeOptions}
          onPageChange={setCurrentPage}
          onPageSizeChange={setTargetItems}
          hasMore={hasMore}
          isLoadingMore={isLoadingMore || (isFetching && currentPage > 1)}
          onLoadMore={handleLoadMore}
          loadedCount={displayItems.length}
          columns={columns}
          className="mt-6"
        />
      )}

      {/* Delete Confirmation Modal */}
      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-serif text-xl text-brand-primary">Delete Journey?</DialogTitle>
            <DialogDescription className="text-subtitle">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-brand-primary">
                "{selectedJourney?.title}"
              </span>
              ? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteModalOpen(false)}
              disabled={isDeleting}
              className="rounded-xl border-border hover:bg-muted"
            >
              Cancel
            </Button>

            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={isDeleting}
              className="gap-1.5 rounded-xl bg-red-600 hover:bg-red-700"
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
