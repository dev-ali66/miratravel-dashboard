import { useState } from "react"
import { useCmsPage } from "../shared/useCmsPage"
import { SaveBar } from "../shared/SaveBar"
import { CollapsibleSectionCard } from "../shared/CollapsibleSectionCard"
import { SeoForm } from "../shared/SeoForm"
import { contactSectionRegistry } from "./config/contactSections"
import { type ContactPageData, type ContactSection, DEFAULT_CONTACT_SECTIONS } from "./contactTypes"

export const ContactForm = () => {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    seo: false,
  })
  const { page, setPage, isLoading, isSaving, save } =
    useCmsPage<ContactPageData>("contact-us", "Contact Us")

  if (isLoading) {
    return (
      <>
        <SaveBar
          title="Contact Us"
          description="Manage contact page content and sections."
          onSave={save}
          isSaving={isSaving}
          isLoading={isLoading}
        />
        <div className="p-6 text-sm text-muted-foreground">
          Loading contact page...
        </div>
      </>
    )
  }
  if (!page) return null

  const sections =
    page.data.sections && page.data.sections.length > 0
      ? page.data.sections
      : DEFAULT_CONTACT_SECTIONS
  const updatePage = (data: ContactPageData["data"]) =>
    setPage({ ...page, data })
  const updateSection = (index: number, patch: Partial<ContactSection>) => {
    const next = [...sections]
    next[index] = { ...next[index], ...patch }
    updatePage({ ...page.data, sections: next })
  }
  const updateSectionContent = (index: number, patch: Record<string, any>) => {
    const section = sections[index]
    updateSection(index, { content: { ...(section.content ?? {}), ...patch } })
  }
  const updateSectionField = (
    sectionIndex: number,
    fieldIndex: number,
    patch: Record<string, any>
  ) => {
    const fields = [...(sections[sectionIndex].fields ?? [])]
    fields[fieldIndex] = { ...fields[fieldIndex], ...patch }
    updateSection(sectionIndex, { fields })
  }
  const addField = (sectionIndex: number) => {
    const id = `field-${Date.now()}`
    updateSection(sectionIndex, {
      fields: [
        ...(sections[sectionIndex].fields ?? []),
        {
          id,
          name: id,
          type: "text",
          label: "",
          placeholder: "",
          required: false,
        },
      ],
    })
  }
  const removeField = (sectionIndex: number, fieldIndex: number) =>
    updateSection(sectionIndex, {
      fields: (sections[sectionIndex].fields ?? []).filter(
        (_, index) => index !== fieldIndex
      ),
    })
  const updateItem = (
    sectionIndex: number,
    itemIndex: number,
    patch: Record<string, any>
  ) => {
    const items = [...((sections[sectionIndex].items ?? []) as any[])]
    items[itemIndex] = { ...items[itemIndex], ...patch }
    updateSection(sectionIndex, { items } as Partial<ContactSection>)
  }
  const updateButton = (
    sectionIndex: number,
    buttonIndex: number,
    patch: Record<string, any>
  ) => {
    const buttons = [...(sections[sectionIndex].buttons ?? [])]
    buttons[buttonIndex] = { ...buttons[buttonIndex], ...patch }
    updateSection(sectionIndex, { buttons })
  }
  const updateSectionButtons = (
    sectionIndex: number,
    buttons: ContactSection["buttons"]
  ) => updateSection(sectionIndex, { buttons })
  const addItem = () => undefined
  const removeItem = (sectionIndex: number, itemIndex: number) => {
    const items = [...((sections[sectionIndex].items ?? []) as any[])]
    items.splice(itemIndex, 1)
    updateSection(sectionIndex, { items } as Partial<ContactSection>)
  }
  const toggle = (key: string) =>
    setOpenSections((current) => ({ ...current, [key]: !current[key] }))

  return (
    <div className="flex flex-col">
      <SaveBar
        title="Contact Us"
        description="Manage contact page content and sections."
        onSave={save}
        isSaving={isSaving}
        isLoading={isLoading}
      />
      <div className="flex flex-col gap-4 p-4">
        {sections.map((section, index) => {
          const entry =
            contactSectionRegistry[section.type] ??
            contactSectionRegistry[section.key]
          if (!entry) return null
          const FormSection = entry.form
          return (
            <CollapsibleSectionCard
              key={section.key}
              title={entry.label}
              meta={section.type}
              indexLabel={String(index + 1).padStart(2, "0")}
              isOpen={openSections[section.key] ?? false}
              onToggle={() => toggle(section.key)}
            >
              <FormSection
                section={section}
                index={index}
                metadata={page.metadata}
                updateSection={updateSection}
                updateSectionContent={updateSectionContent}
                updateSectionField={updateSectionField}
                addField={addField}
                removeField={removeField}
                updateItem={updateItem}
                updateButton={updateButton}
                updateSectionButtons={updateSectionButtons}
                addItem={addItem}
                removeItem={removeItem}
              />
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
                },
              })
            }
          />
        </CollapsibleSectionCard>
      </div>
    </div>
  )
}
