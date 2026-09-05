import { useState, useEffect } from "react"
import { useGetCmsBySlug } from "@/hooks/cms/useGetCmsBySlug"
import { useAddCms } from "@/hooks/cms/useAddCms"
import { DEFAULT_TERMS_PARTS, type TermsPart } from "./types"
import { TermsOfServiceHeader } from "./TermsOfServiceHeader"
import { TermsOfServiceMetadata } from "./TermsOfServiceMetadata"
import { TermsOfServiceTabs } from "./TermsOfServiceTabs"
import { TermsOfServiceEditor } from "./TermsOfServiceEditor"
import { TermsOfServiceSkeleton } from "./TermsOfServiceSkeleton"

export default function TermsOfServicePage() {
  const { mutate: saveSection, isPending: isSaving } = useAddCms()
  const { data: termsResponse, isLoading } = useGetCmsBySlug("terms-of-service")

  const [effectiveDate, setEffectiveDate] = useState<string>("22.07.2026")
  const [lastUpdated, setLastUpdated] = useState<string>("22.07.2026")
  const [parts, setParts] = useState<TermsPart[]>(DEFAULT_TERMS_PARTS)
  const [activeTab, setActiveTab] = useState<string>("part-1")

  useEffect(() => {
    const fetchedData = termsResponse?.data?.data
    if (fetchedData) {
      if (fetchedData.effectiveDate) setEffectiveDate(fetchedData.effectiveDate)
      if (fetchedData.lastUpdated) setLastUpdated(fetchedData.lastUpdated)

      if (Array.isArray(fetchedData.parts) && fetchedData.parts.length > 0) {
        setParts(
          DEFAULT_TERMS_PARTS.map((defaultPart) => {
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
        setParts((prev) => {
          const newParts = [...prev]
          newParts[0] = { ...newParts[0], content: fetchedData.content }
          return newParts
        })
      }
    }
  }, [termsResponse])

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
      slug: "terms-of-service",
      data: {
        title: "GETSURF TERMS OF SERVICE",
        effectiveDate,
        lastUpdated,
        parts,
        content: combinedContent,
      },
    })
  }

  const currentPart = parts.find((p) => p.id === activeTab) || parts[0]

  if (isLoading) {
    return <TermsOfServiceSkeleton />
  }

  return (
    <div className="mx-auto w-full max-w-5xl animate-in pt-6 pb-12 duration-700 fade-in slide-in-from-bottom-4">
      <TermsOfServiceHeader onSave={handleSave} isSaving={isSaving} />

      <TermsOfServiceMetadata
        effectiveDate={effectiveDate}
        setEffectiveDate={setEffectiveDate}
        lastUpdated={lastUpdated}
        setLastUpdated={setLastUpdated}
      />

      <TermsOfServiceTabs
        parts={parts}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <TermsOfServiceEditor
        currentPart={currentPart}
        activeTab={activeTab}
        onContentChange={handleContentChange}
      />
    </div>
  )
}
