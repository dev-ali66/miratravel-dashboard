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
import { FormSection } from "@/components/pages/CMS/shared/FormControls"
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
  const [items, setItems] = useState<TermsItem[]>(DEFAULT_TERMS_ITEMS)
  const [activeTab, setActiveTab] = useState<string>("")

  // Form Section Accordion State matching Journey/Location/Experience
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    metadata: true,
    hero: false,
    content: true,
  })

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

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
    // Ensure content section is open when adding
    setOpenSections((prev) => ({ ...prev, content: true }))
    toast.success(`Item ${nextNum} added.`)
  }

  // Handle removing a dynamic section
  const handleRemoveSection = () => {
    if (!activeTab) return
    const remaining = items.filter((p) => p.id !== activeTab)
    setItems(remaining)
    if (remaining.length > 0) {
      setActiveTab(remaining[0].id)
    } else {
      setActiveTab("")
    }
    toast.info("Section removed.")
  }

  // Handle moving section up/down
  const handleMoveSection = (direction: "up" | "down") => {
    const currentIndex = items.findIndex((p) => p.id === activeTab)
    if (currentIndex === -1) return

    const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1
    if (newIndex < 0 || newIndex >= items.length) return

    const newItems = [...items]
    const [moved] = newItems.splice(currentIndex, 1)
    newItems.splice(newIndex, 0, moved)
    setItems(newItems)
  }

  // Update current item content
  const handleContentChange = (newContent: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === activeTab ? { ...item, content: newContent } : item
      )
    )
  }

  // Update current item titles
  const handleUpdateItemTitle = (tabTitle: string, fullTitle: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === activeTab ? { ...item, tabTitle, fullTitle } : item
      )
    )
  }

  // Console data payload helper
  const handleConsoleData = () => {
    const payloadData = {
      effectiveDate,
      lastUpdated,
      hero,
      items,
    }
    console.log("=== TERMS OF SERVICE CMS PAYLOAD (EXACT API STRUCTURE) ===")
    console.log(JSON.stringify(payloadData, null, 2))
    toast.success("Payload logged to browser console (F12)!")
  }

  // Save handler
  const handleSave = () => {
    const raw = termsResponse?.data
    const existingRecord = Array.isArray(raw)
      ? raw.find((r: any) => r.slug === "terms-of-service" || r.slug === "terms") || raw[0]
      : raw?.data || raw
    const existingId = existingRecord?.id || existingRecord?._id

    const payloadData = {
      effectiveDate,
      lastUpdated,
      hero,
      items,
    }

    // Save terms-of-service slug
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
        <div className="flex min-h-full flex-col">
          {/* =================================================
              HEADER — Exact 1:1 match with Journey/Location
          ================================================= */}
          <div className="sticky top-0 z-20 border-b border-border/60 bg-card/95 px-5 py-4 backdrop-blur">
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="text-[10px] font-medium tracking-[0.2em] text-muted-foreground uppercase">
                  Terms of Service
                </p>

                <h2 className="mt-1 truncate text-base font-semibold">
                  Terms &amp; Conditions Editor
                </h2>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleConsoleData}
                  className="flex shrink-0 items-center gap-1.5 rounded-lg border border-border/80 bg-background px-3 py-2 text-xs font-medium text-foreground transition hover:bg-muted cursor-pointer"
                  title="Inspect clean terms payload sent to backend API in browser console (F12)"
                >
                  <Terminal className="h-3.5 w-3.5 text-primary" />
                  Console Data
                </button>

                <button
                  type="button"
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex shrink-0 items-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-medium text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                >
                  {isSaving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  Save Changes
                </button>
              </div>
            </div>
          </div>

          {/* =================================================
              SECTIONS — Continuous divide-y accordion layout
              Exact match with Journey & Location
          ================================================= */}
          <div className="flex-1 divide-y divide-border/60">
            {/* 01. Publication Dates & Metadata */}
            <FormSection
              title="Publication Dates & Metadata"
              sectionNumber="01"
              active={Boolean(openSections.metadata)}
              onClick={() => toggleSection("metadata")}
            >
              <TermsOfServiceMetadata
                effectiveDate={effectiveDate}
                setEffectiveDate={setEffectiveDate}
                lastUpdated={lastUpdated}
                setLastUpdated={setLastUpdated}
              />
            </FormSection>

            {/* 02. Hero Banner & Multimedia */}
            <LegalHeroForm
              title="Hero Banner & Multimedia"
              sectionNumber="02"
              hero={hero}
              onChange={setHero}
              isOpen={Boolean(openSections.hero)}
              onToggle={() => toggleSection("hero")}
            />

            {/* 03. Document Structure & Content */}
            <FormSection
              title="Document Sections & Content"
              sectionNumber="03"
              active={Boolean(openSections.content)}
              onClick={() => toggleSection("content")}
            >
              <div className="flex flex-col gap-4">
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
            </FormSection>
          </div>
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
