import * as React from "react"
import { useEffect, useRef, useState } from "react"
import { Image as ImageIcon, Loader2, Trash2, Upload, Video as VideoIcon } from "lucide-react"
import { useImageUpload } from "@/hooks/cms/useImageUpload"
import { useVideoUpload } from "@/hooks/cms/useVideoUpload"
import { removeFiles } from "@/services/fileUpload"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

interface BaseProps {
  label: string
  hint?: string
  className?: string
}

export interface FieldStyle {
  textColor?: string
  textOpacity?: number
  backgroundColor?: string
  backgroundOpacity?: number
}

interface StyledFieldProps {
  enableStyle?: boolean
  style?: FieldStyle
  onStyleChange?: (style: FieldStyle) => void
}

const updateFieldStyle = (
  style: FieldStyle | undefined,
  onStyleChange: ((style: FieldStyle) => void) | undefined,
  patch: Partial<FieldStyle>
) => {
  onStyleChange?.({ ...(style ?? {}), ...patch })
}

export function FieldWrapper({
  label,
  hint,
  className,
  children,
}: BaseProps & { children: React.ReactNode }) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <Label className="text-xs font-semibold text-foreground">{label}</Label>
      {children}
      {hint && <p className="text-[11px] text-muted-foreground">{hint}</p>}
    </div>
  )
}

interface TextFieldProps extends BaseProps, StyledFieldProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function TextField({ value, onChange, placeholder, enableStyle, style, onStyleChange, ...rest }: TextFieldProps) {
  return (
    <FieldWrapper {...rest}>
      <Input
        value={value ?? ""}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
      {enableStyle && onStyleChange && (
        <FieldStyleControls style={style} onStyleChange={onStyleChange} />
      )}
    </FieldWrapper>
  )
}

interface NumberFieldProps extends BaseProps, StyledFieldProps {
  value: number | undefined
  onChange: (value: number) => void
  placeholder?: string
}

export function NumberField({ value, onChange, placeholder, enableStyle, style, onStyleChange, ...rest }: NumberFieldProps) {
  return (
    <FieldWrapper {...rest}>
      <Input
        type="number"
        value={value ?? ""}
        placeholder={placeholder}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      {enableStyle && onStyleChange && (
        <FieldStyleControls style={style} onStyleChange={onStyleChange} />
      )}
    </FieldWrapper>
  )
}

interface TextAreaFieldProps extends BaseProps, StyledFieldProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  rows?: number
}

export function TextAreaField({
  value,
  onChange,
  placeholder,
  rows = 3,
  enableStyle,
  style,
  onStyleChange,
  ...rest
}: TextAreaFieldProps) {
  return (
    <FieldWrapper {...rest}>
      <Textarea
        value={value ?? ""}
        placeholder={placeholder}
        rows={rows}
        onChange={(e) => onChange(e.target.value)}
      />
      {enableStyle && onStyleChange && (
        <FieldStyleControls style={style} onStyleChange={onStyleChange} />
      )}
    </FieldWrapper>
  )
}

export function FieldStyleControls({
  style,
  onStyleChange,
}: {
  style?: FieldStyle
  onStyleChange: (style: FieldStyle) => void
}) {
  return (
    <div className="mt-1 grid grid-cols-1 gap-2 rounded-md border border-border/40 bg-muted/20 p-2 md:grid-cols-2">
      <ColorField
        label="Text color"
        value={style?.textColor ?? "#000000"}
        onChange={(value) =>
          updateFieldStyle(style, onStyleChange, { textColor: value })
        }
      />
      <ColorField
        label="Background color"
        value={style?.backgroundColor ?? "#000000"}
        onChange={(value) =>
          updateFieldStyle(style, onStyleChange, { backgroundColor: value })
        }
      />
    </div>
  )
}

interface ColorFieldProps extends BaseProps {
  value: string
  onChange: (value: string) => void
}

