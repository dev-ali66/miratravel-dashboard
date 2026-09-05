import type { ContactPageData, ContactSection } from "../../contactTypes"

export type ContactFormSectionProps = {
  section: ContactSection
  index: number
  metadata: ContactPageData["metadata"]
  updateSection: (index: number, patch: Partial<ContactSection>) => void
  updateSectionContent: (index: number, patch: Record<string, any>) => void
  updateSectionField: (
    sectionIndex: number,
    fieldIndex: number,
    patch: Record<string, any>
  ) => void
  addField: (sectionIndex: number) => void
  removeField: (sectionIndex: number, fieldIndex: number) => void
  updateItem: (
    sectionIndex: number,
    itemIndex: number,
    patch: Record<string, any>
  ) => void
  updateButton: (
    sectionIndex: number,
    buttonIndex: number,
    patch: Record<string, any>
  ) => void
  updateSectionButtons: (
    index: number,
    buttons: ContactSection["buttons"]
  ) => void
  addItem: (index: number) => void
  removeItem: (index: number, itemIndex: number) => void
}
