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

  const rawValue = typeof data === "object" && data !== null ? data.value : data

  // If value is empty string (""), null, or undefined, return null so empty fields disappear from live preview
  const textContent =
    rawValue !== undefined && rawValue !== null && rawValue !== ""
      ? rawValue
      : (fallbackText || null)

  if (!textContent) return null

  const textColor = typeof data === "object" ? data?.textColor : null
  const effectiveTextColor = textColor || fallbackColor
  const textOpacity = typeof data === "object" ? data?.textOpacity : null
  const bgColor = typeof data === "object" ? data?.backgroundColor : null

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
