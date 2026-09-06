import * as React from "react"
import { useEffect, useState } from "react"
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
import { ImageUploadField } from "@/components/shared/ImageUploadField"
import { VideoUploadField as VideoUploader } from "@/components/shared/VideoUploadField"
import { cn } from "@/lib/utils"

/*
 * ============================================================
 * COMMON / BASE PROPS & TYPES
 * ============================================================
 */

export interface BaseProps {
  label: string
  hint?: string
  className?: string
}

export interface FieldStyle {
  textColor?: string | null
  textOpacity?: number
  backgroundColor?: string | null
  backgroundOpacity?: number
}

export interface StyledFieldProps {
  enableStyle?: boolean
  style?: FieldStyle
  onStyleChange?: (style: FieldStyle) => void
}

export interface NormalFieldValidation {
  required?: boolean
  minLength?: number
  maxLength?: number
  min?: number // for number type
  max?: number // for number type
  pattern?: RegExp | string // regex validation for text/textarea
  patternMessage?: string // custom error message when regex fails
  custom?: (value: string | number) => string | undefined
}

export type ValidationRules = NormalFieldValidation

const updateFieldStyle = (
  style: FieldStyle | undefined,
  onStyleChange: ((style: FieldStyle) => void) | undefined,
  patch: Partial<FieldStyle>
) => {
  const currentTextColor =
    style?.textColor !== undefined && style?.textColor !== "" ? style.textColor : null
  const currentBgColor =
    style?.backgroundColor !== undefined && style?.backgroundColor !== "" ? style.backgroundColor : null

  const nextTextColor =
    patch.textColor !== undefined
      ? (patch.textColor ? patch.textColor : null)
      : currentTextColor
  const nextBgColor =
    patch.backgroundColor !== undefined
      ? (patch.backgroundColor ? patch.backgroundColor : null)
      : currentBgColor

  onStyleChange?.({
    ...style,
    ...patch,
    textColor: nextTextColor,
    backgroundColor: nextBgColor,
  })
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

/*
 * ============================================================
 * COLOR FIELD (SINGLE SOURCE OF TRUTH)
 * ============================================================
 */

export interface ColorFieldProps extends BaseProps {
  value: string
  onChange: (value: string) => void
}

const parseColor = (value: string) => {
  const hexMatch = value?.match(
    /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})([0-9a-fA-F]{2})?$/
  )

  if (hexMatch) {
    const hex =
      hexMatch[1].length === 3
        ? hexMatch[1]
            .split("")
            .map((part) => part + part)
            .join("")
        : hexMatch[1]

    return {
      hex: `#${hex}`,
      opacity: hexMatch[2] ? parseInt(hexMatch[2], 16) / 255 : 1,
    }
  }

  const rgbMatch = value?.match(
    /^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*([\d.]+))?\s*\)$/i
  )

  if (rgbMatch) {
    const red = Number(rgbMatch[1])
    const green = Number(rgbMatch[2])
    const blue = Number(rgbMatch[3])

    return {
      hex: `#${[red, green, blue]
        .map((part) => part.toString(16).padStart(2, "0"))
        .join("")}`,
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
            onChange={(e) =>
              onChange(formatColor(e.target.value, parsedColor.opacity))
            }
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
          <span className="w-16 shrink-0 text-xs text-muted-foreground">
            Opacity
          </span>
          <input
            type="range"
            min="0"
            max="100"
            value={opacityPercent}
            onChange={(e) =>
              onChange(
                formatColor(parsedColor.hex, Number(e.target.value) / 100)
              )
            }
            className="w-full accent-primary"
          />
          <span className="w-10 text-right font-mono text-xs text-muted-foreground">
            {opacityPercent}%
          </span>
        </div>
      </div>
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
        value={style?.textColor ?? ""}
        onChange={(value) =>
          updateFieldStyle(style, onStyleChange, { textColor: value || null })
        }
      />
      <ColorField
        label="Background color"
        value={style?.backgroundColor ?? ""}
        onChange={(value) =>
          updateFieldStyle(style, onStyleChange, { backgroundColor: value || null })
        }
      />
    </div>
  )
}

/*
 * ============================================================
 * VALIDATION LOGIC
 * ============================================================
 */

