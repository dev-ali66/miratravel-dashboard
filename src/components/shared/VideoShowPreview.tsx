import { cn } from "@/lib/utils"

export interface VideoShowPreviewProps {
  src: string
  poster?: string
  alt?: string
  mode?: "background" | "foreground"
  className?: string
  style?: React.CSSProperties
  autoplay?: boolean
  muted?: boolean
  loop?: boolean
  opacity?: number
  overlayColor?: string
  overlayOpacity?: number
  fit?: "cover" | "contain" | "fill" | "none" | "scale-down"
  aspectRatio?: string
}

export function VideoShowPreview({
  src,
  poster,
  alt = "Video preview",
  mode = "foreground",
  className,
  style,
  autoplay = true,
  muted = true,
  loop = true,
  opacity = 100,
  overlayColor = "#000000",
  overlayOpacity = 0,
  fit = "cover",
  aspectRatio,
}: VideoShowPreviewProps) {
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
        <video
          src={src}
          poster={poster || undefined}
          aria-label={alt}
          autoPlay={autoplay}
          muted={muted}
          loop={loop}
          playsInline
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
