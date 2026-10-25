import {
  useGetExperiencePages,
  type ExperienceItemData,
} from "@/hooks/experience/useGetExperiences"
import { useDeleteExperience } from "@/hooks/experience/useDeleteExperience"
import { Pagination } from "@/components/shared/Pagination"
import { DataPreview } from "@/components/shared/DataPreview"
import { useListingPagination } from "@/hooks/ui/useListingPagination"
import { PageHeader, CompactStatCard } from "@/components/shared/PageHeader"
import {
  FilterToolbar,
  FilterGroup,
  FilterSearch,
  FilterSelect,
  FilterToggle,
  FilterActions,
  FilterCreateButton,
  FilterResetButton,
} from "@/components/shared/FilterToolbar"
import { Link } from "react-router-dom"
import { useEffect, useState } from "react"
import {
  Trash2,
  MapPin,
  Plus,
  Sparkles,
  Compass,
  Globe,
  CheckCircle2,
  Layers,
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
import {
  EXPERIENCE_CURRENCY_OPTIONS,
  EXPERIENCE_TYPES,
  EXPERIENCE_TYPE_CONFIG,
  EXPERIENCE_STATUS_OPTIONS,
  type ExperienceType,
} from "./experienceTypes"

const getSafeStringValue = (val: any, fallback = ""): string => {
  if (typeof val === "string") return val.trim()
  if (typeof val?.text === "string") return val.text.trim()
  return fallback
}

export default function ExperiencePages() {
  const [searchInput, setSearchInput] = useState("")
  const [search, setSearch] = useState("")
  const [countryId, setCountryId] = useState<string | null>(null)
  const [primaryType, setPrimaryType] = useState<string>("")
  const [status, setStatus] = useState<string>("")
  const [currency, setCurrency] = useState<string>("")
  const [featured, setFeatured] = useState<boolean | undefined>(undefined)

  // Debounce search box
  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearch(searchInput)
    }, 350)

    return () => clearTimeout(timeout)
  }, [searchInput])

  const filterKey = `${search}-${countryId}-${primaryType}-${status}-${currency}-${featured}`

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
  } = useListingPagination<ExperienceItemData>({
    mode: "infinite",
    initialTargetItems: 18,
    isGrid: true,
    gridColumns: { base: 1, md: 3, lg: 5, xl: 6 },
    filterKey,
    keyExtractor: (item) => item.id,
  })

  const setPage = setCurrentPage

  const { data, isLoading, isFetching, isError, refetch } = useGetExperiencePages({
    page: currentPage,
    limit: effectiveLimit,
    search: search || undefined,
    countryId: countryId || undefined,
    primaryType: primaryType || undefined,
    status: status || undefined,
    currency: currency || undefined,
    featured,
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

  const experiences = data?.data || []
  const meta = data?.meta

  return (
    <div className="w-full space-y-6 animate-in pt-2 duration-700 fade-in slide-in-from-bottom-4">
      {/* Page Header with 30% title & 70% compact statistics */}
      <PageHeader
        icon={Sparkles}
        title="Experiences"
        subtitle="Curate activities, geography links, and bespoke itineraries."
        stats={
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5 w-full">
            <CompactStatCard
              label="Experiences"
              value={meta?.total ?? experiences.length}
              subtext="Activities & stays"
              icon={Sparkles}
              iconColor="text-primary"
            />
            <CompactStatCard
              label="Live Published"
              value={`${experiences.filter((e) => (e as any).status === "PUBLISHED").length} Active`}
              subtext="Public explorer"
              icon={CheckCircle2}
              iconColor="text-emerald-500"
            />
            <CompactStatCard
              label="Highlights"
              value={`${experiences.filter((e) => (e as any).isFeatured).length} Curated`}
              subtext="Hero featured"
              icon={Compass}
              iconColor="text-purple-500"
            />
            <CompactStatCard
              label="Categories"
              value={`${EXPERIENCE_TYPES.length} Types`}
              subtext="Cultural to active"
              icon={Layers}
              iconColor="text-blue-500"
            />
          </div>
        }
      />

      {/* Filter and Search Bar */}
      <FilterToolbar>
        <FilterGroup>
          {/* Search Input */}
          <FilterSearch
            value={searchInput}
            onChange={(val) => {
              setSearchInput(val)
              setPage(1)
            }}
            placeholder="Search experiences..."
            width="w-40 sm:w-52 shrink-0"
          />

          {/* Primary Type Filter */}
          <FilterSelect
            value={primaryType}
            onChange={(val) => {
              setPrimaryType(val)
              setPage(1)
            }}
            options={EXPERIENCE_TYPES}
            allLabel="All 8 Experience Types"
            placeholder="Experience Type"
            width="min-w-[150px] max-w-[170px]"
          />

          {/* Status Filter */}
          <FilterSelect
            value={status}
            onChange={(val) => {
              setStatus(val)
              setPage(1)
            }}
            options={EXPERIENCE_STATUS_OPTIONS}
            allLabel="All Statuses"
            placeholder="Status"
            width="min-w-[105px] max-w-[120px]"
          />

          {/* Currency Filter */}
          <FilterSelect
            value={currency}
            onChange={(val) => {
              setCurrency(val)
              setPage(1)
            }}
            options={EXPERIENCE_CURRENCY_OPTIONS}
            allLabel="All Currencies"
            placeholder="Currency"
            width="min-w-[100px] max-w-[115px]"
          />

          {/* Country Location Filter */}
          <div className="w-36 sm:w-44 shrink-0">
            <ParentLocationSelect
              value={countryId}
              filterType="COUNTRY"
              label=""
              noneLabel="All Countries"
              placeholder="Filter by country..."
              className="space-y-0"
              triggerClassName="h-8 sm:h-8.5 rounded-lg border-border/70 bg-background/60 dark:bg-background/40 hover:bg-muted/50 text-xs px-2.5 py-1"
              onChange={(id) => {
                setCountryId(id || null)
                setPage(1)
              }}
            />
          </div>

          {/* Featured Filter Toggle */}
          <FilterToggle
            active={featured === true}
            onToggle={() => {
              setFeatured((prev) => (prev === true ? undefined : true))
              setPage(1)
            }}
            label="Featured"
            icon={Sparkles}
          />

          {/* Reset Filters */}
          {(searchInput || primaryType || status || currency || countryId || featured !== undefined) && (
            <FilterResetButton
              onClick={() => {
                setSearchInput("")
                setPrimaryType("")
                setStatus("")
                setCurrency("")
                setCountryId(null)
                setFeatured(undefined)
                setPage(1)
              }}
            />
          )}
        </FilterGroup>

        {/* Action Button */}
        <FilterActions>
          <FilterCreateButton
            to="/experiences/new"
            label="Create Experience"
            icon={Plus}
          />
        </FilterActions>
      </FilterToolbar>

      {/* Experience List Cards via Universal DataPreview */}
      <DataPreview<ExperienceItemData>
        gridRef={gridRef}
        items={displayItems}
        isLoading={isLoading && currentPage === 1}
        isError={isError}
        errorMessage="Failed to fetch experiences. Please verify the backend server is running on port 5010."
        onRetry={refetch}
        layout="grid"
        gridClassName="grid grid-cols-1 gap-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6"
        emptyIcon={Compass}
        emptyTitle="No experiences found"
        emptyDescription={
          search || countryId || primaryType || status || currency || featured !== undefined
            ? "Try adjusting your search criteria or clear active filters."
            : "Get started by creating your first MIRA curated experience."
        }
        emptyAction={
          <Link
            to="/experiences/new"
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            Create First Experience
          </Link>
        }
        renderItem={(exp, index) => {
          const expName = exp.name ? exp.name.trim() : "Untitled Experience"
          const slugPath = exp.slug ? `/${exp.slug.replace(/^\//, "")}` : ""

            // Media data
            const heroData = exp.hero || {}
            const heroMultimedia = heroData.backgroundMultimedia || heroData.multimedia
            const theExpMedia = (exp as any).theExperience?.imageMultimedia
            const essenceMedia = exp.essence?.imageMultimedia || exp.essence?.multimedia
            const previewMedia = heroMultimedia || theExpMedia || essenceMedia
            const hasHeroMedia = Boolean(
              previewMedia &&
                ((previewMedia.show === "video" && (previewMedia.video?.url || previewMedia.url)) ||
                  (previewMedia.show === "image" && (previewMedia.image?.url || previewMedia.url)) ||
                  (previewMedia.show === "color" && previewMedia.color?.color) ||
                  previewMedia.url)
            )

            // Primary Type & Badges
            const typeConfig = exp.primaryType
              ? EXPERIENCE_TYPE_CONFIG[exp.primaryType as ExperienceType]
              : null
            const typeName = typeConfig?.label || exp.primaryType || "EXPERIENCE"

            const locationBadge =
              (exp.places as any)?.[0]?.name ||
              (exp as any).place?.name ||
              (exp.regions as any)?.[0]?.name ||
              (exp as any).region?.name ||
              (exp.countries as any)?.[0]?.name ||
              (exp as any).country?.name

            const heroLabel = getSafeStringValue(heroData.label, exp.subtitle || "")
            const heroTitle = getSafeStringValue(heroData.title, "")
            const heroDesc = getSafeStringValue(heroData.description, exp.subtitle || "")

            // SEO Metadata
            const rawMeta = (exp as any).metadata || (exp as any).seo || (exp as any).data?.metadata
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
                key={`${exp.id ?? "exp"}-${exp.slug ?? index}`}
                className="group relative flex min-h-[420px] flex-col overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-primary/40"
              >
                {/* Delete Modal Trigger */}
                <button
                  type="button"
                  onClick={() => openDeleteModal(exp)}
                  className="absolute top-3.5 right-3.5 z-20 rounded-full bg-background/90 p-2 text-muted-foreground opacity-0 shadow-sm backdrop-blur transition-all group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive focus:opacity-100 cursor-pointer"
                  title="Delete Experience"
                >
                  <Trash2 className="h-4 w-4" />
                </button>

                {/* HERO MEDIA & BASIC INFO BANNER */}
                <div className="relative h-48 overflow-hidden bg-muted">
                  {hasHeroMedia ? (
                    <UniversalMultimediaPreview
                      multimedia={previewMedia ?? undefined}
                      fallbackAlt={expName}
                      mode="background"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      containerClassName="h-full w-full"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-primary/5">
                      <Compass className="h-10 w-10 text-primary/40" />
                    </div>
                  )}

                  {/* Gradient Overlay */}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10" />

                  {/* Top Badges: Type, Location & Featured */}
                  <div className="absolute top-3.5 left-3.5 z-10 flex items-center gap-2 flex-wrap">
                    <span className="rounded-full bg-background/95 px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-foreground uppercase shadow-sm backdrop-blur">
                      {typeName}
                    </span>
                    {locationBadge && (
                      <span className="rounded-full bg-black/50 px-2.5 py-0.5 text-[10px] font-medium text-white/90 backdrop-blur flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-primary" />
                        {locationBadge}
                      </span>
                    )}
                    {exp.featured && (
                      <span className="rounded-full bg-amber-500/90 px-2.5 py-0.5 text-[10px] font-semibold text-white shadow-sm backdrop-blur flex items-center gap-1">
                        <Sparkles className="h-3 w-3" />
                        Featured
                      </span>
                    )}
                  </div>

                  {/* Bottom Hero Overlay: Label, Name & Slug */}
                  <div className="absolute right-3.5 bottom-3.5 left-3.5 z-10 space-y-0.5">
                    {heroLabel && (
                      <span className="text-[10px] font-semibold tracking-widest text-primary-foreground/90 uppercase block truncate">
                        {heroLabel}
                      </span>
                    )}
                    <h3 className="text-xl font-serif font-bold text-white leading-tight truncate">
                      {expName}
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
                  {/* HERO NARRATIVE & PRICE */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                      <span className="flex items-center gap-1.5">
                        <Sparkles className="h-3.5 w-3.5 text-primary" />
                        Hero Summary
                      </span>
                      {exp.price !== null && exp.price !== undefined ? (
                        <span className="text-xs font-bold text-foreground font-sans">
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
                        <span className="text-muted-foreground text-[10px] font-normal">
                          Custom / Inquire
                        </span>
                      )}
                    </div>
                    <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                      {heroDesc || (heroTitle ? heroTitle : `Manage content and experience details for ${expName}.`)}
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
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${
                          isSeoComplete
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                            : isSeoPartial
                            ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                            : "bg-destructive/10 text-destructive"
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            isSeoComplete
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
                    to={`/experiences/${exp.id}/${exp.slug || "details"}`}
                    className="inline-flex items-center justify-between rounded-xl bg-primary/10 px-4 py-2.5 text-xs font-semibold text-primary transition-all hover:bg-primary hover:text-primary-foreground cursor-pointer"
                  >
                    <span>Edit {expName}</span>
                    <span className="transition-transform group-hover:translate-x-1">→</span>
                  </Link>
                </div>
              </div>
            )
          }}
        />

      {/* Universal Smart Pagination & Infinite Scroll Sentinel */}
      {data?.meta && (
        <Pagination
          mode={mode}
          currentPage={currentPage}
          totalPages={data.meta.totalPages}
          totalItems={data.meta.total}
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
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-destructive">
              Delete Experience
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Are you sure you want to permanently delete{" "}
              <strong className="text-foreground">{selectedExperience?.name}</strong>? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="gap-2 sm:gap-0 mt-3">
            <Button
              variant="outline"
              size="sm"
              disabled={isDeleting}
              onClick={() => setDeleteModalOpen(false)}
              className="text-xs cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              disabled={isDeleting}
              onClick={confirmDelete}
              className="text-xs cursor-pointer"
            >
              {isDeleting ? "Deleting..." : "Delete Permanently"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
