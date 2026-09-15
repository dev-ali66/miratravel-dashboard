import { cn } from "@/lib/utils"

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
        "relative overflow-hidden",
        mode === "background" && !hasRatio && "absolute inset-0",
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
      ) : null}

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
