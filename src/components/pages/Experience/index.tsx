import MiraLoader from "@/components/shared/MiraLoader"
import {
  useGetExperiencePages,
  type ExperienceItemData,
} from "@/hooks/experience/useGetExperiences"
import { useDeleteExperience } from "@/hooks/experience/useDeleteExperience"
import { Pagination } from "@/components/shared/Pagination"
import { Link } from "react-router-dom"
import { useEffect, useState } from "react"
import {
  Trash2,
  MapPin,
  Plus,
  Search,
  Sparkles,
  Compass,
  Globe,
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

const PAGE_SIZE = 12

const getSafeStringValue = (val: any, fallback = ""): string => {
  if (typeof val === "string") return val.trim()
  if (typeof val?.text === "string") return val.text.trim()
  return fallback
}

export default function ExperiencePages() {
  const [page, setPage] = useState(1)
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
      setPage(1)
    }, 350)

    return () => clearTimeout(timeout)
  }, [searchInput])

  const { data, isLoading, isError, refetch } = useGetExperiencePages({
    page,
    limit: PAGE_SIZE,
    search: search || undefined,
    countryId: countryId || undefined,
    primaryType: primaryType || undefined,
    status: status || undefined,
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
                Curate independent content entities with classification, geography links, and bespoke itineraries.
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
      <div className="flex flex-col gap-3">
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

          {/* Primary Type Filter */}
          <select
            value={primaryType}
            onChange={(e) => {
              setPrimaryType(e.target.value)
              setPage(1)
            }}
            className="rounded-xl border border-border/70 bg-card px-3 py-2 text-xs md:text-sm text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary md:w-52 cursor-pointer"
          >
            <option value="">All 8 Experience Types</option>
            {EXPERIENCE_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value)
              setPage(1)
            }}
            className="rounded-xl border border-border/70 bg-card px-3 py-2 text-xs md:text-sm text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary md:w-36 cursor-pointer"
          >
            <option value="">All Statuses</option>
            {EXPERIENCE_STATUS_OPTIONS.map((st) => (
              <option key={st.value} value={st.value}>
                {st.label}
              </option>
            ))}
          </select>

          {/* Currency Filter */}
          <select
            value={currency}
            onChange={(e) => {
              setCurrency(e.target.value)
              setPage(1)
            }}
            className="rounded-xl border border-border/70 bg-card px-3 py-2 text-xs md:text-sm text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary md:w-36 cursor-pointer"
          >
            <option value="">All Currencies</option>
            {EXPERIENCE_CURRENCY_OPTIONS.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>

          {/* Country Location Filter */}
          <div className="w-full md:w-56">
            <ParentLocationSelect
              value={countryId}
              filterType="COUNTRY"
              label=""
              noneLabel="All Countries"
              placeholder="Filter by country..."
              onChange={(id) => {
                setCountryId(id || null)
                setPage(1)
              }}
            />
          </div>

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
            <span>Featured</span>
          </button>
        </div>
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
        <div className="grid grid-cols-1 gap-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">
          {data.data.map((exp, index) => {
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
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/80 bg-card p-12 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted text-muted-foreground mb-3">
            <Compass className="h-6 w-6" />
          </div>
          <h3 className="text-sm font-semibold text-foreground">No experiences found</h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm">
            {search || countryId || primaryType || status
              ? "Try adjusting your search criteria or clear active filters."
              : "Get started by creating your first MIRA curated experience."}
          </p>
          <Link
            to="/experiences/new"
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            Create First Experience
          </Link>
        </div>
      )}

      {/* Universal Pagination */}
      {data?.meta && (
        <Pagination
          currentPage={page}
          totalPages={data.meta.totalPages}
          totalItems={data.meta.total}
          pageSize={PAGE_SIZE}
          onPageChange={setPage}
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
