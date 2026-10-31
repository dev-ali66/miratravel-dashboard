import { THEME_COLORS } from "@/config/theme"
import { useRef, useState } from "react"
import { useImageUpload } from "@/hooks/cms/useImageUpload"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Trash2, Upload, Image as ImageIcon, FolderOpen, Loader2, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { ColorField } from "@/components/pages/CMS/shared/FormControls"
import { MediaPickerModal, type SelectedMediaAsset } from "@/components/shared/MediaPickerModal"
import { toast } from "sonner"
import { getOptimizedImageUrl, DASHBOARD_IMAGE_WIDTHS } from "@/lib/optimizedImage"

export interface ImageUploadFieldProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "onChange"
> {
  label?: string
  previewClassName?: string
  value?: string
  fieldName?: string
  fit?: "cover" | "contain" | "fill" | "none" | "scale-down"
  onChange: (value: string) => void
  onSelectAsset?: (asset: SelectedMediaAsset) => void
  opacity?: number
  onOpacityChange?: (value: number) => void
  overlayColor?: string
  onOverlayColorChange?: (value: string) => void
  overlayOpacity?: number
  onOverlayOpacityChange?: (value: number) => void
}

export function ImageUploadField({
  label,
  previewClassName,
  value,
  fieldName = "",
  fit = "contain",
  onChange,
  onSelectAsset,
  opacity = 100,
  onOpacityChange,
  overlayColor = THEME_COLORS.overlayBlack,
  onOverlayColorChange,
  overlayOpacity = 0,
  onOverlayOpacityChange,
  className,
  ...props
}: ImageUploadFieldProps) {
  const [isPickerOpen, setIsPickerOpen] = useState(false)
  const [localUploading, setLocalUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadFileName, setUploadFileName] = useState("")

  const objectFitClass =
    fit === "cover"
      ? "object-cover"
      : fit === "fill"
        ? "object-fill"
        : fit === "none"
          ? "object-none"
          : fit === "scale-down"
            ? "object-scale-down"
            : "object-contain"
  const { mutate: uploadImage, isPending: isMutationPending } = useImageUpload()
  const isCurrentlyUploading = isMutationPending || localUploading

  const fileInputRef = useRef<HTMLInputElement>(null)

  const extractUploadedUrl = (res: any): string | null => {
    if (!res) return null
    if (typeof res === "string" && (res.startsWith("http://") || res.startsWith("https://") || res.startsWith("/"))) {
      return res
    }
    if (typeof res.secure_url === "string") return res.secure_url
    if (typeof res.url === "string") return res.url

    const dataObj = res.data ?? res
    if (typeof dataObj === "string" && (dataObj.startsWith("http://") || dataObj.startsWith("https://") || dataObj.startsWith("/"))) {
      return dataObj
    }

    if (dataObj && typeof dataObj === "object") {
      if (typeof dataObj.secure_url === "string") return dataObj.secure_url
      if (typeof dataObj.url === "string") return dataObj.url

      const fieldMatch = fieldName ? (dataObj[fieldName] ?? dataObj.data?.[fieldName]) : null
      if (Array.isArray(fieldMatch) && fieldMatch.length > 0) {
        const first = fieldMatch[0]
        if (typeof first === "string") return first
        if (first?.secure_url) return first.secure_url
        if (first?.url) return first.url
      } else if (typeof fieldMatch === "string") {
        return fieldMatch
      }

      const innerData = dataObj.data ?? dataObj
      const innerMatch = fieldName ? innerData[fieldName] : null
      if (Array.isArray(innerMatch) && innerMatch.length > 0) {
        const first = innerMatch[0]
        if (typeof first === "string") return first
        if (first?.secure_url) return first.secure_url
        if (first?.url) return first.url
      } else if (typeof innerMatch === "string") {
        return innerMatch
      }

      const targetObj = typeof innerData === "object" && innerData !== null ? innerData : dataObj
      const values = Object.values(targetObj)
      for (const val of values) {
        if (Array.isArray(val) && val.length > 0) {
          const first = val[0]
          if (typeof first === "string" && (first.startsWith("http://") || first.startsWith("https://") || first.startsWith("/"))) {
            return first
          }
          if (first && typeof first === "object") {
            if (typeof first.secure_url === "string") return first.secure_url
            if (typeof first.url === "string") return first.url
          }
        } else if (typeof val === "string" && (val.startsWith("http://") || val.startsWith("https://") || val.startsWith("/"))) {
          return val
        }
      }
    }
    return null
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]

    if (!file) return

    // Requirement 7: Safeguard against images exceeding 30MB limit
    const MAX_IMAGE_SIZE = 30 * 1024 * 1024
    if (file.size > MAX_IMAGE_SIZE) {
      toast.error(`"${file.name}" (${(file.size / (1024 * 1024)).toFixed(1)}MB) exceeds the 30MB maximum image upload limit.`)
      if (e.target) e.target.value = ""
      return
    }

    setLocalUploading(true)
    setUploadProgress(15)
    setUploadFileName(file.name)

    // Do NOT send fileRemove during field edit to prevent destroying shared assets
    uploadImage(
      {
        file,
        fieldName,
        fileRemove: [],
        onProgress: (percent) => setUploadProgress(percent),
      },
      {
        onSuccess: (res) => {
          setUploadProgress(100)
          const newImage = extractUploadedUrl(res)

          if (newImage) {
            onChange(newImage)
          }

          setTimeout(() => {
            setLocalUploading(false)
            setUploadProgress(0)
            setUploadFileName("")
          }, 350)
        },
        onError: () => {
          setLocalUploading(false)
          setUploadProgress(0)
          setUploadFileName("")
        },
      }
    )

    e.target.value = ""
  }

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation()

    if (!value) return

    // Safely clear the form field value without destroying the physical file on VPS disk
    onChange("")
  }

  return (
    <div className={cn("flex flex-col gap-3", className)} {...props}>
      {label && (
        <div className="flex items-center justify-between text-foreground">
          <div className="flex items-center gap-2">
            <ImageIcon className="h-4 w-4 text-muted-foreground" />
            <Label className="text-sm font-bold text-inherit">{label}</Label>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              setIsPickerOpen(true)
            }}
            className="h-6 text-[11px] font-medium gap-1 px-2 text-primary hover:text-primary hover:bg-primary/10 rounded-sm cursor-pointer"
          >
            <FolderOpen className="h-3.5 w-3.5" />
            Choose from Library
          </Button>
        </div>
      )}

      <div
        className={cn(
          "relative flex h-45 w-full cursor-pointer items-center justify-center rounded-md border-2 border-dashed border-border p-2 transition-colors hover:bg-muted/50",
          isCurrentlyUploading && "pointer-events-none opacity-95 border-primary/50 bg-primary/5"
        )}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          type="file"
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileChange}
        />

        {isCurrentlyUploading ? (
          <div className="flex flex-col items-center justify-center gap-3 w-full max-w-xs px-4 py-2 animate-in fade-in-50 duration-200">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2 min-w-0">
                <Loader2 className="h-4 w-4 animate-spin text-primary shrink-0" />
                <span className="text-xs font-semibold text-foreground truncate max-w-[190px]">
                  {uploadFileName || "Uploading image..."}
                </span>
              </div>
              <span className="text-xs font-mono font-bold text-primary shrink-0 ml-2">
                {uploadProgress}%
              </span>
            </div>

            <div className="h-2 w-full bg-muted rounded-full overflow-hidden shadow-inner">
              <div
                className="h-full bg-primary transition-all duration-150 rounded-full"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>

            <p className="text-[11px] text-muted-foreground flex items-center gap-1.5">
              <Sparkles className="h-3 w-3 text-primary shrink-0" />
              <span>Instant SHA-256 zero-byte check active</span>
            </p>
          </div>
        ) : value ? (
          <div className="group relative flex h-full w-full items-center justify-center overflow-hidden rounded-lg bg-muted/10">
            <img
              src={getOptimizedImageUrl(value, { width: DASHBOARD_IMAGE_WIDTHS.FORM_PREVIEW, quality: 100 })}
              alt="Preview"
              style={{ opacity: opacity / 100 }}
              className={cn(
                "h-full w-full transition-opacity duration-300 p-1",
                objectFitClass,
                previewClassName
              )}
            />

            {overlayOpacity > 0 && (
              <div
                className="pointer-events-none absolute inset-0 z-10"
                style={{
                  backgroundColor: overlayColor,
                  opacity: overlayOpacity / 100,
                }}
              />
            )}

            <Button
              type="button"
              variant="destructive"
              disabled={isCurrentlyUploading}
              aria-label="Delete image"
              className="absolute top-3 left-3 z-20 size-9 rounded-full p-0 shadow-md"
              onClick={handleRemove}
            >
              <Trash2 className="size-4" />
            </Button>

            <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center gap-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="pointer-events-auto gap-1.5 rounded-full px-3.5 shadow-md text-xs font-medium"
                onClick={(e) => {
                  e.stopPropagation()
                  fileInputRef.current?.click()
                }}
              >
                <Upload className="h-3 w-3" />
                Upload New
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="pointer-events-auto gap-1.5 rounded-full px-3.5 shadow-md text-xs font-medium bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20"
                onClick={(e) => {
                  e.stopPropagation()
                  setIsPickerOpen(true)
                }}
              >
                <FolderOpen className="h-3.5 w-3.5" />
                From Library
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground py-2">
            <Upload className="h-7 w-7 opacity-50" />
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-medium">Click to upload from device</span>
              <span className="text-[10px] text-muted-foreground/60">• or •</span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  setIsPickerOpen(true)
                }}
                className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline cursor-pointer"
              >
                <FolderOpen className="h-3.5 w-3.5" />
                browse library
              </button>
            </div>
          </div>
        )}
      </div>

      <MediaPickerModal
        isOpen={isPickerOpen}
        onClose={() => setIsPickerOpen(false)}
        allowedTypes={["image"]}
        initialSelectedUrl={value}
        onSelect={(assets) => {
          if (assets.length > 0) {
            onChange(assets[0].url)
            if (onSelectAsset) {
              onSelectAsset(assets[0])
            }
          }
        }}
      />

      {onOverlayColorChange && onOverlayOpacityChange && (
        <div className="flex flex-col gap-2 rounded-lg border border-border/60 bg-muted/20 p-2.5">
          <ColorField
            label="Overlay Color"
            value={overlayColor}
            onChange={onOverlayColorChange}
          />
          <div className="flex items-center gap-3">
            <Label className="w-24 shrink-0 text-left text-xs font-semibold text-foreground">
              Overlay Opacity
            </Label>
            <input
              type="range"
              min="0"
              max="100"
              value={overlayOpacity}
              onChange={(e) => onOverlayOpacityChange(Number(e.target.value))}
              className="min-w-0 flex-1 accent-primary"
            />
            <span className="w-10 shrink-0 text-right font-mono text-xs text-muted-foreground">
              {overlayOpacity}%
            </span>
          </div>
        </div>
      )}

      {onOpacityChange && (
        <div className="flex items-center gap-3 rounded-lg border border-border/60 bg-muted/20 px-3 py-2">
          <Label className="w-24 shrink-0 text-left text-xs font-semibold text-foreground">
            Image Opacity
          </Label>
          <input
            type="range"
            min="0"
            max="100"
            value={opacity}
            onChange={(e) => onOpacityChange(Number(e.target.value))}
            className="min-w-0 flex-1 accent-primary"
          />
          <span className="w-10 shrink-0 text-right font-mono text-xs text-muted-foreground">
            {opacity}%
          </span>
        </div>
      )}
    </div>
  )
}
