/* =====================================================
   DYNAMIC STYLED TEXT PREVIEW
   Reusable preview component for rendering DynamicStyledFields
   (title, subtitle, description, richtext, labels, etc.)
===================================================== */

import type { ElementType, ComponentPropsWithoutRef } from "react"
import { cn } from "@/lib/utils"

export type DynamicStyledTextPreviewProps<T extends ElementType = "p"> = {
  /** The HTML tag to render as (e.g. "h1", "h2", "h3", "p", "span", "div") */
  as?: T
  /** The styled field data object { value, textColor, textOpacity, backgroundColor, backgroundOpacity } or plain string */
  data?: any
  /** Optional fallback text if field value is empty */
  fallbackText?: string
  /** Optional fallback text color if textColor is not set */
  fallbackColor?: string
  /** Set to true if rendering RichText HTML content safely */
  isRichText?: boolean
  /** Tailwind CSS classes */
  className?: string
} & Omit<ComponentPropsWithoutRef<T>, "as" | "data">

/**
 * Safely extract primitive text value from raw strings, numbers, booleans,
 * or nested object structures like { value: { value: "Text" } }.
 */
function unwrapTextValue(val: any): string {
  if (val === null || val === undefined) return ""
  if (typeof val === "string") return val
  if (typeof val === "number" || typeof val === "boolean") return String(val)

  if (typeof val === "object" && !Array.isArray(val)) {
    if (val.value !== undefined) {
      return unwrapTextValue(val.value)
    }
    if (val.text !== undefined) {
      return unwrapTextValue(val.text)
    }
    if (val.label !== undefined) {
      return unwrapTextValue(val.label)
    }
    if (val.title !== undefined) {
      return unwrapTextValue(val.title)
    }
  }

  return ""
}

/**
 * Safely search for style attributes (textColor, textOpacity, backgroundColor)
 * in single-level or nested styled object containers.
 */
function findStyleProp(obj: any, key: string): any {
  if (!obj || typeof obj !== "object" || Array.isArray(obj)) return undefined
  if (obj[key] !== undefined && obj[key] !== null) return obj[key]
  if (obj.value && typeof obj.value === "object") return findStyleProp(obj.value, key)
  return undefined
}

export function DynamicStyledTextPreview<T extends ElementType = "p">({
  as,
  data,
  fallbackText = "",
  fallbackColor,
  isRichText = false,
  className,
  style: userStyle,
  ...props
}: DynamicStyledTextPreviewProps<T>) {
  const Component = (as || "p") as ElementType

  const rawValue = unwrapTextValue(data)

  // If value is empty string (""), null, or undefined, return null so empty fields disappear from live preview
  const textContent =
    rawValue !== ""
      ? rawValue
      : (fallbackText || null)

  if (!textContent) return null

  const textColor = findStyleProp(data, "textColor")
  const effectiveTextColor = textColor || fallbackColor
  const textOpacity = findStyleProp(data, "textOpacity")
  const bgColor = findStyleProp(data, "backgroundColor")

  const computedStyle = {
    ...(effectiveTextColor ? { color: effectiveTextColor } : {}),
    ...(textOpacity !== undefined && textOpacity !== null ? { opacity: textOpacity } : {}),
    ...(bgColor ? { backgroundColor: bgColor } : {}),
    ...userStyle,
  }

  if (isRichText && typeof textContent === "string") {
    return (
      <Component
        className={cn("prose max-w-none dark:prose-invert", className)}
        style={computedStyle}
        dangerouslySetInnerHTML={{ __html: textContent }}
        {...props}
      />
    )
  }

  return (
    <Component className={className} style={computedStyle} {...props}>
      {textContent}
    </Component>
  )
}
