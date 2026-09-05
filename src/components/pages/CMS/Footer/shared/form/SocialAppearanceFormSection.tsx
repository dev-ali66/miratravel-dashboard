import { ColorField } from "../../../shared/FormControls"

import type { FooterFormSectionProps } from "./sectionTypes"

export const SocialAppearanceFormSection = ({
  context,
}: FooterFormSectionProps) => {
  const { theme, updateTheme, TextField } = context

  return (
    <div className="rounded-lg border border-border/60 p-3">
      <p className="mb-1 text-xs font-semibold text-foreground">
        Social Appearance
      </p>

      <p className="mb-3 text-[11px] text-muted-foreground">
        Global social settings. Individual social items can override these
        values.
      </p>

      <div className="flex flex-col gap-3">
        <ColorField
          label="Background color"
          value={theme.socialBackgroundColor ?? "rgba(255,255,255,0.10)"}
          onChange={(value) =>
            updateTheme({
              socialBackgroundColor: value,
            })
          }
        />

        <ColorField
          label="Icon / text color"
          value={theme.socialTextColor ?? "#FFFFFF"}
          onChange={(value) =>
            updateTheme({
              socialTextColor: value,
            })
          }
        />

        <ColorField
          label="Border color"
          value={theme.socialBorderColor ?? "transparent"}
          onChange={(value) =>
            updateTheme({
              socialBorderColor: value,
            })
          }
        />

        <ColorField
          label="Hover background color"
          value={theme.socialHoverBackgroundColor ?? "rgba(255,255,255,0.18)"}
          onChange={(value) =>
            updateTheme({
              socialHoverBackgroundColor: value,
            })
          }
        />

        <ColorField
          label="Hover icon / text color"
          value={theme.socialHoverTextColor ?? "#FFFFFF"}
          onChange={(value) =>
            updateTheme({
              socialHoverTextColor: value,
            })
          }
        />

        <TextField
          label="Icon size"
          value={theme.socialIconSize ?? "14px"}
          onChange={(value) =>
            updateTheme({
              socialIconSize: value,
            })
          }
        />

        <TextField
          label="Item size"
          value={theme.socialItemSize ?? "32px"}
          onChange={(value) =>
            updateTheme({
              socialItemSize: value,
            })
          }
        />

        <TextField
          label="Border radius"
          value={theme.socialBorderRadius ?? "4px"}
          onChange={(value) =>
            updateTheme({
              socialBorderRadius: value,
            })
          }
        />

        <TextField
          label="Gap"
          value={theme.socialGap ?? "8px"}
          onChange={(value) =>
            updateTheme({
              socialGap: value,
            })
          }
        />
      </div>
    </div>
  )
}
