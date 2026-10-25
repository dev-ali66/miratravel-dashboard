import {
  useGetLocationPages,
  type LocationPageData,
} from "@/hooks/location/useGetLocation"
import { useDeleteLocation } from "@/hooks/location/useDeleteLocation"
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
import { useEffect, useState } from "react"
import {
  Trash2,
  MapPin,
  Loader2,
  Plus,
  Globe,
  Sparkles,
  Building2,
  CheckCircle2,
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
import { UniversalMultimediaPreview } from "@/components/pages/CMS/Home/shared/preview/UniversalMultimediaPreview"
import { getSafeStringValue } from "@/components/pages/Location/shared/normalizeHelpers"

export default function LocationPages() {
  const [searchInput, setSearchInput] = useState("")
  const [search, setSearch] = useState("")
  const [type, setType] = useState<string>("")
  const [parentId, setParentId] = useState<string | null>(null)

  // debounce the search box before it hits the API
  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearch(searchInput)
    }, 350)

    return () => clearTimeout(timeout)
  }, [searchInput])

  const filterKey = `${search}-${type}-${parentId}`

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
  } = useListingPagination<LocationPageData>({
    mode: "infinite",
    initialTargetItems: 18,
    isGrid: true,
    gridColumns: { base: 1, md: 3, lg: 5, xl: 6 },
    filterKey,
    keyExtractor: (item) => item.id,
  })

  const setPage = setCurrentPage

  const { data, isLoading, isFetching, isError, refetch } = useGetLocationPages({
    page: currentPage,
    limit: effectiveLimit,
    search: search || undefined,
    type: type || undefined,
    parentId: parentId || undefined,
  })

  // Sync incoming data to pagination manager
  useEffect(() => {
    if (data) {
      setIncomingData(data.data, data.meta?.total)
    }
  }, [data, setIncomingData])

  // Refetch when mounting or returning back to this page
  useEffect(() => {
    refetch()
  }, [refetch])

  const { mutate: deleteLocation, isPending: isDeleting } = useDeleteLocation()

  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [selectedPage, setSelectedPage] = useState<LocationPageData | null>(
    null
  )

  const openDeleteModal = (page: LocationPageData) => {
    setSelectedPage(page)
    setDeleteModalOpen(true)
  }

  const confirmDelete = () => {
    if (!selectedPage) return

    deleteLocation(selectedPage.id, {
      onSuccess: () => {
        toast.success(`"${selectedPage.name}" location page deleted.`)
        refetch()
        setDeleteModalOpen(false)
        setSelectedPage(null)
      },
      onError: () => {
        toast.error("Failed to delete location page. Please try again.")
      },
    })
  }

  const formatPageName = (name: string) => {
    return name
      .replace(/([A-Z])/g, " $1")
      .replace(/[-_]/g, " ")
      .trim()
  }

  const pages = displayItems
  const meta = data?.meta

  const hasFilters = Boolean(search || type || parentId)

  return (
    <div className="w-full space-y-6 animate-in pt-2 duration-700 fade-in slide-in-from-bottom-4">
      {/* Header with 30% title & 70% compact statistics */}
      <PageHeader
        icon={MapPin}
        title="Location Pages"
        subtitle="Manage destination content, countries, and regional guides."
        stats={
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5 w-full">
            <CompactStatCard
              label="Destinations"
              value={meta?.total ?? pages.length}
              subtext="Geographic hubs"
              icon={MapPin}
              iconColor="text-primary"
            />
            <CompactStatCard
              label="Countries / Reg"
              value={`${pages.filter((p) => p.type === "COUNTRY" || p.type === "REGION").length}`}
              subtext="Top-level entities"
              icon={Globe}
              iconColor="text-emerald-500"
            />
            <CompactStatCard
              label="Cities & Spots"
              value={`${pages.filter((p) => p.type === "CITY" || p.type === "ATTRACTION").length}`}
              subtext="Local attractions"
              icon={Building2}
              iconColor="text-blue-500"
            />
            <CompactStatCard
              label="SEO Indexing"
              value={`${pages.filter((p) => Boolean(p.seoTitle && p.seoDescription)).length} Ready`}
              subtext="Search tags active"
              icon={CheckCircle2}
              iconColor="text-purple-500"
            />
          </div>
        }
      />

      {/* Search + Filters */}
      <FilterToolbar>
        <FilterGroup>
          <FilterSearch
            value={searchInput}
            onChange={(val) => {
              setSearchInput(val)
              setPage(1)
            }}
            placeholder="Search locations..."
            width="w-44 sm:w-56 shrink-0"
          />

          <FilterSelect
            value={type}
            onChange={(val) => {
              setType(val)
              setPage(1)
            }}
            options={LOCATION_TYPES.map((t) => ({ label: t, value: t }))}
            allLabel="All Location Types"
            placeholder="Location Type"
            width="min-w-[130px] max-w-[160px]"
          />

          <div className="w-40 sm:w-52 shrink-0">
            <ParentLocationSelect
              value={parentId}
              label=""
              noneLabel="All Parent Locations"
              placeholder="Filter by parent..."
              className="space-y-0"
              triggerClassName="h-8 sm:h-8.5 rounded-lg border-border/70 bg-background/60 dark:bg-background/40 hover:bg-muted/50 text-xs px-2.5 py-1"
              onChange={(id) => {
                setParentId(id)
                setPage(1)
              }}
            />
          </div>

          {(searchInput || type || parentId) && (
            <FilterResetButton
              onClick={() => {
                setSearchInput("")
                setType("")
                setParentId(null)
                setPage(1)
              }}
            />
          )}
        </FilterGroup>

        <FilterActions>
          <FilterCreateButton
            to="/locations/new"
            label="Add Location"
            icon={Plus}
          />
        </FilterActions>
      </FilterToolbar>

      {/* Location Pages via Universal DataPreview */}
      <DataPreview<LocationPageData>
        gridRef={gridRef}
        items={displayItems}
        isLoading={isLoading && currentPage === 1}
        isError={isError}
        errorMessage="Failed to load location pages. Please check backend connection."
        onRetry={refetch}
        layout="grid"
        gridClassName="grid grid-cols-1 gap-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6"
        emptyIcon={MapPin}
        emptyTitle={hasFilters ? "No matching locations found" : "No Location Pages Found"}
        emptyDescription={
          hasFilters
            ? "Try a different search term or clear the filters."
            : "There are no location pages created yet."
        }
        emptyAction={
          <Link
            to="/locations/new"
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            Add First Location
          </Link>
        }
        renderItem={(page, index) => {
          const pageName = page.name ? formatPageName(page.name) : "Untitled Location"

              // 1. Basic Info Data
              const typeName = page.type || "PLACE"
              const parentName = page.parent?.name
              const slugPath = page.slug ? `/${page.slug.replace(/^\//, "")}` : ""

              // 2. Hero Section Data
              const heroData = page.hero || (page as any).data?.hero || {}
              const heroMultimedia = heroData.backgroundMultimedia
              const heroBgImage = heroData.background_image
              const heroVideo = heroData.video
              const hasHeroMedia = Boolean(
                (heroMultimedia &&
                  ((heroMultimedia.show === "video" && (heroMultimedia.video?.url || heroMultimedia.url)) ||
                    (heroMultimedia.show === "image" && (heroMultimedia.image?.url || heroMultimedia.url)) ||
                    (heroMultimedia.show === "color" && heroMultimedia.color?.color) ||
                    heroMultimedia.url)) ||
                heroBgImage ||
                heroVideo
              )

              const heroLabel = getSafeStringValue(heroData.label, "")
              const heroTitle = getSafeStringValue(heroData.title, "")
              const heroDesc = getSafeStringValue(heroData.description, "")

              // 3. SEO Metadata
              const rawMeta = page.metadata || (page as any).data?.metadata
              const seoData = rawMeta?.seo || rawMeta || {}
              const seoTitle = getSafeStringValue(seoData.title || seoData.metaTitle || seoData.pageTitle, "")
              const seoDesc = getSafeStringValue(seoData.description || seoData.metaDescription, "")
              const seoKeywords: string[] = Array.isArray(seoData.keywords)
                ? seoData.keywords
                : typeof seoData.keywords === "string"
                  ? seoData.keywords.split(",").map((k: string) => k.trim()).filter(Boolean)
                  : []

              const isSeoComplete = Boolean(seoTitle && seoDesc)
              const isSeoPartial = Boolean(seoTitle || seoDesc)

              return (
                <div
                  key={`${page.id ?? "loc"}-${page.slug ?? index}`}
                  className="group relative flex min-h-[420px] flex-col overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-primary/40"
                >
                  {/* Delete Modal Trigger */}
                  <button
                    type="button"
                    onClick={() => openDeleteModal(page)}
                    className="absolute top-3.5 right-3.5 z-20 rounded-full bg-background/90 p-2 text-muted-foreground opacity-0 shadow-sm backdrop-blur transition-all group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive focus:opacity-100 cursor-pointer"
                    title="Delete Location Page"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>

                  {/* HERO MEDIA & BASIC INFO BANNER */}
                  <div className="relative h-48 overflow-hidden bg-muted">
                    {hasHeroMedia ? (
                      <UniversalMultimediaPreview
                        multimedia={heroMultimedia ?? undefined}
                        fallbackImageSrc={heroBgImage}
                        fallbackVideoSrc={heroVideo}
                        fallbackAlt={pageName}
                        mode="background"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        containerClassName="h-full w-full"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-primary/5">
                        <MapPin className="h-10 w-10 text-primary/40" />
                      </div>
                    )}

                    {/* Gradient Overlay */}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10" />

                    {/* Top Badges: Location Type & Parent */}
                    <div className="absolute top-3.5 left-3.5 z-10 flex items-center gap-2 flex-wrap">
                      <span className="rounded-full bg-background/95 px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-foreground uppercase shadow-sm backdrop-blur">
                        {typeName}
                      </span>
                      {parentName && (
                        <span className="rounded-full bg-black/50 px-2.5 py-0.5 text-[10px] font-medium text-white/90 backdrop-blur flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-primary" />
                          {parentName}
                        </span>
                      )}
                    </div>

                    {/* Bottom Hero Overlay: Name & Slug */}
                    <div className="absolute right-3.5 bottom-3.5 left-3.5 z-10 space-y-0.5">
                      {heroLabel && (
                        <span className="text-[10px] font-semibold tracking-widest text-primary-foreground/90 uppercase block truncate">
                          {heroLabel}
                        </span>
                      )}
                      <h3 className="text-xl font-serif font-bold text-white leading-tight truncate">
                        {pageName}
                      </h3>
                      {slugPath && (
                        <p className="text-[11px] font-mono text-white/70 truncate">
                          {slugPath}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* CARD BODY: HERO NARRATIVE & SEO GOVERNANCE */}
                  <div className="flex flex-1 flex-col p-4 justify-between gap-4">
                    {/* HERO NARRATIVE */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                        <span className="flex items-center gap-1.5">
                          <Sparkles className="h-3.5 w-3.5 text-primary" />
                          Hero Summary
                        </span>
                      </div>
                      <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                        {heroDesc || (heroTitle ? heroTitle : `Manage content and experience details for ${pageName}.`)}
                      </p>
                    </div>

                    {/* SEO METADATA & STATUS CARD */}
                    <div className="rounded-xl border border-border/60 bg-muted/20 p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                          <Globe className="h-3.5 w-3.5 text-primary" />
                          SEO Meta
                        </span>
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${isSeoComplete
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                              : isSeoPartial
                                ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                                : "bg-destructive/10 text-destructive"
                            }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${isSeoComplete
                                ? "bg-emerald-500"
                                : isSeoPartial
                                  ? "bg-amber-500"
                                  : "bg-destructive"
                              }`}
                          />
                          {isSeoComplete
                            ? "SEO Ready"
                            : isSeoPartial
                              ? "SEO Partial"
                              : "SEO Missing"}
                        </span>
                      </div>

                      <p className="text-[11px] font-medium text-foreground truncate" title={seoTitle}>
                        {seoTitle ? `Meta: "${seoTitle}"` : "No Meta Title set"}
                      </p>

                      {seoDesc ? (
                        <p className="line-clamp-1 text-[10px] text-muted-foreground" title={seoDesc}>
                          {seoDesc}
                        </p>
                      ) : (
                        <p className="text-[10px] text-amber-600/80 italic dark:text-amber-400/80">
                          Missing meta description
                        </p>
                      )}

                      {seoKeywords.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-1 border-t border-border/40">
                          {seoKeywords.slice(0, 3).map((kw: string, i: number) => (
                            <span
                              key={i}
                              className="rounded bg-primary/8 px-1.5 py-0.5 text-[9px] font-medium text-primary"
                            >
                              #{kw}
                            </span>
                          ))}
                          {seoKeywords.length > 3 && (
                            <span className="rounded bg-muted px-1.5 py-0.5 text-[9px] font-medium text-muted-foreground">
                              +{seoKeywords.length - 3}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* EDIT BUTTON */}
                    <Link
                      to={`/locations/${page.id}/${page.slug}`}
                      className="inline-flex items-center justify-between rounded-xl bg-primary/10 px-4 py-2.5 text-xs font-semibold text-primary transition-all hover:bg-primary hover:text-primary-foreground cursor-pointer"
                    >
                      <span>Edit {pageName}</span>
                      <span className="transition-transform group-hover:translate-x-1">→</span>
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

      {/* Delete Dialog */}
      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete location page?</DialogTitle>

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
              {isDeleting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
