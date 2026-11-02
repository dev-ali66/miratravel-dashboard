import MiraLoader from "@/components/shared/MiraLoader"
import { useState, useEffect } from "react"
import { EditorFormHeader } from "@/components/shared/EditorFormHeader"

import { useCmsPage } from "../shared/useCmsPage"
import { SubscribeForm } from "./sections/subscribe/SubscribeForm"
import { UnsubscribeForm } from "./sections/unsubscribe/UnsubscribeForm"
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
      {/* Header (Universal Sticky Header) */}
      <EditorFormHeader
        eyebrow="CMS Page"
        title="Edit Newsletter CMS Page"
        saveLabel="Save"
        isSaving={isSaving}
        onSave={save}
        onConsoleData={() => {
          console.log("📍 [CLEAN NEWSLETTER CMS API PAYLOAD SENT TO BACKEND]:", page)
        }}
        consoleDataTitle="Inspect clean Newsletter CMS payload sent to backend API in browser console (F12)"
      />

      {/* Accordion Sections Form */}
      <div className="flex-1 divide-y divide-border/60">
        <SubscribeForm
          draft={normalizedPage}
          updateField={updateField}
          openSections={openSections}
          toggleSection={toggleSection}
          sectionNumber="01"
        />

        <UnsubscribeForm
          draft={normalizedPage}
          updateField={updateField}
          openSections={openSections}
          toggleSection={toggleSection}
          sectionNumber="02"
        />

        <NewsletterCmsSeoMetadataForm
          draft={normalizedPage}
          updateField={updateField}
          openSections={openSections}
          toggleSection={toggleSection}
          sectionNumber="03"
        />
      </div>
    </div>
  )
}

export default NewsletterCMSForm
