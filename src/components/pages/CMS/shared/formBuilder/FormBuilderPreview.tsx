import { PreviewField } from "./PreviewField"
import type { FormBuilderField } from "./fieldTypes"

export type FormBuilderPreviewProps = {
  fields: FormBuilderField[]
}

export const FormBuilderPreview = ({ fields }: FormBuilderPreviewProps) => (
  <div className="space-y-3">
    {fields.map((field) => (
      <PreviewField key={field.id} field={field} />
    ))}
  </div>
)
