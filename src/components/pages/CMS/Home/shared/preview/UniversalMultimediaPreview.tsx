import { ImageShowPreview } from "@/components/shared/ImageShowPreview"
import { VideoShowPreview } from "@/components/shared/VideoShowPreview"
import { cn } from "@/lib/utils"

export type UniversalMultimediaValue = {
  type?: "image" | "video" | "color"
  color?: string
  url?: string
  alt?: string
  opacity?: number
  overlayColor?: string
  overlayOpacity?: number
  autoplay?: boolean
  loop?: boolean
  muted?: boolean
}

export type UniversalMultimediaPreviewProps = {
  multimedia?: UniversalMultimediaValue
  fallbackImageSrc?: string
  fallbackVideoSrc?: string
  fallbackAlt?: string
  fallbackColor?: string
  mode?: "background" | "inline"
  className?: string
  containerClassName?: string
  overlayClassName?: string
}

export function UniversalMultimediaPreview({
  multimedia,
  fallbackImageSrc,
  fallbackVideoSrc,
  fallbackAlt = "Preview media",
  fallbackColor = "transparent",
  mode = "inline",
  className,
  containerClassName,
  overlayClassName,
}: UniversalMultimediaPreviewProps) {
  const resolvedType =
    multimedia?.type ??
    (multimedia?.url
      ? fallbackVideoSrc && multimedia?.autoplay !== undefined
        ? "video"
        : "image"
      : "color")

  const shouldShowOverlay = !!overlayClassName && (resolvedType === "image" || resolvedType === "video")

  return (
    <div className={cn("relative", containerClassName)}>
      {resolvedType === "video" ? (
        <VideoShowPreview
          src={multimedia?.url || fallbackVideoSrc || ""}
          poster={fallbackImageSrc}
          alt={multimedia?.alt || fallbackAlt}
          mode={mode === "background" ? "background" : undefined}
          className={cn("h-full w-full", className)}
          autoplay={multimedia?.autoplay ?? true}
          muted={multimedia?.muted ?? true}
          loop={multimedia?.loop ?? true}
          opacity={multimedia?.opacity ?? 100}
          overlayColor={multimedia?.overlayColor}
          overlayOpacity={multimedia?.overlayOpacity}
        />
      ) : resolvedType === "image" ? (
        <ImageShowPreview
          src={multimedia?.url || fallbackImageSrc || ""}
          alt={multimedia?.alt || fallbackAlt}
          mode={mode === "background" ? "background" : undefined}
          className={cn("h-full w-full", className)}
          opacity={multimedia?.opacity ?? 100}
          overlayColor={multimedia?.overlayColor}
          overlayOpacity={multimedia?.overlayOpacity}
        />
      ) : (
        <div
          className={cn("h-full w-full", className)}
          style={{ backgroundColor: multimedia?.color ?? fallbackColor }}
        />
      )}

      {shouldShowOverlay && <div className={cn("absolute inset-0", overlayClassName)} />}
    </div>
  )
}
