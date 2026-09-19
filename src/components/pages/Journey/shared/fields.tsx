import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { ImageUploadField } from "@/components/shared/ImageUploadField"
import { VideoUploadField } from "@/components/shared/VideoUploadField"
import {
  DynamicStyledField,
  ColorField,
  type FieldStyle,
} from "../../CMS/shared/FormControls"

export { DynamicStyledField, ColorField }

export function FormSection({
  title,
  sectionNumber,
  active,
  onClick,
  children,
}: {
  title: string
  sectionNumber?: string
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
        <div className="border-t border-border/40 p-4 space-y-4">
          {children}
        </div>
      )}
    </div>
  )
}

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
}

export function Field({
  label,
  value,
  onChange,
  multiline = false,
  rows = 3,
  placeholder,
  type = "text",
  enableStyle,
  style,
  onStyleChange,
  disabled,
  readOnly,
  hint,
  className,
}: FieldProps) {
  const strValue = value === undefined || value === null ? "" : String(value)

  if (enableStyle) {
    return (
      <DynamicStyledField
        label={label}
        value={strValue}
        onChange={onChange}
        style={style}
        onStyleChange={onStyleChange}
        multiline={multiline}
        rows={rows}
        placeholder={placeholder}
      />
    )
  }

  return (
    <div className={cn("space-y-1.5", className)}>
      <label className="block text-xs font-semibold text-foreground uppercase tracking-wider">
        {label}
      </label>

      {multiline || type === "textarea" ? (
        <textarea
          rows={rows}
          value={strValue}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          className="w-full rounded-lg border border-border/60 bg-background px-3 py-2 text-xs outline-none focus:border-primary disabled:opacity-50"
        />
      ) : (
        <input
          type={type}
          value={strValue}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          className="w-full rounded-lg border border-border/60 bg-background px-3 py-2 text-xs outline-none focus:border-primary disabled:opacity-50"
        />
      )}

      {hint && <p className="text-[10px] text-muted-foreground">{hint}</p>}
    </div>
  )
}

export function ImageField({
  label,
  value,
  onChange,
}: {
  label: string
  value?: string
  onChange: (url: string) => void
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold text-foreground uppercase tracking-wider">
        {label}
      </label>
      <ImageUploadField
        value={value || ""}
        onChange={onChange}
        previewClassName="h-32 w-full object-cover rounded-lg border"
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
  onChange: (url: string) => void
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold text-foreground uppercase tracking-wider">
        {label}
      </label>
      <VideoUploadField
        value={value || ""}
        onChange={onChange}
      />
    </div>
  )
}
