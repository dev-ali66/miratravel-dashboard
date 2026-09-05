import { UniversalMultimediaForm } from "../../../shared/UniversalMultimediaForm"

import type { FooterFormSectionProps } from "./sectionTypes"

export const BrandFormSection = ({ context }: FooterFormSectionProps) => {
  const { content, updateContent, TextField, TextAreaField } = context

  const brand = content.brand ?? {}
  return (
    <div className="rounded-lg border border-border/60 p-3">
      <p className="mb-3 text-xs font-semibold text-foreground">Brand</p>

      <div className="flex flex-col gap-3">
        <TextField
          label="Brand name"
          value={brand.name ?? ""}
          onChange={(value) =>
            updateContent({
              brand: { ...brand, name: value },
            })
          }
        />

        <UniversalMultimediaForm
          section={{} as any}
          content={brand as Record<string, any>}
          updateSection={() => undefined}
          updateSectionContent={(patch) =>
            updateContent({ brand: { ...brand, ...patch } })
          }
          contentMediaKey="footerBrandMultimedia"
          sectionTitle="Brand Media"
          showColorPicker
          colorLabel="Brand media color"
          defaultColor="#FFFFFF"
          imageTitle="Brand Image"
          imageLabel="Brand image"
          imageFieldName="cmsFooterBrandImage"
          imageAltStyleKey="footerBrandMediaImageAltStyle"
          videoTitle="Brand Video"
          videoLabel="Brand video"
          videoHint="Upload a video to use for the brand media."
          videoFieldName="cmsFooterBrandVideo"
          videoAltStyleKey="footerBrandMediaVideoAltStyle"
          showVideoSwitches
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
