import { DynamicStyledField } from "../../../shared/FormControls"
import type { NavbarFormSectionProps } from "./sectionTypes"

export const ThemeFormSection = ({ context }: NavbarFormSectionProps) => {
  const { theme, updateTheme } = context

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      <DynamicStyledField
        type="color"
        label="Background color"
        value={theme.backgroundColor}
        onChange={(value) => updateTheme({ backgroundColor: value })}
      />

      <DynamicStyledField
        type="color"
        label="Text color"
        value={theme.textColor}
        onChange={(value) => updateTheme({ textColor: value })}
      />

      <DynamicStyledField
        type="color"
        label="Active color"
        value={theme.activeColor}
        onChange={(value) => updateTheme({ activeColor: value })}
      />
    </div>
  )
}
