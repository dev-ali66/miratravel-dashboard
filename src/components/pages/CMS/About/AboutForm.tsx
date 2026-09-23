import MiraLoader from "@/components/shared/MiraLoader"
import { useState, useEffect } from "react"
import { Loader2, Save, Terminal } from "lucide-react"

import { useCmsPage } from "../shared/useCmsPage"
import { HeroForm } from "./sections/hero/HeroForm"
import { PhilosophyForm } from "./sections/philosophy/PhilosophyForm"
import { ApproachForm } from "./sections/approach/ApproachForm"
import { RegionalKnowledgeForm } from "./sections/regional-knowledge/RegionalKnowledgeForm"
import { PeopleForm } from "./sections/people/PeopleForm"
import { StandardForm } from "./sections/standard/StandardForm"
import { StayForm } from "./sections/stay/StayForm"
import { CtaForm } from "./sections/cta/CtaForm"
import { SeoMetadataForm } from "./sections/seo/SeoMetadataForm"

import { normalizeAboutPayload } from "./config/normalizeAboutPayload"

export function AboutForm() {
  const { page, setPage, isLoading, isSaving, save } = useCmsPage<any>(
    "about-us",
    "About Us"
  )

  const normalizedPage = normalizeAboutPayload(page)
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
      const currentNorm = normalizeAboutPayload(current)
      const currentData = (currentNorm?.data || {}) as Record<string, any>
      const currentSec = currentData[key] || {}
      const updatedSec = { ...currentSec, ...patch }

      return {
        ...currentNorm,
        data: {
          ...currentData,
          page: "about-us",
          [key]: updatedSec,
        },
      }
    })
  }

  if (isLoading) {
    return (
      <MiraLoader text="Loading About Us editor data..." className="min-h-[400px] py-16" />
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
              Edit About Us Page
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                console.log("📍 [CLEAN ABOUT US API PAYLOAD SENT TO BACKEND]:", normalizedPage)
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
        {/* 1. Hero */}
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

        {/* 2. Philosophy */}
        <div data-section="philosophy">
          <PhilosophyForm
            section={data.philosophy}
            index={1}
            updateSection={(_idx, patch) => updateSectionByKey("philosophy", patch)}
            openSections={openSections}
            toggleSection={toggleSection}
            sectionNumber={2}
          />
        </div>

        {/* 3. Approach */}
        <div data-section="approach">
          <ApproachForm
            section={data.approach}
            index={2}
            updateSection={(_idx, patch) => updateSectionByKey("approach", patch)}
            openSections={openSections}
            toggleSection={toggleSection}
            sectionNumber={3}
          />
        </div>

        {/* 4. Regional Knowledge */}
        <div data-section="regional_knowledge">
          <RegionalKnowledgeForm
            section={data.regional_knowledge || data.regionalKnowledge}
            index={3}
            updateSection={(_idx, patch) =>
              updateSectionByKey("regional_knowledge", patch)
            }
            openSections={openSections}
            toggleSection={toggleSection}
            sectionNumber={4}
          />
        </div>

        {/* 5. People */}
        <div data-section="people">
          <PeopleForm
            section={data.people}
            index={4}
            updateSection={(_idx, patch) => updateSectionByKey("people", patch)}
            openSections={openSections}
            toggleSection={toggleSection}
            sectionNumber={5}
          />
        </div>

        {/* 6. Standard */}
        <div data-section="standard">
          <StandardForm
            section={data.standard}
            index={5}
            updateSection={(_idx, patch) => updateSectionByKey("standard", patch)}
            openSections={openSections}
            toggleSection={toggleSection}
            sectionNumber={6}
          />
        </div>

        {/* 7. Stay */}
        <div data-section="stay">
          <StayForm
            section={data.stay}
            index={6}
            updateSection={(_idx, patch) => updateSectionByKey("stay", patch)}
            openSections={openSections}
            toggleSection={toggleSection}
            sectionNumber={7}
          />
        </div>

        {/* 8. CTA */}
        <div data-section="cta">
          <CtaForm
            section={data.cta}
            index={7}
            updateSection={(_idx, patch) => updateSectionByKey("cta", patch)}
            openSections={openSections}
            toggleSection={toggleSection}
            sectionNumber={8}
          />
        </div>

        {/* 9. SEO & Metadata */}
        <div data-section="seo">
          <SeoMetadataForm
            data={page ?? { name: "About Us" }}
            setData={setPage as any}
            openSections={openSections}
            toggleSection={toggleSection}
            sectionNumber={9}
          />
        </div>
      </div>
    </div>
  )
}

export default AboutForm
