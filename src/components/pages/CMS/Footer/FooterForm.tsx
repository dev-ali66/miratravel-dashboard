import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"

import { useCmsPage } from "../shared/useCmsPage"
import { SaveBar } from "../shared/SaveBar"
import { SeoForm } from "../shared/SeoForm"
import { CollapsibleSectionCard } from "../shared/CollapsibleSectionCard"

import {
  DynamicStyledField,
  type TextAreaFieldProps as SharedTextAreaFieldProps,
  type TextFieldProps as SharedTextFieldProps,
} from "../shared/FormControls"

import {
  footerFormSectionOrder,
  footerFormSectionRegistry,
} from "./config/footerSections"
import type { FooterPageData } from "./footerTypes"
import type { FooterFormSectionContext } from "./shared/form/sectionTypes"
const TextField = (props: SharedTextFieldProps) => (
  <DynamicStyledField type="text" {...props} />
)

const TextAreaField = (props: SharedTextAreaFieldProps) => (
  <DynamicStyledField type="textarea" {...props} />
)

export const FooterForm = () => {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    [footerFormSectionOrder[0] ?? "footer_appearance"]: true,
  })

  const toggleSection = (key: string) => {
    setOpenSections((current) => ({
      ...current,
      [key]: !current[key],
    }))
  }

  const isOpen = (key: string) => {
    return openSections[key] ?? false
  }

  const sectionIndexLabel = (index: number) => {
    return String(index + 1).padStart(2, "0")
  }

  const sectionKeyLabel = (key: string) => {
    return key.replaceAll("_", " ")
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
    TextField,
    TextAreaField,
  }

  return (
    <div className="flex flex-col">
      <SaveBar
        title="Footer"
        description="Manage footer content, colors, background, links, contact, newsletter, social icons and certifications."
        onSave={save}
        isSaving={isSaving}
        isLoading={isLoading}
      />

      <div className="flex flex-col gap-6 p-4">
        <div className="flex flex-col gap-3">
          <div className="px-1">
            <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              Footer Sections
            </p>

            <p className="mt-1 text-[11px] text-muted-foreground">
              Click a section to expand or collapse its settings.
            </p>
          </div>

          {footerFormSectionOrder.map((key, index) => {
            const sectionEntry = footerFormSectionRegistry[key]

            const FormSection = sectionEntry.form

            return (
              <div
                key={key}
                className="overflow-hidden rounded-lg border border-border/60"
              >
                <button
                  type="button"
                  onClick={() => toggleSection(key)}
                  className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/40"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="flex h-7 min-w-7 items-center justify-center rounded-md bg-muted px-2 text-[10px] font-semibold text-muted-foreground">
                      {sectionIndexLabel(index)}
                    </span>

                    <div className="min-w-0">
                      <p className="text-sm font-semibold">
                        {sectionEntry.label}
                      </p>

                      <p className="truncate text-[10px] text-muted-foreground">
                        {sectionKeyLabel(key)}
                      </p>
                    </div>
                  </div>

                  {isOpen(key) ? (
                    <ChevronUp className="h-4 w-4 shrink-0 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
                  )}
                </button>

                {isOpen(key) && (
                  <div className="border-t border-border/60 p-4">
                    <FormSection context={sectionContext} />
                  </div>
                )}
              </div>
            )
          })}

          <CollapsibleSectionCard
            title="SEO Metadata"
            meta="seo"
            indexLabel="SEO"
            isOpen={isOpen("seo")}
            onToggle={() => toggleSection("seo")}
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
          </CollapsibleSectionCard>
        </div>
      </div>
    </div>
  )
}
