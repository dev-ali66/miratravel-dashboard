import { useEffect } from "react"
import { ColorField, DynamicStyledField, TextField } from "./FormControls"
import type { HomeSection } from "../Home/homeTypes"

type BackgroundType = "image" | "video" | "color"

type MediaItem = {
  type?: BackgroundType
  color?: string | null
  imageData?: MediaItem
  videoData?: MediaItem
  image?: MediaItem
  video?: MediaItem
  url?: string | null
  alt?: string | null
  poster?: string | null
  opacity?: number
  overlayColor?: string | null
  overlayOpacity?: number
  autoplay?: boolean
  loop?: boolean
  muted?: boolean
}

export type UniversalMultimediaFormProps = {
  section: HomeSection
  content: Record<string, any>
  updateSection: (patch: Partial<HomeSection>) => void
  updateSectionContent: (patch: Record<string, any>) => void

  contentMediaKey?: string

  sectionTitle?: string
  showColorPicker?: boolean
  colorLabel?: string
  defaultColor?: string

  enableTypeSelector?: boolean
  backgroundType?: BackgroundType
  onBackgroundTypeChange?: (type: BackgroundType) => void
  onColorChange?: (color: string) => void
  backgroundTypeStyleKey?: string

  image?: MediaItem
  onImageChange?: (next: MediaItem) => void
  imageTitle?: string
  imageLabel?: string
  imageFieldName?: string
  imageAltStyleKey?: string
  showImageAltField?: boolean

  video?: MediaItem
  onVideoChange?: (next: MediaItem) => void
  videoTitle?: string
  videoLabel?: string
  videoHint?: string
  videoFieldName?: string
  videoAltStyleKey?: string
  showVideoAltField?: boolean
  showVideoSwitches?: boolean
  allowImage?: boolean
  allowVideo?: boolean
}

const normalizeTextValue = (value: string | number | undefined) => {
  if (typeof value === "string") return value
  if (value === undefined || value === null) return ""
  return String(value)
}

