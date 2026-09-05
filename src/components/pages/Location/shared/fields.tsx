/* =====================================================
   LOCATION — SHARED REUSABLE FORM FIELDS
   Thin, Location-scoped wrappers around the CMS's reusable
   controls. Do NOT duplicate CMS/shared components here —
   these only adapt them (label/value/onChange shape, image
   upload field-name derivation) for the Location module.
===================================================== */

import { ChevronDown, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { ImageUploadField } from "@/components/shared/ImageUploadField"
import { VideoUploadField } from "@/components/shared/VideoUploadField"
import {
  DynamicStyledField,
  ColorField,
  type FieldStyle,
  type ValidationRules,
} from "../../CMS/shared/FormControls"

export { DynamicStyledField, ColorField }

export function FormSection({
  title,
  active,
  onClick,
  children,
}: {
  title: string
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border/60 bg-card transition-colors",
        !active && "overflow-hidden"
      )}
    >
      <button
        type="button"
        onClick={onClick}
        className={cn(
          "flex w-full items-center justify-between px-4 py-3.5 text-left transition-colors",
          active ? "rounded-t-xl" : "rounded-xl"
        )}
      >
        <span className="text-sm font-medium">{title}</span>

        <ChevronDown
          className={cn(
            "h-4 w-4 text-muted-foreground transition-transform",
            active && "rotate-180"
          )}
        />
      </button>

      {active && (
        <div className="rounded-b-xl border-t border-border/60 p-4">
          {children}
        </div>
      )}
    </div>
  )
}

/* =====================================================
   FIELD
===================================================== */

export type FieldProps = {
  label: string
  value?: string | number
  onChange: (value: string) => void
  multiline?: boolean
  rows?: number
  placeholder?: string
  type?: "text" | "textarea" | "number"
  enableStyle?: boolean
  style?: FieldStyle
  onStyleChange?: (style: FieldStyle) => void
  disabled?: boolean
  readOnly?: boolean
  hint?: string
  className?: string
  validation?: ValidationRules
}

export function Field({
  label,
  value,
  onChange,
  multiline = false,
  rows = 3,
  placeholder,
  type,
  enableStyle,
  style,
  onStyleChange,
  disabled,
  hint,
  className,
  validation,
}: FieldProps) {
  const normalizedValue =
    value === undefined || value === null ? "" : String(value)

  const resolvedType = type ?? (multiline ? "textarea" : "text")

  if (resolvedType === "textarea") {
    return (
      <DynamicStyledField
        type="textarea"
        label={label}
        value={normalizedValue}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        enableStyle={enableStyle}
        style={style}
        onStyleChange={onStyleChange}
        disabled={disabled}
        hint={hint}
        className={className}
        validation={validation}
      />
    )
  }

  if (resolvedType === "number") {
    return (
      <DynamicStyledField
        type="number"
        label={label}
        value={normalizedValue}
        onChange={(val) => onChange(String(val))}
        placeholder={placeholder}
        enableStyle={enableStyle}
        style={style}
        onStyleChange={onStyleChange}
        disabled={disabled}
        hint={hint}
        className={className}
        validation={validation}
      />
    )
  }

  return (
    <DynamicStyledField
      type="text"
      label={label}
      value={normalizedValue}
      onChange={onChange}
      placeholder={placeholder}
      enableStyle={enableStyle}
      style={style}
      onStyleChange={onStyleChange}
      disabled={disabled}
      hint={hint}
      className={className}
      validation={validation}
    />
  )
}

/* =====================================================
   SELECT
===================================================== */

export function SelectField({
  label,
  value,
  options,
  onChange,
  enableStyle,
  style,
  onStyleChange,
  hint,
  placeholder,
}: {
  label: string
  value: string
  options: string[] | { label: string; value: string }[]
  onChange: (value: string) => void
  enableStyle?: boolean
  style?: FieldStyle
  onStyleChange?: (style: FieldStyle) => void
  hint?: string
  placeholder?: string
}) {
  const formattedOptions = options.map((option) =>
    typeof option === "string" ? { label: option, value: option } : option
  )

  return (
    <DynamicStyledField
      type="select"
      label={label}
      value={value}
      options={formattedOptions}
      onChange={onChange}
      enableStyle={enableStyle}
      style={style}
      onStyleChange={onStyleChange}
      hint={hint}
      placeholder={placeholder}
    />
  )
}

/* =====================================================
   SWITCH
===================================================== */

