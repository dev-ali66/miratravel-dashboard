import { cn } from "@/lib/utils"

interface ImageShowPreviewProps {
  src: string
  alt?: string
  mode?: "background" | "foreground"
  className?: string
  opacity?: number
  overlayColor?: string
  overlayOpacity?: number
}

export function ImageShowPreview({
  src,
  alt = "Preview",
  mode = "foreground",
  className,
  opacity = 100,
  overlayColor = "#000000",
  overlayOpacity = 0,
}: ImageShowPreviewProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden",
        mode === "background" && "absolute inset-0",
        className
      )}
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          className="h-full w-full object-cover"
          style={{ opacity: opacity / 100 }}
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
