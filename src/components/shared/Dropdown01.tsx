import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { Button } from "../ui/button"
import { useState } from "react"
import { cn } from "@/lib/utils"

export interface Dropdown01Option {
  label: string
  value: string
}

export interface Dropdown01Props {
  options: Dropdown01Option[]
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  triggerClassName?: string
}

export default function Dropdown01({
  options,
  value,
  onChange,
  placeholder = "Select option",
  triggerClassName,
}: Dropdown01Props) {
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger className="cursor-pointer" asChild>
        <Button
          className={cn("cursor-pointer rounded font-medium", triggerClassName)}
          variant={triggerClassName ? "ghost" : "outline"}
        >
          {options.find((s) => s.value === value)?.label || placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-40 rounded border-none p-1 shadow-sm">
        <div className="flex flex-col gap-1">
          {options.map((option) => (
            <button
              type="button"
              key={option.value}
              className={cn(
                "w-full cursor-pointer rounded px-3 py-2 text-left font-medium transition-colors hover:bg-secondary",
                value === option.value && "bg-secondary text-primary"
              )}
              onClick={() => {
                onChange?.(option.value)
                setOpen(false)
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}