const parseColor = (value: string) => {
  const hexMatch = value?.match(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})([0-9a-fA-F]{2})?$/)

  if (hexMatch) {
    const hex = hexMatch[1].length === 3
      ? hexMatch[1].split("").map((part) => part + part).join("")
      : hexMatch[1]

    return {
      hex: `#${hex}`,
      opacity: hexMatch[2] ? parseInt(hexMatch[2], 16) / 255 : 1,
    }
  }

  const rgbMatch = value?.match(/^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*([\d.]+))?\s*\)$/i)

  if (rgbMatch) {
    const red = Number(rgbMatch[1])
    const green = Number(rgbMatch[2])
    const blue = Number(rgbMatch[3])

    return {
      hex: `#${[red, green, blue].map((part) => part.toString(16).padStart(2, "0")).join("")}`,
      opacity: rgbMatch[4] ? Math.max(0, Math.min(1, Number(rgbMatch[4]))) : 1,
    }
  }

  return { hex: "#000000", opacity: 1 }
}

const formatColor = (hex: string, opacity: number) => {
  if (opacity >= 1) return hex

  const red = parseInt(hex.slice(1, 3), 16)
  const green = parseInt(hex.slice(3, 5), 16)
  const blue = parseInt(hex.slice(5, 7), 16)

  return `rgba(${red}, ${green}, ${blue}, ${Number(opacity.toFixed(2))})`
}

export function ColorField({ value, onChange, ...rest }: ColorFieldProps) {
  const parsedColor = parseColor(value || "")
  const opacityPercent = Math.round(parsedColor.opacity * 100)

  return (
    <FieldWrapper {...rest}>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
        <input
          type="color"
          value={parsedColor.hex}
          onChange={(e) => onChange(formatColor(e.target.value, parsedColor.opacity))}
          className="h-10 w-10 shrink-0 cursor-pointer rounded border border-input bg-transparent p-1"
        />
        <Input
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#000000"
          className="font-mono"
        />
        </div>

        <div className="flex items-center gap-3">
          <span className="w-16 shrink-0 text-xs text-muted-foreground">Opacity</span>
          <input
            type="range"
            min="0"
            max="100"
            value={opacityPercent}
            onChange={(e) =>
              onChange(formatColor(parsedColor.hex, Number(e.target.value) / 100))
            }
            className="w-full accent-primary"
          />
          <span className="w-10 text-right text-xs font-mono text-muted-foreground">
            {opacityPercent}%
          </span>
        </div>
      </div>
    </FieldWrapper>
  )
}

interface SelectFieldProps extends BaseProps {
  value: string
  onChange: (value: string) => void
  options: { value: string; label: string }[]
}

export function SelectField({ value, onChange, options, ...rest }: SelectFieldProps) {
  return (
    <FieldWrapper {...rest}>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select" />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </FieldWrapper>
  )
}

interface SwitchFieldProps extends BaseProps {
  checked: boolean
  onChange: (checked: boolean) => void
}

export function SwitchField({ checked, onChange, label, hint, className }: SwitchFieldProps) {
  return (
    <div className={cn("flex items-center justify-between gap-3 py-1", className)}>
      <div>
        <Label className="text-xs font-semibold text-foreground">{label}</Label>
        {hint && <p className="text-[11px] text-muted-foreground">{hint}</p>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative h-5 w-9 shrink-0 rounded-full transition-colors",
          checked ? "bg-primary" : "bg-muted"
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-background shadow transition-transform",
            checked && "translate-x-4"
          )}
        />
      </button>
    </div>
  )
}

export interface ValidationRules {
  required?: boolean
  minLength?: number
  maxLength?: number
  min?: number
  max?: number
  pattern?: RegExp | string
  patternMessage?: string
  custom?: (value: string | number) => string | undefined
}

interface TextualFieldProps extends BaseProps {
  type: "text" | "number" | "textarea"
  value: string | number | undefined
  onChange: (value: string | number) => void
  placeholder?: string
  rows?: number
  min?: number
  max?: number
  maxLength?: number
  validation?: ValidationRules
  onValidChange?: (isValid: boolean) => void
  enableStyle?: boolean
  style?: FieldStyle
  onStyleChange?: (style: FieldStyle) => void
}