export function UniversalMultimediaForm({
  section,
  content,
  updateSection,
  updateSectionContent,
  contentMediaKey,
  sectionTitle = "Background",
  showColorPicker = true,
  colorLabel = "Background color",
  defaultColor = "#FBF9F5",
  enableTypeSelector = true,
  backgroundType,
  onBackgroundTypeChange,
  onColorChange,
  image,
  onImageChange,
  imageTitle = "Background Image",
  imageLabel = "Background image",
  imageFieldName = "homeBackgroundImage",
  showImageAltField = true,
  video,
  onVideoChange,
  videoTitle = "Background Video",
  videoLabel = "Background video",
  videoHint,
  videoFieldName = "homeBackgroundVideo",
  showVideoAltField = true,
  showVideoSwitches = true,
  allowImage = true,
  allowVideo = true,
}: UniversalMultimediaFormProps) {
  const safeContent = (content ?? {}) as Record<string, any>
  const safeSection = (section ?? {}) as any

  const contentMedia = contentMediaKey
    ? ((safeContent[contentMediaKey] ?? {}) as MediaItem & {
        type?: BackgroundType
      })
    : undefined

  const cleanStringOrNull = (val: any): string | null => {
    if (typeof val === "string" && val.trim() !== "") return val.trim()
    return null
  }

  // Guarantee that if a contentMediaKey is configured, it is never absent from the draft.
  useEffect(() => {
    if (contentMediaKey && safeContent[contentMediaKey] === undefined) {
      const emptyImg = {
        url: null,
        alt: null,
        opacity: 100,
        overlayColor: "#000000",
        overlayOpacity: 0,
      }
      const emptyVid = {
        url: null,
        alt: null,
        poster: null,
        autoplay: true,
        loop: true,
        muted: true,
        opacity: 100,
        overlayColor: "#000000",
        overlayOpacity: 0,
      }
      updateSectionContent({
        [contentMediaKey]: {
          type: backgroundType ?? "image",
          color: defaultColor || "#F8F6F0",
          url: null,
          alt: null,
          image: emptyImg,
          imageData: emptyImg,
          video: emptyVid,
          videoData: emptyVid,
        },
      })
    }
  }, [contentMediaKey])

  const resolvedImage =
    image ??
    contentMedia?.image ??
    contentMedia?.imageData ??
    contentMedia ??
    safeSection.bgImages?.[0] ??
    {}
  const resolvedVideo =
    video ??
    contentMedia?.video ??
    contentMedia?.videoData ??
    contentMedia ??
    safeSection.bgVideos?.[0] ??
    {}

  const resolvedType: BackgroundType =
    backgroundType ??
    contentMedia?.type ??
    safeSection.backgroundType ??
    (safeSection.showVideo ? "video" : resolvedImage.url ? "image" : "color")

  const currentType = enableTypeSelector ? resolvedType : undefined

  const handleTypeChange = (type: BackgroundType) => {
    if (onBackgroundTypeChange) {
      onBackgroundTypeChange(type)
      return
    }

    if (contentMediaKey) {
      const resolvedUrl =
        type === "video"
          ? (contentMedia?.video?.url ?? contentMedia?.videoData?.url ?? null)
          : type === "image"
            ? (contentMedia?.image?.url ?? contentMedia?.imageData?.url ?? null)
            : null
      const resolvedAlt =
        type === "video"
          ? (contentMedia?.video?.alt ?? contentMedia?.videoData?.alt ?? null)
          : type === "image"
            ? (contentMedia?.image?.alt ?? contentMedia?.imageData?.alt ?? null)
            : null

      updateSectionContent({
        [contentMediaKey]: {
          ...(contentMedia ?? {}),
          type,
          url: cleanStringOrNull(resolvedUrl),
          alt: cleanStringOrNull(resolvedAlt),
        },
      })
      return
    }

    updateSection({
      backgroundType: type,
      showVideo: type === "video",
    })
  }

  const showColor =
    showColorPicker && (!enableTypeSelector || currentType === "color")
  const showImage =
    allowImage && (!enableTypeSelector || currentType === "image")
  const showVideo =
    allowVideo && (!enableTypeSelector || currentType === "video")

  const resolvedColor = contentMediaKey
    ? (contentMedia?.color ?? defaultColor)
    : (safeSection.bgColor ?? defaultColor)

  const applyColorChange = (nextColor: string) => {
    if (onColorChange) {
      onColorChange(nextColor)
      return
    }

    if (contentMediaKey) {
      updateSectionContent({
        [contentMediaKey]: {
          ...(contentMedia ?? {}),
          type: "color",
          color: cleanStringOrNull(nextColor) ?? defaultColor,
          url: null,
        },
      })
      return
    }

    updateSection({ bgColor: nextColor })
  }

  const applyImageChange = (next: MediaItem) => {
    if (onImageChange) {
      onImageChange(next)
      return
    }

    if (contentMediaKey) {
      const resolvedUrl = cleanStringOrNull(next.url)
      const resolvedAlt = cleanStringOrNull(next.alt)
      const nextImageData = {
        ...(contentMedia?.image ?? contentMedia?.imageData ?? {}),
        ...next,
        url: resolvedUrl,
        alt: resolvedAlt,
        opacity: next.opacity ?? 100,
        overlayColor: cleanStringOrNull(next.overlayColor) || "#000000",
        overlayOpacity: next.overlayOpacity ?? 0,
      }
      const existingVideoData = contentMedia?.video ?? contentMedia?.videoData ?? {
        url: null,
        alt: null,
        poster: null,
        autoplay: true,
        loop: true,
        muted: true,
        opacity: 100,
        overlayColor: "#000000",
        overlayOpacity: 0,
      }
      updateSectionContent({
        [contentMediaKey]: {
          ...(contentMedia ?? {}),
          type: "image",
          url: resolvedUrl,
          alt: resolvedAlt,
          opacity: next.opacity ?? 100,
          overlayColor: cleanStringOrNull(next.overlayColor) || "#000000",
          overlayOpacity: next.overlayOpacity ?? 0,
          color: cleanStringOrNull(next.color) ?? cleanStringOrNull(contentMedia?.color) ?? defaultColor,
          image: nextImageData,
          imageData: nextImageData,
          video: existingVideoData,
          videoData: existingVideoData,
        },
      })
      return
    }

    updateSection({ bgImages: [next as any] })
  }

  const applyVideoChange = (next: MediaItem) => {
    if (onVideoChange) {
      onVideoChange(next)
      return
    }

    if (contentMediaKey) {
      const resolvedUrl = cleanStringOrNull(next.url)
      const resolvedAlt = cleanStringOrNull(next.alt)
      const resolvedPoster = cleanStringOrNull((next as any)?.poster || (next as any)?.posterUrl)
      const nextVideoData = {
        ...(contentMedia?.video ?? contentMedia?.videoData ?? {}),
        ...next,
        url: resolvedUrl,
        alt: resolvedAlt,
        poster: resolvedPoster,
        autoplay: next.autoplay ?? true,
        loop: next.loop ?? true,
        muted: next.muted ?? true,
        opacity: next.opacity ?? 100,
        overlayColor: cleanStringOrNull(next.overlayColor) || "#000000",
        overlayOpacity: next.overlayOpacity ?? 0,
      }
      const existingImageData = contentMedia?.image ?? contentMedia?.imageData ?? {
        url: null,
        alt: null,
        opacity: 100,
        overlayColor: "#000000",
        overlayOpacity: 0,
      }
      updateSectionContent({
        [contentMediaKey]: {
          ...(contentMedia ?? {}),
          type: "video",
          url: resolvedUrl,
          alt: resolvedAlt,
          opacity: next.opacity ?? 100,
          overlayColor: cleanStringOrNull(next.overlayColor) || "#000000",
          overlayOpacity: next.overlayOpacity ?? 0,
          color: cleanStringOrNull(next.color) ?? cleanStringOrNull(contentMedia?.color) ?? defaultColor,
          video: nextVideoData,
          videoData: nextVideoData,
          image: existingImageData,
          imageData: existingImageData,
        },
      })
      return
    }

    updateSection({ bgVideos: [next as any] })
  }

  return (
    <div className="rounded-md border border-border/50 p-3">
      <p className="mb-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
        {sectionTitle}
      </p>

      <div className="flex flex-col gap-4">
        {enableTypeSelector && (
          <DynamicStyledField
            type="select"
            label="Background Type"
            value={currentType}
            onChange={(value) => handleTypeChange(value as BackgroundType)}
            options={[
              { value: "image", label: "Show Background Image" },
              { value: "video", label: "Show Background Video" },
              { value: "color", label: "Show Background Color" },
            ]}
          />
        )}

        {showColor && (
          <ColorField
            label={colorLabel}
            value={resolvedColor}
            onChange={(value: string) => applyColorChange(value)}
          />
        )}

        {showImage && (
          <div className="rounded-md border border-border/40 p-3">
            <p className="mb-3 text-[11px] font-semibold text-foreground">
              {imageTitle}
            </p>

            <div className="flex flex-col gap-3">
              <DynamicStyledField
                type="image"
                label={imageLabel}
                value={resolvedImage.url ?? ""}
                opacity={resolvedImage.opacity ?? 100}
                onOpacityChange={(value) =>
                  applyImageChange({ ...resolvedImage, opacity: value })
                }
                overlayColor={resolvedImage.overlayColor ?? "#000000"}
                onOverlayColorChange={(value) =>
                  applyImageChange({ ...resolvedImage, overlayColor: value })
                }
                overlayOpacity={resolvedImage.overlayOpacity ?? 0}
                onOverlayOpacityChange={(value) =>
                  applyImageChange({ ...resolvedImage, overlayOpacity: value })
                }
                fieldName={imageFieldName}
                onChange={(value) =>
                  applyImageChange({ ...resolvedImage, url: value })
                }
              />

              {showImageAltField && (
                <TextField
                  label="Image alt text"
                  value={normalizeTextValue(resolvedImage.alt) ?? ""}
                  onChange={(value) =>
                    applyImageChange({
                      ...resolvedImage,
                      alt: normalizeTextValue(value),
                    })
                  }
                />
              )}
            </div>
          </div>
        )}

        {showVideo && (
          <div className="rounded-md border border-border/40 p-3">
            <p className="mb-1 text-[11px] font-semibold text-foreground">
              {videoTitle}
            </p>
            {videoHint && (
              <p className="mb-3 text-[10px] text-muted-foreground">
                {videoHint}
              </p>
            )}

            <div className="flex flex-col gap-4">
              <DynamicStyledField
                type="video"
                label={videoLabel}
                value={resolvedVideo.url ?? ""}
                opacity={resolvedVideo.opacity ?? 100}
                onOpacityChange={(value) =>
                  applyVideoChange({ ...resolvedVideo, opacity: value })
                }
                overlayColor={resolvedVideo.overlayColor ?? "#000000"}
                onOverlayColorChange={(value) =>
                  applyVideoChange({ ...resolvedVideo, overlayColor: value })
                }
                overlayOpacity={resolvedVideo.overlayOpacity ?? 0}
                onOverlayOpacityChange={(value) =>
                  applyVideoChange({ ...resolvedVideo, overlayOpacity: value })
                }
                fieldName={videoFieldName}
                onChange={(value) =>
                  applyVideoChange({ ...resolvedVideo, url: value })
                }
              />

              {showVideoAltField && (
                <TextField
                  label="Video alt text"
                  value={normalizeTextValue(resolvedVideo.alt) ?? ""}
                  onChange={(value) =>
                    applyVideoChange({
                      ...resolvedVideo,
                      alt: normalizeTextValue(value),
                    })
                  }
                />
              )}

              {showVideoSwitches && (
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-4">
                  <DynamicStyledField
                    type="switch"
                    label="Loop"
                    checked={resolvedVideo.loop ?? true}
                    onChange={(checked) =>
                      applyVideoChange({ ...resolvedVideo, loop: checked })
                    }
                  />
                  <DynamicStyledField
                    type="switch"
                    label="Autoplay"
                    checked={resolvedVideo.autoplay ?? true}
                    onChange={(checked) =>
                      applyVideoChange({ ...resolvedVideo, autoplay: checked })
                    }
                  />
                  <DynamicStyledField
                    type="switch"
                    label="Muted"
                    checked={resolvedVideo.muted ?? true}
                    onChange={(checked) =>
                      applyVideoChange({ ...resolvedVideo, muted: checked })
                    }
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
