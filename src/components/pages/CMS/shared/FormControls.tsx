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

interface TextFieldProps extends BaseProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function TextField({ value, onChange, placeholder, ...rest }: TextFieldProps) {
  return (
    <FieldWrapper {...rest}>
      <Input
        value={value ?? ""}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </FieldWrapper>
  )
}

interface NumberFieldProps extends BaseProps {
  value: number | undefined
  onChange: (value: number) => void
  placeholder?: string
}

export function NumberField({ value, onChange, placeholder, ...rest }: NumberFieldProps) {
  return (
    <FieldWrapper {...rest}>
      <Input
        type="number"
        value={value ?? ""}
        placeholder={placeholder}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </FieldWrapper>
  )
}

interface TextAreaFieldProps extends BaseProps {
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
    </FieldWrapper>
  )
}

interface ColorFieldProps extends BaseProps {
  value: string
  onChange: (value: string) => void
}

export function ColorField({ value, onChange, ...rest }: ColorFieldProps) {
  const safeValue = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(value || "")
    ? value
    : "#000000"

  return (
    <FieldWrapper {...rest}>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={safeValue}
          onChange={(e) => onChange(e.target.value)}
          className="h-10 w-10 shrink-0 cursor-pointer rounded border border-input bg-transparent p-1"
        />
        <Input
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#000000"
          className="font-mono"
        />
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
