import MiraLoader from "@/components/shared/MiraLoader"
import { useState } from "react"
import { EditorFormHeader } from "@/components/shared/EditorFormHeader"

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
      <MiraLoader text="Loading Footer editor data..." className="min-h-[400px] py-16" />
    )
  }

  return (
    <div className="flex min-h-full flex-col">
      {/* Top Header Bar (Universal Sticky Header) */}
      <EditorFormHeader
        eyebrow="CMS Page"
        title="Edit Footer Page"
        saveLabel="Save"
        isSaving={isSaving}
        onSave={save}
        onConsoleData={() => {
          console.log("📍 [FOOTER CMS DATA]:", page)
        }}
        consoleDataTitle="Inspect clean payload in console (F12)"
      />

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

