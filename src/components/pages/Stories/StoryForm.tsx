import MiraLoader from "@/components/shared/MiraLoader"
import { useEffect, useState, useMemo } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { toast } from "sonner"
import {
  Save,
  Loader2,
  Trash2,
  BookOpen,
  Heading,
  AlignLeft,
  Quote,
  Check,
  Search,
  Plus,
  X,
  Tag,
  ImageIcon,
  LayoutGrid,
  Columns,
  ClipboardList,
  Terminal,
} from "lucide-react"

import { useGetStoryById } from "@/hooks/story/useGetStories"
import { useCreateStory, useUpdateStory } from "@/hooks/story/useStoryMutations"
import { useStoryJourneys } from "@/hooks/story/useStoryJourneys"
import {
  useGetStoryCategories,
  useCreateStoryCategory,
  useDeleteStoryCategory,
} from "@/hooks/story/useStoryCategories"
import {
  useGetStoryTypes,
  useCreateStoryType,
  useDeleteStoryType,
} from "@/hooks/story/useStoryTypes"
import { StoryLocationSearchCombobox, type SelectedStoryLocation } from "./StoryLocationSearchCombobox"
import { StoryPreview } from "./StoryPreview"
import { UniversalEditorLayout } from "@/components/layout/UniversalEditorLayout"
import { normalizeStoryPayload } from "./shared/normalizeStoryPayload"

// CMS Shared Form Controls
import { DynamicStyledField, FormSection } from "@/components/pages/CMS/shared/FormControls"
import { UniversalMultimediaForm } from "@/components/pages/CMS/shared/UniversalMultimediaForm"
import { ButtonsField } from "@/components/pages/CMS/shared/ButtonsField"
import type { CmsButton, ArticleBlock } from "./storyTypes"

// Preview Default Palette
const DEFAULT_PREVIEW_STYLES = {
  heroColor: "#0F2A2E",
  terracotta: "#af6348",
  heroImage: "https://images.unsplash.com/photo-1548625361-18da857bbf08?auto=format&fit=crop&w=1400&q=80",
  titleStyle: { textColor: "#FFFFFF" },
  descriptionStyle: { textColor: "#FBF9F5" },
  authorStyle: { textColor: "#FFFFFF" },
  authorTitleStyle: { textColor: "rgba(255, 255, 255, 0.75)" },
  readTimeStyle: { textColor: "#FDE68A" },
  defaultButton: {
    label: "Start Your Journey",
    url: "#",
    style: "primary",
    backgroundColor: "#af6348",
    textColor: "#FFFFFF",
  } as CmsButton,
}

// Helper to normalize input values into clean strings
const getStrVal = (v: any): string => {
  if (v === null || v === undefined) return ""
  if (typeof v === "object" && "value" in v) return (v as any).value ?? ""
  if (typeof v === "string") return v
  return String(v)
}

