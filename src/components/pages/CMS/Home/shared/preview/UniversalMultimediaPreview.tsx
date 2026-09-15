import { ImageShowPreview } from "@/components/shared/ImageShowPreview"
import { VideoShowPreview } from "@/components/shared/VideoShowPreview"
import { cn } from "@/lib/utils"

export type MultimediaShowType = "image" | "video" | "color"

export interface MultimediaImageConfig {
  url?: string | null
  alt?: string | null
  opacity?: number
  overlayColor?: string | null
  overlayOpacity?: number
  width?: string
  height?: string
  aspectRatio?: string
  fit?: "cover" | "contain" | "fill" | "none" | "scale-down"
  isFullWidth?: boolean
  isFullHeight?: boolean
}

export interface MultimediaVideoConfig {
  url?: string | null
  alt?: string | null
  autoplay?: boolean
  loop?: boolean
  muted?: boolean
  opacity?: number
  overlayColor?: string | null
  overlayOpacity?: number
  width?: string
  height?: string
  aspectRatio?: string
  fit?: "cover" | "contain" | "fill" | "none" | "scale-down"
  isFullWidth?: boolean
  isFullHeight?: boolean
}

export interface MultimediaColorConfig {
  color?: string | null
  opacity?: number
  width?: string
  height?: string
  aspectRatio?: string
  isFullWidth?: boolean
  isFullHeight?: boolean
}

