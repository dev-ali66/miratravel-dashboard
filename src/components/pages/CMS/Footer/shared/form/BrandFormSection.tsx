import { DynamicStyledField } from "../../../shared/FormControls"
import { UniversalMultimediaForm } from "../../../shared/UniversalMultimediaForm"
import type { FooterFormSectionProps } from "./sectionTypes"

export const BrandFormSection = ({ context }: FooterFormSectionProps) => {
  const { content, updateContent } = context
  const brand = content.brand ?? {}

  return (
    <div className="space-y-6">
      <DynamicStyledField
        label="Brand Name"
        type="text"
        fieldName="footer.brand.name"
        value={brand.name ?? ""}
        onChange={(val) =>
          updateContent({
            brand: { ...brand, name: typeof val === "object" ? val.value : val },
          })
        }
      />

      <UniversalMultimediaForm
        title="Brand Logo / Media"
        value={brand.footerBrandMultimedia}
        onChange={(val) =>
          updateContent({
            brand: { ...brand, footerBrandMultimedia: val },
          })
        }
      />

      <DynamicStyledField
        label="Brand Description"
        type="textarea"
        rows={3}
        fieldName="footer.brand.description"
        value={brand.description ?? ""}
        onChange={(val) =>
          updateContent({
            brand: { ...brand, description: typeof val === "object" ? val.value : val },
          })
        }
      />
    </div>
  )
}

