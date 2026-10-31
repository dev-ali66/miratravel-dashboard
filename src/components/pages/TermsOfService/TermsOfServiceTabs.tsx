import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { Plus } from "lucide-react"
import type { TermsItem } from "./types"

interface TermsOfServiceTabsProps {
  items: TermsItem[]
  activeTab: string
  setActiveTab: (id: string) => void
  onAddSection: () => void
}

export function TermsOfServiceTabs({
  items,
  activeTab,
  setActiveTab,
  onAddSection,
}: TermsOfServiceTabsProps) {
  return (
    <div className="mb-6 space-y-2.5">
      <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-center">
        <Label className="text-xs font-bold tracking-wider text-foreground uppercase">
          Dynamic Document Structure ({items.length} Sections)
        </Label>
        <span className="text-xs text-muted-foreground italic">
          Click a tab to view/edit, or add new sections dynamically
        </span>
      </div>

      <div className="flex flex-wrap gap-2.5 rounded-xl border border-border/40 bg-muted/20 p-2">
        {items.map((item) => {
          const isActive = activeTab === item.id
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "group relative flex min-w-[120px] max-w-[200px] flex-1 cursor-pointer flex-col overflow-hidden rounded-md p-3 text-left transition-all",
                isActive
                  ? "bg-background font-medium text-foreground shadow-sm ring-1 ring-border"
                  : "text-muted-foreground hover:bg-background/50 hover:text-foreground"
              )}
            >
              <span
                className={cn(
                  "mb-1 text-[11px] font-bold tracking-wider uppercase transition-colors",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground group-hover:text-primary"
                )}
              >
                {item.tabTitle}
              </span>
              <span className="line-clamp-2 text-xs leading-snug font-medium">
                {item.fullTitle}
              </span>
            </button>
          )
        })}

        <button
          type="button"
          onClick={onAddSection}
          className="flex min-w-[100px] items-center justify-center gap-1.5 rounded-md border border-dashed border-border/70 p-3 text-xs font-medium text-muted-foreground transition hover:border-primary hover:bg-background/50 hover:text-primary cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>New Section</span>
        </button>
      </div>
    </div>
  )
}
