import { useState } from "react"
import { Loader2, Save, Terminal } from "lucide-react"

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
      <div className="flex min-h-[400px] flex-col items-center justify-center p-10">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        <p className="mt-2 text-xs text-muted-foreground">Loading Home editor data...</p>
      </div>
    )
  }

  return (
    <div className="flex min-h-full flex-col">
      {/* =================================================
                HEADER (Sticky top bar matching Location)
            ================================================= */}
      <div className="sticky top-0 z-20 border-b border-border/60 bg-card/95 px-5 py-4 backdrop-blur">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[10px] font-medium tracking-[0.2em] text-muted-foreground uppercase">
              CMS Page
            </p>
            <h2 className="mt-1 truncate text-base font-semibold">
              Edit Home Page
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                console.log("📍 [CLEAN HOME API PAYLOAD SENT TO BACKEND]:", page)
              }}
              className="flex shrink-0 items-center gap-1.5 rounded-lg border border-border/80 bg-background px-3 py-2 text-xs font-medium text-foreground transition hover:bg-muted cursor-pointer"
              title="Inspect clean Home payload sent to backend API in browser console (F12)"
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
