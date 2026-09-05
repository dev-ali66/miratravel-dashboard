import { DynamicStyledField } from "../FormControls"
export const BuilderTextAreaField = ({
  label,
  value,
  onChange,
}: {
  label: string
  value?: string
  onChange: (value: string) => void
}) => (
  <DynamicStyledField
    type="textarea"
    label={label}
    value={value ?? ""}
    onChange={onChange}
  />
)
