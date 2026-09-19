import { ColorField, DynamicStyledField } from "../../../shared/FormControls"
import type { FooterFormSectionProps } from "./sectionTypes"

export const BottomFormSection = ({ context }: FooterFormSectionProps) => {
  const { theme, content, updateTheme, updateContent } = context

  return (
    <div className="space-y-6">
      <DynamicStyledField
        label="Copyright Text"
        type="text"
        fieldName="footer.copyright"
        value={content.copyright ?? ""}
        onChange={(val) =>
          updateContent({
            copyright: typeof val === "object" ? val.value : val,
          })
        }
      />

      <ColorField
        label="Bottom Text Color"
        value={theme.bottomTextColor ?? "rgba(255,255,255,0.60)"}
        onChange={(value) => updateTheme({ bottomTextColor: value })}
      />
    </div>
  )
}

