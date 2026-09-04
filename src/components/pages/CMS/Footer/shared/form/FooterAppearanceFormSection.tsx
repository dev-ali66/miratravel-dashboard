import {
  ColorField,
  DynamicStyledField,
} from "../../../shared/FormControls"

import type { FooterFormSectionProps } from "./sectionTypes"

export const FooterAppearanceFormSection = ({
  context,
}: FooterFormSectionProps) => {
  const { theme, updateTheme } = context

  return (
    <div className="rounded-lg border border-border/60 p-3">
      <p className="mb-3 text-xs font-semibold text-foreground">
        Footer Appearance
      </p>

      <div className="flex flex-col gap-3">
        <ColorField
          label="Background color"
          value={
            theme.backgroundColor ??
            "#1F3A1B"
          }
          onChange={(value) =>
            updateTheme({
              backgroundColor: value,
            })
          }
        />

        <DynamicStyledField
          type="image"
          label="Background image"
          value={
            theme.backgroundImage ??
            ""
          }
          fieldName="footerBackgroundImage"
          onChange={(value) =>
            updateTheme({
              backgroundImage: value,
            })
          }
        />

        <ColorField
          label="Text color"
          value={
            theme.textColor ??
            "#FFFFFF"
          }
          onChange={(value) =>
            updateTheme({
              textColor: value,
            })
          }
        />

        <ColorField
          label="Heading color"
          value={
            theme.headingColor ??
            "#FFFFFF"
          }
          onChange={(value) =>
            updateTheme({
              headingColor: value,
            })
          }
        />

        <ColorField
          label="Muted text color"
          value={
            theme.mutedTextColor ??
            "#D8DED5"
          }
          onChange={(value) =>
            updateTheme({
              mutedTextColor: value,
            })
          }
        />

        <ColorField
          label="Accent color"
          value={
            theme.accentColor ??
            "#C97B4A"
          }
          onChange={(value) =>
            updateTheme({
              accentColor: value,
            })
          }
        />

        <ColorField
          label="Border color"
          value={
            theme.borderColor ??
            "rgba(255,255,255,0.15)"
          }
          onChange={(value) =>
            updateTheme({
              borderColor: value,
            })
          }
        />
      </div>
    </div>
  )
}
