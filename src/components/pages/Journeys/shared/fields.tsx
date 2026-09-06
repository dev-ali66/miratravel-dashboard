/* =====================================================
   JOURNEYS — SHARED REUSABLE FORM FIELDS
===================================================== */

import React from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { ImageUploadField } from "@/components/shared/ImageUploadField"
import {
  DynamicStyledField,
  ColorField,
  type FieldStyle,
  type ValidationRules,
} from "../../CMS/shared/FormControls"

export { DynamicStyledField, ColorField }
export type { FieldStyle, ValidationRules }

export function FormSection({
  title,
  active,
  onClick,
  badge,
  children,
}: {
  title: string
  active: boolean
  onClick: () => void
  badge?: string | number
  children: React.ReactNode
}) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border/60 bg-card transition-colors shadow-sm",
        !active && "overflow-hidden"
      )}
    >
      <button
        type="button"
        onClick={onClick}
        className={cn(
          "flex w-full items-center justify-between px-4 py-3.5 text-left transition-colors hover:bg-muted/40",
          active ? "rounded-t-xl bg-muted/20" : "rounded-xl"
        )}
      >
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-foreground">{title}</span>
          {badge !== undefined && (
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
              {badge}
            </span>
          )}
        </div>

        <ChevronDown
          className={cn(
            "h-4 w-4 text-muted-foreground transition-transform duration-200",
            active && "rotate-180"
          )}
        />
      </button>

      {active && (
        <div className="rounded-b-xl border-t border-border/60 p-4 space-y-4">
          {children}
        </div>
      )}
    </div>
  )
}

export function JourneyInputField({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  required,
  min,
  max,
  step,
  description,
}: {
  label: string
  value: string | number
  onChange: (val: any) => void
  type?: "text" | "number" | "url"
  placeholder?: string
  required?: boolean
  min?: number
  max?: number
  step?: number
  description?: string
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-foreground">
          {label} {required && <span className="text-destructive">*</span>}
        </label>
      </div>
      <input
        type={type}
        value={value ?? ""}
        onChange={(e) => {
          if (type === "number") {
            const parsed = e.target.value === "" ? 0 : Number(e.target.value)
            onChange(parsed)
          } else {
            onChange(e.target.value)
          }
        }}
        min={min}
        max={max}
        step={step}
        placeholder={placeholder}
        className="w-full rounded-lg border border-border/70 bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
      />
      {description && (
        <p className="text-[11px] text-muted-foreground">{description}</p>
      )}
    </div>
  )
}

export function JourneyTextareaField({
  label,
  value,
  onChange,
  rows = 3,
  placeholder,
  description,
}: {
  label: string
  value: string
  onChange: (val: string) => void
  rows?: number
  placeholder?: string
  description?: string
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-foreground">{label}</label>
      <textarea
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        placeholder={placeholder}
        className="w-full rounded-lg border border-border/70 bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary resize-y"
      />
      {description && (
        <p className="text-[11px] text-muted-foreground">{description}</p>
      )}
    </div>
  )
}

export function JourneySelectField<T extends string>({
  label,
  value,
  options,
  onChange,
  description,
}: {
  label: string
  value: T
  options: { label: string; value: T }[]
  onChange: (val: T) => void
  description?: string
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-foreground">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className="w-full rounded-lg border border-border/70 bg-background px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {description && (
        <p className="text-[11px] text-muted-foreground">{description}</p>
      )}
    </div>
  )
}

export function JourneyMultiBadgeSelect<T extends string>({
  label,
  selected,
  options,
  onChange,
  description,
}: {
  label: string
  selected: T[]
  options: { label: string; value: T }[]
  onChange: (val: T[]) => void
  description?: string
}) {
  const toggle = (val: T) => {
    if (selected.includes(val)) {
      onChange(selected.filter((item) => item !== val))
    } else {
      onChange([...selected, val])
    }
  }

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-foreground">{label}</label>
        <span className="text-[10px] text-muted-foreground">
          {selected.length} selected
        </span>
      </div>
      <div className="flex flex-wrap gap-1.5 pt-1">
        {options.map((opt) => {
          const isSelected = selected.includes(opt.value)
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => toggle(opt.value)}
              className={cn(
                "rounded-full border px-2.5 py-1 text-[11px] font-medium transition-all",
                isSelected
                  ? "border-primary bg-primary text-primary-foreground shadow-xs"
                  : "border-border/70 bg-background text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              {opt.label}
            </button>
          )
        })}
      </div>
      {description && (
        <p className="text-[11px] text-muted-foreground">{description}</p>
      )}
    </div>
  )
}

export function JourneyImageField({
  label,
  value,
  onChange,
  description,
}: {
  label: string
  value: string | null | undefined
  onChange: (val: string) => void
  description?: string
}) {
  return (
    <div className="space-y-1.5">
      <ImageUploadField
        label={label}
        value={value ?? ""}
        onChange={(url) => onChange(url || "")}
        fieldName={label.toLowerCase().replace(/\s+/g, "_")}

      />
      {description && (
        <p className="text-[11px] text-muted-foreground">{description}</p>
      )}
    </div>
  )
}
