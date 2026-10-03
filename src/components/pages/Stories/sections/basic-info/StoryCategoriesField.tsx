import { useState, useEffect, useRef } from "react"
import { apiPrivate } from "@/lib/api-client"
import { toast } from "sonner"
import { Search, Plus, Trash2, X, Loader2, Tag } from "lucide-react"

export interface StoryCategoryItem {
  id: string
  name: string
  slug?: string
}

export interface StoryCategoriesFieldProps {
  value?: string[]
  onChange: (categories: string[]) => void
}

export function StoryCategoriesField({
  value = [],
  onChange,
}: StoryCategoriesFieldProps) {
  const selectedCategories = Array.isArray(value) ? value : []

  const [categories, setCategories] = useState<StoryCategoryItem[]>([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const containerRef = useRef<HTMLDivElement>(null)

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Fetch categories from backend API GET /story-categories
  const fetchCategories = async () => {
    try {
      setLoading(true)
      const res = await apiPrivate.get("/story-categories")
      const list = res.data?.data || res.data || []
      if (Array.isArray(list)) {
        setCategories(
          list.map((c: any) =>
            typeof c === "string"
              ? { id: c, name: c }
              : { id: c.id || c.name, name: c.name, slug: c.slug }
          )
        )
      }
    } catch (err) {
      console.error("Failed to fetch story categories:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  // Only show categories that are NOT already selected
  const availableCategories = categories.filter(
    (c) =>
      !selectedCategories.includes(c.name) &&
      c.name.toLowerCase().includes(search.trim().toLowerCase())
  )

  // Check if search matches an existing category name in DB (selected or unselected)
  const hasExactMatch = categories.some(
    (c) => c.name.toLowerCase() === search.trim().toLowerCase()
  )

  // Select category & clear search term
  const handleSelectCategory = (categoryName: string) => {
    if (!selectedCategories.includes(categoryName)) {
      onChange([...selectedCategories, categoryName])
    }
    setSearch("")
    setIsOpen(false)
  }

  // Remove selected category badge
  const handleRemoveCategory = (categoryName: string) => {
    onChange(selectedCategories.filter((c) => c !== categoryName))
  }

  // Create a new category via POST /story-categories
  const handleCreateCategory = async () => {
    const nameToCreate = search.trim()
    if (!nameToCreate || isCreating) return

    try {
      setIsCreating(true)
      const res = await apiPrivate.post("/story-categories", {
        name: nameToCreate,
      })
      const created = res.data?.data || { id: nameToCreate, name: nameToCreate }

      const newCategoryObj: StoryCategoryItem = {
        id: created.id || nameToCreate,
        name: created.name || nameToCreate,
        slug: created.slug,
      }

      setCategories((prev) => {
        if (prev.some((c) => c.name.toLowerCase() === newCategoryObj.name.toLowerCase())) {
          return prev
        }
        return [...prev, newCategoryObj]
      })

      // Auto select newly created category & reset search input
      if (!selectedCategories.includes(newCategoryObj.name)) {
        onChange([...selectedCategories, newCategoryObj.name])
      }

      toast.success(`Category "${newCategoryObj.name}" created!`)
      setSearch("")
      setIsOpen(false)
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to create category")
    } finally {
      setIsCreating(false)
    }
  }

  // Delete category via DELETE /story-categories/:id
  const handleDeleteCategory = async (cat: StoryCategoryItem, e: React.MouseEvent) => {
    e.stopPropagation()
    if (deletingId) return

    try {
      setDeletingId(cat.id)
      await apiPrivate.delete(`/story-categories/${cat.id}`)
      setCategories((prev) => prev.filter((c) => c.id !== cat.id))

      // Unselect if selected
      if (selectedCategories.includes(cat.name)) {
        onChange(selectedCategories.filter((c) => c !== cat.name))
      }

      toast.success(`Category "${cat.name}" deleted`)
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to delete category")
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border/60 bg-muted/10 p-3.5 shadow-2xs">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
          <Tag className="h-3.5 w-3.5 text-primary" />
          <span>Story Categories</span>
        </div>
        {selectedCategories.length > 0 && (
          <span className="text-[11px] font-medium text-muted-foreground">
            {selectedCategories.length} selected
          </span>
        )}
      </div>

      {/* Selected Categories Badges */}
      {selectedCategories.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pb-1">
          {selectedCategories.map((catName) => (
            <span
              key={catName}
              className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary transition"
            >
              {catName}
              <button
                type="button"
                onClick={() => handleRemoveCategory(catName)}
                className="rounded-full p-0.5 hover:bg-primary/20 cursor-pointer text-primary"
                title="Remove category"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Search Input & Floating Dropdown Popover */}
      <div ref={containerRef} className="relative">
        <div className="relative flex items-center">
          <Search className="absolute left-2.5 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            value={search}
            onFocus={() => setIsOpen(true)}
            onChange={(e) => {
              setSearch(e.target.value)
              setIsOpen(true)
            }}
            placeholder="Search or add category..."
            className="h-8 w-full rounded-md border border-border bg-background pl-8 pr-8 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute right-2.5 text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Dropdown Popover Container */}
        {isOpen && (
          <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-56 overflow-y-auto rounded-md border border-border bg-popover p-1.5 shadow-lg text-popover-foreground flex flex-col gap-1">
            {/* Create New Category Button */}
            {search.trim().length > 0 && !hasExactMatch && (
              <button
                type="button"
                onClick={handleCreateCategory}
                disabled={isCreating}
                className="flex items-center justify-between rounded-md border border-dashed border-primary/50 bg-primary/5 hover:bg-primary/10 px-2.5 py-1.5 text-xs font-medium text-primary transition cursor-pointer disabled:opacity-50"
              >
                <span className="flex items-center gap-1.5 truncate">
                  <Plus className="h-3.5 w-3.5 shrink-0" />
                  <span>Create category <strong>"{search.trim()}"</strong></span>
                </span>
                {isCreating && <Loader2 className="h-3.5 w-3.5 animate-spin shrink-0" />}
              </button>
            )}

            {/* Available Categories List */}
            {loading ? (
              <div className="flex items-center justify-center py-4 text-xs text-muted-foreground gap-2">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Loading categories...
              </div>
            ) : availableCategories.length === 0 ? (
              <p className="py-2 text-center text-xs text-muted-foreground">
                {search
                  ? "No matching unselected categories found."
                  : selectedCategories.length > 0 && categories.length === selectedCategories.length
                  ? "All categories selected."
                  : "No categories available."}
              </p>
            ) : (
              availableCategories.map((cat) => {
                const isDeleting = deletingId === cat.id

                return (
                  <div
                    key={cat.id}
                    onClick={() => handleSelectCategory(cat.name)}
                    className="flex items-center justify-between rounded-md px-2.5 py-1.5 text-xs transition cursor-pointer select-none hover:bg-accent hover:text-accent-foreground text-foreground"
                  >
                    <div className="flex items-center gap-2 min-w-0 flex-1 mr-2">
                      <Plus className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                      <span className="truncate">{cat.name}</span>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => handleDeleteCategory(cat, e)}
                      disabled={isDeleting}
                      className="p-1 text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded cursor-pointer transition shrink-0"
                      title="Delete Category from Database"
                    >
                      {isDeleting ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
                )
              })
            )}
          </div>
        )}
      </div>
    </div>
  )
}
