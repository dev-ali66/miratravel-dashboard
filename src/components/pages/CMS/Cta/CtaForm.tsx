import { useState } from "react"
import { useCmsPage } from "../shared/useCmsPage"
import { SaveBar } from "../shared/SaveBar"
import { CollapsibleSectionCard } from "../shared/CollapsibleSectionCard"
import { SeoForm } from "../shared/SeoForm"
import { ctaSectionOrder, ctaSectionRegistry } from "./config/ctaSections"
import type { CtaPageData } from "./ctaTypes"

export const CtaForm = () => {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    content: true,
    seo: false,
  })
  const { page, setPage, isLoading, isSaving, save } = useCmsPage<CtaPageData>(
    "cta",
    "CTA"
  )

  if (isLoading)
    return (
      <>
        <SaveBar
          title="Call To Action"
          description="Reusable CTA banner shown across the public site."
          onSave={save}
          isSaving={isSaving}
          isLoading={isLoading}
        />
        <div className="p-6 text-sm text-muted-foreground">
          Loading CTA data...
        </div>
      </>
    )
  if (!page) return null

  const data = page.data
  const updateData = (patch: Partial<CtaPageData["data"]>) =>
    setPage({ ...page, data: { ...data, ...patch } })
  const toggle = (key: string) =>
    setOpenSections((current) => ({ ...current, [key]: !current[key] }))

  return (
    <div className="flex flex-col">
      <SaveBar
        title="Call To Action"
        description="Reusable CTA banner shown across the public site."
        onSave={save}
        isSaving={isSaving}
        isLoading={isLoading}
      />
      <div className="flex flex-col gap-4 p-4">
        {ctaSectionOrder.map((key, index) => {
          const entry = ctaSectionRegistry[key]
          const FormSection = entry.form
          return (
            <CollapsibleSectionCard
              key={key}
              title={entry.label}
              meta={entry.meta}
              indexLabel={String(index + 1).padStart(2, "0")}
              isOpen={openSections[key] ?? false}
              onToggle={() => toggle(key)}
            >
              <FormSection data={data} updateData={updateData} />
            </CollapsibleSectionCard>
          )
        })}
        <CollapsibleSectionCard
          title="SEO Metadata"
          meta="seo"
          indexLabel="SEO"
          isOpen={openSections.seo ?? false}
          onToggle={() => toggle("seo")}
        >
          <SeoForm
            metadata={page.metadata}
            onChange={(metadata) =>
              setPage({
                ...page,
                metadata: {
                  ...page.metadata,
                  ...metadata,
                  title: metadata.title ?? "",
                  description: metadata.description ?? "",
                  robots: {
                    index: metadata.robots?.index ?? true,
                    follow: metadata.robots?.follow ?? true,
                  },
                },
              })
            }
          />
        </CollapsibleSectionCard>
      </div>
    </div>
  )
}
