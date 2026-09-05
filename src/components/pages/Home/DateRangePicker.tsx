import { CalendarIcon, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function DateRangePicker() {
  return (
    <Button
      variant="outline"
      size="sm"
      className="h-9 gap-2 border-border bg-background font-medium shadow-sm transition-all hover:bg-muted/50"
    >
      <CalendarIcon className="size-4 text-muted-foreground" />
      <span>Jan 20 - Feb 09</span>
      <ChevronDown className="ml-1 size-3.5 text-muted-foreground opacity-50" />
    </Button>
  )
}
