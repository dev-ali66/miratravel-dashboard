import { useState } from "react"

import { useCmsPage } from "../shared/useCmsPage"
import { SaveBar } from "../shared/SaveBar"
import { CollapsibleSectionCard } from "../shared/CollapsibleSectionCard"
import { SeoForm } from "../shared/SeoForm"
import {
  navbarSectionOrder,
  navbarSectionRegistry,
} from "./config/navbarSections"
import type { NavbarPageData } from "./navbarTypes"
import type { NavbarFormSectionContext } from "./shared/form/sectionTypes"

export const NavbarForm = () => {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    [navbarSectionOrder[0] ?? "brand"]: true,
    seo: false,
  })

  const toggleSection = (key: string) => {
    setOpenSections((current) => ({
      ...current,
      [key]: !current[key],
    }))
  }

  const { page, setPage, isLoading, isSaving, save } =
    useCmsPage<NavbarPageData>("navbar", "Navbar")

  if (isLoading || !page) {
    return (
      <div className="flex flex-col">
        <SaveBar
          title="Navbar"
          description="Manage the site-wide navbar branding and theme."
          onSave={save}
          isSaving={isSaving}
          isLoading={isLoading}
        />

        <div className="flex min-h-[300px] items-center justify-center">
          <p className="text-sm text-muted-foreground">Loading navbar...</p>
        </div>
      </div>
    )
  }

  const updateTheme = (patch: Partial<NavbarPageData["data"]["theme"]>) => {
    setPage({
      ...page,
      data: {
        ...page.data,
        theme: {
          ...page.data.theme,
          ...patch,
        },
      },
    })
  }

  const updateBrand = (
    patch: Partial<NavbarPageData["data"]["content"]["brand"]>
  ) => {
    setPage({
      ...page,
      data: {
        ...page.data,
        content: {
          ...page.data.content,
          brand: {
            ...page.data.content.brand,
            ...patch,
          },
        },
      },
    })
  }

  const sectionContext: NavbarFormSectionContext = {
    theme: page.data.theme,
    content: page.data.content,
    updateTheme,
    updateBrand,
  }

  return (
    <div className="flex flex-col">
      <SaveBar
        title="Navbar"
        description="Manage the site-wide navbar branding and theme."
        onSave={save}
        isSaving={isSaving}
        isLoading={isLoading}
      />

      <div className="flex flex-col gap-6 p-4">
        <div className="flex flex-col gap-3">
          <div className="px-1">
            <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              Navbar Sections
            </p>

            <p className="mt-1 text-[11px] text-muted-foreground">
              Click a section to expand or collapse its settings.
            </p>
          </div>

          {navbarSectionOrder.map((key, index) => {
            const sectionEntry = navbarSectionRegistry[key]
            const FormSection = sectionEntry.form

            return (
              <CollapsibleSectionCard
                key={key}
                title={sectionEntry.label}
                meta={key}
                indexLabel={String(index + 1).padStart(2, "0")}
                isOpen={openSections[key] ?? false}
                onToggle={() => toggleSection(key)}
              >
                <FormSection context={sectionContext} />
              </CollapsibleSectionCard>
            )
          })}

          <CollapsibleSectionCard
            title="SEO Metadata"
            meta="seo"
            indexLabel="SEO"
            isOpen={openSections.seo ?? false}
            onToggle={() => toggleSection("seo")}
          >
            <SeoForm
              metadata={page.metadata}
              onChange={(metadata) =>
                setPage({
                  ...page,
                  metadata: {
                    ...metadata,
                    title: metadata.title ?? "",
                    description: metadata.description ?? "",
                  },
                  data: {
                    ...page.data,
                  },
                })
              }
            />
          </CollapsibleSectionCard>
        </div>
      </div>
    </div>
  )
}
