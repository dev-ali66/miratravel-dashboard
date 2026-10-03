import * as React from "react"
import { useEffect, useState, useMemo } from "react"
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { RichTextEditor } from "@/components/shared/RichTextEditor"
import { ImageUploadField } from "@/components/shared/ImageUploadField"
import { VideoUploadField as VideoUploader } from "@/components/shared/VideoUploadField"
import { Palette, RotateCcw, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

/* ============================================================
   TYPES & UNIFIED VALUE INTERFACES
   ============================================================ */

export function FormSection({
  title,
  sectionNumber,
  active,
  onClick,
  children,
}: {
  title: string
  sectionNumber?: string | number
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  const rawTitle = title.replace(/^\d+[a-z]?\.\s*/i, "")
  const displayTitle = sectionNumber ? `${sectionNumber}. ${rawTitle}` : title

  return (
    <div
      className={cn(
        "border-b border-border/60 bg-card transition-colors",
        !active && "overflow-hidden"
      )}
    >
      <button
        type="button"
        onClick={onClick}
        className="flex w-full items-center justify-between px-4 py-3.5 text-left transition-colors hover:bg-muted/40 cursor-pointer"
      >
        <span className="text-sm font-semibold text-foreground">{displayTitle}</span>

        <ChevronDown
          className={cn(
            "h-4 w-4 text-muted-foreground transition-transform",
            active && "rotate-180"
          )}
        />
      </button>

      {active && (
        <div className="border-t border-border/40 p-4">
          {children}
        </div>
      )}
    </div>
  )
}


export interface FieldStyle {
  textColor?: string | null
  textOpacity?: number
  backgroundColor?: string | null
  backgroundOpacity?: number
}

export interface UnifiedFieldObject extends FieldStyle {
  value?: any
  [key: string]: any
}

export type StyledFieldValue = string | number | boolean | UnifiedFieldObject | null | undefined

export interface BaseProps {
  label?: string
  fieldName?: string
  hint?: string
  className?: string
}

export interface NormalFieldValidation {
  required?: boolean
  minLength?: number
  maxLength?: number
  min?: number
  max?: number
  pattern?: RegExp | string
  patternMessage?: string
  custom?: (value: any) => string | undefined
}

export type ValidationRules = NormalFieldValidation

/* Helper to normalize input value into unified shape */
export function normalizeUnifiedValue(raw: any, defaultVal: any = ""): {
  val: any
  style: FieldStyle
} {
  if (raw && typeof raw === "object" && !Array.isArray(raw)) {
    return {
      val: raw.value !== undefined ? raw.value : defaultVal,
      style: {
        textColor: raw.textColor !== undefined ? raw.textColor : null,
        textOpacity: raw.textOpacity !== undefined ? raw.textOpacity : 1,
        backgroundColor: raw.backgroundColor !== undefined ? raw.backgroundColor : null,
        backgroundOpacity: raw.backgroundOpacity !== undefined ? raw.backgroundOpacity : 1,
      },
    }
  }

  return {
    val: raw !== undefined && raw !== null ? raw : defaultVal,
    style: {
      textColor: null,
      textOpacity: 1,
      backgroundColor: null,
      backgroundOpacity: 1,
    },
  }
}

/* ============================================================
   VALIDATION HELPER
   ============================================================ */

export function getValidationError(
  value: any,
  validation?: NormalFieldValidation,
  type?: string
): string | undefined {
  if (!validation) return undefined

  const actualValue = value && typeof value === "object" && value.value !== undefined ? value.value : value

  if (validation.required) {
    if (actualValue === undefined || actualValue === null || actualValue === "") {
      return "This field is required"
    }
    if (Array.isArray(actualValue) && actualValue.length === 0) {
      return "Please select at least one item"
    }
  }

  if (actualValue === undefined || actualValue === null || actualValue === "") {
    return undefined
  }

  if (type === "number" || typeof actualValue === "number") {
    const num = Number(actualValue)
    if (isNaN(num)) return "Must be a valid number"
    if (validation.min !== undefined && num < validation.min) return `Minimum value is ${validation.min}`
    if (validation.max !== undefined && num > validation.max) return `Maximum value is ${validation.max}`
  }

  if (typeof actualValue === "string") {
    if (validation.minLength && actualValue.length < validation.minLength) {
      return `Minimum length is ${validation.minLength} characters`
    }
    if (validation.maxLength && actualValue.length > validation.maxLength) {
      return `Maximum length is ${validation.maxLength} characters`
    }
    if (validation.pattern) {
      const regex = typeof validation.pattern === "string" ? new RegExp(validation.pattern) : validation.pattern
      if (!regex.test(actualValue)) {
        return validation.patternMessage || "Invalid format"
      }
    }
  }

  if (validation.custom) {
    return validation.custom(actualValue)
  }

  return undefined
}

/* ============================================================
   FIELD WRAPPER WITH FIELDNAME BADGE & STYLING POPOVER
   ============================================================ */

import { useDevMode } from "@/context/DevModeContext"

export interface FieldHeaderProps extends BaseProps {
  style?: FieldStyle
  onStyleChange?: (style: FieldStyle) => void
  enableStyle?: boolean
  required?: boolean
}

export function FieldHeader({
  label,
  fieldName,
  style,
  onStyleChange,
  enableStyle,
  required,
}: FieldHeaderProps) {
  const { isDevMode, config } = useDevMode()
  const showStyleButton = enableStyle && onStyleChange && (config.showStyleControls || isDevMode)
  const showCodeBadge = Boolean(fieldName) && (config.showFieldBadges || isDevMode)

  const hasCustomStyle = Boolean(
    (style?.textColor && style.textColor !== "") ||
    (style?.backgroundColor && style.backgroundColor !== "") ||
    (style?.textOpacity !== undefined && style.textOpacity < 1)
  )

  return (
    <div className="flex flex-wrap items-center justify-between gap-x-1.5 gap-y-1 min-w-0">
      {label && (
        <Label className="text-xs font-semibold text-foreground min-w-0 flex-1 flex items-center gap-1 break-words">
          <span>{label}</span>
          {required && <span className="text-destructive font-bold text-sm leading-none">*</span>}
        </Label>
      )}

      <div className="flex items-center gap-1.5 shrink-0">
        {showStyleButton && (
          <Popover>
            <PopoverTrigger asChild>
              <button
                type="button"
                className={cn(
                  "inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] font-medium transition-colors hover:bg-muted cursor-pointer",
                  hasCustomStyle
                    ? "bg-primary/10 text-primary border border-primary/30"
                    : "text-muted-foreground hover:text-foreground"
                )}
                title="Customize Typography & Colors"
              >
                <Palette className="h-3 w-3" />
                <span>Style</span>
                {hasCustomStyle && <span className="h-1.5 w-1.5 rounded-full bg-primary" />}
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-3 shadow-lg" align="end">
              <div className="flex items-center justify-between border-b border-border/60 pb-2">
                <span className="text-xs font-semibold">Field Styling</span>
                {hasCustomStyle && (
                  <button
                    type="button"
                    onClick={() =>
                      onStyleChange({
                        textColor: null,
                        textOpacity: 1,
                        backgroundColor: null,
                        backgroundOpacity: 1,
                      })
                    }
                    className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-destructive cursor-pointer"
                  >
                    <RotateCcw className="h-2.5 w-2.5" />
                    Reset
                  </button>
                )}
              </div>

              <div className="mt-2.5 flex flex-col gap-3">
                {/* Text Color */}
                <div>
                  <label className="text-[11px] font-medium text-muted-foreground">Text Color</label>
                  <div className="mt-1 flex items-center gap-2">
                    <input
                      type="color"
                      value={style?.textColor || "#FFFFFF"}
                      onChange={(e) => onStyleChange({ ...style, textColor: e.target.value })}
                      className="h-6 w-7 cursor-pointer rounded border border-border bg-transparent p-0.5"
                    />
                    <Input
                      type="text"
                      value={style?.textColor || ""}
                      placeholder="Default (#FFFFFF)"
                      onChange={(e) => onStyleChange({ ...style, textColor: e.target.value || null })}
                      className="h-7 text-xs font-mono"
                    />
                  </div>
                </div>

                {/* Text Opacity Slider */}
                <div>
                  <div className="flex justify-between text-[11px] font-medium text-muted-foreground">
                    <span>Text Opacity</span>
                    <span>{Math.round((style?.textOpacity ?? 1) * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={style?.textOpacity ?? 1}
                    onChange={(e) => onStyleChange({ ...style, textOpacity: parseFloat(e.target.value) })}
                    className="mt-1 h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-muted accent-primary"
                  />
                </div>

                {/* Background Color */}
                <div>
                  <label className="text-[11px] font-medium text-muted-foreground">Background Color</label>
                  <div className="mt-1 flex items-center gap-2">
                    <input
                      type="color"
                      value={style?.backgroundColor || "#000000"}
                      onChange={(e) => onStyleChange({ ...style, backgroundColor: e.target.value })}
                      className="h-6 w-7 cursor-pointer rounded border border-border bg-transparent p-0.5"
                    />
                    <Input
                      type="text"
                      value={style?.backgroundColor || ""}
                      placeholder="Transparent"
                      onChange={(e) => onStyleChange({ ...style, backgroundColor: e.target.value || null })}
                      className="h-7 text-xs font-mono"
                    />
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        )}

        {showCodeBadge && (
          <code className="rounded bg-muted/60 px-1 py-0.5 text-[9px] font-mono text-muted-foreground select-all shrink-0 max-w-[130px] truncate" title={fieldName}>
            {fieldName}
          </code>
        )}
      </div>
    </div>
  )
}

/* ============================================================
   PROPS FOR DYNAMIC STYLED FIELD
   ============================================================ */

export type DynamicFieldType =
  | "text"
  | "textarea"
  | "richtext"
  | "number"
  | "select"
  | "radio"
  | "switch"
  | "color"
  | "image"
  | "video"

export interface SelectOption {
  label: string
  value: string | number
  hint?: string
}

export interface DynamicStyledFieldProps extends BaseProps {
  type?: DynamicFieldType
  multiline?: boolean
  value?: any
  checked?: boolean
  onChange?: (value: any) => void
  placeholder?: string
  options?: SelectOption[]
  min?: number
  max?: number
  step?: number
  rows?: number
  disabled?: boolean
  required?: boolean
  validation?: NormalFieldValidation
  onValidChange?: (isValid: boolean) => void

  // Style controls (can be embedded in value object OR passed explicitly)
  enableStyle?: boolean
  style?: FieldStyle
  onStyleChange?: (style: FieldStyle) => void

  // Multimedia specific
  opacity?: number
  onOpacityChange?: (val: number) => void
  overlayColor?: string
  onOverlayColorChange?: (color: string) => void
  overlayOpacity?: number
  onOverlayOpacityChange?: (opacity: number) => void
}

/* ============================================================
   UNIVERSAL DYNAMIC STYLED FIELD COMPONENT
   ============================================================ */

export function DynamicStyledField(props: DynamicStyledFieldProps) {
  const {
    type: explicitType = "text",
    multiline,
    label,
    fieldName,
    value,
    checked,
    onChange,
    placeholder,
    options = [],
    min,
    max,
    step,
    rows = 3,
    disabled = false,
    required = false,
    hint,
    className,
    validation: explicitValidation,
    onValidChange,
    enableStyle = true,
    style: explicitStyle,
    onStyleChange: explicitOnStyleChange,
  } = props

  const type = multiline ? "textarea" : explicitType

  const validation = useMemo(() => {
    if (explicitValidation) return explicitValidation
    if (required) return { required: true }
    return undefined
  }, [explicitValidation, required])

  const [touched, setTouched] = useState(false)

  // Normalize unified value and embedded styles
  const rawInput = checked !== undefined ? checked : value
  const { val: rawValue, style: embeddedStyle } = useMemo(() => {
    return normalizeUnifiedValue(rawInput)
  }, [rawInput])

  const activeStyle = explicitStyle || embeddedStyle

  // Unified change handler that updates value + preserves / includes styles
  const handleValueChange = (newVal: any) => {
    if (!onChange) return
    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      onChange({
        ...value,
        value: newVal,
      })
    } else if (enableStyle && (type === "text" || type === "textarea" || type === "richtext" || type === "number")) {
      onChange({
        value: newVal,
        textColor: activeStyle?.textColor ?? null,
        textOpacity: activeStyle?.textOpacity ?? 1,
        backgroundColor: activeStyle?.backgroundColor ?? null,
        backgroundOpacity: activeStyle?.backgroundOpacity ?? 1,
      })
    } else {
      onChange(newVal)
    }
  }

  const handleStyleChange = (newStyle: FieldStyle) => {
    if (explicitOnStyleChange) {
      explicitOnStyleChange(newStyle)
    } else if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      onChange?.({
        ...value,
        ...newStyle,
      })
    } else {
      onChange?.({
        value: rawValue ?? "",
        textColor: newStyle.textColor ?? activeStyle?.textColor ?? null,
        textOpacity: newStyle.textOpacity ?? activeStyle?.textOpacity ?? 1,
        backgroundColor: newStyle.backgroundColor ?? activeStyle?.backgroundColor ?? null,
        backgroundOpacity: newStyle.backgroundOpacity ?? activeStyle?.backgroundOpacity ?? 1,
      })
    }
  }

  const error = getValidationError(rawValue, validation, type)

  useEffect(() => {
    onValidChange?.(!error)
  }, [error, onValidChange])

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {/* Field Header with FieldName & Style Popover */}
      <FieldHeader
        label={label}
        fieldName={fieldName}
        required={required || validation?.required}
        enableStyle={enableStyle && (type === "text" || type === "textarea" || type === "richtext" || type === "number")}
        style={activeStyle}
        onStyleChange={handleStyleChange}
      />

      {/* Render matching input based on type */}
      {(() => {
        switch (type) {
          case "text":
            return (
              <Input
                type="text"
                value={rawValue ?? ""}
                placeholder={placeholder}
                disabled={disabled}
                onChange={(e) => handleValueChange(e.target.value)}
                onBlur={() => setTouched(true)}
              />
            )

          case "textarea":
            return (
              <Textarea
                value={rawValue ?? ""}
                placeholder={placeholder}
                rows={rows}
                disabled={disabled}
                onChange={(e) => handleValueChange(e.target.value)}
                onBlur={() => setTouched(true)}
              />
            )

          case "richtext":
            return (
              <RichTextEditor
                value={rawValue ?? ""}
                placeholder={placeholder}
                onChange={(html) => handleValueChange(html)}
              />
            )

          case "number": {
            const numVal =
              rawValue === undefined || rawValue === null || rawValue === "" || Number.isNaN(Number(rawValue))
                ? ""
                : rawValue
            return (
              <Input
                type="number"
                value={numVal}
                placeholder={placeholder}
                min={min ?? validation?.min}
                max={max ?? validation?.max}
                step={step}
                disabled={disabled}
                onChange={(e) => {
                  const strVal = e.target.value
                  if (strVal === "") {
                    handleValueChange("")
                  } else {
                    const parsed = Number(strVal)
                    handleValueChange(Number.isNaN(parsed) ? "" : parsed)
                  }
                }}
                onBlur={() => setTouched(true)}
              />
            )
          }

          case "select":
            return (
              <Select
                value={rawValue !== undefined && rawValue !== null ? String(rawValue) : ""}
                onValueChange={(val) => {
                  handleValueChange(val)
                  setTouched(true)
                }}
                disabled={disabled}
              >
                <SelectTrigger className="w-full" onBlur={() => setTouched(true)}>
                  <SelectValue placeholder={placeholder ?? "Select option"} />
                </SelectTrigger>
                <SelectContent>
                  {options.map((opt) => (
                    <SelectItem key={String(opt.value)} value={String(opt.value)}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )

          case "radio":
            return (
              <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
                {options.map((opt) => {
                  const isSelected = String(rawValue) === String(opt.value)
                  return (
                    <button
                      key={String(opt.value)}
                      type="button"
                      disabled={disabled}
                      onClick={() => {
                        handleValueChange(opt.value)
                        setTouched(true)
                      }}
                      className={cn(
                        "flex flex-1 items-center justify-center rounded-lg border px-3 py-2 text-xs font-medium transition-all",
                        isSelected
                          ? "border-primary bg-primary/10 text-primary font-semibold shadow-xs"
                          : "border-border/70 bg-background text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                      )}
                    >
                      {opt.label}
                    </button>
                  )
                })}
              </div>
            )

          case "switch":
            return (
              <div className="flex items-center justify-between gap-3 py-1">
                {hint && <p className="text-[11px] text-muted-foreground">{hint}</p>}
                <button
                  type="button"
                  role="switch"
                  aria-checked={Boolean(rawValue)}
                  disabled={disabled}
                  onClick={() => {
                    handleValueChange(!rawValue)
                    setTouched(true)
                  }}
                  className={cn(
                    "relative h-5 w-9 shrink-0 rounded-full transition-colors",
                    Boolean(rawValue) ? "bg-primary" : "bg-muted"
                  )}
                >
                  <span
                    className={cn(
                      "absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-background shadow transition-transform",
                      Boolean(rawValue) && "translate-x-4"
                    )}
                  />
                </button>
              </div>
            )

          case "color":
            return (
              <div className="flex items-center gap-2.5">
                <input
                  type="color"
                  value={rawValue || "#000000"}
                  onChange={(e) => handleValueChange(e.target.value)}
                  disabled={disabled}
                  className="h-8 w-10 cursor-pointer rounded border border-border bg-transparent p-0.5"
                />
                <Input
                  type="text"
                  value={rawValue ?? ""}
                  placeholder="#000000"
                  disabled={disabled}
                  onChange={(e) => handleValueChange(e.target.value)}
                  className="h-8 flex-1 font-mono text-xs"
                />
              </div>
            )

          case "image":
            return (
              <ImageUploadField
                label=""
                value={rawValue}
                fieldName={fieldName}
                onChange={handleValueChange}
                opacity={props.opacity}
                onOpacityChange={props.onOpacityChange}
                overlayColor={props.overlayColor}
                onOverlayColorChange={props.onOverlayColorChange}
                overlayOpacity={props.overlayOpacity}
                onOverlayOpacityChange={props.onOverlayOpacityChange}
              />
            )

          case "video":
            return (
              <VideoUploader
                label=""
                value={rawValue}
                fieldName={fieldName}
                onChange={handleValueChange}
                opacity={props.opacity}
                onOpacityChange={props.onOpacityChange}
                overlayColor={props.overlayColor}
                onOverlayColorChange={props.onOverlayColorChange}
                overlayOpacity={props.overlayOpacity}
                onOverlayOpacityChange={props.onOverlayOpacityChange}
              />
            )

          default:
            return null
        }
      })()}

      {/* Validation or Helper Hint */}
      {touched && error ? (
        <p className="text-xs font-medium text-destructive">{error}</p>
      ) : hint && type !== "switch" ? (
        <p className="text-[11px] text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  )
}

/* ============================================================
   LEGACY EXPORTS & CONVENIENCE WRAPPERS
   ============================================================ */

export type TextFieldProps = Omit<DynamicStyledFieldProps, "type">
export type TextAreaFieldProps = Omit<DynamicStyledFieldProps, "type">
export type NumberFieldProps = Omit<DynamicStyledFieldProps, "type">
export type SelectFieldProps = Omit<DynamicStyledFieldProps, "type">
export type SwitchFieldProps = Omit<DynamicStyledFieldProps, "type">
export type ColorFieldProps = Omit<DynamicStyledFieldProps, "type">

export function TextField(props: TextFieldProps) {
  return <DynamicStyledField type="text" {...props} />
}

export function TextAreaField(props: TextAreaFieldProps) {
  return <DynamicStyledField type="textarea" {...props} />
}

export function NumberField(props: NumberFieldProps) {
  return <DynamicStyledField type="number" {...props} />
}

export function SelectField(props: SelectFieldProps) {
  return <DynamicStyledField type="select" {...props} />
}

export function SwitchField(props: SwitchFieldProps) {
  return <DynamicStyledField type="switch" {...props} />
}

export function ColorField(props: ColorFieldProps) {
  return <DynamicStyledField type="color" {...props} />
}

export function FieldWrapper({
  label,
  hint,
  className,
  children,
}: BaseProps & { children: React.ReactNode }) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label && <Label className="text-xs font-semibold text-foreground">{label}</Label>}
      {children}
      {hint && <p className="text-[11px] text-muted-foreground">{hint}</p>}
    </div>
  )
}

export function getSafeString(val: any, fallback: string = ""): string {
  if (val === null || val === undefined) return fallback
  if (typeof val === "string") {
    if (val.trim() === "[object Object]") return fallback
    return val || fallback
  }
  if (typeof val === "number" || typeof val === "boolean") return String(val)
  if (typeof val === "object") {
    if (val.value !== undefined) return getSafeString(val.value, fallback)
    if (val.text !== undefined) return getSafeString(val.text, fallback)
    if (val.title !== undefined) return getSafeString(val.title, fallback)
    if (val.label !== undefined) return getSafeString(val.label, fallback)
  }
  return fallback
}

export { DynamicStyledPreview, DynamicStyledText } from "@/components/shared/DynamicStyledPreview"


