export type FieldStyleValue = {
  textColor?: string | null
  textOpacity?: number
  backgroundColor?: string | null
  backgroundOpacity?: number
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
    return `rgba(${red}, ${green}, ${blue}, ${opacity / 100})`
  }

  const rgbMatch = color.match(/^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i)
  if (rgbMatch) {
    return `rgba(${rgbMatch[1]}, ${rgbMatch[2]}, ${rgbMatch[3]}, ${opacity / 100})`
  }

  return color ?? undefined
}

export const fieldCssStyle = (
  style: FieldStyleValue | undefined,
  fallbackColor?: string
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
