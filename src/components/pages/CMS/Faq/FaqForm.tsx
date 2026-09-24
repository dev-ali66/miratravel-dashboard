import MiraLoader from "@/components/shared/MiraLoader"
import { useState, useEffect } from "react"
import { Loader2, Save, Terminal } from "lucide-react"

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
      {/* Header */}
      <div className="sticky top-0 z-20 border-b border-border/60 bg-card/95 px-5 py-4 backdrop-blur">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[10px] font-medium tracking-[0.2em] text-muted-foreground uppercase">
              CMS Page
            </p>
            <h2 className="mt-1 truncate text-base font-semibold">
              Edit FAQ Page
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                console.log("📍 [CLEAN FAQ API PAYLOAD SENT TO BACKEND]:", normalizedPage)
              }}
              className="flex shrink-0 items-center gap-1.5 rounded-lg border border-border/80 bg-background px-3 py-2 text-xs font-medium text-foreground transition hover:bg-muted cursor-pointer"
              title="Inspect clean payload in console (F12)"
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
