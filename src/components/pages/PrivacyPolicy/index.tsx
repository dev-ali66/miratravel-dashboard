import { useState, useEffect } from "react"
import { useGetCmsBySlug } from "@/hooks/cms/useGetCmsBySlug"
import { useAddCms } from "@/hooks/cms/useAddCms"
import { DEFAULT_PARTS, type PolicyPart } from "./types"
import { PrivacyPolicyHeader } from "./PrivacyPolicyHeader"
import { PrivacyPolicyMetadata } from "./PrivacyPolicyMetadata"
import { PrivacyPolicyTabs } from "./PrivacyPolicyTabs"
import { PrivacyPolicyEditor } from "./PrivacyPolicyEditor"
import { PrivacyPolicySkeleton } from "./PrivacyPolicySkeleton"

export default function PrivacyPolicyPage() {
  const { mutate: saveSection, isPending: isSaving } = useAddCms()
  const { data: privacyPolicyResponse, isLoading } =
    useGetCmsBySlug("privacy-policy")

  const [effectiveDate, setEffectiveDate] = useState<string>("22.07.2026")
  const [lastUpdated, setLastUpdated] = useState<string>("22.07.2026")
  const [parts, setParts] = useState<PolicyPart[]>(DEFAULT_PARTS)
  const [activeTab, setActiveTab] = useState<string>("part-1")

  useEffect(() => {
    const fetchedData = privacyPolicyResponse?.data?.data
    if (fetchedData) {
      if (fetchedData.effectiveDate) setEffectiveDate(fetchedData.effectiveDate)
      if (fetchedData.lastUpdated) setLastUpdated(fetchedData.lastUpdated)

      if (Array.isArray(fetchedData.parts) && fetchedData.parts.length > 0) {
        setParts(
          DEFAULT_PARTS.map((defaultPart) => {
            const found = fetchedData.parts.find(
              (p: any) =>
                p.id === defaultPart.id || p.tabTitle === defaultPart.tabTitle
            )
            return found
              ? {
                  ...defaultPart,
                  content: found.content || "",
                  fullTitle: found.fullTitle || defaultPart.fullTitle,
                }
              : defaultPart
          })
        )
      } else if (typeof fetchedData.content === "string") {
        // Backward compatibility if only string content was saved previously
        setParts((prev) => {
          const newParts = [...prev]
          newParts[0] = { ...newParts[0], content: fetchedData.content }
          return newParts
        })
      }
    }
  }, [privacyPolicyResponse])

  const handleContentChange = (newContent: string) => {
    setParts((prev) =>
      prev.map((p) => (p.id === activeTab ? { ...p, content: newContent } : p))
    )
  }

  const handleSave = () => {
    const combinedContent = parts
      .map((p) => `<h2>${p.fullTitle}</h2>${p.content}`)
      .join("<hr />")

    saveSection({
      slug: "privacy-policy",
      data: {
        title: "GETSURF PRIVACY POLICY",
        effectiveDate,
        lastUpdated,
        parts,
        content: combinedContent,
      },
    })
  }

  const currentPart = parts.find((p) => p.id === activeTab) || parts[0]

  if (isLoading) {
    return <PrivacyPolicySkeleton />
  }

  return (
    <div className="mx-auto w-full max-w-5xl animate-in pt-6 pb-12 duration-700 fade-in slide-in-from-bottom-4">
      <PrivacyPolicyHeader onSave={handleSave} isSaving={isSaving} />

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
      />

      <PrivacyPolicyEditor
        currentPart={currentPart}
        activeTab={activeTab}
        onContentChange={handleContentChange}
      />
    </div>
  )
}
