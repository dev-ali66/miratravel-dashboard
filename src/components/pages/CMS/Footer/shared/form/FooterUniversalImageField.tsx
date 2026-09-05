import { UniversalMultimediaForm } from "../../../shared/UniversalMultimediaForm"

type FooterUniversalImageFieldProps = {
  sectionTitle?: string
  imageTitle?: string
  imageLabel: string
  imageFieldName: string
  url?: string
  alt?: string
  onChange: (next: { url: string; alt?: string }) => void
  showImageAltField?: boolean
}

export const FooterUniversalImageField = ({
  sectionTitle = "Media",
  imageTitle = "Image",
  imageLabel,
  imageFieldName,
  url,
  alt,
  onChange,
  showImageAltField = true,
}: FooterUniversalImageFieldProps) => {
  return (
    <UniversalMultimediaForm
      section={{} as any}
      content={{}}
      updateSection={() => undefined}
      updateSectionContent={() => undefined}
      sectionTitle={sectionTitle}
      showColorPicker={false}
      enableTypeSelector={false}
      allowVideo={false}
      image={{
        url: url ?? "",
        alt,
      }}
      onImageChange={(next) =>
        onChange({
          url: typeof next.url === "string" ? next.url : "",
          alt: typeof next.alt === "string" ? next.alt : undefined,
        })
      }
      imageTitle={imageTitle}
      imageLabel={imageLabel}
      imageFieldName={imageFieldName}
      showImageAltField={showImageAltField}
    />
  )
}
