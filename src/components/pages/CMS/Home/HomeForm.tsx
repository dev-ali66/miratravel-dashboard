import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"

import { useCmsPage } from "../shared/useCmsPage"
import { SaveBar } from "../shared/SaveBar"
import { SeoForm } from "../shared/SeoForm"
import { CollapsibleSectionCard } from "../shared/CollapsibleSectionCard"

import type {
  HomeButton,
  HomeImage,
  HomePageData,
  HomeSection,
  HomeVideo,
} from "./homeTypes"

import { homeSectionOrder, homeSectionRegistry } from "./config/homeSections"

const getHomeSectionEntry = (key: string) => {
  return homeSectionRegistry[key as keyof typeof homeSectionRegistry]
}

export const HomeForm = () => {
  const { page, setPage, isLoading, isSaving, save } = useCmsPage<HomePageData>(
    "home",
    "Home"
  )

  const data = page?.data
  const sections = data?.sections ?? []

  /*
   * ============================================================
   * COLLAPSED SECTIONS
   * ============================================================
   */

  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    hero: true,
  })

  const toggleSection = (key: string) => {
    setOpenSections((current) => ({
      ...current,
      [key]: !current[key],
    }))
  }

  /*
   * ============================================================
   * HELPERS
   * ============================================================
   */

  const updateData = (patch: Partial<NonNullable<HomePageData["data"]>>) => {
    setPage({
      ...page,
      name: page?.name ?? "Home",

      metadata: {
        ...(page?.metadata ?? {}),
      },

      data: {
        ...(page?.data ?? {}),
        ...patch,
      },
    })
  }

  const updateSection = (index: number, patch: Partial<HomeSection>) => {
    const currentSections = data?.sections ?? []

    const updatedSections = currentSections.map((section, sectionIndex) =>
      sectionIndex === index
        ? {
            ...section,
            ...patch,
          }
        : section
    )

    updateData({
      sections: updatedSections,
    })
  }

  const updateSectionContent = (index: number, patch: Record<string, any>) => {
    const section = sections[index]

    updateSection(index, {
      content: {
        ...(section?.content as Record<string, any>),
        ...patch,
      } as HomeSection["content"],
    })
  }

  const updateSectionButtons = (index: number, buttons: HomeButton[]) => {
    updateSection(index, {
      buttons,
    })
  }

  const updateSectionImages = (index: number, images: HomeImage[]) => {
    updateSection(index, {
      bgImages: images,
    })
  }

  const updateSectionVideos = (index: number, videos: HomeVideo[]) => {
    updateSection(index, {
      bgVideos: videos,
    })
  }

  /*
   * ============================================================
   * LOADING
   * ============================================================
   */

  if (isLoading) {
    return (
      <div className="flex flex-col">
        <SaveBar
          title="Home"
          description="Manage homepage content, sections, theme and media."
          onSave={save}
          isSaving={isSaving}
          isLoading={isLoading}
        />

        <div className="flex items-center justify-center p-10">
          <p className="text-sm text-muted-foreground">Loading Home data...</p>
        </div>
      </div>
    )
  }

  /*
   * ============================================================
   * SECTION LABEL
   * ============================================================
   */

  const getSectionTitle = (section: HomeSection) => {
    const entry = getHomeSectionEntry(section.key)
    return entry?.label ?? section.key
  }

  /*
   * ============================================================
   * SECTION RENDERER
   * ============================================================
   */

  const renderSectionContent = (section: HomeSection, index: number) => {
    const entry = getHomeSectionEntry(section.key)

    if (!entry) {
      return (
        <div className="rounded-md border border-border/50 p-3">
          <p className="text-sm text-muted-foreground">
            No editor available for this section.
          </p>
        </div>
      )
    }

    const SectionForm = entry.form

    return (
      <SectionForm
        section={section}
        index={index}
        updateSection={updateSection}
        updateSectionContent={updateSectionContent}
        updateSectionImages={updateSectionImages}
        updateSectionVideos={updateSectionVideos}
        updateSectionButtons={updateSectionButtons}
      />
    )
  }

  /*
   * ============================================================
   * RENDER
   * ============================================================
   */

  const orderedSections = homeSectionOrder
    .map((key) => sections.find((section) => section.key === key))
    .filter(Boolean) as HomeSection[]

  return (
    <div className="flex flex-col">
      {/* SAVE BAR */}

      <SaveBar
        title="Home"
        description="Manage homepage content, sections, theme and media."
        onSave={save}
        isSaving={isSaving}
        isLoading={isLoading}
      />

      <div className="flex flex-col gap-6 p-4">
        {/* HOME SECTIONS */}

        <div className="flex flex-col gap-3">
          <div className="px-1">
            <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              Home Sections
            </p>

            <p className="mt-1 text-[11px] text-muted-foreground">
              Click a section to expand or collapse its settings.
            </p>
          </div>

          {orderedSections.map((section, index) => {
            const isOpen = openSections[section.key] ?? false

            const actualIndex = sections.findIndex(
              (item) => item.key === section.key
            )

            return (
              <div
                key={`${section.key}-${index}`}
                data-section={section.key}
                className="overflow-hidden rounded-lg border border-border/60 transition-all"
              >
                {/* HEADER */}

                <button
                  type="button"
                  onClick={() => toggleSection(section.key)}
                  className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/40"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="flex h-7 min-w-7 items-center justify-center rounded-md bg-muted px-2 text-[10px] font-semibold text-muted-foreground">
                      {String(section.order ?? index + 1).padStart(2, "0")}
                    </span>

                    <div className="min-w-0">
                      <p className="text-sm font-semibold">
                        {getSectionTitle(section)}
                      </p>

                      <p className="truncate text-[10px] text-muted-foreground">
                        {section.type}
                      </p>
                    </div>
                  </div>

                  {isOpen ? (
                    <ChevronUp className="h-4 w-4 shrink-0 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
                  )}
                </button>

                {/* CONTENT */}

                {isOpen && (
                  <div className="border-t border-border/60 p-4">
                    {renderSectionContent(section, actualIndex)}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <CollapsibleSectionCard
          title="SEO Metadata"
          meta="seo"
          indexLabel="SEO"
          isOpen={openSections.seo ?? false}
          onToggle={() => toggleSection("seo")}
        >
          <SeoForm
            metadata={page?.metadata}
            onChange={(metadata) =>
              setPage({
                ...page,
                name: page?.name ?? "Home",
                metadata: {
                  ...metadata,
                  title: metadata.title ?? "",
                  description: metadata.description ?? "",
                },
                data: {
                  ...(page?.data ?? {}),
                },
              })
            }
          />
        </CollapsibleSectionCard>
      </div>
    </div>
  )
}