const getValidationError = (
  value: string | number | undefined,
  validation?: NormalFieldValidation,
  type?: string
): string | undefined => {
  if (!validation) return undefined

  const strValue = value === undefined || value === null ? "" : String(value)
  const isValueEmpty = strValue.trim() === ""

  if (validation.required && isValueEmpty) {
    return "This field is required"
  }

  if (!isValueEmpty) {
    if (
      validation.minLength !== undefined &&
      strValue.length < validation.minLength
    ) {
      return `Minimum ${validation.minLength} characters required`
    }
    if (
      validation.maxLength !== undefined &&
      strValue.length > validation.maxLength
    ) {
      return `Maximum ${validation.maxLength} characters allowed`
    }

    if (
      type === "number" ||
      validation.min !== undefined ||
      validation.max !== undefined
    ) {
      const num = Number(value)
      if (!isNaN(num)) {
        if (validation.min !== undefined && num < validation.min) {
          return `Minimum value is ${validation.min}`
        }
        if (validation.max !== undefined && num > validation.max) {
          return `Maximum value is ${validation.max}`
        }
      }
    }

    if (validation.pattern) {
      const regex =
        typeof validation.pattern === "string"
          ? new RegExp(validation.pattern)
          : validation.pattern
      regex.lastIndex = 0
      if (!regex.test(strValue)) {
        return validation.patternMessage ?? "Invalid format"
      }
    }
  }

  if (validation.custom) {
    return validation.custom(value ?? "")
  }

  return undefined
}

/*
 * ============================================================
 * DISCRIMINATED UNION PROPS
 * ============================================================
 */

type BaseContainerProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "onChange" | "style"
> & {
  label: string
  hint?: string
  className?: string
}

interface StylableBaseProps extends BaseContainerProps {
  disabled?: boolean
  validation?: NormalFieldValidation
  onValidChange?: (isValid: boolean) => void
  enableStyle?: boolean
  style?: FieldStyle
  onStyleChange?: (style: FieldStyle) => void
}

export interface DynamicTextFieldProps extends StylableBaseProps {
  type: "text"
  value: string | number | undefined
  onChange: (value: string) => void
  placeholder?: string
  checked?: never
  options?: never
  rows?: never
}

export interface DynamicNumberFieldProps extends StylableBaseProps {
  type: "number"
  value: string | number | undefined
  onChange: (value: string) => void
  placeholder?: string
  min?: number
  max?: number
  step?: number | string
  checked?: never
  options?: never
  rows?: never
}

export interface DynamicTextAreaFieldProps extends StylableBaseProps {
  type: "textarea"
  value: string | number | undefined
  onChange: (value: string) => void
  placeholder?: string
  rows?: number
  maxLength?: number
  checked?: never
  options?: never
}

export interface DynamicColorFieldProps extends BaseContainerProps {
  type: "color"
  value: string
  onChange: (value: string) => void
  checked?: never
  options?: never
  rows?: never
  enableStyle?: never
  style?: never
  onStyleChange?: never
  validation?: never
  onValidChange?: never
}

export interface DynamicSelectFieldProps extends StylableBaseProps {
  type: "select"
  value: string | undefined
  onChange: (value: string) => void
  options: { value: string; label: string }[]
  placeholder?: string
  checked?: never
  rows?: never
}

export interface DynamicSwitchFieldProps extends BaseContainerProps {
  type: "switch"
  checked: boolean
  onChange: (checked: boolean) => void
  value?: never
  options?: never
  rows?: never
  enableStyle?: never
  style?: never
  onStyleChange?: never
  validation?: never
  onValidChange?: never
}

export interface DynamicImageFieldProps extends BaseContainerProps {
  type: "image"
  value?: string
  fieldName?: string
  onChange: (value: string) => void
  opacity?: number
  onOpacityChange?: (value: number) => void
  overlayColor?: string
  onOverlayColorChange?: (value: string) => void
  overlayOpacity?: number
  onOverlayOpacityChange?: (value: number) => void
  checked?: never
  options?: never
  rows?: never
  enableStyle?: never
  style?: never
  onStyleChange?: never
  validation?: never
  onValidChange?: never
}

