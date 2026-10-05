import { useState } from "react"
import { useDevMode } from "@/context/DevModeContext"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ImageUploadField } from "@/components/shared/ImageUploadField"
import { VideoUploadField } from "@/components/shared/VideoUploadField"
import { ColorField, DynamicStyledField } from "./FormControls"
import {
  Image as ImageIcon,
  Video as VideoIcon,
  Palette,
  ChevronDown,
} from "lucide-react"
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

export interface UniversalMultimediaValue {
  show: MultimediaShowType
  image?: MultimediaImageConfig
  video?: MultimediaVideoConfig
  color?: MultimediaColorConfig
  [key: string]: any
}

export interface UniversalMultimediaFormProps {
  value?: UniversalMultimediaValue | any
  onChange?: (next: UniversalMultimediaValue) => void
  fieldName?: string
  title?: string
  allowImage?: boolean
  allowVideo?: boolean
  allowColor?: boolean
  defaultShow?: MultimediaShowType
  className?: string
  hideFieldNameBadge?: boolean

  // Collapsible accordion configuration
  collapsible?: boolean
  defaultOpen?: boolean
  isOpen?: boolean
  onToggle?: (open: boolean) => void
  headerActions?: React.ReactNode

  // Backward compatibility with legacy CMS, Story, Journey callers
  section?: any
  content?: Record<string, any>
  updateSection?: (patch: any) => void
  updateSectionContent?: (patch: Record<string, any>) => void
  contentMediaKey?: string
  imageFieldName?: string
  videoFieldName?: string

  sectionTitle?: string
  showColorPicker?: boolean
  colorLabel?: string
  defaultColor?: string
  enableTypeSelector?: boolean
  backgroundType?: any
  onBackgroundTypeChange?: (type: any) => void
  onColorChange?: (color: any) => void
  backgroundTypeStyleKey?: string
  image?: any
  onImageChange?: (next: any) => void
  imageTitle?: string
  imageLabel?: string
  imageAltStyleKey?: string
  showImageAltField?: boolean
  video?: any
  onVideoChange?: (next: any) => void
  videoTitle?: string
  videoLabel?: string
  videoHint?: string
  videoAltStyleKey?: string
  showVideoAltField?: boolean
  showVideoSwitches?: boolean
}

const DEFAULT_IMAGE_CONFIG: MultimediaImageConfig = {
  url: "",
  alt: "",
  opacity: 100,
  overlayColor: "#000000",
  overlayOpacity: 0,
  width: "100%",
  height: "auto",
  aspectRatio: "16:9",
  fit: "cover",
  isFullWidth: true,
  isFullHeight: false,
}

const DEFAULT_VIDEO_CONFIG: MultimediaVideoConfig = {
  url: "",
  alt: "",
  autoplay: true,
  loop: true,
  muted: true,
  opacity: 100,
  overlayColor: "#000000",
  overlayOpacity: 0,
  width: "100%",
  height: "auto",
  aspectRatio: "16:9",
  fit: "cover",
  isFullWidth: true,
  isFullHeight: false,
}

const DEFAULT_COLOR_CONFIG: MultimediaColorConfig = {
  color: "#171717",
  opacity: 100,
  width: "100%",
  height: "100%",
  aspectRatio: "auto",
  isFullWidth: true,
  isFullHeight: true,
}

const ASPECT_RATIO_PRESETS = [
  { label: "Auto", value: "auto" },
  { label: "16:9", value: "16:9" },
  { label: "4:3", value: "4:3" },
  { label: "1:1", value: "1:1" },
  { label: "4:5", value: "4:5" },
  { label: "9:16", value: "9:16" },
  { label: "3:2", value: "3:2" },
  { label: "21:9", value: "21:9" },
]

const FIT_OPTIONS: Array<{ label: string; value: "cover" | "contain" | "fill" | "none" }> = [
  { label: "Cover", value: "cover" },
  { label: "Contain", value: "contain" },
  { label: "Fill", value: "fill" },
  { label: "Auto", value: "none" },
]

const WIDTH_PRESETS = ["100%", "75%", "50%", "auto"]
const HEIGHT_PRESETS = ["100%", "600px", "450px", "320px", "auto"]

