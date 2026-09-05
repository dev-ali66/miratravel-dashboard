import { UniversalMultimediaForm } from "../../../shared/UniversalMultimediaForm"
import { DynamicStyledField } from "../../../shared/FormControls"
import type { NavbarFormSectionProps } from "./sectionTypes"

export const BrandFormSection = ({ context }: NavbarFormSectionProps) => {
  const { content, updateBrand } = context
  const { brand } = content

  return (
    <div className="flex flex-col gap-3">
      <DynamicStyledField
        type="text"
        label="Brand name"
        value={brand.name}
        onChange={(value) => updateBrand({ name: value })}
        enableStyle
        style={brand.navbarBrandNameStyle}
        onStyleChange={(style) => updateBrand({ navbarBrandNameStyle: style })}
      />

      <UniversalMultimediaForm
        section={{} as any}
        content={brand as Record<string, any>}
        updateSection={() => undefined}
        updateSectionContent={(patch) => updateBrand(patch)}
        contentMediaKey="navbarBrandMultimedia"
        backgroundTypeStyleKey="navbarBrandMultimediaTypeStyle"
        sectionTitle="Brand Media"
        showColorPicker
        colorLabel="Brand media color"
        defaultColor="#FFFFFF"
        imageTitle="Brand Image"
        imageLabel="Brand image"
        imageFieldName="cmsNavbarBrandImage"
        imageAltStyleKey="navbarBrandMediaImageAltStyle"
        videoTitle="Brand Video"
        videoLabel="Brand video"
        videoHint="Upload a video to use for the brand media."
        videoFieldName="cmsNavbarBrandVideo"
        videoAltStyleKey="navbarBrandMediaVideoAltStyle"
        showVideoSwitches
      />

      <DynamicStyledField
        type="text"
        label="Brand URL"
        value={brand.url}
        onChange={(value) => updateBrand({ url: value })}
      />
    </div>
  )
}
