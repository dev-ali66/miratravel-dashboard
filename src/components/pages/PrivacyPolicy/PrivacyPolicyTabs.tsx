import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { Plus } from "lucide-react"
import type { PolicyItem } from "./types"

interface PrivacyPolicyTabsProps {
  items: PolicyItem[]
  activeTab: string
  setActiveTab: (id: string) => void
  onAddItem: () => void
}

export function PrivacyPolicyTabs({
  items,
  activeTab,
  setActiveTab,
  onAddItem,
}: PrivacyPolicyTabsProps) {
  return (
    <div className="mb-6 space-y-2.5">
      <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-center">
        <Label className="text-xs font-bold tracking-wider text-foreground uppercase">
          Document Structure ({items.length} {items.length === 1 ? "Section" : "Sections"})
        </Label>
        <span className="text-xs text-muted-foreground italic">
          Click a section tab below to view and edit its content, or add a new section.
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2 rounded-xl border border-border/40 bg-muted/20 p-2">
        {items.map((item) => {
          const isActive = activeTab === item.id
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "group relative flex min-w-[140px] flex-1 cursor-pointer flex-col overflow-hidden rounded-md p-3 text-left transition-all sm:min-w-[170px]",
                isActive
                  ? "bg-background font-medium text-foreground shadow-sm ring-1 ring-border"
                  : "text-muted-foreground hover:bg-background/50 hover:text-foreground"
              )}
            >
              <span
                className={cn(
                  "mb-0.5 text-xs font-bold tracking-wider uppercase transition-colors",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground group-hover:text-primary"
                )}
              >
                {item.tabTitle || "Untitled"}
              </span>
              <span className="line-clamp-1 text-xs leading-snug font-medium">
                {item.fullTitle || "No Title"}
              </span>
            </button>
          )
        })}

        <button
          type="button"
          onClick={onAddItem}
          className="flex min-w-[110px] items-center justify-center gap-1.5 rounded-md border border-dashed border-border/80 bg-background/40 p-3 text-xs font-medium text-muted-foreground transition-colors hover:border-primary hover:bg-background hover:text-primary cursor-pointer"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>New Section</span>
        </button>
      </div>
    </div>
  )
}
