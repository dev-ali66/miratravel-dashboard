import { useState, useRef, useEffect } from "react"
import { Search, X, BookOpen, Check, Loader2 } from "lucide-react"
import { useGetStories } from "@/hooks/story/useGetStories"
import { getOptimizedImageUrl, DASHBOARD_IMAGE_WIDTHS } from "@/lib/optimizedImage"

export interface StorySearchPickerProps {
  label?: string
  placeholder?: string
  onSelectStory: (story: any) => void
  stories?: any[]
  className?: string
  selectedTitle?: string
}

export function StorySearchPicker({
  label = "Search & Auto-fill from Published Stories",
  placeholder = "Search stories by title or slug...",
  onSelectStory,
  stories: providedStories,
  className = "",
  selectedTitle = "",
}: StorySearchPickerProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [justSelected, setJustSelected] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Fetch stories if not provided via props
  const { data: storiesResponse, isLoading } = useGetStories()
  const stories = providedStories ?? storiesResponse?.data ?? []

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Filter stories based on query
  const filteredStories = stories.filter((s: any) => {
    if (!searchQuery.trim()) return true
    const q = searchQuery.toLowerCase().trim()
    const titleMatch = (s.title || "").toLowerCase().includes(q)
    const slugMatch = (s.slug || "").toLowerCase().includes(q)
    const typeMatch = (s.type || "").toLowerCase().includes(q)
    return titleMatch || slugMatch || typeMatch
  })

  const handleSelect = (story: any) => {
    onSelectStory(story)
    setSearchQuery("")
    setJustSelected(story.title || "Selected")
    setIsOpen(false)
    setTimeout(() => {
      setJustSelected(null)
    }, 3000)
  }

  return (
    <div ref={containerRef} className={`relative flex flex-col gap-1.5 ${className}`}>
      {label && (
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-medium text-muted-foreground flex items-center gap-1.5">
            <BookOpen className="h-3 w-3 text-primary" />
            {label}
          </label>
          {justSelected ? (
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
              <Check className="h-3 w-3" /> Auto-filled!
            </span>
          ) : selectedTitle ? (
            <span className="text-[10px] text-muted-foreground truncate max-w-[180px]">
              Active: <span className="text-foreground font-medium">{selectedTitle}</span>
            </span>
          ) : null}
        </div>
      )}

      {/* Search Input Box */}
      <div className="relative flex items-center">
        <Search className="absolute left-2.5 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value)
            setIsOpen(true)
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="h-8 w-full rounded-md border border-input bg-background pl-8 pr-7 text-xs text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
        />
        {searchQuery ? (
          <button
            type="button"
            onClick={() => setSearchQuery("")}
            className="absolute right-2 p-0.5 text-muted-foreground hover:text-foreground cursor-pointer rounded"
            title="Clear search"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        ) : null}
      </div>

      {/* Floating Search Results Dropdown */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-60 overflow-y-auto rounded-md border border-border bg-popover p-1 shadow-lg">
          {isLoading ? (
            <div className="flex items-center justify-center p-3 text-xs text-muted-foreground gap-2">
              <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
              Loading published stories...
            </div>
          ) : filteredStories.length === 0 ? (
            <div className="p-3 text-center text-xs text-muted-foreground">
              {searchQuery ? `No stories matching "${searchQuery}"` : "No published stories available."}
            </div>
          ) : (
            <div className="flex flex-col gap-0.5">
              {filteredStories.map((story: any) => {
                const coverImg =
                  story.hero?.backgroundMultimedia?.image?.url ||
                  story.hero?.image?.url ||
                  story.hero?.backgroundMultimedia?.url ||
                  story.coverImage ||
                  ""

                return (
                  <div
                    key={story.id}
                    onClick={() => handleSelect(story)}
                    className="flex items-center justify-between gap-2.5 rounded-sm p-2 text-xs transition-colors hover:bg-muted/70 cursor-pointer group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      {coverImg ? (
                        <img
                          src={getOptimizedImageUrl(coverImg, { width: DASHBOARD_IMAGE_WIDTHS.STORY_PICKER_THUMBNAIL, quality: 100 })}
                          alt={story.title}
                          className="h-7 w-9 rounded object-cover border border-border/60 shrink-0"
                        />
                      ) : (
                        <div className="h-7 w-9 rounded bg-muted flex items-center justify-center text-[9px] text-muted-foreground font-mono shrink-0">
                          <BookOpen className="h-3.5 w-3.5 text-muted-foreground/60" />
                        </div>
                      )}

                      <div className="flex flex-col min-w-0">
                        <span className="truncate font-medium text-foreground group-hover:text-primary transition-colors">
                          {story.title || "Untitled Story"}
                        </span>
                        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                          <span className="font-mono truncate">/{story.slug || story.id}</span>
                          {story.type && (
                            <span className="rounded bg-primary/10 px-1 py-0.2 text-[8px] font-semibold uppercase text-primary shrink-0">
                              {story.type.replace(/_/g, " ")}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <span className="text-[10px] font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                      Auto-fill
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default StorySearchPicker
