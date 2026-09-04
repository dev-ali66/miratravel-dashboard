import { DynamicStyledField } from "../../../shared/FormControls"

import type { FooterFormSectionProps } from "./sectionTypes"

export const BrandFormSection = ({
  context,
}: FooterFormSectionProps) => {
  const {
    content,
    updateContent,
    TextField,
    TextAreaField,
  } = context

  const brand = content.brand ?? {}
  const logo = brand.logo ?? {}

  return (
    <div className="rounded-lg border border-border/60 p-3">
      <p className="mb-3 text-xs font-semibold text-foreground">
        Brand
      </p>

      <div className="flex flex-col gap-3">
        <DynamicStyledField
          type="image"
          label="Logo"
          value={logo.url ?? ""}
          fieldName="footerBrandLogo"
          onChange={(value) =>
            updateContent({
              brand: {
                ...(content.brand ?? {}),
                logo: {
                  ...(content.brand?.logo ?? {}),
                  url: value,
                },
              },
            })
          }
        />

        <TextField
          label="Logo alt text"
          value={logo.alt ?? ""}
          onChange={(value) =>
            updateContent({
              brand: {
                ...(content.brand ?? {}),
                logo: {
                  ...(content.brand?.logo ?? {}),
                  alt: value,
                },
              },
            })
          }
        />

        <TextField
          label="Brand name"
          value={brand.name ?? ""}
          onChange={(value) =>
            updateContent({
              brand: {
                ...(content.brand ?? {}),
                name: value,
              },
            })
          }
        />

        <TextAreaField
          label="Description"
          value={brand.description ?? ""}
          onChange={(value) =>
            updateContent({
              brand: {
                ...(content.brand ?? {}),
                description: value,
              },
            })
          }
        />
      </div>
    </div>
  )
}
