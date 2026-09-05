import type { ContactField } from "../../Contact/contactTypes"

export type FormBuilderField = ContactField

export type FormBuilderProps = {
  fields: FormBuilderField[]
  onChange: (index: number, patch: Partial<FormBuilderField>) => void
  onAdd: () => void
  onRemove: (index: number) => void
}
