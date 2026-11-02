import MiraLoader from "@/components/shared/MiraLoader"
import { useState, useEffect } from "react"
import { EditorFormHeader } from "@/components/shared/EditorFormHeader"

import { useCmsPage } from "../shared/useCmsPage"
import { HeroForm } from "./sections/hero/HeroForm"
import { FaqListForm } from "./sections/faq-list/FaqListForm"
import { FaqCtaForm } from "./sections/cta/FaqCtaForm"
import { SeoMetadataForm } from "./sections/seo/SeoMetadataForm"

import { normalizeFaqPayload } from "./config/normalizeFaqPayload"

export function FaqForm() {
  const { page, setPage, isLoading, isSaving, save } = useCmsPage<any>(
    "faq",
    "FAQ"
  )

  const normalizedPage = normalizeFaqPayload(page)
  const data = normalizedPage?.data || {}

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

  const updateSectionByKey = (key: string, patch: Record<string, any>) => {
    setPage((current: any) => {
      const currentNorm = normalizeFaqPayload(current)
      const currentData = (currentNorm?.data || {}) as Record<string, any>
      const currentSec = currentData[key] || {}
      const updatedSec = { ...currentSec, ...patch }

      return {
        ...currentNorm,
        data: {
          ...currentData,
          page: "faq",
          [key]: updatedSec,
        },
      }
    })
  }

  if (isLoading) {
    return (
      <MiraLoader text="Loading FAQ editor data..." className="min-h-[400px] py-16" />
    )
  }

  return (
    <div className="flex min-h-full flex-col">
      {/* Header (Universal Sticky Header) */}
      <EditorFormHeader
        eyebrow="CMS Page"
        title="Edit FAQ Page"
        saveLabel="Save"
        isSaving={isSaving}
        onSave={save}
        onConsoleData={() => {
          console.log("📍 [CLEAN FAQ API PAYLOAD SENT TO BACKEND]:", normalizedPage)
        }}
        consoleDataTitle="Inspect clean payload in console (F12)"
      />

      {/* Accordion Sections */}
      <div className="flex-1 divide-y divide-border/60">
        {/* 1. Hero Header */}
        <div data-section="hero">
          <HeroForm
            section={data.hero}
            index={0}
            updateSection={(_idx, patch) => updateSectionByKey("hero", patch)}
            openSections={openSections}
            toggleSection={toggleSection}
            sectionNumber={1}
          />
        </div>

        {/* 2. FAQ List, Topics & Personal Advice */}
        <div data-section="faq_list">
          <FaqListForm
            section={data.faq_list}
            index={1}
            updateSection={(_idx, patch) => updateSectionByKey("faq_list", patch)}
            openSections={openSections}
            toggleSection={toggleSection}
            sectionNumber={2}
          />
        </div>

        {/* 3. A Note from Mira CTA */}
        <div data-section="cta">
          <FaqCtaForm
            section={data.cta}
            index={2}
            updateSection={(_idx, patch) => updateSectionByKey("cta", patch)}
            openSections={openSections}
            toggleSection={toggleSection}
            sectionNumber={3}
          />
        </div>

        {/* 4. SEO & Metadata */}
        <div data-section="seo">
          <SeoMetadataForm
            data={page ?? { name: "FAQ" }}
            setData={setPage as any}
            openSections={openSections}
            toggleSection={toggleSection}
            sectionNumber={4}
          />
        </div>
      </div>
    </div>
  )
}

export default FaqForm