interface MediaFieldProps extends BaseProps {
  type: "image" | "video"
  value?: string
  fieldName?: string
  onChange: (value: string) => void
  opacity?: number
  onOpacityChange?: (value: number) => void
  overlayColor?: string
  onOverlayColorChange?: (value: string) => void
  overlayOpacity?: number
  onOverlayOpacityChange?: (value: number) => void
}

export type DynamicStyledFieldProps = TextualFieldProps | MediaFieldProps

const getValidationError = (
  value: string | number | undefined,
  rules?: ValidationRules
) => {
  if (!rules) return undefined

  const textValue = value === undefined ? "" : String(value)
  if (rules.required && textValue.trim() === "") return "This field is required"
  if (rules.minLength !== undefined && textValue.length < rules.minLength) {
    return `Minimum ${rules.minLength} characters required`
  }
  if (rules.maxLength !== undefined && textValue.length > rules.maxLength) {
    return `Maximum ${rules.maxLength} characters allowed`
  }
  if (typeof value === "number" && rules.min !== undefined && value < rules.min) {
    return `Minimum value is ${rules.min}`
  }
  if (typeof value === "number" && rules.max !== undefined && value > rules.max) {
    return `Maximum value is ${rules.max}`
  }
  if (rules.pattern && textValue !== "") {
    const pattern = typeof rules.pattern === "string" ? new RegExp(rules.pattern) : rules.pattern
    pattern.lastIndex = 0
    if (!pattern.test(textValue)) return rules.patternMessage ?? "Invalid format"
  }
  return rules.custom?.(value ?? "")
}

function DynamicMediaField({ field }: { field: MediaFieldProps }) {
  const {
    type,
    value,
    fieldName = "",
    onChange,
    opacity = 100,
    onOpacityChange,
    overlayColor = "#000000",
    onOverlayColorChange,
    overlayOpacity = 0,
    onOverlayOpacityChange,
  } = field
  const { mutate: uploadImage, isPending: isImageUploading } = useImageUpload()
  const { mutate: uploadVideo, isPending: isVideoUploading } = useVideoUpload()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isRemoving, setIsRemoving] = useState(false)
  const isUploading = type === "image" ? isImageUploading : isVideoUploading

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const upload = type === "image" ? uploadImage : uploadVideo
    upload(
      { file, fieldName, fileRemove: value ? [value] : [] },
      {
        onSuccess: (response) => {
          const uploadedFiles = response.data?.[fieldName]
          if (uploadedFiles?.[0]) onChange(uploadedFiles[0])
        },
      }
    )
    event.target.value = ""
  }

  const handleRemove = async (event: React.MouseEvent) => {
    event.stopPropagation()
    if (!value || isRemoving) return

    try {
      setIsRemoving(true)
      await removeFiles([value])
      onChange("")
    } finally {
      setIsRemoving(false)
    }
  }

  return (
    <>
      <div
        className={cn(
          "relative flex w-full items-center justify-center rounded-xl border-2 border-dashed border-border p-2 cursor-pointer transition-colors hover:bg-muted/50",
          type === "image" ? "h-45" : "h-55",
          isUploading && "pointer-events-none opacity-50"
        )}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          type="file"
          accept={type === "image" ? "image/*" : "video/*"}
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileChange}
        />
        {isUploading ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="size-6 animate-spin text-primary" />
            <span className="text-sm font-medium">Uploading...</span>
          </div>
        ) : value ? (
          <div className={cn("group relative flex h-full w-full items-center justify-center overflow-hidden rounded-lg", type === "image" ? "bg-muted/10" : "bg-black")}>
            {type === "image" ? (
              <img src={value} alt="Preview" style={{ opacity: opacity / 100 }} className="h-full w-full object-cover transition-opacity duration-300" />
            ) : (
              <video src={value} style={{ opacity: opacity / 100 }} className="h-full w-full object-cover transition-opacity duration-300" controls muted playsInline onClick={(event) => event.stopPropagation()} />
            )}
            {overlayOpacity > 0 && <div className="pointer-events-none absolute inset-0 z-10" style={{ backgroundColor: overlayColor, opacity: overlayOpacity / 100 }} />}
            <Button type="button" variant="destructive" disabled={isRemoving || isUploading} aria-label={`Delete ${type}`} className="absolute left-3 top-3 z-30 size-9 rounded-full p-0 shadow-md" onClick={handleRemove}>
              {isRemoving ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
            </Button>
            <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <Button type="button" variant="secondary" className="pointer-events-auto gap-2 rounded-full px-6 shadow-md" onClick={(event) => { event.stopPropagation(); fileInputRef.current?.click() }}>
                <div className="h-2 w-2 rounded-full bg-primary" />
                Change {type === "image" ? "Image" : "Video"}
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            {type === "image" ? <ImageIcon className="h-8 w-8 opacity-50" /> : <VideoIcon className="h-8 w-8 opacity-50" />}
            <Upload className="mb-2 h-8 w-8 opacity-50" />
            <span className="text-sm font-medium">Click to upload {type}</span>
            {type === "video" && <span className="text-xs text-muted-foreground/70">MP4, WebM, MOV</span>}
          </div>
        )}
      </div>
      {value && onOpacityChange && (
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs font-semibold text-foreground">{type === "image" ? "Image" : "Video"} opacity (%)</Label>
          <Input type="number" min={0} max={100} value={opacity} onChange={(event) => onOpacityChange(Math.max(0, Math.min(100, Number(event.target.value))))} />
        </div>
      )}
      {value && onOverlayColorChange && onOverlayOpacityChange && (
        <div className="flex flex-col gap-3">
          <ColorField label="Overlay color" value={overlayColor} onChange={onOverlayColorChange} />
          <div className="flex items-center gap-3">
            <Label className="w-28 shrink-0 text-xs font-semibold text-foreground">Overlay opacity</Label>
            <input type="range" min="0" max="100" value={overlayOpacity} onChange={(event) => onOverlayOpacityChange(Number(event.target.value))} className="w-full accent-primary" />
            <span className="w-10 text-right text-xs font-mono text-muted-foreground">{overlayOpacity}%</span>
          </div>
        </div>
      )}
    </>
  )
}

