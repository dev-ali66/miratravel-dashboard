import { useState, useEffect } from "react"
import { useGetCmsBySlug } from "@/hooks/cms/useGetCmsBySlug"
import { useAddCms } from "@/hooks/cms/useAddCms"
import { DEFAULT_PARTS, type PolicyPart } from "./types"
import { PrivacyPolicyMetadata } from "./PrivacyPolicyMetadata"
import { PrivacyPolicyTabs } from "./PrivacyPolicyTabs"
import { PrivacyPolicyEditor } from "./PrivacyPolicyEditor"
import { PrivacyPolicyPreview } from "./PrivacyPolicyPreview"
import { PrivacyPolicySkeleton } from "./PrivacyPolicySkeleton"
import { UniversalEditorLayout } from "@/components/layout/UniversalEditorLayout"
import { Save, Loader2, ShieldCheck, Terminal } from "lucide-react"
import { toast } from "sonner"

export default function PrivacyPolicyPage() {
  const { mutate: saveSection, isPending: isSaving } = useAddCms()
  const { data: privacyPolicyResponse, isLoading } =
    useGetCmsBySlug("privacy-policy")

  const [effectiveDate, setEffectiveDate] = useState<string>("01.08.2025")
  const [lastUpdated, setLastUpdated] = useState<string>("01.08.2025")
  const [parts, setParts] = useState<PolicyPart[]>(DEFAULT_PARTS)
  const [activeTab, setActiveTab] = useState<string>("")

  useEffect(() => {
    const fetchedData = privacyPolicyResponse?.data?.data
    if (fetchedData) {
      if (fetchedData.effectiveDate) setEffectiveDate(fetchedData.effectiveDate)
      if (fetchedData.lastUpdated) setLastUpdated(fetchedData.lastUpdated)

      if (Array.isArray(fetchedData.parts) && fetchedData.parts.length > 0) {
        setParts(fetchedData.parts)
        if (!activeTab || !fetchedData.parts.some((p: PolicyPart) => p.id === activeTab)) {
          setActiveTab(fetchedData.parts[0].id)
        }
      } else if (typeof fetchedData.content === "string" && fetchedData.content) {
        const initialPart: PolicyPart = {
          id: "part-1",
          tabTitle: "Overview",
          fullTitle: "Privacy Policy Overview",
          content: fetchedData.content,
        }
        setParts([initialPart])
        setActiveTab("part-1")
      }
    }
  }, [privacyPolicyResponse])

  const handleAddPart = () => {
    const newId = `part-${Date.now()}`
    const newPartNumber = parts.length + 1
    const newPart: PolicyPart = {
      id: newId,
      tabTitle: `Part ${newPartNumber}`,
      fullTitle: `${newPartNumber}. New Privacy Section`,
      content: "<p>Write section content here...</p>",
    }
    setParts((prev) => [...prev, newPart])
    setActiveTab(newId)
  }

  const handleDeletePart = (id: string) => {
    setParts((prev) => {
      const filtered = prev.filter((p) => p.id !== id)
      if (activeTab === id) {
        setActiveTab(filtered.length > 0 ? filtered[0].id : "")
      }
      return filtered
    })
  }

  const handleMovePart = (index: number, direction: "up" | "down") => {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === parts.length - 1)
    ) {
      return
    }
    const targetIndex = direction === "up" ? index - 1 : index + 1
    const newParts = [...parts]
    const temp = newParts[index]
    newParts[index] = newParts[targetIndex]
    newParts[targetIndex] = temp
    setParts(newParts)
  }

  const handleTitleChange = (field: "tabTitle" | "fullTitle", value: string) => {
    setParts((prev) =>
      prev.map((p) => (p.id === activeTab ? { ...p, [field]: value } : p))
    )
  }

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
      title: "MIRA PRIVACY POLICY",
      effectiveDate,
      lastUpdated,
      parts,
      content: combinedContent,
    }

    console.log("🔒 [CLEAN CMS PRIVACY POLICY PAYLOAD]:", payloadData)
    toast.info("Privacy Policy payload logged to browser console (F12)")
  }

  const handleSave = () => {
    const combinedContent = parts
      .map((p) => `<h2>${p.fullTitle}</h2>${p.content}`)
      .join("<hr />")

    const payload = {
      title: "MIRA PRIVACY POLICY",
      effectiveDate,
      lastUpdated,
      parts,
      content: combinedContent,
    }

    // Save under both "privacy-policy" and "privacy" slugs
    saveSection({
      slug: "privacy-policy",
      data: payload,
    })

    saveSection({
      slug: "privacy",
      data: payload,
    })
  }

  const currentPartIndex = parts.findIndex((p) => p.id === activeTab)
  const currentPart = currentPartIndex !== -1 ? parts[currentPartIndex] : parts[0]

  if (isLoading) {
    return <PrivacyPolicySkeleton />
  }

  return (
    <UniversalEditorLayout
      backToUrl="/"
      backToLabel="Back to Dashboard"
      icon={ShieldCheck}
      iconColor="text-[#6E7F5B]"
      title="Privacy Policy Editor"
      useWorkspaceScale={true}
      sidebarContent={
        <div className="space-y-6 p-4 md:p-5">
          {/* Header & Action Buttons (Console Data, Add Section, Save Changes) */}
          <div className="flex flex-col gap-3 border-b border-border/60 pb-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-base font-bold tracking-tight text-foreground">
                MIRA PRIVACY POLICY
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
                title="Inspect clean privacy payload sent to backend API in browser console (F12)"
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

          <PrivacyPolicyMetadata
            effectiveDate={effectiveDate}
            setEffectiveDate={setEffectiveDate}
            lastUpdated={lastUpdated}
            setLastUpdated={setLastUpdated}
          />

          <PrivacyPolicyTabs
            parts={parts}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onAddPart={handleAddPart}
          />

          <PrivacyPolicyEditor
            currentPart={currentPart}
            activeTab={activeTab}
            partIndex={currentPartIndex !== -1 ? currentPartIndex : 0}
            totalParts={parts.length}
            onContentChange={handleContentChange}
            onTitleChange={handleTitleChange}
            onDeletePart={handleDeletePart}
            onMovePart={handleMovePart}
            onAddPart={handleAddPart}
          />
        </div>
      }
      previewContent={
        <PrivacyPolicyPreview
          parts={parts}
          effectiveDate={effectiveDate}
          lastUpdated={lastUpdated}
        />
      }
    />
  )
}