interface MediaDimensionsControlProps {
  width?: string
  height?: string
  aspectRatio?: string
  fit?: "cover" | "contain" | "fill" | "none" | "scale-down"
  isFullWidth?: boolean
  isFullHeight?: boolean
  allowFit?: boolean
  onChange: (patch: {
    width?: string
    height?: string
    aspectRatio?: string
    fit?: "cover" | "contain" | "fill" | "none" | "scale-down"
    isFullWidth?: boolean
    isFullHeight?: boolean
  }) => void
}

function MediaDimensionsControl({
  width = "100%",
  height = "auto",
  aspectRatio = "16:9",
  fit = "cover",
  allowFit = true,
  onChange,
}: MediaDimensionsControlProps) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border/60 bg-muted/20 p-3">
      {/* Header */}
      <div className="border-b border-border/50 pb-1.5">
        <span className="text-[11px] font-semibold tracking-wide uppercase text-foreground">
          Dimensions & Aspect Ratio
        </span>
      </div>

      {/* Aspect Ratio Row */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <Label className="text-[11px] font-medium text-muted-foreground">Aspect Ratio</Label>
          <span className="font-mono text-[10px] text-muted-foreground">{aspectRatio || "auto"}</span>
        </div>
        <div className="grid grid-cols-4 gap-1 sm:grid-cols-8">
          {ASPECT_RATIO_PRESETS.map((p) => {
            const isSelected = (aspectRatio || "auto") === p.value
            return (
              <button
                key={p.value}
                type="button"
                onClick={() => onChange({ aspectRatio: p.value })}
                className={cn(
                  "rounded border py-1 text-center text-[10px] font-medium transition-colors cursor-pointer",
                  isSelected
                    ? "border-primary bg-primary/10 text-primary font-semibold"
                    : "border-border/70 bg-background text-muted-foreground hover:bg-muted"
                )}
              >
                {p.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Width & Height Row */}
      <div className="grid grid-cols-1 gap-3">
        {/* Width Field */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <Label className="text-[11px] font-medium text-muted-foreground">Width (W)</Label>
            <div className="flex items-center gap-1">
              {WIDTH_PRESETS.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() =>
                    onChange({
                      width: preset,
                      isFullWidth: preset === "100%",
                    })
                  }
                  className={cn(
                    "rounded px-1.5 py-0.5 text-[9px] font-medium transition-colors cursor-pointer",
                    width === preset
                      ? "bg-primary/20 text-primary font-semibold"
                      : "text-muted-foreground hover:bg-muted"
                  )}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>
          <Input
            type="text"
            value={width || ""}
            placeholder="e.g. 100%, 640px, auto"
            onChange={(e) =>
              onChange({
                width: e.target.value,
                isFullWidth: e.target.value === "100%",
              })
            }
            className="h-7 text-xs font-mono"
          />
        </div>

        {/* Height Field */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <Label className="text-[11px] font-medium text-muted-foreground">Height (H)</Label>
            <div className="flex items-center gap-1">
              {HEIGHT_PRESETS.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() =>
                    onChange({
                      height: preset,
                      isFullHeight: preset === "100%",
                    })
                  }
                  className={cn(
                    "rounded px-1.5 py-0.5 text-[9px] font-medium transition-colors cursor-pointer",
                    height === preset
                      ? "bg-primary/20 text-primary font-semibold"
                      : "text-muted-foreground hover:bg-muted"
                  )}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>
          <Input
            type="text"
            value={height || ""}
            placeholder="e.g. 100%, 480px, auto"
            onChange={(e) =>
              onChange({
                height: e.target.value,
                isFullHeight: e.target.value === "100%",
              })
            }
            className="h-7 text-xs font-mono"
          />
        </div>
      </div>

      {/* Fit Mode (Cover, Contain, Fill, Auto) */}
      {allowFit && (
        <div className="flex flex-col gap-1.5">
          <Label className="text-[11px] font-medium text-muted-foreground">Object Fit (Scaling Mode)</Label>
          <div className="grid grid-cols-4 gap-1">
            {FIT_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => onChange({ fit: opt.value })}
                className={cn(
                  "rounded border py-1 text-[10px] font-medium transition-colors cursor-pointer",
                  (fit || "cover") === opt.value
                    ? "border-primary bg-primary/10 text-primary font-semibold"
                    : "border-border/70 bg-background text-muted-foreground hover:bg-muted"
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export function UniversalMultimediaForm(props: UniversalMultimediaFormProps) {
  const {
    value: explicitValue,
    onChange: explicitOnChange,
    fieldName = "multimedia",
    title = "Multimedia & Background",
    allowImage = true,
    allowVideo = true,
    allowColor = true,
    defaultShow,
    collapsible = true,
    defaultOpen = true,
    isOpen: controlledIsOpen,
    onToggle,
    className,
    hideFieldNameBadge = false,
    content,
    updateSectionContent,
    contentMediaKey,
    imageFieldName = "backgroundImage",
    videoFieldName = "backgroundVideo",
  } = props

  const { isDevMode, config } = useDevMode()
  const showCodeBadge = !hideFieldNameBadge && Boolean(fieldName) && (config.showFieldBadges || isDevMode)
  const showTypeTabs = (config.showMultimediaTypeSwitcher || isDevMode) && (allowImage && allowVideo && allowColor)
  const showAdvancedDimensions = config.showStyleControls || isDevMode

  // Local collapse state
  const [internalIsOpen, setInternalIsOpen] = useState<boolean>(defaultOpen)
  const isExpanded = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen

  const toggleOpen = () => {
    if (onToggle) {
      onToggle(!isExpanded)
    } else {
      setInternalIsOpen((prev) => !prev)
    }
  }

  // Resolve current value from props or legacy CMS content
  const currentVal: UniversalMultimediaValue = (() => {
    if (typeof explicitValue === "string" && explicitValue.trim() !== "") {
      return {
        show: defaultShow || "image",
        image: { ...DEFAULT_IMAGE_CONFIG, url: explicitValue },
        video: DEFAULT_VIDEO_CONFIG,
        color: DEFAULT_COLOR_CONFIG,
      }
    }

    if (explicitValue && typeof explicitValue === "object") {
      const resolvedColor =
        typeof explicitValue.color === "string"
          ? { color: explicitValue.color }
          : typeof explicitValue.color === "object" && explicitValue.color !== null
          ? explicitValue.color
          : explicitValue.colorData || {}

      const resolvedImageUrl =
        explicitValue.image?.url ??
        explicitValue.imageData?.url ??
        (typeof explicitValue.url === "string"
          ? explicitValue.url
          : typeof explicitValue.thumbnail === "string"
          ? explicitValue.thumbnail
          : "")

      const resolvedVideoUrl =
        explicitValue.video?.url ??
        explicitValue.videoData?.url ??
        (typeof explicitValue.videoUrl === "string"
          ? explicitValue.videoUrl
          : "")

      const rawShow = explicitValue.show ?? explicitValue.type ?? defaultShow ?? "image"
      const showVal = typeof rawShow === "object" ? (rawShow?.show ?? rawShow?.type ?? "image") : rawShow

      return {
        show: showVal || "image",
        image: {
          ...DEFAULT_IMAGE_CONFIG,
          ...(explicitValue.image || explicitValue.imageData),
          url: resolvedImageUrl,
        },
        video: {
          ...DEFAULT_VIDEO_CONFIG,
          ...(explicitValue.video || explicitValue.videoData),
          url: resolvedVideoUrl,
        },
        color: { ...DEFAULT_COLOR_CONFIG, ...resolvedColor },
      }
    }

    if (content) {
      const media = contentMediaKey ? content[contentMediaKey] : content.multimedia || content
      const showType = media?.show || media?.type || content.backgroundType || defaultShow || "image"
      return {
        show: showType,
        image: {
          ...DEFAULT_IMAGE_CONFIG,
          url: media?.image?.url || content.imageUrl || content[imageFieldName],
          alt: media?.image?.alt || content.imageAlt || "",
          opacity: media?.image?.opacity ?? content.imageOpacity ?? 100,
          overlayColor: media?.image?.overlayColor ?? content.imageOverlayColor ?? "#000000",
          overlayOpacity: media?.image?.overlayOpacity ?? content.imageOverlayOpacity ?? 0,
          aspectRatio: media?.image?.aspectRatio || "16:9",
          width: media?.image?.width || "100%",
          height: media?.image?.height || "auto",
          fit: media?.image?.fit || "cover",
          isFullWidth: media?.image?.isFullWidth ?? true,
          isFullHeight: media?.image?.isFullHeight ?? false,
        },
        video: {
          ...DEFAULT_VIDEO_CONFIG,
          url: media?.video?.url || content.videoUrl || content[videoFieldName],
          alt: media?.video?.alt || content.videoAlt || "",
          autoplay: media?.video?.autoplay ?? content.videoAutoplay ?? true,
          loop: media?.video?.loop ?? content.videoLoop ?? true,
          muted: media?.video?.muted ?? content.videoMuted ?? true,
          opacity: media?.video?.opacity ?? content.videoOpacity ?? 100,
          overlayColor: media?.video?.overlayColor ?? content.videoOverlayColor ?? "#000000",
          overlayOpacity: media?.video?.overlayOpacity ?? content.videoOverlayOpacity ?? 0,
          aspectRatio: media?.video?.aspectRatio || "16:9",
          width: media?.video?.width || "100%",
          height: media?.video?.height || "auto",
          fit: media?.video?.fit || "cover",
          isFullWidth: media?.video?.isFullWidth ?? true,
          isFullHeight: media?.video?.isFullHeight ?? false,
        },
        color: {
          color: media?.color?.color || content.backgroundColor || "#171717",
          opacity: media?.color?.opacity ?? content.backgroundOpacity ?? 100,
          width: media?.color?.width || "100%",
          height: media?.color?.height || "100%",
          aspectRatio: media?.color?.aspectRatio || "auto",
          isFullWidth: media?.color?.isFullWidth ?? true,
          isFullHeight: media?.color?.isFullHeight ?? true,
        },
      }
    }

    return {
      show: defaultShow || "image",
      image: DEFAULT_IMAGE_CONFIG,
      video: DEFAULT_VIDEO_CONFIG,
      color: DEFAULT_COLOR_CONFIG,
    }
  })()

  // Unified emitter
  const emitChange = (nextVal: UniversalMultimediaValue) => {
    if (explicitOnChange) {
      explicitOnChange(nextVal)
      return
    }

    if (updateSectionContent) {
      const patch: Record<string, any> = {
        multimedia: nextVal,
        backgroundType: nextVal.show,
      }
      if (contentMediaKey) {
        patch[contentMediaKey] = nextVal
      }
      if (nextVal.show === "image" && nextVal.image?.url) {
        patch[imageFieldName] = nextVal.image.url
        if (nextVal.image.alt) patch.imageAlt = nextVal.image.alt
      } else if (nextVal.show === "video" && nextVal.video?.url) {
        patch[videoFieldName] = nextVal.video.url
        if (nextVal.video.alt) patch.videoAlt = nextVal.video.alt
      } else if (nextVal.show === "color" && nextVal.color?.color) {
        patch.backgroundColor = nextVal.color.color
      }
      updateSectionContent(patch)
    }
  }

  const setShow = (show: MultimediaShowType) => {
    emitChange({
      ...currentVal,
      show,
    })
  }

  const updateImage = (patch: Partial<MultimediaImageConfig>) => {
    emitChange({
      ...currentVal,
      image: {
        ...currentVal.image,
        ...patch,
      },
    })
  }

  const updateVideo = (patch: Partial<MultimediaVideoConfig>) => {
    emitChange({
      ...currentVal,
      video: {
        ...currentVal.video,
        ...patch,
      },
    })
  }

  const updateColor = (patch: Partial<MultimediaColorConfig>) => {
    emitChange({
      ...currentVal,
      color: {
        ...currentVal.color,
        ...patch,
      },
    })
  }

  return (
    <div
      className={cn(
        "flex flex-col rounded-lg border border-border/70 bg-card overflow-hidden transition-all shadow-2xs",
        className
      )}
    >
      {/* Header with Title, Code Badge, Active Mode Pill, and Collapsible Toggle */}
      <div
        onClick={collapsible ? toggleOpen : undefined}
        className={cn(
          "flex items-center justify-between p-3 select-none transition-colors",
          collapsible ? "cursor-pointer hover:bg-muted/40" : "",
          isExpanded ? "bg-muted/20 border-b border-border/50" : "bg-card"
        )}
      >
        <div className="flex flex-wrap items-center gap-2 min-w-0">
          <Label className="text-xs font-semibold text-foreground uppercase tracking-wide cursor-pointer">
            {title}
          </Label>

          {showCodeBadge && (
            <code className="rounded bg-muted/60 px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground select-all">
              {fieldName}
            </code>
          )}

          {/* Active Mode Pill Tag */}
          {(allowImage && allowVideo && allowColor) && showTypeTabs && (
            <span className="flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary uppercase">
              {currentVal.show === "image" && <ImageIcon className="h-3 w-3" />}
              {currentVal.show === "video" && <VideoIcon className="h-3 w-3" />}
              {currentVal.show === "color" && <Palette className="h-3 w-3" />}
              {typeof currentVal.show === "string" ? currentVal.show : String((currentVal.show as any)?.show || "color")}
            </span>
          )}
        </div>

        {/* Right Action: Header Actions & Collapse Toggle Chevron */}
        <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
          {props.headerActions}
          {collapsible && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                toggleOpen()
              }}
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer transition-transform duration-200"
              title={isExpanded ? "Collapse multimedia section" : "Expand multimedia section"}
            >
              <ChevronDown
                className={cn(
                  "h-4 w-4 transition-transform duration-200",
                  isExpanded ? "rotate-180 text-foreground" : "rotate-0 text-muted-foreground"
                )}
              />
            </button>
          )}
        </div>
      </div>

      {/* Collapsible Content Body */}
      {(!collapsible || isExpanded) && (
        <div className="flex flex-col gap-3.5 p-3.5 pt-3">
          {/* Media Type Switcher Tabs */}
          {showTypeTabs && (
            <div className="flex items-center justify-around rounded-lg border border-border/80 bg-muted/50 p-0.5">
              {allowImage && (
                <button
                  type="button"
                  onClick={() => setShow("image")}
                  className={cn(
                    "flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-all cursor-pointer",
                    currentVal.show === "image"
                      ? "bg-background text-foreground font-semibold shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <ImageIcon className="h-3.5 w-3.5" />
                  Image
                </button>
              )}

              {allowVideo && (
                <button
                  type="button"
                  onClick={() => setShow("video")}
                  className={cn(
                    "flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-all cursor-pointer",
                    currentVal.show === "video"
                      ? "bg-background text-foreground font-semibold shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <VideoIcon className="h-3.5 w-3.5" />
                  Video
                </button>
              )}

              {allowColor && (
                <button
                  type="button"
                  onClick={() => setShow("color")}
                  className={cn(
                    "flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-all cursor-pointer",
                    currentVal.show === "color"
                      ? "bg-background text-foreground font-semibold shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Palette className="h-3.5 w-3.5" />
                  Color
                </button>
              )}
            </div>
          )}

          {/* Mode 1: IMAGE Form Panel */}
          {currentVal.show === "image" && (
            <div className="flex flex-col gap-3.5 pt-1">
              <ImageUploadField
                label="Upload / Select Image"
                fieldName={`${fieldName}.image.url`}
                value={currentVal.image?.url ?? ""}
                fit={currentVal.image?.fit ?? "contain"}
                onChange={(url) => updateImage({ url })}
                opacity={currentVal.image?.opacity ?? 100}
                onOpacityChange={showAdvancedDimensions ? (opacity) => updateImage({ opacity }) : undefined}
                overlayColor={currentVal.image?.overlayColor ?? "#000000"}
                onOverlayColorChange={showAdvancedDimensions ? (overlayColor) => updateImage({ overlayColor }) : undefined}
                overlayOpacity={currentVal.image?.overlayOpacity ?? 0}
                onOverlayOpacityChange={showAdvancedDimensions ? (overlayOpacity) => updateImage({ overlayOpacity }) : undefined}
              />

              {showAdvancedDimensions && (
                <>
                  <div className="flex flex-col gap-1.5">
                    <Label className="text-xs font-medium text-muted-foreground">Alt Text (SEO)</Label>
                    <Input
                      type="text"
                      value={currentVal.image?.alt ?? ""}
                      placeholder="Description of the image for SEO"
                      onChange={(e) => updateImage({ alt: e.target.value })}
                      className="h-8 text-xs"
                    />
                  </div>

                  <MediaDimensionsControl
                    width={currentVal.image?.width}
                    height={currentVal.image?.height}
                    aspectRatio={currentVal.image?.aspectRatio}
                    fit={currentVal.image?.fit}
                    isFullWidth={currentVal.image?.isFullWidth}
                    isFullHeight={currentVal.image?.isFullHeight}
                    allowFit={true}
                    onChange={(patch) => updateImage(patch)}
                  />
                </>
              )}
            </div>
          )}

          {/* Mode 2: VIDEO Form Panel */}
          {currentVal.show === "video" && (
            <div className="flex flex-col gap-3.5 pt-1">
              <VideoUploadField
                label="Upload Video / Video URL"
                fieldName={`${fieldName}.video.url`}
                value={currentVal.video?.url ?? ""}
                fit={currentVal.video?.fit ?? "contain"}
                onChange={(url) => updateVideo({ url })}
                opacity={currentVal.video?.opacity ?? 100}
                onOpacityChange={showAdvancedDimensions ? (opacity) => updateVideo({ opacity }) : undefined}
                overlayColor={currentVal.video?.overlayColor ?? "#000000"}
                onOverlayColorChange={showAdvancedDimensions ? (overlayColor) => updateVideo({ overlayColor }) : undefined}
                overlayOpacity={currentVal.video?.overlayOpacity ?? 0}
                onOverlayOpacityChange={showAdvancedDimensions ? (overlayOpacity) => updateVideo({ overlayOpacity }) : undefined}
              />

              {showAdvancedDimensions && (
                <>
                  <div className="flex flex-col gap-1.5">
                    <Label className="text-xs font-medium text-muted-foreground">Alt Text (SEO)</Label>
                    <Input
                      type="text"
                      value={currentVal.video?.alt ?? ""}
                      placeholder="Description of the video content"
                      onChange={(e) => updateVideo({ alt: e.target.value })}
                      className="h-8 text-xs"
                    />
                  </div>

                  <MediaDimensionsControl
                    width={currentVal.video?.width}
                    height={currentVal.video?.height}
                    aspectRatio={currentVal.video?.aspectRatio}
                    fit={currentVal.video?.fit}
                    isFullWidth={currentVal.video?.isFullWidth}
                    isFullHeight={currentVal.video?.isFullHeight}
                    allowFit={true}
                    onChange={(patch) => updateVideo(patch)}
                  />

                  <div className="grid grid-cols-3 gap-2 rounded-lg border border-border/60 bg-muted/20 p-2.5">
                    <DynamicStyledField
                      type="switch"
                      label="Autoplay"
                      value={currentVal.video?.autoplay ?? true}
                      onChange={(autoplay) => updateVideo({ autoplay })}
                    />
                    <DynamicStyledField
                      type="switch"
                      label="Loop"
                      value={currentVal.video?.loop ?? true}
                      onChange={(loop) => updateVideo({ loop })}
                    />
                    <DynamicStyledField
                      type="switch"
                      label="Muted"
                      value={currentVal.video?.muted ?? true}
                      onChange={(muted) => updateVideo({ muted })}
                    />
                  </div>
                </>
              )}
            </div>
          )}

          {/* Mode 3: COLOR Form Panel */}
          {currentVal.show === "color" && (
            <div className="flex flex-col gap-3 rounded-lg border border-border/60 bg-muted/20 p-3 pt-2">
              <ColorField
                label="Background Color"
                value={currentVal.color?.color ?? "#171717"}
                onChange={(color) => updateColor({ color })}
              />
              {showAdvancedDimensions && (
                <>
                  <div className="flex items-center gap-3">
                    <Label className="w-28 shrink-0 text-left text-xs font-semibold text-foreground">
                      Background Opacity
                    </Label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={currentVal.color?.opacity ?? 100}
                      onChange={(e) => updateColor({ opacity: Number(e.target.value) })}
                      className="min-w-0 flex-1 accent-primary"
                    />
                    <span className="w-10 shrink-0 text-right font-mono text-xs text-muted-foreground">
                      {currentVal.color?.opacity ?? 100}%
                    </span>
                  </div>

                  <MediaDimensionsControl
                    width={currentVal.color?.width}
                    height={currentVal.color?.height}
                    aspectRatio={currentVal.color?.aspectRatio}
                    isFullWidth={currentVal.color?.isFullWidth}
                    isFullHeight={currentVal.color?.isFullHeight}
                    allowFit={false}
                    onChange={(patch) => updateColor(patch)}
                  />
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