export function DynamicStyledField(field: DynamicStyledFieldProps) {
  const [touched, setTouched] = useState(false)
  const isMedia = field.type === "image" || field.type === "video"
  const textualField = field as TextualFieldProps
  const error = isMedia ? undefined : getValidationError(textualField.value, textualField.validation)
  const onValidChange = isMedia ? undefined : textualField.onValidChange

  useEffect(() => {
    onValidChange?.(!error)
  }, [error, onValidChange])

  if (isMedia) {
    return (
      <FieldWrapper label={field.label} className={field.className}>
        <DynamicMediaField field={field} />
      </FieldWrapper>
    )
  }

  return (
    <FieldWrapper label={textualField.label} hint={undefined} className={textualField.className}>
      {textualField.type === "textarea" ? (
        <Textarea value={textualField.value ?? ""} placeholder={textualField.placeholder} rows={textualField.rows ?? 3} maxLength={textualField.maxLength} onChange={(event) => textualField.onChange(event.target.value)} onBlur={() => setTouched(true)} />
      ) : textualField.type === "number" ? (
        <Input type="number" value={textualField.value ?? ""} placeholder={textualField.placeholder} min={textualField.min} max={textualField.max} onChange={(event) => textualField.onChange(Number(event.target.value))} onBlur={() => setTouched(true)} />
      ) : (
        <Input type="text" value={textualField.value ?? ""} placeholder={textualField.placeholder} onChange={(event) => textualField.onChange(event.target.value)} onBlur={() => setTouched(true)} />
      )}
      {touched && error ? <p className="text-xs text-red-500">{error}</p> : textualField.hint && <p className="text-[11px] text-muted-foreground">{textualField.hint}</p>}
      {textualField.enableStyle && textualField.onStyleChange && <FieldStyleControls style={textualField.style} onStyleChange={textualField.onStyleChange} />}
    </FieldWrapper>
  )
}
