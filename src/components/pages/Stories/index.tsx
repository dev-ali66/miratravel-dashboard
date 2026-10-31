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
  BookOpen,
  Loader2,
  Plus,
  Globe,
  Tag,
  Clock,
  User,
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

import { useGetStories } from "@/hooks/story/useGetStories"
import { useDeleteStory } from "@/hooks/story/useStoryMutations"
import { useGetStoryCategories } from "@/hooks/story/useStoryCategories"
import type { Story } from "@/hooks/story/storyTypes"
import { UniversalMultimediaPreview } from "@/components/pages/CMS/Home/shared/preview/UniversalMultimediaPreview"
import { getSafeStringValue } from "@/components/pages/Location/shared/normalizeHelpers"

export default function StoriesPage() {
  const [searchInput, setSearchInput] = useState("")
  const [search, setSearch] = useState("")
  const [type, setType] = useState<string>("")
  const [category, setCategory] = useState<string>("")
  const [status, setStatus] = useState<string>("")

  // Debounce search input
  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearch(searchInput)
    }, 350)
    return () => clearTimeout(timeout)
  }, [searchInput])

  // Fetch categories for filter dropdown
  const { data: categoriesData } = useGetStoryCategories()
  const categoriesList = categoriesData?.data ?? []

  const filterKey = `${search}-${type}-${category}-${status}`

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
  } = useListingPagination<Story>({
    mode: "infinite",
    initialTargetItems: 18,
    isGrid: true,
    gridColumns: { base: 1, md: 3, lg: 5, xl: 6 },
    filterKey,
    keyExtractor: (item) => item.id,
  })

  const setPage = setCurrentPage

  // Fetch stories with query params
  const { data, isLoading, isFetching, isError, refetch } = useGetStories({
    page: currentPage,
    limit: effectiveLimit,
    search: search || undefined,
    type: type || undefined,
    category: category || undefined,
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

  const { mutate: deleteStory, isPending: isDeleting } = useDeleteStory()

  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [selectedStory, setSelectedStory] = useState<Story | null>(null)

  const openDeleteModal = (s: Story) => {
    setSelectedStory(s)
    setDeleteModalOpen(true)
  }

  const confirmDelete = () => {
    if (!selectedStory?.id) return

    deleteStory(selectedStory.id, {
      onSuccess: () => {
        toast.success(`"${selectedStory.title || "Story"}" deleted successfully.`)
        refetch()
        setDeleteModalOpen(false)
        setSelectedStory(null)
      },
      onError: () => {
        toast.error("Failed to delete story. Please try again.")
      },
    })
  }

  const stories = displayItems
  const meta = data?.meta

  const hasFilters = Boolean(search || type || category || status)

  const formatStoryTypeLabel = (t?: string) => {
    if (!t) return "Story"
    if (t === "short_story" || t === "short-story") return "Short Story"
    if (t === "long_story" || t === "long-story") return "Long Story"
    if (t === "guidance" || t === "guide-story") return "Guidance"
    return t.replace(/[-_]/g, " ")
  }

  return (
    <div className="w-full space-y-6 pt-2">
      {/* Header with 30% title & 70% compact statistics */}
      <PageHeader
        icon={BookOpen}
        title="Stories Management"
        subtitle="Publish, filter, and curate editorial guides."
        stats={
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5 w-full">
            <CompactStatCard
              label="Total Stories"
              value={meta?.total ?? stories.length}
              subtext="Editorial guides"
              icon={BookOpen}
              iconColor="text-primary"
            />
            <CompactStatCard
              label="Live Published"
              value={`${stories.filter((s) => (s as any).status === "PUBLISHED").length} Active`}
              subtext="Public stories hub"
              icon={CheckCircle2}
              iconColor="text-emerald-500"
            />
            <CompactStatCard
              label="Editor's Picks"
              value={`${stories.filter((s) => (s as any).recommended).length} Curated`}
              subtext="Featured stories"
              icon={Sparkles}
              iconColor="text-purple-500"
            />
            <CompactStatCard
              label="Drafts / Review"
              value={`${stories.filter((s) => (s as any).status !== "PUBLISHED").length} Drafts`}
              subtext="Pending publishing"
              icon={Clock}
              iconColor="text-amber-500"
            />
          </div>
        }
      />

      {/* Filters Bar */}
      <FilterToolbar>
        <FilterGroup>
          {/* Search expands to take all remaining space on left */}
          <FilterSearch
            value={searchInput}
            onChange={(val) => {
              setSearchInput(val)
              setPage(1)
            }}
            placeholder="Search stories..."
            width="w-full flex-1 min-w-[200px]"
          />
        </FilterGroup>

        <FilterActions>
          {/* Story Type Filter */}
          <FilterSelect
            value={type}
            onChange={(val) => {
              setType(val)
              setPage(1)
            }}
            options={[
              { label: "Short Story", value: "short_story" },
              { label: "Long Story", value: "long_story" },
              { label: "Guidance", value: "guidance" },
            ]}
            allLabel="All Story Types"
            placeholder="Story Type"
            width="min-w-[125px] max-w-[150px]"
          />

          {/* Category Filter */}
          <FilterSelect
            value={category}
            onChange={(val) => {
              setCategory(val)
              setPage(1)
            }}
            options={categoriesList.map((cat) => ({
              label: cat.name,
              value: cat.name,
            }))}
            allLabel="All Categories"
            placeholder="Category"
            width="min-w-[125px] max-w-[155px]"
          />

          {/* Status Filter */}
          <FilterSelect
            value={status}
            onChange={(val) => {
              setStatus(val)
              setPage(1)
            }}
            options={[
              { label: "PUBLISHED", value: "PUBLISHED" },
              { label: "DRAFT", value: "DRAFT" },
            ]}
            allLabel="All Statuses"
            placeholder="Status"
            width="min-w-[105px] max-w-[125px]"
          />

          <FilterCreateButton
            to="/stories/new"
            label="Story"
            icon={Plus}
          />

          {/* Universal Far-Right Refresh Button */}
          <FilterResetButton
            onClick={() => {
              setSearchInput("")
              setType("")
              setCategory("")
              setStatus("")
              setPage(1)
              refetch()
            }}
            title="Refresh & Reset"
          />
        </FilterActions>
      </FilterToolbar>

      {/* Stories Grid via Universal DataPreview */}
      <DataPreview<Story>
        gridRef={gridRef}
        items={displayItems}
        isLoading={isLoading && currentPage === 1}
        isError={isError}
        errorMessage="Failed to load stories. Please try again later."
        onRetry={refetch}
        layout="grid"
        gridClassName="grid grid-cols-1 gap-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6"
        emptyIcon={BookOpen}
        emptyTitle={hasFilters ? "No matching stories found" : "No Stories Created Yet"}
        emptyDescription={
          hasFilters
            ? "Try adjusting your search criteria or clearing filters."
            : "Click below to create your first travel story."
        }
        emptyAction={
          <Link
            to="/stories/new"
            className="mt-4 inline-flex items-center gap-2 rounded-md bg-brand-primary px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-accent"
          >
            <Plus className="h-4 w-4" /> Add Story
          </Link>
        }
        renderItem={(s: any, index) => {
          const rawTitle = s.title
          const storyTitle = typeof rawTitle === "string" ? rawTitle : rawTitle?.value || "Untitled Story"
          const rawSlug = s.slug
          const slugStr = typeof rawSlug === "string" ? rawSlug : rawSlug?.value || ""
          const slugPath = slugStr ? `/stories/${slugStr}` : ""

          const detail = (s.detail || (s as any).hero || {}) as Record<string, any>
          const heroMultimedia =
            detail.heroMultimedia ||
            detail.backgroundMultimedia ||
            (s as any).hero?.backgroundMultimedia ||
            (s as any).backgroundMultimedia
          const heroBgImage = s.image || detail.image || (s as any).hero?.image
          const heroVideo = detail.video || (s as any).hero?.video

          const rawMeta = (s as any).seo || (s as any).metadata?.seo || detail.seo || {}
          const seoTitle = getSafeStringValue(rawMeta.title || rawMeta.metaTitle, "")
          const seoDesc = getSafeStringValue(rawMeta.description || rawMeta.metaDescription, "")

          const isSeoComplete = Boolean(seoTitle && seoDesc)
          const rawType = s.type || s.templateType
          const storyType = typeof rawType === "string" ? rawType : rawType?.value || ""

          const rawAuthor = (s as any).authorName || detail.author || (s as any).author
          const author = typeof rawAuthor === "string" ? rawAuthor : rawAuthor?.name || rawAuthor?.value || ""

          const rawReadTime = s.readTime || detail.readTime
          const readTime = typeof rawReadTime === "string" ? rawReadTime : rawReadTime?.value || "5 min read"

          const rawCategories = s.categories && s.categories.length > 0
            ? s.categories
            : s.category
              ? [s.category]
              : []

          const categories = Array.isArray(rawCategories) ? rawCategories : [rawCategories]

          return (
            <div
              key={`${s.id ?? "s"}-${slugStr || index}`}
              className="group relative flex min-h-[440px] flex-col overflow-hidden rounded-xl border border-border/70 bg-card shadow-sm transition-all duration-500 hover:-translate-y-1.5 hover:shadow-2xl hover:border-primary/40"
            >
              {/* Delete Button */}
              <button
                type="button"
                onClick={() => openDeleteModal(s)}
                className="absolute top-3.5 right-3.5 z-20 rounded-full bg-background/90 p-2 text-muted-foreground opacity-0 shadow-sm backdrop-blur transition-all group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive focus:opacity-100 cursor-pointer"
                title="Delete Story"
              >
                <Trash2 className="h-4 w-4" />
              </button>

              {/* HERO BANNER PREVIEW */}
              <div className="relative h-56 overflow-hidden bg-brand-primary">
                <UniversalMultimediaPreview
                  multimedia={heroMultimedia ?? undefined}
                  fallbackImageSrc={heroBgImage}
                  fallbackVideoSrc={heroVideo}
                  fallbackAlt={storyTitle}
                  mode="background"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  containerClassName="h-full w-full"
                  targetWidth={540}
                />

                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/10" />

                {/* Top Badges */}
                <div className="absolute top-3.5 left-3.5 z-10 flex flex-wrap gap-1.5 items-center">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider shadow-sm ${(s as any).status === "PUBLISHED"
                      ? "bg-brand-primary text-amber-100 border border-brand-primary"
                      : "bg-amber-100 text-amber-800"
                      }`}
                  >
                    {(s as any).status || "DRAFT"}
                  </span>

                  <span className="rounded-full bg-accent px-2.5 py-0.5 text-[10px] font-bold text-white shadow-sm tracking-wider uppercase">
                    {formatStoryTypeLabel(storyType)}
                  </span>

                  {((s as any).featured || detail.featured) && (
                    <span className="rounded-full bg-accent-muted px-2.5 py-0.5 text-[10px] font-bold text-brand-primary shadow-sm tracking-wider uppercase">
                      ★ Featured
                    </span>
                  )}
                </div>

                {/* Bottom Info Overlay */}
                <div className="absolute right-3.5 bottom-3.5 left-3.5 z-10 space-y-1">
                  <div className="flex items-center gap-3 text-[11px] font-semibold text-accent-muted uppercase tracking-widest truncate">
                    {author && (
                      <span className="flex items-center gap-1 truncate">
                        <User className="h-3 w-3" />
                        {author}
                      </span>
                    )}
                    <span className="flex items-center gap-1 shrink-0">
                      <Clock className="h-3 w-3" />
                      {readTime}
                    </span>
                  </div>

                  <h3 className="text-xl font-serif font-bold text-white leading-snug drop-shadow-sm truncate">
                    {storyTitle}
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
                {/* Categories & Tags */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-accent uppercase tracking-wider">
                    <span className="flex items-center gap-1">
                      <Tag className="h-3.5 w-3.5 text-accent" />
                      Categories
                    </span>
                    <span className="text-[10px] text-foreground font-mono bg-muted/40 border border-border/60 px-2 py-0.5 rounded-sm">
                      {categories.length} TAGS
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {categories.length > 0 ? (
                      categories.slice(0, 3).map((cat: any, i: number) => {
                        const catName = typeof cat === "string" ? cat : cat?.name || cat?.slug || String(cat)
                        return (
                          <span
                            key={`${catName}-${i}`}
                            className="rounded-full bg-muted/40 border border-border/60 px-2.5 py-0.5 text-[10px] font-medium text-foreground tracking-wider uppercase"
                          >
                            {catName}
                          </span>
                        )
                      })
                    ) : (
                      <span className="text-[11px] text-muted-foreground italic">
                        Uncategorized
                      </span>
                    )}
                  </div>
                </div>

                {/* SEO STATUS */}
                <div className="rounded-md border border-border/60 bg-muted/20 p-3 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-foreground flex items-center gap-1">
                      <Globe className="h-3.5 w-3.5 text-accent" />
                      SEO Governance
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-medium tracking-wide ${isSeoComplete
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
                  to={s.slug ? `/stories/${s.slug}` : `/stories`}
                  className="inline-flex items-center justify-between rounded-md bg-brand-primary px-4 py-2.5 text-xs font-semibold text-white tracking-wide transition-all hover:bg-accent shadow-sm cursor-pointer"
                >
                  <span>Edit Story</span>
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
            <DialogTitle className="font-serif text-xl text-brand-primary">Delete Story?</DialogTitle>
            <DialogDescription className="text-subtitle">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-brand-primary">
                "{selectedStory?.title}"
              </span>
              ? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteModalOpen(false)}
              disabled={isDeleting}
              className="rounded-md border-border hover:bg-muted"
            >
              Cancel
            </Button>

            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={isDeleting}
              className="gap-1.5 rounded-md bg-red-600 hover:bg-red-700"
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
