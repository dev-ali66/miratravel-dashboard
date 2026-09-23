import React from "react"

export function getStr(val: any, fallback: string = ""): string {
  if (val === null || val === undefined) return fallback
  if (typeof val === "string") return val.trim() !== "" ? val : fallback
  if (typeof val === "number" || typeof val === "boolean") return String(val)
  if (typeof val === "object" && val !== null) {
    if ("value" in val && val.value !== undefined && val.value !== null) {
      const strVal = String(val.value)
      return strVal.trim() !== "" ? strVal : fallback
    }
    if ("text" in val && val.text !== undefined && val.text !== null) {
      const strVal = String(val.text)
      return strVal.trim() !== "" ? strVal : fallback
    }
    if ("title" in val && val.title !== undefined && val.title !== null) {
      const strVal = typeof val.title === "object" ? getStr(val.title, fallback) : String(val.title)
      return strVal.trim() !== "" ? strVal : fallback
    }
  }
  return fallback
}

export function getStyleObj(field: any, defaultColor?: string): React.CSSProperties {
  if (!field || typeof field !== "object" || Array.isArray(field)) {
    return defaultColor ? { color: defaultColor } : {}
  }
  const color = field.textColor || field.color || defaultColor
  const opacity = field.textOpacity !== undefined && field.textOpacity !== null ? field.textOpacity : undefined
  const bg = field.backgroundColor

  return {
    ...(color ? { color } : {}),
    ...(opacity !== undefined && opacity !== null ? { opacity } : {}),
    ...(bg ? { backgroundColor: bg } : {}),
  }
}
