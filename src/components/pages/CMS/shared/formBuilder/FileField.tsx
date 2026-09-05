import { DynamicStyledField } from "../FormControls"
export const BuilderFileField = ({
  label,
  value,
  fieldName,
  onChange,
}: {
  label: string
  value?: string
  fieldName?: string
  onChange: (value: string) => void
}) => (
  <DynamicStyledField
    type="image"
    label={label}
    value={value}
    fieldName={fieldName}
    onChange={onChange}
  />
)