export interface DynamicVideoFieldProps extends BaseContainerProps {
  type: "video"
  value?: string
  fieldName?: string
  onChange: (value: string) => void
  opacity?: number
  onOpacityChange?: (value: number) => void
  overlayColor?: string
  onOverlayColorChange?: (value: string) => void
  overlayOpacity?: number
  onOverlayOpacityChange?: (value: number) => void
  checked?: never
  options?: never
  rows?: never
  enableStyle?: never
  style?: never
  onStyleChange?: never
  validation?: never
  onValidChange?: never
}

export type DynamicStyledFieldProps =
  | DynamicTextFieldProps
  | DynamicNumberFieldProps
  | DynamicTextAreaFieldProps
  | DynamicColorFieldProps
  | DynamicSelectFieldProps
  | DynamicSwitchFieldProps
  | DynamicImageFieldProps
  | DynamicVideoFieldProps

/*
 * ============================================================
 * INTERNAL FIELD IMPLEMENTATIONS
 * ============================================================
 */

function DynamicTextualField(
  props:
    | DynamicTextFieldProps
    | DynamicNumberFieldProps
    | DynamicTextAreaFieldProps
) {
  const {
    type,
    label,
    value,
    onChange,
    placeholder,
    hint,
    validation,
    onValidChange,
    enableStyle,
    style,
    onStyleChange,
    className,
    ...rest
  } = props

  const [touched, setTouched] = useState(false)
  const error = getValidationError(value, validation, type)

  useEffect(() => {
    onValidChange?.(!error)
  }, [error, onValidChange])

  return (
    <div className={cn("flex flex-col gap-1.5", className)} {...rest}>
      {label && (
        <Label className="text-xs font-semibold text-foreground">{label}</Label>
      )}

      {type === "textarea" ? (
        <Textarea
          value={value ?? ""}
          placeholder={placeholder}
          rows={props.rows ?? 3}
          maxLength={validation?.maxLength ?? props.maxLength}
          disabled={props.disabled}
          onChange={(e) => onChange(e.target.value)}
          onBlur={() => setTouched(true)}
        />
      ) : type === "number" ? (
        <Input
          type="number"
          value={value ?? ""}
          placeholder={placeholder}
          min={validation?.min ?? props.min}
          max={validation?.max ?? props.max}
          step={props.step}
          disabled={props.disabled}
          onChange={(e) => onChange(e.target.value)}
          onBlur={() => setTouched(true)}
        />
      ) : (
        <Input
          type="text"
          value={value ?? ""}
          placeholder={placeholder}
          disabled={props.disabled}
          onChange={(e) => onChange(e.target.value)}
          onBlur={() => setTouched(true)}
        />
      )}

      {touched && error ? (
        <p className="text-xs text-destructive">{error}</p>
      ) : hint ? (
        <p className="text-[11px] text-muted-foreground">{hint}</p>
      ) : null}

      {enableStyle && onStyleChange && (
        <div className="mt-1">
          <FieldStyleControls style={style} onStyleChange={onStyleChange} />
        </div>
      )}
    </div>
  )
}

function DynamicSelectFieldComponent(props: DynamicSelectFieldProps) {
  const {
    label,
    value,
    onChange,
    options,
    placeholder,
    hint,
    validation,
    onValidChange,
    enableStyle,
    style,
    onStyleChange,
    className,
    ...rest
  } = props

  const [touched, setTouched] = useState(false)
  const error = getValidationError(value, validation, "select")

  useEffect(() => {
    onValidChange?.(!error)
  }, [error, onValidChange])

  return (
    <div className={cn("flex flex-col gap-1.5", className)} {...rest}>
      {label && (
        <Label className="text-xs font-semibold text-foreground">{label}</Label>
      )}

      <Select
        value={value ?? ""}
        onValueChange={(val) => {
          onChange(val)
          setTouched(true)
        }}
      >
        <SelectTrigger className="w-full" onBlur={() => setTouched(true)}>
          <SelectValue placeholder={placeholder ?? "Select"} />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {touched && error ? (
        <p className="text-xs text-destructive">{error}</p>
      ) : hint ? (
        <p className="text-[11px] text-muted-foreground">{hint}</p>
      ) : null}

      {enableStyle && onStyleChange && (
        <div className="mt-1">
          <FieldStyleControls style={style} onStyleChange={onStyleChange} />
        </div>
      )}
    </div>
  )
}

