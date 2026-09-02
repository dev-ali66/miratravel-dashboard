import { Button } from "@/components/ui/button"
import { Loader2, Save } from "lucide-react"

interface SaveBarProps {
  title: string
  description?: string
  onSave: () => void
  isSaving?: boolean
  isLoading?: boolean
}

export function SaveBar({ title, description, onSave, isSaving, isLoading }: SaveBarProps) {
  return (
    <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-border/60 bg-card/95 px-4 py-3 backdrop-blur">
      <div>
        <h2 className="text-sm font-bold text-foreground">{title}</h2>
        {description && <p className="text-[11px] text-muted-foreground">{description}</p>}
      </div>
      <Button
        type="button"
        size="sm"
        className="gap-1.5"
        onClick={onSave}
        disabled={isSaving || isLoading}
      >
        {isSaving ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <Save className="h-3.5 w-3.5" />
        )}
        Save Changes
      </Button>
    </div>
  )
}
