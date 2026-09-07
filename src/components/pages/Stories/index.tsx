import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Search, Trash2, Clock, Loader2, BookOpen } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useGetStories } from "@/hooks/story/useGetStories";
import { useDeleteStory } from "@/hooks/story/useStoryMutations";
import { useGetStoryCategories } from "@/hooks/story/useStoryCategories";
import type { Story } from "./storyTypes";

export default function StoriesPage() {
  const [searchInput, setSearchInput] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("");

  const { data: categoriesData } = useGetStoryCategories();
  const availableCategories = categoriesData?.data || [];

  const { data, isLoading, isError, refetch } = useGetStories({
    category: categoryFilter || undefined,
  });

  const { mutate: deleteStory, isPending: isDeleting } = useDeleteStory();

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);

  const openDeleteModal = (story: Story) => {
    setSelectedStory(story);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (!selectedStory?.id) return;

    deleteStory(selectedStory.id, {
      onSuccess: () => {
        toast.success(`"${selectedStory.title}" deleted.`);
        refetch();
        setDeleteModalOpen(false);
        setSelectedStory(null);
      },
      onError: () => {
        toast.error("Failed to delete story.");
      },
    });
  };

  const stories = (data?.data ?? []).filter((s) =>
    searchInput
      ? s.title.toLowerCase().includes(searchInput.toLowerCase()) ||
      s.slug.toLowerCase().includes(searchInput.toLowerCase()) ||
      s.description.toLowerCase().includes(searchInput.toLowerCase())
      : true
  );

  return (
    <div className="w-full animate-in pt-2 duration-700 fade-in slide-in-from-bottom-4">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Stories
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage travel stories, cultural insights, and editorial guides.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            to="/stories/new"
            className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition hover:opacity-90"
          >
            <Plus className="h-4 w-4" />
            Create Story
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search stories..."
            className="w-full rounded-lg border border-border/60 bg-background py-2.5 pr-3 pl-9 text-sm outline-none focus:border-primary"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="rounded-lg border border-border/60 bg-background px-3 py-2.5 text-sm outline-none focus:border-primary md:w-52"
        >
          <option value="">All Categories</option>
          {availableCategories.map((cat) => (
            <option key={cat.id} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex justify-center py-10">
          <div className="size-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      ) : isError ? (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-center">
          <p className="text-sm font-medium text-destructive">
            Failed to load stories.
          </p>
        </div>
      ) : stories.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {stories.map((story) => {
            const storyCategories =
              story.categories && story.categories.length > 0
                ? story.categories
                : story.category
                  ? [story.category]
                  : []

            return (
              <div
                key={story.id}
                className="group relative flex min-h-[340px] flex-col overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <button
                  type="button"
                  onClick={() => openDeleteModal(story)}
                  className="absolute top-4 right-4 z-20 rounded-full bg-background/90 p-2 text-muted-foreground opacity-0 shadow-sm backdrop-blur transition-all group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive focus:opacity-100"
                >
                  <Trash2 className="h-4 w-4" />
                </button>

                <div className="relative h-48 overflow-hidden bg-muted">
                  {story.image ? (
                    <img
                      src={story.image}
                      alt={story.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-muted/80">
                      <BookOpen className="h-10 w-10 text-muted-foreground/30" />
                    </div>
                  )}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute top-4 left-4 z-10 flex flex-wrap gap-1">
                    {storyCategories.slice(0, 2).map((cat) => (
                      <span
                        key={cat}
                        className="rounded-full bg-background/90 px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-foreground uppercase shadow-sm backdrop-blur"
                      >
                        {cat}
                      </span>
                    ))}
                    {storyCategories.length > 2 && (
                      <span className="rounded-full bg-background/90 px-2 py-0.5 text-[10px] font-bold text-foreground">
                        +{storyCategories.length - 2}
                      </span>
                    )}
                  </div>
                  <div className="absolute right-4 bottom-4 left-4 z-10">
                    <h3 className="text-xl font-bold text-white line-clamp-1">
                      {story.title}
                    </h3>
                    <div className="mt-1 flex items-center gap-1 text-xs font-medium text-white/90">
                      <Clock className="h-3.5 w-3.5 text-[#af6348]" />
                      {story.readTime || "5 min read"}
                    </div>
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <p className="line-clamp-2 text-[13px] leading-relaxed text-muted-foreground">
                    {story.description}
                  </p>

                  {/* Three-Tag Taxonomy Chips */}
                  {(story.detail?.tagPlace || story.detail?.tagTheme || story.detail?.tagLens) && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {story.detail?.tagPlace && (
                        <span className="rounded-md bg-muted px-2 py-0.5 text-[10px] font-medium text-foreground">
                          📍 {story.detail.tagPlace}
                        </span>
                      )}
                      {story.detail?.tagTheme && (
                        <span className="rounded-md bg-muted px-2 py-0.5 text-[10px] font-medium text-primary">
                          🧭 {story.detail.tagTheme}
                        </span>
                      )}
                      {story.detail?.tagLens && (
                        <span className="rounded-md bg-muted px-2 py-0.5 text-[10px] font-medium text-amber-600 dark:text-amber-400">
                          ✨ {story.detail.tagLens}
                        </span>
                      )}
                    </div>
                  )}

                  <div className="mt-auto pt-4">
                    <Link
                      to={`/stories/${story.id}/${story.slug}`}
                      className="inline-flex w-full items-center justify-between rounded-lg bg-primary/10 px-4 py-2.5 text-sm font-semibold text-primary transition-all hover:bg-primary hover:text-primary-foreground"
                    >
                      <span>Edit Story</span>
                      <span className="transition-transform group-hover:translate-x-1">
                        →
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/60 bg-card/50 py-24 text-center">
          <div className="mb-4 rounded-full bg-primary/10 p-4">
            <BookOpen className="h-8 w-8 text-primary" />
          </div>
          <h3 className="mb-2 text-xl font-semibold">No Stories Found</h3>
          <p className="max-w-sm text-muted-foreground">
            Create your first story to start building the editorial section.
          </p>
        </div>
      )}

      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete story?</DialogTitle>
            <DialogDescription>
              This will permanently delete "{selectedStory?.title}". This action cannot be undone.
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
  );
}
