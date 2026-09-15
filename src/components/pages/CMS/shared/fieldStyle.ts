export type FieldStyleValue = {
  textColor?: string | null
  textOpacity?: number
  backgroundColor?: string | null
  backgroundOpacity?: number
  value?: any
  text?: string
}

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
    const normalizedOpacity = opacity <= 1 ? opacity : opacity / 100
    return `rgba(${red}, ${green}, ${blue}, ${normalizedOpacity})`
  }

  const rgbMatch = color.match(/^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i)
  if (rgbMatch) {
    const normalizedOpacity = opacity <= 1 ? opacity : opacity / 100
    return `rgba(${rgbMatch[1]}, ${rgbMatch[2]}, ${rgbMatch[3]}, ${normalizedOpacity})`
  }

  return color ?? undefined
}

export const fieldCssStyle = (
  styleOrUnifiedField: FieldStyleValue | Record<string, any> | undefined | null,
  fallbackColor?: string
): React.CSSProperties => {
  if (!styleOrUnifiedField) {
    return fallbackColor ? { color: fallbackColor } : {}
  }

  const target = styleOrUnifiedField as Record<string, any>

  const rawTextColor =
    target.textColor !== undefined
      ? target.textColor
      : target.color

  const rawTextOpacity =
    target.textOpacity !== undefined
      ? target.textOpacity
      : target.opacity

  const rawBgColor =
    target.backgroundColor !== undefined
      ? target.backgroundColor
      : target.bgColor

  const rawBgOpacity =
    target.backgroundOpacity !== undefined
      ? target.backgroundOpacity
      : target.bgOpacity

  const color = colorWithOpacity(rawTextColor ?? fallbackColor, rawTextOpacity)
  const backgroundColor = colorWithOpacity(rawBgColor, rawBgOpacity)

  const result: Record<string, string> = {}
  if (color) result.color = color
  if (backgroundColor) result.backgroundColor = backgroundColor

  return result as React.CSSProperties
}