export function StoryForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditing = !!id && id !== "new"

  // Accordion open section state
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    "sec-identity": true,
  })

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  const { data: storyData, isLoading: isLoadingStory } = useGetStoryById(
    isEditing ? id : undefined
  )
  const { mutate: createStory, isPending: isCreating } = useCreateStory()
  const { mutate: updateStory, isPending: isUpdating } = useUpdateStory()

  const { data: journeysData } = useStoryJourneys(1, 100)

  // Category Hooks
  const [categorySearch, setCategorySearch] = useState("")
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false)
  const { data: categoriesData } = useGetStoryCategories(categorySearch)
  const { mutate: createCategory, isPending: isCreatingCategory } = useCreateStoryCategory()
  const { mutate: deleteCategory, isPending: isDeletingCategory } = useDeleteStoryCategory()

  // Story Type Hooks
  const [typeSearch, setTypeSearch] = useState("")
  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false)
  const { data: storyTypesData } = useGetStoryTypes(typeSearch)
  const { mutate: createStoryType, isPending: isCreatingType } = useCreateStoryType()
  const { mutate: deleteStoryType, isPending: isDeletingType } = useDeleteStoryType()

  const availableCategories = useMemo(
    () => categoriesData?.data || [],
    [categoriesData]
  )

  const availableStoryTypes = useMemo(
    () => storyTypesData?.data || [],
    [storyTypesData]
  )

  const [journeySearch, setJourneySearch] = useState("")

  const availableJourneys = useMemo(() => journeysData?.data || [], [journeysData])

  const filteredJourneys = useMemo(() => {
    if (!journeySearch.trim()) return availableJourneys
    const query = journeySearch.toLowerCase().trim()
    return availableJourneys.filter(
      (j: any) =>
        (j.title || "").toLowerCase().includes(query) ||
        (j.slug || "").toLowerCase().includes(query) ||
        (j.destination || "").toLowerCase().includes(query)
    )
  }, [availableJourneys, journeySearch])

  const [formData, setFormData] = useState({
    title: "",
    titleStyle: DEFAULT_PREVIEW_STYLES.titleStyle as Record<string, any> | undefined,
    slug: "",
    category: "Culture & Heritage",
    categories: ["Culture & Heritage"] as string[],
    description: "",
    descriptionStyle: DEFAULT_PREVIEW_STYLES.descriptionStyle as Record<string, any> | undefined,
    readTime: "5 min read",
    readTimeStyle: DEFAULT_PREVIEW_STYLES.readTimeStyle as Record<string, any> | undefined,
    templateType: "long-story",
    image: DEFAULT_PREVIEW_STYLES.heroImage,
    heroMultimedia: {
      type: "image" as const,
      color: DEFAULT_PREVIEW_STYLES.heroColor,
      url: DEFAULT_PREVIEW_STYLES.heroImage,
      alt: "Stories from the Balkans",
      opacity: 100,
      overlayColor: "#000000",
      overlayOpacity: 0,
    } as Record<string, any>,
    buttons: [DEFAULT_PREVIEW_STYLES.defaultButton] as CmsButton[],
    tagPlace: "",
    tagTheme: "Culture",
    tagLens: "Tradition",
    destinationPlace: "",
    author: "MIRA Editorial",
    authorStyle: DEFAULT_PREVIEW_STYLES.authorStyle as Record<string, any> | undefined,
    authorTitle: "Curator & Travel Writer",
    authorTitleStyle: DEFAULT_PREVIEW_STYLES.authorTitleStyle as Record<string, any> | undefined,
    journeyIds: [] as string[],
    manualRelatedStoryIds: [] as string[],
    blocks: [
      {
        id: "b1",
        type: "paragraph" as const,
        text: "There is something about the Balkans that resists quick travel. The region does not announce itself through mega-cities or crammed expressways. Instead, it unfolds slowly—through silent mountain passes, weathered stone villages, and conversations that linger over strong coffee.",
        textStyle: undefined,
      },
      {
        id: "b2",
        type: "image" as const,
        url: "https://images.unsplash.com/photo-1623536167776-922ccb1ff749?auto=format&fit=crop&w=1200&q=85",
        caption: "Panoramic view of authentic stone architecture in Mostar",
        multimedia: {
          type: "image",
          url: "https://images.unsplash.com/photo-1623536167776-922ccb1ff749?auto=format&fit=crop&w=1200&q=85",
          alt: "Mostar stone architecture",
        },
      },
      {
        id: "b3",
        type: "spotlight" as const,
        title: "The Albanian Riviera",
        text: "The Albanian Riviera offers dramatic coastal views where steep mountains plunge directly into crystal-clear turquoise waters. This is a landscape born of contrasting elements, raw, wild and unbothered.",
        url: "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80",
        layout: "image-left" as const,
        textStyle: { textColor: DEFAULT_PREVIEW_STYLES.terracotta },
        multimedia: {
          type: "image",
          url: "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80",
          alt: "The Albanian Riviera",
        },
      },
      {
        id: "b4",
        type: "quote" as const,
        text: "The Balkans are not discovered quickly. They unfold slowly, revealing themselves to those who take the time to listen.",
        textStyle: { textColor: DEFAULT_PREVIEW_STYLES.terracotta },
      },
    ] as ArticleBlock[],
  })

  useEffect(() => {
    if (storyData?.data) {
      const s = storyData.data
      const detail = s.detail || {}
      const cats =
        s.categories && s.categories.length > 0
          ? s.categories
          : s.category
            ? [s.category]
            : ["Culture & Heritage"]

      setFormData({
        title: getStrVal(s.title || ""),
        titleStyle: detail.titleStyle || DEFAULT_PREVIEW_STYLES.titleStyle,
        slug: s.slug || "",
        category: s.category || cats[0] || "Culture & Heritage",
        categories: cats,
        description: getStrVal(s.description || ""),
        descriptionStyle: detail.descriptionStyle || DEFAULT_PREVIEW_STYLES.descriptionStyle,
        readTime: getStrVal(s.readTime || "5 min read"),
        readTimeStyle: detail.readTimeStyle || DEFAULT_PREVIEW_STYLES.readTimeStyle,
        templateType: s.templateType || "long-story",
        image: s.image || DEFAULT_PREVIEW_STYLES.heroImage,
        heroMultimedia: detail.heroMultimedia || {
          type: "image",
          color: DEFAULT_PREVIEW_STYLES.heroColor,
          url: s.image || DEFAULT_PREVIEW_STYLES.heroImage,
          alt: getStrVal(s.title || ""),
          opacity: 100,
          overlayColor: "#000000",
          overlayOpacity: 0,
        },
        buttons: detail.buttons && detail.buttons.length > 0 ? detail.buttons : [DEFAULT_PREVIEW_STYLES.defaultButton],
        tagPlace: detail.tagPlace || "",
        tagTheme: detail.tagTheme || "Culture",
        tagLens: detail.tagLens || "Tradition",
        destinationPlace: detail.destinationPlace || "",
        author: getStrVal(detail.author || "MIRA Editorial"),
        authorStyle: detail.authorStyle || DEFAULT_PREVIEW_STYLES.authorStyle,
        authorTitle: getStrVal(detail.authorTitle || "Curator & Travel Writer"),
        authorTitleStyle: detail.authorTitleStyle || DEFAULT_PREVIEW_STYLES.authorTitleStyle,
        journeyIds: detail.journeyIds || [],
        manualRelatedStoryIds: detail.manualRelatedStoryIds || [],
        blocks:
          detail.blocks && Array.isArray(detail.blocks) && detail.blocks.length > 0
            ? detail.blocks.map((b: any) => ({
              ...b,
              text: getStrVal(b.text),
              title: getStrVal(b.title),
              caption: getStrVal(b.caption),
            }))
            : [
              {
                id: "b1",
                type: "paragraph",
                text: getStrVal(s.description || "Start writing your story content here..."),
              },
            ],
      })
    }
  }, [storyData])

  // Multi-Category Selection Handlers
  const addCategoryToStory = (catName: string) => {
    setFormData((prev) => {
      if (prev.categories.includes(catName)) return prev
      const newCats = [...prev.categories, catName]
      return {
        ...prev,
        categories: newCats,
        category: newCats[0] || prev.category,
      }
    })
    setCategorySearch("")
    setIsCategoryDropdownOpen(false)
  }

  const removeCategoryFromStory = (catName: string) => {
    setFormData((prev) => {
      const newCats = prev.categories.filter((c) => c !== catName)
      return {
        ...prev,
        categories: newCats,
        category: newCats[0] || "Culture & Heritage",
      }
    })
  }

  const handleAddNewCategory = () => {
    const trimmed = categorySearch.trim()
    if (!trimmed) return

    createCategory(trimmed, {
      onSuccess: (newCat: any) => {
        toast.success(`Category "${trimmed}" added to backend!`)
        addCategoryToStory(newCat?.data?.name || newCat?.name || trimmed)
      },
      onError: () => {
        toast.error("Failed to add category")
      },
    })
  }

  const handleDeleteCategoryFromBackend = (
    e: React.MouseEvent,
    catId: string,
    catName: string
  ) => {
    e.stopPropagation()
    deleteCategory(catId, {
      onSuccess: () => {
        toast.success(`Category "${catName}" deleted from backend list.`)
        removeCategoryFromStory(catName)
      },
      onError: () => {
        toast.error("Failed to delete category.")
      },
    })
  }

  // Story Type Handlers
  const selectStoryType = (typeName: string) => {
    setFormData((prev) => ({
      ...prev,
      templateType: typeName,
    }))
    setTypeSearch("")
    setIsTypeDropdownOpen(false)
  }

  const handleAddNewStoryType = () => {
    const trimmed = typeSearch.trim()
    if (!trimmed) return

    createStoryType(trimmed, {
      onSuccess: (newType: any) => {
        toast.success(`Story Type "${trimmed}" added to backend!`)
        selectStoryType(newType?.data?.name || newType?.name || trimmed)
      },
      onError: () => {
        toast.error("Failed to add story type")
      },
    })
  }

  const handleDeleteStoryTypeFromBackend = (
    e: React.MouseEvent,
    typeId: string,
    typeName: string
  ) => {
    e.stopPropagation()
    deleteStoryType(typeId, {
      onSuccess: () => {
        toast.success(`Story Type "${typeName}" deleted from backend list.`)
        if (formData.templateType === typeName) {
          setFormData((prev) => ({ ...prev, templateType: "Long Story" }))
        }
      },
      onError: () => {
        toast.error("Failed to delete story type.")
      },
    })
  }

  // Journey Toggle
  const toggleJourneyId = (journeyId: string) => {
    setFormData((prev) => {
      const exists = prev.journeyIds.includes(journeyId)
      return {
        ...prev,
        journeyIds: exists
          ? prev.journeyIds.filter((jId) => jId !== journeyId)
          : [...prev.journeyIds, journeyId],
      }
    })
  }

  // Block Builder Actions
  const addBlock = (type: ArticleBlock["type"]) => {
    const newBlock: ArticleBlock = {
      id: `b_${Date.now()}`,
      type,
      title: type === "spotlight" ? "Spotlight Title" : type === "practical-notes" ? "Practical Notes" : undefined,
      text: type === "heading" ? "New Section Heading" : type === "spotlight" ? "Describe this featured location..." : type === "quote" ? "The Balkans are not discovered quickly. They unfold slowly..." : "",
      textStyle: type === "quote" || type === "spotlight" ? { textColor: DEFAULT_PREVIEW_STYLES.terracotta } : undefined,
      url: "",
      secondUrl: type === "gallery" ? "" : undefined,
      layout: type === "spotlight" ? "image-left" : undefined,
      caption: "",
      captionStyle: undefined,
      multimedia: type === "image" || type === "spotlight" || type === "gallery" ? { type: "image", url: "", alt: "" } : undefined,
      secondMultimedia: type === "gallery" ? { type: "image", url: "", alt: "" } : undefined,
      items: type === "practical-notes" ? [
        { title: "Getting There", content: "Fly to Tirana or Dubrovnik. Rental cars recommended for mountain passes." },
        { title: "Accommodation", content: "Traditional stone guesthouses (Kullas) & boutique eco-lodges." },
        { title: "What to Pack", content: "Sturdy hiking boots, rain jacket, offline maps & cash for rural villages." },
        { title: "Cultural Etiquette", content: "Warm hospitality is customary. Small token gifts are appreciated." },
      ] : undefined,
    }
    setFormData((prev) => ({
      ...prev,
      blocks: [...prev.blocks, newBlock],
    }))
  }

  const updateBlock = (
    blockId: string,
    field: string,
    value: any
  ) => {
    const finalVal = (field === "text" || field === "title" || field === "caption") ? getStrVal(value) : value
    setFormData((prev) => ({
      ...prev,
      blocks: prev.blocks.map((b) =>
        b.id === blockId ? { ...b, [field]: finalVal } : b
      ),
    }))
  }

  const removeBlock = (blockId: string) => {
    setFormData((prev) => ({
      ...prev,
      blocks: prev.blocks.filter((b) => b.id !== blockId),
    }))
  }

  const handleSave = () => {
    if (!formData.title || !formData.description) {
      toast.error("Please fill required fields (Title, Description).")
      return
    }

    const payload = normalizeStoryPayload(formData)

    if (isEditing) {
      updateStory(
        { id: id!, data: payload },
        {
          onSuccess: () => {
            toast.success("Story updated successfully.")
            navigate("/stories")
          },
          onError: () => toast.error("Failed to update story."),
        }
      )
    } else {
      createStory(payload, {
        onSuccess: () => {
          toast.success("Story created successfully.")
          navigate("/stories")
        },
        onError: () => toast.error("Failed to save story."),
      })
    }
  }

  if (isLoadingStory) {
    return (
      <MiraLoader text="Loading story editor data..." className="min-h-[400px] py-16" />
    )
  }

  const isSaving = isCreating || isUpdating

  return (
    <UniversalEditorLayout
      backToUrl="/stories"
      backToLabel="Back to Stories"
      icon={BookOpen}
      title={isEditing ? `Edit Story: ${formData.title || "Untitled"}` : "New Editorial Story"}
      sidebarContent={
        <div className="flex flex-col gap-6 p-4 md:p-6">
          {/* Form Header Action Controls (Console & Save/Update) */}
          <div className="flex items-center justify-between gap-2 rounded-xl border border-border/60 bg-card p-3 shadow-xs">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-primary shrink-0" />
              <span className="text-xs font-bold text-foreground tracking-wider uppercase">
                {isEditing ? "Edit Story Form" : "New Story Form"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  const cleanPayload = normalizeStoryPayload(formData)
                  console.log("📍 [CLEAN STORY API PAYLOAD SENT TO BACKEND]:", cleanPayload)
                  toast.success("Story data printed to browser console! (Press F12 to inspect)")
                }}
                className="flex items-center gap-1.5 rounded-lg border border-border/70 bg-background px-3 py-1.5 text-xs font-semibold text-foreground transition-all hover:bg-muted cursor-pointer shadow-2xs"
                title="Log Form State to Browser Console"
              >
                <Terminal className="h-3.5 w-3.5 text-primary" />
                <span>Console</span>
              </button>

              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-1.5 text-xs font-semibold text-primary-foreground transition-all hover:opacity-90 disabled:opacity-50 cursor-pointer shadow-2xs"
              >
                {isSaving ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Save className="h-3.5 w-3.5" />
                )}
                <span>{isEditing ? "Update" : "Create"}</span>
              </button>
            </div>
          </div>

          {/* 1. Basic Information */}
          <div data-section="sec-identity" className="overflow-hidden rounded-xl border border-border/60 bg-card shadow-xs transition-all">
            <FormSection
              title="1. Story Identity & Categories"
              active={Boolean(openSections["sec-identity"])}
              onClick={() => toggleSection("sec-identity")}
            >
              <div className="flex flex-col gap-4">
                {/* Dynamic Styled Title Input */}
                <DynamicStyledField
                  type="text"
                  label="Story Title *"
                  value={formData.title}
                  onChange={(val) => setFormData((prev) => ({ ...prev, title: getStrVal(val) }))}
                  placeholder="e.g. Stories from the Balkans"
                  enableStyle
                  style={formData.titleStyle}
                  onStyleChange={(style) => setFormData((prev) => ({ ...prev, titleStyle: style }))}
                />

                {/* Multi-Category Searchable Selector */}
                <div className="relative">
                  <label className="mb-1.5 flex items-center justify-between text-xs font-medium text-foreground">
                    <span className="flex items-center gap-1.5 font-semibold">
                      <Tag className="h-3.5 w-3.5 text-primary" />
                      Categories (Multiple Allowed)
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      {formData.categories.length} selected
                    </span>
                  </label>

                  {/* Selected Category Chips */}
                  <div className="mb-2 flex flex-wrap gap-1.5">
                    {formData.categories.map((cat) => (
                      <span
                        key={cat}
                        className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary"
                      >
                        {cat}
                        <button
                          type="button"
                          onClick={() => removeCategoryFromStory(cat)}
                          className="rounded-full p-0.5 hover:bg-primary/20 hover:text-primary-foreground"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>

                  {/* Search & Add Input */}
                  <div className="relative">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                    <input
                      value={categorySearch}
                      onChange={(e) => {
                        setCategorySearch(e.target.value)
                        setIsCategoryDropdownOpen(true)
                      }}
                      onFocus={() => setIsCategoryDropdownOpen(true)}
                      className="w-full rounded-lg border border-border/60 bg-background py-2 pl-9 pr-3 text-xs outline-none focus:border-primary"
                      placeholder="Search or add category..."
                    />
                  </div>

                  {/* Dropdown Options */}
                  {isCategoryDropdownOpen && (
                    <div className="absolute left-0 right-0 z-30 mt-1 max-h-48 overflow-y-auto rounded-lg border border-border/60 bg-popover p-1 shadow-xl custom-scrollbar">
                      {availableCategories.length > 0 ? (
                        availableCategories.map((catItem) => {
                          const isSelected = formData.categories.includes(catItem.name)
                          return (
                            <div
                              key={catItem.id}
                              onClick={() => addCategoryToStory(catItem.name)}
                              className={`flex items-center justify-between rounded-md px-3 py-2 text-xs cursor-pointer transition-colors ${isSelected
                                ? "bg-primary/10 font-bold text-primary"
                                : "hover:bg-muted text-foreground"
                                }`}
                            >
                              <span className="truncate">{catItem.name}</span>
                              <div className="flex items-center gap-1.5">
                                {isSelected && <Check className="h-3.5 w-3.5 text-primary" />}
                                <button
                                  type="button"
                                  onClick={(e) =>
                                    handleDeleteCategoryFromBackend(e, catItem.id, catItem.name)
                                  }
                                  disabled={isDeletingCategory}
                                  className="rounded p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                                  title="Delete Category from list"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </div>
                          )
                        })
                      ) : (
                        <div className="p-2 text-center text-xs text-muted-foreground">
                          No category matching "{categorySearch}"
                        </div>
                      )}

                      {/* Create New Category Option */}
                      {categorySearch.trim() && (
                        <button
                          type="button"
                          onClick={handleAddNewCategory}
                          disabled={isCreatingCategory}
                          className="mt-1 flex w-full items-center justify-center gap-1.5 rounded-md border border-dashed border-primary/40 bg-primary/5 py-2 text-xs font-semibold text-primary transition-colors hover:bg-primary/10"
                        >
                          {isCreatingCategory ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <Plus className="h-3.5 w-3.5" />
                          )}
                          Add "{categorySearch.trim()}" to Category List
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Multi-StoryType Searchable Selector */}
                <div className="relative">
                  <label className="mb-1.5 flex items-center justify-between text-xs font-medium text-foreground">
                    <span className="flex items-center gap-1.5 font-semibold">
                      <BookOpen className="h-3.5 w-3.5 text-primary" />
                      Story Type / Template Layout
                    </span>
                    <span className="text-[11px] font-medium text-muted-foreground">
                      Selected: <strong className="text-primary">{formData.templateType}</strong>
                    </span>
                  </label>

                  {/* Search & Select Input */}
                  <div className="relative">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                    <input
                      value={typeSearch}
                      onChange={(e) => {
                        setTypeSearch(e.target.value)
                        setIsTypeDropdownOpen(true)
                      }}
                      onFocus={() => setIsTypeDropdownOpen(true)}
                      className="w-full rounded-lg border border-border/60 bg-background py-2 pl-9 pr-3 text-xs outline-none focus:border-primary"
                      placeholder="Search story type (e.g. Long Story, Guide Story...)"
                    />
                  </div>

                  {/* Dropdown Options */}
                  {isTypeDropdownOpen && (
                    <div className="absolute left-0 right-0 z-30 mt-1 max-h-48 overflow-y-auto rounded-lg border border-border/60 bg-popover p-1 shadow-xl custom-scrollbar">
                      {availableStoryTypes.length > 0 ? (
                        availableStoryTypes.map((typeItem) => {
                          const isSelected =
                            formData.templateType.toLowerCase() === typeItem.name.toLowerCase() ||
                            formData.templateType.toLowerCase() === typeItem.slug.toLowerCase()
                          return (
                            <div
                              key={typeItem.id}
                              onClick={() => selectStoryType(typeItem.name)}
                              className={`flex items-center justify-between rounded-md px-3 py-2 text-xs cursor-pointer transition-colors ${isSelected
                                ? "bg-primary/10 font-bold text-primary"
                                : "hover:bg-muted text-foreground"
                                }`}
                            >
                              <span className="truncate">{typeItem.name}</span>
                              <div className="flex items-center gap-1.5">
                                {isSelected && <Check className="h-3.5 w-3.5 text-primary" />}
                                <button
                                  type="button"
                                  onClick={(e) =>
                                    handleDeleteStoryTypeFromBackend(e, typeItem.id, typeItem.name)
                                  }
                                  disabled={isDeletingType}
                                  className="rounded p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                                  title="Delete Story Type from list"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </div>
                          )
                        })
                      ) : (
                        <div className="p-2 text-center text-xs text-muted-foreground">
                          No story type matching "{typeSearch}"
                        </div>
                      )}

                      {/* Create New Story Type Option */}
                      {typeSearch.trim() && (
                        <button
                          type="button"
                          onClick={handleAddNewStoryType}
                          disabled={isCreatingType}
                          className="mt-1 flex w-full items-center justify-center gap-1.5 rounded-md border border-dashed border-primary/40 bg-primary/5 py-2 text-xs font-semibold text-primary transition-colors hover:bg-primary/10"
                        >
                          {isCreatingType ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <Plus className="h-3.5 w-3.5" />
                          )}
                          Add "{typeSearch.trim()}" to Story Types
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Dynamic Styled Read Time Input */}
                <DynamicStyledField
                  type="text"
                  label="Read Time"
                  value={formData.readTime}
                  onChange={(val) => setFormData((prev) => ({ ...prev, readTime: getStrVal(val) }))}
                  placeholder="e.g. 6 min read"
                  enableStyle
                  style={formData.readTimeStyle}
                  onStyleChange={(style) => setFormData((prev) => ({ ...prev, readTimeStyle: style }))}
                />

                {/* Dynamic Styled Description Input */}
                <DynamicStyledField
                  type="textarea"
                  label="Editorial Subtitle / Description *"
                  value={formData.description}
                  onChange={(val) => setFormData((prev) => ({ ...prev, description: getStrVal(val) }))}
                  placeholder="Brief inspirational summary of the story..."
                  enableStyle
                  style={formData.descriptionStyle}
                  onStyleChange={(style) => setFormData((prev) => ({ ...prev, descriptionStyle: style }))}
                />

                {/* Dynamic Styled Author Inputs */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <DynamicStyledField
                    type="text"
                    label="Author Name"
                    value={formData.author}
                    onChange={(val) => setFormData((prev) => ({ ...prev, author: getStrVal(val) }))}
                    placeholder="e.g. MIRA Editorial"
                    enableStyle
                    style={formData.authorStyle}
                    onStyleChange={(style) => setFormData((prev) => ({ ...prev, authorStyle: style }))}
                  />
                  <DynamicStyledField
                    type="text"
                    label="Author Role/Title"
                    value={formData.authorTitle}
                    onChange={(val) => setFormData((prev) => ({ ...prev, authorTitle: getStrVal(val) }))}
                    placeholder="e.g. Travel Writer"
                    enableStyle
                    style={formData.authorTitleStyle}
                    onStyleChange={(style) => setFormData((prev) => ({ ...prev, authorTitleStyle: style }))}
                  />
                </div>

                {/* Action Buttons (CMS Home Hero Style) */}
                <div className="rounded-md border border-border/50 p-3">
                  <p className="mb-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                    Story Action Buttons (CTAs)
                  </p>
                  <ButtonsField
                    value={formData.buttons}
                    onChange={(btns) => setFormData((prev) => ({ ...prev, buttons: btns }))}
                  />
                </div>

                {/* Universal Multimedia Form for Hero Cover / Background Media */}
                <UniversalMultimediaForm
                  section={{ id: "hero", type: "hero" } as any}
                  content={{ heroMultimedia: formData.heroMultimedia }}
                  updateSection={() => { }}
                  updateSectionContent={(patch) => {
                    if (patch.heroMultimedia) {
                      setFormData((prev) => ({
                        ...prev,
                        heroMultimedia: patch.heroMultimedia,
                        image: patch.heroMultimedia.url || patch.heroMultimedia.imageData?.url || prev.image,
                      }))
                    }
                  }}
                  contentMediaKey="heroMultimedia"
                  sectionTitle="Hero & Background Multimedia"
                  showColorPicker
                  colorLabel="Hero Fallback Background Color"
                  defaultColor={DEFAULT_PREVIEW_STYLES.heroColor}
                  imageTitle="Hero Cover Image"
                  imageLabel="Featured Cover Image"
                  imageFieldName="storyHeroCoverImage"
                  videoTitle="Hero Featured Video"
                  videoLabel="Background / Featured Video"
                  videoHint="Upload or paste a video URL for video cover stories."
                  videoFieldName="storyHeroVideo"
                  showVideoSwitches
                />
              </div>
            </FormSection>
          </div>

          {/* 2. Article Block Content Builder */}
          <div data-section="sec-builder" className="overflow-hidden rounded-xl border border-border/60 bg-card shadow-xs transition-all">
            <FormSection
              title="2. Editorial Article Builder"
              active={Boolean(openSections["sec-builder"])}
              onClick={() => toggleSection("sec-builder")}
            >
              <div className="flex flex-col gap-4">

                {/* Add Block Toolbar */}
                <div className="mb-4 flex flex-wrap items-center gap-1.5 rounded-lg border border-border/50 bg-muted/40 p-1.5">
                  <button
                    type="button"
                    onClick={() => addBlock("paragraph")}
                    className="flex items-center gap-1 rounded bg-background px-2 py-1 text-[11px] font-semibold text-foreground shadow-2xs transition-colors hover:bg-primary/10 hover:text-primary cursor-pointer"
                    title="Add Paragraph Body"
                  >
                    <AlignLeft className="h-3 w-3" /> +Para
                  </button>
                  <button
                    type="button"
                    onClick={() => addBlock("heading")}
                    className="flex items-center gap-1 rounded bg-background px-2 py-1 text-[11px] font-semibold text-foreground shadow-2xs transition-colors hover:bg-primary/10 hover:text-primary cursor-pointer"
                    title="Add Heading"
                  >
                    <Heading className="h-3 w-3" /> +H2
                  </button>
                  <button
                    type="button"
                    onClick={() => addBlock("quote")}
                    className="flex items-center gap-1 rounded bg-background px-2 py-1 text-[11px] font-semibold text-foreground shadow-2xs transition-colors hover:bg-primary/10 hover:text-primary cursor-pointer"
                    title="Add Blockquote"
                  >
                    <Quote className="h-3 w-3" /> +Quote
                  </button>
                  <button
                    type="button"
                    onClick={() => addBlock("image")}
                    className="flex items-center gap-1 rounded bg-background px-2 py-1 text-[11px] font-semibold text-foreground shadow-2xs transition-colors hover:bg-primary/10 hover:text-primary cursor-pointer"
                    title="Add Full Width Image"
                  >
                    <ImageIcon className="h-3 w-3" /> +Img
                  </button>
                  <button
                    type="button"
                    onClick={() => addBlock("spotlight")}
                    className="flex items-center gap-1 rounded bg-background px-2 py-1 text-[11px] font-semibold text-foreground shadow-2xs transition-colors hover:bg-primary/10 hover:text-primary cursor-pointer"
                    title="Add Side-by-Side Spotlight"
                  >
                    <Columns className="h-3 w-3 text-[#af6348]" /> +Spotlight
                  </button>
                  <button
                    type="button"
                    onClick={() => addBlock("gallery")}
                    className="flex items-center gap-1 rounded bg-background px-2 py-1 text-[11px] font-semibold text-foreground shadow-2xs transition-colors hover:bg-primary/10 hover:text-primary cursor-pointer"
                    title="Add 2-Column Gallery"
                  >
                    <LayoutGrid className="h-3 w-3 text-primary" /> +Gallery
                  </button>
                  <button
                    type="button"
                    onClick={() => addBlock("practical-notes")}
                    className="flex items-center gap-1 rounded bg-background px-2 py-1 text-[11px] font-semibold text-foreground shadow-2xs transition-colors hover:bg-primary/10 hover:text-primary cursor-pointer"
                    title="Add Practical Notes Grid"
                  >
                    <ClipboardList className="h-3 w-3 text-amber-500" /> +Notes
                  </button>
                </div>

                {/* Block Items List */}
                <div className="flex flex-col gap-4">
                  {formData.blocks.map((block, idx) => (
                    <div
                      key={block.id}
                      className="relative flex flex-col gap-3 rounded-lg border border-border/60 bg-background p-3 shadow-2xs"
                    >
                      <div className="flex items-center justify-between text-[11px] font-semibold text-muted-foreground border-b border-border/40 pb-2">
                        <span className="capitalize font-bold text-foreground flex items-center gap-1.5">
                          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/15 text-primary text-[10px]">
                            {idx + 1}
                          </span>
                          {block.type} Block
                        </span>
                        <button
                          type="button"
                          onClick={() => removeBlock(block.id)}
                          className="text-red-500 hover:text-red-600 p-1 cursor-pointer"
                          title="Remove Block"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      {/* Heading Block */}
                      {block.type === "heading" && (
                        <DynamicStyledField
                          type="text"
                          label="Section Heading (H2)"
                          value={block.text || ""}
                          onChange={(val) => updateBlock(block.id, "text", val)}
                          placeholder="Section Heading (H2)..."
                          enableStyle
                          style={block.textStyle}
                          onStyleChange={(style) => updateBlock(block.id, "textStyle", style)}
                        />
                      )}

                      {/* Paragraph Block */}
                      {block.type === "paragraph" && (
                        <DynamicStyledField
                          type="textarea"
                          label="Paragraph Content"
                          value={block.text || ""}
                          onChange={(val) => updateBlock(block.id, "text", val)}
                          placeholder="Write paragraph body content..."
                          enableStyle
                          style={block.textStyle}
                          onStyleChange={(style) => updateBlock(block.id, "textStyle", style)}
                        />
                      )}

                      {/* Quote Block */}
                      {block.type === "quote" && (
                        <DynamicStyledField
                          type="textarea"
                          label="Pull-Quote / Excerpt"
                          value={block.text || ""}
                          onChange={(val) => updateBlock(block.id, "text", val)}
                          placeholder="Pull-quote or interview excerpt..."
                          enableStyle
                          style={block.textStyle || { textColor: DEFAULT_PREVIEW_STYLES.terracotta }}
                          onStyleChange={(style) => updateBlock(block.id, "textStyle", style)}
                        />
                      )}

                      {/* Spotlight Block (Image Left / Text Right) */}
                      {block.type === "spotlight" && (
                        <div className="flex flex-col gap-3">
                          <DynamicStyledField
                            type="select"
                            label="Spotlight Layout"
                            value={block.layout || "image-left"}
                            onChange={(val) => updateBlock(block.id, "layout", val)}
                            options={[
                              { value: "image-left", label: "Image on Left, Text on Right" },
                              { value: "image-right", label: "Text on Left, Image on Right" },
                            ]}
                          />
                          <DynamicStyledField
                            type="text"
                            label="Spotlight Title"
                            value={block.title || ""}
                            onChange={(val) => updateBlock(block.id, "title", val)}
                            placeholder="e.g. The Albanian Riviera"
                            enableStyle
                            style={block.textStyle || { textColor: DEFAULT_PREVIEW_STYLES.terracotta }}
                            onStyleChange={(style) => updateBlock(block.id, "textStyle", style)}
                          />
                          <DynamicStyledField
                            type="textarea"
                            label="Spotlight Description Body"
                            value={block.text || ""}
                            onChange={(val) => updateBlock(block.id, "text", val)}
                            placeholder="Detailed description of this featured location..."
                          />
                          <UniversalMultimediaForm
                            section={{ id: block.id, type: "spotlight-image" } as any}
                            content={{ multimedia: block.multimedia || { type: "image", url: block.url || "", alt: block.title || "" } }}
                            updateSection={() => { }}
                            updateSectionContent={(patch) => {
                              if (patch.multimedia) {
                                updateBlock(block.id, "multimedia", patch.multimedia)
                                const mUrl = patch.multimedia.url || patch.multimedia.imageData?.url || patch.multimedia.videoData?.url
                                if (mUrl) {
                                  updateBlock(block.id, "url", mUrl)
                                }
                              }
                            }}
                            contentMediaKey="multimedia"
                            sectionTitle="Spotlight Media (Image / Video)"
                            showColorPicker={false}
                            enableTypeSelector={true}
                            imageTitle="Spotlight Image"
                            imageLabel="Image URL"
                            imageFieldName={`spotlightImage_${block.id}`}
                            videoTitle="Spotlight Video"
                            videoLabel="Video URL"
                            videoFieldName={`spotlightVideo_${block.id}`}
                            showImageAltField={true}
                            showVideoAltField={true}
                            showVideoSwitches={true}
                          />
                        </div>
                      )}

                      {/* Gallery 2-Column Block */}
                      {block.type === "gallery" && (
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                          <UniversalMultimediaForm
                            section={{ id: `${block.id}_1`, type: "gallery-image-1" } as any}
                            content={{ multimedia: block.multimedia || { type: "image", url: block.url || "" } }}
                            updateSection={() => { }}
                            updateSectionContent={(patch) => {
                              if (patch.multimedia) {
                                updateBlock(block.id, "multimedia", patch.multimedia)
                                const mUrl = patch.multimedia.url || patch.multimedia.imageData?.url || patch.multimedia.videoData?.url
                                if (mUrl) updateBlock(block.id, "url", mUrl)
                              }
                            }}
                            contentMediaKey="multimedia"
                            sectionTitle="Gallery Item 1 (Image / Video)"
                            showColorPicker={false}
                            enableTypeSelector={true}
                            imageTitle="Gallery Media 1"
                            imageFieldName={`galleryImg1_${block.id}`}
                            videoTitle="Gallery Video 1"
                            videoFieldName={`galleryVid1_${block.id}`}
                            showImageAltField={true}
                            showVideoAltField={true}
                            showVideoSwitches={true}
                          />
                          <UniversalMultimediaForm
                            section={{ id: `${block.id}_2`, type: "gallery-image-2" } as any}
                            content={{ secondMultimedia: block.secondMultimedia || { type: "image", url: block.secondUrl || "" } }}
                            updateSection={() => { }}
                            updateSectionContent={(patch) => {
                              if (patch.secondMultimedia) {
                                updateBlock(block.id, "secondMultimedia", patch.secondMultimedia)
                                const mUrl = patch.secondMultimedia.url || patch.secondMultimedia.imageData?.url || patch.secondMultimedia.videoData?.url
                                if (mUrl) updateBlock(block.id, "secondUrl", mUrl)
                              }
                            }}
                            contentMediaKey="secondMultimedia"
                            sectionTitle="Gallery Item 2 (Image / Video)"
                            showColorPicker={false}
                            enableTypeSelector={true}
                            imageTitle="Gallery Media 2"
                            imageFieldName={`galleryImg2_${block.id}`}
                            videoTitle="Gallery Video 2"
                            videoFieldName={`galleryVid2_${block.id}`}
                            showImageAltField={true}
                            showVideoAltField={true}
                            showVideoSwitches={true}
                          />
                        </div>
                      )}

                      {/* Practical Notes Block */}
                      {block.type === "practical-notes" && (
                        <div className="flex flex-col gap-3">
                          <DynamicStyledField
                            type="text"
                            label="Practical Notes Section Title"
                            value={block.title || "Practical Notes"}
                            onChange={(val) => updateBlock(block.id, "title", val)}
                          />
                          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                            {(block.items || []).map((item, iIdx) => (
                              <div key={iIdx} className="rounded-md border border-border/40 p-2 bg-muted/20 flex flex-col gap-1.5">
                                <input
                                  value={item.title}
                                  onChange={(e) => {
                                    const newItems = [...(block.items || [])]
                                    newItems[iIdx] = { ...newItems[iIdx], title: e.target.value }
                                    updateBlock(block.id, "items", newItems)
                                  }}
                                  className="w-full rounded border border-border/40 bg-background px-2 py-1 text-xs font-bold text-primary"
                                  placeholder="Note Header..."
                                />
                                <textarea
                                  value={item.content}
                                  onChange={(e) => {
                                    const newItems = [...(block.items || [])]
                                    newItems[iIdx] = { ...newItems[iIdx], content: e.target.value }
                                    updateBlock(block.id, "items", newItems)
                                  }}
                                  rows={2}
                                  className="w-full resize-none rounded border border-border/40 bg-background px-2 py-1 text-xs text-foreground"
                                  placeholder="Note Content..."
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Single Image Block */}
                      {block.type === "image" && (
                        <div className="flex flex-col gap-3">
                          <UniversalMultimediaForm
                            section={{ id: block.id, type: "block-image" } as any}
                            content={{ multimedia: block.multimedia || { type: "image", url: block.url || "", alt: block.caption || "" } }}
                            updateSection={() => { }}
                            updateSectionContent={(patch) => {
                              if (patch.multimedia) {
                                updateBlock(block.id, "multimedia", patch.multimedia)
                                const mUrl = patch.multimedia.url || patch.multimedia.imageData?.url || patch.multimedia.videoData?.url
                                if (mUrl) {
                                  updateBlock(block.id, "url", mUrl)
                                }
                              }
                            }}
                            contentMediaKey="multimedia"
                            sectionTitle="Article Media (Image / Video)"
                            showColorPicker={false}
                            enableTypeSelector={true}
                            imageTitle="Article Image"
                            imageLabel="Image URL"
                            imageFieldName={`blockImage_${block.id}`}
                            videoTitle="Article Video"
                            videoLabel="Video URL"
                            videoFieldName={`blockVideo_${block.id}`}
                            showImageAltField={true}
                            showVideoAltField={true}
                            showVideoSwitches={true}
                          />
                          <DynamicStyledField
                            type="text"
                            label="Image Caption / Attribution"
                            value={block.caption || ""}
                            onChange={(val) => updateBlock(block.id, "caption", val)}
                            placeholder="Image caption / attribution..."
                            enableStyle
                            style={block.captionStyle}
                            onStyleChange={(style) => updateBlock(block.id, "captionStyle", style)}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </FormSection>
          </div>

          {/* 3. Geography & Three-Tag Taxonomy Model */}
          <div data-section="sec-taxonomy" className="overflow-hidden rounded-xl border border-border/60 bg-card shadow-xs transition-all">
            <FormSection
              title="3. Geography & Three-Tag Taxonomy"
              active={Boolean(openSections["sec-taxonomy"])}
              onClick={() => toggleSection("sec-taxonomy")}
            >
              <div className="flex flex-col gap-4">
                <div>
                  <StoryLocationSearchCombobox
                    label="Geographical Anchor (Destination)"
                    valueLocationName={formData.destinationPlace}
                    placeholder="Search DB destinations, cities, villages..."
                    onSelect={(selectedLoc: SelectedStoryLocation | null) => {
                      if (selectedLoc) {
                        const locName = selectedLoc.name
                        setFormData((prev) => ({
                          ...prev,
                          destinationPlace: locName,
                          tagPlace: prev.tagPlace ? prev.tagPlace : locName,
                        }))
                      } else {
                        setFormData((prev) => ({
                          ...prev,
                          destinationPlace: "",
                        }))
                      }
                    }}
                  />
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <div>
                    <StoryLocationSearchCombobox
                      label="Tag 1 — Place"
                      valueLocationName={formData.tagPlace}
                      placeholder="Search place..."
                      onSelect={(selectedLoc: SelectedStoryLocation | null) => {
                        if (selectedLoc) {
                          setFormData((prev) => ({
                            ...prev,
                            tagPlace: selectedLoc.name,
                          }))
                        } else {
                          setFormData((prev) => ({
                            ...prev,
                            tagPlace: "",
                          }))
                        }
                      }}
                    />
                  </div>

                  <div>
                    <DynamicStyledField
                      type="select"
                      label="Tag 2 — Theme"
                      value={formData.tagTheme}
                      onChange={(val) => setFormData((prev) => ({ ...prev, tagTheme: val }))}
                      options={[
                        { value: "Culture", label: "Culture" },
                        { value: "Food & Wine", label: "Food & Wine" },
                        { value: "People", label: "People" },
                        { value: "Heritage", label: "Heritage" },
                        { value: "Nature", label: "Nature" },
                        { value: "Craft", label: "Craft" },
                        { value: "Local Life", label: "Local Life" },
                      ]}
                    />
                  </div>

                  <div>
                    <DynamicStyledField
                      type="select"
                      label="Tag 3 — Lens"
                      value={formData.tagLens}
                      onChange={(val) => setFormData((prev) => ({ ...prev, tagLens: val }))}
                      options={[
                        { value: "Tradition", label: "Tradition" },
                        { value: "Discovery", label: "Discovery" },
                        { value: "Encounter", label: "Encounter" },
                        { value: "Landscape", label: "Landscape" },
                        { value: "Slow Travel", label: "Slow Travel" },
                        { value: "Local Perspective", label: "Local Perspective" },
                      ]}
                    />
                  </div>
                </div>
              </div>
            </FormSection>
          </div>

          {/* 4. Related Journeys Selector */}
          <div data-section="sec-journeys" className="overflow-hidden rounded-xl border border-border/60 bg-card shadow-xs transition-all">
            <FormSection
              title="4. Linked Commercial Journeys"
              active={Boolean(openSections["sec-journeys"])}
              onClick={() => toggleSection("sec-journeys")}
            >
              <div className="flex flex-col gap-4">
                <p className="text-[11px] text-muted-foreground">
                  Select bookable Journeys that will feature as cards inside this Story.
                </p>

                {/* Selected Journey Chips */}
                {formData.journeyIds.length > 0 && (
                  <div className="mb-1 flex flex-wrap gap-1.5">
                    {formData.journeyIds.map((jId) => {
                      const found = availableJourneys.find((j: any) => j.id === jId)
                      return (
                        <span
                          key={jId}
                          className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary"
                        >
                          <span className="max-w-[160px] truncate">{found?.title || jId}</span>
                          <button
                            type="button"
                            onClick={() => toggleJourneyId(jId)}
                            className="rounded-full p-0.5 hover:bg-primary/20 hover:text-primary-foreground cursor-pointer"
                            title="Remove linked journey"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      )
                    })}
                  </div>
                )}

                {/* Search Input */}
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                  <input
                    value={journeySearch}
                    onChange={(e) => setJourneySearch(e.target.value)}
                    className="w-full rounded-lg border border-border/60 bg-background py-2 pl-9 pr-3 text-xs outline-none focus:border-primary"
                    placeholder="Search bookable journeys by title or destination..."
                  />
                </div>

                {/* Filtered Journeys List */}
                <div className="flex max-h-48 flex-col gap-1.5 overflow-y-auto rounded-lg border border-border/40 bg-background p-2 custom-scrollbar">
                  {filteredJourneys.length > 0 ? (
                    filteredJourneys.map((j: any) => {
                      const isSelected = formData.journeyIds.includes(j.id)
                      return (
                        <button
                          key={j.id}
                          type="button"
                          onClick={() => toggleJourneyId(j.id)}
                          className={`flex items-center justify-between rounded-md px-3 py-2 text-left text-xs transition-colors cursor-pointer ${isSelected
                            ? "bg-primary/10 font-semibold text-primary"
                            : "hover:bg-muted/50 text-foreground"
                            }`}
                        >
                          <div className="flex items-center gap-2 truncate pr-2">
                            <span className="truncate">{j.title}</span>
                            {j.destination && (
                              <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground shrink-0">
                                {j.destination}
                              </span>
                            )}
                          </div>
                          {isSelected && <Check className="h-4 w-4 text-primary shrink-0" />}
                        </button>
                      )
                    })
                  ) : (
                    <p className="p-3 text-center text-xs text-muted-foreground italic">
                      {journeySearch.trim()
                        ? `No journeys matching "${journeySearch}"`
                        : "No bookable journeys available."}
                    </p>
                  )}
                </div>
              </div>
            </FormSection>
          </div>
        </div>
      }
      previewContent={<StoryPreview formData={formData} />}
      useWorkspaceScale={true}
    />
  )
}