function DynamicColorFieldComponent({
  type: _type,
  ...props
}: DynamicColorFieldProps) {
  return <ColorField {...props} />
}

function DynamicSwitchFieldComponent(props: DynamicSwitchFieldProps) {
  const { label, checked, onChange, hint, className, ...rest } = props

  return (
    <div
      className={cn("flex items-center justify-between gap-3 py-1", className)}
      {...rest}
    >
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

function DynamicImageFieldComponent(props: DynamicImageFieldProps) {
  const {
    label,
    value,
    fieldName,
    onChange,
    opacity,
    onOpacityChange,
    overlayColor,
    onOverlayColorChange,
    overlayOpacity,
    onOverlayOpacityChange,
    className,
    ...rest
  } = props

  return (
    <ImageUploadField
      label={label}
      value={value}
      fieldName={fieldName}
      onChange={onChange}
      opacity={opacity}
      onOpacityChange={onOpacityChange}
      overlayColor={overlayColor}
      onOverlayColorChange={onOverlayColorChange}
      overlayOpacity={overlayOpacity}
      onOverlayOpacityChange={onOverlayOpacityChange}
      className={className}
      {...rest}
    />
  )
}

function DynamicVideoFieldComponent(props: DynamicVideoFieldProps) {
  const {
    label,
    value,
    fieldName,
    onChange,
    opacity,
    onOpacityChange,
    overlayColor,
    onOverlayColorChange,
    overlayOpacity,
    onOverlayOpacityChange,
    className,
    ...rest
  } = props

  return (
    <VideoUploader
      label={label}
      value={value}
      fieldName={fieldName}
      onChange={onChange}
      opacity={opacity}
      onOpacityChange={onOpacityChange}
      overlayColor={overlayColor}
      onOverlayColorChange={onOverlayColorChange}
      overlayOpacity={overlayOpacity}
      onOverlayOpacityChange={onOverlayOpacityChange}
      className={className}
      {...rest}
    />
  )
}

/*
 * ============================================================
 * SINGLE UNIFIED DYNAMIC STYLED FIELD
 * ============================================================
 */

export function DynamicStyledField(props: DynamicStyledFieldProps) {
  switch (props.type) {
    case "text":
    case "number":
    case "textarea":
      return <DynamicTextualField {...props} />
    case "color":
      return <DynamicColorFieldComponent {...props} />
    case "select":
      return <DynamicSelectFieldComponent {...props} />
    case "switch":
      return <DynamicSwitchFieldComponent {...props} />
    case "image":
      return <DynamicImageFieldComponent {...props} />
    case "video":
      return <DynamicVideoFieldComponent {...props} />
    default:
      return null
  }
}

/*
 * ============================================================
 * LEGACY EXPORTS (BACKWARD COMPATIBILITY)
 * ============================================================
 */

export type TextFieldProps = Omit<DynamicTextFieldProps, "type"> &
  StyledFieldProps

export function TextField(props: TextFieldProps) {
  return <DynamicStyledField type="text" {...props} />
}

export type NumberFieldProps = Omit<
  DynamicNumberFieldProps,
  "type" | "onChange" | "value"
> &
  StyledFieldProps & {
    value: number | undefined
    onChange: (value: number) => void
  }

export function NumberField({ value, onChange, ...rest }: NumberFieldProps) {
  return (
    <DynamicStyledField
      type="number"
      value={value}
      onChange={(val) => onChange(Number(val))}
      {...rest}
    />
  )
}

export type TextAreaFieldProps = Omit<DynamicTextAreaFieldProps, "type"> &
  StyledFieldProps

export function TextAreaField(props: TextAreaFieldProps) {
  return <DynamicStyledField type="textarea" {...props} />
}

export type SelectFieldProps = Omit<DynamicSelectFieldProps, "type"> &
  StyledFieldProps

export function SelectField(props: SelectFieldProps) {
  return <DynamicStyledField type="select" {...props} />
}

export type SwitchFieldProps = Omit<DynamicSwitchFieldProps, "type">

export function SwitchField(props: SwitchFieldProps) {
  return <DynamicStyledField type="switch" {...props} />
}
