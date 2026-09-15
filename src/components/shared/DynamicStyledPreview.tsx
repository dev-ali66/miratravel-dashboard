import * as React from "react"
import { fieldCssStyle } from "@/components/pages/CMS/shared/fieldStyle"
import { cn } from "@/lib/utils"

export type PreviewElementType =
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "p"
  | "span"
  | "div"
  | "label"
  | "blockquote"
  | "code"
  | "article"
  | "section"

export type PreviewFieldType = "text" | "textarea" | "richtext" | "number" | "badge" | "auto"

export interface DynamicStyledPreviewProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "prefix"> {
  as?: PreviewElementType
  type?: PreviewFieldType
  field?: any
  styleObj?: any
  fallback?: React.ReactNode
  fallbackColor?: string
  prefix?: React.ReactNode
  suffix?: React.ReactNode
  formatNumber?: boolean
  className?: string
  style?: React.CSSProperties
}

/* Helper to detect if a string contains HTML markup */
function isHtml(input: any): boolean {
  if (typeof input !== "string") return false
  return /<\/?[a-z][\s\S]*>/i.test(input.trim())
}

/**
 * Universal Dynamic Styled Preview Component
 * Handles unified objects { value, textColor, ... } and plain strings/numbers.
 * Automatically applies colors, opacity, rich text HTML, and custom elements.
 */
export function DynamicStyledPreview({
  as: Component = "span",
  type = "auto",
  field,
  styleObj,
  fallback = null,
  fallbackColor,
  prefix,
  suffix,
  formatNumber = false,
  className,
  style: explicitStyle,
  ...rest
}: DynamicStyledPreviewProps) {
  // Extract raw value and style object
  let rawValue: any
  if (Array.isArray(field)) {
    rawValue = field.map((item) =>
      item && typeof item === "object" && item.value !== undefined ? item.value : item
    )
  } else if (field && typeof field === "object" && field.value !== undefined) {
    rawValue = field.value
  } else {
    rawValue = field
  }

  const targetStyle =
    styleObj || (field && typeof field === "object" && !Array.isArray(field) ? field : undefined)

  // Generate dynamic CSS properties from style object
  const dynamicCss = fieldCssStyle(targetStyle, fallbackColor)

  const mergedStyle: React.CSSProperties = {
    ...dynamicCss,
    ...explicitStyle,
  }

  // Handle empty or nullish value
  const isEmpty =
    rawValue === undefined ||
    rawValue === null ||
    rawValue === "" ||
    (typeof rawValue === "string" && rawValue.trim() === "") ||
    (Array.isArray(rawValue) && rawValue.length === 0)

  if (isEmpty) {
    if (!fallback) return null

    return (
      <Component
        className={cn("opacity-40 italic", className)}
        style={mergedStyle}
        {...rest}
      >
        {prefix}
        {fallback}
        {suffix}
      </Component>
    )
  }

  // Check for rich text / HTML rendering
  const hasHtml =
    (typeof rawValue === "string" && isHtml(rawValue)) ||
    (Array.isArray(rawValue) && rawValue.some(isHtml))

  const isRichText = type === "richtext" || (type === "auto" && hasHtml)

  if (isRichText) {
    let htmlContent = ""

    if (Array.isArray(rawValue)) {
      htmlContent = rawValue
        .map((item) => {
          const str = String(item ?? "").trim()
          if (!str) return "<p><br /></p>"
          if (isHtml(str)) return str
          return `<p>${str.replace(/\n/g, "<br />")}</p>`
        })
        .join("")
    } else if (typeof rawValue === "string") {
      const trimmed = rawValue.trim()
      if (isHtml(trimmed)) {
        // Ensure empty paragraph tags contain <br /> so browsers don't collapse them to 0 height
        htmlContent = trimmed.replace(/<p>\s*<\/p>/gi, "<p><br /></p>")
      } else {
        htmlContent = rawValue
          .split(/\n\n+/)
          .map((p) => {
            const trimmedP = p.trim()
            if (!trimmedP) return "<p><br /></p>"
            return `<p>${trimmedP.replace(/\n/g, "<br />")}</p>`
          })
          .join("")
      }
    } else {
      htmlContent = String(rawValue)
    }

    const Tag = Component === "span" ? "div" : Component
    return (
      <Tag
        className={cn(
          "w-full leading-relaxed",
          "[&_p]:mb-3.5 @xs:[&_p]:mb-4 @sm:[&_p]:mb-5 [&_p:last-child]:mb-0",
          "[&_p]:min-h-[1.5em]",
          "[&_p:empty]:min-h-[1.5em] [&_p:empty]:before:content-['\\00a0'] [&_p:empty]:inline-block",
          "[&_p:has(>br:only-child)]:min-h-[1.5em]",
          "[&_p:has(>br.ProseMirror-trailingBreak:only-child)]:min-h-[1.5em]",
          "[&_blockquote]:border-l-2 [&_blockquote]:border-border-muted [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:my-3",
          "[&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-2",
          "[&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:my-2",
          "[&_li]:my-1",
          "[&_h1]:text-2xl [&_h1]:font-bold [&_h1]:my-3",
          "[&_h2]:text-xl [&_h2]:font-bold [&_h2]:my-2.5",
          "[&_h3]:text-lg [&_h3]:font-semibold [&_h3]:my-2",
          className
        )}
        style={mergedStyle}
        dangerouslySetInnerHTML={{ __html: htmlContent }}
        {...rest}
      />
    )
  }

  // Handle number type formatting
  let displayValue: React.ReactNode = rawValue
  if (type === "number" || typeof rawValue === "number") {
    if (formatNumber && typeof rawValue === "number") {
      displayValue = rawValue.toLocaleString()
    } else {
      displayValue = String(rawValue)
    }
  }

  // Handle badge rendering
  if (type === "badge") {
    return (
      <Component
        className={cn(
          "inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider",
          !targetStyle?.backgroundColor && "bg-primary/10 text-primary",
          className
        )}
        style={mergedStyle}
        {...rest}
      >
        {prefix}
        {displayValue}
        {suffix}
      </Component>
    )
  }

  // Handle textarea or multiline string rendering
  if (type === "textarea" || (typeof rawValue === "string" && rawValue.includes("\n"))) {
    return (
      <Component className={cn("whitespace-pre-line", className)} style={mergedStyle} {...rest}>
        {prefix}
        {displayValue}
        {suffix}
      </Component>
    )
  }

  // Default standard rendering
  return (
    <Component className={className} style={mergedStyle} {...rest}>
      {prefix}
      {displayValue}
      {suffix}
    </Component>
  )
}

/* Convenience alias */
export const DynamicStyledText = DynamicStyledPreview
export default DynamicStyledPreview
