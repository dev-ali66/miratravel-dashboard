import { useState, useEffect } from "react"
import { useGetCmsBySlug } from "@/hooks/cms/useGetCmsBySlug"
import { useAddCms } from "@/hooks/cms/useAddCms"
import { DEFAULT_TERMS_ITEMS, type TermsItem } from "./types"
import {
  createDefaultTermsHero,
  normalizeLegalHero,
  type LegalHeroData,
} from "@/components/pages/CMS/shared/legalHeroDefaults"
import { LegalHeroForm } from "@/components/pages/CMS/shared/LegalHeroForm"
import { TermsOfServiceMetadata } from "./TermsOfServiceMetadata"
import { TermsOfServiceTabs } from "./TermsOfServiceTabs"
import { TermsOfServiceEditor } from "./TermsOfServiceEditor"
import { TermsOfServicePreview } from "./TermsOfServicePreview"
import { TermsOfServiceSkeleton } from "./TermsOfServiceSkeleton"
import { UniversalEditorLayout } from "@/components/layout/UniversalEditorLayout"
import { Save, Loader2, FileText, Terminal } from "lucide-react"
import { toast } from "sonner"

export default function TermsOfServicePage() {
  const { mutate: saveSection, isPending: isSaving } = useAddCms()
  const { data: termsResponse, isLoading } = useGetCmsBySlug("terms-of-service")

  const [effectiveDate, setEffectiveDate] = useState<string>("01.08.2025")
  const [lastUpdated, setLastUpdated] = useState<string>("01.08.2025")
  const [hero, setHero] = useState<LegalHeroData>(createDefaultTermsHero())
  const [isHeroOpen, setIsHeroOpen] = useState<boolean>(true)
  const [items, setItems] = useState<TermsItem[]>(DEFAULT_TERMS_ITEMS)
  const [activeTab, setActiveTab] = useState<string>("")

  useEffect(() => {
    const raw = termsResponse?.data
    const record = Array.isArray(raw)
      ? raw.find((r: any) => r.slug === "terms-of-service" || r.slug === "terms") || raw[0]
      : raw?.data || raw

    const fetchedData = record?.data || record
    if (fetchedData) {
      if (fetchedData.effectiveDate) setEffectiveDate(fetchedData.effectiveDate)
      if (fetchedData.lastUpdated) setLastUpdated(fetchedData.lastUpdated)

      const normalized = normalizeLegalHero(fetchedData.hero, {
        breadcrumb: "MIRA ARCHIVE",
        title: fetchedData.title || "Terms & Conditions",
        subtitle:
          fetchedData.subtitle ||
          "Please review the legal terms, booking requirements, and mutual commitments that govern our bespoke expeditions, private concierge services, and regional itineraries.",
        existingMedia: fetchedData.heroMultimedia,
      })
      setHero(normalized)

      const rawItems = fetchedData.items || fetchedData.parts
      if (Array.isArray(rawItems) && rawItems.length > 0) {
        setItems(rawItems)
        if (!activeTab || !rawItems.some((p: any) => p.id === activeTab)) {
          setActiveTab(rawItems[0].id)
        }
      }
    }
  }, [termsResponse])

  // Handle adding a new dynamic section
  const handleAddSection = () => {
    const nextNum = items.length + 1
    const newId = "item_" + Date.now()
    const newItem: TermsItem = {
      id: newId,
      tabTitle: `Item ${nextNum}`,
      fullTitle: `${nextNum}. New Terms Section`,
      content: "<p>Write your section content here...</p>",
    }
    setItems((prev) => [...prev, newItem])
    setActiveTab(newId)
    toast.success(`Item ${nextNum} added.`)
  }

  // Handle deleting current section
  const handleRemoveSection = () => {
    if (!activeTab) return
    setItems((prev) => {
      const remaining = prev.filter((p) => p.id !== activeTab)
      if (remaining.length > 0) {
        setActiveTab(remaining[0].id)
      } else {
        setActiveTab("")
      }
      return remaining
    })
    toast.info("Terms section deleted.")
  }

  // Handle reordering sections (Move Up / Down)
  const handleMoveSection = (direction: "up" | "down") => {
    const idx = items.findIndex((p) => p.id === activeTab)
    if (idx === -1) return
    const targetIdx = direction === "up" ? idx - 1 : idx + 1
    if (targetIdx < 0 || targetIdx >= items.length) return

    const nextItems = [...items]
    const [moved] = nextItems.splice(idx, 1)
    nextItems.splice(targetIdx, 0, moved)
    setItems(nextItems)
  }

  // Handle updating section titles
  const handleUpdateItemTitle = (tabTitle: string, fullTitle: string) => {
    setItems((prev) =>
      prev.map((p) => (p.id === activeTab ? { ...p, tabTitle, fullTitle } : p))
    )
  }

  // Handle updating rich text content
  const handleContentChange = (newContent: string) => {
    setItems((prev) =>
      prev.map((p) => (p.id === activeTab ? { ...p, content: newContent } : p))
    )
  }

  // Inspect payload in browser console (F12)
  const handleConsoleData = () => {
    const payloadData = {
      effectiveDate,
      lastUpdated,
      hero,
      items,
    }

    console.log("📜 [CLEAN CMS TERMS & CONDITIONS PAYLOAD]:", payloadData)
    toast.info("Terms & Conditions payload logged to browser console (F12)")
  }

  // Handle saving to database
  const handleSave = () => {
    const payloadData = {
      effectiveDate,
      lastUpdated,
      hero,
      items,
    }

    const raw = termsResponse?.data
    const record = Array.isArray(raw)
      ? raw.find((r: any) => r.slug === "terms-of-service") || raw[0]
      : raw?.data || raw
    const existingId = record?.id

    // Save for terms-of-service
    saveSection({
      ...(existingId ? { id: existingId } : {}),
      name: "Terms of Service",
      slug: "terms-of-service",
      data: payloadData,
    })

    // Also sync terms slug
    saveSection({
      name: "Terms",
      slug: "terms",
      data: payloadData,
    })
  }

  const currentItem = items.find((p) => p.id === activeTab)
  const currentItemIndex = items.findIndex((p) => p.id === activeTab)

  if (isLoading) {
    return <TermsOfServiceSkeleton />
  }

  return (
    <UniversalEditorLayout
      backToUrl="/"
      backToLabel="Back to Dashboard"
      icon={FileText}
      iconColor="text-primary"
      title="Terms & Conditions Editor"
      useWorkspaceScale={true}
      sidebarContent={
        <div className="space-y-6 p-4 md:p-5">
          {/* Header & Action Buttons (Console Data, Save Changes) */}
          <div className="flex flex-col gap-3 border-b border-border/60 pb-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-base font-bold tracking-tight text-foreground">
                MIRA TERMS &amp; CONDITIONS
              </h2>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Configure hero banner, document structure and rich text content below.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleConsoleData}
                className="flex items-center gap-1.5 rounded-lg border border-border/80 bg-background px-3 py-1.5 text-xs font-semibold text-foreground transition hover:bg-muted cursor-pointer shadow-2xs"
                title="Inspect clean terms payload sent to backend API in browser console (F12)"
              >
                <Terminal className="h-3.5 w-3.5 text-primary" />
                <span>Console Data</span>
              </button>

              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-50 cursor-pointer shadow-sm shadow-primary/20 active:scale-95"
              >
                {isSaving ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Save className="h-3.5 w-3.5" />
                )}
                <span>{isSaving ? "Saving..." : "Save Changes"}</span>
              </button>
            </div>
          </div>

          <TermsOfServiceMetadata
            effectiveDate={effectiveDate}
            setEffectiveDate={setEffectiveDate}
            lastUpdated={lastUpdated}
            setLastUpdated={setLastUpdated}
          />

          {/* 1:1 Home CMS Hero Banner Form */}
          <LegalHeroForm
            title="Hero Banner"
            sectionNumber={1}
            hero={hero}
            onChange={setHero}
            isOpen={isHeroOpen}
            onToggle={() => setIsHeroOpen(!isHeroOpen)}
          />

          {items.length > 0 && (
            <TermsOfServiceTabs
              items={items}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              onAddSection={handleAddSection}
            />
          )}

          <TermsOfServiceEditor
            currentItem={currentItem}
            activeTab={activeTab}
            itemIndex={currentItemIndex >= 0 ? currentItemIndex : 0}
            totalItems={items.length}
            onContentChange={handleContentChange}
            onUpdateItemTitle={handleUpdateItemTitle}
            onMoveItem={handleMoveSection}
            onRemoveItem={handleRemoveSection}
            onAddSection={handleAddSection}
          />
        </div>
      }
      previewContent={
        <TermsOfServicePreview
          items={items}
          effectiveDate={effectiveDate}
          lastUpdated={lastUpdated}
          hero={hero}
        />
      }
    />
  )
}
