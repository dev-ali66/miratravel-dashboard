/* =====================================================
   DYNAMIC CMS BUTTON PREVIEW
   Reusable preview component for rendering CMS Buttons
   Synced with miratravel.nl live button variants & styles
===================================================== */

import { ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

export type DynamicCmsButtonPreviewProps = {
  /** Button data object { label, url, style, variant, rounded, textColor, backgroundColor } or array of buttons */
  data?: any
  /** Alias for data prop */
  buttons?: any
  /** Default variant fallback if button object does not specify variant */
  defaultVariant?: string
  /** Tailwind CSS wrapper classes */
  className?: string
  /** ClassName for individual button link */
  buttonClassName?: string
}

export function DynamicCmsButtonPreview({
  data,
  buttons,
  defaultVariant,
  className,
  buttonClassName,
}: DynamicCmsButtonPreviewProps) {
  const targetData = buttons ?? data
  if (!targetData) return null

  const buttonsArray = Array.isArray(targetData)
    ? targetData
    : typeof targetData === "object" && targetData.label
      ? [targetData]
      : []

  if (buttonsArray.length === 0) return null

  return (
    <div className={cn("flex flex-wrap items-center gap-3", className)}>
      {buttonsArray.map((btn: any, idx: number) => {
        if (!btn || !btn.label) return null

        const variant = String(btn.variant || btn.style || defaultVariant || "primary").toLowerCase()
        const roundedKey = String(btn.rounded || "md").toLowerCase()

        // Border radius resolver
        const roundedClass =
          roundedKey === "full"
            ? "rounded-full"
            : roundedKey === "xl"
              ? "rounded-2xl"
              : roundedKey === "lg"
                ? "rounded-xl"
                : roundedKey === "sm"
                  ? "rounded-md"
                  : roundedKey === "none"
                    ? "rounded-none"
                    : "rounded-lg"

        // Variant style resolver
        let variantClasses = "bg-primary text-primary-foreground shadow-xs hover:opacity-90"

        if (variant === "outline") {
          variantClasses = "border border-border/80 bg-background/50 text-foreground hover:bg-muted/80 backdrop-blur-xs"
        } else if (variant === "secondary") {
          variantClasses = "bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-xs"
        } else if (variant === "dark") {
          variantClasses = "bg-neutral-900 text-neutral-100 hover:bg-neutral-800 shadow-xs"
        } else if (variant === "ghost" || variant === "link") {
          variantClasses = "bg-transparent text-accent hover:text-accent/90 p-0 shadow-none hover:underline font-medium"
        } else if (variant === "pill" || variant === "badge") {
          variantClasses = "rounded-full bg-black/40 text-neutral-100 uppercase text-xs tracking-wider px-4 py-1.5 backdrop-blur-xs border border-white/20"
        }

        const isGhost = variant === "ghost" || variant === "link"
        const showIcon = btn.showIcon !== undefined ? Boolean(btn.showIcon) : isGhost

        return (
          <a
            key={idx}
            href={btn.url || "#"}
            target={btn.target || "_self"}
            rel={btn.target === "_blank" ? "noopener noreferrer" : undefined}
            style={{
              ...(btn.backgroundColor ? { backgroundColor: btn.backgroundColor } : {}),
              ...(btn.textColor ? { color: btn.textColor } : {}),
              ...(btn.borderColor ? { borderColor: btn.borderColor } : {}),
            }}
            className={cn(
              "inline-flex items-center justify-center gap-2 font-semibold text-sm transition-all duration-200 cursor-pointer",
              !isGhost && "px-5 py-2.5",
              roundedClass,
              variantClasses,
              buttonClassName
            )}
          >
            <span>{btn.label}</span>
            {showIcon && <ArrowRight className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5" />}
          </a>
        )
      })}
    </div>
  )
}
