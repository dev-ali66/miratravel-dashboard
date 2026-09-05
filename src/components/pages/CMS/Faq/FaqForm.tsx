import { useState } from "react"

import { useCmsPage } from "../shared/useCmsPage"
import { SaveBar } from "../shared/SaveBar"
import { CollapsibleSectionCard } from "../shared/CollapsibleSectionCard"
import { SeoForm } from "../shared/SeoForm"
import { faqSectionOrder, faqSectionRegistry } from "./config/faqSections"
import type { FaqPageData, FaqStyles } from "./faqTypes"

const defaultStyles = (data: FaqPageData["data"]): FaqStyles =>
  data.styles ?? {
    page: {
      backgroundColor: data.bgColor || "#FBF6EE",
      textColor: "#171717",
    },
    header: {
      backgroundColor: "transparent",
      eyebrowColor: "#737373",
      titleColor: "#171717",
      subtitleColor: "#737373",
      descriptionColor: "#737373",
    },
    faq: {
      itemBackgroundColor: "#FFFFFF",
      itemBorderColor: "#E5E5E5",
      questionColor: "#171717",
      answerColor: "#737373",
      iconColor: "#737373",
      openBackgroundColor: "#F5F5F5",
      openQuestionColor: "#111111",
      openAnswerColor: "#555555",
    },
  }

export const FaqForm = () => {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    content: true,
    seo: false,
  })
  const { page, setPage, isLoading, isSaving, save } = useCmsPage<FaqPageData>(
    "faq",
    "FAQ"
  )

  if (!page) return null

  const data = page.data
  const styles = defaultStyles(data)

  const updateData = (patch: Partial<FaqPageData["data"]>) => {
    setPage({ ...page, data: { ...data, ...patch } })
  }

  const updateSectionContent = (_index: number, patch: Record<string, any>) => {
    updateData(patch as Partial<FaqPageData["data"]>)
  }

  const updateMetadata = (patch: Partial<FaqPageData["metadata"]>) => {
    setPage({ ...page, metadata: { ...page.metadata, ...patch } })
  }

  const updateContent = (patch: Partial<FaqPageData["data"]["content"]>) => {
    updateData({ content: { ...data.content, ...patch } })
  }

  const updateStyles = (patch: Partial<FaqStyles>) => {
    updateData({ styles: { ...styles, ...patch } })
  }

  const updateHeaderStyles = (patch: Partial<FaqStyles["header"]>) => {
    updateStyles({ header: { ...styles.header, ...patch } })
  }

  const updateFaqStyles = (patch: Partial<FaqStyles["faq"]>) => {
    updateStyles({ faq: { ...styles.faq, ...patch } })
  }

  const toggleSection = (key: string) => {
    setOpenSections((current) => ({
      ...current,
      [key]: !current[key],
    }))
  }

  return (
    <div className="flex flex-col">
      <SaveBar
        title="FAQ"
        description="Manage FAQ content, appearance and background."
        onSave={save}
        isSaving={isSaving}
        isLoading={isLoading}
      />

      <div className="flex flex-col gap-6 p-4">
        <div className="px-1">
          <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            FAQ Sections
          </p>
          <p className="mt-1 text-[11px] text-muted-foreground">
            Click a section to expand or collapse its settings.
          </p>
        </div>

        {faqSectionOrder.map((key, index) => {
          const entry = faqSectionRegistry[key]
          const FormSection = entry.form

          return (
            <CollapsibleSectionCard
              key={key}
              title={entry.label}
              meta={entry.meta}
              indexLabel={String(index + 1).padStart(2, "0")}
              isOpen={openSections[key] ?? false}
              onToggle={() => toggleSection(key)}
            >
              <FormSection
                index={index}
                data={data}
                metadata={page.metadata}
                styles={styles}
                updateData={updateData}
                updateSectionContent={updateSectionContent}
                updateMetadata={updateMetadata}
                updateContent={updateContent}
                updateHeaderStyles={updateHeaderStyles}
                updateFaqStyles={updateFaqStyles}
              />
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
              updateMetadata({
                ...metadata,
                title: metadata.title ?? "",
                description: metadata.description ?? "",
              })
            }
          />
        </CollapsibleSectionCard>
      </div>
    </div>
  )
}