export function SwitchField({
  label,
  checked,
  onChange,
  hint,
}: {
  label: string
  checked?: boolean
  onChange: (checked: boolean) => void
  hint?: string
}) {
  return (
    <DynamicStyledField
      type="switch"
      label={label}
      checked={Boolean(checked)}
      onChange={onChange}
      hint={hint}
    />
  )
}

/* =====================================================
   IMAGE
===================================================== */

export function ImageField({
  label,
  value,
  onChange,
}: {
  label: string
  value?: string
  onChange: (value: string) => void
}) {
  const fieldName = `location${label
    .replace(/[^a-zA-Z0-9]+/g, " ")
    .trim()
    .split(/\s+/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("")}`

  return (
    <ImageUploadField
      label={label}
      value={value ?? ""}
      fieldName={fieldName}
      onChange={onChange}
    />
  )
}

/* =====================================================
   TEXT STYLE (color + font size pair)
   Generic editor for the common `{ textColor, fontSize }`
   shape used across per-element style overrides (label,
   title, paragraph, quote, ...). Font size is a free-form
   CSS size string (e.g. "40px", "2.5rem") rather than a
   fixed preset list, so it stays fully flexible.
===================================================== */

export function TextStyleFields({
  label,
  value,
  onChange,
}: {
  label: string
  value?: { textColor?: string; fontSize?: string }
  onChange: (value: { textColor: string; fontSize: string }) => void
}) {
  const safeValue = {
    textColor: value?.textColor ?? "",
    fontSize: value?.fontSize ?? "",
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      <ColorField
        label={`${label} — Color`}
        value={safeValue.textColor}
        onChange={(textColor) =>
          onChange({
            ...safeValue,
            textColor,
          })
        }
      />

      <Field
        label={`${label} — Font Size`}
        value={safeValue.fontSize}
        placeholder="e.g. 40px, 2.5rem"
        onChange={(fontSize) =>
          onChange({
            ...safeValue,
            fontSize,
          })
        }
      />
    </div>
  )
}

export function VideoField({
  label,
  value,
  onChange,
}: {
  label: string
  value?: string
  onChange: (value: string) => void
}) {
  const fieldName = `location${label
    .replace(/[^a-zA-Z0-9]+/g, " ")
    .trim()
    .split(/\s+/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("")}`

  return (
    <VideoUploadField
      label={label}
      value={value ?? ""}
      fieldName={fieldName}
      onChange={onChange}
    />
  )
}

/* =====================================================
   STRING ARRAY
===================================================== */

export function ArrayField({
  label,
  values,
  onChange,
}: {
  label: string
  values?: string[]
  onChange: (values: string[]) => void
}) {
  const safeValues = values ?? []

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-[11px] font-medium text-muted-foreground">
          {label}
        </label>

        <button
          type="button"
          onClick={() => onChange([...safeValues, ""])}
          className="text-[10px] font-medium text-primary"
        >
          + Add
        </button>
      </div>

      <div className="space-y-2">
        {safeValues.map((value, index) => (
          <div key={index} className="flex gap-2">
            <input
              value={value}
              onChange={(e) => {
                const next = [...safeValues]

                next[index] = e.target.value

                onChange(next)
              }}
              className="min-w-0 flex-1 rounded-lg border border-border/60 bg-background px-3 py-2 text-sm outline-none focus:border-primary"
            />

            <button
              type="button"
              onClick={() => onChange(safeValues.filter((_, i) => i !== index))}
              className="rounded-lg border border-border/60 px-2 text-destructive hover:bg-muted"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

/* =====================================================
   TEXT ARRAY
===================================================== */

export function TextArrayField({
  label,
  values,
  onChange,
}: {
  label: string
  values?: string[]
  onChange: (values: string[]) => void
}) {
  const safeValues = values ?? []

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-[11px] font-medium text-muted-foreground">
          {label}
        </label>

        <button
          type="button"
          onClick={() => onChange([...safeValues, ""])}
          className="text-[10px] font-medium text-primary"
        >
          + Add
        </button>
      </div>

      {safeValues.map((value, index) => (
        <div key={index} className="flex gap-2">
          <textarea
            rows={3}
            value={value}
            onChange={(e) => {
              const next = [...safeValues]

              next[index] = e.target.value

              onChange(next)
            }}
            className="min-w-0 flex-1 resize-none rounded-lg border border-border/60 bg-background px-3 py-2 text-sm outline-none focus:border-primary"
          />

          <button
            type="button"
            onClick={() => onChange(safeValues.filter((_, i) => i !== index))}
            className="h-9 rounded-lg border border-border/60 px-2 text-destructive"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}
    </div>
  )
}
