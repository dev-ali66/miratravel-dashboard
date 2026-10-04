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
  /** Alias for data prop */
  value?: any
  /** Optional fallback text if field value is empty */
  fallbackText?: string
  /** Optional fallback text color if textColor is not set */
  fallbackColor?: string
  /** Set to true if rendering RichText HTML content safely */
  isRichText?: boolean
  /** Tailwind CSS classes */
  className?: string
} & Omit<ComponentPropsWithoutRef<T>, "as" | "data" | "value">

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
  value,
  fallbackText = "",
  fallbackColor,
  isRichText = false,
  className,
  style: userStyle,
  ...props
}: DynamicStyledTextPreviewProps<T>) {
  const targetData = data ?? value
  const rawValue = unwrapTextValue(targetData)

  // If value is empty string (""), null, or undefined, return null so empty fields disappear from live preview
  const textContent =
    rawValue !== ""
      ? rawValue
      : (fallbackText || null)

  if (!textContent) return null

  const textColor = findStyleProp(targetData, "textColor")
  const effectiveTextColor = textColor || fallbackColor
  const textOpacity = findStyleProp(targetData, "textOpacity")
  const bgColor = findStyleProp(targetData, "backgroundColor")

  const computedStyle = {
    ...(effectiveTextColor ? { color: effectiveTextColor } : {}),
    ...(textOpacity !== undefined && textOpacity !== null ? { opacity: textOpacity } : {}),
    ...(bgColor ? { backgroundColor: bgColor } : {}),
    ...userStyle,
  }

  // Auto-detect HTML content (or explicitly set via isRichText)
  const shouldRenderHtml = isRichText || (typeof textContent === "string" && /<[a-z][\s\S]*>/i.test(textContent))

  if (shouldRenderHtml && typeof textContent === "string") {
    // Default to "div" for HTML blocks to prevent invalid <p><p>...</p></p> HTML nesting
    const Component = (as && as !== "p" ? as : "div") as ElementType

    return (
      <Component
        className={cn(
          "prose prose-sm md:prose-base max-w-none",
          "[&_p]:my-2 [&_p:first-child]:mt-0 [&_p:last-child]:mb-0 [&_p]:leading-relaxed [&_p:not([style*='color'])]:text-current",
          "[&_ul]:list-disc [&_ul]:pl-6 [&_ul]:my-3 [&_ul]:space-y-1.5",
          "[&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:my-3 [&_ol]:space-y-1.5",
          "[&_li]:leading-relaxed [&_li_p]:my-0",
          "[&_h1]:text-2xl [&_h1]:md:text-3xl [&_h1]:font-serif [&_h1]:font-bold [&_h1]:my-4 [&_h1:not([style*='color'])]:text-current",
          "[&_h2]:text-xl [&_h2]:md:text-2xl [&_h2]:font-serif [&_h2]:font-semibold [&_h2]:my-3 [&_h2:not([style*='color'])]:text-current",
          "[&_h3]:text-lg [&_h3]:md:text-xl [&_h3]:font-serif [&_h3]:font-medium [&_h3]:my-2.5 [&_h3:not([style*='color'])]:text-current",
          "[&_blockquote]:border-l-4 [&_blockquote]:border-[#B3884D] [&_blockquote]:pl-4 [&_blockquote]:py-1 [&_blockquote]:italic [&_blockquote]:my-4 [&_blockquote:not([style*='color'])]:text-current/90",
          "[&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2 [&_a]:transition-opacity [&_a]:hover:opacity-80",
          "[&_mark:not([style*='background'])]:bg-amber-200/70 dark:[&_mark:not([style*='background'])]:bg-amber-500/30 [&_mark]:px-1.5 [&_mark]:py-0.5 [&_mark]:rounded",
          "[&_strong]:font-semibold [&_b]:font-semibold",
          className
        )}
        style={computedStyle}
        dangerouslySetInnerHTML={{ __html: textContent }}
        {...props}
      />
    )
  }

  const Component = (as || "p") as ElementType

  return (
    <Component className={cn("whitespace-pre-line", className)} style={computedStyle} {...props}>
      {textContent}
    </Component>
  )
}

/**
 * UniversalRichTextPreview
 * Direct shortcut for rendering rich text HTML content with auto HTML detection and style bindings.
 */
export function UniversalRichTextPreview(props: DynamicStyledTextPreviewProps) {
  return <DynamicStyledTextPreview isRichText={true} {...props} />
}
