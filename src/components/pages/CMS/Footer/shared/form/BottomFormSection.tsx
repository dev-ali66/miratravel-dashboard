import { ColorField } from "../../../shared/FormControls"

import type { FooterFormSectionProps } from "./sectionTypes"

export const BottomFormSection = ({
  context,
}: FooterFormSectionProps) => {
  const {
    theme,
    content,
    updateTheme,
    updateContent,
    TextField,
  } = context

  return (
    <div className="rounded-lg border border-border/60 p-3">
      <p className="mb-3 text-xs font-semibold text-foreground">
        Bottom / Copyright
      </p>

      <div className="flex flex-col gap-3">
        <TextField
          label="Copyright text"
          value={
            content.copyright ?? ""
          }
          onChange={(value) =>
            updateContent({
              copyright: value,
            })
          }
        />

        <ColorField
          label="Bottom text color"
          value={
            theme.bottomTextColor ??
            "rgba(255,255,255,0.60)"
          }
          onChange={(value) =>
            updateTheme({
              bottomTextColor: value,
            })
          }
        />
      </div>
    </div>
  )
}
