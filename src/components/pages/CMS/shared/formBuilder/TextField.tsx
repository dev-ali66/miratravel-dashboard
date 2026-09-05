import { DynamicStyledField } from "../FormControls"
export const BuilderTextField = ({
  label,
  value,
  onChange,
}: {
  label: string
  value?: string
  onChange: (value: string) => void
}) => (
  <DynamicStyledField
    type="text"
    label={label}
    value={value ?? ""}
    onChange={onChange}
  />
)
