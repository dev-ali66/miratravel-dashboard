import { ImageShowPreview } from "@/components/shared/ImageShowPreview"
import { VideoShowPreview } from "@/components/shared/VideoShowPreview"
import { cn } from "@/lib/utils"

export type UniversalMultimediaValue = {
  type?: "image" | "video" | "color"
  color?: string
  url?: string
  alt?: string
  imageData?: UniversalMultimediaValue
  videoData?: UniversalMultimediaValue
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
  const resolvedMultimedia = multimedia
    ? {
        ...multimedia,
        ...(multimedia.type === "video"
          ? multimedia.videoData
          : multimedia.imageData),
        type: multimedia.type,
      }
    : undefined

  const resolvedType =
    resolvedMultimedia?.type ??
    (resolvedMultimedia?.url
      ? fallbackVideoSrc && resolvedMultimedia?.autoplay !== undefined
        ? "video"
        : "image"
      : "color")

  const shouldShowOverlay =
    !!overlayClassName && (resolvedType === "image" || resolvedType === "video")

  return (
    <div className={cn("relative", containerClassName)}>
      {resolvedType === "video" ? (
        <VideoShowPreview
          src={resolvedMultimedia?.url || fallbackVideoSrc || ""}
          poster={fallbackImageSrc}
          alt={resolvedMultimedia?.alt || fallbackAlt}
          mode={mode === "background" ? "background" : undefined}
          className={cn("h-full w-full", className)}
          autoplay={resolvedMultimedia?.autoplay ?? true}
          muted={resolvedMultimedia?.muted ?? true}
          loop={resolvedMultimedia?.loop ?? true}
          opacity={resolvedMultimedia?.opacity ?? 100}
          overlayColor={resolvedMultimedia?.overlayColor}
          overlayOpacity={resolvedMultimedia?.overlayOpacity}
        />
      ) : resolvedType === "image" ? (
        <ImageShowPreview
          src={resolvedMultimedia?.url || fallbackImageSrc || ""}
          alt={resolvedMultimedia?.alt || fallbackAlt}
          mode={mode === "background" ? "background" : undefined}
          className={cn("h-full w-full", className)}
          opacity={resolvedMultimedia?.opacity ?? 100}
          overlayColor={resolvedMultimedia?.overlayColor}
          overlayOpacity={resolvedMultimedia?.overlayOpacity}
        />
      ) : (
        <div
          className={cn("h-full w-full", className)}
          style={{
            backgroundColor: resolvedMultimedia?.color ?? fallbackColor,
          }}
        />
      )}

      {shouldShowOverlay && (
        <div className={cn("absolute inset-0", overlayClassName)} />
      )}
    </div>
  )
}
