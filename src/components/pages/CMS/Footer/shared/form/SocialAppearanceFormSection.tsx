import { ColorField, DynamicStyledField } from "../../../shared/FormControls"
import type { FooterFormSectionProps } from "./sectionTypes"

export const SocialAppearanceFormSection = ({
  context,
}: FooterFormSectionProps) => {
  const { theme, updateTheme } = context

  return (
    <div className="space-y-6">
      <p className="text-xs text-muted-foreground">
        Global social settings. Individual social items can override these values.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ColorField
          label="Background Color"
          value={theme.socialBackgroundColor ?? "rgba(255,255,255,0.10)"}
          onChange={(value) => updateTheme({ socialBackgroundColor: value })}
        />

        <ColorField
          label="Icon / Text Color"
          value={theme.socialTextColor ?? "#FFFFFF"}
          onChange={(value) => updateTheme({ socialTextColor: value })}
        />

        <ColorField
          label="Border Color"
          value={theme.socialBorderColor ?? "transparent"}
          onChange={(value) => updateTheme({ socialBorderColor: value })}
        />

        <ColorField
          label="Hover Background Color"
          value={theme.socialHoverBackgroundColor ?? "rgba(255,255,255,0.18)"}
          onChange={(value) => updateTheme({ socialHoverBackgroundColor: value })}
        />

        <ColorField
          label="Hover Icon / Text Color"
          value={theme.socialHoverTextColor ?? "#FFFFFF"}
          onChange={(value) => updateTheme({ socialHoverTextColor: value })}
        />

        <DynamicStyledField
          type="text"
          label="Icon Size"
          value={theme.socialIconSize ?? "14px"}
          onChange={(value) => updateTheme({ socialIconSize: typeof value === "object" ? value.value : value })}
        />

        <DynamicStyledField
          type="text"
          label="Item Size"
          value={theme.socialItemSize ?? "32px"}
          onChange={(value) => updateTheme({ socialItemSize: typeof value === "object" ? value.value : value })}
        />

        <DynamicStyledField
          type="text"
          label="Border Radius"
          value={theme.socialBorderRadius ?? "4px"}
          onChange={(value) => updateTheme({ socialBorderRadius: typeof value === "object" ? value.value : value })}
        />

        <DynamicStyledField
          type="text"
          label="Gap"
          value={theme.socialGap ?? "8px"}
          onChange={(value) => updateTheme({ socialGap: typeof value === "object" ? value.value : value })}
        />
      </div>
    </div>
  )
}

