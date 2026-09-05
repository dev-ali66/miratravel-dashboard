import { DynamicStyledField } from "../FormControls"
export const BuilderRadioField = ({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value?: string
  options: { value: string; label: string }[]
  onChange: (value: string) => void
}) => (
  <DynamicStyledField
    type="select"
    label={label}
    value={value}
    options={options}
    onChange={onChange}
  />
)
