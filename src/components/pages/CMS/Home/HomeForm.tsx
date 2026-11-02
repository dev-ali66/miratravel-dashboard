import MiraLoader from "@/components/shared/MiraLoader"
import { useState, useEffect } from "react"
import { EditorFormHeader } from "@/components/shared/EditorFormHeader"

import { useCmsPage } from "../shared/useCmsPage"
import { SeoMetadataForm } from "./sections/seo"

import type { HomePageData } from "./homeTypes"
import { homeSectionOrder, homeSectionRegistry, type HomeSectionKey } from "./config/homeSections"

export const HomeForm = () => {
  const { page, setPage, isLoading, isSaving, save } = useCmsPage<HomePageData>(
    "home",
    "Home"
  )

  const data = page?.data ?? {}

  /*
   * ============================================================
   * COLLAPSED SECTIONS ACCORDION STATE
   * ============================================================
   */
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

  /*
   * ============================================================
   * HELPERS
   * ============================================================
   */
  const updateSectionByKey = (key: HomeSectionKey, patch: Record<string, any>) => {
    setPage((current: any) => {
      const currentData = (current?.data ?? {}) as Record<string, any>
      const currentSec = currentData[key] ?? {}
      const updatedSec = {
        ...currentSec,
        ...patch,
      }

      let updatedSections = currentData.sections
      if (Array.isArray(updatedSections)) {
        updatedSections = updatedSections.map((s: any) => {
          if (s.key === key || s.key === key.replace(/_/g, "-") || s.type === key) {
            return {
              ...s,
              ...patch,
            }
          }
          return s
        })
      }

      return {
        ...current,
        name: current?.name ?? "Home",
        metadata: {
          ...(current?.metadata ?? {}),
        },
        data: {
          ...currentData,
          page: "home",
          [key]: updatedSec,
          ...(key === "custom_journey_cta" ? { cta: updatedSec } : {}),
          ...(Array.isArray(currentData.sections) ? { sections: updatedSections } : {}),
        },
      }
    })
  }

  /*
   * ============================================================
   * LOADING & ERROR STATES
   * ============================================================
   */
  if (isLoading) {
    return (
      <MiraLoader text="Loading Home editor data..." className="min-h-[400px] py-16" />
    )
  }

  return (
    <div className="flex min-h-full flex-col">
      {/* =================================================
                HEADER (Universal Sticky Header)
            ================================================= */}
      <EditorFormHeader
        eyebrow="CMS Page"
        title="Edit Home Page"
        saveLabel="Save"
        isSaving={isSaving}
        onSave={save}
        onConsoleData={() => {
          console.log("📍 [CLEAN HOME API PAYLOAD SENT TO BACKEND]:", page)
        }}
        consoleDataTitle="Inspect clean Home payload sent to backend API in browser console (F12)"
      />

      {/* =================================================
                FLUSH ACCORDION SECTIONS
            ================================================= */}
      <div className="flex-1 divide-y divide-border/60">
        {homeSectionOrder.map((key, index) => {
          const entry = homeSectionRegistry[key]
          const SectionForm = entry?.form

          if (!SectionForm) return null

          const sectionObj =
            (data as any)?.[key] ??
            (data as any)?.[key.replace(/-/g, "_")] ??
            {}

          const sectionNumber = String(index + 1).padStart(2, "0")

          return (
            <div key={key} data-section={key} className="transition-all">
              <SectionForm
                section={sectionObj}
                index={index}
                updateSection={(idxOrPatch: any, maybePatch?: any) => {
                  const patch = typeof idxOrPatch === "object" ? idxOrPatch : maybePatch
                  if (patch) updateSectionByKey(key, patch)
                }}
                updateSectionContent={(idxOrPatch: any, maybePatch?: any) => {
                  const patch = typeof idxOrPatch === "object" ? idxOrPatch : maybePatch
                  if (patch) updateSectionByKey(key, patch)
                }}
                updateSectionImages={(idxOrImgs: any, maybeImgs?: any) => {
                  const imgs = Array.isArray(idxOrImgs) ? idxOrImgs : maybeImgs
                  if (imgs) updateSectionByKey(key, { bgImages: imgs })
                }}
                updateSectionVideos={(idxOrVids: any, maybeVids?: any) => {
                  const vids = Array.isArray(idxOrVids) ? idxOrVids : maybeVids
                  if (vids) updateSectionByKey(key, { bgVideos: vids })
                }}
                updateSectionButtons={(idxOrBtns: any, maybeBtns?: any) => {
                  const btns = Array.isArray(idxOrBtns) ? idxOrBtns : maybeBtns
                  if (btns) updateSectionByKey(key, { buttons: btns })
                }}
                openSections={openSections}
                toggleSection={toggleSection}
                sectionNumber={sectionNumber}
              />
            </div>
          )
        })}

        {/* SEO SECTION */}
        <div data-section="seo" className="transition-all">
          <SeoMetadataForm
            data={page ?? { name: "Home" }}
            setData={setPage as any}
            openSections={openSections}
            toggleSection={toggleSection}
            sectionNumber={String(homeSectionOrder.length + 1).padStart(2, "0")}
          />
        </div>
      </div>
    </div>
  )
}
