import { CalendarIcon, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function DateRangePicker() {
  return (
    <Button 
      variant="outline" 
      size="sm" 
      className="h-9 gap-2 font-medium bg-background hover:bg-muted/50 border-border shadow-sm transition-all"
    >
      <CalendarIcon className="size-4 text-muted-foreground" />
      <span>Jan 20 - Feb 09</span>
      <ChevronDown className="size-3.5 text-muted-foreground opacity-50 ml-1" />
    </Button>
  )
}
