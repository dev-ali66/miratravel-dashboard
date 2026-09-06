import type { FieldStyle } from "../../../shared/FormControls"
import { UniversalMultimediaPreview } from "../../../Home/shared/preview/UniversalMultimediaPreview"
import type { NavbarPreviewSectionProps } from "./sectionTypes"

const colorWithOpacity = (
  color: string | null | undefined,
  opacity: number | undefined
): string | undefined => {
  if (!color || opacity === undefined || opacity >= 100) return color ?? undefined

  const hexMatch = color.match(/^#([0-9a-f]{6})$/i)
  if (hexMatch) {
    const red = parseInt(hexMatch[1].slice(0, 2), 16)
    const green = parseInt(hexMatch[1].slice(2, 4), 16)
    const blue = parseInt(hexMatch[1].slice(4, 6), 16)

    return `rgba(${red}, ${green}, ${blue}, ${opacity / 100})`
  }

  return color ?? undefined
}

const fieldCssStyle = (
  style: FieldStyle | undefined,
  fallbackColor: string
) => ({
  color: colorWithOpacity(
    style?.textColor ?? fallbackColor,
    style?.textOpacity
  ),
  backgroundColor: colorWithOpacity(
    style?.backgroundColor,
    style?.backgroundOpacity
  ),
})

export const BrandPreviewSection = ({ context }: NavbarPreviewSectionProps) => {
  const { theme, content } = context
  const { brand } = content
  const nameStyle = fieldCssStyle(brand.navbarBrandNameStyle, theme.textColor)
  const brandMultimedia = brand.navbarBrandMultimedia
  const selectedMedia = brandMultimedia
    ? {
        ...brandMultimedia,
        ...(brandMultimedia.type === "video"
          ? brandMultimedia.videoData
          : brandMultimedia.imageData),
        type: brandMultimedia.type,
      }
    : undefined
  const hasBrandMedia = Boolean(
    selectedMedia?.url || selectedMedia?.type === "color" || brand.logo
  )

  return (
    <a
      href={brand.url || "#"}
      className="flex items-center gap-3"
      style={{ color: theme.textColor }}
    >
      {selectedMedia?.type ? (
        <UniversalMultimediaPreview
          multimedia={selectedMedia}
          fallbackAlt={brand.alt}
          mode="inline"
          className="h-8 w-8 object-contain"
          containerClassName="h-8 w-8 shrink-0"
        />
      ) : brand.logo ? (
        <img
          src={brand.logo}
          alt={brand.alt}
          className="h-8 w-auto object-contain"
        />
      ) : (
        <span className="text-sm font-bold tracking-wide" style={nameStyle}>
          {brand.name}
        </span>
      )}

      {!hasBrandMedia && brand.name ? null : (
        <span className="text-sm font-semibold" style={nameStyle}>
          {brand.name}
        </span>
      )}
    </a>
  )
}
