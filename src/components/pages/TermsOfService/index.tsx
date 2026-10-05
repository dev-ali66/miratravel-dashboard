import { useState, useEffect } from "react"
import { useGetCmsBySlug } from "@/hooks/cms/useGetCmsBySlug"
import { useAddCms } from "@/hooks/cms/useAddCms"
import { DEFAULT_TERMS_PARTS, type TermsPart } from "./types"
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
  const [parts, setParts] = useState<TermsPart[]>(DEFAULT_TERMS_PARTS)
  const [activeTab, setActiveTab] = useState<string>("")

  useEffect(() => {
    const fetchedData = termsResponse?.data?.data
    if (fetchedData) {
      if (fetchedData.effectiveDate) setEffectiveDate(fetchedData.effectiveDate)
      if (fetchedData.lastUpdated) setLastUpdated(fetchedData.lastUpdated)

      if (Array.isArray(fetchedData.parts) && fetchedData.parts.length > 0) {
        setParts(fetchedData.parts)
        if (!activeTab || !fetchedData.parts.some((p: any) => p.id === activeTab)) {
          setActiveTab(fetchedData.parts[0].id)
        }
      }
    }
  }, [termsResponse])

  // Handle adding a new dynamic section
  const handleAddSection = () => {
    const nextNum = parts.length + 1
    const newId = "section_" + Date.now()
    const newPart: TermsPart = {
      id: newId,
      tabTitle: `Part ${nextNum}`,
      fullTitle: `${nextNum}. New Terms Section`,
      content: "<p>Write your section content here...</p>",
    }
    setParts((prev) => [...prev, newPart])
    setActiveTab(newId)
    toast.success(`Section "Part ${nextNum}" added.`)
  }

  // Handle deleting current section
  const handleRemoveSection = () => {
    if (!activeTab) return
    setParts((prev) => {
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
    const idx = parts.findIndex((p) => p.id === activeTab)
    if (idx === -1) return
    const targetIdx = direction === "up" ? idx - 1 : idx + 1
    if (targetIdx < 0 || targetIdx >= parts.length) return

    const nextParts = [...parts]
    const [moved] = nextParts.splice(idx, 1)
    nextParts.splice(targetIdx, 0, moved)
    setParts(nextParts)
  }

  // Handle updating section titles
  const handleUpdatePartTitle = (tabTitle: string, fullTitle: string) => {
    setParts((prev) =>
      prev.map((p) => (p.id === activeTab ? { ...p, tabTitle, fullTitle } : p))
    )
  }

  // Handle updating rich text content
  const handleContentChange = (newContent: string) => {
    setParts((prev) =>
      prev.map((p) => (p.id === activeTab ? { ...p, content: newContent } : p))
    )
  }

  // Inspect payload in browser console (F12)
  const handleConsoleData = () => {
    const combinedContent = parts
      .map((p) => `<h2>${p.fullTitle}</h2>${p.content}`)
      .join("<hr />")

    const payloadData = {
      title: "MIRA TERMS & CONDITIONS",
      effectiveDate,
      lastUpdated,
      parts,
      content: combinedContent,
    }

    console.log("📜 [CLEAN CMS TERMS & CONDITIONS PAYLOAD]:", payloadData)
    toast.info("Terms & Conditions payload logged to browser console (F12)")
  }

  // Handle saving to database
  const handleSave = () => {
    const combinedContent = parts
      .map((p) => `<h2>${p.fullTitle}</h2>${p.content}`)
      .join("<hr />")

    const payloadData = {
      title: "MIRA TERMS & CONDITIONS",
      effectiveDate,
      lastUpdated,
      parts,
      content: combinedContent,
    }

    // Save for terms-of-service
    saveSection({
      slug: "terms-of-service",
      data: payloadData,
    })

    // Also save for terms slug so both endpoints work
    saveSection({
      slug: "terms",
      data: payloadData,
    })
  }

  const currentPart = parts.find((p) => p.id === activeTab)
  const currentPartIndex = parts.findIndex((p) => p.id === activeTab)

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
          {/* Header & Action Buttons (Console Data, Add Section, Save Changes) */}
          <div className="flex flex-col gap-3 border-b border-border/60 pb-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-base font-bold tracking-tight text-foreground">
                MIRA TERMS &amp; CONDITIONS
              </h2>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Configure dates, document structure and rich text content below.
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

          {parts.length > 0 && (
            <TermsOfServiceTabs
              parts={parts}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              onAddSection={handleAddSection}
            />
          )}

          <TermsOfServiceEditor
            currentPart={currentPart}
            activeTab={activeTab}
            partIndex={currentPartIndex >= 0 ? currentPartIndex : 0}
            totalParts={parts.length}
            onContentChange={handleContentChange}
            onUpdatePartTitle={handleUpdatePartTitle}
            onMovePart={handleMoveSection}
            onRemovePart={handleRemoveSection}
            onAddSection={handleAddSection}
          />
        </div>
      }
      previewContent={
        <TermsOfServicePreview
          parts={parts}
          effectiveDate={effectiveDate}
          lastUpdated={lastUpdated}
        />
      }
    />
  )
}

