import { cn } from "@/lib/utils"
import { Image as ImageIcon } from "lucide-react"

export interface ImageShowPreviewProps {
  src: string
  alt?: string
  mode?: "background" | "foreground"
  className?: string
  style?: React.CSSProperties
  opacity?: number
  overlayColor?: string
  overlayOpacity?: number
  fit?: "cover" | "contain" | "fill" | "none" | "scale-down"
  aspectRatio?: string
}

export function ImageShowPreview({
  src,
  alt = "Preview",
  mode = "foreground",
  className,
  style,
  opacity = 100,
  overlayColor = "#000000",
  overlayOpacity = 0,
  fit = "cover",
  aspectRatio,
}: ImageShowPreviewProps) {
  const fitClass =
    fit === "contain"
      ? "object-contain"
      : fit === "fill"
      ? "object-fill"
      : fit === "none"
      ? "object-none"
      : fit === "scale-down"
      ? "object-scale-down"
      : "object-cover"

  const hasRatio = Boolean(mode !== "background" && aspectRatio && aspectRatio !== "auto")
  const ratioVal = hasRatio && aspectRatio ? aspectRatio.replace(":", "/") : undefined

  const safeOpacity = opacity > 0 && opacity <= 1 ? opacity * 100 : opacity

  return (
    <div
      className={cn(
        "relative overflow-hidden w-full h-full",
        mode === "background" && "absolute inset-0 h-full w-full",
        className
      )}
      style={{
        ...(mode !== "background" && hasRatio ? { aspectRatio: ratioVal } : {}),
        ...style,
      }}
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          className={cn("h-full w-full", fitClass)}
          style={{
            ...(mode !== "background" && hasRatio ? { aspectRatio: ratioVal } : {}),
            opacity: safeOpacity / 100,
          }}
        />
      ) : (
        <div
          className={cn(
            "group relative flex h-full w-full min-h-[140px] flex-1 flex-col items-center justify-center gap-2.5 rounded-xl border-2 border-dashed border-emerald-500/30 bg-stone-100/90 dark:bg-stone-800/90 p-5 text-center select-none shadow-2xs overflow-hidden",
            mode === "background" && "rounded-none border-0 bg-neutral-900/80"
          )}
        >
          {/* Subtle Ambient Glow Background */}
          <div className="pointer-events-none absolute -top-12 -left-12 h-32 w-32 rounded-full bg-emerald-500/10 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-12 -right-12 h-32 w-32 rounded-full bg-stone-500/10 blur-2xl" />

          {/* Icon Badge */}
          <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-white dark:bg-stone-900 shadow-sm border border-emerald-500/20 text-emerald-600 shrink-0">
            <ImageIcon className="h-5 w-5" />
          </div>

          {/* Text & Dimension Specs */}
          <div className="relative flex flex-col items-center gap-1 z-10 max-w-[90%]">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-800 dark:text-stone-200">
              {alt && alt !== "Preview" ? alt : "Featured Image Slot"}
            </span>
            <span className="text-[11px] text-stone-500 dark:text-stone-400 font-medium">
              No image uploaded yet (Upload an image in the editor form)
            </span>
          </div>
        </div>
      )}

      {overlayOpacity > 0 && (
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundColor: overlayColor,
            opacity: overlayOpacity / 100,
          }}
        />
      )}
    </div>
  )
}
