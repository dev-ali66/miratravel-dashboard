import { useState } from "react"
import { RepeaterList } from "./RepeaterList"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ArrowRight, SlidersHorizontal } from "lucide-react"
import { cn } from "@/lib/utils"

export type ButtonVariant = "primary" | "outline" | "secondary" | "dark" | "ghost" | "custom"
export type ButtonRounded = "full" | "xl" | "lg" | "md" | "sm" | "none"

export interface CmsButton {
  label: string
  url: string
  variant?: ButtonVariant | string
  style?: string
  rounded?: ButtonRounded | string
  backgroundColor?: string
  backgroundOpacity?: number
  textColor?: string
  textOpacity?: number
  hoverBackgroundColor?: string
  hoverTextColor?: string
  borderColor?: string
  borderWidth?: number | string
  target?: "_self" | "_blank" | string
  showIcon?: boolean
}

interface ButtonsFieldProps {
  label?: string
  fieldName?: string
  value?: CmsButton[]
  buttons?: CmsButton[]
  onChange: (value: CmsButton[]) => void
}

const VARIANT_OPTIONS: Array<{ value: ButtonVariant; label: string; bg: string; text: string }> = [
  { value: "primary", label: "Primary (Solid White)", bg: "#ffffff", text: "#000000" },
  { value: "outline", label: "Outline (Translucent Glass)", bg: "transparent", text: "#ffffff" },
  { value: "secondary", label: "Secondary (Forest Green)", bg: "#1a3d14", text: "#ffffff" },
  { value: "dark", label: "Dark (Solid Black)", bg: "#171717", text: "#ffffff" },
  { value: "ghost", label: "Ghost (Minimalist)", bg: "transparent", text: "#ffffff" },
  { value: "custom", label: "Custom (Manual Overrides)", bg: "#ffffff", text: "#000000" },
]

const ROUNDED_OPTIONS: Array<{ value: ButtonRounded; label: string; classPreview: string }> = [
  { value: "full", label: "Pill / Full Rounded", classPreview: "rounded-full" },
  { value: "xl", label: "Extra Large (16px)", classPreview: "rounded-2xl" },
  { value: "lg", label: "Large (12px)", classPreview: "rounded-xl" },
  { value: "md", label: "Medium (8px)", classPreview: "rounded-lg" },
  { value: "sm", label: "Small (4px)", classPreview: "rounded-md" },
  { value: "none", label: "Square / No Radius", classPreview: "rounded-none" },
]

export function colorWithOpacity(hex?: string | null, opacity?: number): string | undefined {
  if (!hex || hex === "transparent") return hex || undefined
  if (opacity === undefined || opacity === null || opacity === 1 || opacity === 100) return hex
  const cleanHex = hex.replace("#", "")
  if (cleanHex.length === 6) {
    const r = parseInt(cleanHex.substring(0, 2), 16)
    const g = parseInt(cleanHex.substring(2, 4), 16)
    const b = parseInt(cleanHex.substring(4, 6), 16)
    const normOpacity = opacity > 1 ? opacity / 100 : opacity
    return `rgba(${r}, ${g}, ${b}, ${normOpacity})`
  }
  return hex
}