export type UniversalMultimediaValue = {
  show?: MultimediaShowType
  type?: MultimediaShowType
  image?: MultimediaImageConfig
  video?: MultimediaVideoConfig
  color?: MultimediaColorConfig | string
  imageData?: MultimediaImageConfig
  videoData?: MultimediaVideoConfig
  colorData?: MultimediaColorConfig
  url?: string
  alt?: string
  opacity?: number
  overlayColor?: string
  overlayOpacity?: number
  autoplay?: boolean
  loop?: boolean
  muted?: boolean
  width?: string
  height?: string
  aspectRatio?: string
  fit?: "cover" | "contain" | "fill" | "none" | "scale-down"
  isFullWidth?: boolean
  isFullHeight?: boolean
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
  const showMode: MultimediaShowType =
    multimedia?.show ||
    multimedia?.type ||
    (multimedia?.video?.url || fallbackVideoSrc ? "video" : multimedia?.image?.url || fallbackImageSrc ? "image" : "color")

  const imageConfig: MultimediaImageConfig = {
    url: multimedia?.image?.url || (multimedia as any)?.url || fallbackImageSrc || "",
    alt: multimedia?.image?.alt || multimedia?.alt || fallbackAlt,
    opacity: multimedia?.image?.opacity ?? multimedia?.opacity ?? 100,
    overlayColor: multimedia?.image?.overlayColor ?? multimedia?.overlayColor,
    overlayOpacity: multimedia?.image?.overlayOpacity ?? multimedia?.overlayOpacity,
    width: multimedia?.image?.width ?? (multimedia as any)?.width,
    height: multimedia?.image?.height ?? (multimedia as any)?.height,
    aspectRatio: multimedia?.image?.aspectRatio ?? (multimedia as any)?.aspectRatio,
    fit: multimedia?.image?.fit ?? (multimedia as any)?.fit ?? "cover",
    isFullWidth: multimedia?.image?.isFullWidth ?? (multimedia as any)?.isFullWidth,
    isFullHeight: multimedia?.image?.isFullHeight ?? (multimedia as any)?.isFullHeight,
  }

  const videoConfig: MultimediaVideoConfig = {
    url: multimedia?.video?.url || (multimedia as any)?.url || fallbackVideoSrc || "",
    alt: multimedia?.video?.alt || multimedia?.alt || fallbackAlt,
    autoplay: multimedia?.video?.autoplay ?? multimedia?.autoplay ?? true,
    loop: multimedia?.video?.loop ?? multimedia?.loop ?? true,
    muted: multimedia?.video?.muted ?? multimedia?.muted ?? true,
    opacity: multimedia?.video?.opacity ?? multimedia?.opacity ?? 100,
    overlayColor: multimedia?.video?.overlayColor ?? multimedia?.overlayColor,
    overlayOpacity: multimedia?.video?.overlayOpacity ?? multimedia?.overlayOpacity,
    width: multimedia?.video?.width ?? (multimedia as any)?.width,
    height: multimedia?.video?.height ?? (multimedia as any)?.height,
    aspectRatio: multimedia?.video?.aspectRatio ?? (multimedia as any)?.aspectRatio,
    fit: multimedia?.video?.fit ?? (multimedia as any)?.fit ?? "cover",
    isFullWidth: multimedia?.video?.isFullWidth ?? (multimedia as any)?.isFullWidth,
    isFullHeight: multimedia?.video?.isFullHeight ?? (multimedia as any)?.isFullHeight,
  }

  const colorConfig: MultimediaColorConfig = {
    color:
      typeof multimedia?.color === "string"
        ? multimedia.color
        : multimedia?.color?.color || (multimedia as any)?.color || fallbackColor,
    opacity:
      typeof multimedia?.color === "object"
        ? multimedia?.color?.opacity ?? 100
        : multimedia?.opacity ?? 100,
    width: typeof multimedia?.color === "object" ? multimedia?.color?.width : (multimedia as any)?.width,
    height: typeof multimedia?.color === "object" ? multimedia?.color?.height : (multimedia as any)?.height,
    aspectRatio: typeof multimedia?.color === "object" ? multimedia?.color?.aspectRatio : (multimedia as any)?.aspectRatio,
    isFullWidth: typeof multimedia?.color === "object" ? multimedia?.color?.isFullWidth : (multimedia as any)?.isFullWidth,
    isFullHeight: typeof multimedia?.color === "object" ? multimedia?.color?.isFullHeight : (multimedia as any)?.isFullHeight,
  }

  const shouldShowOverlay =
    !!overlayClassName && (showMode === "image" || showMode === "video")

  const isBg = mode === "background"
  const activeConfig =
    showMode === "video" ? videoConfig : showMode === "image" ? imageConfig : colorConfig

  const hasRatio = Boolean(activeConfig.aspectRatio && activeConfig.aspectRatio !== "auto")
  const resolvedAspectRatio = hasRatio && activeConfig.aspectRatio
    ? activeConfig.aspectRatio.replace(":", "/")
    : undefined

  let resolvedWidth = activeConfig.isFullWidth
    ? "100%"
    : activeConfig.width || (isBg ? "100%" : undefined)

  let resolvedHeight = activeConfig.isFullHeight
    ? "100%"
    : activeConfig.height || (isBg && !hasRatio ? "100%" : "auto")

  if (hasRatio && !activeConfig.isFullHeight && (resolvedHeight === "100%" || !resolvedHeight)) {
    resolvedHeight = "auto"
  }

  const mediaStyle: React.CSSProperties = {
    width: resolvedWidth,
    height: resolvedHeight,
    aspectRatio: resolvedAspectRatio,
  }

  return (
    <div
      className={cn(
        "relative",
        isBg && !hasRatio && "absolute inset-0 h-full w-full",
        isBg && hasRatio && "absolute inset-0 m-auto max-h-full max-w-full flex items-center justify-center",
        containerClassName
      )}
      style={isBg && hasRatio ? { aspectRatio: resolvedAspectRatio } : undefined}
    >
      {showMode === "video" ? (
        <VideoShowPreview
          src={videoConfig.url || ""}
          alt={videoConfig.alt || fallbackAlt}
          mode={mode === "background" ? "background" : undefined}
          className={cn(isBg && !hasRatio ? "h-full w-full" : undefined, className)}
          style={mediaStyle}
          autoplay={videoConfig.autoplay ?? true}
          muted={videoConfig.muted ?? true}
          loop={videoConfig.loop ?? true}
          opacity={videoConfig.opacity ?? 100}
          overlayColor={videoConfig.overlayColor || undefined}
          overlayOpacity={videoConfig.overlayOpacity}
          fit={videoConfig.fit}
          aspectRatio={videoConfig.aspectRatio}
        />
      ) : showMode === "image" ? (
        <ImageShowPreview
          src={imageConfig.url || ""}
          alt={imageConfig.alt || fallbackAlt}
          mode={mode === "background" ? "background" : undefined}
          className={cn(isBg && !hasRatio ? "h-full w-full" : undefined, className)}
          style={mediaStyle}
          opacity={imageConfig.opacity ?? 100}
          overlayColor={imageConfig.overlayColor || undefined}
          overlayOpacity={imageConfig.overlayOpacity}
          fit={imageConfig.fit}
          aspectRatio={imageConfig.aspectRatio}
        />
      ) : (
        <div
          className={cn(isBg && !hasRatio ? "h-full w-full" : undefined, className)}
          style={{
            backgroundColor: colorConfig.color ?? fallbackColor,
            opacity:
              colorConfig.opacity !== undefined
                ? colorConfig.opacity / 100
                : undefined,
            ...mediaStyle,
          }}
        />
      )}

      {shouldShowOverlay && (
        <div className={cn("pointer-events-none absolute inset-0", overlayClassName)} />
      )}
    </div>
  )
}
