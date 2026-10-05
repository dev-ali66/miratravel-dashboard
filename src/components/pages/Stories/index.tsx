import MiraLoader from "@/components/shared/MiraLoader"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import {
  Trash2,
  BookOpen,
  Loader2,
  Plus,
  Search,
  ChevronLeft,
  ChevronRight,
  Globe,
  Tag,
  Clock,
  User,
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

const PAGE_SIZE = 12

export default function StoriesPage() {
  const [page, setPage] = useState(1)
  const [searchInput, setSearchInput] = useState("")
  const [search, setSearch] = useState("")
  const [type, setType] = useState<string>("")
  const [category, setCategory] = useState<string>("")
  const [status, setStatus] = useState<string>("")

  // Debounce search input
  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearch(searchInput)
      setPage(1)
    }, 350)
    return () => clearTimeout(timeout)
  }, [searchInput])

  // Fetch categories for filter dropdown
  const { data: categoriesData } = useGetStoryCategories()
  const categoriesList = categoriesData?.data ?? []

  // Fetch stories with query params
  const { data, isLoading, isError, refetch } = useGetStories({
    page,
    limit: PAGE_SIZE,
    search: search || undefined,
    type: type || undefined,
    category: category || undefined,
    status: status || undefined,
  })

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

  const stories = data?.data ?? []
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
    <div className="w-full animate-in pt-2 duration-700 fade-in slide-in-from-bottom-4">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold tracking-tight text-[#182d09] flex items-center gap-2.5">
            <BookOpen className="h-8 w-8 text-[#af6348]" />
            Stories Management
          </h1>

          <p className="mt-1 text-sm text-[#565e69]">
            Create, publish, filter, and manage your travel stories and editorial guides.
          </p>
        </div>

        <Link
          to="/stories/new"
          className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-[#182d09] px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-[#af6348]"
        >
          <Plus className="h-4 w-4" />
          Create Story
        </Link>
      </div>

      {/* Filters Bar */}
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[#8A8070]" />
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search stories by title, slug or author..."
            className="w-full rounded-xl border border-[#D8CBB8] bg-[#FFF8F2] py-2.5 pr-3 pl-9 text-sm text-[#182d09] placeholder:text-[#8A8070] outline-none focus:border-[#af6348] focus:ring-1 focus:ring-[#af6348]"
          />
        </div>

        {/* Story Type Filter */}
        <select
          value={type}
          onChange={(e) => {
            setType(e.target.value)
            setPage(1)
          }}
          className="rounded-xl border border-[#D8CBB8] bg-[#FFF8F2] px-3 py-2.5 text-sm text-[#182d09] outline-none focus:border-[#af6348] md:w-44"
        >
          <option value="">All Story Types</option>
          <option value="short_story">Short Story</option>
          <option value="long_story">Long Story</option>
          <option value="guidance">Guidance</option>
        </select>

        {/* Category Filter */}
        <select
          value={category}
          onChange={(e) => {
            setCategory(e.target.value)
            setPage(1)
          }}
          className="rounded-xl border border-[#D8CBB8] bg-[#FFF8F2] px-3 py-2.5 text-sm text-[#182d09] outline-none focus:border-[#af6348] md:w-44"
        >
          <option value="">All Categories</option>
          {categoriesList.map((cat) => (
            <option key={cat.id} value={cat.name}>
              {cat.name}
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
          className="rounded-xl border border-[#D8CBB8] bg-[#FFF8F2] px-3 py-2.5 text-sm text-[#182d09] outline-none focus:border-[#af6348] md:w-36"
        >
          <option value="">All Statuses</option>
          <option value="PUBLISHED">PUBLISHED</option>
          <option value="DRAFT">DRAFT</option>
        </select>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <MiraLoader text="Loading travel stories..." className="py-12 min-h-[300px]" />
      ) : isError ? (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-center">
          <p className="text-sm font-medium text-destructive">
            Failed to load stories.
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Please try again later.
          </p>
        </div>
      ) : stories.length > 0 ? (
        <>
          {/* Stories Grid */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {stories.map((s: any, index) => {
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
                  className="group relative flex min-h-[440px] flex-col overflow-hidden rounded-2xl border border-[#D8CBB8]/80 bg-white shadow-sm transition-all duration-500 hover:-translate-y-1.5 hover:shadow-2xl hover:border-[#af6348]/60"
                >
                  {/* Delete Button */}
                  <button
                    type="button"
                    onClick={() => openDeleteModal(s)}
                    className="absolute top-3.5 right-3.5 z-20 rounded-full bg-white/90 p-2 text-[#565e69] opacity-0 shadow-md backdrop-blur transition-all group-hover:opacity-100 hover:bg-red-50 hover:text-red-600 focus:opacity-100 cursor-pointer"
                    title="Delete Story"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>

                  {/* HERO BANNER PREVIEW */}
                  <div className="relative h-56 overflow-hidden bg-[#182d09]">
                    <UniversalMultimediaPreview
                      multimedia={heroMultimedia ?? undefined}
                      fallbackImageSrc={heroBgImage}
                      fallbackVideoSrc={heroVideo}
                      fallbackAlt={storyTitle}
                      mode="background"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      containerClassName="h-full w-full"
                    />

                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/10" />

                    {/* Top Badges */}
                    <div className="absolute top-3.5 left-3.5 z-10 flex flex-wrap gap-1.5 items-center">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider shadow-sm ${
                          (s as any).status === "PUBLISHED"
                            ? "bg-[#182d09] text-[#FEF3C7] border border-[#182d09]"
                            : "bg-[#FEF3C7] text-[#9A3412]"
                        }`}
                      >
                        {(s as any).status || "DRAFT"}
                      </span>

                      <span className="rounded-full bg-[#af6348] px-2.5 py-0.5 text-[10px] font-bold text-white shadow-sm tracking-wider uppercase">
                        {formatStoryTypeLabel(storyType)}
                      </span>

                      {((s as any).featured || detail.featured) && (
                        <span className="rounded-full bg-[#E5A84B] px-2.5 py-0.5 text-[10px] font-bold text-[#182d09] shadow-sm tracking-wider uppercase">
                          ★ Featured
                        </span>
                      )}
                    </div>

                    {/* Bottom Info Overlay */}
                    <div className="absolute right-3.5 bottom-3.5 left-3.5 z-10 space-y-1">
                      <div className="flex items-center gap-3 text-[11px] font-semibold text-[#E5A84B] uppercase tracking-widest truncate">
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
                      <div className="flex items-center justify-between text-[11px] font-semibold text-[#af6348] uppercase tracking-wider">
                        <span className="flex items-center gap-1">
                          <Tag className="h-3.5 w-3.5 text-[#af6348]" />
                          Categories
                        </span>
                        <span className="text-[10px] text-[#182d09] font-mono bg-[#FFF8F2] border border-[#D8CBB8] px-2 py-0.5 rounded-md">
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
                                className="rounded-full bg-[#FFF8F2] border border-[#D8CBB8] px-2.5 py-0.5 text-[10px] font-medium text-[#182d09] tracking-wider uppercase"
                              >
                                {catName}
                              </span>
                            )
                          })
                        ) : (
                          <span className="text-[11px] text-[#8A8070] italic">
                            Uncategorized
                          </span>
                        )}
                      </div>
                    </div>

                    {/* SEO STATUS */}
                    <div className="rounded-xl border border-[#D8CBB8]/60 bg-[#FFF8F2]/60 p-3 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-[#182d09] flex items-center gap-1">
                          <Globe className="h-3.5 w-3.5 text-[#af6348]" />
                          SEO Governance
                        </span>
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-medium tracking-wide ${
                            isSeoComplete
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-[#FEF3C7] text-[#9A3412]"
                          }`}
                        >
                          {isSeoComplete ? "Ready" : "Partial"}
                        </span>
                      </div>

                      <p className="text-[11px] font-medium text-[#565e69] truncate" title={seoTitle}>
                        {seoTitle || "No Meta Title"}
                      </p>
                    </div>

                    {/* EDIT LINK */}
                    <Link
                      to={s.slug ? `/stories/${s.slug}` : `/stories`}
                      className="inline-flex items-center justify-between rounded-xl bg-[#182d09] px-4 py-2.5 text-xs font-semibold text-white tracking-wide transition-all hover:bg-[#af6348] shadow-sm cursor-pointer"
                    >
                      <span>Edit Story</span>
                      <span>→</span>
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Pagination Controls */}
          {meta && meta.totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="flex items-center gap-1 rounded-xl border border-[#D8CBB8] bg-white px-3.5 py-2 text-sm text-[#182d09] hover:bg-[#FFF8F2] disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" /> Prev
              </button>

              <span className="text-sm font-medium text-[#565e69]">
                Page {meta.page} of {meta.totalPages}
              </span>

              <button
                type="button"
                onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
                disabled={page >= meta.totalPages}
                className="flex items-center gap-1 rounded-xl border border-[#D8CBB8] bg-white px-3.5 py-2 text-sm text-[#182d09] hover:bg-[#FFF8F2] disabled:opacity-40"
              >
                Next <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#D8CBB8] bg-[#FFF8F2]/50 py-24 text-center">
          <div className="mb-4 rounded-full bg-[#af6348]/10 p-4">
            <BookOpen className="h-8 w-8 text-[#af6348]" />
          </div>

          <h3 className="mb-2 text-xl font-serif font-bold text-[#182d09]">
            {hasFilters ? "No matching stories found" : "No Stories Created Yet"}
          </h3>

          <p className="max-w-sm text-sm text-[#565e69]">
            {hasFilters
              ? "Try adjusting your search criteria or clearing filters."
              : "Click below to create your first travel story."}
          </p>

          <Link
            to="/stories/new"
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#182d09] px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-[#af6348]"
          >
            <Plus className="h-4 w-4" /> Add Story
          </Link>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-serif text-xl text-[#182d09]">Delete Story?</DialogTitle>
            <DialogDescription className="text-[#565e69]">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-[#182d09]">
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
              className="rounded-xl border-[#D8CBB8]"
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