export function ButtonsField({
  label = "Buttons",
  fieldName,
  value,
  buttons,
  onChange,
}: ButtonsFieldProps) {
  const currentButtons = value ?? buttons ?? []
  const [activeTab, setActiveTab] = useState<Record<number, "basic" | "styling">>({})

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-semibold text-foreground">{label}</p>
        {fieldName && (
          <code className="rounded bg-muted/60 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
            {fieldName}
          </code>
        )}
      </div>

      <RepeaterList<CmsButton>
        items={currentButtons}
        onChange={onChange}
        addLabel="Add Action Button"
        emptyLabel="No buttons added."
        itemLabel={(item) => item.label || "Untitled Button"}
        newItem={() => ({
          label: "Explore Journeys",
          url: "/journeys",
          variant: "primary",
          rounded: "full",
          backgroundColor: "#ffffff",
          backgroundOpacity: 100,
          textColor: "#000000",
          textOpacity: 100,
          hoverBackgroundColor: "#f3f4f6",
          hoverTextColor: "#000000",
          target: "_self",
          showIcon: true,
        })}
        renderItem={(item, update, index) => {
          const tab = activeTab[index] || "basic"
          const setTab = (t: "basic" | "styling") =>
            setActiveTab((prev) => ({ ...prev, [index]: t }))

          const handleVariantChange = (v: string) => {
            const preset = VARIANT_OPTIONS.find((o) => o.value === v)
            update({
              ...item,
              variant: v,
              style: v,
              ...(preset && v !== "custom"
                ? {
                    backgroundColor: preset.bg,
                    textColor: preset.text,
                    backgroundOpacity: v === "outline" ? 0 : 100,
                    borderColor: v === "outline" ? "#ffffff" : undefined,
                    borderWidth: v === "outline" ? "1px" : undefined,
                  }
                : {}),
            })
          }

          return (
            <div className="flex flex-col gap-3.5">
              {/* Tab Switcher */}
              <div className="flex items-center justify-between border-b border-border/60 pb-2">
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setTab("basic")}
                    className={cn(
                      "rounded-md px-2.5 py-1 text-xs font-medium transition cursor-pointer",
                      tab === "basic"
                        ? "bg-primary text-primary-foreground font-semibold"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    Content & Link
                  </button>
                  <button
                    type="button"
                    onClick={() => setTab("styling")}
                    className={cn(
                      "flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium transition cursor-pointer",
                      tab === "styling"
                        ? "bg-primary text-primary-foreground font-semibold"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <SlidersHorizontal className="h-3 w-3" />
                    Styling & Colors
                  </button>
                </div>

                {/* Micro Preview Pill */}
                <div
                  style={{
                    backgroundColor: colorWithOpacity(
                      item.backgroundColor || "#ffffff",
                      item.backgroundOpacity ?? 100
                    ),
                    color: colorWithOpacity(item.textColor || "#000000", item.textOpacity ?? 100),
                    borderColor: item.borderColor || "transparent",
                    borderWidth: item.borderWidth ? `${item.borderWidth}` : "1px",
                  }}
                  className={cn(
                    "inline-flex items-center gap-1 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider shadow-2xs transition",
                    item.rounded === "none"
                      ? "rounded-none"
                      : item.rounded === "sm"
                      ? "rounded-md"
                      : item.rounded === "md"
                      ? "rounded-lg"
                      : item.rounded === "xl"
                      ? "rounded-2xl"
                      : "rounded-full"
                  )}
                >
                  <span className="truncate max-w-[90px]">{item.label || "Button"}</span>
                  {item.showIcon !== false && <ArrowRight className="h-2.5 w-2.5 shrink-0" />}
                </div>
              </div>

              {/* BASIC TAB */}
              {tab === "basic" && (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="col-span-2 flex flex-col gap-1.5">
                    <Label className="text-xs font-medium">Button Label / Text</Label>
                    <Input
                      type="text"
                      placeholder="e.g. Explore Journeys"
                      value={item.label || ""}
                      onChange={(e) => update({ ...item, label: e.target.value })}
                      className="h-8 text-xs"
                    />
                  </div>

                  <div className="col-span-2 flex flex-col gap-1.5">
                    <Label className="text-xs font-medium">Destination URL</Label>
                    <Input
                      type="text"
                      placeholder="e.g. /journeys/europe or https://..."
                      value={item.url || ""}
                      onChange={(e) => update({ ...item, url: e.target.value })}
                      className="h-8 text-xs font-mono"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <Label className="text-xs font-medium">Button Style Variant</Label>
                    <Select
                      value={item.variant || item.style || "primary"}
                      onValueChange={handleVariantChange}
                    >
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue placeholder="Select Style" />
                      </SelectTrigger>
                      <SelectContent>
                        {VARIANT_OPTIONS.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value} className="text-xs">
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <Label className="text-xs font-medium">Open In</Label>
                    <Select
                      value={item.target || "_self"}
                      onValueChange={(val) => update({ ...item, target: val })}
                    >
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue placeholder="Target" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="_self" className="text-xs">
                          Same Tab (_self)
                        </SelectItem>
                        <SelectItem value="_blank" className="text-xs">
                          New Tab (_blank)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="col-span-2 flex items-center justify-between rounded-md border border-border/60 p-2 text-xs">
                    <span className="font-medium text-muted-foreground">Show Arrow Icon</span>
                    <input
                      type="checkbox"
                      checked={item.showIcon !== false}
                      onChange={(e) => update({ ...item, showIcon: e.target.checked })}
                      className="h-4 w-4 rounded accent-primary cursor-pointer"
                    />
                  </div>
                </div>
              )}

              {/* STYLING TAB */}
              {tab === "styling" && (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="col-span-2 flex flex-col gap-1.5">
                    <Label className="text-xs font-medium">Corner Radius / Shape</Label>
                    <Select
                      value={item.rounded || "full"}
                      onValueChange={(val) => update({ ...item, rounded: val as ButtonRounded })}
                    >
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue placeholder="Rounded Shape" />
                      </SelectTrigger>
                      <SelectContent>
                        {ROUNDED_OPTIONS.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value} className="text-xs">
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Background Color & Opacity */}
                  <div className="flex flex-col gap-1.5 rounded-lg border border-border/60 p-2.5">
                    <div className="flex items-center justify-between">
                      <Label className="text-[11px] font-medium">Background Color</Label>
                      <span className="text-[10px] font-mono text-muted-foreground">
                        {item.backgroundOpacity ?? 100}%
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={item.backgroundColor || "#ffffff"}
                        onChange={(e) => update({ ...item, backgroundColor: e.target.value })}
                        className="h-7 w-8 rounded border border-border bg-transparent p-0.5 cursor-pointer"
                      />
                      <Input
                        type="text"
                        value={item.backgroundColor || ""}
                        placeholder="#ffffff"
                        onChange={(e) => update({ ...item, backgroundColor: e.target.value })}
                        className="h-7 text-xs font-mono"
                      />
                    </div>
                    <div className="flex flex-col gap-1 mt-1">
                      <div className="flex justify-between text-[10px] text-muted-foreground">
                        <span>Opacity</span>
                        <span>{item.backgroundOpacity ?? 100}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        step="5"
                        value={item.backgroundOpacity ?? 100}
                        onChange={(e) =>
                          update({ ...item, backgroundOpacity: parseInt(e.target.value) })
                        }
                        className="h-1.5 w-full appearance-none rounded-lg bg-muted accent-primary cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Text Color & Opacity */}
                  <div className="flex flex-col gap-1.5 rounded-lg border border-border/60 p-2.5">
                    <div className="flex items-center justify-between">
                      <Label className="text-[11px] font-medium">Text Color</Label>
                      <span className="text-[10px] font-mono text-muted-foreground">
                        {item.textOpacity ?? 100}%
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={item.textColor || "#000000"}
                        onChange={(e) => update({ ...item, textColor: e.target.value })}
                        className="h-7 w-8 rounded border border-border bg-transparent p-0.5 cursor-pointer"
                      />
                      <Input
                        type="text"
                        value={item.textColor || ""}
                        placeholder="#000000"
                        onChange={(e) => update({ ...item, textColor: e.target.value })}
                        className="h-7 text-xs font-mono"
                      />
                    </div>
                    <div className="flex flex-col gap-1 mt-1">
                      <div className="flex justify-between text-[10px] text-muted-foreground">
                        <span>Opacity</span>
                        <span>{item.textOpacity ?? 100}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        step="5"
                        value={item.textOpacity ?? 100}
                        onChange={(e) =>
                          update({ ...item, textOpacity: parseInt(e.target.value) })
                        }
                        className="h-1.5 w-full appearance-none rounded-lg bg-muted accent-primary cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Hover Background Color */}
                  <div className="flex flex-col gap-1.5 rounded-lg border border-border/60 p-2.5">
                    <Label className="text-[11px] font-medium">Hover Background Color</Label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={item.hoverBackgroundColor || "#f3f4f6"}
                        onChange={(e) => update({ ...item, hoverBackgroundColor: e.target.value })}
                        className="h-7 w-8 rounded border border-border bg-transparent p-0.5 cursor-pointer"
                      />
                      <Input
                        type="text"
                        value={item.hoverBackgroundColor || ""}
                        placeholder="#f3f4f6"
                        onChange={(e) => update({ ...item, hoverBackgroundColor: e.target.value })}
                        className="h-7 text-xs font-mono"
                      />
                    </div>
                  </div>

                  {/* Hover Text Color */}
                  <div className="flex flex-col gap-1.5 rounded-lg border border-border/60 p-2.5">
                    <Label className="text-[11px] font-medium">Hover Text Color</Label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={item.hoverTextColor || "#000000"}
                        onChange={(e) => update({ ...item, hoverTextColor: e.target.value })}
                        className="h-7 w-8 rounded border border-border bg-transparent p-0.5 cursor-pointer"
                      />
                      <Input
                        type="text"
                        value={item.hoverTextColor || ""}
                        placeholder="#000000"
                        onChange={(e) => update({ ...item, hoverTextColor: e.target.value })}
                        className="h-7 text-xs font-mono"
                      />
                    </div>
                  </div>

                  {/* Border Color */}
                  <div className="col-span-2 flex flex-col gap-1.5 rounded-lg border border-border/60 p-2.5">
                    <Label className="text-[11px] font-medium">Border Color & Width</Label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={item.borderColor || "#ffffff"}
                        onChange={(e) => update({ ...item, borderColor: e.target.value })}
                        className="h-7 w-8 rounded border border-border bg-transparent p-0.5 cursor-pointer"
                      />
                      <Input
                        type="text"
                        value={item.borderColor || ""}
                        placeholder="Transparent or #ffffff"
                        onChange={(e) => update({ ...item, borderColor: e.target.value })}
                        className="h-7 text-xs font-mono flex-1"
                      />
                      <Input
                        type="text"
                        value={item.borderWidth || ""}
                        placeholder="1px"
                        onChange={(e) => update({ ...item, borderWidth: e.target.value })}
                        className="h-7 w-20 text-xs font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        }}
      />
    </div>
  )
}
