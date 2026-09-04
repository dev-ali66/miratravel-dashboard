import { ColorField, DynamicStyledField } from "../../../shared/FormControls"
import type { HomeSection } from "../../homeTypes"

type BackgroundType = "image" | "video" | "color"

type MediaItem = {
  type?: BackgroundType
  color?: string
  imageData?: MediaItem
  videoData?: MediaItem
  url?: string
  alt?: string
  opacity?: number
  overlayColor?: string
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
  backgroundTypeStyleKey,
  image,
  onImageChange,
  imageTitle = "Background Image",
  imageLabel = "Background image",
  imageFieldName = "homeBackgroundImage",
  imageAltStyleKey,
  showImageAltField = true,
  video,
  onVideoChange,
  videoTitle = "Background Video",
  videoLabel = "Background video",
  videoHint,
  videoFieldName = "homeBackgroundVideo",
  videoAltStyleKey,
  showVideoAltField = true,
  showVideoSwitches = true,
  allowImage = true,
  allowVideo = true,
}: UniversalMultimediaFormProps) {
  const contentMedia = contentMediaKey
    ? ((content[contentMediaKey] ?? {}) as MediaItem & { type?: BackgroundType })
    : undefined

  const resolvedImage =
    image ??
    contentMedia?.imageData ??
    contentMedia ??
    section.bgImages?.[0] ??
    {}
  const resolvedVideo =
    video ??
    contentMedia?.videoData ??
    contentMedia ??
    section.bgVideos?.[0] ??
    {}

  const resolvedType: BackgroundType =
    backgroundType ??
    contentMedia?.type ??
    section.backgroundType ??
    (section.showVideo ? "video" : resolvedImage.url ? "image" : "color")

  const currentType = enableTypeSelector ? resolvedType : undefined

  const handleTypeChange = (type: BackgroundType) => {
    if (onBackgroundTypeChange) {
      onBackgroundTypeChange(type)
      return
    }

    if (contentMediaKey) {
      updateSectionContent({
        [contentMediaKey]: {
          ...(contentMedia ?? {}),
          type,
          imageData: contentMedia?.imageData ?? (contentMedia ?? {}),
          videoData: contentMedia?.videoData ?? (contentMedia ?? {}),
        },
      })
      return
    }

    updateSection({
      backgroundType: type,
      showVideo: type === "video",
    })
  }

  const showColor = showColorPicker && (!enableTypeSelector || currentType === "color")
  const showImage = allowImage && (!enableTypeSelector || currentType === "image")
  const showVideo = allowVideo && (!enableTypeSelector || currentType === "video")

  const resolvedColor =
    contentMediaKey
      ? (contentMedia?.color ?? defaultColor)
      : (section.bgColor ?? defaultColor)

  const applyColorChange = (nextColor: string) => {
    if (contentMediaKey) {
      updateSectionContent({
        [contentMediaKey]: {
          ...(contentMedia ?? {}),
          color: nextColor,
          imageData: contentMedia?.imageData ?? (contentMedia ?? {}),
          videoData: contentMedia?.videoData ?? (contentMedia ?? {}),
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
      const nextImageData = {
        ...(contentMedia?.imageData ?? contentMedia ?? {}),
        ...next,
      }
      updateSectionContent({
        [contentMediaKey]: {
          ...(contentMedia ?? {}),
          type: "image",
          imageData: nextImageData,
          videoData: contentMedia?.videoData ?? (contentMedia ?? {}),
          ...next,
        },
      })
      return
    }

    updateSection({ bgImages: [next] })
  }

  const applyVideoChange = (next: MediaItem) => {
    if (onVideoChange) {
      onVideoChange(next)
      return
    }

    if (contentMediaKey) {
      const nextVideoData = {
        ...(contentMedia?.videoData ?? contentMedia ?? {}),
        ...next,
      }
      updateSectionContent({
        [contentMediaKey]: {
          ...(contentMedia ?? {}),
          type: "video",
          videoData: nextVideoData,
          imageData: contentMedia?.imageData ?? (contentMedia ?? {}),
          ...next,
        },
      })
      return
    }

    updateSection({ bgVideos: [next] })
  }

  return (
    <div className="rounded-md border border-border/50 p-3">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {sectionTitle}
      </p>

      <div className="flex flex-col gap-4">
        {enableTypeSelector && (
          <DynamicStyledField
            type="select"
            label="Background Type"
            value={currentType}
            onChange={(value) => handleTypeChange(value as BackgroundType)}
            enableStyle={!!backgroundTypeStyleKey}
            style={backgroundTypeStyleKey ? content[backgroundTypeStyleKey] : undefined}
            onStyleChange={
              backgroundTypeStyleKey
                ? (style) => updateSectionContent({ [backgroundTypeStyleKey]: style })
                : undefined
            }
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
            <p className="mb-3 text-[11px] font-semibold text-foreground">{imageTitle}</p>

            <div className="flex flex-col gap-3">
              <DynamicStyledField
                type="image"
                label={imageLabel}
                value={resolvedImage.url ?? ""}
                opacity={resolvedImage.opacity ?? 100}
                onOpacityChange={(value) => applyImageChange({ ...resolvedImage, opacity: value })}
                overlayColor={resolvedImage.overlayColor ?? "#000000"}
                onOverlayColorChange={(value) =>
                  applyImageChange({ ...resolvedImage, overlayColor: value })
                }
                overlayOpacity={resolvedImage.overlayOpacity ?? 0}
                onOverlayOpacityChange={(value) =>
                  applyImageChange({ ...resolvedImage, overlayOpacity: value })
                }
                fieldName={imageFieldName}
                onChange={(value) => applyImageChange({ ...resolvedImage, url: value })}
              />

              {showImageAltField && (
                <DynamicStyledField
                  type="text"
                  label="Image alt text"
                  value={normalizeTextValue(resolvedImage.alt) ?? ""}
                  onChange={(value) =>
                    applyImageChange({ ...resolvedImage, alt: normalizeTextValue(value) })
                  }
                  enableStyle={!!imageAltStyleKey}
                  style={imageAltStyleKey ? content[imageAltStyleKey] : undefined}
                  onStyleChange={
                    imageAltStyleKey
                      ? (style) => updateSectionContent({ [imageAltStyleKey]: style })
                      : undefined
                  }
                />
              )}
            </div>
          </div>
        )}

        {showVideo && (
          <div className="rounded-md border border-border/40 p-3">
            <p className="mb-1 text-[11px] font-semibold text-foreground">{videoTitle}</p>
            {videoHint && <p className="mb-3 text-[10px] text-muted-foreground">{videoHint}</p>}

            <div className="flex flex-col gap-4">
              <DynamicStyledField
                type="video"
                label={videoLabel}
                value={resolvedVideo.url ?? ""}
                opacity={resolvedVideo.opacity ?? 100}
                onOpacityChange={(value) => applyVideoChange({ ...resolvedVideo, opacity: value })}
                overlayColor={resolvedVideo.overlayColor ?? "#000000"}
                onOverlayColorChange={(value) =>
                  applyVideoChange({ ...resolvedVideo, overlayColor: value })
                }
                overlayOpacity={resolvedVideo.overlayOpacity ?? 0}
                onOverlayOpacityChange={(value) =>
                  applyVideoChange({ ...resolvedVideo, overlayOpacity: value })
                }
                fieldName={videoFieldName}
                onChange={(value) => applyVideoChange({ ...resolvedVideo, url: value })}
              />

              {showVideoAltField && (
                <DynamicStyledField
                  type="text"
                  label="Video alt text"
                  value={normalizeTextValue(resolvedVideo.alt) ?? ""}
                  onChange={(value) =>
                    applyVideoChange({ ...resolvedVideo, alt: normalizeTextValue(value) })
                  }
                  enableStyle={!!videoAltStyleKey}
                  style={videoAltStyleKey ? content[videoAltStyleKey] : undefined}
                  onStyleChange={
                    videoAltStyleKey
                      ? (style) => updateSectionContent({ [videoAltStyleKey]: style })
                      : undefined
                  }
                />
              )}

              {showVideoSwitches && (
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-4">
                  <DynamicStyledField
                    type="switch"
                    label="Loop"
                    checked={resolvedVideo.loop ?? true}
                    onChange={(checked) => applyVideoChange({ ...resolvedVideo, loop: checked })}
                  />
                  <DynamicStyledField
                    type="switch"
                    label="Autoplay"
                    checked={resolvedVideo.autoplay ?? true}
                    onChange={(checked) => applyVideoChange({ ...resolvedVideo, autoplay: checked })}
                  />
                  <DynamicStyledField
                    type="switch"
                    label="Muted"
                    checked={resolvedVideo.muted ?? true}
                    onChange={(checked) => applyVideoChange({ ...resolvedVideo, muted: checked })}
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
