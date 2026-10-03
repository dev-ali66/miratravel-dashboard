import { cn } from "@/lib/utils"
import { Video as VideoIcon } from "lucide-react"

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
            ...(mode !== "background" && hasRatio ? { aspectRatio: ratioVal } : {}),
            opacity: safeOpacity / 100,
          }}
        />
      ) : (
        <div
          className={cn(
            "group relative flex h-full w-full min-h-[140px] flex-1 flex-col items-center justify-center gap-2.5 rounded-xl border-2 border-dashed border-red-500/30 bg-stone-100/90 dark:bg-stone-800/90 p-5 text-center select-none shadow-2xs overflow-hidden",
            mode === "background" && "rounded-none border-0 bg-neutral-900/80"
          )}
        >
          {/* Subtle Ambient Glow Background */}
          <div className="pointer-events-none absolute -top-12 -left-12 h-32 w-32 rounded-full bg-red-500/10 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-12 -right-12 h-32 w-32 rounded-full bg-stone-500/10 blur-2xl" />

          {/* Icon Badge */}
          <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-white dark:bg-stone-900 shadow-sm border border-red-500/20 text-red-600 shrink-0">
            <VideoIcon className="h-5 w-5" />
          </div>

          {/* Text & Dimension Specs */}
          <div className="relative flex flex-col items-center gap-1 z-10 max-w-[90%]">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-800 dark:text-stone-200">
              {alt && alt !== "Video preview" ? alt : "Featured Video Slot"}
            </span>
            <span className="text-[11px] text-stone-500 dark:text-stone-400 font-medium">
              No video uploaded yet (Upload a video in the editor form)
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
