import MiraLoader from "@/components/shared/MiraLoader"
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
  Globe,
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

import { LOCATION_TYPES } from "@/components/pages/Location/locationTypes"
import { ParentLocationSelect } from "@/components/pages/Location/shared/ParentLocationSelect"
import { UniversalMultimediaPreview } from "@/components/pages/CMS/Home/shared/preview/UniversalMultimediaPreview"
import { getSafeStringValue } from "@/components/pages/Location/shared/normalizeHelpers"

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

  const { data, isLoading, isError, refetch } = useGetLocationPages({
    page,
    limit: PAGE_SIZE,
    search: search || undefined,
    type: type || undefined,
    parentId: parentId || undefined,
  })

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

  const pages = data?.data ?? []
  const meta = data?.meta

  const hasFilters = Boolean(search || type || parentId)

  return (
    <div className="w-full animate-in pt-2 duration-700 fade-in slide-in-from-bottom-4">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Location Pages
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Manage content for individual location and destination pages.
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
          <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search locations by name, slug or type..."
            className="w-full rounded-lg border border-border/60 bg-background py-2.5 pr-3 pl-9 text-sm outline-none focus:border-primary"
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
        <MiraLoader text="Loading location pages..." className="py-12 min-h-[300px]" />
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
            {pages.map((page, index) => {
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
                      to={`/locations/${page.id}/${page.slug}`}
                      className="inline-flex items-center justify-between rounded-xl bg-primary/10 px-4 py-2.5 text-xs font-semibold text-primary transition-all hover:bg-primary hover:text-primary-foreground cursor-pointer"
                    >
                      <span>Edit {pageName}</span>
                      <span className="transition-transform group-hover:translate-x-1">→</span>
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
