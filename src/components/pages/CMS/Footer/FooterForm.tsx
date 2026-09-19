import { useState } from "react"
import { Loader2, Save, Terminal } from "lucide-react"

import { useCmsPage } from "../shared/useCmsPage"
import { FormSection } from "../shared/FormControls"
import { SeoForm } from "../shared/SeoForm"

import {
  footerFormSectionOrder,
  footerFormSectionRegistry,
} from "./config/footerSections"
import type { FooterPageData } from "./footerTypes"
import type { FooterFormSectionContext } from "./shared/form/sectionTypes"

export const FooterForm = () => {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    [footerFormSectionOrder[0] ?? "footer_appearance"]: true,
  })

  const toggleSection = (key: string) => {
    setOpenSections((current) => {
      const isCurrentlyOpen = !!current[key]
      return isCurrentlyOpen ? {} : { [key]: true }
    })
  }

  const { page, setPage, isLoading, isSaving, save } =
    useCmsPage<FooterPageData>("footer", "Footer")

  const data = page?.data

  const theme = data?.theme ?? {}
  const content = data?.content ?? {}

  const updateData = (patch: Partial<NonNullable<FooterPageData["data"]>>) => {
    setPage({
      ...page,
      data: {
        ...(page?.data ?? {}),
        ...patch,
      },
    })
  }

  const updateTheme = (
    patch: Partial<NonNullable<FooterPageData["data"]>["theme"]>
  ) => {
    updateData({
      theme: {
        ...(data?.theme ?? {}),
        ...patch,
      },
    })
  }

  const updateContent = (
    patch: Partial<NonNullable<FooterPageData["data"]>["content"]>
  ) => {
    updateData({
      content: {
        ...(data?.content ?? {}),
        ...patch,
      },
    })
  }

  const sectionContext: FooterFormSectionContext = {
    theme,
    content,
    updateTheme,
    updateContent,
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center p-10">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        <p className="mt-2 text-xs text-muted-foreground">
          Loading Footer editor data...
        </p>
      </div>
    )
  }

  return (
    <div className="flex min-h-full flex-col">
      {/* Top Header Bar */}
      <div className="sticky top-0 z-20 border-b border-border/60 bg-card/95 px-5 py-4 backdrop-blur">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[10px] font-medium tracking-[0.2em] text-muted-foreground uppercase">
              CMS Page
            </p>
            <h2 className="mt-1 truncate text-base font-semibold">
              Edit Footer Page
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                console.log("📍 [FOOTER CMS DATA]:", page)
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
        {footerFormSectionOrder.map((key, index) => {
          const sectionEntry = footerFormSectionRegistry[key]
          const FormSectionComp = sectionEntry.form

          return (
            <FormSection
              key={key}
              title={sectionEntry.label}
              active={Boolean(openSections[key])}
              onClick={() => toggleSection(key)}
              sectionNumber={index + 1}
            >
              <FormSectionComp context={sectionContext} />
            </FormSection>
          )
        })}

        <FormSection
          title="SEO Metadata"
          active={Boolean(openSections["seo"])}
          onClick={() => toggleSection("seo")}
          sectionNumber={footerFormSectionOrder.length + 1}
        >
          <SeoForm
            metadata={page?.metadata}
            onChange={(metadata) =>
              setPage({
                ...page,
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
        </FormSection>
      </div>
    </div>
  )
}

