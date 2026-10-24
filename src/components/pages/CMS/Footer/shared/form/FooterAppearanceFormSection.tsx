import { THEME_COLORS } from "@/config/theme"
import { ColorField } from "../../../shared/FormControls"
import { UniversalMultimediaForm } from "../../../shared/UniversalMultimediaForm"
import type { FooterFormSectionProps } from "./sectionTypes"

export const FooterAppearanceFormSection = ({
  context,
}: FooterFormSectionProps) => {
  const { theme, updateTheme } = context

  return (
    <div className="space-y-6">
      <UniversalMultimediaForm
        title="Footer Background"
        value={theme.footerBackgroundMultimedia}
        onChange={(val) => updateTheme({ footerBackgroundMultimedia: val })}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ColorField
          label="Text Color"
          value={theme.textColor ?? THEME_COLORS.white}
          onChange={(value) => updateTheme({ textColor: value })}
        />

        <ColorField
          label="Heading Color"
          value={theme.headingColor ?? THEME_COLORS.white}
          onChange={(value) => updateTheme({ headingColor: value })}
        />

        <ColorField
          label="Muted Text Color"
          value={theme.mutedTextColor ?? THEME_COLORS.borderLight}
          onChange={(value) => updateTheme({ mutedTextColor: value })}
        />

        <ColorField
          label="Accent Color"
          value={theme.accentColor ?? THEME_COLORS.accentWarm}
          onChange={(value) => updateTheme({ accentColor: value })}
        />

        <ColorField
          label="Border Color"
          value={theme.borderColor ?? "rgba(255,255,255,0.15)"}
          onChange={(value) => updateTheme({ borderColor: value })}
        />
      </div>
    </div>
  )
}

