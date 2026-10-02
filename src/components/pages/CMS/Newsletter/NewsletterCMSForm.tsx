import MiraLoader from "@/components/shared/MiraLoader"
import { useState, useEffect } from "react"
import { Loader2, Save, Terminal } from "lucide-react"

import { useCmsPage } from "../shared/useCmsPage"
import { NewsletterCmsHeroForm } from "./sections/hero/NewsletterCmsHeroForm"
import { NewsletterCmsSeoMetadataForm } from "./sections/seo/NewsletterCmsSeoMetadataForm"

import { normalizeNewsletterCmsPayload } from "./config/normalizeNewsletterCmsPayload"

export function NewsletterCMSForm() {
  const { page, setPage, isLoading, isSaving, save } = useCmsPage<any>(
    "newsletter",
    "Newsletter CMS"
  )

  const normalizedPage = normalizeNewsletterCmsPayload(page)

  const [openSections, setOpenSections] = useState<Record<string, boolean>>({})

  const toggleSection = (key: string) => {
    setOpenSections((current) => {
      const isCurrentlyOpen = !!current[key]
      return isCurrentlyOpen ? {} : { [key]: true }
    })
  }

  useEffect(() => {
    const handleActiveSectionChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ sectionKey: string }>
      if (customEvent.detail?.sectionKey) {
        const key = customEvent.detail.sectionKey
        setOpenSections({ [key]: true })
      }
    }

    window.addEventListener("editor-active-section-change", handleActiveSectionChange)
    return () => {
      window.removeEventListener("editor-active-section-change", handleActiveSectionChange)
    }
  }, [])

  const updateField = (fieldPath: string, value: any) => {
    setPage((current: any) => {
      const currentNorm = normalizeNewsletterCmsPayload(current)
      const currentData = (currentNorm?.data || {}) as Record<string, any>

      const pathParts = fieldPath.split(".")
      if (pathParts.length === 1) {
        return {
          ...currentNorm,
          data: {
            ...currentData,
            page: "newsletter",
            [fieldPath]: value,
          },
        }
      }

      const [sectionKey, ...restPath] = pathParts
      const currentSection = (currentData[sectionKey] || {}) as Record<string, any>

      const updateDeep = (obj: any, keys: string[], val: any): any => {
        if (keys.length === 0) return val
        const [firstKey, ...subKeys] = keys
        const subObj = obj && typeof obj === "object" ? obj[firstKey] : {}
        return {
          ...obj,
          [firstKey]: updateDeep(subObj, subKeys, val),
        }
      }

      const updatedSection = updateDeep(currentSection, restPath, value)

      return {
        ...currentNorm,
        data: {
          ...currentData,
          page: "newsletter",
          [sectionKey]: updatedSection,
        },
      }
    })
  }

  if (isLoading) {
    return (
      <MiraLoader text="Loading Newsletter CMS editor data..." className="min-h-[400px] py-16" />
    )
  }

  return (
    <div className="flex min-h-full flex-col">
      {/* Header */}
      <div className="sticky top-0 z-20 border-b border-border/60 bg-card/95 px-5 py-4 backdrop-blur">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[10px] font-medium tracking-[0.2em] text-muted-foreground uppercase">
              CMS Page
            </p>
            <h2 className="mt-1 truncate text-base font-semibold text-foreground">
              Edit Newsletter CMS Page
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                console.log("📍 [CLEAN NEWSLETTER CMS API PAYLOAD SENT TO BACKEND]:", page)
              }}
              className="flex shrink-0 items-center gap-1.5 rounded-lg border border-border/80 bg-background px-3 py-2 text-xs font-medium text-foreground transition hover:bg-muted cursor-pointer"
              title="Inspect clean Newsletter CMS payload sent to backend API in browser console (F12)"
            >
              <Terminal className="h-3.5 w-3.5 text-primary" />
              Console Data
            </button>

            <button
              type="button"
              onClick={save}
              disabled={isSaving}
              className="flex shrink-0 items-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-medium text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
            >
              {isSaving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Save
            </button>
          </div>
        </div>
      </div>

      {/* Accordion Sections Form */}
      <div className="flex-1 space-y-4 p-5">
        <NewsletterCmsHeroForm
          draft={normalizedPage}
          updateField={updateField}
          openSections={openSections}
          toggleSection={toggleSection}
          sectionNumber="01"
        />

        <NewsletterCmsSeoMetadataForm
          draft={normalizedPage}
          updateField={updateField}
          openSections={openSections}
          toggleSection={toggleSection}
          sectionNumber="02"
        />
      </div>
    </div>
  )
}

export default NewsletterCMSForm
