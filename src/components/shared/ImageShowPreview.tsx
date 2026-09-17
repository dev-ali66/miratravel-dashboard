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

  const hasRatio = Boolean(aspectRatio && aspectRatio !== "auto")
  const ratioVal = hasRatio && aspectRatio ? aspectRatio.replace(":", "/") : undefined

  return (
    <div
      className={cn(
        "relative overflow-hidden w-full h-full",
        mode === "background" && !hasRatio && "absolute inset-0 h-full w-full",
        mode === "background" && hasRatio && "absolute inset-0 m-auto max-h-full max-w-full",
        className
      )}
      style={{
        aspectRatio: ratioVal,
        ...style,
      }}
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          className={cn("h-full w-full", fitClass)}
          style={{
            aspectRatio: ratioVal,
            opacity: opacity / 100,
          }}
        />
      ) : (
        <div
          className={cn(
            "group relative flex h-full w-full flex-1 flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-primary/25 bg-gradient-to-br from-card/80 via-muted/40 to-background/90 p-6 text-center select-none backdrop-blur-xs transition-all duration-300 hover:border-primary/50 hover:bg-muted/50 shadow-2xs overflow-hidden",
            mode === "background" && "rounded-none border-0 bg-gradient-to-br from-neutral-900/60 via-neutral-900/40 to-neutral-900/80"
          )}
        >
          {/* Subtle Ambient Glow Background */}
          <div className="pointer-events-none absolute -top-12 -left-12 h-32 w-32 rounded-full bg-primary/10 blur-2xl transition-all group-hover:bg-primary/20" />
          <div className="pointer-events-none absolute -bottom-12 -right-12 h-32 w-32 rounded-full bg-amber-500/10 blur-2xl transition-all group-hover:bg-amber-500/20" />

          {/* Icon Badge */}
          <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-card shadow-md border border-border/70 text-primary transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg shrink-0">
            <ImageIcon className="h-6 w-6 text-primary" />
          </div>

          {/* Text & Dimension Specs */}
          <div className="relative flex flex-col items-center gap-1.5 z-10 max-w-[85%]">
            <span className="text-xs font-semibold uppercase tracking-wider text-foreground/90 font-heading">
              {alt && alt !== "Preview" ? alt : "Image Visual Slot"}
            </span>
            <div className="flex items-center gap-1.5">
              <span className="inline-flex items-center gap-1 text-[10px] font-mono font-medium text-primary bg-primary/10 px-2.5 py-0.5 rounded-full border border-primary/20 shadow-2xs">
                {aspectRatio && aspectRatio !== "auto" ? `${aspectRatio} Aspect Ratio` : "500 × 500 px • 1:1"}
              </span>
            </div>
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
